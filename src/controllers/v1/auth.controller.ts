import prisma from '../../config/prisma.config';
import { useHashing } from '../../config/hashing';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

export const signUp: RequestHandler = async (
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

export const signIn: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { create } = useMiddleware();
  const { compareHash } = useHashing();
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid email or password',
      });
    } else {
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
    }
  } catch (error: any) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message,
    });
  }
};

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
