import {axiosInstance} from '@/lib/axios';

export interface IntegrationApp {
    key: string;
    name: string;
    full_name: string;
    description: string;
    icon: string;
    connected: boolean;
    enabled: boolean;
    app_url: string | null;
    redirect_uris: string[];
    client_id: string | null;
    client_secret_hint: string | null;
    webhook_url: string | null;
    has_webhook_secret: boolean;
    webhook_events: string[];
    disabled_branch_uuids: string[];
}

export interface IntegrationsOverview {
    apps: IntegrationApp[];
    branches: { uuid: string; name: string }[];
    events: string[];
    issuer: string;
    discovery_url: string;
}

export interface WebhookDelivery {
    uuid: string;
    event: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    attempts: number;
    response_status: number | null;
    error: string | null;
    created_at: string;
}

export type IntegrationPayload = Partial<
    Pick<IntegrationApp, 'enabled' | 'app_url' | 'redirect_uris' | 'webhook_url' | 'webhook_events' | 'disabled_branch_uuids'>
>;

const unwrap = (data: any) =>
    data.success
        ? {success: true as const, data: data.data, message: data.message as string}
        : {success: false as const, message: data.message || 'Something went wrong'};

export const useIntegrations = () => ({
    index: async () => unwrap((await axiosInstance.get('/api/v1/integrations/index')).data),
    save: async (key: string, payload: IntegrationPayload) =>
        unwrap((await axiosInstance.put(`/api/v1/integrations/${key}`, payload)).data),
    rotateClientSecret: async (key: string) =>
        unwrap((await axiosInstance.post(`/api/v1/integrations/${key}/client-secret`)).data),
    rotateWebhookSecret: async (key: string) =>
        unwrap((await axiosInstance.post(`/api/v1/integrations/${key}/webhook-secret`)).data),
    testWebhook: async (key: string) => unwrap((await axiosInstance.post(`/api/v1/integrations/${key}/webhook-test`)).data),
    deliveries: async (key: string) => unwrap((await axiosInstance.get(`/api/v1/integrations/${key}/deliveries`)).data),
    redeliver: async (uuid: string) =>
        unwrap((await axiosInstance.post(`/api/v1/integrations/deliveries/${uuid}/redeliver`)).data),
});
