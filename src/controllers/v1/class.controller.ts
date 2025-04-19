import { promises } from 'dns';
import prisma from '../../config/prisma.config';
import e, { RequestHandler, Request, Response } from 'express';

/**
 * @desc Get all classes
 * @route GET /api/v1/schools/:school_uuid/classes
 * @access Public
 */
export const index: RequestHandler = async (req: Request, res: Response) => {
  const { school } = req.headers;
  if (school) {
    const school_uuid = school as string;
    try {
      const classes = await prisma.class.findMany({
        where: {
          school_uuid,
        },
      });
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
      message: 'School UUID is required',
    });
  }
};

/**
 * @desc Create a new class
 * @route POST /api/v1/schools/:school_uuid/classes
 * @access Public
 */
export const create: RequestHandler = async (req: Request, res: Response) => {
  const { school } = req.headers;
  const { name } = req.body;

  if (school && name) {
    const school_uuid = school as string;
    try {
      const newClass = await prisma.class.create({
        data: {
          school_uuid,
          name,
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
  const { school } = req.headers;
  const { class_uuid } = req.params;
  if (school || class_uuid) {
    const school_uuid = school as string;
    try {
      const classData = await prisma.class.findUnique({
        where: {
          school_uuid,
          uuid: class_uuid,
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

export const update: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {};

export const remove: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {};
