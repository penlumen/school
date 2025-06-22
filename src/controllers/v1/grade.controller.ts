import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

const { verifyToken } = useMiddleware();

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
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Grades',
    data: { grades },
  });
};

export const create: RequestHandler = async (req: Request, res: Response) => {
  const { score, grade, remark, description } = req.body;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);

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
