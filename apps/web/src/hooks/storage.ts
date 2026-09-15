import {axiosInstance} from '@/lib/axios';

export const useStorage = () => {
    const upload = async (file: File, folder: string) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post(
            `/api/v1/storage/upload?folder=${folder}`,
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}}
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

    return {upload};
};
