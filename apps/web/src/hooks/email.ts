import {axiosInstance} from '@/lib/axios';

export type SmtpSecurity = 'ssl' | 'starttls' | 'none';

export interface EmailCategory {
    key: string;
    label: string;
    description: string;
    locked?: boolean;
}

export interface SmtpView {
    host: string;
    port: number;
    security: SmtpSecurity;
    username: string | null;
    has_password: boolean;
    password_hint: string | null;
    password_unreadable: boolean;
    from_name: string | null;
    from_email: string;
    reply_to: string | null;
}

export interface EmailSettings {
    email_enabled: boolean;
    /** Who actually sends: the school's SMTP, the platform's, or nobody. */
    sender: 'school' | 'platform' | 'none';
    platform_available: boolean;
    school_email: string;
    smtp: SmtpView | null;
    types: Record<string, boolean>;
    categories: EmailCategory[];
}

export interface SmtpPayload {
    host: string;
    port: number;
    security: SmtpSecurity;
    username: string;
    /** Omit to keep the saved password, '' to remove it. */
    password?: string;
    from_name: string;
    from_email: string;
    reply_to: string;
}

export interface EmailLogEntry {
    uuid: string;
    to: string;
    subject: string;
    category: string;
    status: 'SENT' | 'FAILED';
    via: 'school' | 'platform';
    error: string | null;
    created_at: string;
}

const unwrap = (data: any) =>
    data.success
        ? {success: true as const, data: data.data, message: data.message as string}
        : {success: false as const, message: data.message || 'Something went wrong'};

export const useEmailSettings = () => ({
    settings: async () => unwrap((await axiosInstance.get('/api/v1/email/settings')).data),
    save: async (payload: { email_enabled?: boolean; smtp?: SmtpPayload | null; types?: Record<string, boolean> }) =>
        unwrap((await axiosInstance.put('/api/v1/email/settings', payload)).data),
    test: async (to: string) => unwrap((await axiosInstance.post('/api/v1/email/test', {to})).data),
    log: async () => unwrap((await axiosInstance.get('/api/v1/email/log')).data),
});

/** Set-password links: forgot password, invites and resends. */
export const usePasswordLinks = () => ({
    forgot: async (email: string, role: 'staff' | 'parent') =>
        unwrap((await axiosInstance.post('/api/v1/password/forgot', {email, role})).data),
    check: async (token: string) => unwrap((await axiosInstance.get(`/api/v1/password/check/${encodeURIComponent(token)}`)).data),
    set: async (token: string, password: string) =>
        unwrap((await axiosInstance.post('/api/v1/password/set', {token, password})).data),
    resendInvite: async (userUuid: string) => unwrap((await axiosInstance.post(`/api/v1/password/invite/${userUuid}`)).data),
});
