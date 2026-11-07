import {axiosInstance} from '@/lib/axios';

export interface PortalApp {
    key: string;
    name: string;
    full_name: string;
    description: string;
    icon: string;
    status: 'coming_soon' | 'available';
    launch_url: string | null;
}

export interface StudentOverview {
    student: {
        uuid: string;
        name: string;
        avatar: string | null;
        reg_number: string;
        class: { name: string } | null;
        branch: { name: string; school: { name: string; avatar: string | null } };
    };
    apps: PortalApp[];
}

const unwrap = (data: any) =>
    data.success
        ? {success: true as const, data: data.data, message: data.message as string}
        : {success: false as const, message: data.message || 'Something went wrong'};

export const useStudentPortal = () => ({
    login: async (reg_number: string, pin: string) =>
        unwrap((await axiosInstance.post('/api/v1/student-portal/login', {reg_number, pin})).data),
    overview: async () => unwrap((await axiosInstance.get('/api/v1/student-portal/overview')).data),

    // Staff
    pinStatus: async (studentUuid: string) => unwrap((await axiosInstance.get(`/api/v1/student/pin/${studentUuid}`)).data),
    setPin: async (studentUuid: string, pin: string | null) =>
        unwrap((await axiosInstance.put(`/api/v1/student/pin/${studentUuid}`, {pin})).data),
});

/** Where each role lands after signing in. */
export const homeFor = (role: string | undefined) =>
    role === 'PARENT' ? '/parent/dashboard' : role === 'STUDENT' ? '/student/dashboard' : '/staff/dashboard';
