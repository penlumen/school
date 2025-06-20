import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

export const cards: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { verifyToken } = useMiddleware();
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthenticated',
      error: 'unauthenticated',
    });
    return;
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Unauthenticated',
      error: 'unauthenticated',
    });
    return;
  }

  const branch = req.headers['x-branch-session'] as string;
  if (branch) {
    const branch_uuid = branch as string;
    try {
      const total_students =
        (await prisma.student.count({
          where: {
            branch_uuid,
          },
        })) || 0;

      const total_parents =
        (await prisma.branchAccess.count({
          where: {
            branch_uuid,
            role: 'PARENT',
          },
        })) || 0;

      const total_staffs =
        (await prisma.branchAccess.count({
          where: {
            branch_uuid,
            OR: [{ role: 'ROOT' }, { role: 'ADMIN' }, { role: 'STAFF' }],
          },
        })) || 0;

      const total_classes =
        (await prisma.class.count({
          where: {
            branch_uuid,
          },
        })) || 0;

      res.status(200).json({
        status: 200,
        success: true,
        message: 'Dashboard',
        data: {
          total_parents,
          total_staffs,
          total_classes,
          total_students,
        },
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
      message: 'Unauthorized branch',
    });
  }
};
