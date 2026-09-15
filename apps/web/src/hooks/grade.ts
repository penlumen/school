import { axiosInstance } from '@/lib/axios';

export const useGrade = () => {
  const index = async () => {
    const response = await axiosInstance.get('/api/v1/grade/index');
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

  const create = async (gradeData: any) => {
    const response = await axiosInstance.post('/api/v1/grade/create', {
      score: gradeData.score,
      grade: gradeData.grade,
      remark: gradeData.remark,
      description: gradeData.description,
    });
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

  const update = async (uuid: string, gradeData: any) => {
    const response = await axiosInstance.patch(`/api/v1/grade/update/${uuid}`, {
      score: gradeData.score,
      grade: gradeData.grade,
      remark: gradeData.remark,
      description: gradeData.description,
    });
    const data = response.data;

    if (!data.success) {
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

  const remove = async (uuid: string) => {
    const response = await axiosInstance.delete(`/api/v1/grade/delete/${uuid}`);
    const data = response.data;
    if (!data.success) {
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
    index,
    create,
    update,
    remove,
  };
};
