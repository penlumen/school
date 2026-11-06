import {axiosInstance} from '@/lib/axios';

export interface ContentItem {
    icon?: string;
    title: string;
    description: string;
}

export interface SchoolProfile {
    uuid: string;
    name: string;
    slug: string;
    email: string;
    contact: string | null;
    avatar: string | null;
    address: string | null;
    subtext: string | null;
    about: string | null;
    mission: string | null;
    vision: string | null;
    features: ContentItem[] | null;
    values: ContentItem[] | null;
}

export interface Facility {
    uuid: string;
    title: string;
    description: string | null;
    image: string | null;
}

export interface GalleryCategory {
    uuid: string;
    name: string;
    _count?: { images: number };
}

export interface GalleryImage {
    uuid: string;
    title: string;
    image: string;
    category_uuid: string | null;
}

export interface SchoolSettings extends SchoolProfile {
    facilities: Facility[];
    gallery_categories: GalleryCategory[];
    gallery_images: GalleryImage[];
}

const unwrap = (data: any) =>
    data.success
        ? {success: true as const, data: data.data}
        : {success: false as const, message: data.message || 'Something went wrong'};

export const useSchool = () => {
    const show = async () => unwrap((await axiosInstance.get('/api/v1/school/show')).data);

    const update = async (payload: Partial<SchoolProfile>) =>
        unwrap((await axiosInstance.patch('/api/v1/school/update', payload)).data);

    const createFacility = async (payload: Partial<Facility>) =>
        unwrap((await axiosInstance.post('/api/v1/school/facility/create', payload)).data);

    const updateFacility = async (uuid: string, payload: Partial<Facility>) =>
        unwrap((await axiosInstance.patch(`/api/v1/school/facility/update/${uuid}`, payload)).data);

    const removeFacility = async (uuid: string) =>
        unwrap((await axiosInstance.delete(`/api/v1/school/facility/delete/${uuid}`)).data);

    const createImage = async (payload: Partial<GalleryImage>) =>
        unwrap((await axiosInstance.post('/api/v1/school/gallery/create', payload)).data);

    const updateImage = async (uuid: string, payload: Partial<GalleryImage>) =>
        unwrap((await axiosInstance.patch(`/api/v1/school/gallery/update/${uuid}`, payload)).data);

    const removeImage = async (uuid: string) =>
        unwrap((await axiosInstance.delete(`/api/v1/school/gallery/delete/${uuid}`)).data);

    const saveCategories = async (categories: { uuid?: string; name: string }[]) =>
        unwrap((await axiosInstance.put('/api/v1/school/gallery/categories', {categories})).data);

    return {
        show,
        update,
        createFacility,
        updateFacility,
        removeFacility,
        createImage,
        updateImage,
        removeImage,
        saveCategories,
    };
};
