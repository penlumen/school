import {axiosInstance} from '@/lib/axios';

export const useStudentAttendance = () => {
    const index = async (classUuid: string, date?: string) => {
        const response = await axiosInstance.get(
            `/api/v1/attendance/student/class/${classUuid}`,
            {params: date ? {date} : {}}
        );
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const faces = async (classUuid: string) => {
        const response = await axiosInstance.get(`/api/v1/attendance/student/faces/${classUuid}`);
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const mark = async (studentUuid: string, status: 'PRESENT' | 'ABSENT' | 'PENDING' = 'PRESENT') => {
        const response = await axiosInstance.post(`/api/v1/attendance/student/${studentUuid}`, {status});
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const update = async (uuid: string, status: 'PRESENT' | 'ABSENT' | 'PENDING') => {
        const response = await axiosInstance.patch(`/api/v1/attendance/student/${uuid}`, {status});
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const history = async (studentUuid: string) => {
        const response = await axiosInstance.get(`/api/v1/attendance/student/history/${studentUuid}`);
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    return {index, faces, mark, update, history};
};
