import prisma from '../../config/prisma.database';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

const { verifyToken } = useMiddleware();

export const cards: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const token = req.headers.authorization || null;
  verifyToken(token, res);

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
      return;
    }
  } else {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized branch',
    });
    return;
  }
};
