import {axiosInstance} from '@/lib/axios';

type ResultData = {
    teacher_remark: string | null;
    principal_remark: string | null;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
    approval_requested?: boolean;
};

type AssessmentObject = {
    uuid: string;
    subject: string;
    assessment: number;
    examination: number;
    overall: number;
};

export const useResult = () => {
    /** Reports list, already limited by the API to the classes this user can see. */
    const index = async (filters: {
        page?: number;
        status?: string;
        class_uuid?: string;
        calendar_uuid?: string;
        search?: string;
    }) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== 'all') params.set(key, String(value));
        });
        const response = await axiosInstance.get(`/api/v1/result/index?${params}`);
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

    const show = async (student_uuid: any) => {
        const response = await axiosInstance.get(
            `/api/v1/result/show/${student_uuid}`
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

    const view = async (result_uuid: string) => {
        const response = await axiosInstance.get(
            `/api/v1/result/view/${result_uuid}`
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

    const create = async (student_uuid: string, calendar_uuid?: string) => {
        const response = await axiosInstance.post(
            `/api/v1/result/create/${student_uuid}`,
            calendar_uuid ? {calendar_uuid} : {}
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

    const update = async (
        result_uuid: string,
        resultData: ResultData,
        assessmentData: AssessmentObject[],
        /** Affective domain ratings; null clears a rating. Omit to leave them unchanged. */
        affective?: { trait_uuid: string; rating: number | null }[]
    ) => {
        const response = await axiosInstance.patch(
            `/api/v1/result/update/${result_uuid}`,
            {
                result: resultData,
                assessments: assessmentData,
                ...(affective && {affective}),
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
            `/api/v1/result/delete/${uuid}`
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

    /** Approve or reject many reports at once (administrators). */
    const bulkStatus = async (uuids: string[], status: 'APPROVED' | 'REJECTED', reason?: string) => {
        const data = (await axiosInstance.post('/api/v1/result/bulk-status', {uuids, status, reason})).data;
        return data.success
            ? {success: true as const, message: data.message as string, data: data.data}
            : {success: false as const, message: data.message || 'Something went wrong'};
    };

    /** Delete many reports and their scores (administrators). */
    const bulkDelete = async (uuids: string[]) => {
        const data = (await axiosInstance.post('/api/v1/result/bulk-delete', {uuids})).data;
        return data.success
            ? {success: true as const, message: data.message as string, data: data.data}
            : {success: false as const, message: data.message || 'Something went wrong'};
    };

    return {
        show,
        view,
        index,
        create,
        update,
        remove,
        bulkStatus,
        bulkDelete,
    };
};
