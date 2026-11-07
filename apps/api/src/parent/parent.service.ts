import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { ResultsService } from '../results/results.service.js';
import { BillingService } from '../billing/billing.service.js';
import { DecodedUser } from '../common/types/auth.js';

/**
 * Everything a parent can see. Every query is anchored on the signed-in
 * parent's own children (Student.parent_uuid), so a parent can never load
 * another family's records by guessing an id.
 */
@Injectable()
export class ParentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly results: ResultsService,
    private readonly billing: BillingService,
  ) {}

  // ---------- Guards & helpers ----------

  private assertParent(decoded: DecodedUser) {
    if (decoded.role !== 'PARENT') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'This area is for parents only',
      });
    }
  }

  private notFound(message: string): never {
    throw new NotFoundException({ status: 404, success: false, message });
  }

  /** UTC midnight today, matching how attendance and event dates are stored. */
  private today() {
    return new Date(new Date().toISOString().slice(0, 10));
  }

  private daysAgo(days: number) {
    const d = this.today();
    d.setUTCDate(d.getUTCDate() - days);
    return d;
  }

  private wardSelect = {
    uuid: true,
    name: true,
    reg_number: true,
    gender: true,
    avatar: true,
    status: true,
    branch_uuid: true,
    class: { select: { uuid: true, name: true } },
    branch: { select: { uuid: true, name: true } },
  };

  private async findWard(studentUuid: string, decoded: DecodedUser) {
    this.assertParent(decoded);
    const ward = await this.prisma.student.findFirst({
      where: { uuid: studentUuid, parent_uuid: decoded.uuid },
      select: this.wardSelect,
    });
    return ward ?? this.notFound('Child not found');
  }

  private balance(invoice: { status: string; total: unknown; paid: unknown }) {
    if (invoice.status === 'CANCELLED' || invoice.status === 'REFUNDED')
      return 0;
    return Math.max(0, Number(invoice.total) - Number(invoice.paid));
  }

  // ---------- Home ----------

  async overview(decoded: DecodedUser) {
    this.assertParent(decoded);
    const today = this.today();
    const monthAgo = this.daysAgo(30);

    const wards = await this.prisma.student.findMany({
      where: { parent_uuid: decoded.uuid },
      orderBy: { name: 'asc' },
      select: {
        ...this.wardSelect,
        attendance: {
          where: { date: { gte: monthAgo } },
          select: { date: true, status: true },
        },
        results: {
          where: { status: 'APPROVED' },
          orderBy: { created_at: 'desc' },
          take: 1,
          select: {
            uuid: true,
            overall: true,
            _count: { select: { assessments: true } },
            calendar: { select: { session: true, term: true } },
          },
        },
        invoices: {
          select: { status: true, total: true, paid: true, due_at: true },
        },
      },
    });

    const summary = wards.map(({ attendance, results, invoices, ...ward }) => {
      const marked = attendance.filter((a) => a.status !== 'PENDING');
      const present = marked.filter((a) => a.status === 'PRESENT').length;
      const todayRecord = attendance.find(
        (a) => a.date.getTime() === today.getTime(),
      );
      const latest = results[0];
      return {
        ...ward,
        today_attendance: todayRecord?.status ?? null,
        attendance_rate: marked.length
          ? Math.round((present / marked.length) * 100)
          : null,
        latest_result: latest
          ? {
              uuid: latest.uuid,
              overall: latest.overall,
              average: latest._count.assessments
                ? Math.round(
                    (latest.overall / latest._count.assessments) * 10,
                  ) / 10
                : null,
              session: latest.calendar?.session ?? null,
              term: latest.calendar?.term ?? null,
            }
          : null,
        outstanding: invoices.reduce((sum, inv) => sum + this.balance(inv), 0),
      };
    });

    const events = await this.upcomingEvents(
      decoded,
      wards.map((w) => w.branch_uuid),
      5,
    );

    return {
      status: 200,
      success: true,
      message: 'Overview',
      data: {
        wards: summary,
        outstanding: summary.reduce((sum, w) => sum + w.outstanding, 0),
        events,
      },
    };
  }

  // ---------- A child ----------

  async ward(studentUuid: string, decoded: DecodedUser) {
    const ward = await this.findWard(studentUuid, decoded);
    const klass = await this.prisma.class.findUnique({
      where: { uuid: ward.class.uuid },
      select: {
        teacher: { select: { name: true, email: true, contact: true } },
      },
    });
    return {
      status: 200,
      success: true,
      message: 'Child',
      data: { ward: { ...ward, teacher: klass?.teacher ?? null } },
    };
  }

  /** One month of attendance (`month` = YYYY-MM, default this month). */
  async attendance(
    studentUuid: string,
    month: string | undefined,
    decoded: DecodedUser,
  ) {
    const ward = await this.findWard(studentUuid, decoded);
    const key = /^\d{4}-\d{2}$/.test(month || '')
      ? month!
      : new Date().toISOString().slice(0, 7);
    const start = new Date(`${key}-01`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);

    const records = await this.prisma.studentAttendance.findMany({
      where: { student_uuid: ward.uuid, date: { gte: start, lt: end } },
      orderBy: { date: 'asc' },
      select: { date: true, status: true },
    });
    const present = records.filter((r) => r.status === 'PRESENT').length;
    const absent = records.filter((r) => r.status === 'ABSENT').length;

    return {
      status: 200,
      success: true,
      message: 'Attendance',
      data: {
        month: key,
        records: records.map((r) => ({
          date: r.date.toISOString().slice(0, 10),
          status: r.status,
        })),
        summary: {
          present,
          absent,
          rate:
            present + absent
              ? Math.round((present / (present + absent)) * 100)
              : null,
        },
      },
    };
  }

  /** Approved report cards only; drafts and rejected results stay with staff. */
  async wardResults(studentUuid: string, decoded: DecodedUser) {
    const ward = await this.findWard(studentUuid, decoded);
    const results = await this.prisma.result.findMany({
      where: { student_uuid: ward.uuid, status: 'APPROVED' },
      orderBy: { created_at: 'desc' },
      select: {
        uuid: true,
        class_name: true,
        overall: true,
        created_at: true,
        _count: { select: { assessments: true } },
        calendar: { select: { session: true, term: true } },
      },
    });
    return {
      status: 200,
      success: true,
      message: 'Results',
      data: {
        results: results.map(({ _count, ...r }) => ({
          ...r,
          subjects: _count.assessments,
          average: _count.assessments
            ? Math.round((r.overall / _count.assessments) * 10) / 10
            : null,
        })),
      },
    };
  }

  /** The full report card, in the same shape the report page already renders. */
  async result(resultUuid: string, decoded: DecodedUser) {
    this.assertParent(decoded);
    const result = await this.prisma.result.findFirst({
      where: {
        uuid: resultUuid,
        status: 'APPROVED',
        student: { parent_uuid: decoded.uuid },
      },
      select: { student: { select: { branch_uuid: true } } },
    });
    if (!result?.student) this.notFound('Report card not found');
    return this.results.reportCard(resultUuid);
  }

  // ---------- Fees ----------

  async invoices(decoded: DecodedUser, studentUuid?: string) {
    this.assertParent(decoded);
    const invoices = await this.prisma.invoice.findMany({
      where: {
        student: { parent_uuid: decoded.uuid },
        ...(studentUuid ? { student_uuid: studentUuid } : {}),
      },
      orderBy: { issued_at: 'desc' },
      select: {
        uuid: true,
        number: true,
        status: true,
        total: true,
        paid: true,
        issued_at: true,
        due_at: true,
        student: {
          select: { uuid: true, name: true, class: { select: { name: true } } },
        },
        template: { select: { name: true } },
      },
    });
    return {
      status: 200,
      success: true,
      message: 'Invoices',
      data: {
        invoices,
        outstanding: invoices.reduce((sum, inv) => sum + this.balance(inv), 0),
      },
    };
  }

  async invoice(uuid: string, decoded: DecodedUser) {
    this.assertParent(decoded);
    const owned = await this.prisma.invoice.findFirst({
      where: { uuid, student: { parent_uuid: decoded.uuid } },
      select: { uuid: true },
    });
    if (!owned) this.notFound('Invoice not found');
    const [invoice, online_payments] = await Promise.all([
      this.billing.invoiceDetail(uuid),
      // Online payments still waiting on the school, or that it turned down.
      this.prisma.onlinePayment.findMany({
        where: {
          invoice_uuid: uuid,
          user_uuid: decoded.uuid,
          status: { in: ['AWAITING_CONFIRMATION', 'REJECTED'] },
        },
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          uuid: true,
          reference: true,
          amount: true,
          status: true,
          note: true,
          created_at: true,
        },
      }),
    ]);
    return {
      status: 200,
      success: true,
      message: 'Invoice',
      data: { invoice, online_payments },
    };
  }

  // ---------- Calendar ----------

  /**
   * Events a parent should see: public ones, ones tagged to all parents in
   * their children's branches, and ones they were tagged in personally.
   */
  private async upcomingEvents(
    decoded: DecodedUser,
    branchUuids: string[],
    take?: number,
    from?: Date,
  ) {
    return this.prisma.event.findMany({
      where: {
        date: { gte: from ?? this.today() },
        OR: [
          { is_public: true, branch: { school_uuid: decoded.school_uuid } },
          { tag_all_parents: true, branch_uuid: { in: branchUuids } },
          { tags: { some: { user_uuid: decoded.uuid } } },
        ],
      },
      orderBy: [{ date: 'asc' }, { start_time: 'asc' }],
      take,
      select: {
        uuid: true,
        title: true,
        description: true,
        date: true,
        start_time: true,
        end_time: true,
        location: true,
        branch: { select: { uuid: true, name: true } },
        calendar: { select: { uuid: true, session: true, term: true } },
      },
    });
  }

  async calendar(decoded: DecodedUser) {
    this.assertParent(decoded);
    const wards = await this.prisma.student.findMany({
      where: { parent_uuid: decoded.uuid },
      select: { branch_uuid: true },
    });
    const branchUuids = [...new Set(wards.map((w) => w.branch_uuid))];

    const [events, terms] = await Promise.all([
      this.upcomingEvents(decoded, branchUuids, undefined, this.daysAgo(30)),
      this.prisma.calendar.findMany({
        where: { branch_uuid: { in: branchUuids }, status: 'ACTIVE' },
        select: {
          uuid: true,
          session: true,
          term: true,
          open_date: true,
          close_date: true,
          next_term_resumption_date: true,
          branch: { select: { name: true } },
        },
      }),
    ]);

    return {
      status: 200,
      success: true,
      message: 'Calendar',
      data: { events, terms },
    };
  }
}
