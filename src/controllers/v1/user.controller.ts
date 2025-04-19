import prisma from '../../config/prisma.config';
import { useHashing } from '../../config/hashing';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

export const create: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { create } = useMiddleware();
  const { createHash } = useHashing();
  const { email, password } = req.body;
  console.log('data:', { email, password });

  if (!email || !password) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Email and password are required',
    });
    return;
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    res.status(409).json({
      status: 409,
      success: false,
      message: 'Email already exists',
    });
    return;
  }
  const hashPassword = await createHash(password);

  try {
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashPassword,
        },
      });
      if (!user) {
        throw new Error('Error creating user');
      }
      const profile = await prisma.profile.create({
        data: {
          user_uuid: user.uuid,
        },
      });
      return { user, profile };
    });

    const { user } = result;
    const token = create({ user });

    res.status(201).json({
      status: 201,
      success: true,
      message: 'User created successfully',
      data: { token, user },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};
