import {axiosInstance} from '@/lib/axios';
import type {Money} from '@/hooks/billing';

export type OnlinePaymentStatus = 'PENDING' | 'AWAITING_CONFIRMATION' | 'SUCCESS' | 'FAILED' | 'REJECTED';

export const PAYMENT_STATUS_LABEL: Record<OnlinePaymentStatus, string> = {
    PENDING: 'Started',
    AWAITING_CONFIRMATION: 'To confirm',
    SUCCESS: 'Received',
    FAILED: 'Not completed',
    REJECTED: 'Rejected',
};

export interface PaymentSettings {
    payments_enabled: boolean;
    paystack_public_key: string | null;
    has_secret_key: boolean;
    secret_key_hint: string | null;
    secret_key_unreadable: boolean;
    mode: 'test' | 'live' | null;
    verification: 'automatic' | 'manual';
    allow_part_payment: boolean;
    parent_pays_fees: boolean;
    webhook_path: string;
}

export interface PaymentSettingsPayload {
    payments_enabled?: boolean;
    paystack_public_key?: string | null;
    /** Omit to keep the saved key, null to remove it. */
    paystack_secret_key?: string | null;
    allow_part_payment?: boolean;
    parent_pays_fees?: boolean;
}

export interface OnlinePayment {
    uuid: string;
    reference: string;
    amount: Money;
    fee: Money;
    status: OnlinePaymentStatus;
    verified: boolean;
    channel: string | null;
    note: string | null;
    paid_at: string | null;
    created_at: string;
    user?: { uuid: string; name: string; email: string } | null;
    invoice?: {
        uuid: string;
        number: string;
        total: Money;
        paid: Money;
        student: { uuid: string; name: string };
    };
}

export interface PaymentQuote {
    balance: Money;
    amount: Money;
    fee: Money;
    total: Money;
    currency: string;
}

/** What Paystack's inline popup needs to start a transaction. */
export interface PaystackCheckout {
    key: string;
    email: string;
    amount: number;
    currency: string;
    reference: string;
    metadata: Record<string, string>;
}

const unwrap = (data: any) =>
    data.success
        ? {success: true as const, data: data.data, message: data.message as string}
        : {success: false as const, message: data.message || 'Something went wrong'};

export const usePayments = () => ({
    settings: async () => unwrap((await axiosInstance.get('/api/v1/payments/settings')).data),
    saveSettings: async (payload: PaymentSettingsPayload) =>
        unwrap((await axiosInstance.put('/api/v1/payments/settings', payload)).data),

    options: async () => unwrap((await axiosInstance.get('/api/v1/payments/options')).data),
    quote: async (invoiceUuid: string, amount?: string) =>
        unwrap((await axiosInstance.post(`/api/v1/payments/quote/${invoiceUuid}`, {amount})).data),
    checkout: async (invoiceUuid: string, amount?: string) =>
        unwrap((await axiosInstance.post(`/api/v1/payments/checkout/${invoiceUuid}`, {amount})).data),
    complete: async (reference: string) =>
        unwrap((await axiosInstance.post(`/api/v1/payments/complete/${encodeURIComponent(reference)}`)).data),
    cancel: async (reference: string) =>
        unwrap((await axiosInstance.post(`/api/v1/payments/cancel/${encodeURIComponent(reference)}`)).data),

    index: async (status?: OnlinePaymentStatus) =>
        unwrap((await axiosInstance.get('/api/v1/payments/index', {params: status ? {status} : {}})).data),
    confirm: async (uuid: string) => unwrap((await axiosInstance.post(`/api/v1/payments/confirm/${uuid}`)).data),
    reject: async (uuid: string, note: string) =>
        unwrap((await axiosInstance.post(`/api/v1/payments/reject/${uuid}`, {note})).data),
});

const PAYSTACK_SCRIPT = 'https://js.paystack.co/v2/inline.js';

/** Loads Paystack's inline script once, on first use. */
export function loadPaystack(): Promise<any> {
    const w = window as any;
    if (w.PaystackPop) return Promise.resolve(w.PaystackPop);
    return new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${PAYSTACK_SCRIPT}"]`);
        const script = existing || document.createElement('script');
        script.addEventListener('load', () => resolve(w.PaystackPop));
        script.addEventListener('error', () => reject(new Error('Could not load Paystack. Check your connection.')));
        if (!existing) {
            script.src = PAYSTACK_SCRIPT;
            script.async = true;
            document.body.appendChild(script);
        }
    });
}
