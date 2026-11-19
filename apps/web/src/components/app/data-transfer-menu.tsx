'use client';

import {useEffect, useRef, useState} from 'react';
import Cookies from 'js-cookie';
import {toast} from 'sonner';
import {AlertCircle, ArrowDownToLine, ArrowUpFromLine, ChevronDown, FileSpreadsheet} from 'lucide-react';

import {
    type DataType,
    type DataTypeInfo,
    type ImportAction,
    type ImportResult,
    useDataTransfer,
} from '@/hooks/data-transfer';
import {useCalendar} from '@/hooks/calendar';
import {termLabel} from '@/hooks/billing';
import {downloadSpreadsheet, readSpreadsheet, type SpreadsheetFormat} from '@/lib/spreadsheet';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {cn} from '@/lib/utils';

interface Term {
    uuid: string;
    session: string;
    term: string | null;
    status: string;
}

const ACTION: Record<ImportAction, { label: string; className: string }> = {
    create: {label: 'New', className: 'bg-success-muted text-success-foreground'},
    update: {label: 'Update', className: 'bg-accent text-accent-foreground'},
    unchanged: {label: 'No change', className: 'bg-muted text-muted-foreground'},
    error: {label: 'Error', className: 'bg-destructive-muted text-destructive'},
};

const today = () => new Date().toISOString().slice(0, 10);

/**
 * "Import / Export" for a list page. Imports are checked first and shown as a
 * preview (new, update, unchanged, errors) before anything is saved.
 */
