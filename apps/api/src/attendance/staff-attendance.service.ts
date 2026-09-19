import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AttendanceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { DecodedUser } from '../common/types/auth.js';

function startOfDay(dateStr?: string): Date {
  const date = dateStr ? new Date(dateStr) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
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
  constructor(private readonly prisma: PrismaService) {}

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

    return {
      status: 200,
      success: true,
      message: 'Attendance updated',
      data: { attendance: record },
    };
  }
}
