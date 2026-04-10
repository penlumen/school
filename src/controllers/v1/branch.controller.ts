import prisma from '../../config/prisma.database';
import { useMiddleware } from '../../config/middleware';
import { Request, RequestHandler, Response } from 'express';

const { verifyToken } = useMiddleware();

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
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);

  try {
    const branch_access = await prisma.branchAccess.findMany({
      where: {
        user_uuid: decoded.uuid,
        school_uuid: decoded.school_uuid,
      },
      include: {
        branch: true,
      },
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Branches Access',
      data: { branch_access },
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
  const token = req.headers.authorization || null;
  const { name, email, contact, address } = req.body;
  const decoded = verifyToken(token, res);
  if (decoded.role != 'ADMIN') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (!name) {
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Name is required',
    });
    return;
  }

  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const branch = await tx.branch.create({
        data: {
          name,
          email,
          contact,
          address,
          school_uuid: decoded.school_uuid,
        },
      });

      await tx.branchAccess.create({
        data: {
          role: decoded.role,
          user_uuid: decoded.uuid,
          branch_uuid: branch.uuid,
          school_uuid: decoded.school_uuid,
        },
      });

      return branch;
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Branch created successfully',
      data: { branch: result },
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
  const uuid = Array.isArray(req.params.uuid) ? req.params.uuid[0] : req.params.uuid;
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
    return;
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
  const uuid = Array.isArray(req.params.uuid) ? req.params.uuid[0] : req.params.uuid;
  const token = req.headers.authorization || null;
  const { name, email, contact, address } = req.body;
  const decoded = verifyToken(token, res);
  if (decoded.role != 'ADMIN') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  try {
    const branch = await prisma.branch.update({
      where: { uuid },
      data: {
        name,
        email,
        contact,
        address,
      },
    });

    if (!branch) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'Branch not found',
      });
      return;
    }

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
    return;
  }
};

export const createAccess: RequestHandler = async (
  req: Request,
  res: Response,
) => {
  const token = req.headers.authorization || null;
  const branch_uuid = req.headers['x-branch-session'] as string;
  const { user_uuid } = req.body;
  const decoded = verifyToken(token, res);
  if (decoded.role != 'ADMIN') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (!branch_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (!user_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'User uuid is required',
    });
    return;
  }
  const user = await prisma.user.findUnique({
    where: {
      uuid: user_uuid,
    },
  });

  if (!user) {
    res.status(404).json({
      status: 404,
      success: false,
      message: 'User not found',
    });
    return;
  }

  if (!user.school_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'User does not have a valid school_uuid',
    });
    return;
  }

  await prisma.branchAccess.create({
    data: {
      branch_uuid,
      role: user.role,
      user_uuid: user.uuid,
      school_uuid: user.school_uuid,
    },
  });

  res.status(201).json({
    status: 201,
    success: true,
    message: 'Access created',
  });
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
  const uuid = Array.isArray(req.params.uuid) ? req.params.uuid[0] : req.params.uuid;
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

  try {
    const branch = await prisma.branch.findUnique({
      where: { uuid },
      include: {
        classes: true,
      },
    });

    if (!branch) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'Branch not found',
      });
      return;
    }

    await prisma.grade.deleteMany({
      where: { branch_uuid: uuid },
    });

    if (branch.classes.length > 0) {
      res.status(400).json({
        status: 400,
        success: false,
        message: 'Branch has associated classes and cannot be deleted',
      });
      return;
    }

    await prisma.branchAccess.deleteMany({
      where: {
        branch_uuid: uuid,
        user_uuid: uuid,
      },
    });

    const existingMultipleBranches = await prisma.branchAccess.findMany({
      where: {
        user_uuid: uuid,
        NOT: {
          branch_uuid: uuid,
        },
      },
    });

    if (!existingMultipleBranches || existingMultipleBranches.length === 0) {
      await prisma.user.delete({
        where: { uuid },
      });
    }

    await prisma.branch.delete({
      where: { uuid },
      include: {
        access: true,
        classes: true,
      },
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Branch deleted successfully',
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
