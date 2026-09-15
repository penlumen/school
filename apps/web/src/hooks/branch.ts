import { axiosInstance } from '@/lib/axios';

export const useBranch = () => {
  const index = async () => {
    const response = await axiosInstance.get('/api/v1/branch/index');
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

  const create = async (branchData: any) => {
    const response = await axiosInstance.post('/api/v1/branch/create', {
      name: branchData.name,
      email: branchData.email,
      contact: branchData.contact,
      address: branchData.address,
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

  const createAccess = async (user_uuid: string) => {
    const response = await axiosInstance.post('/api/v1/branch/create/access', {
      user_uuid,
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

  const update = async (uuid: string, branchData: any) => {
    const response = await axiosInstance.patch(
      `/api/v1/branch/update/${uuid}`,
      {
        name: branchData.name,
        email: branchData.email,
        contact: branchData.contact,
        address: branchData.address,
      }
    );
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

  const remove = async (uuid: string) => {
    const response = await axiosInstance.delete(
      `/api/v1/branch/delete/${uuid}`
    );
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

  const select = async (uuid: string) => {
    const response = await axiosInstance.post(`/api/v1/branch/select/${uuid}`);
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
    createAccess,
    update,
    remove,
    select,
  };
};
