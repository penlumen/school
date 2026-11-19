import {axiosInstance} from '@/lib/axios';

export type DataType = 'students' | 'staff' | 'parents' | 'classes' | 'subjects' | 'results';

export interface DataColumn {
    key: string;
    label: string;
    required?: boolean;
    hint?: string;
    exportOnly?: boolean;
}

export interface DataTypeInfo {
    label: string;
    matchBy: string;
    columns: DataColumn[];
}

export type ImportAction = 'create' | 'update' | 'unchanged' | 'error';

export interface ImportRow {
    row: number;
    action: ImportAction;
    key: string;
    errors: string[];
    changes: string[];
}

export interface ImportResult {
    dry_run: boolean;
    summary: Record<ImportAction, number>;
    rows: ImportRow[];
}

const unwrap = (data: any) =>
    data.success
        ? {success: true as const, data: data.data, message: data.message as string}
        : {success: false as const, message: data.message || 'Something went wrong'};

export const useDataTransfer = () => ({
    types: async () => unwrap((await axiosInstance.get('/api/v1/data/types')).data),
    exportRows: async (type: DataType, params: { calendar_uuid?: string } = {}) =>
        unwrap((await axiosInstance.get(`/api/v1/data/${type}/export`, {params})).data),
    importRows: async (
        type: DataType,
        rows: Record<string, string>[],
        options: { dry_run: boolean; calendar_uuid?: string },
    ) => unwrap((await axiosInstance.post(`/api/v1/data/${type}/import`, {rows, ...options})).data),
});