export function DataTransferMenu({types, onImported}: { types: DataType[]; onImported?: () => void }) {
    const api = useDataTransfer();
    const {index: fetchTerms} = useCalendar();
    const [info, setInfo] = useState<Record<string, DataTypeInfo> | null>(null);
    const [terms, setTerms] = useState<Term[]>([]);
    const [dialog, setDialog] = useState<{ type: DataType; mode: 'import' | 'export' } | null>(null);
    const [termUuid, setTermUuid] = useState('');
    const [fileRows, setFileRows] = useState<Record<string, string>[] | null>(null);
    const [fileName, setFileName] = useState('');
    const [result, setResult] = useState<ImportResult | null>(null);
    const [busy, setBusy] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    // The page reloads its list once the dialog closes: reloading straight
    // away can unmount the page (and this summary) while it shows a spinner.
    const changed = useRef(false);

    const close = () => {
        setDialog(null);
        if (changed.current) {
            changed.current = false;
            onImported?.();
        }
    };

    useEffect(() => {
        api.types().then((r) => r.success && setInfo(r.data.types)).catch(() => undefined);
        if (types.includes('results')) {
            fetchTerms()
                .then((r) => {
                    if (!r.success) return;
                    const list: Term[] = r.data.calendars || [];
                    setTerms(list);
                    setTermUuid(list.find((t) => t.status === 'ACTIVE')?.uuid || list[0]?.uuid || '');
                })
                .catch(() => undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const meta = dialog && info ? info[dialog.type] : null;
    const needsTerm = dialog?.type === 'results';

    const open = (type: DataType, mode: 'import' | 'export') => {
        setFileRows(null);
        setFileName('');
        setResult(null);
        // Let the menu finish closing before the dialog takes focus.
        setTimeout(() => setDialog({type, mode}), 0);
    };

    const exportNow = async (type: DataType, format: SpreadsheetFormat, calendarUuid?: string) => {
        if (!info) return;
        setBusy(true);
        try {
            const r = await api.exportRows(type, calendarUuid ? {calendar_uuid: calendarUuid} : {});
            if (!r.success) return toast.error(r.message);
            if (!r.data.rows.length) return toast.info(`No ${info[type].label.toLowerCase()} to export`);
            await downloadSpreadsheet(`${type}-${today()}`, r.data.columns, r.data.rows, format);
            setDialog(null);
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
        } finally {
            setBusy(false);
        }
    };

    const template = (format: SpreadsheetFormat) => {
        if (!meta || !dialog) return;
        downloadSpreadsheet(`${dialog.type}-template`, meta.columns.filter((c) => !c.exportOnly), [], format);
    };

    const check = async (rows: Record<string, string>[], dryRun: boolean) => {
        if (!dialog) return;
        setBusy(true);
        try {
            const r = await api.importRows(dialog.type, rows, {
                dry_run: dryRun,
                ...(needsTerm && {calendar_uuid: termUuid}),
            });
            if (!r.success) return toast.error(r.message);
            setResult(r.data);
            if (!dryRun) {
                toast.success(r.message);
                changed.current = true;
            }
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
        } finally {
            setBusy(false);
        }
    };

    const chooseFile = async (file: File | undefined) => {
        if (!file) return;
        try {
            const rows = await readSpreadsheet(file);
            if (!rows.length) return toast.error('That file has no rows under the header');
            setFileRows(rows);
            setFileName(file.name);
            await check(rows, true);
        } catch (e: any) {
            toast.error(e.message || 'Could not read that file');
        } finally {
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const downloadErrors = () => {
        if (!result || !fileRows || !meta) return;
        const errors = result.rows.filter((r) => r.action === 'error');
        const columns = [...meta.columns.filter((c) => !c.exportOnly), {key: '__error', label: 'Error'}];
        downloadSpreadsheet(
            `${dialog!.type}-errors`,
            columns,
            errors.map((r) => {
                const source = fileRows[r.row - 2] ?? {};
                // Re-key the original row by column key so the labels line up.
                const byKey: Record<string, string> = {};
                for (const c of meta.columns) {
                    byKey[c.key] = source[c.label] ?? source[c.key] ?? '';
                }
                return {...byKey, __error: r.errors.join('; ')};
            }),
            'csv',
        );
    };

    // Same rule as the API: administrators and administrative staff.
    const viewer = JSON.parse(Cookies.get('user') || 'null');
    if (!(['ROOT', 'ADMIN'].includes(viewer?.role) || viewer?.position === 'ADMINISTRATIVE')) return null;

    const toSave = result ? result.summary.create + result.summary.update : 0;
    const imported = result && !result.dry_run;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size='sm' variant='outline' disabled={!info}>
                        <FileSpreadsheet className='h-4 w-4'/>
                        Import / Export
                        <ChevronDown className='h-3.5 w-3.5'/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                    {info &&
                        types.map((type, i) => (
                            <div key={type}>
                                {i > 0 && <DropdownMenuSeparator/>}
                                {types.length > 1 && <DropdownMenuLabel>{info[type].label}</DropdownMenuLabel>}
                                <DropdownMenuItem onSelect={() => open(type, 'import')}>
                                    <ArrowUpFromLine className='h-4 w-4'/> Import {info[type].label.toLowerCase()}
                                </DropdownMenuItem>
                                {type === 'results' ? (
                                    <DropdownMenuItem onSelect={() => open(type, 'export')}>
                                        <ArrowDownToLine className='h-4 w-4'/> Export results
                                    </DropdownMenuItem>
                                ) : (
                                    (['csv', 'xlsx'] as const).map((format) => (
                                        <DropdownMenuItem key={format} disabled={busy} onSelect={() => exportNow(type, format)}>
                                            <ArrowDownToLine className='h-4 w-4'/>
                                            Export {info[type].label.toLowerCase()} ({format === 'csv' ? 'CSV' : 'Excel'})
                                        </DropdownMenuItem>
                                    ))
                                )}
                            </div>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={!!dialog} onOpenChange={(next) => !busy && !next && close()}>
                <DialogContent className='sm:max-w-2xl'>
                    {dialog && meta && (
                        <>
                            <DialogHeader>
                                <DialogTitle>
                                    {dialog.mode === 'export' ? 'Export' : 'Import'} {meta.label.toLowerCase()}
                                </DialogTitle>
                                <DialogDescription>
                                    {dialog.mode === 'export'
                                        ? 'Download the scores for a term. You can edit the file and import it back.'
                                        : `Rows are matched by ${meta.matchBy}: matching records are updated, the rest are added. Nothing is saved until you confirm.`}
                                </DialogDescription>
                            </DialogHeader>

                            {needsTerm && !result && (
                                <div className='space-y-2'>
                                    <Label htmlFor='transfer-term'>Term</Label>
                                    <Select value={termUuid} onValueChange={setTermUuid}>
                                        <SelectTrigger id='transfer-term' className='w-full'>
                                            <SelectValue placeholder='Choose a term'/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {terms.map((t) => (
                                                <SelectItem key={t.uuid} value={t.uuid}>
                                                    {termLabel(t)}{t.status === 'ACTIVE' ? ' (current)' : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {!terms.length && <p className='text-xs text-destructive'>Set up a term in Schedules first.</p>}
                                </div>
                            )}

                            {dialog.mode === 'export' && (
                                <DialogFooter>
                                    {(['csv', 'xlsx'] as const).map((format) => (
                                        <Button
                                            key={format}
                                            variant={format === 'xlsx' ? 'default' : 'outline'}
                                            disabled={busy || !termUuid}
                                            onClick={() => exportNow(dialog.type, format, termUuid)}
                                        >
                                            <ArrowDownToLine className='h-4 w-4'/> {format === 'csv' ? 'CSV' : 'Excel'}
                                        </Button>
                                    ))}
                                </DialogFooter>
                            )}

                            {dialog.mode === 'import' && !result && (
                                <div className='space-y-4'>
                                    <div className='rounded-[10px] bg-muted/50 p-4 text-sm'>
                                        <p className='mb-2 font-medium'>Columns</p>
                                        <ul className='grid gap-1 sm:grid-cols-2'>
                                            {meta.columns
                                                .filter((c) => !c.exportOnly)
                                                .map((c) => (
                                                    <li key={c.key}>
                                                        <span className='font-medium'>{c.label}</span>
                                                        {c.required && <span className='text-destructive'> *</span>}
                                                        {c.hint && <span className='block text-xs text-muted-foreground'>{c.hint}</span>}
                                                    </li>
                                                ))}
                                        </ul>
                                        <div className='mt-3 flex flex-wrap gap-2'>
                                            <Button size='sm' variant='outline' onClick={() => template('xlsx')}>Excel template</Button>
                                            <Button size='sm' variant='outline' onClick={() => template('csv')}>CSV template</Button>
                                        </div>
                                    </div>
                                    <input
                                        ref={fileRef}
                                        type='file'
                                        accept='.csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                        className='hidden'
                                        onChange={(e) => chooseFile(e.target.files?.[0])}
                                    />
                                    <DialogFooter>
                                        <Button disabled={busy || (needsTerm && !termUuid)} onClick={() => fileRef.current?.click()}>
                                            <ArrowUpFromLine className='h-4 w-4'/>
                                            {busy ? 'Checking...' : 'Choose file'}
                                        </Button>
                                    </DialogFooter>
                                </div>
                            )}

                            {dialog.mode === 'import' && result && (
                                <div className='space-y-4'>
                                    <div className='flex flex-wrap gap-2 text-sm'>
                                        {fileName && <span className='text-muted-foreground'>{fileName}:</span>}
                                        {(Object.keys(ACTION) as ImportAction[]).map((action) => (
                                            <span key={action} className={cn('rounded-full px-2 py-0.5 text-xs font-medium', ACTION[action].className)}>
                                                {result.summary[action]} {ACTION[action].label.toLowerCase()}
                                            </span>
                                        ))}
                                    </div>
                                    <div className='max-h-72 overflow-auto rounded-[10px] border border-border'>
                                        <table className='w-full text-sm'>
                                            <thead className='sticky top-0 bg-muted text-left text-xs text-muted-foreground'>
                                                <tr>
                                                    <th className='px-3 py-2 font-medium'>Row</th>
                                                    <th className='px-3 py-2 font-medium'>Record</th>
                                                    <th className='px-3 py-2 font-medium'>Result</th>
                                                    <th className='px-3 py-2 font-medium'>Details</th>
                                                </tr>
                                            </thead>
                                            <tbody className='divide-y divide-border'>
                                                {result.rows.map((r) => (
                                                    <tr key={r.row}>
                                                        <td className='px-3 py-2 tabular-nums text-muted-foreground'>{r.row}</td>
                                                        <td className='px-3 py-2 font-mono text-xs'>{r.key || '—'}</td>
                                                        <td className='px-3 py-2'>
                                                            <span className={cn('whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium', ACTION[r.action].className)}>
                                                                {ACTION[r.action].label}
                                                            </span>
                                                        </td>
                                                        <td className='px-3 py-2 text-xs'>
                                                            {r.errors.length ? (
                                                                <span className='text-destructive'>{r.errors.join('; ')}</span>
                                                            ) : r.changes.length ? (
                                                                <span className='text-muted-foreground'>{r.changes.join(', ')}</span>
                                                            ) : null}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {result.summary.error > 0 && (
                                        <p className='flex items-start gap-2 text-sm text-muted-foreground'>
                                            <AlertCircle className='mt-0.5 h-4 w-4 shrink-0 text-destructive'/>
                                            {imported ? 'Rows with errors were not imported.' : 'Rows with errors are skipped.'} Fix them in the file and import it again.
                                            <button type='button' className='shrink-0 text-primary hover:underline' onClick={downloadErrors}>
                                                Download them
                                            </button>
                                        </p>
                                    )}
                                    <DialogFooter>
                                        {imported ? (
                                            <Button onClick={close}>Done</Button>
                                        ) : (
                                            <>
                                                <Button variant='outline' disabled={busy} onClick={() => setResult(null)}>Choose another file</Button>
                                                <Button disabled={busy || toSave === 0} onClick={() => fileRows && check(fileRows, false)}>
                                                    {busy ? 'Importing...' : `Import ${toSave} ${toSave === 1 ? 'row' : 'rows'}`}
                                                </Button>
                                            </>
                                        )}
                                    </DialogFooter>
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
