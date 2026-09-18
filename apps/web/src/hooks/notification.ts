import {axiosInstance} from '@/lib/axios';

export const useNotification = () => {
    const index = async () => {
        const response = await axiosInstance.get('/api/v1/notification/index');
        const data = response.data;
        return data.success
            ? {success: true, data: data.data}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const markRead = async (uuid: string) => {
        const response = await axiosInstance.patch(`/api/v1/notification/read/${uuid}`);
        const data = response.data;
        return data.success
            ? {success: true}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const markAllRead = async () => {
        const response = await axiosInstance.post('/api/v1/notification/read-all');
        const data = response.data;
        return data.success
            ? {success: true}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    const registerDeviceToken = async (token: string, platform = 'web') => {
        const response = await axiosInstance.post('/api/v1/notification/device-token', {token, platform});
        const data = response.data;
        return data.success
            ? {success: true}
            : {success: false, message: data.message || 'Something went wrong'};
    };

    return {index, markRead, markAllRead, registerDeviceToken};
};
