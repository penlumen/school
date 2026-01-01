import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { Request, RequestHandler, Response } from 'express';

const { verifyToken } = useMiddleware();

export const index: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const branch_uuid = req.headers['x-branch-session'] as string;
  const status = req.query.status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined;
  const search = req.query.search as string;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
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

      const classes_names = classes.map(c => c.name);
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

export const view: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const token = req.headers.authorization || null;
  verifyToken(token, res);

  const { result_uuid } = req.params;
  if (!result_uuid) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: 'Result result_uuid is required',
    });
  }

  const result = await prisma.result.findUnique({
    where: {
      uuid: result_uuid,
    },
    include: {
      student: true,
      assessments: true,
    },
  });
  if (!result) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: 'Result not found',
    });
  }
  return res.status(200).json({
    status: 200,
    success: true,
    message: 'Successfully fetched result',
    data: { result },
  });
};

export const show: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const token = req.headers.authorization || null;
  verifyToken(token, res);

  const { student_uuid } = req.params;
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

export const create: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { student_uuid } = req.params;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);

  const student = await prisma.student.findUnique({
    where: { uuid: student_uuid },
    include: {
      class: {
        include: {
          subjects: true,
        },
      },
    },
  });

  if (!student) {
    return res.status(404).json({
      status: 404,
      success: false,
      message: 'Student not found',
    });
  }

  if (decoded.position !== 'ADMINISTRATIVE' || student.class.teacher_uuid !== decoded.uuid) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
  }

  const existingResult = await prisma.result.findFirst({
    where: {
      student_uuid: student!.uuid,
      class_name: student!.class.name,
    },
  });

  if (existingResult) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: `Result already exists for this student in ${
        student!.class.name
      }`,
    });
  }

  const result = await prisma.result.create({
    data: {
      student_uuid: student!.uuid,
      class_name: student!.class.name,
    },
  });

  await prisma.assessments.createMany({
    data: student.class.subjects.map((subject) => ({
      result_uuid: result.uuid,
      subject: subject.name,
    })),
  });

  return res.status(201).json({
    status: 201,
    success: true,
    message: 'Result created successfully',
    data: { result },
  });
};

export const update: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { result_uuid } = req.params;
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
  const isClassTeacher = existing.student && existing.student.class.teacher_uuid === decoded.uuid;

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
      teacher_remark: result?.teacher_remark ?? '',
      principal_remark: result?.principal_remark ?? '',
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

export const remove: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { result_uuid } = req.params;
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
