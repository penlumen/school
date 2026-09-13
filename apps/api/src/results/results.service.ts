import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DecodedUser } from '../common/types/auth.js';

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  // Assessments' score columns are Prisma.Decimal now (Assessments.ca_one/ca_two/
  // examination/overall). Decimal serializes to a JSON *string*, which would silently
  // change the API's response shape from number to string. Normalize back to plain
  // numbers here so the response contract stays exactly as it was.
  private toPlainAssessment(a: any) {
    return {
      ...a,
      ca_one: Number(a.ca_one),
      ca_two: Number(a.ca_two),
      examination: Number(a.examination),
      overall: Number(a.overall),
    };
  }

  async index(
    branchUuid: string | undefined,
    decoded: DecodedUser,
    query: { status?: 'PENDING' | 'APPROVED' | 'REJECTED'; search?: string; page?: string; limit?: string },
  ) {
    const status = query.status;
    const search = query.search;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 30;
    const skip = (page - 1) * limit;

    if (!branchUuid) {
      throw new BadRequestException({ success: false, message: 'Branch session header is required' });
    }

    try {
      let results;

      if (decoded.position === 'ADMINISTRATIVE') {
        results = await this.prisma.result.findMany({
          where: {
            ...(status && { status }),
            student: {
              branch_uuid: branchUuid,
              ...(search && {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { reg_number: { contains: search, mode: 'insensitive' } },
                ],
              }),
            },
          },
          include: { student: true, assessments: true },
          orderBy: { created_at: 'desc' },
          take: limit,
          skip,
        });
      } else {
        const classes = await this.prisma.class.findMany({
          where: { teacher_uuid: decoded.uuid },
          select: { name: true },
        });
        const classes_names = classes.map((c) => c.name);

        results = await this.prisma.result.findMany({
          where: {
            ...(status && { status }),
            class_name: { in: classes_names },
            student: {
              branch_uuid: branchUuid,
              ...(search && {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { reg_number: { contains: search, mode: 'insensitive' } },
                ],
              }),
            },
          },
          include: { student: true, assessments: true },
          orderBy: { created_at: 'desc' },
          take: limit,
          skip,
        });
      }

      return {
        success: true,
        data: {
          results: results.map((r: any) => ({
            ...r,
            assessments: r.assessments.map((a: any) => this.toPlainAssessment(a)),
          })),
          page,
          hasMore: results.length === limit,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException({ success: false, message: 'Failed to fetch results' });
    }
  }

  async show(studentUuid: string) {
    try {
      const results = await this.prisma.result.findMany({
        where: { student: { uuid: studentUuid } },
        include: { student: true, assessments: true, calendar: true },
        orderBy: { created_at: 'desc' },
      });

      return {
        status: 200,
        success: true,
        message: 'Successfully fetched results',
        data: {
          results: results.map((r) => ({
            ...r,
            assessments: r.assessments.map((a) => this.toPlainAssessment(a)),
          })),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 500,
        success: false,
        message: 'Failed to fetch results',
      });
    }
  }

  async view(branchUuid: string | undefined, resultUuid: string) {
    if (!resultUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Result uuid is required' });
    }

    const [grading, result] = await Promise.all([
      this.prisma.grade.findMany({ where: { branch_uuid: branchUuid }, orderBy: { score: 'desc' } }),
      this.prisma.result.findUnique({
        where: { uuid: resultUuid },
        include: { student: true, assessments: true, calendar: true },
      }),
    ]);

    if (!result) {
      throw new NotFoundException({ status: 404, success: false, message: 'Result not found' });
    }

    const classResults = await this.prisma.result.findMany({
      where: { class_name: result.class_name, calendar_uuid: result.calendar_uuid },
      select: { uuid: true, overall: true },
      orderBy: { overall: 'desc' },
    });

    const totalStudents = classResults.length;
    const positionIndex = classResults.findIndex((r) => r.uuid === result.uuid);
    const position = positionIndex !== -1 ? positionIndex + 1 : 'N/A';

    const getGradeInfo = (score: number) => {
      const match = grading.find((g) => score >= g.score);
      return { grade: match?.grade || 'F', remark: match?.remark || 'Failed' };
    };

    const enrichedAssessments = result.assessments.map((asm) => {
      const plain = this.toPlainAssessment(asm);
      const total = plain.ca_one + plain.ca_two + plain.examination;
      const { grade, remark } = getGradeInfo(total);
      return { ...plain, total, grade, remark };
    });

    const average = enrichedAssessments.length > 0 ? result.overall / enrichedAssessments.length : 0;

    return {
      status: 200,
      success: true,
      message: 'Successfully fetched result',
      data: {
        result,
        assessments: enrichedAssessments,
        summary: {
          position,
          total_scores: result.overall,
          total_students: totalStudents,
          average: average.toFixed(1),
        },
        grading_system: grading.map((g) => ({ grade: g.grade, score: g.score, remark: g.remark })),
      },
    };
  }

  async create(studentUuid: string, decoded: DecodedUser, calendarUuid?: string) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { uuid: studentUuid },
        include: { class: { include: { subjects: true } } },
      });

      if (!student) {
        throw new NotFoundException({ status: 404, success: false, message: 'Student not found' });
      }

      const isAdmin = decoded.position === 'ADMINISTRATIVE';
      const isClassTeacher = student.class.teacher_uuid === decoded.uuid;

      if (!isAdmin && !isClassTeacher) {
        throw new ForbiddenException({ status: 403, success: false, message: 'Unauthorized' });
      }

      // Default to the branch's active term; an explicit calendar_uuid lets
      // the caller generate a report for a different (non-active) term instead.
      const targetCalendar = calendarUuid
        ? await this.prisma.calendar.findFirst({
            where: { uuid: calendarUuid, branch_uuid: student.branch_uuid },
          })
        : await this.prisma.calendar.findFirst({
            where: { branch_uuid: student.branch_uuid, status: 'ACTIVE' },
          });

      if (!targetCalendar) {
        throw new BadRequestException({
          status: 400,
          success: false,
          message: calendarUuid
            ? 'Selected term was not found for this branch'
            : "No active term set for this branch - set one as active, or pass a specific calendar_uuid",
        });
      }

      const existingResult = await this.prisma.result.findUnique({
        where: {
          calendar_uuid_class_uuid_student_uuid: {
            calendar_uuid: targetCalendar.uuid,
            class_uuid: student.class.uuid,
            student_uuid: student.uuid,
          },
        },
      });

      const result = existingResult
        ? await this.prisma.result.update({
            where: { uuid: existingResult.uuid },
            data: { class_name: student.class.name },
          })
        : await this.prisma.result.create({
            data: {
              calendar_uuid: targetCalendar.uuid,
              class_uuid: student.class.uuid,
              class_name: student.class.name,
              student_uuid: student.uuid,
            },
          });

      const currentSubjectNames = student.class.subjects.map((s) => s.name);

      await this.prisma.assessments.deleteMany({
        where: { result_uuid: result.uuid, subject: { notIn: currentSubjectNames } },
      });

      await this.prisma.assessments.createMany({
        data: currentSubjectNames.map((subject) => ({ result_uuid: result.uuid, subject })),
        skipDuplicates: true,
      });

      return {
        status: existingResult ? 200 : 201,
        success: true,
        message: existingResult ? 'Result refreshed successfully' : 'Result created successfully',
        data: { result },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException({
        status: 500,
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  async update(resultUuid: string, decoded: DecodedUser, body: { result?: any; assessments?: any[] }) {
    const { result, assessments } = body;

    const existing = await this.prisma.result.findUnique({
      where: { uuid: resultUuid },
      include: { student: { include: { class: true } } },
    });

    if (!existing) {
      throw new NotFoundException({ status: 404, success: false, message: 'Result not found' });
    }

    const isAdmin = decoded.position === 'ADMINISTRATIVE';
    const isClassTeacher = existing.student && existing.student.class.teacher_uuid === decoded.uuid;

    if (!isAdmin && !isClassTeacher) {
      throw new ForbiddenException({ status: 403, success: false, message: 'Unauthorized' });
    }

    if (!Array.isArray(assessments)) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'assessments must be an array',
      });
    }

    for (const item of assessments) {
      if (
        !item.uuid ||
        item.ca_one === undefined ||
        item.ca_two === undefined ||
        item.examination === undefined
      ) {
        throw new BadRequestException({
          status: 400,
          success: false,
          message: 'uuid, ca_one, ca_two and examination are required',
        });
      }
    }

    const computedAssessments = assessments.map((a: any) => {
      const overall = Number(a.ca_one) + Number(a.ca_two) + Number(a.examination);
      return {
        uuid: a.uuid,
        ca_one: Number(a.ca_one),
        ca_two: Number(a.ca_two),
        examination: Number(a.examination),
        overall: Number(overall),
      };
    });

    const updates = computedAssessments.map((a) =>
      this.prisma.assessments.update({
        where: { uuid: a.uuid },
        data: {
          ca_one: a.ca_one,
          ca_two: a.ca_two,
          examination: a.examination,
          overall: a.overall,
        },
      }),
    );

    const total = computedAssessments.reduce((sum, a) => sum + a.overall, 0);

    await this.prisma.$transaction(updates);

    const updated = await this.prisma.result.update({
      where: { uuid: resultUuid },
      data: {
        overall: total,
        calendar_uuid: result?.calendar,
        teacher_remark: result?.teacher_remark,
        // Only an administrator can approve a result or write the
        // principal's remark - a class teacher's update() call simply
        // can't move either of these fields, regardless of what's posted.
        ...(isAdmin
          ? {
              status: result?.status,
              principal_remark: result?.principal_remark,
            }
          : {}),
      },
      include: { student: true, assessments: true },
    });

    return {
      status: 200,
      success: true,
      message: 'Result updated successfully',
      data: {
        result: {
          ...updated,
          assessments: updated.assessments.map((a) => this.toPlainAssessment(a)),
        },
      },
    };
  }

  async remove(resultUuid: string, decoded: DecodedUser) {
    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    try {
      await this.prisma.assessments.deleteMany({ where: { result_uuid: resultUuid } });
      await this.prisma.result.delete({ where: { uuid: resultUuid } });

      return { status: 200, success: true, message: 'Result deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 500,
        success: false,
        message: 'Failed to delete result',
      });
    }
  }
}
