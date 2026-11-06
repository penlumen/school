import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { DecodedUser } from '../common/types/auth.js';

const INVOICE_STATUSES = [
  'PENDING',
  'PART_PAYMENT',
  'FULL_PAYMENT',
  'CANCELLED',
  'REFUNDED',
] as const;
type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  PENDING: 'Pending',
  PART_PAYMENT: 'Part payment',
  FULL_PAYMENT: 'Full payment',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

interface ItemInput {
  description: string;
  amount: Prisma.Decimal;
  quantity: number;
}

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // ---------- Guards & parsing ----------

  private requireBranch(branchUuid: string | undefined): string {
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }
    return branchUuid;
  }

  private assertStaff(decoded: DecodedUser) {
    if (!['ROOT', 'ADMIN', 'STAFF'].includes(decoded.role)) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }
  }

  /** Admins, and staff in an administrative position, manage billing. */
  private assertManager(decoded: DecodedUser) {
    const allowed =
      ['ROOT', 'ADMIN'].includes(decoded.role) ||
      decoded.position === 'ADMINISTRATIVE';
    if (!allowed) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Only administrators can manage billing',
      });
    }
  }

  private text(value: unknown, max = 500): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim().slice(0, max);
    return trimmed || null;
  }

  private money(value: unknown, field = 'Amount'): Prisma.Decimal {
    const raw = typeof value === 'string' ? value.replace(/,/g, '') : value;
    const num = Number(raw);
    if (raw === '' || raw === null || !Number.isFinite(num) || num < 0) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: `${field} must be a positive number`,
      });
    }
    return new Prisma.Decimal(num.toFixed(2));
  }

  private date(value: unknown): Date | null {
    if (typeof value !== 'string' || !value) return null;
    const parsed = new Date(value.slice(0, 10));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private items(value: unknown, withQuantity = false): ItemInput[] {
    if (!Array.isArray(value)) return [];
    return value
      .map((item: any) => ({
        description: this.text(item?.description, 160) ?? '',
        amount: item?.amount,
        quantity: withQuantity
          ? Math.max(1, Math.min(999, Math.floor(Number(item?.quantity) || 1)))
          : 1,
      }))
      .filter((item) => item.description)
      .slice(0, 50)
      .map((item) => ({
        ...item,
        amount: this.money(item.amount, `Amount for "${item.description}"`),
      }));
  }

  private notFound(message = 'Not found'): never {
    throw new NotFoundException({ status: 404, success: false, message });
  }

  // ---------- Billing templates ----------

  private templateInclude = {
    items: { orderBy: { position: 'asc' as const } },
    _count: { select: { invoices: true } },
  };

  private async findTemplate(uuid: string, branchUuid: string) {
    const template = await this.prisma.billingTemplate.findFirst({
      where: { uuid, branch_uuid: branchUuid },
      include: this.templateInclude,
    });
    return template ?? this.notFound('Template not found');
  }

  async templates(branchUuid: string | undefined, decoded: DecodedUser) {
    this.assertStaff(decoded);
    const templates = await this.prisma.billingTemplate.findMany({
      where: { branch_uuid: this.requireBranch(branchUuid) },
      orderBy: { created_at: 'desc' },
      include: this.templateInclude,
    });
    return {
      status: 200,
      success: true,
      message: 'Billing templates',
      data: { templates },
    };
  }

  async template(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
  ) {
    this.assertStaff(decoded);
    const template = await this.findTemplate(
      uuid,
      this.requireBranch(branchUuid),
    );
    return {
      status: 200,
      success: true,
      message: 'Billing template',
      data: { template },
    };
  }

  async createTemplate(
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    this.assertManager(decoded);
    const branch = this.requireBranch(branchUuid);
    const name = this.text(body?.name, 120);
    if (!name) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Template name is required',
      });
    }
    const items = this.items(body?.items);

    const template = await this.prisma.billingTemplate.create({
      data: {
        branch_uuid: branch,
        name,
        description: this.text(body?.description, 300),
        status: body?.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
        items: {
          create: items.map((item, position) => ({
            description: item.description,
            amount: item.amount,
            position,
          })),
        },
      },
      include: this.templateInclude,
    });

    return {
      status: 201,
      success: true,
      message: 'Template created',
      data: { template },
    };
  }

  /** Updates details; when `items` is sent the fee list is replaced as a whole. */
  async updateTemplate(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    this.assertManager(decoded);
    const branch = this.requireBranch(branchUuid);
    await this.findTemplate(uuid, branch);

    const data: Prisma.BillingTemplateUpdateInput = {};
    if ('name' in body) {
      const name = this.text(body.name, 120);
      if (!name) {
        throw new UnprocessableEntityException({
          status: 422,
          success: false,
          message: 'Template name is required',
        });
      }
      data.name = name;
    }
    if ('description' in body)
      data.description = this.text(body.description, 300);
    if (body.status === 'ACTIVE' || body.status === 'INACTIVE')
      data.status = body.status;

    const items = 'items' in body ? this.items(body.items) : null;

    // A single batched transaction (one request) rather than an interactive
    // one: connection poolers such as Prisma Postgres don't keep an
    // interactive transaction on one connection, and every extra round trip
    // counts towards its timeout.
    const replaceItems = items
      ? [
          this.prisma.billingTemplateItem.deleteMany({
            where: { template_uuid: uuid },
          }),
          this.prisma.billingTemplateItem.createMany({
            data: items.map((item, position) => ({
              template_uuid: uuid,
              description: item.description,
              amount: item.amount,
              position,
            })),
          }),
        ]
      : [];
    const results = await this.prisma.$transaction([
      ...replaceItems,
      this.prisma.billingTemplate.update({
        where: { uuid },
        data,
        include: this.templateInclude,
      }),
    ]);
    const template = results[results.length - 1];

    return {
      status: 200,
      success: true,
      message: 'Template updated',
      data: { template },
    };
  }

  async removeTemplate(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
  ) {
    this.assertManager(decoded);
    await this.findTemplate(uuid, this.requireBranch(branchUuid));
    // Issued invoices keep their copied line items; they just lose the link.
    await this.prisma.billingTemplate.delete({ where: { uuid } });
    return { status: 200, success: true, message: 'Template deleted' };
  }

  // ---------- Invoices ----------

  private invoiceListInclude = {
    student: {
      select: {
        uuid: true,
        name: true,
        reg_number: true,
        class: { select: { name: true } },
        parent: { select: { uuid: true, name: true } },
      },
    },
    template: { select: { uuid: true, name: true } },
  };

  private async findInvoice(uuid: string, branchUuid: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { uuid, branch_uuid: branchUuid },
    });
    return invoice ?? this.notFound('Invoice not found');
  }

  /**
   * INV-YYMM-XXXXXXXX with 32 random bits, so no lookup is needed; the
   * unique index catches the rare clash and the batch is retried.
   */
  private newInvoiceNumber(): string {
    const stamp = new Date().toISOString().slice(2, 7).replace('-', '');
    return `INV-${stamp}-${randomBytes(4).toString('hex').toUpperCase()}`;
  }

  async invoices(branchUuid: string | undefined, decoded: DecodedUser) {
    this.assertStaff(decoded);
    const invoices = await this.prisma.invoice.findMany({
      where: { branch_uuid: this.requireBranch(branchUuid) },
      orderBy: { created_at: 'desc' },
      include: this.invoiceListInclude,
    });
    return {
      status: 200,
      success: true,
      message: 'Invoices',
      data: { invoices },
    };
  }

  async invoice(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
  ) {
    this.assertStaff(decoded);
    const branch = this.requireBranch(branchUuid);
    await this.findInvoice(uuid, branch);

    const invoice = await this.prisma.invoice.findUnique({
      where: { uuid },
      include: {
        items: { orderBy: { position: 'asc' } },
        history: { orderBy: { created_at: 'desc' } },
        template: { select: { uuid: true, name: true } },
        student: {
          select: {
            uuid: true,
            name: true,
            reg_number: true,
            class: { select: { name: true } },
            parent: {
              select: {
                uuid: true,
                name: true,
                email: true,
                contact: true,
                address: true,
              },
            },
          },
        },
        branch: {
          select: {
            name: true,
            email: true,
            contact: true,
            address: true,
            avatar: true,
            school: {
              select: {
                name: true,
                email: true,
                contact: true,
                address: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Invoice',
      data: { invoice },
    };
  }

  /**
   * Creates one invoice per student. Fee items are copied from the template
   * (or taken from `items`), so later template edits never change an issued
   * invoice. Each student's parent is notified.
   */
  async createInvoices(
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    this.assertManager(decoded);
    const branch = this.requireBranch(branchUuid);

    const studentUuids: string[] = [
      ...new Set<string>(
        (Array.isArray(body?.student_uuids)
          ? body.student_uuids
          : [body?.student_uuid]
        ).filter((u: unknown): u is string => typeof u === 'string' && !!u),
      ),
    ];
    if (!studentUuids.length) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Choose at least one student',
      });
    }

    const students = await this.prisma.student.findMany({
      where: { uuid: { in: studentUuids }, branch_uuid: branch },
      select: { uuid: true, name: true, parent_uuid: true },
    });
    if (students.length !== studentUuids.length) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Some students were not found in this branch',
      });
    }

    let templateUuid: string | null = null;
    let items: ItemInput[] = this.items(body?.items, true);
    if (typeof body?.template_uuid === 'string' && body.template_uuid) {
      const template = await this.findTemplate(body.template_uuid, branch);
      templateUuid = template.uuid;
      if (!items.length) {
        items = template.items.map((item) => ({
          description: item.description,
          amount: item.amount,
          quantity: 1,
        }));
      }
    }
    if (!items.length) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Choose a billing template with at least one fee',
      });
    }

    const total = items.reduce(
      (sum, item) => sum.plus(item.amount.times(item.quantity)),
      new Prisma.Decimal(0),
    );
    const dueAt = this.date(body?.due_at);
    const note = this.text(body?.note, 500);

    // Ids are generated here so invoices, their lines and history can be
    // written as three flat inserts in one batched transaction (a single
    // request). See updateTemplate for why this avoids interactive ones.
    const insert = () => {
      const rows = students.map((student) => ({
        uuid: randomUUID(),
        number: this.newInvoiceNumber(),
        branch_uuid: branch,
        student_uuid: student.uuid,
        template_uuid: templateUuid,
        total,
        due_at: dueAt,
        note,
      }));
      return this.prisma
        .$transaction([
          this.prisma.invoice.createMany({ data: rows }),
          this.prisma.invoiceItem.createMany({
            data: rows.flatMap((row) =>
              items.map((item, position) => ({
                invoice_uuid: row.uuid,
                description: item.description,
                amount: item.amount,
                quantity: item.quantity,
                position,
              })),
            ),
          }),
          this.prisma.invoiceStatusChange.createMany({
            data: rows.map((row) => ({
              invoice_uuid: row.uuid,
              status: 'PENDING' as const,
              description: 'Invoice issued',
              created_by_uuid: decoded.uuid,
            })),
          }),
        ])
        .then(() => rows.map((row) => row.uuid));
    };

    let createdUuids: string[] = [];
    for (let attempt = 1; ; attempt++) {
      try {
        createdUuids = await insert();
        break;
      } catch (error: any) {
        // Invoice number clash: extremely unlikely, so simply try again.
        if (error?.code === 'P2002' && attempt < 3) continue;
        throw error;
      }
    }

    const invoices = await this.prisma.invoice.findMany({
      where: { uuid: { in: createdUuids } },
      orderBy: { created_at: 'desc' },
      include: this.invoiceListInclude,
    });

    for (const invoice of invoices) {
      const student = students.find((s) => s.uuid === invoice.student_uuid)!;
      await this.notifications.notifyUsers(
        [student.parent_uuid],
        branch,
        'INVOICE_CREATED',
        'New invoice',
        `Invoice ${invoice.number} for ${student.name} has been issued (₦${Number(total).toLocaleString('en-NG')}).`,
        { excludeUuid: decoded.uuid },
      );
    }

    return {
      status: 201,
      success: true,
      message:
        invoices.length > 1
          ? `${invoices.length} invoices created`
          : 'Invoice created',
      data: { invoices },
    };
  }

  /**
   * Records a status change. For payments the amount is what was received in
   * this update and is added to the amount paid; a refund subtracts it. A part
   * payment that covers the balance becomes a full payment.
   */
  async updateStatus(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    this.assertManager(decoded);
    const existing = await this.findInvoice(
      uuid,
      this.requireBranch(branchUuid),
    );

    let status = body?.status as InvoiceStatus;
    if (!INVOICE_STATUSES.includes(status)) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Choose a valid status',
      });
    }

    const needsAmount = status === 'PART_PAYMENT' || status === 'REFUNDED';
    const amount =
      body?.amount === undefined || body?.amount === null || body?.amount === ''
        ? new Prisma.Decimal(0)
        : this.money(body.amount);
    if (needsAmount && amount.lte(0)) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: `Enter the amount for this ${STATUS_LABEL[status].toLowerCase()}`,
      });
    }

    const total = new Prisma.Decimal(existing.total);
    let paid = new Prisma.Decimal(existing.paid);
    let recorded = amount;

    if (status === 'PART_PAYMENT') {
      paid = paid.plus(amount);
      if (paid.gte(total)) status = 'FULL_PAYMENT';
    } else if (status === 'FULL_PAYMENT') {
      // Paying in full settles the balance; record what was actually outstanding.
      recorded = amount.gt(0) ? amount : total.minus(paid);
      paid = total;
    } else if (status === 'REFUNDED') {
      if (amount.gt(paid)) {
        throw new UnprocessableEntityException({
          status: 422,
          success: false,
          message: 'Refund cannot be more than the amount paid',
        });
      }
      paid = paid.minus(amount);
    }

    const invoice = await this.prisma.invoice.update({
      where: { uuid },
      data: {
        status,
        paid,
        history: {
          create: {
            status,
            amount: recorded,
            description: this.text(body?.description, 300),
            created_by_uuid: decoded.uuid,
          },
        },
      },
      include: this.invoiceListInclude,
    });

    return {
      status: 200,
      success: true,
      message: `Invoice marked as ${STATUS_LABEL[status].toLowerCase()}`,
      data: { invoice },
    };
  }

  async removeInvoice(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
  ) {
    this.assertManager(decoded);
    await this.findInvoice(uuid, this.requireBranch(branchUuid));
    await this.prisma.invoice.delete({ where: { uuid } });
    return { status: 200, success: true, message: 'Invoice deleted' };
  }
}
