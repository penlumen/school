import Papa from 'papaparse';

export type SpreadsheetFormat = 'csv' | 'xlsx';

export interface SheetColumn {
    key: string;
    label: string;
}

const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/** Excel cells can be rich text, links or formulas; reduce them to their text. */
function cellText(value: unknown): string {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value === 'object') {
        const cell = value as {
            text?: unknown;
            result?: unknown;
            richText?: { text: string }[];
            hyperlink?: string;
        };
        if (Array.isArray(cell.richText)) return cell.richText.map((r) => r.text).join('');
        if (cell.result !== undefined) return cellText(cell.result);
        if (cell.text !== undefined) return cellText(cell.text);
        if (cell.hyperlink) return cell.hyperlink.replace(/^mailto:/, '');
        return '';
    }
    return String(value).trim();
}

/**
 * Reads the first sheet of a .csv or .xlsx file into one object per row,
 * keyed by the header row. Fully empty rows are dropped.
 */
export async function readSpreadsheet(file: File): Promise<Record<string, string>[]> {
    if (/\.xlsx$/i.test(file.name)) {
        const {default: ExcelJS} = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());
        const sheet = workbook.worksheets[0];
        if (!sheet) return [];
        const headers: string[] = [];
        sheet.getRow(1).eachCell({includeEmpty: true}, (cell, col) => {
            headers[col] = cellText(cell.value);
        });
        const rows: Record<string, string>[] = [];
        sheet.eachRow({includeEmpty: false}, (row, number) => {
            if (number === 1) return;
            const record: Record<string, string> = {};
            headers.forEach((header, col) => {
                if (header) record[header] = cellText(row.getCell(col).value);
            });
            if (Object.values(record).some(Boolean)) rows.push(record);
        });
        return rows;
    }
    if (/\.csv$/i.test(file.name) || file.type === 'text/csv') {
        const parsed = Papa.parse<Record<string, string>>(await file.text(), {
            header: true,
            skipEmptyLines: 'greedy',
            transformHeader: (h) => h.trim(),
            transform: (v) => v.trim(),
        });
        return parsed.data.filter((row) => Object.values(row).some(Boolean));
    }
    throw new Error('Choose a .csv or .xlsx file');
}

function download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/** Writes rows under the column labels and downloads them as CSV or Excel. */
export async function downloadSpreadsheet(
    name: string,
    columns: SheetColumn[],
    rows: Record<string, unknown>[],
    format: SpreadsheetFormat,
) {
    if (format === 'csv') {
        const csv = Papa.unparse({
            fields: columns.map((c) => c.label),
            data: rows.map((row) => columns.map((c) => row[c.key] ?? '')),
        });
        // The BOM makes Excel open UTF-8 (e.g. ₦, accented names) correctly.
        download(new Blob(['﻿' + csv], {type: 'text/csv;charset=utf-8'}), `${name}.csv`);
        return;
    }
    const {default: ExcelJS} = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(name.slice(0, 31));
    sheet.columns = columns.map((c) => ({header: c.label, key: c.key, width: Math.max(12, c.label.length + 4)}));
    sheet.getRow(1).font = {bold: true};
    sheet.views = [{state: 'frozen', ySplit: 1}];
    rows.forEach((row) => sheet.addRow(Object.fromEntries(columns.map((c) => [c.key, row[c.key] ?? '']))));
    const buffer = await workbook.xlsx.writeBuffer();
    download(new Blob([buffer], {type: XLSX_TYPE}), `${name}.xlsx`);
}
