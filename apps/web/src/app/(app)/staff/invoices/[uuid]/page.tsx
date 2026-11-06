'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {ArrowLeft, Printer} from 'lucide-react';

import {INVOICE_STATUS_LABEL, type InvoiceDetail, naira, toNumber, useBilling} from '@/hooks/billing';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {BillingHeader, InvoiceStatusBadge} from '@/components/app/billing-ui';
import {InvoiceDocument} from '@/components/app/invoice-document';
import {UpdateStatusSheet} from '@/components/app/invoice-sheets';

export default function InvoicePage() {
    const {uuid} = useParams<{ uuid: string }>();
    const {invoice: fetchInvoice} = useBilling();
    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [missing, setMissing] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);

    const load = () =>
        fetchInvoice(uuid).then((response) => {
            if (response.success) setInvoice(response.data.invoice);
            else setMissing(true);
        });

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid]);

    if (missing) {
        return (
            <div className='py-20 text-center'>
                <p className='font-medium'>Invoice not found</p>
                <Link href='/staff/invoices' className='mt-2 inline-block text-sm text-primary hover:underline'>Back to invoices</Link>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className='space-y-4'>
                <Skeleton className='h-8 w-64'/>
                <Skeleton className='mx-auto aspect-[210/297] w-full max-w-[794px]'/>
            </div>
        );
    }

    const balance = Math.max(0, toNumber(invoice.total) - toNumber(invoice.paid));

    return (
        <div className='space-y-6'>
            <BillingHeader
                title={invoice.number}
                description={`${invoice.student.name}${invoice.student.class ? ` · ${invoice.student.class.name}` : ''}`}
                action={
                    <div className='flex flex-wrap gap-3'>
                        <Button variant='outline' onClick={() => setStatusOpen(true)}>Update status</Button>
                        <Button onClick={() => window.open(`/print/invoice/${invoice.uuid}`, '_blank')}>
                            <Printer className='h-4 w-4'/>
                            Print
                        </Button>
                    </div>
                }
            >
                <Link href='/staff/invoices' className='mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground'>
                    <ArrowLeft className='h-4 w-4'/> Invoices
                </Link>
            </BillingHeader>

            <div className='grid gap-6 xl:grid-cols-[minmax(0,794px)_1fr]'>
                <InvoiceDocument invoice={invoice}/>

                <aside className='h-fit space-y-5 rounded-[10px] border border-border p-5'>
                    <div className='flex items-center justify-between'>
                        <h2 className='font-medium'>Payment</h2>
                        <InvoiceStatusBadge status={invoice.status}/>
                    </div>
                    <dl className='space-y-1.5 text-sm'>
                        {[
                            ['Total', naira(invoice.total)],
                            ['Paid', naira(invoice.paid)],
                            ['Balance', naira(invoice.status === 'CANCELLED' ? 0 : balance)],
                        ].map(([label, value]) => (
                            <div key={label} className='flex justify-between gap-3'>
                                <dt className='text-muted-foreground'>{label}</dt>
                                <dd className='font-medium'>{value}</dd>
                            </div>
                        ))}
                    </dl>
                    <div>
                        <h3 className='mb-3 text-sm font-medium'>History</h3>
                        <ol className='space-y-4 border-l border-border pl-4'>
                            {invoice.history.map((entry) => (
                                <li key={entry.uuid} className='relative'>
                                    <span className='absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary'/>
                                    <p className='text-sm font-medium'>
                                        {INVOICE_STATUS_LABEL[entry.status]}
                                        {toNumber(entry.amount) > 0 && <span className='font-normal text-muted-foreground'> · {naira(entry.amount)}</span>}
                                    </p>
                                    {entry.description && <p className='text-sm text-muted-foreground'>{entry.description}</p>}
                                    <p className='text-xs text-muted-foreground'>
                                        {new Date(entry.created_at).toLocaleString('en-GB', {dateStyle: 'medium', timeStyle: 'short'})}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                    {invoice.template && (
                        <p className='text-xs text-muted-foreground'>
                            Issued from <Link href={`/staff/templates/${invoice.template.uuid}`} className='text-primary hover:underline'>{invoice.template.name}</Link>
                        </p>
                    )}
                </aside>
            </div>

            <UpdateStatusSheet
                invoice={statusOpen ? invoice : null}
                onOpenChange={setStatusOpen}
                onUpdated={() => load()}
            />
        </div>
    );
}
