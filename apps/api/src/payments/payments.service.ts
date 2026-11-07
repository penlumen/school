import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { OnlinePaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { DecodedUser } from '../common/types/auth.js';
import { decryptSecret, encryptSecret, secretHint } from '../common/secrets.js';
import {
  feeFor,
  keyMode,
  PUBLIC_KEY_PATTERN,
  SECRET_KEY_PATTERN,
  toKobo,
  validSignature,
  verifyTransaction,
} from './paystack.js';

const CURRENCY = 'NGN';

/** Payments that can still turn into money on the invoice. */
const OPEN: OnlinePaymentStatus[] = ['PENDING', 'AWAITING_CONFIRMATION'];

const naira = (amount: Prisma.Decimal | number) =>
  `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // ---------- Guards ----------

  private fail(status: number, message: string): never {
    const Exception =
      status === 404
        ? NotFoundException
        : status === 422
          ? UnprocessableEntityException
          : BadRequestException;
    throw new Exception({ status, success: false, message });
  }

  private assertAdmin(decoded: DecodedUser) {
    if (!['ROOT', 'ADMIN'].includes(decoded.role)) {
      this.fail(400, 'Only school administrators can change payment settings');
    }
  }

  /** Same rule as billing: admins and administrative staff. */
  private assertManager(decoded: DecodedUser) {
    const allowed =
      ['ROOT', 'ADMIN'].includes(decoded.role) ||
      decoded.position === 'ADMINISTRATIVE';
    if (!allowed) this.fail(400, 'Only administrators can manage payments');
  }

  private assertParent(decoded: DecodedUser) {
    if (decoded.role !== 'PARENT') this.fail(400, 'Unauthorized');
  }

  private money(value: unknown): Prisma.Decimal {
    const text = String(value ?? '')
      .replace(/,/g, '')
      .trim();
    if (!/^\d+(\.\d{1,2})?$/.test(text)) {
      this.fail(422, 'Enter a valid amount');
    }
    return new Prisma.Decimal(text);
  }

  // ---------- Settings ----------

  private async school(schoolUuid: string) {
    const school = await this.prisma.school.findUnique({
      where: { uuid: schoolUuid },
      select: {
        uuid: true,
        name: true,
        payments_enabled: true,
        paystack_public_key: true,
        paystack_secret_key: true,
        allow_part_payment: true,
        parent_pays_fees: true,
      },
    });
    return school ?? this.fail(404, 'School not found');
  }

  private settingsView(school: Awaited<ReturnType<PaymentsService['school']>>) {
    const secret = decryptSecret(school.paystack_secret_key);
    return {
      payments_enabled: school.payments_enabled,
      paystack_public_key: school.paystack_public_key,
      has_secret_key: !!secret,
      secret_key_hint: secretHint(secret),
      // A stored key we can no longer decrypt (encryption key changed).
      secret_key_unreadable: !!school.paystack_secret_key && !secret,
      mode: keyMode(school.paystack_public_key),
      verification: secret ? 'automatic' : 'manual',
      allow_part_payment: school.allow_part_payment,
      parent_pays_fees: school.parent_pays_fees,
      webhook_path: `/api/v1/payments/paystack/webhook/${school.uuid}`,
    };
  }

  async settings(decoded: DecodedUser) {
    this.assertAdmin(decoded);
    const school = await this.school(decoded.school_uuid);
    return {
      status: 200,
      success: true,
      message: 'Payment settings',
      data: { settings: this.settingsView(school) },
    };
  }

  async saveSettings(decoded: DecodedUser, body: any) {
    this.assertAdmin(decoded);
    const current = await this.school(decoded.school_uuid);
    const data: Prisma.SchoolUpdateInput = {};

    let publicKey = current.paystack_public_key;
    if ('paystack_public_key' in body) {
      const value = String(body.paystack_public_key ?? '').trim();
      if (value && !PUBLIC_KEY_PATTERN.test(value)) {
        this.fail(422, 'Public key should start with pk_test_ or pk_live_');
      }
      publicKey = value || null;
      data.paystack_public_key = publicKey;
    }

    let secretKey = decryptSecret(current.paystack_secret_key);
    // Undefined keeps the saved key, null or '' removes it.
    if ('paystack_secret_key' in body) {
      const value = String(body.paystack_secret_key ?? '').trim();
      if (value && !SECRET_KEY_PATTERN.test(value)) {
        this.fail(422, 'Secret key should start with sk_test_ or sk_live_');
      }
      secretKey = value || null;
      data.paystack_secret_key = value ? encryptSecret(value) : null;
    }

    if (publicKey && secretKey && keyMode(publicKey) !== keyMode(secretKey)) {
      this.fail(
        422,
        'Use test keys together or live keys together, not one of each',
      );
    }

    for (const field of [
      'payments_enabled',
      'allow_part_payment',
      'parent_pays_fees',
    ] as const) {
      if (field in body) data[field] = body[field] === true;
    }
    const enabled =
      'payments_enabled' in body
        ? body.payments_enabled === true
        : current.payments_enabled;
    if (enabled && !publicKey) {
      this.fail(422, 'Add your Paystack public key to turn on online payments');
    }

    const school = await this.prisma.school.update({
      where: { uuid: decoded.school_uuid },
      data,
      select: {
        uuid: true,
        name: true,
        payments_enabled: true,
        paystack_public_key: true,
        paystack_secret_key: true,
        allow_part_payment: true,
        parent_pays_fees: true,
      },
    });
    return {
      status: 200,
      success: true,
      message: 'Payment settings saved',
      data: { settings: this.settingsView(school) },
    };
  }

  // ---------- Parent checkout ----------

  /** Works out what a parent will pay, without creating anything. */
  private async prepare(invoiceUuid: string, decoded: DecodedUser, body: any) {
    this.assertParent(decoded);
    const invoice = await this.prisma.invoice.findFirst({
      where: {
        uuid: invoiceUuid,
        student: { parent_uuid: decoded.uuid },
        branch: { school_uuid: decoded.school_uuid },
      },
      include: {
        payments: {
          where: { status: 'AWAITING_CONFIRMATION' },
          select: { amount: true },
        },
      },
    });
    if (!invoice) this.fail(404, 'Invoice not found');

    const school = await this.school(decoded.school_uuid);
    if (!school.payments_enabled || !school.paystack_public_key) {
      this.fail(422, 'Online payment is not available yet');
    }
    if (!['PENDING', 'PART_PAYMENT'].includes(invoice.status)) {
      this.fail(422, 'This invoice has nothing left to pay');
    }

    // Payments waiting for staff confirmation count against the balance, so
    // a parent can't pay the same amount twice while they wait.
    const awaiting = invoice.payments.reduce(
      (sum, p) => sum.plus(p.amount),
      new Prisma.Decimal(0),
    );
    const balance = new Prisma.Decimal(invoice.total)
      .minus(invoice.paid)
      .minus(awaiting);
    if (balance.lte(0)) {
      this.fail(
        422,
        'A payment for this invoice is waiting for the school to confirm it',
      );
    }

    const amount =
      body?.amount === undefined || body?.amount === null || body?.amount === ''
        ? balance
        : this.money(body.amount);
    if (amount.lte(0)) this.fail(422, 'Enter an amount above zero');
    if (amount.gt(balance)) {
      this.fail(422, `You can pay at most ${naira(balance)}`);
    }
    if (!school.allow_part_payment && amount.lt(balance)) {
      this.fail(422, 'This school only accepts the full balance online');
    }

    const fee = school.parent_pays_fees
      ? feeFor(amount)
      : new Prisma.Decimal(0);
    return { invoice, school, balance, amount, fee, total: amount.plus(fee) };
  }

  /** Online payment options for a parent's invoice page. */
  async options(decoded: DecodedUser) {
    this.assertParent(decoded);
    const school = await this.school(decoded.school_uuid);
    return {
      status: 200,
      success: true,
      message: 'Payment options',
      data: {
        enabled: school.payments_enabled && !!school.paystack_public_key,
        allow_part_payment: school.allow_part_payment,
        parent_pays_fees: school.parent_pays_fees,
      },
    };
  }

  async quote(invoiceUuid: string, decoded: DecodedUser, body: any) {
    const { balance, amount, fee, total } = await this.prepare(
      invoiceUuid,
      decoded,
      body,
    );
    return {
      status: 200,
      success: true,
      message: 'Quote',
      data: { balance, amount, fee, total, currency: CURRENCY },
    };
  }

  async checkout(invoiceUuid: string, decoded: DecodedUser, body: any) {
    const { invoice, school, amount, fee, total } = await this.prepare(
      invoiceUuid,
      decoded,
      body,
    );
    const reference = `PL-${Date.now().toString(36).toUpperCase()}-${randomBytes(4).toString('hex').toUpperCase()}`;
    const payment = await this.prisma.onlinePayment.create({
      data: {
        reference,
        school_uuid: school.uuid,
        branch_uuid: invoice.branch_uuid,
        invoice_uuid: invoice.uuid,
        user_uuid: decoded.uuid,
        amount,
        fee,
      },
    });
    return {
      status: 200,
      success: true,
      message: 'Checkout ready',
      data: {
        payment: { uuid: payment.uuid, reference },
        paystack: {
          key: school.paystack_public_key,
          email: decoded.email,
          amount: toKobo(total),
          currency: CURRENCY,
          reference,
          metadata: {
            invoice_number: invoice.number,
            invoice_uuid: invoice.uuid,
          },
        },
      },
    };
  }

  /**
   * Called by the parent's browser once Paystack's popup reports success.
   * With a secret key we check with Paystack; without one the browser's word
   * can't be trusted, so the payment waits for staff to confirm it.
   */
  async complete(reference: string, decoded: DecodedUser) {
    this.assertParent(decoded);
    const payment = await this.prisma.onlinePayment.findFirst({
      where: { reference, user_uuid: decoded.uuid },
    });
    if (!payment) this.fail(404, 'Payment not found');

    if (payment.status === 'PENDING') {
      const school = await this.school(payment.school_uuid);
      const secret = decryptSecret(school.paystack_secret_key);
      if (secret) {
        await this.settleFromPaystack(payment.uuid, secret);
      } else {
        const moved = await this.prisma.onlinePayment.updateMany({
          where: { uuid: payment.uuid, status: 'PENDING' },
          data: { status: 'AWAITING_CONFIRMATION' },
        });
        if (moved.count) await this.notifyAwaiting(payment.uuid);
      }
    }

    const updated = await this.prisma.onlinePayment.findUnique({
      where: { uuid: payment.uuid },
    });
    const message: Record<OnlinePaymentStatus, string> = {
      SUCCESS: 'Payment received. Thank you!',
      AWAITING_CONFIRMATION:
        'Payment sent. The school will confirm it shortly.',
      PENDING: 'We are still waiting for Paystack to confirm this payment.',
      FAILED: 'Paystack did not complete this payment.',
      REJECTED: 'The school could not match this payment.',
    };
    return {
      status: 200,
      success: true,
      message: message[updated!.status],
      data: { payment: updated },
    };
  }

  /** The parent closed Paystack's popup without paying. */
  async cancel(reference: string, decoded: DecodedUser) {
    this.assertParent(decoded);
    await this.prisma.onlinePayment.updateMany({
      where: { reference, user_uuid: decoded.uuid, status: 'PENDING' },
      data: { status: 'FAILED', note: 'Closed before paying' },
    });
    return { status: 200, success: true, message: 'Payment cancelled' };
  }

  // ---------- Paystack webhook ----------

  async webhook(
    schoolUuid: string,
    signature: string | undefined,
    rawBody: Buffer | undefined,
    body: any,
  ) {
    const school = await this.prisma.school.findUnique({
      where: { uuid: schoolUuid },
      select: { paystack_secret_key: true },
    });
    const secret = decryptSecret(school?.paystack_secret_key);
    if (!secret || !rawBody || !validSignature(secret, rawBody, signature)) {
      this.fail(400, 'Invalid signature');
    }

    if (body?.event === 'charge.success' && body.data?.reference) {
      const payment = await this.prisma.onlinePayment.findFirst({
        where: {
          reference: String(body.data.reference),
          school_uuid: schoolUuid,
        },
      });
      // Re-verify rather than trusting the payload's amount on its own.
      if (payment && OPEN.includes(payment.status)) {
        await this.settleFromPaystack(payment.uuid, secret);
      }
    }
    return { status: 200, success: true, message: 'Received' };
  }

  // ---------- Staff ----------

  async index(
    branchUuid: string | undefined,
    decoded: DecodedUser,
    status?: string,
  ) {
    this.assertManager(decoded);
    if (!branchUuid) this.fail(400, 'Unauthorized branch');
    const statuses = Object.values(OnlinePaymentStatus) as string[];
    const payments = await this.prisma.onlinePayment.findMany({
      where: {
        branch_uuid: branchUuid,
        ...(status && statuses.includes(status)
          ? { status: status as OnlinePaymentStatus }
          : { status: { not: 'PENDING' } }),
      },
      orderBy: { created_at: 'desc' },
      take: 200,
      include: {
        user: { select: { uuid: true, name: true, email: true } },
        invoice: {
          select: {
            uuid: true,
            number: true,
            total: true,
            paid: true,
            student: { select: { uuid: true, name: true } },
          },
        },
      },
    });
    const school = await this.school(decoded.school_uuid);
    return {
      status: 200,
      success: true,
      message: 'Payments',
      data: {
        payments,
        verification: decryptSecret(school.paystack_secret_key)
          ? 'automatic'
          : 'manual',
      },
    };
  }

  private async staffPayment(uuid: string, branchUuid: string | undefined) {
    if (!branchUuid) this.fail(400, 'Unauthorized branch');
    const payment = await this.prisma.onlinePayment.findFirst({
      where: { uuid, branch_uuid: branchUuid },
    });
    if (!payment) this.fail(404, 'Payment not found');
    if (!OPEN.includes(payment.status)) {
      this.fail(422, 'This payment has already been settled');
    }
    return payment;
  }

  /**
   * Staff confirm a payment they can see in their Paystack dashboard. With a
   * secret key we still ask Paystack first, so a typo can't credit an invoice.
   */
  async confirm(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
  ) {
    this.assertManager(decoded);
    const payment = await this.staffPayment(uuid, branchUuid);
    const school = await this.school(payment.school_uuid);
    const secret = decryptSecret(school.paystack_secret_key);

    if (secret) {
      const state = await this.settleFromPaystack(payment.uuid, secret);
      if (state !== 'SUCCESS') {
        this.fail(
          422,
          state === 'UNREACHABLE'
            ? 'Could not reach Paystack. Try again in a moment.'
            : 'Paystack has no successful payment with this reference',
        );
      }
    } else {
      await this.apply(payment.uuid, {
        verified: false,
        confirmedBy: decoded.uuid,
      });
    }
    return {
      status: 200,
      success: true,
      message: 'Payment confirmed',
      data: {
        payment: await this.prisma.onlinePayment.findUnique({
          where: { uuid },
        }),
      },
    };
  }

  async reject(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    this.assertManager(decoded);
    const payment = await this.staffPayment(uuid, branchUuid);
    const note =
      typeof body?.note === 'string' ? body.note.trim().slice(0, 300) : '';
    await this.prisma.onlinePayment.update({
      where: { uuid },
      data: {
        status: 'REJECTED',
        note: note || 'No matching payment in Paystack',
        confirmed_by_uuid: decoded.uuid,
      },
    });
    if (payment.user_uuid) {
      await this.notifications.notifyUsers(
        [payment.user_uuid],
        payment.branch_uuid,
        'PAYMENT_REJECTED',
        'Payment not confirmed',
        `The school couldn't match your payment ${payment.reference}. ${note || 'Please contact the school.'}`,
      );
    }
    return { status: 200, success: true, message: 'Payment rejected' };
  }

  // ---------- Settling ----------

  /** Checks a payment with Paystack and applies it if Paystack has the money. */
  private async settleFromPaystack(
    paymentUuid: string,
    secret: string,
  ): Promise<OnlinePaymentStatus | 'UNREACHABLE'> {
    const payment = await this.prisma.onlinePayment.findUnique({
      where: { uuid: paymentUuid },
    });
    if (!payment) return 'FAILED';
    const tx = await verifyTransaction(secret, payment.reference);
    if (!tx) return 'UNREACHABLE';

    const expected = toKobo(
      new Prisma.Decimal(payment.amount).plus(payment.fee),
    );
    if (tx.status === 'success') {
      if (tx.currency !== CURRENCY || tx.amount < expected) {
        this.logger.warn(
          `Payment ${payment.reference} amount mismatch: got ${tx.amount} ${tx.currency}, expected ${expected}`,
        );
        await this.prisma.onlinePayment.updateMany({
          where: { uuid: payment.uuid, status: { in: OPEN } },
          data: {
            status: 'AWAITING_CONFIRMATION',
            note: 'Paystack amount did not match; check before confirming',
          },
        });
        return 'AWAITING_CONFIRMATION';
      }
      await this.apply(payment.uuid, {
        verified: true,
        channel: tx.channel,
        paidAt: tx.paid_at ? new Date(tx.paid_at) : new Date(),
      });
      return 'SUCCESS';
    }
    if (['failed', 'abandoned', 'reversed'].includes(tx.status)) {
      await this.prisma.onlinePayment.updateMany({
        where: { uuid: payment.uuid, status: 'PENDING' },
        data: { status: 'FAILED', note: `Paystack: ${tx.status}` },
      });
      return 'FAILED';
    }
    return 'PENDING';
  }

  /**
   * Credits the invoice once. The status update claims the payment, so a
   * webhook and a browser callback arriving together can't apply it twice.
   */
  private async apply(
    paymentUuid: string,
    options: {
      verified: boolean;
      confirmedBy?: string;
      channel?: string | null;
      paidAt?: Date;
    },
  ) {
    const claimed = await this.prisma.onlinePayment.updateMany({
      where: { uuid: paymentUuid, status: { in: OPEN } },
      data: {
        status: 'SUCCESS',
        verified: options.verified,
        confirmed_by_uuid: options.confirmedBy ?? null,
        channel: options.channel ?? null,
        paid_at: options.paidAt ?? new Date(),
      },
    });
    if (!claimed.count) return;

    const payment = await this.prisma.onlinePayment.findUniqueOrThrow({
      where: { uuid: paymentUuid },
      include: {
        invoice: { include: { student: { select: { name: true } } } },
      },
    });
    const total = new Prisma.Decimal(payment.invoice.total);
    const paid = new Prisma.Decimal(payment.invoice.paid).plus(payment.amount);
    const status = paid.gte(total) ? 'FULL_PAYMENT' : 'PART_PAYMENT';

    await this.prisma.invoice.update({
      where: { uuid: payment.invoice_uuid },
      data: {
        paid: { increment: payment.amount },
        status,
        history: {
          create: {
            status,
            amount: payment.amount,
            description: `Paystack ${payment.reference}${options.verified ? '' : ' (confirmed by staff)'}`,
            created_by_uuid: options.confirmedBy ?? payment.user_uuid,
          },
        },
      },
    });

    const summary = `${naira(payment.amount)} for ${payment.invoice.student.name} (${payment.invoice.number})`;
    await this.notifications.notifyUsers(
      [payment.user_uuid],
      payment.branch_uuid,
      'PAYMENT_RECEIVED',
      'Payment received',
      `We received ${summary}. Thank you!`,
    );
    await this.notifications.notifyBranchAdmins(
      payment.branch_uuid,
      'PAYMENT_RECEIVED',
      'Online payment received',
      `${summary} was paid online.`,
    );
  }

  private async notifyAwaiting(paymentUuid: string) {
    const payment = await this.prisma.onlinePayment.findUnique({
      where: { uuid: paymentUuid },
      include: {
        invoice: { include: { student: { select: { name: true } } } },
      },
    });
    if (!payment) return;
    await this.notifications.notifyBranchAdmins(
      payment.branch_uuid,
      'PAYMENT_AWAITING',
      'Payment to confirm',
      `${naira(payment.amount)} for ${payment.invoice.student.name} (${payment.invoice.number}) needs confirming against Paystack. Reference ${payment.reference}.`,
    );
  }
}
