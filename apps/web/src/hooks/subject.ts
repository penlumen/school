import {axiosInstance} from '@/lib/axios';

export const useSubject = () => {
    const index = async (class_uuid: string) => {
        const response = await axiosInstance.get(
            `/api/v1/subject/index/${class_uuid}`
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

    const show = async (subject_uuid: string) => {
        const response = await axiosInstance.get(
            `/api/v1/subject/show/${subject_uuid}`
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

    const create = async (class_uuid: string, name: string, description?: string) => {
        const response = await axiosInstance.post(
            `/api/v1/subject/create/${class_uuid}`,
            {
                name,
                description,
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

    const update = async (subject_uuid: string, class_uuid: string, name: string, description?: string) => {
        const response = await axiosInstance.patch(
            `/api/v1/subject/update/${subject_uuid}`,
            {
                name,
                class_uuid,
                description,
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
            `/api/v1/subject/delete/${uuid}`
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

    /** Saves the class's subjects in this order (every subject uuid, top first). */
    const reorder = async (class_uuid: string, order: string[]) => {
        const data = (await axiosInstance.put(`/api/v1/subject/reorder/${class_uuid}`, {order})).data;
        return data.success
            ? {success: true as const, data: data.data}
            : {success: false as const, message: data.message || 'Something went wrong'};
    };

    return {
        show,
        index,
        create,
        update,
        remove,
        reorder,
    };
};
