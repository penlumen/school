import { axiosInstance } from '@/lib/axios';

export const useStudent = () => {
  const index = async () => {
    const response = await axiosInstance.get('/api/v1/student/index');
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

  const show = async (uuid: string) => {
    const response = await axiosInstance.get(`/api/v1/student/show/${uuid}`);
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

  /** The number the next new student would get, from the branch prefix (null without one). */
  const nextRegNumber = async (): Promise<{ prefix: string | null; reg_number: string | null }> => {
    const response = await axiosInstance.get('/api/v1/student/next-reg-number');
    return response.data?.data ?? { prefix: null, reg_number: null };
  };

  const create = async (studentData: any) => {
    const response = await axiosInstance.post('/api/v1/student/create', {
      uuid: studentData.uuid,
      name: studentData.name,
      reg_number: studentData.reg_number,
      // No parent yet is sent as null.
      parent_uuid: studentData.parent_uuid || null,
      class_uuid: studentData.class_uuid,
      gender: studentData.gender,
      date_of_birth: studentData.date_of_birth || null,
      avatar: studentData.avatar,
      face_descriptor: studentData.face_descriptor,
      // Set when "New parent" is ticked: the API creates them with the student.
      new_parent: studentData.new_parent,
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

  const update = async (uuid: string, studentData: any) => {
    const response = await axiosInstance.patch(
      `/api/v1/student/update/${uuid}`,
      {
        name: studentData.name,
        reg_number: studentData.reg_number,
        parent_uuid: studentData.parent_uuid || null,
        class_uuid: studentData.class_uuid,
        gender: studentData.gender,
        date_of_birth: studentData.date_of_birth || null,
        avatar: studentData.avatar,
        face_descriptor: studentData.face_descriptor,
        status: studentData.status,
      }
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

  const remove = async (uuid: string) => {
    const response = await axiosInstance.delete(
      `/api/v1/student/delete/${uuid}`
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

  return {
    show,
    index,
    create,
    update,
    remove,
    nextRegNumber,
  };
};
