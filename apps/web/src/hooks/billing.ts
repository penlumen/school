import {axiosInstance} from '@/lib/axios';

export type TemplateStatus = 'ACTIVE' | 'INACTIVE';
export type InvoiceStatus = 'PENDING' | 'PART_PAYMENT' | 'FULL_PAYMENT' | 'CANCELLED' | 'REFUNDED';

// Prisma Decimal columns arrive as strings.
type Money = string | number;

export interface TemplateItem {
    uuid?: string;
    description: string;
    amount: Money;
}

export interface BillingTemplate {
    uuid: string;
    name: string;
    description: string | null;
    status: TemplateStatus;
    items: TemplateItem[];
    _count?: { invoices: number };
}

export interface InvoiceListItem {
    uuid: string;
    number: string;
    status: InvoiceStatus;
    total: Money;
    paid: Money;
    issued_at: string;
    due_at: string | null;
    student: {
        uuid: string;
        name: string;
        reg_number: string;
        class: { name: string } | null;
        parent: { uuid: string; name: string | null } | null;
    };
    template: { uuid: string; name: string } | null;
}

export interface InvoiceDetail extends InvoiceListItem {
    note: string | null;
    items: { uuid: string; description: string; quantity: number; amount: Money }[];
    history: { uuid: string; status: InvoiceStatus; amount: Money; description: string | null; created_at: string }[];
    student: InvoiceListItem['student'] & {
        parent: { uuid: string; name: string | null; email: string; contact: string | null; address: string | null } | null;
    };
    branch: {
        name: string;
        email: string | null;
        contact: string | null;
        address: string | null;
        avatar: string | null;
        school: { name: string; email: string; contact: string | null; address: string | null; avatar: string | null };
    };
}

export interface TemplatePayload {
    name?: string;
    description?: string | null;
    status?: TemplateStatus;
    items?: { description: string; amount: Money }[];
}

export interface InvoicePayload {
    student_uuids: string[];
    template_uuid: string;
    due_at?: string;
    note?: string;
}

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
    PENDING: 'Pending',
    PART_PAYMENT: 'Part payment',
    FULL_PAYMENT: 'Full payment',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
};

export const toNumber = (value: Money | null | undefined) => Number(value ?? 0) || 0;

/** ₦89,000 (kobo shown only when present). */
export const naira = (value: Money | null | undefined) => {
    const amount = toNumber(value);
    return `₦${amount.toLocaleString('en-NG', {
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
        maximumFractionDigits: 2,
    })}`;
};

export const templateTotal = (template: Pick<BillingTemplate, 'items'>) =>
    template.items.reduce((sum, item) => sum + toNumber(item.amount), 0);

const unwrap = (data: any) =>
    data.success
        ? {success: true as const, data: data.data}
        : {success: false as const, message: data.message || 'Something went wrong'};

export const useBilling = () => {
    const templates = async () => unwrap((await axiosInstance.get('/api/v1/billing-template/index')).data);
    const template = async (uuid: string) => unwrap((await axiosInstance.get(`/api/v1/billing-template/show/${uuid}`)).data);
    const createTemplate = async (payload: TemplatePayload) =>
        unwrap((await axiosInstance.post('/api/v1/billing-template/create', payload)).data);
    const updateTemplate = async (uuid: string, payload: TemplatePayload) =>
        unwrap((await axiosInstance.patch(`/api/v1/billing-template/update/${uuid}`, payload)).data);
    const removeTemplate = async (uuid: string) =>
        unwrap((await axiosInstance.delete(`/api/v1/billing-template/delete/${uuid}`)).data);

    const invoices = async () => unwrap((await axiosInstance.get('/api/v1/invoice/index')).data);
    const invoice = async (uuid: string) => unwrap((await axiosInstance.get(`/api/v1/invoice/show/${uuid}`)).data);
    const createInvoices = async (payload: InvoicePayload) =>
        unwrap((await axiosInstance.post('/api/v1/invoice/create', payload)).data);
    const updateStatus = async (uuid: string, payload: { status: InvoiceStatus; amount?: string; description?: string }) =>
        unwrap((await axiosInstance.patch(`/api/v1/invoice/status/${uuid}`, payload)).data);
    const removeInvoice = async (uuid: string) =>
        unwrap((await axiosInstance.delete(`/api/v1/invoice/delete/${uuid}`)).data);

    return {
        templates,
        template,
        createTemplate,
        updateTemplate,
        removeTemplate,
        invoices,
        invoice,
        createInvoices,
        updateStatus,
        removeInvoice,
    };
};
