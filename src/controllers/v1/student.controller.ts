import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

const { verifyToken } = useMiddleware();

export const create: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { name, reg_number, parent_uuid, class_uuid } = req.body;
  const token = req.headers.authorization || null;
  verifyToken(token, res);

  if (!name || !parent_uuid || !class_uuid || !reg_number) {
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Name, Parent, class and Registration number are required',
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

  const existingReg = await prisma.student.findUnique({
    where: {
      branch_uuid_reg_number: {
        branch_uuid,
        reg_number,
      },
    },
  });

  if (existingReg) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Registration number already taken',
    });
    return;
  }

  const result = await prisma.student.create({
    data: {
      name,
      reg_number,
      parent_uuid,
      branch_uuid,
      class_uuid,
    },
  });

  res.status(201).json({
    status: 201,
    success: true,
    message: 'Student created',
    data: { student: result },
  });
};

export const index: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
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

  const students = await prisma.student.findMany({
    where: {
      branch_uuid,
    },
    include: {
      parent: true,
      class: true,
    },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Students',
    data: { students },
  });
};
