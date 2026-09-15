import { axiosInstance } from '@/lib/axios';

type LoginResponse = {
  status: number;
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      uuid: string;
      role: string;
      name: string;
      email: string;
      avatar: string;
    };
  };
};

type Role = 'root' | 'admin' | 'staff' | 'parent';

export const useAuth = () => {
  /**
   *
   * @param param0
   * @returns
   */
  const login = async ({
    role,
    email,
    password,
  }: {
    role: Role;
    email: string;
    password: string;
  }) => {
    const response = await axiosInstance.post('/api/v1/login', {
      role,
      email,
      password,
    });

    const data: LoginResponse = response.data;

    if (!data.success || !data.data) {
      return {
        success: false,
        message: data.message || 'Something went wrong',
      };
    } else {
      return {
        success: true,
        message: data.message || 'Login successful',
        data: {
          token: data.data.token,
          user: data.data.user,
        },
      };
    }
  };

  return {
    login,
  };
};
