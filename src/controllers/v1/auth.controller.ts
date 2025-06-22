import prisma from '../../config/prisma.config';
import { useHashing } from '../../config/hashing';
import { useMiddleware } from '../../config/middleware';
import { RequestHandler, Request, Response } from 'express';

const { createHash, compareHash } = useHashing();
const { generateToken, verifyToken, checkSchoolToken } = useMiddleware();
/**
 * Register
 * @param req
 * @param res
 */
export const register: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, role, email, password } = req.body;

  if (!email || !password || !role) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Email, password and role are required',
    });
    return;
  }

  try {
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
    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          position: 'administrator',
        },
      });

      let generatedName = email.split('@')[0];

      let nameToCheck = generatedName;
      let counter = 1;
      while (await tx.school.findUnique({ where: { slug: nameToCheck } })) {
        nameToCheck = `${generatedName}${counter}`;
        counter++;
      }
      generatedName = nameToCheck;

      const school = await tx.school.create({
        data: {
          email,
          slug: generatedName,
          name: generatedName,
        },
      });

      const branch = await tx.branch.create({
        data: {
          school_uuid: school.uuid,
          name: school.name,
        },
      });

      await tx.branchAccess.create({
        data: {
          role: user.role,
          user_uuid: user.uuid,
          school_uuid: school.uuid,
          branch_uuid: branch.uuid,
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
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

/**
 * Login
 * @param req
 * @param res
 */
export const login: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password, role } = req.body;
  const schoolToken = req.headers['x-school-token'] as string;

  if (!schoolToken) {
    res.status(400).json({
      status: 400,
      success: false,
      message: 'Header SchoolToken is required',
    });
    return;
  }

  const school = await checkSchoolToken(schoolToken);

  if (!school) {
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
      message: 'Email, password, role are required',
    });
    return;
  }

  try {
    let user: any = null;
    console.log(user);
    user = await prisma.user.findUnique({
      where: {
        school_uuid_email_role: {
          school_uuid: school.uuid,
          role: role.toUpperCase(),
          email,
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
    return;
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
  const token = req.headers.authorization || null;
  const decoded = verifyToken(token, res);

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
      return;
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
    return;
  }
};
