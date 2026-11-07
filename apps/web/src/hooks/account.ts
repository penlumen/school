import {axiosInstance} from '@/lib/axios';

export interface Account {
    uuid: string;
    name: string | null;
    email: string;
    contact: string | null;
    alt_contact: string | null;
    address: string | null;
    avatar: string | null;
    role: string;
    position: string;
}

const unwrap = (data: any) =>
    data.success
        ? {success: true as const, data: data.data}
        : {success: false as const, message: data.message || 'Something went wrong'};

/** The signed-in user's own account (staff and parents). */
export const useAccount = () => ({
    show: async () => unwrap((await axiosInstance.get('/api/v1/account/show')).data),
    update: async (payload: Pick<Account, 'contact' | 'alt_contact' | 'address'>) =>
        unwrap((await axiosInstance.patch('/api/v1/account/update', payload)).data),
    changePassword: async (payload: { current_password: string; new_password: string }) =>
        unwrap((await axiosInstance.patch('/api/v1/account/password', payload)).data),
});
