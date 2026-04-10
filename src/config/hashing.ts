import bcrypt from 'bcryptjs';

export const useHashing = () => {
  const createHash = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  const compareHash = async (
    password: string,
    hash: string,
  ): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
  };

  return {
    createHash,
    compareHash,
  };
};
