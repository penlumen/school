import jwt from 'jsonwebtoken';

type User = {
  uuid: string;
  email: string;
};

export const useMiddleware = () => {
  const create = ({ user }: { user: User }) => {
    const token = jwt.sign(
      { uuid: user.uuid, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' },
    );
    return token;
  };

  const verify = (token: string) => {
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
      return decoded;
    } catch (error) {
      return null;
    }
  };

  return {
    create,
    verify,
  };
};
