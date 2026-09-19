import {axiosInstance} from '@/lib/axios';

export type StorageEntity = 'student' | 'staff' | 'parent';

export const useStorage = () => {
    const upload = async (file: File, entity: StorageEntity, uuid: string) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post(
            `/api/v1/storage/upload?entity=${entity}&uuid=${encodeURIComponent(uuid)}`,
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}}
        );
        const data = response.data;

        if (!data.success || !data.data) {
            return {success: false, message: data.message || 'Something went wrong'};
        }
        return {success: true, data: data.data};
    };

    return {upload};
};
