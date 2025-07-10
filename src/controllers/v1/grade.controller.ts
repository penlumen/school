import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

const { verifyToken } = useMiddleware();

/**
 * Get all grades
 * @param req
 * @param res
 * @returns
 */
export const index: RequestHandler = async (req: Request, res: Response) => {
  const branch_uuid = req.headers['x-branch-session'] as string;
  const token = req.headers.authorization || null;
  verifyToken(token, res);

  if (!branch_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }
  const grades = await prisma.grade.findMany({
    where: {
      branch_uuid,
    },
    orderBy: {
      score: 'desc',
    },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Grades',
    data: { grades },
  });
};

/**
 * Create a new grade
 * @route POST /api/v1/grades
 * @param req
 * @param res
 * @returns
 */
export const create: RequestHandler = async (req: Request, res: Response) => {
  const { score, grade, remark, description } = req.body;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);
  if (decoded.role != 'ADMIN') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (!score || !grade || !remark) {
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Score, Grade and Remark are required',
    });
  }
  const branch_uuid = req.headers['x-branch-session'] as string;
  if (!branch_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  const result = await prisma.grade.create({
    data: {
      branch_uuid,
      grade,
      score,
      remark,
      description,
    },
  });

  res.status(201).json({
    status: 201,
    success: true,
    message: 'Grade created',
    data: { grade: result },
  });
};

/**
 * Update a grade
 * @route PUT /api/v1/grades/:id
 * @param req
 * @param res
 * @returns
 */
export const update: RequestHandler = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const { score, grade, remark, description } = req.body;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);
  if (decoded.role != 'ADMIN') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (!score || !grade || !remark) {
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Score, Grade and Remark are required',
    });
    return;
  }

  const branch_uuid = req.headers['x-branch-session'] as string;
  if (!branch_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  const existingGrade = await prisma.grade.findUnique({
    where: { uuid },
  });

  if (!existingGrade) {
    res.status(404).json({
      status: 404,
      success: false,
      message: 'Grade not found',
    });
    return;
  }

  const result = await prisma.grade.update({
    where: { uuid },
    data: {
      grade,
      score,
      remark,
      description,
    },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Grade updated',
    data: { grade: result },
  });
};

/**
 * Remove a grade
 * @route DELETE /api/v1/grades/:uuid
 * @param req
 * @param res
 * @returns
 */
export const remove: RequestHandler = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);
  if (decoded.role != 'ADMIN') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  const branch_uuid = req.headers['x-branch-session'] as string;
  if (!branch_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }
  try {
    const grade = await prisma.grade.findUnique({
      where: { uuid: uuid },
    });

    if (!grade) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'Grade not found',
      });
      return;
    }

    await prisma.grade.delete({
      where: { uuid: uuid },
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Grade deleted',
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error',
    });
    return;
  }
};
