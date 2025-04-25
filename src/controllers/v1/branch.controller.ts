import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

/**
 * Fetch all branches
 * @description This function fetches all branches from the database.
 * @route GET /api/v1/branch
 * @param req
 * @param res
 */
export const index: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { verifyToken } = useMiddleware();
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  try {
    const branches = await prisma.branch.findMany({
      where: { uuid: decoded.school_uuid },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Branches',
      data: { branches },
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
 * Create a new branch
 * @description This function creates a new branch in the database.
 * @route POST /api/v1/branch
 * @param req
 * @param res
 */
export const create: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { verifyToken } = useMiddleware();
  const token = req.headers.authorization;
  const { name, email, contact, address } = req.body;

  if (!token) {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  try {
    const branch = await prisma.branch.create({
      data: {
        name,
        contact,
        school_uuid: decoded.school_uuid,
      },
    });
    res.status(201).json({
      status: 201,
      success: true,
      message: 'Branch created successfully',
      data: { branch },
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
 * Fetch a branch by UUID
 * @description This function fetches a branch by its UUID from the database.
 * @route GET /api/v1/branch/:uuid
 * @param req
 * @param res
 */
export const show: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { uuid } = req.params;
  try {
    const branch = await prisma.branch.findUnique({
      where: { uuid },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'branch',
      data: { branch },
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
 * Update a branch by UUID
 * @description This function updates a branch by its UUID in the database.
 * @route PUT /api/v1/branch/:uuid
 * @param req
 * @param res
 */
export const update: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { uuid } = req.params;
  const { name, contact, address } = req.body;
  try {
    const branch = await prisma.branch.update({
      where: { uuid },
      data: {
        name,
        contact,
        address,
      },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Branch updated successfully',
      data: { branch },
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
 * Delete a branch by UUID
 * @description This function deletes a branch by its UUID from the database.
 * @route DELETE /api/v1/branch/:uuid
 * @param req
 * @param res
 */
export const remove: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { uuid } = req.params;
  try {
    const branch = await prisma.branch.delete({
      where: { uuid },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Branch deleted successfully',
      data: { branch },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};
