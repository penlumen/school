import {axiosInstance} from '@/lib/axios';
import type {InvoiceStatus} from '@/hooks/billing';
import type {SiteEvent} from '@/hooks/site';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'PENDING';

export interface Ward {
    uuid: string;
    name: string;
    reg_number: string;
    gender: string | null;
    avatar: string | null;
    class: { uuid: string; name: string };
    branch: { uuid: string; name: string };
}

export interface WardSummary extends Ward {
    today_attendance: AttendanceStatus | null;
    attendance_rate: number | null;
    latest_result: {
        uuid: string;
        overall: number;
        average: number | null;
        session: string | null;
        term: string | null;
    } | null;
    outstanding: number;
}

export interface WardResult {
    uuid: string;
    class_name: string;
    overall: number;
    average: number | null;
    subjects: number;
    created_at: string;
    calendar: { session: string; term: string | null } | null;
}

export interface ParentInvoice {
    uuid: string;
    number: string;
    status: InvoiceStatus;
    total: string | number;
    paid: string | number;
    issued_at: string;
    due_at: string | null;
    student: { uuid: string; name: string; class: { name: string } | null };
    template: { name: string } | null;
}

export interface TermDates {
    uuid: string;
    session: string;
    term: string | null;
    open_date: string | null;
    close_date: string | null;
    next_term_resumption_date: string | null;
    branch: { name: string };
}

export interface ParentAccount {
    uuid: string;
    name: string | null;
    email: string;
    contact: string | null;
    alt_contact: string | null;
    address: string | null;
    avatar: string | null;
}

export type {SiteEvent as ParentEvent};

const unwrap = (data: any) =>
    data.success
        ? {success: true as const, data: data.data}
        : {success: false as const, message: data.message || 'Something went wrong'};

const get = async (path: string) => unwrap((await axiosInstance.get(`/api/v1/parent/${path}`)).data);

export const useParent = () => ({
    overview: () => get('overview'),
    ward: (uuid: string) => get(`ward/${uuid}`),
    attendance: (uuid: string, month: string) => get(`ward/${uuid}/attendance?month=${month}`),
    wardResults: (uuid: string) => get(`ward/${uuid}/results`),
    result: (uuid: string) => get(`result/${uuid}`),
    invoices: (studentUuid?: string) => get(`invoices${studentUuid ? `?student_uuid=${studentUuid}` : ''}`),
    invoice: (uuid: string) => get(`invoice/${uuid}`),
    calendar: () => get('calendar'),
    account: () => get('account'),
    updateAccount: async (payload: Pick<ParentAccount, 'contact' | 'alt_contact' | 'address'>) =>
        unwrap((await axiosInstance.patch('/api/v1/parent/account', payload)).data),
    changePassword: async (payload: { current_password: string; new_password: string }) =>
        unwrap((await axiosInstance.patch('/api/v1/parent/account/password', payload)).data),
});

/** Role from the session cookie, read on the client. */
export const isParentSession = () => {
    if (typeof document === 'undefined') return false;
    const match = document.cookie.match(/(?:^|; )user=([^;]*)/);
    try {
        return JSON.parse(decodeURIComponent(match?.[1] || 'null'))?.role === 'PARENT';
    } catch {
        return false;
    }
};
