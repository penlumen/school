import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { Request, RequestHandler, Response } from 'express';

const { verifyToken } = useMiddleware();

/**
 * @desc Get all classes
 * @route GET /api/v1/branch/:branch_uuid/classes
 * @access Public
 */
export const index: RequestHandler = async (req: Request, res: Response) => {
  const branch_uuid = req.headers['x-branch-session'] as string;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);

  console.log(branch_uuid);
  if (!branch_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  try {
    let classes: any = [];
    if (decoded.position == 'ADMINISTRATIVE') {
      classes = await prisma.class.findMany({
        where: {
          branch_uuid,
        },
        include: {
          students: true,
        },
        orderBy: {
          created_at: 'asc',
        },
      });
    } else {
      classes = await prisma.class.findMany({
        where: {
          branch_uuid,
          teacher_uuid: decoded.uuid,
        },
        include: {
          students: true,
        },
        orderBy: {
          created_at: 'asc',
        },
      });
    }

    const classesWithStudentCount = classes.map((cls: any) => ({
      ...cls,
      studentCount: cls.students.length,
    }));

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Classes retrieved successfully',
      data: { classes: classesWithStudentCount },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
    return;
  }
};

/**
 * @desc Create a new class
 * @route POST /api/v1/schools/:school_uuid/classes
 * @access Public
 */
export const create: RequestHandler = async (req: Request, res: Response) => {
  const branch = req.headers['x-branch-session'] as string;
  const { name, capacity, teacher_uuid } = req.body;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);
  if (decoded.postion != 'ADMINISTRATIVE') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (branch && name) {
    const branch_uuid = branch as string;
    try {
      const result = await prisma.class.create({
        data: {
          name,
          capacity,
          branch_uuid,
          teacher_uuid,
        },
      });
      res.status(201).json({
        status: 201,
        success: true,
        message: 'Class created successfully',
        data: { class: result },
      });
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        success: false,
        message: error.message,
      });
      return;
    }
  } else {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'School UUID and class name are required',
    });
    return;
  }
};

/**
 * Show a class
 * @description This function retrieves a class from the database.
 * @route GET /api/v1/schools/:school_uuid/classes/:class_uuid
 * @param req
 * @param res
 * @returns
 */
export const show: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { uuid } = req.params;
  const token = req.headers.authorization || null;
  verifyToken(token, res);

  if (uuid) {
    try {
      const classData = await prisma.class.findUnique({
        where: {
          uuid,
        },
        include: {
          teacher: true,
          students: true,
        },
      });
      if (!classData) {
        res.status(404).json({
          status: 404,
          success: false,
          message: 'Class not found',
        });
        return;
      }
      res.status(200).json({
        status: 200,
        success: true,
        message: 'Class retrieved successfully',
        data: { class: classData },
      });
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        success: false,
        message: error.message,
      });
      return;
    }
  } else {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'School UUID and class UUID are required',
    });
    return;
  }
};

/**
 * Update class
 * @param req
 * @param res
 */
export const update: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { uuid } = req.params;
  const { name, capacity, teacher_uuid } = req.body;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);
  if (decoded.postion != 'ADMINISTRATIVE') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  try {
    const updatedClass = await prisma.class.update({
      where: { uuid },
      data: {
        name,
        capacity,
        teacher_uuid,
      },
    });

    if (!updatedClass) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Class not found',
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Class updated successfully',
      data: { class: updatedClass },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
    return;
  }
};

/**
 * Delete class
 * @param req
 * @param res
 */
export const remove: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const token = req.headers.authorization || null;
  const { uuid } = req.params;
  const decoded = verifyToken(token, res);
  if (decoded.postion != 'ADMINISTRATIVE') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  try {
    const classWithStudents = await prisma.class.findUnique({
      where: { uuid },
      include: { students: true },
    });

    if (!classWithStudents) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Class not found',
      });
    }

    if (classWithStudents && classWithStudents.students.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Cannot delete class with students enrolled',
      });
    }

    await prisma.class.delete({
      where: { uuid },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
    return;
  }
};
