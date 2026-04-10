import jwt from 'jsonwebtoken';
import prisma from './prisma.database';
import { Response } from 'express';

type User = {
  uuid: string;
  role: string;
  email: string;
  position: string;
  school_uuid: string;
};

export const useMiddleware = () => {
  /**
   * Middleware to check if the user is authenticated
   * @param req
   * @param res
   * @param next
   */
  const generateToken = ({ user }: { user: User }) => {
    const token = jwt.sign(
      {
        uuid: user.uuid,
        role: user.role,
        email: user.email,
        position: user.position,
        school_uuid: user.school_uuid,
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' },
    );
    return token;
  };

  /**
   * Middleware to check if the user is authenticated
   * @param req
   * @param res
   * @param next
   */
  const verifyToken = (token: string | null, res: Response) => {
    let decoded: any;
    if (!token) {
      res.status(401).json({
        status: 401,
        success: false,
        message: 'Unauthenticated',
        error: 'unauthenticated',
      });
      return;
    }
    try {
      token = token.split(' ')[1];
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
      if (!decoded) {
        res.status(401).json({
          status: 401,
          success: false,
          message: 'Unauthenticated',
          error: 'unauthenticated',
        });
        return;
      }
      return decoded;
    } catch (error) {
      res.status(401).json({
        status: 401,
        success: false,
        message: 'Unauthenticated',
        error: 'unauthenticated',
      });
      return;
    }
  };

  /**
   * Middleware to check school token
   * @param req
   * @param res
   * @param next
   */
  const checkSchoolToken = (token: string) => {
    const school = prisma.school.findUnique({
      where: {
        token,
      },
    });
    if (!school) {
      return null;
    }
    return school;
  };

  return {
    checkSchoolToken,
    generateToken,
    verifyToken,
  };
};
