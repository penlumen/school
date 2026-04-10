import prisma from '../../config/prisma.database';
import { useMiddleware } from '../../config/middleware';
import { Request, RequestHandler, Response } from 'express';

const { verifyToken } = useMiddleware();

/**
 * List all results
 * @param req
 * @param res
 */
export const index: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const branch_uuid = req.headers['x-branch-session'] as string;
  const status = req.query.status as
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | undefined;
  const search = req.query.search as string;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);

  if (!branch_uuid) {
    return res.status(400).json({
      success: false,
      message: 'Branch session header is required',
    });
  }

  try {
    let results;

    if (decoded.position === 'ADMINISTRATIVE') {
      results = await prisma.result.findMany({
        where: {
          ...(status && { status }),
          student: {
            branch_uuid,
            ...(search && {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  reg_number: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }),
          },
        },
        include: {
          student: true,
          assessments: true,
        },
        orderBy: { created_at: 'desc' },
        take: limit,
        skip,
      });
    } else {
      const classes = await prisma.class.findMany({
        where: { teacher_uuid: decoded.uuid },
        select: { name: true },
      });

      const classes_names = classes.map((c) => c.name);
      results = await prisma.result.findMany({
        where: {
          ...(status && { status }),
          class_name: { in: classes_names },
          student: {
            branch_uuid,
            ...(search && {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  reg_number: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              ],
            }),
          },
        },
        include: {
          student: true,
          assessments: true,
        },
        orderBy: { created_at: 'desc' },
        take: limit,
        skip,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        results,
        page,
        hasMore: results.length === limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch results',
    });
  }
};

/**
 * A student results
 * @param req
 * @param res
 */
export const show: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const token = req.headers.authorization || null;
  verifyToken(token, res);

  const student_uuid = Array.isArray(req.params.student_uuid)
    ? req.params.student_uuid[0]
    : req.params.student_uuid;
  try {
    const results = await prisma.result.findMany({
      where: {
        student: {
          uuid: student_uuid,
        },
      },
      include: {
        student: true,
        assessments: true,
      },
    });
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Successfully fetched results',
      data: { results },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'Failed to fetch results',
    });
  }
};

/**
 * Result details
 * @param req
 * @param res
 */
export const view: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const token = req.headers.authorization || null;
  verifyToken(token, res);

  const branch_uuid = req.headers['x-branch-session'] as string;
  const result_uuid = Array.isArray(req.params.result_uuid)
    ? req.params.result_uuid[0]
    : req.params.result_uuid;

  if (!result_uuid) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: 'Result uuid is required',
    });
  }

  // 1. Fetch the specific result and the grading system
  const [grading, result] = await Promise.all([
    prisma.grade.findMany({
      where: { branch_uuid },
      orderBy: { score: 'desc' },
    }),
    prisma.result.findUnique({
      where: { uuid: result_uuid },
      include: {
        student: true,
        assessments: true,
        calendar: true,
      },
    }),
  ]);

  if (!result) {
    return res
      .status(404)
      .json({ status: 404, success: false, message: 'Result not found' });
  }

  // 2. Fetch all results in the same class and session to calculate Position
  const classResults = await prisma.result.findMany({
    where: {
      class_name: result.class_name,
      calendar_uuid: result.calendar_uuid,
    },
    select: {
      uuid: true,
      overall: true,
    },
    orderBy: {
      overall: 'desc',
    },
  });

  // 3. Calculate Position and Total Students
  const totalStudents = classResults.length;
  // Position is the index in the sorted list + 1
  const positionIndex = classResults.findIndex((r) => r.uuid === result.uuid);
  const position = positionIndex !== -1 ? positionIndex + 1 : 'N/A';

  // 4. Helper for Grade logic
  const getGradeInfo = (score: number) => {
    const match = grading.find((g) => score >= g.score);
    return {
      grade: match?.grade || 'F',
      remark: match?.remark || 'Failed',
    };
  };

  // 5. Compute assessments with Grades
  const enrichedAssessments = result.assessments.map((asm) => {
    const total =
      Number(asm.assignment) + Number(asm.assessment) + Number(asm.examination);
    const { grade, remark } = getGradeInfo(total);
    return {
      ...asm,
      total,
      grade,
      remark,
    };
  });

  const average =
    enrichedAssessments.length > 0
      ? result.overall / enrichedAssessments.length
      : 0;

  // 6. Return payload matching report card requirements
  return res.status(200).json({
    status: 200,
    success: true,
    message: 'Successfully fetched result',
    data: {
      result: result,
      assessments: enrichedAssessments,
      summary: {
        position: position,
        total_scores: result.overall,
        total_students: totalStudents,
        average: average.toFixed(1),
      },
      grading_system: grading.map((g) => ({
        grade: g.grade,
        score: g.score,
        remark: g.remark,
      })),
    },
  });
};

/**
 * Generate/Refresh result
 * @param req
 * @param res
 */
