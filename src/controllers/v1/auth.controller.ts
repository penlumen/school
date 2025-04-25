import prisma from '../../config/prisma.config';
import { useHashing } from '../../config/hashing';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

/**
 * Register
 * @param req
 * @param res
 */
export const register: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { createHash } = useHashing();
  const { generateToken, verifyToken } = useMiddleware();
  const { email, password, role } = req.body;

  let currentUser: any = null;
  const token = req.headers.authorization;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      currentUser = await prisma.user.findUnique({
        where: { uuid: decoded.uuid },
      });
    }
  }

  if (!email || !password || !role) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Email, password and role are required',
    });
    return;
  }

  try {
    if (!currentUser) {
      const existingSchool = await prisma.school.findUnique({
        where: { email },
      });
      if (existingSchool) {
        res.status(409).json({
          status: 409,
          success: false,
          message: 'Email already exists',
        });
        return;
      }

      const hashPassword = await createHash(password);
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            password: hashPassword,
          },
        });

        const randomName =
          email.split('@')[0] + Math.floor(Math.random() * 1000);
        const school = await tx.school.create({
          data: {
            email,
            slug: randomName,
            name: randomName,
          },
        });

        await tx.user.update({
          where: { uuid: user.uuid },
          data: { school_uuid: school.uuid },
        });

        return { user, school };
      });

      const { user, school } = result;
      const token = generateToken({
        user: { ...user, school_uuid: result.school.uuid },
      });

      res.status(201).json({
        status: 201,
        success: true,
        message: 'School and Admin User created successfully',
        data: { token, user, school },
      });
    } else {
      if (role.toLowerCase() === 'admin' || role.toLowerCase() === 'root') {
        res.status(403).json({
          status: 403,
          success: false,
          message: 'Cannot create Admin or Root account',
        });
        return;
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          role,
          email,
          school_uuid: currentUser.school_uuid,
        },
      });

      if (existingUser) {
        res.status(409).json({
          status: 409,
          success: false,
          message: 'Email already exists for this school',
        });
        return;
      }

      const hashPassword = await createHash(password);

      const newUser = await prisma.user.create({
        data: {
          role,
          email,
          password: hashPassword,
          school_uuid: currentUser.school_uuid,
        },
      });

      res.status(201).json({
        status: 201,
        success: true,
        message: 'User created successfully',
        data: newUser,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

/**
 * Session
 * @param req
 * @param res
 */
export const session: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { compareHash } = useHashing();
  const { checkSchoolToken, generateToken } = useMiddleware();
  const schoolToken = req.headers.schooltoken as string;
  const { email, password, role } = req.body;

  if (!schoolToken) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Header schoolToken is required',
    });
    return;
  }

  const schoolData = await checkSchoolToken(schoolToken);

  if (!schoolData) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Invalid school token',
    });
    return;
  }

  if (!email || !password || !role) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Email, password, role, and school UUID are required',
    });
    return;
  }

  try {
    let user: any = null;
    user = await prisma.user.findUnique({
      where: {
        school_uuid_email_role: {
          school_uuid: schoolData.uuid,
          email,
          role,
        },
      },
    });

    if (!user) {
      res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        status: 401,
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    const token = generateToken({ user });

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

  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: decoded.uuid,
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
