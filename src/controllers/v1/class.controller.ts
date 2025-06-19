import prisma from '../../config/prisma.config';
import { RequestHandler, Request, Response } from 'express';

/**
 * @desc Get all classes
 * @route GET /api/v1/branch/:branch_uuid/classes
 * @access Public
 */
export const index: RequestHandler = async (req: Request, res: Response) => {
  const branch = req.headers['x-branch-session'] as string;
  if (branch) {
    const branch_uuid = branch as string;
    try {
      let classes = await prisma.class.findMany({
        where: {
          branch_uuid,
        },
        include: {
          students: true,
        },
      });

      const classesWithStudentCount = classes.map((cls: any) => ({
        ...cls,
        studentCount: cls.students.length,
      }));

      classes = classesWithStudentCount;

      res.status(200).json({
        status: 200,
        success: true,
        message: 'Classes retrieved successfully',
        data: { classes },
      });
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        success: false,
        message: error.message,
      });
    }
  } else {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Branch UUID is required',
    });
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

  if (branch && name) {
    const branch_uuid = branch as string;
    try {
      const newClass = await prisma.class.create({
        data: {
          name,
          // capacity,
          branch_uuid,
          // teacher_uuid,
        },
      });
      res.status(201).json({
        status: 201,
        success: true,
        message: 'Class created successfully',
        data: { class: newClass },
      });
    } catch (error: any) {
      res.status(400).json({
        status: 400,
        success: false,
        message: error.message,
      });
    }
  } else {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'School UUID and class name are required',
    });
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
  if (uuid) {
    try {
      const classData = await prisma.class.findUnique({
        where: {
          uuid,
        },
      });
      if (!classData) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Class not found',
        });
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
    }
  } else {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'School UUID and class UUID are required',
    });
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
): Promise<any> => {};

/**
 * Delete class
 * @param req
 * @param res
 */
export const remove: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {};
