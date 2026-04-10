import prisma from '../../config/prisma.database';
import { useMiddleware } from '../../config/middleware';
import { Request, RequestHandler, Response } from 'express';

const { verifyToken } = useMiddleware();

/**
 * Get all subjects
 * @route GET /api/v1/subjects
 * @param req
 * @param res
 * @returns
 */
export const index: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const class_uuid = Array.isArray(req.params.clasuuid) ? req.params.clasuuid[0] : req.params.clasuuid;
  const token = req.headers.authorization || null;
  verifyToken(token, res);

  const subjects = await prisma.subject.findMany({
    where: {
      class_uuid,
    },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Subjects retrieved',
    data: { subjects },
  });
};

export const show: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const subject_uuid = Array.isArray(req.params.suuuid) ? req.params.suuuid[0] : req.params.suuuid;
  const token = req.headers.authorization || null;
  verifyToken(token, res);

  const subject = await prisma.subject.findUnique({
    where: { uuid: subject_uuid },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Subject deleted',
    data: { subject },
  });
};

/**
 * Create a new subject
 * @param req
 * @param res
 * @returns
 */
export const create: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
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

  const class_uuid = Array.isArray(req.params.class_uuid) ? req.params.class_uuid[0] : req.params.class_uuid;
  const { name } = req.body;

  if (!name) {
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Name are required',
    });
    return;
  }

  const existingReg = await prisma.subject.findUnique({
    where: {
      class_uuid_name: {
        name,
        class_uuid,
      },
    },
  });

  if (existingReg) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Subject name already taken for this class',
    });
    return;
  }

  const subject = await prisma.subject.create({
    data: {
      name,
      class_uuid,
    },
  });

  res.status(201).json({
    status: 201,
    success: true,
    message: 'Subject created',
    data: { subject },
  });
};

/**
 * Update a subject by ID
 * @param req
 * @param res
 * @returns
 */
export const update: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
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

  const subject_uuid = Array.isArray(req.params.subject_uuid) ? req.params.subject_uuid[0] : req.params.subject_uuid;
  const { name, class_uuid } = req.body;

  if (!name || !class_uuid) {
    res.status(422).json({
      status: 422,
      success: false,
      message: 'Name and class are required',
    });
    return;
  }

  const existingSubject = await prisma.subject.findUnique({
    where: {
      class_uuid_name: {
        name,
        class_uuid,
      },
    },
  });

  if (existingSubject && existingSubject.uuid !== subject_uuid) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Subject name already taken for this class',
    });
    return;
  }

  const subject = await prisma.subject.update({
    where: { uuid: subject_uuid },
    data: {
      name,
      class_uuid,
    },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Subject updated',
    data: { subject },
  });
};

/**
 * Delete a subject by ID
 * @param req
 * @param res
 * @returns
 */
export const remove: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<any> => {
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

  const subject_uuid = Array.isArray(req.params.subject_uuid) ? req.params.subject_uuid[0] : req.params.subject_uuid;
  await prisma.subject.delete({
    where: { uuid: subject_uuid },
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: 'Subject deleted',
  });
};