export const create: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const student_uuid = Array.isArray(req.params.student_uuid)
      ? req.params.student_uuid[0]
      : req.params.student_uuid;
    const token = req.headers.authorization || null;
    const decoded = verifyToken(token, res);

    const student = await prisma.student.findUnique({
      where: { uuid: student_uuid },
      include: {
        class: { include: { subjects: true } },
      },
    });

    if (!student) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: 'Student not found' });
    }

    // Authorization Check
    const isAdmin = decoded.position === 'ADMINISTRATIVE';
    const isClassTeacher = student.class.teacher_uuid === decoded.uuid;

    if (!isAdmin && !isClassTeacher) {
      return res
        .status(403)
        .json({ status: 403, success: false, message: 'Unauthorized' });
    }

    const calendar = await prisma.calendar.findFirst({
      where: {
        branch_uuid: student.branch_uuid,
      },
      orderBy: { created_at: 'desc' },
    });

    if (!calendar) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "No active calendar found for the student's branch",
      });
    }

    console.log({ calendar_uuid: calendar.uuid, class_name: student.class.name, student_uuid: student.uuid });

    const result = await prisma.result.upsert({
      where: {
        calendar_uuid_class_name_student_uuid: {
          calendar_uuid: calendar.uuid,
          class_name: student.class.name,
          student_uuid: student.uuid,
        },
      },
      update: {
        class_name: student.class.name,
      },
      create: {
        calendar_uuid: calendar.uuid,
        class_uuid: student.class.uuid,
        class_name: student.class.name,
        student_uuid: student.uuid,
      },
    });

    const currentSubjectNames = student.class.subjects.map((s) => s.name);

    await prisma.$transaction([
      prisma.assessments.deleteMany({
        where: {
          result_uuid: result.uuid,
          subject: {
            notIn: currentSubjectNames,
          },
        },
      }),

      ...student.class.subjects.map((subject) =>
        prisma.assessments.upsert({
          where: {
            result_uuid_subject: {
              result_uuid: result.uuid,
              subject: subject.name,
            },
          },
          update: {},
          create: {
            result_uuid: result.uuid,
            subject: subject.name,
          },
        }),
      ),
    ]);

    const existingResult = await prisma.result.findUnique({
      where: {
        calendar_uuid_class_name_student_uuid: {
          calendar_uuid: calendar.uuid,
          class_name: student.class.name,
          student_uuid: student.uuid,
        },
      },
    });

    if (existingResult) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Result refreshed successfully',
        data: { result },
      });
    }

    return res.status(201).json({
      status: 201,
      success: true,
      message: 'Result created successfully',
      data: { result },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, success: false, message: 'Internal Server Error' });
  }
};

/**
 * Update result data
 * @param req
 * @param res
 */
export const update: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const result_uuid = Array.isArray(req.params.result_uuid)
    ? req.params.result_uuid[0]
    : req.params.result_uuid;
  const { result, assessments } = req.body;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);

  const existing = await prisma.result.findUnique({
    where: { uuid: result_uuid },
    include: {
      student: {
        include: {
          class: true,
        },
      },
    },
  });

  if (!existing) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: 'Result not found',
    });
  }

  const isAdmin = decoded.position === 'ADMINISTRATIVE';
  const isClassTeacher =
    existing.student && existing.student.class.teacher_uuid === decoded.uuid;

  if (!isAdmin && !isClassTeacher) {
    return res.status(403).json({
      status: 403,
      success: false,
      message: 'Unauthorized',
    });
  }

  if (!Array.isArray(assessments)) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: 'assessments must be an array',
    });
  }

  for (const item of assessments) {
    if (
      !item.uuid ||
      item.assignment === undefined ||
      item.assessment === undefined ||
      item.examination === undefined
    ) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'uuid, assignment, assessment and examination are required',
      });
    }
  }

  const computedAssessments = assessments.map((a: any) => {
    const overall =
      Number(a.assignment) + Number(a.assessment) + Number(a.examination);

    return {
      uuid: a.uuid,
      assignment: Number(a.assignment),
      assessment: Number(a.assessment),
      examination: Number(a.examination),
      overall: Number(overall),
    };
  });

  const updates = computedAssessments.map((a) =>
    prisma.assessments.update({
      where: { uuid: a.uuid },
      data: {
        assignment: a.assignment,
        assessment: a.assessment,
        examination: a.examination,
        overall: a.overall,
      },
    }),
  );

  const total = computedAssessments.reduce((sum, a) => sum + a.overall, 0);
  // const average = total / computedAssessments.length;

  await prisma.$transaction(updates);

  const updated = await prisma.result.update({
    where: { uuid: result_uuid },
    data: {
      overall: total,
      calendar_uuid: result?.calendar,
      teacher_remark: result?.teacher_remark,
      principal_remark: result?.principal_remark,
    },
    include: {
      student: true,
      assessments: true,
    },
  });

  return res.status(200).json({
    status: 200,
    success: true,
    message: 'Result updated successfully',
    data: { result: updated },
  });
};

/**
 * Delete result data
 * @param req
 * @param res
 */
export const remove: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const result_uuid = Array.isArray(req.params.result_uuid)
    ? req.params.result_uuid[0]
    : req.params.result_uuid;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);
  if (decoded.position != 'ADMINISTRATIVE') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  try {
    await prisma.assessments.deleteMany({
      where: { result_uuid },
    });

    await prisma.result.delete({
      where: { uuid: result_uuid },
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Result deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: 'Failed to delete result',
    });
  }
};
