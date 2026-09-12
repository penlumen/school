import {axiosInstance} from '@/lib/axios';

export interface EventPayload {
    title: string;
    description?: string;
    date: string;
    start_time?: string;
    end_time?: string;
    location?: string;
    tag_all_staff?: boolean;
    tag_all_parents?: boolean;
    staff_uuids?: string[];
    parent_uuids?: string[];
}

export const useEvent = () => {
    const index = async (calendarUuid: string) => {
        const response = await axiosInstance.get(`/api/v1/event/index/${calendarUuid}`);
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const create = async (calendarUuid: string, eventData: EventPayload) => {
        const response = await axiosInstance.post(`/api/v1/event/create/${calendarUuid}`, eventData);
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const update = async (uuid: string, eventData: EventPayload) => {
        const response = await axiosInstance.patch(`/api/v1/event/update/${uuid}`, eventData);
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const remove = async (uuid: string) => {
        const response = await axiosInstance.delete(`/api/v1/event/delete/${uuid}`);
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    return {index, create, update, remove};
};
