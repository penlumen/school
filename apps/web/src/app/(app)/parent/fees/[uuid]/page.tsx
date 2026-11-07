'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {ArrowLeft, Clock3, CreditCard, Printer, XCircle} from 'lucide-react';

import {INVOICE_STATUS_LABEL, type InvoiceDetail, naira, toNumber} from '@/hooks/billing';
import {useParent} from '@/hooks/parent';
import {type OnlinePayment, usePayments} from '@/hooks/payments';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {InvoiceStatusBadge} from '@/components/app/billing-ui';
import {InvoiceDocument} from '@/components/app/invoice-document';
import {PayInvoiceDialog} from '@/components/app/pay-invoice-dialog';

export default function ParentInvoicePage() {
    const {uuid} = useParams<{ uuid: string }>();
    const {invoice: fetchInvoice} = useParent();
    const {options: fetchOptions} = usePayments();
    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [online, setOnline] = useState<OnlinePayment[]>([]);
    const [missing, setMissing] = useState(false);
    const [options, setOptions] = useState<{ enabled: boolean; allow_part_payment: boolean } | null>(null);
    const [payOpen, setPayOpen] = useState(false);

    const load = () =>
        fetchInvoice(uuid).then((r) => {
            if (!r.success) return setMissing(true);
            setInvoice(r.data.invoice);
            setOnline(r.data.online_payments || []);
        });

    useEffect(() => {
        load();
        fetchOptions().then((r) => r.success && setOptions(r.data)).catch(() => undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid]);

    if (missing) {
        return (
            <div className='py-20 text-center'>
                <p className='font-medium'>Invoice not found</p>
                <Link href='/parent/fees' className='mt-2 inline-block text-sm text-primary hover:underline'>Back to fees</Link>
            </div>
        );
    }

    if (!invoice) {
        return <Skeleton className='mx-auto aspect-[210/297] w-full max-w-[794px]'/>;
    }

    const closed = invoice.status === 'CANCELLED' || invoice.status === 'REFUNDED';
    const balance = closed ? 0 : Math.max(0, toNumber(invoice.total) - toNumber(invoice.paid));
    // Parents see payments and refunds, not internal notes about the invoice being issued.
    const payments = invoice.history.filter((h) => toNumber(h.amount) > 0);
    const awaiting = online
        .filter((p) => p.status === 'AWAITING_CONFIRMATION')
        .reduce((sum, p) => sum + toNumber(p.amount), 0);
    const payable = Math.max(0, balance - awaiting);
    const canPay = !!options?.enabled && payable > 0 && (invoice.status === 'PENDING' || invoice.status === 'PART_PAYMENT');

    return (
        <div className='space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                <div>
                    <Link href='/parent/fees' className='mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground'>
                        <ArrowLeft className='h-4 w-4'/> Fees
                    </Link>
                    <h1 className='text-xl font-medium'>{invoice.number}</h1>
                    <p className='mt-1 text-muted-foreground'>{invoice.student.name}{invoice.student.class ? ` · ${invoice.student.class.name}` : ''}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Button
                        variant={canPay ? 'outline' : 'default'}
                        onClick={() => window.open(`/print/invoice/${invoice.uuid}`, '_blank')}
                    >
                        <Printer className='h-4 w-4'/>
                        Print or save as PDF
                    </Button>
                    {canPay && (
                        <Button onClick={() => setPayOpen(true)}>
                            <CreditCard className='h-4 w-4'/>
                            Pay now
                        </Button>
                    )}
                </div>
            </div>

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
                            ['Balance', naira(balance)],
                        ].map(([label, value]) => (
                            <div key={label} className='flex justify-between gap-3'>
                                <dt className='text-muted-foreground'>{label}</dt>
                                <dd className='font-medium'>{value}</dd>
                            </div>
                        ))}
                    </dl>
                    {canPay && (
                        <Button className='w-full' onClick={() => setPayOpen(true)}>
                            <CreditCard className='h-4 w-4'/>
                            Pay {naira(payable)} online
                        </Button>
                    )}
                    {online.length > 0 && (
                        <ul className='space-y-2'>
                            {online.map((p) => (
                                <li
                                    key={p.uuid}
                                    className={
                                        p.status === 'REJECTED'
                                            ? 'rounded-md bg-destructive-muted p-3 text-sm'
                                            : 'rounded-md bg-warning-muted p-3 text-sm'
                                    }
                                >
                                    <p className='flex items-center gap-1.5 font-medium'>
                                        {p.status === 'REJECTED' ? <XCircle className='h-4 w-4 text-destructive'/> : <Clock3 className='h-4 w-4 text-warning-foreground'/>}
                                        {naira(p.amount)} · {p.status === 'REJECTED' ? 'Not confirmed' : 'Waiting for the school to confirm'}
                                    </p>
                                    <p className='mt-0.5 text-xs text-muted-foreground'>
                                        Ref {p.reference}
                                        {p.status === 'REJECTED' && p.note ? ` · ${p.note}` : ''}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div>
                        <h3 className='mb-2 text-sm font-medium'>Payments received</h3>
                        {payments.length === 0 ? (
                            <p className='text-sm text-muted-foreground'>No payments recorded yet.</p>
                        ) : (
                            <ul className='space-y-3'>
                                {payments.map((p) => (
                                    <li key={p.uuid} className='text-sm'>
                                        <p className='font-medium'>
                                            {p.status === 'REFUNDED' ? 'Refund' : 'Payment'} · {naira(p.amount)}
                                        </p>
                                        <p className='text-xs text-muted-foreground'>
                                            {new Date(p.created_at).toLocaleDateString('en-GB', {dateStyle: 'medium'})} · {INVOICE_STATUS_LABEL[p.status]}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>
            </div>

            {options && (
                <PayInvoiceDialog
                    open={payOpen}
                    onOpenChange={setPayOpen}
                    invoiceUuid={invoice.uuid}
                    balance={payable}
                    allowPart={options.allow_part_payment}
                    onFinished={load}
                />
            )}
        </div>
    );
}
