'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {toast} from 'sonner';
import {ArrowLeft, Check, PencilLine, Plus, Trash2, X} from 'lucide-react';

import {type BillingTemplate, naira, templateTotal, toNumber, useBilling} from '@/hooks/billing';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Skeleton} from '@/components/ui/skeleton';
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {BillingHeader, type FeeRow, feeRowsToItems, newFeeRow, TemplateStatusBadge} from '@/components/app/billing-ui';
import {TemplateFormSheet} from '@/components/app/template-form-sheet';

const toRows = (template: BillingTemplate): FeeRow[] =>
    template.items.map((item) => ({
        key: item.uuid || crypto.randomUUID(),
        description: item.description,
        amount: String(toNumber(item.amount)),
    }));

export default function BillingTemplatePage() {
    const {uuid} = useParams<{ uuid: string }>();
    const {template: fetchTemplate, updateTemplate} = useBilling();
    const [template, setTemplate] = useState<BillingTemplate | null>(null);
    const [missing, setMissing] = useState(false);
    const [editing, setEditing] = useState(false);
    const [rows, setRows] = useState<FeeRow[]>([]);
    const [saving, setSaving] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    useEffect(() => {
        fetchTemplate(uuid).then((response) => {
            if (response.success) setTemplate(response.data.template);
            else setMissing(true);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid]);

    if (missing) {
        return (
            <div className='py-20 text-center'>
                <p className='font-medium'>Template not found</p>
                <Link href='/staff/templates' className='mt-2 inline-block text-sm text-primary hover:underline'>Back to templates</Link>
            </div>
        );
    }

    if (!template) {
        return (
            <div className='space-y-4'>
                <Skeleton className='h-8 w-64'/>
                <Skeleton className='h-48 w-full'/>
            </div>
        );
    }

    const startEditing = (addRow = false) => {
        setRows(addRow ? [...toRows(template), newFeeRow()] : toRows(template));
        setEditing(true);
    };

    const saveFees = async () => {
        const items = feeRowsToItems(rows);
        if (!items.length) {
            toast.error('A template needs at least one fee');
            return;
        }
        setSaving(true);
        try {
            const response = await updateTemplate(template.uuid, {items});
            if (response.success) {
                setTemplate(response.data.template);
                setEditing(false);
                toast.success('Fees saved');
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    const setRow = (key: string, patch: Partial<FeeRow>) =>
        setRows((current) => current.map((row) => (row.key === key ? {...row, ...patch} : row)));

    const draftTotal = rows.reduce((sum, row) => sum + (Number(row.amount.replace(/,/g, '')) || 0), 0);

    return (
        <div className='space-y-8'>
            <BillingHeader
                title={template.name}
                description={template.description}
                action={
                    <div className='flex flex-wrap gap-3'>
                        <Button variant='outline' onClick={() => setDetailsOpen(true)}>Edit details</Button>
                        <Button onClick={() => (editing ? setRows((r) => [...r, newFeeRow()]) : startEditing(true))}>
                            <Plus className='h-4 w-4'/>
                            Add fee
                        </Button>
                    </div>
                }
            >
                <Link href='/staff/templates' className='mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground'>
                    <ArrowLeft className='h-4 w-4'/> Billing templates
                </Link>
            </BillingHeader>

            <div className='flex flex-wrap items-center gap-3 text-sm'>
                <TemplateStatusBadge status={template.status}/>
                <span className='text-muted-foreground'>
                    {template._count?.invoices
                        ? `Used for ${template._count.invoices} ${template._count.invoices === 1 ? 'invoice' : 'invoices'}. Changes only apply to new invoices.`
                        : 'Not used for any invoices yet.'}
                </span>
            </div>

            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-base font-medium'>Fees</h2>
                    {editing ? (
                        <div className='flex gap-2'>
                            <Button variant='outline' size='sm' onClick={() => setEditing(false)} disabled={saving}>
                                <X className='h-4 w-4'/> Cancel
                            </Button>
                            <Button size='sm' onClick={saveFees} disabled={saving}>
                                <Check className='h-4 w-4'/> {saving ? 'Saving...' : 'Save changes'}
                            </Button>
                        </div>
                    ) : (
                        <Button variant='outline' size='sm' onClick={() => startEditing()}>
                            <PencilLine className='h-4 w-4'/> Edit fees
                        </Button>
                    )}
                </div>

                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader className='bg-muted/50 [&_tr]:border-0'>
                            <TableRow>
                                <TableHead className='pl-6'>Description</TableHead>
                                <TableHead className='w-56'>Amount</TableHead>
                                <TableHead className='w-24 text-center'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(editing ? rows : toRows(template)).map((row) => (
                                <TableRow key={row.key} className='h-14'>
                                    <TableCell className='pl-6'>
                                        {editing ? (
                                            <Input
                                                aria-label='Fee description'
                                                value={row.description}
                                                placeholder='e.g. Tuition fee'
                                                onChange={(e) => setRow(row.key, {description: e.target.value})}
                                            />
                                        ) : (
                                            row.description
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editing ? (
                                            <div className='relative'>
                                                <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>₦</span>
                                                <Input
                                                    aria-label='Fee amount'
                                                    inputMode='decimal'
                                                    className='pl-7'
                                                    value={row.amount}
                                                    onChange={(e) => setRow(row.key, {amount: e.target.value.replace(/[^\d.,]/g, '')})}
                                                />
                                            </div>
                                        ) : (
                                            naira(row.amount)
                                        )}
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            aria-label={`Remove ${row.description || 'fee'}`}
                                            onClick={() => {
                                                if (editing) setRows((current) => current.filter((r) => r.key !== row.key));
                                                else {
                                                    setRows(toRows(template).filter((r) => r.key !== row.key));
                                                    setEditing(true);
                                                }
                                            }}
                                        >
                                            <Trash2 className='h-4 w-4'/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter className='bg-transparent'>
                            <TableRow>
                                <TableCell className='pl-6 font-medium'>Total</TableCell>
                                <TableCell className='font-medium'>{naira(editing ? draftTotal : templateTotal(template))}</TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
                {editing && <p className='text-xs text-muted-foreground'>Removed and edited fees are only saved after Save changes.</p>}
            </div>

            <TemplateFormSheet
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                template={template}
                onSaved={(saved) => setTemplate(saved)}
            />
        </div>
    );
}
