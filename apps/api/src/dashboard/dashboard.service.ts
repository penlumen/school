import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CacheService } from '../cache/cache.service.js';

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  /**
   * % change since the current term began: the count when the term opened
   * stands in for last term's total, worked out from created_at timestamps.
   */
  private trend(currentTotal: number, createdThisTerm: number) {
    const previousTotal = currentTotal - createdThisTerm;
    if (previousTotal <= 0) {
      return currentTotal > 0 ? 100 : 0;
    }
    return Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
  }

  async cards(branchUuid: string | undefined) {
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }

    const data = await this.cache.remember(
      `dashboard:cards:${branchUuid}`,
      60,
      async () => {
        // The current term: the active one, else the latest that has opened.
        const term =
          (await this.prisma.calendar.findFirst({
            where: {
              branch_uuid: branchUuid,
              status: 'ACTIVE',
              open_date: { not: null },
            },
            orderBy: { open_date: 'desc' },
          })) ??
          (await this.prisma.calendar.findFirst({
            where: { branch_uuid: branchUuid, open_date: { lte: new Date() } },
            orderBy: { open_date: 'desc' },
          }));
        // Without a term there's nothing to compare with; trends come back null.
        const termStart = term?.open_date ?? new Date(8.64e15);

        const [
          total_students,
          students_this_term,
          total_parents,
          parents_this_term,
          total_staffs,
          staffs_this_term,
          total_classes,
          classes_this_term,
        ] = await Promise.all([
          this.prisma.student.count({ where: { branch_uuid: branchUuid } }),
          this.prisma.student.count({
            where: {
              branch_uuid: branchUuid,
              created_at: { gte: termStart },
            },
          }),
          this.prisma.branchAccess.count({
            where: { branch_uuid: branchUuid, role: 'PARENT' },
          }),
          this.prisma.branchAccess.count({
            where: {
              branch_uuid: branchUuid,
              role: 'PARENT',
              created_at: { gte: termStart },
            },
          }),
          this.prisma.branchAccess.count({
            where: {
              branch_uuid: branchUuid,
              OR: [{ role: 'ROOT' }, { role: 'ADMIN' }, { role: 'STAFF' }],
            },
          }),
          this.prisma.branchAccess.count({
            where: {
              branch_uuid: branchUuid,
              OR: [{ role: 'ROOT' }, { role: 'ADMIN' }, { role: 'STAFF' }],
              created_at: { gte: termStart },
            },
          }),
          this.prisma.class.count({ where: { branch_uuid: branchUuid } }),
          this.prisma.class.count({
            where: {
              branch_uuid: branchUuid,
              created_at: { gte: termStart },
            },
          }),
        ]);

        const trend = (total: number, added: number) =>
          term ? this.trend(total, added) : null;
        return {
          total_parents,
          total_parents_trend: trend(total_parents, parents_this_term),
          total_staffs,
          total_staffs_trend: trend(total_staffs, staffs_this_term),
          total_classes,
          total_classes_trend: trend(total_classes, classes_this_term),
          total_students: total_students || 0,
          total_students_trend: trend(total_students, students_this_term),
          // What the trends compare against, for the dashboard's label.
          trend_term: term
            ? {
                label: [term.term, term.session].filter(Boolean).join(' '),
                started: term.open_date,
              }
            : null,
        };
      },
    );

    return { status: 200, success: true, message: 'Dashboard', data };
  }

  /** Monthly PRESENT-attendance counts (students vs staff) for a given year, for the dashboard chart. */
  async attendancePerformance(
    branchUuid: string | undefined,
    yearParam: string | undefined,
  ) {
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }

    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
    const cacheKey = `dashboard:attendance:${branchUuid}:${year}`;

    const data = await this.cache.remember(cacheKey, 300, async () => {
      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);

      const [studentRecords, staffRecords] = await Promise.all([
        this.prisma.studentAttendance.findMany({
          where: {
            branch_uuid: branchUuid,
            status: 'PRESENT',
            date: { gte: start, lt: end },
          },
          select: { date: true },
        }),
        this.prisma.staffAttendance.findMany({
          where: {
            branch_uuid: branchUuid,
            status: 'PRESENT',
            date: { gte: start, lt: end },
          },
          select: { date: true },
        }),
      ]);

      const studentsByMonth = new Array(12).fill(0);
      const staffByMonth = new Array(12).fill(0);
      studentRecords.forEach(
        (r) => studentsByMonth[new Date(r.date).getMonth()]++,
      );
      staffRecords.forEach((r) => staffByMonth[new Date(r.date).getMonth()]++);

      return MONTH_LABELS.map((month, i) => ({
        month,
        students: studentsByMonth[i],
        staff: staffByMonth[i],
      }));
    });

    return {
      status: 200,
      success: true,
      message: 'Attendance performance',
      data: { year, performance: data },
    };
  }
}
