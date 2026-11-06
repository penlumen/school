'use client';

import Link from 'next/link';
import {ChevronRight} from 'lucide-react';

import {naira, toNumber} from '@/hooks/billing';
import type {ParentInvoice} from '@/hooks/parent';
import {InvoiceStatusBadge} from '@/components/app/billing-ui';

const formatDate = (value: string | null) =>
    value ? new Date(value).toLocaleDateString('en-GB', {timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric'}) : null;

/** Invoices as tappable rows: what it's for, how much is left, and its status. */
export function ParentInvoiceList({invoices, showStudent = true}: { invoices: ParentInvoice[]; showStudent?: boolean }) {
    if (invoices.length === 0) {
        return (
            <p className='rounded-[10px] border border-dashed border-border p-8 text-center text-sm text-muted-foreground'>
                No invoices yet.
            </p>
        );
    }

    return (
        <ul className='divide-y divide-border overflow-hidden rounded-[10px] border border-border'>
            {invoices.map((invoice) => {
                const closed = invoice.status === 'CANCELLED' || invoice.status === 'REFUNDED';
                const balance = closed ? 0 : Math.max(0, toNumber(invoice.total) - toNumber(invoice.paid));
                const due = formatDate(invoice.due_at);
                return (
                    <li key={invoice.uuid}>
                        <Link href={`/parent/fees/${invoice.uuid}`} className='flex items-center gap-4 p-4 transition-colors hover:bg-muted/50'>
                            <div className='min-w-0 flex-1'>
                                <p className='font-medium'>{invoice.template?.name || 'Invoice'}</p>
                                <p className='text-sm text-muted-foreground'>
                                    {invoice.number}
                                    {showStudent && ` · ${invoice.student.name}`}
                                    {due && !closed && balance > 0 && ` · Due ${due}`}
                                </p>
                            </div>
                            <div className='text-right'>
                                <p className='font-medium'>{balance > 0 ? naira(balance) : naira(invoice.total)}</p>
                                <p className='text-xs text-muted-foreground'>
                                    {balance > 0 ? `of ${naira(invoice.total)} left` : closed ? '' : 'Paid in full'}
                                </p>
                            </div>
                            <div className='hidden w-32 justify-end sm:flex'>
                                <InvoiceStatusBadge status={invoice.status}/>
                            </div>
                            <ChevronRight className='h-4 w-4 text-muted-foreground'/>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
