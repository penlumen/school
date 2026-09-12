import {axiosInstance} from '@/lib/axios';

export const useCalendar = () => {
    const index = async () => {
        const response = await axiosInstance.get('/api/v1/calendar/index');
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const create = async (calendarData: {
        session: string;
        term: string;
        open_date: string;
        close_date: string;
    }) => {
        const response = await axiosInstance.post('/api/v1/calendar/create', calendarData);
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const update = async (
        uuid: string,
        calendarData: { session: string; term: string; open_date: string; close_date: string }
    ) => {
        const response = await axiosInstance.patch(`/api/v1/calendar/update/${uuid}`, calendarData);
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const remove = async (uuid: string) => {
        const response = await axiosInstance.delete(`/api/v1/calendar/delete/${uuid}`);
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    return {index, create, update, remove};
};
