'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {toast} from 'sonner';
import {Check, ShieldCheck, X} from 'lucide-react';

import {naira, toNumber} from '@/hooks/billing';
import {type OnlinePayment, type OnlinePaymentStatus, PAYMENT_STATUS_LABEL, usePayments} from '@/hooks/payments';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {BillingHeader} from '@/components/app/billing-ui';
import {cn} from '@/lib/utils';

const ALL = 'all';
const FILTERS: (OnlinePaymentStatus | typeof ALL)[] = ['AWAITING_CONFIRMATION', 'SUCCESS', 'REJECTED', 'FAILED', ALL];

const BADGE: Record<OnlinePaymentStatus, string> = {
    PENDING: 'bg-muted text-muted-foreground',
    AWAITING_CONFIRMATION: 'bg-warning-muted text-warning-foreground',
    SUCCESS: 'bg-success-muted text-success-foreground',
    FAILED: 'bg-muted text-muted-foreground',
    REJECTED: 'bg-destructive-muted text-destructive',
};

const when = (value: string) =>
    new Date(value).toLocaleString('en-GB', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'});

/** Billings › Payments: online payments from parents, and the ones waiting for staff. */
export default function PaymentsPage() {
    const {index, confirm, reject} = usePayments();
    const [filter, setFilter] = useState<OnlinePaymentStatus | typeof ALL>('AWAITING_CONFIRMATION');
    const [payments, setPayments] = useState<OnlinePayment[] | null>(null);
    const [verification, setVerification] = useState<'automatic' | 'manual' | null>(null);
    const [busy, setBusy] = useState<string | null>(null);
    const [rejecting, setRejecting] = useState<OnlinePayment | null>(null);
    const [note, setNote] = useState('');

    const load = () => {
        setPayments(null);
        index(filter === ALL ? undefined : filter).then((r) => {
            if (!r.success) {
                toast.error(r.message);
                setPayments([]);
                return;
            }
            setPayments(r.data.payments);
            setVerification(r.data.verification);
        });
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const doConfirm = async (payment: OnlinePayment) => {
        setBusy(payment.uuid);
        try {
            const r = await confirm(payment.uuid);
            if (!r.success) return toast.error(r.message);
            toast.success(`${naira(payment.amount)} added to ${payment.invoice?.number}`);
            load();
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
        } finally {
            setBusy(null);
        }
    };

    const doReject = async () => {
        if (!rejecting) return;
        setBusy(rejecting.uuid);
        try {
            const r = await reject(rejecting.uuid, note);
            if (!r.success) return toast.error(r.message);
            toast.success('Payment rejected. The parent has been told.');
            setRejecting(null);
            setNote('');
            load();
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className='space-y-6'>
            <BillingHeader title='Payments' description='Invoice payments parents made online with Paystack'/>

            {verification === 'manual' && (
                <div className='rounded-[10px] bg-warning-muted p-4 text-sm'>
                    Payments can&apos;t be checked with Paystack automatically because no secret key is set. Before you
                    confirm a payment, find its reference in your Paystack dashboard.{' '}
                    <Link href='/staff/school-settings' className='font-medium text-primary hover:underline'>Payment settings</Link>
                </div>
            )}
            {verification === 'automatic' && filter === 'AWAITING_CONFIRMATION' && (
                <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <ShieldCheck className='h-4 w-4 text-success'/>
                    Paystack confirms payments automatically. Anything here needs a closer look, such as an amount that
                    didn&apos;t match. Confirming checks with Paystack again first.
                </p>
            )}

            <Select value={filter} onValueChange={(v) => setFilter(v as OnlinePaymentStatus | typeof ALL)}>
                <SelectTrigger className='w-48' aria-label='Filter by status'>
                    <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                    {FILTERS.map((f) => (
                        <SelectItem key={f} value={f}>{f === ALL ? 'All payments' : PAYMENT_STATUS_LABEL[f]}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader className='bg-muted/50 [&_tr]:border-0'>
                        <TableRow>
                            <TableHead className='pl-4'>Date</TableHead>
                            <TableHead>Student</TableHead>
                            <TableHead>Paid by</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead className='text-right'>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='pr-4 text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments === null &&
                            Array.from({length: 4}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={7}><Skeleton className='h-6 w-full'/></TableCell>
                                </TableRow>
                            ))}
                        {payments?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className='py-10 text-center text-muted-foreground'>
                                    {filter === 'AWAITING_CONFIRMATION' ? 'Nothing waiting for confirmation.' : 'No payments yet.'}
                                </TableCell>
                            </TableRow>
                        )}
                        {payments?.map((p) => (
                            <TableRow key={p.uuid}>
                                <TableCell className='whitespace-nowrap pl-4'>{when(p.paid_at || p.created_at)}</TableCell>
                                <TableCell>
                                    <p>{p.invoice?.student.name}</p>
                                    <Link href={`/staff/invoices/${p.invoice?.uuid}`} className='text-xs text-primary hover:underline'>
                                        {p.invoice?.number}
                                    </Link>
                                </TableCell>
                                <TableCell>{p.user?.name || '—'}</TableCell>
                                <TableCell className='font-mono text-xs'>
                                    {p.reference}
                                    {p.note && <p className='font-sans text-muted-foreground'>{p.note}</p>}
                                </TableCell>
                                <TableCell className='whitespace-nowrap text-right'>
                                    {naira(p.amount)}
                                    {toNumber(p.fee) > 0 && <p className='text-xs text-muted-foreground'>+ {naira(p.fee)} fee</p>}
                                </TableCell>
                                <TableCell>
                                    <span className={cn('whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium', BADGE[p.status])}>
                                        {PAYMENT_STATUS_LABEL[p.status]}
                                    </span>
                                    {p.status === 'SUCCESS' && (
                                        <p className='mt-1 text-xs text-muted-foreground'>{p.verified ? 'Checked by Paystack' : 'Confirmed by staff'}</p>
                                    )}
                                </TableCell>
                                <TableCell className='pr-4 text-right'>
                                    {p.status === 'AWAITING_CONFIRMATION' && (
                                        <div className='flex justify-end gap-2'>
                                            <Button size='sm' disabled={busy !== null} onClick={() => doConfirm(p)}>
                                                <Check className='h-4 w-4'/> Confirm
                                            </Button>
                                            <Button size='sm' variant='outline' disabled={busy !== null} onClick={() => setRejecting(p)}>
                                                <X className='h-4 w-4'/> Reject
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!rejecting} onOpenChange={(open) => !open && setRejecting(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject this payment?</DialogTitle>
                        <DialogDescription>
                            {rejecting && `${naira(rejecting.amount)} from ${rejecting.user?.name || 'a parent'}, reference ${rejecting.reference}. `}
                            Nothing is added to the invoice, and the parent is told.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-2'>
                        <Label htmlFor='reject-note'>Reason (shown to the parent)</Label>
                        <Textarea
                            id='reject-note'
                            value={note}
                            maxLength={300}
                            placeholder='e.g. No matching payment in our Paystack account'
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setRejecting(null)}>Cancel</Button>
                        <Button variant='destructive' disabled={busy !== null} onClick={doReject}>Reject payment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
