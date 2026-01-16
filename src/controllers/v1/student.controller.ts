import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { Request, RequestHandler, Response } from 'express';

const { verifyToken } = useMiddleware();

/**
 * Get all students
 * @route GET /api/v1/students
 * @param req
 * @param res
 * @returns
 */
export const index: RequestHandler = async (req: Request, res: Response): Promise<any> => {
  const branch_uuid = req.headers['x-branch-session'] as string;
  const token = req.headers.authorization || null;

  const decoded = verifyToken(token, res);
  // If verifyToken sends a response on failure, we must stop execution here
  if (!decoded) return;

  if (!branch_uuid) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: 'Branch ID is required',
    });
  }

  try {
    let students: any = [];

    if (decoded.position === 'ADMINISTRATIVE') {
      students = await prisma.student.findMany({
        where: { branch_uuid },
        include: { parent: true, class: true },
        orderBy: { name: 'asc' },
      });
    } else if (decoded.position === 'ACADEMIC') {
      students = await prisma.student.findMany({
        where: {
          branch_uuid,
          class: {
            teacher_uuid: decoded.uuid,
          },
        },
        include: {
          parent: true,
          class: true,
        },
        orderBy: { name: 'asc' },
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Students retrieved successfully',
      data: { students },
    });

  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

export const show: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { uuid } = req.params;
  const token = req.headers.authorization || null;
  verifyToken(token, res);

  const student = await prisma.student.findUnique({
    where: {
      uuid,
    },
    include: {
      parent: true,
      class: true,
    },
  });

  if (!student) {
    res.status(404).json({
      status: 404,
      success: false,
      message: 'Student not found',
    });
    return;
  }

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Student',
    data: { student },
  });
};

/**
 * Create a new student
 * @param req
 * @param res
 * @returns
 */
export const create: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { name, reg_number, parent_uuid, class_uuid } = req.body;
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

/**
 * Get a student by ID
 * @param req
 * @param res
 * @returns
 */
export const update: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { uuid } = req.params;
  const { name, reg_number, parent_uuid, class_uuid } = req.body;
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

  if (existingReg && existingReg.uuid !== uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Registration number already taken',
    });
    return;
  }

  const result = await prisma.student.update({
    where: { uuid },
    data: {
      name,
      reg_number,
      parent_uuid,
      class_uuid,
    },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Student updated',
    data: { student: result },
  });
};

/**
 * Delete a student
 * @param req
 * @param res
 * @returns
 */
export const remove: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { uuid } = req.params;
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
    const student = await prisma.student.findUnique({
      where: { uuid: uuid },
    });

    if (!student) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'Student not found',
      });
      return;
    }

    await prisma.result.deleteMany({
      where: { student_uuid: uuid },
    });

    await prisma.student.delete({
      where: { uuid: uuid },
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Student deleted',
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
