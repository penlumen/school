import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';
import { useHashing } from '../../config/hashing';

const { createHash } = useHashing();
const { verifyToken } = useMiddleware();

/**
 * Get all users in a branch
 * @route GET /api/v1/users
 * @param req
 * @param res
 * @returns
 */
export const index: RequestHandler = async (req: Request, res: Response) => {
  const branch_uuid = req.headers['x-branch-session'] as string;
  const role = req.query.role as 'STAFF' | 'PARENT';
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

  if (role) {
    let user;
    if (role == 'STAFF') {
      user = await prisma.branchAccess.findMany({
        where: {
          branch_uuid,
          OR: [{ role: 'ROOT' }, { role: 'ADMIN' }, { role: 'STAFF' }],
        },
        include: {
          user: true,
        },
      });
    } else {
      user = await prisma.branchAccess.findMany({
        where: {
          role,
          branch_uuid,
        },
        include: {
          user: true,
        },
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Success',
      data: { user },
    });
  } else {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Invalid role',
    });
    return;
  }
};

/**
 * Create a new user
 * @route POST /api/v1/users
 * @param req
 * @param res
 * @returns
 */
export const create: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    name,
    role,
    email,
    password,
    position,
    address,
    contact,
    alt_contact,
  } = req.body;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);

  const currentUser = await prisma.user.findUnique({
    where: { uuid: decoded.uuid },
  });

  if (!currentUser) {
    res.status(404).json({
      status: 404,
      success: false,
      message: 'User not found',
    });
    return;
  }

  if (decoded.role != 'ADMIN') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (!email || !password || !role || !name || !position) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Email, password, role, name and position are required',
    });
    return;
  }

  try {
    if (role.toUpperCase() === 'ROOT' || role.toUpperCase() === 'ADMIN') {
      res.status(403).json({
        status: 403,
        success: false,
        message: 'Cannot create Admin or Root account',
      });
      return;
    }

    const branch_uuid = req.headers['x-branch-session'] as string;
    if (!branch_uuid) {
      res.status(400).json({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        role: role.toUpperCase(),
        school_uuid: currentUser.school_uuid,
      },
    });

    const existingInCurrentBranch = await prisma.branchAccess.findFirst({
      where: {
        branch_uuid,
        user_uuid: existingUser?.uuid,
      },
    });

    if (existingUser && !existingInCurrentBranch) {
      res.status(200).json({
        status: 200,
        success: false,
        message:
          'This staff member already exists in the school records. Would you like to add them to this branch?',
        data: {
          user_uuid: existingUser.uuid,
        },
      });
      return;
    } else if (existingUser) {
      res.status(400).json({
        status: 400,
        success: false,
        message:
          'This staff member already exists in the school records and current branch.',
      });
      return;
    }

    const formatRole = role.toUpperCase();
    const hashPassword = await createHash(password);
    const result = await prisma.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          address,
          contact,
          position,
          alt_contact,
          role: formatRole,
          password: hashPassword,
          school_uuid: currentUser.school_uuid,
        },
      });

      if (newUser) {
        await tx.branchAccess.create({
          data: {
            branch_uuid,
            role: newUser.role,
            user_uuid: newUser.uuid,
            school_uuid: currentUser.school_uuid,
          },
        });
      }

      return newUser;
    });

    const newUser = result;

    res.status(201).json({
      status: 201,
      success: true,
      message: 'User created successfully',
      data: { newUser },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
    return;
  }
};

/**
 * Update a user
 * @route PUT /api/v1/users/:uuid
 * @param req
 * @param res
 * @returns
 */
export const update: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { uuid } = req.params;
  const { name, email, password, position, address, contact, alt_contact } =
    req.body;
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

  if (!uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'User UUID is required',
    });
    return;
  }

  if (!email || !name || !position) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Email, role, name and position are required',
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { uuid },
    });

    if (!user) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'User not found',
      });
      return;
    }

    const branch_uuid = req.headers['x-branch-session'] as string;
    if (!branch_uuid) {
      res.status(400).json({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: { uuid },
    });

    if (!existingUser) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'This user does not exist in the school records.',
      });
      return;
    }
    const hashPassword = password ? await createHash(password) : user.password;
    const updatedUser = await prisma.user.update({
      where: { uuid },
      data: {
        name,
        email,
        address,
        contact,
        position,
        alt_contact,
        password: hashPassword,
      },
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
    return;
  }
};

/**
 * Remove a user
 * @route DELETE /api/v1/users/:uuid
 * @param req
 * @param res
 * @returns
 */
export const remove: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token = req.headers.authorization || null;
  const { uuid } = req.params;
  const decoded = verifyToken(token, res);
  if (decoded.role != 'ADMIN') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (!uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'User UUID is required',
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { uuid },
      include: {
        access: true,
        heading: true,
        students: true,
      },
    });

    if (!user) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'User not found',
      });
      return;
    } else if (user.heading.length > 0) {
      res.status(400).json({
        status: 400,
        success: false,
        message: 'User has associated classes and cannot be deleted',
      });
      return;
    } else if (user.students.length > 0) {
      res.status(400).json({
        status: 400,
        success: false,
        message: 'User has associated students and cannot be deleted',
      });
    }

    if (
      user.role.toUpperCase() === 'ROOT' ||
      user.role.toUpperCase() === 'ADMIN'
    ) {
      res.status(403).json({
        status: 403,
        success: false,
        message: 'Cannot delete Admin or Root account',
      });
      return;
    }

    const branch_uuid = req.headers['x-branch-session'] as string;
    if (!branch_uuid) {
      res.status(400).json({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
      return;
    }

    await prisma.branchAccess.deleteMany({
      where: {
        branch_uuid,
        user_uuid: uuid,
      },
    });

    const existingMultipleBranches = await prisma.branchAccess.findMany({
      where: {
        user_uuid: uuid,
        NOT: {
          branch_uuid,
        },
      },
    });

    if (!existingMultipleBranches || existingMultipleBranches.length === 0) {
      await prisma.user.delete({
        where: { uuid },
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
    return;
  }
};
