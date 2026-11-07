import {axiosInstance} from '@/lib/axios';

export interface AffectiveTrait {
    uuid: string;
    name: string;
    position: number;
}

export interface AffectiveScaleItem {
    rating: number;
    label: string;
}

/** A trait on a report, with this report's rating (null when not rated yet). */
export interface AffectiveRow {
    trait_uuid: string | null;
    name: string;
    rating: number | null;
}

const unwrap = (data: any) =>
    data.success
        ? {success: true as const, data: data.data}
        : {success: false as const, message: data.message || 'Something went wrong'};

/** The branch's affective domain (behaviour traits rated on report cards). */
export const useAffective = () => ({
    index: async () => unwrap((await axiosInstance.get('/api/v1/affective/index')).data),
    save: async (traits: { uuid?: string; name: string }[]) =>
        unwrap((await axiosInstance.put('/api/v1/affective/save', {traits})).data),
});
