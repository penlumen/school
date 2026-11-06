'use client';

import type React from 'react';
import {Ban, CheckCircle2, CircleDashed, Clock3, Plus, RotateCcw, Trash2} from 'lucide-react';

import {INVOICE_STATUS_LABEL, type InvoiceStatus, type TemplateStatus} from '@/hooks/billing';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {cn} from '@/lib/utils';

/** Title, subtitle and primary action at the top of a billing page. */
export function BillingHeader({
    title,
    description,
    action,
    children,
}: {
    title: string;
    description?: string | null;
    action?: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
            <div className='min-w-0'>
                {children}
                <h1 className='text-xl font-medium leading-7 text-foreground'>{title}</h1>
                {description && <p className='mt-2 text-base text-muted-foreground'>{description}</p>}
            </div>
            {action}
        </div>
    );
}

const INVOICE_BADGE: Record<InvoiceStatus, { className: string; icon: React.ElementType }> = {
    PENDING: {className: 'bg-warning-muted text-warning-foreground', icon: Clock3},
    PART_PAYMENT: {className: 'bg-accent text-accent-foreground', icon: CircleDashed},
    FULL_PAYMENT: {className: 'bg-success-muted text-success-foreground', icon: CheckCircle2},
    CANCELLED: {className: 'bg-muted text-muted-foreground', icon: Ban},
    REFUNDED: {className: 'bg-destructive-muted text-destructive', icon: RotateCcw},
};

export function InvoiceStatusBadge({status}: { status: InvoiceStatus }) {
    const {className, icon: Icon} = INVOICE_BADGE[status];
    return (
        <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium', className)}>
            <Icon className='h-3.5 w-3.5'/>
            {INVOICE_STATUS_LABEL[status]}
        </span>
    );
}

export function TemplateStatusBadge({status}: { status: TemplateStatus }) {
    const active = status === 'ACTIVE';
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                active ? 'bg-success-muted text-success-foreground' : 'bg-muted text-muted-foreground',
            )}
        >
            {active ? <CheckCircle2 className='h-3.5 w-3.5'/> : <Ban className='h-3.5 w-3.5'/>}
            {active ? 'Active' : 'Inactive'}
        </span>
    );
}

export interface FeeRow {
    key: string;
    description: string;
    amount: string;
}

export const newFeeRow = (): FeeRow => ({key: crypto.randomUUID(), description: '', amount: ''});

/** Editable list of fee lines (description + amount) used when building a template. */
export function FeeItemsEditor({rows, onChange}: { rows: FeeRow[]; onChange: (rows: FeeRow[]) => void }) {
    const update = (key: string, patch: Partial<FeeRow>) =>
        onChange(rows.map((row) => (row.key === key ? {...row, ...patch} : row)));
    const total = rows.reduce((sum, row) => sum + (Number(row.amount.replace(/,/g, '')) || 0), 0);

    return (
        <div className='space-y-3'>
            <Label>Fees</Label>
            {rows.map((row, index) => (
                <div key={row.key} className='grid grid-cols-[1fr_120px_auto] items-center gap-2'>
                    <Input
                        aria-label={`Fee ${index + 1} description`}
                        placeholder='e.g. Tuition fee'
                        value={row.description}
                        onChange={(e) => update(row.key, {description: e.target.value})}
                    />
                    <div className='relative'>
                        <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>₦</span>
                        <Input
                            aria-label={`Fee ${index + 1} amount`}
                            inputMode='decimal'
                            placeholder='0'
                            className='pl-7'
                            value={row.amount}
                            onChange={(e) => update(row.key, {amount: e.target.value.replace(/[^\d.,]/g, '')})}
                        />
                    </div>
                    <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        aria-label={`Remove fee ${index + 1}`}
                        disabled={rows.length <= 1}
                        onClick={() => onChange(rows.filter((r) => r.key !== row.key))}
                    >
                        <Trash2 className='h-4 w-4'/>
                    </Button>
                </div>
            ))}
            <div className='flex items-center justify-between'>
                <Button type='button' variant='outline' size='sm' onClick={() => onChange([...rows, newFeeRow()])}>
                    <Plus className='h-4 w-4'/>
                    Add fee
                </Button>
                <p className='text-sm'>
                    <span className='text-muted-foreground'>Total </span>
                    <span className='font-medium'>₦{total.toLocaleString('en-NG')}</span>
                </p>
            </div>
        </div>
    );
}

/** Keeps only fee rows with a description, as the API expects. */
export const feeRowsToItems = (rows: FeeRow[]) =>
    rows
        .filter((row) => row.description.trim())
        .map((row) => ({description: row.description.trim(), amount: row.amount.replace(/,/g, '') || '0'}));
