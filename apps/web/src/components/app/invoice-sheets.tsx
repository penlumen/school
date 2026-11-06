'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';

import {
    type BillingTemplate,
    INVOICE_STATUS_LABEL,
    type InvoiceListItem,
    type InvoiceStatus,
    naira,
    templateTotal,
    toNumber,
    useBilling,
} from '@/hooks/billing';
import {useStudent} from '@/hooks/student';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Sheet, SheetContent, SheetHeader, SheetTitle} from '@/components/ui/sheet';
import type {StudentRecord} from '@/components/app/student-form-sheet';
import {StudentPicker} from '@/components/app/student-picker';

export function CreateInvoiceSheet({
    open,
    onOpenChange,
    onCreated,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (invoices: InvoiceListItem[]) => void;
}) {
    const {templates: fetchTemplates, createInvoices} = useBilling();
    const {index: fetchStudents} = useStudent();
    const [templates, setTemplates] = useState<BillingTemplate[]>([]);
    const [students, setStudents] = useState<StudentRecord[]>([]);
    const [studentUuids, setStudentUuids] = useState<string[]>([]);
    const [templateUuid, setTemplateUuid] = useState('');
    const [dueAt, setDueAt] = useState('');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        setStudentUuids([]);
        setTemplateUuid('');
        setDueAt('');
        setNote('');
        fetchTemplates().then((r) => r.success && setTemplates(r.data.templates.filter((t: BillingTemplate) => t.status === 'ACTIVE')));
        fetchStudents().then((r) => r.success && setStudents(r.data.students || []));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const template = templates.find((t) => t.uuid === templateUuid);
    const total = template ? templateTotal(template) : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentUuids.length) return toast.error('Choose at least one student');
        if (!templateUuid) return toast.error('Choose a billing template');
        setSaving(true);
        try {
            const response = await createInvoices({student_uuids: studentUuids, template_uuid: templateUuid, due_at: dueAt || undefined, note});
            if (response.success) {
                toast.success(response.data.invoices.length > 1 ? `${response.data.invoices.length} invoices created` : 'Invoice created');
                onCreated(response.data.invoices);
                onOpenChange(false);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className='w-full overflow-y-auto sm:max-w-md'>
                <SheetHeader>
                    <SheetTitle className='text-xl font-medium'>Create Invoice</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-4 pb-6'>
                    <StudentPicker students={students} selected={studentUuids} onChange={setStudentUuids}/>
                    <div className='space-y-2'>
                        <Label>Billing template</Label>
                        <Select value={templateUuid} onValueChange={setTemplateUuid}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder={templates.length ? 'Select template' : 'No active templates'}/>
                            </SelectTrigger>
                            <SelectContent>
                                {templates.map((t) => (
                                    <SelectItem key={t.uuid} value={t.uuid}>
                                        {t.name} · {naira(templateTotal(t))}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='invoice-due'>Due date (optional)</Label>
                        <Input id='invoice-due' type='date' value={dueAt} onChange={(e) => setDueAt(e.target.value)}/>
                    </div>
                    <div className='space-y-2'>
                        <Label htmlFor='invoice-note'>Note to parent (optional)</Label>
                        <Textarea
                            id='invoice-note'
                            placeholder='e.g. Please pay within 15 days of receiving this invoice.'
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>

                    {template && (
                        <div className='space-y-2 rounded-[10px] border border-border p-4 text-sm'>
                            {template.items.map((item, i) => (
                                <div key={item.uuid || i} className='flex justify-between gap-3'>
                                    <span className='text-muted-foreground'>{item.description}</span>
                                    <span>{naira(item.amount)}</span>
                                </div>
                            ))}
                            <div className='flex justify-between border-t border-border pt-2 font-medium'>
                                <span>Total per student</span>
                                <span>{naira(total)}</span>
                            </div>
                            {studentUuids.length > 1 && (
                                <p className='text-xs text-muted-foreground'>
                                    {studentUuids.length} invoices · {naira(total * studentUuids.length)} in total
                                </p>
                            )}
                        </div>
                    )}

                    <Button type='submit' className='w-full' disabled={saving}>
                        {saving ? 'Creating...' : studentUuids.length > 1 ? `Create ${studentUuids.length} invoices` : 'Create invoice'}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

const STATUS_OPTIONS = Object.keys(INVOICE_STATUS_LABEL) as InvoiceStatus[];

export function UpdateStatusSheet({
    invoice,
    onOpenChange,
    onUpdated,
}: {
    invoice: InvoiceListItem | null;
    onOpenChange: (open: boolean) => void;
    onUpdated: (invoice: InvoiceListItem) => void;
}) {
    const {updateStatus} = useBilling();
    const [status, setStatus] = useState<InvoiceStatus>('PENDING');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!invoice) return;
        setStatus(invoice.status);
        setAmount('');
        setDescription('');
    }, [invoice]);

    const balance = invoice ? toNumber(invoice.total) - toNumber(invoice.paid) : 0;
    const amountLabel =
        status === 'REFUNDED' ? 'Amount refunded' : status === 'PART_PAYMENT' || status === 'FULL_PAYMENT' ? 'Amount received' : 'Amount';
    const amountDisabled = status === 'PENDING' || status === 'CANCELLED';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoice) return;
        setSaving(true);
        try {
            const response = await updateStatus(invoice.uuid, {
                status,
                amount: amountDisabled ? undefined : amount.replace(/,/g, ''),
                description,
            });
            if (response.success) {
                toast.success('Invoice status updated');
                onUpdated(response.data.invoice);
                onOpenChange(false);
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Sheet open={!!invoice} onOpenChange={onOpenChange}>
            <SheetContent className='w-full sm:max-w-md'>
                <SheetHeader>
                    <SheetTitle className='text-xl font-medium'>Update invoice status</SheetTitle>
                </SheetHeader>
                {invoice && (
                    <form onSubmit={handleSubmit} className='flex flex-col gap-5 px-4 pb-6'>
                        <div className='grid grid-cols-3 gap-2 rounded-[10px] bg-muted/50 p-3 text-xs'>
                            <div>
                                <p className='text-muted-foreground'>Total</p>
                                <p className='mt-0.5 text-sm font-medium'>{naira(invoice.total)}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground'>Paid</p>
                                <p className='mt-0.5 text-sm font-medium'>{naira(invoice.paid)}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground'>Balance</p>
                                <p className='mt-0.5 text-sm font-medium'>{naira(Math.max(0, balance))}</p>
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <Label>Status</Label>
                            <Select value={status} onValueChange={(value) => setStatus(value as InvoiceStatus)}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{INVOICE_STATUS_LABEL[s]}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='status-amount'>{amountLabel}</Label>
                            <div className='relative'>
                                <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>₦</span>
                                <Input
                                    id='status-amount'
                                    inputMode='decimal'
                                    placeholder={status === 'FULL_PAYMENT' ? String(Math.max(0, balance)) : '00'}
                                    className='pl-7'
                                    disabled={amountDisabled}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ''))}
                                />
                            </div>
                            {status === 'FULL_PAYMENT' && (
                                <p className='text-xs text-muted-foreground'>Leave blank to record the outstanding balance as paid.</p>
                            )}
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='status-description'>Description</Label>
                            <Textarea
                                id='status-description'
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <Button type='submit' className='w-full' disabled={saving}>
                            {saving ? 'Saving...' : 'Submit'}
                        </Button>
                    </form>
                )}
            </SheetContent>
        </Sheet>
    );
}
