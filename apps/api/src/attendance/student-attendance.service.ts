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

@Injectable()
export class StudentAttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertCanMarkClass(classUuid: string, decoded: DecodedUser) {
    const classData = await this.prisma.class.findUnique({
      where: { uuid: classUuid },
    });
    if (!classData) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Class not found',
      });
    }

    const isAdmin = decoded.position === 'ADMINISTRATIVE';
    const isOwnClassTeacher =
      decoded.position === 'ACADEMIC' &&
      classData.teacher_uuid === decoded.uuid;

    if (!isAdmin && !isOwnClassTeacher) {
      throw new ForbiddenException({
        status: 403,
        success: false,
        message:
          "Only an administrator or this class's teacher can mark attendance for it",
      });
    }

    return classData;
  }

  /** Daily attendance log for a class: every student, with their record for the date if one exists. */
  async index(
    classUuid: string,
    dateStr: string | undefined,
    decoded: DecodedUser,
  ) {
    await this.assertCanMarkClass(classUuid, decoded);
    const date = startOfDay(dateStr);

    const [students, records] = await Promise.all([
      this.prisma.student.findMany({
        where: { class_uuid: classUuid },
        orderBy: { name: 'asc' },
      }),
      this.prisma.studentAttendance.findMany({
        where: { class_uuid: classUuid, date },
        include: { marked_by: true },
      }),
    ]);

    const byStudent = new Map(records.map((r) => [r.student_uuid, r]));
    const log = students.map((student) => ({
      student,
      attendance: byStudent.get(student.uuid) || null,
    }));

    return {
      status: 200,
      success: true,
      message: 'Attendance log',
      data: { date, log },
    };
  }

  /** Faces + enrolled descriptors for every student in a class, for client-side matching. */
  async faces(classUuid: string, decoded: DecodedUser) {
    await this.assertCanMarkClass(classUuid, decoded);

    const students = await this.prisma.student.findMany({
      where: {
        class_uuid: classUuid,
        NOT: { face_descriptor: { isEmpty: true } },
      },
      select: {
        uuid: true,
        name: true,
        reg_number: true,
        avatar: true,
        face_descriptor: true,
      },
    });

    return {
      status: 200,
      success: true,
      message: 'Enrolled faces',
      data: { students },
    };
  }

  async mark(
    studentUuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }

    const student = await this.prisma.student.findUnique({
      where: { uuid: studentUuid },
    });
    if (!student) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Student not found',
      });
    }

    await this.assertCanMarkClass(student.class_uuid, decoded);

    const date = startOfDay(body?.date);
    const status: AttendanceStatus = body?.status || 'PRESENT';

    const record = await this.prisma.studentAttendance.upsert({
      where: { student_uuid_date: { student_uuid: studentUuid, date } },
      create: {
        student_uuid: studentUuid,
        branch_uuid: branchUuid,
        class_uuid: student.class_uuid,
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
    const existing = await this.prisma.studentAttendance.findUnique({
      where: { uuid },
    });
    if (!existing) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Attendance record not found',
      });
    }

    await this.assertCanMarkClass(existing.class_uuid, decoded);

    const record = await this.prisma.studentAttendance.update({
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

  /** Full attendance history for one student (across all dates), for their profile's Attendance tab. */
  async history(studentUuid: string, decoded: DecodedUser) {
    const student = await this.prisma.student.findUnique({
      where: { uuid: studentUuid },
    });
    if (!student) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Student not found',
      });
    }

    await this.assertCanMarkClass(student.class_uuid, decoded);

    const records = await this.prisma.studentAttendance.findMany({
      where: { student_uuid: studentUuid },
      orderBy: { date: 'desc' },
    });

    return {
      status: 200,
      success: true,
      message: 'Attendance history',
      data: { attendance: records },
    };
  }
}
