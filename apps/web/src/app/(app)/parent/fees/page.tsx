'use client';

import {useEffect, useMemo, useState} from 'react';
import {toast} from 'sonner';

import {naira, toNumber} from '@/hooks/billing';
import {type ParentInvoice, useParent} from '@/hooks/parent';
import {Skeleton} from '@/components/ui/skeleton';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {BillingHeader} from '@/components/app/billing-ui';
import {ParentInvoiceList} from '@/components/app/parent-invoice-list';

const ALL = 'all';

export default function ParentFeesPage() {
    const {invoices: fetchInvoices} = useParent();
    const [invoices, setInvoices] = useState<ParentInvoice[] | null>(null);
    const [outstanding, setOutstanding] = useState(0);
    const [child, setChild] = useState(ALL);

    useEffect(() => {
        fetchInvoices().then((r) => {
            if (r.success) {
                setInvoices(r.data.invoices);
                setOutstanding(r.data.outstanding);
            } else {
                toast.error(r.message);
                setInvoices([]);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const children = useMemo(() => {
        const map = new Map<string, string>();
        (invoices || []).forEach((i) => map.set(i.student.uuid, i.student.name));
        return Array.from(map, ([uuid, name]) => ({uuid, name}));
    }, [invoices]);

    const shown = (invoices || []).filter((i) => child === ALL || i.student.uuid === child);
    const paid = (invoices || []).reduce((sum, i) => sum + toNumber(i.paid), 0);
    const billed = (invoices || []).filter((i) => i.status !== 'CANCELLED').reduce((sum, i) => sum + toNumber(i.total), 0);

    return (
        <div className='space-y-6'>
            <BillingHeader title='Fees' description='Invoices for your children, what has been paid and what is still owed'/>

            <div className='grid gap-4 sm:grid-cols-3'>
                {[
                    {label: 'Outstanding', value: outstanding, highlight: outstanding > 0},
                    {label: 'Paid so far', value: paid},
                    {label: 'Total billed', value: billed},
                ].map((stat) => (
                    <div key={stat.label} className='rounded-[10px] border border-border p-4'>
                        <p className='text-sm text-muted-foreground'>{stat.label}</p>
                        {invoices === null ? (
                            <Skeleton className='mt-2 h-8 w-28'/>
                        ) : (
                            <p className={`mt-1 text-2xl font-semibold ${stat.highlight ? 'text-warning-foreground' : ''}`}>{naira(stat.value)}</p>
                        )}
                    </div>
                ))}
            </div>

            <div className='flex items-center justify-between gap-3'>
                <h2 className='text-lg font-medium'>Invoices</h2>
                {children.length > 1 && (
                    <Select value={child} onValueChange={setChild}>
                        <SelectTrigger className='w-48' aria-label='Filter by child'>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All children</SelectItem>
                            {children.map((c) => <SelectItem key={c.uuid} value={c.uuid}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {invoices === null ? <Skeleton className='h-40 rounded-[10px]'/> : <ParentInvoiceList invoices={shown}/>}

            <p className='text-sm text-muted-foreground'>
                To pay, use the payment details on the invoice or contact the school office. Payments are recorded here once the school confirms them.
            </p>
        </div>
    );
}
