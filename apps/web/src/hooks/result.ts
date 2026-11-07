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
    ca_one: number;
    ca_two: number;
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

    return {
        show,
        view,
        index,
        create,
        update,
        remove,
    };
};
