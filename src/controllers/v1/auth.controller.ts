import prisma from '../../config/prisma.config';
import { useHashing } from '../../config/hashing';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

/**
 * Session
 * @param req
 * @param res
 */
export const session: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { create } = useMiddleware();
  const { compareHash } = useHashing();
  const { email, password, role, user_uuid } = req.body;

  try {
    let user: any = null;

    switch (role) {
      case 'staff':
        user = await prisma.staff.findUnique({
          where: {
            email,
            user_uuid,
          },
        });
        break;

      case 'parent':
        user = await prisma.parent.findUnique({
          where: {
            email,
            user_uuid,
          },
        });
        break;

      case 'root':
        user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true },
        });
        break;

      default:
        res.status(400).json({
          status: 400,
          success: false,
          message: 'Invalid user role specified',
        });
    }

    if (!user) {
      res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = create({ user });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'User logged in successfully',
      data: { token, user },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message || 'Something went wrong',
    });
  }
};


/**
 * Profile
 * @param req
 * @param res
 * @returns
 */
export const profile: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { verify } = useMiddleware();
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  const decoded = verify(token);
  if (!decoded) {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: decoded.uuid,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'Session terminated',
      });
    } else {
      res.status(200).json({
        status: 200,
        success: true,
        message: 'User profile retrieved successfully',
        data: user,
      });
    }
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};
