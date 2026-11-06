import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttendanceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { DecodedUser } from '../common/types/auth.js';

function startOfDay(dateStr?: string): Date {
  const date = dateStr ? new Date(dateStr) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Parses `YYYY-MM` into a [start, end) date range, or returns undefined when absent. */
function monthRange(month?: string): { gte: Date; lt: Date } | undefined {
  if (!month) return undefined;
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) {
    throw new BadRequestException({
      status: 400,
      success: false,
      message: 'Month must be in YYYY-MM format',
    });
  }
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  return {
    gte: new Date(Date.UTC(year, monthIndex, 1)),
    lt: new Date(Date.UTC(year, monthIndex + 1, 1)),
  };
}

function assertIsAdmin(decoded: DecodedUser) {
  if (decoded.position !== 'ADMINISTRATIVE') {
    throw new ForbiddenException({
      status: 403,
      success: false,
      message: 'Only an administrator can mark staff attendance',
    });
  }
}

@Injectable()
export class StaffAttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  /** Tells a staff member when they've been marked absent (only on the transition, not repeats). */
  private async notifyIfAbsent(
    previousStatus: AttendanceStatus | undefined,
    record: {
      staff_uuid: string;
      branch_uuid: string;
      status: AttendanceStatus;
      date: Date;
    },
  ) {
    if (record.status !== 'ABSENT' || previousStatus === 'ABSENT') return;
    await this.notifications.notifyUsers(
      [record.staff_uuid],
      record.branch_uuid,
      'ATTENDANCE_STAFF_ABSENT',
      'Absence recorded',
      `You were marked absent on ${formatDate(record.date)}. Contact an administrator if this is incorrect.`,
    );
  }

  async index(
    branchUuid: string | undefined,
    dateStr: string | undefined,
    decoded: DecodedUser,
  ) {
    assertIsAdmin(decoded);
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }

    const date = startOfDay(dateStr);

    const [staffAccess, records] = await Promise.all([
      this.prisma.branchAccess.findMany({
        where: {
          branch_uuid: branchUuid,
          OR: [{ role: 'ADMIN' }, { role: 'STAFF' }],
        },
        include: { user: true },
      }),
      this.prisma.staffAttendance.findMany({
        where: { branch_uuid: branchUuid, date },
        include: { marked_by: true },
      }),
    ]);

    const byStaff = new Map(records.map((r) => [r.staff_uuid, r]));
    const log = staffAccess.map((access) => ({
      staff: access.user,
      attendance: byStaff.get(access.user_uuid) || null,
    }));

    return {
      status: 200,
      success: true,
      message: 'Staff attendance log',
      data: { date, log },
    };
  }

  async faces(branchUuid: string | undefined, decoded: DecodedUser) {
    assertIsAdmin(decoded);
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }

    const staffAccess = await this.prisma.branchAccess.findMany({
      where: {
        branch_uuid: branchUuid,
        OR: [{ role: 'ADMIN' }, { role: 'STAFF' }],
        user: { NOT: { face_descriptor: { isEmpty: true } } },
      },
      include: {
        user: {
          select: {
            uuid: true,
            name: true,
            avatar: true,
            face_descriptor: true,
          },
        },
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Enrolled faces',
      data: { staff: staffAccess.map((a) => a.user) },
    };
  }

  /** Attendance history for one staff member in this branch — all dates, or a single month (YYYY-MM). */
  async history(
    staffUuid: string,
    branchUuid: string | undefined,
    month: string | undefined,
    decoded: DecodedUser,
  ) {
    assertIsAdmin(decoded);
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }
    const dateRange = monthRange(month);

    const records = await this.prisma.staffAttendance.findMany({
      where: {
        staff_uuid: staffUuid,
        branch_uuid: branchUuid,
        date: dateRange,
      },
      orderBy: { date: 'desc' },
    });

    return {
      status: 200,
      success: true,
      message: 'Attendance history',
      data: { attendance: records },
    };
  }

  async mark(
    staffUuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    assertIsAdmin(decoded);
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }

    const staff = await this.prisma.user.findUnique({
      where: { uuid: staffUuid },
    });
    if (!staff) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Staff not found',
      });
    }

    const date = startOfDay(body?.date);
    const status: AttendanceStatus = body?.status || 'PRESENT';

    const previous = await this.prisma.staffAttendance.findUnique({
      where: { staff_uuid_date: { staff_uuid: staffUuid, date } },
    });
    const record = await this.prisma.staffAttendance.upsert({
      where: { staff_uuid_date: { staff_uuid: staffUuid, date } },
      create: {
        staff_uuid: staffUuid,
        branch_uuid: branchUuid,
        date,
        status,
        marked_by_uuid: decoded.uuid,
      },
      update: { status, marked_by_uuid: decoded.uuid },
    });

    await this.notifyIfAbsent(previous?.status, record);

    return {
      status: 201,
      success: true,
      message: 'Attendance marked',
      data: { attendance: record },
    };
  }

  async update(uuid: string, decoded: DecodedUser, body: any) {
    assertIsAdmin(decoded);

    const existing = await this.prisma.staffAttendance.findUnique({
      where: { uuid },
    });
    if (!existing) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Attendance record not found',
      });
    }

    const record = await this.prisma.staffAttendance.update({
      where: { uuid },
      data: { status: body?.status, marked_by_uuid: decoded.uuid },
    });

    await this.notifyIfAbsent(existing.status, record);

    return {
      status: 200,
      success: true,
      message: 'Attendance updated',
      data: { attendance: record },
    };
  }
}
