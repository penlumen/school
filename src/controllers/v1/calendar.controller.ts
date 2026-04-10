import prisma from '../../config/prisma.config';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

const { verifyToken } = useMiddleware();

/**
 * Get all calendars
 * @param req
 * @param res
 * @returns
 */
export const index: RequestHandler = async (req: Request, res: Response) => {
  const branch_uuid = req.headers['x-branch-session'] as string;
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
  const calendars = await prisma.calendar.findMany({
    where: {
      branch_uuid,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Calendars',
    data: { calendars },
  });
};

/**
 * Create a new calendar
 * @route POST /api/v1/calendars
 * @param req
 * @param res
 * @returns
 */
export const create: RequestHandler = async (req: Request, res: Response) => {
  const { session, term, open_date, close_date } = req.body;
  const token = req.headers.authorization || null;

  const decoded = verifyToken(token, res);
  if (decoded.position != 'ADMINISTRATIVE') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (!session || !term || !open_date || !close_date) {
    res.status(422).json({
      status: 422,
      success: false,
      message: 'All fields are required',
    });
  }
  const branch_uuid = req.headers['x-branch-session'] as string;
  if (!branch_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  const result = await prisma.calendar.create({
    data: {
      branch_uuid,
      session,
      term,
      open_date,
      close_date,
    },
  });

  res.status(201).json({
    status: 201,
    success: true,
    message: 'Calendar created',
    data: { calendar: result },
  });
};

/**
 * Update a calendar
 * @route PUT /api/v1/calendars/:id
 * @param req
 * @param res
 * @returns
 */
export const update: RequestHandler = async (req: Request, res: Response) => {
  const uuid = Array.isArray(req.params.uuid) ? req.params.uuid[0] : req.params.uuid;
  const { session, term, open_date, close_date } = req.body;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);
  if (decoded.position != 'ADMINISTRATIVE') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  if (!session || !term || !open_date || !close_date) {
    res.status(422).json({
      status: 422,
      success: false,
      message: 'All fields are required',
    });
  }

  const branch_uuid = req.headers['x-branch-session'] as string;
  if (!branch_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  const existingCalender = await prisma.calendar.findUnique({
    where: { uuid },
  });

  if (!existingCalender) {
    res.status(404).json({
      status: 404,
      success: false,
      message: 'Calendar not found',
    });
    return;
  }

  const result = await prisma.calendar.update({
    where: { uuid },
    data: {
      session,
      term,
      open_date,
      close_date,
    },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Calendar updated',
    data: { calendar: result },
  });
};

/**
 * Remove a calendar
 * @route DELETE /api/v1/calendars/:uuid
 * @param req
 * @param res
 * @returns
 */
export const remove: RequestHandler = async (req: Request, res: Response) => {
  const uuid = Array.isArray(req.params.uuid) ? req.params.uuid[0] : req.params.uuid;
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);
  if (decoded.position != 'ADMINISTRATIVE') {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  const branch_uuid = req.headers['x-branch-session'] as string;
  if (!branch_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Unauthorized',
    });
    return;
  }
  try {
    const calendar = await prisma.calendar.findUnique({
      where: { uuid: uuid },
    });

    if (!calendar) {
      res.status(404).json({
        status: 404,
        success: false,
        message: 'Calendar not found',
      });
      return;
    }

    await prisma.calendar.delete({
      where: { uuid: uuid },
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Calendar deleted',
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: 'Internal server error',
    });
    return;
  }
};
