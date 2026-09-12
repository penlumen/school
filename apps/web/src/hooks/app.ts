import { axiosInstance } from '@/lib/axios';

export const useApp = () => {
  const dashboard = async (): Promise<any> => {
    const response = await axiosInstance.get('/api/v1/dashboard/cards');
    const data = response.data;

    if (!data.success || !data.data) {
      return {
        success: false,
        message: data.message || 'Something went wrong',
      };
    } else {
      return {
        success: true,
        data: data.data,
      };
    }
  };

  return {
    dashboard,
  };
};
