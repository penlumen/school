import jwt from 'jsonwebtoken';
import prisma from './prisma.config';

type User = {
  uuid: string;
  email: string;
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
      { uuid: user.uuid, email: user.email, school_uuid: user.school_uuid },
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
  const verifyToken = (token: string | null) => {
    let decoded: any;
    if (!token) {
      return null;
    }
    try {
      token = token.split(' ')[1];
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
      return decoded;
    } catch (error) {
      return null;
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
