import {axiosInstance} from '@/lib/axios';

export const useStaffAttendance = () => {
    const index = async (date?: string) => {
        const response = await axiosInstance.get(
            '/api/v1/attendance/staff/index',
            {params: date ? {date} : {}}
        );
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const faces = async () => {
        const response = await axiosInstance.get('/api/v1/attendance/staff/faces');
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const mark = async (staffUuid: string, status: 'PRESENT' | 'ABSENT' | 'PENDING' = 'PRESENT') => {
        const response = await axiosInstance.post(`/api/v1/attendance/staff/${staffUuid}`, {status});
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const update = async (uuid: string, status: 'PRESENT' | 'ABSENT' | 'PENDING') => {
        const response = await axiosInstance.patch(`/api/v1/attendance/staff/${uuid}`, {status});
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    return {index, faces, mark, update};
};
