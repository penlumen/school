import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

export const index = async (req: Request, res: Response) => {
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

  const role = req.query.role as 'ROOT' | 'ADMIN' | 'STAFF' | 'PARENT';
  const branch_uuid = req.headers['x-branch-session'] as string;
  if (!branch_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
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
  }
};
