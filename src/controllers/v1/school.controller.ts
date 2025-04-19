import prisma from '../../config/prisma.config';
import { RequestHandler, Request, Response } from 'express';

/**
 * Fetch all schools
 * @description This function fetches all schools from the database.
 * @route GET /api/v1/school
 * @param req
 * @param res
 */
export const index: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auth = '1';
  try {
    const schools = await prisma.school.findMany({
      where: { user_uuid: auth },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'schools',
      data: { schools },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

/**
 * Create a new school
 * @description This function creates a new school in the database.
 * @route POST /api/v1/school
 * @param req
 * @param res
 */
export const create: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const auth = '1';
  const { name, email, contact, address } = req.body;
  try {
    const school = await prisma.school.create({
      data: {
        name,
        email,
        contact,
        address,
        user_uuid: auth,
      },
    });
    res.status(201).json({
      status: 201,
      success: true,
      message: 'School created successfully',
      data: { school },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

/**
 * Fetch a school by UUID
 * @description This function fetches a school by its UUID from the database.
 * @route GET /api/v1/school/:uuid
 * @param req
 * @param res
 */
export const show: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { uuid } = req.params;
  try {
    const schools = await prisma.school.findUnique({
      where: { uuid },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'schools',
      data: { schools },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update a school by UUID
 * @description This function updates a school by its UUID in the database.
 * @route PUT /api/v1/school/:uuid
 * @param req
 * @param res
 */
export const update: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { uuid } = req.params;
  const { name, email, contact, address } = req.body;
  try {
    const school = await prisma.school.update({
      where: { uuid },
      data: {
        name,
        email,
        contact,
        address,
      },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'School updated successfully',
      data: { school },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete a school by UUID
 * @description This function deletes a school by its UUID from the database.
 * @route DELETE /api/v1/school/:uuid
 * @param req
 * @param res
 */
export const remove: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { uuid } = req.params;
  try {
    const school = await prisma.school.delete({
      where: { uuid },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'School deleted successfully',
      data: { school },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};
