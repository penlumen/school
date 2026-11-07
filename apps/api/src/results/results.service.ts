import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { DecodedUser } from '../common/types/auth.js';
import { AFFECTIVE_SCALE } from '../affective/affective.service.js';

@Injectable()
export class ResultsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

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

  private isAdmin(decoded: DecodedUser) {
    return (
      ['ROOT', 'ADMIN'].includes(decoded.role) ||
      decoded.position === 'ADMINISTRATIVE'
    );
  }

  /**
   * The one rule for every report action: staff who can use the class's
   * branch, and who are either an administrator or one of the class's
   * teachers. Parents use the parent endpoints instead.
   */
  private async canAccessClass(decoded: DecodedUser, classUuid: string) {
    if (!['ROOT', 'ADMIN', 'STAFF'].includes(decoded.role)) return false;
    const klass = await this.prisma.class.findUnique({
      where: { uuid: classUuid },
      select: { branch_uuid: true, teacher_uuid: true, teachers_uuid: true },
    });
    if (!klass) return false;
    const branchAccess = await this.prisma.branchAccess.findFirst({
      where: {
        user_uuid: decoded.uuid,
        branch_uuid: klass.branch_uuid,
        school_uuid: decoded.school_uuid,
      },
      select: { id: true },
    });
    if (!branchAccess) return false;
    return (
      this.isAdmin(decoded) ||
      klass.teacher_uuid === decoded.uuid ||
      klass.teachers_uuid.includes(decoded.uuid)
    );
  }

  private notFound(message = 'Result not found'): never {
    throw new NotFoundException({ status: 404, success: false, message });
  }

  /**
   * Report list for the Reports page. Administrators (ADMIN/ROOT role or an
   * administrative position) see every class in the branch; other staff only
   * the classes they teach (class teacher or one of its teachers). Filters:
   * class, status, term and a name / reg. number search.
   */
  async index(
    branchUuid: string | undefined,
    decoded: DecodedUser,
    query: {
      status?: string;
      class_uuid?: string;
      calendar_uuid?: string;
      search?: string;
      page?: string;
      limit?: string;
    },
  ) {
    if (!branchUuid) {
      throw new BadRequestException({
        success: false,
        message: 'Branch session header is required',
      });
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const status = ['PENDING', 'APPROVED', 'REJECTED'].includes(
      query.status || '',
    )
      ? (query.status as 'PENDING' | 'APPROVED' | 'REJECTED')
      : undefined;
    const search = query.search?.trim();

    const isAdmin = this.isAdmin(decoded);
    // Same rule as single reports: staff of this school with access to the branch.
    const branchAccess = ['ROOT', 'ADMIN', 'STAFF'].includes(decoded.role)
      ? await this.prisma.branchAccess.findFirst({
          where: {
            user_uuid: decoded.uuid,
            branch_uuid: branchUuid,
            school_uuid: decoded.school_uuid,
          },
          select: { id: true },
        })
      : null;

    // The classes this user may see; also offered as the class filter.
    const classes = await this.prisma.class.findMany({
      where: {
        branch_uuid: branchAccess ? branchUuid : '__no_access__',
        ...(isAdmin
          ? {}
          : {
              OR: [
                { teacher_uuid: decoded.uuid },
                { teachers_uuid: { has: decoded.uuid } },
              ],
            }),
      },
      select: { uuid: true, name: true },
      orderBy: { name: 'asc' },
    });
    const allowed = classes.map((c) => c.uuid);
    // A class outside the user's access simply matches nothing.
    const classFilter = query.class_uuid
      ? allowed.includes(query.class_uuid)
        ? [query.class_uuid]
        : []
      : allowed;

    const where = {
      class_uuid: { in: classFilter },
      ...(status && { status }),
      ...(query.calendar_uuid && { calendar_uuid: query.calendar_uuid }),
      student: {
        branch_uuid: branchUuid,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { reg_number: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      },
    };

    const [results, total, counts, terms] = await Promise.all([
      this.prisma.result.findMany({
        where,
        select: {
          uuid: true,
          class_uuid: true,
          class_name: true,
          overall: true,
          status: true,
          approval_requested: true,
          updated_at: true,
          student: {
            select: { uuid: true, name: true, reg_number: true, avatar: true },
          },
          calendar: { select: { uuid: true, session: true, term: true } },
          _count: { select: { assessments: true } },
        },
        orderBy: { updated_at: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prisma.result.count({ where }),
      // Per-status totals for the summary chips, ignoring the status filter.
      this.prisma.result.groupBy({
        by: ['status'],
        where: { ...where, status: undefined },
        _count: { _all: true },
      }),
      this.prisma.calendar.findMany({
        where: { branch_uuid: branchUuid },
        select: { uuid: true, session: true, term: true, status: true },
        orderBy: { created_at: 'desc' },
      }),
    ]);

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
        page,
        limit,
        total,
        counts: Object.fromEntries(
          counts.map((c) => [c.status, c._count._all]),
        ),
        filters: { classes, terms, all_classes: isAdmin },
      },
    };
  }

  async show(studentUuid: string, decoded: DecodedUser) {
    const student = await this.prisma.student.findUnique({
      where: { uuid: studentUuid },
      select: { class_uuid: true },
    });
    // Not found and not allowed look the same, so ids can't be probed.
    if (!student || !(await this.canAccessClass(decoded, student.class_uuid))) {
      this.notFound('Student not found');
    }

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

  /** A report card for staff who can access the report's class. */
  async view(resultUuid: string, decoded: DecodedUser) {
    const result = resultUuid
      ? await this.prisma.result.findUnique({
          where: { uuid: resultUuid },
          select: { class_uuid: true },
        })
      : null;
    if (!result || !(await this.canAccessClass(decoded, result.class_uuid))) {
      this.notFound();
    }
    return this.reportCard(resultUuid);
  }

  /**
   * Builds a report card with grades and class position. No access check:
   * callers must already have checked (staff via view(), parents via the
   * parent module's own-child check).
   */
  async reportCard(resultUuid: string) {
    const result = await this.prisma.result.findUnique({
      where: { uuid: resultUuid },
      include: { student: true, assessments: true, calendar: true },
    });
    if (!result) this.notFound();

    // The grade scale belongs to the report's own branch.
    const grading = await this.prisma.grade.findMany({
      where: { branch_uuid: result.student?.branch_uuid },
      orderBy: { score: 'desc' },
    });

    const classResults = await this.prisma.result.findMany({
      where: {
        class_uuid: result.class_uuid,
        calendar_uuid: result.calendar_uuid,
      },
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

    const average =
      enrichedAssessments.length > 0
        ? result.overall / enrichedAssessments.length
        : 0;

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
        affective: await this.affectiveRows(
          result.uuid,
          result.student?.branch_uuid,
        ),
        affective_scale: AFFECTIVE_SCALE,
        grading_system: grading.map((g) => ({
          grade: g.grade,
          score: g.score,
          remark: g.remark,
        })),
      },
    };
  }

  async create(
    studentUuid: string,
    decoded: DecodedUser,
    calendarUuid?: string,
  ) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { uuid: studentUuid },
        include: { class: { include: { subjects: true } } },
      });

      if (!student) {
        throw new NotFoundException({
          status: 404,
          success: false,
          message: 'Student not found',
        });
      }

      if (!(await this.canAccessClass(decoded, student.class_uuid))) {
        throw new ForbiddenException({
          status: 403,
          success: false,
          message: 'Unauthorized',
        });
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
            : 'No active term set for this branch - set one as active, or pass a specific calendar_uuid',
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
        where: {
          result_uuid: result.uuid,
          subject: { notIn: currentSubjectNames },
        },
      });

      await this.prisma.assessments.createMany({
        data: currentSubjectNames.map((subject) => ({
          result_uuid: result.uuid,
          subject,
        })),
        skipDuplicates: true,
      });

      return {
        status: existingResult ? 200 : 201,
        success: true,
        message: existingResult
          ? 'Result refreshed successfully'
          : 'Result created successfully',
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

  async update(
    resultUuid: string,
    decoded: DecodedUser,
    body: { result?: any; assessments?: any[]; affective?: any[] },
  ) {
    const { result, assessments } = body;

    const existing = await this.prisma.result.findUnique({
      where: { uuid: resultUuid },
      include: { student: { include: { class: true } } },
    });

    if (!existing) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Result not found',
      });
    }

    if (!(await this.canAccessClass(decoded, existing.class_uuid))) {
      throw new ForbiddenException({
        status: 403,
        success: false,
        message: 'Unauthorized',
      });
    }
    const isAdmin = this.isAdmin(decoded);

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
      const overall =
        Number(a.ca_one) + Number(a.ca_two) + Number(a.examination);
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
    if (Array.isArray(body.affective)) {
      await this.saveAffective(
        resultUuid,
        existing.student?.branch_uuid,
        body.affective,
      );
    }

    const updated = await this.prisma.result.update({
      where: { uuid: resultUuid },
      data: {
        overall: total,
        calendar_uuid: result?.calendar,
        approval_requested: isAdmin
          ? existing.approval_requested
          : !!result?.approval_requested,
        // Teacher comments are only submitted as part of an explicit approval
        // request. This keeps ordinary result edits free of a teacher comment.
        teacher_remark: result?.approval_requested
          ? result?.teacher_remark
          : isAdmin
            ? result?.teacher_remark
            : null,
        // Only an administrator can approve a result or write the principal's
        // remark. A staff update cannot change either field.
        ...(isAdmin
          ? {
              status: result?.status,
              principal_remark: result?.principal_remark,
              approval_requested:
                result?.approval_requested ?? existing.approval_requested,
            }
          : {}),
      },
      include: { student: true, assessments: true },
    });

    await this.notifyResultChange(existing, updated, decoded);

    return {
      status: 200,
      success: true,
      message: 'Result updated successfully',
      data: {
        result: {
          ...updated,
          assessments: updated.assessments.map((a) =>
            this.toPlainAssessment(a),
          ),
        },
      },
    };
  }

  /**
   * A teacher newly requesting approval notifies the branch admins; an admin
   * approving/rejecting notifies the class teachers, and on approval the
   * student's parent too.
   */
  private async notifyResultChange(
    before: {
      status: string;
      approval_requested: boolean;
      class_name: string;
      student: {
        name: string;
        branch_uuid: string;
        parent_uuid: string;
        class: { teacher_uuid: string | null; teachers_uuid: string[] };
      } | null;
    },
    after: { status: string; approval_requested: boolean },
    decoded: DecodedUser,
  ) {
    const student = before.student;
    if (!student) return;
    const subject = `${student.name}'s result (${before.class_name})`;

    if (decoded.position !== 'ADMINISTRATIVE') {
      if (after.approval_requested && !before.approval_requested) {
        await this.notifications.notifyBranchAdmins(
          student.branch_uuid,
          'RESULT_APPROVAL_REQUESTED',
          'Result awaiting approval',
          `${subject} has been submitted for approval.`,
          { excludeUuid: decoded.uuid },
        );
      }
      return;
    }

    if (after.status === before.status) return;
    const teachers = [
      student.class.teacher_uuid,
      ...student.class.teachers_uuid,
    ];

    if (after.status === 'APPROVED') {
      await this.notifications.notifyUsers(
        teachers,
        student.branch_uuid,
        'RESULT_APPROVED',
        'Result approved',
        `${subject} has been approved.`,
        { excludeUuid: decoded.uuid },
      );
      await this.notifications.notifyUsers(
        [student.parent_uuid],
        student.branch_uuid,
        'RESULT_PUBLISHED',
        'Result available',
        `${student.name}'s ${before.class_name} result is now available.`,
      );
    } else if (after.status === 'REJECTED') {
      await this.notifications.notifyUsers(
        teachers,
        student.branch_uuid,
        'RESULT_REJECTED',
        'Result rejected',
        `${subject} was rejected and needs to be reviewed.`,
        { excludeUuid: decoded.uuid },
      );
    }
  }

  async remove(resultUuid: string, decoded: DecodedUser) {
    if (!this.isAdmin(decoded)) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Only administrators can delete reports',
      });
    }
    const existing = await this.prisma.result.findUnique({
      where: { uuid: resultUuid },
      select: { class_uuid: true },
    });
    if (
      !existing ||
      !(await this.canAccessClass(decoded, existing.class_uuid))
    ) {
      this.notFound();
    }

    try {
      await this.prisma.assessments.deleteMany({
        where: { result_uuid: resultUuid },
      });
      await this.prisma.result.delete({ where: { uuid: resultUuid } });

      return {
        status: 200,
        success: true,
        message: 'Result deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 500,
        success: false,
        message: 'Failed to delete result',
      });
    }
  }

  /**
   * Saves 1-5 ratings for the branch's affective traits. A null or empty
   * rating clears it. Traits from another branch are ignored.
   */
  private async saveAffective(
    resultUuid: string,
    branchUuid: string | undefined,
    input: any[],
  ) {
    const traits = await this.prisma.affectiveTrait.findMany({
      where: { branch_uuid: branchUuid ?? '' },
      select: { uuid: true, name: true },
    });
    const byUuid = new Map(traits.map((t) => [t.uuid, t.name]));
    const entries = input
      .filter(
        (e) => typeof e?.trait_uuid === 'string' && byUuid.has(e.trait_uuid),
      )
      .map((e) => ({
        trait_uuid: e.trait_uuid as string,
        rating: Number(e.rating),
      }));
    const toSave = entries.filter(
      (e) => Number.isInteger(e.rating) && e.rating >= 1 && e.rating <= 5,
    );

    await this.prisma.$transaction([
      this.prisma.affectiveRating.deleteMany({
        where: {
          result_uuid: resultUuid,
          trait_uuid: { in: entries.map((e) => e.trait_uuid) },
        },
      }),
      this.prisma.affectiveRating.createMany({
        data: toSave.map((e) => ({
          result_uuid: resultUuid,
          trait_uuid: e.trait_uuid,
          trait_name: byUuid.get(e.trait_uuid)!,
          rating: e.rating,
        })),
      }),
    ]);
  }

  /**
   * The branch's current traits in order with this report's ratings, followed
   * by ratings for traits that have since been removed (kept by name).
   */
  private async affectiveRows(
    resultUuid: string,
    branchUuid: string | undefined,
  ) {
    const [traits, ratings] = await Promise.all([
      this.prisma.affectiveTrait.findMany({
        where: { branch_uuid: branchUuid ?? '' },
        orderBy: { position: 'asc' },
        select: { uuid: true, name: true },
      }),
      this.prisma.affectiveRating.findMany({
        where: { result_uuid: resultUuid },
        select: { trait_uuid: true, trait_name: true, rating: true },
      }),
    ]);
    const rated = new Map(ratings.map((r) => [r.trait_uuid, r.rating]));
    return [
      ...traits.map((t) => ({
        trait_uuid: t.uuid,
        name: t.name,
        rating: rated.get(t.uuid) ?? null,
      })),
      ...ratings
        .filter((r) => !r.trait_uuid)
        .map((r) => ({
          trait_uuid: null,
          name: r.trait_name,
          rating: r.rating,
        })),
    ];
  }
}
