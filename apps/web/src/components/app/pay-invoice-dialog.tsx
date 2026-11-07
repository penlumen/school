'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {Lock} from 'lucide-react';

import {naira, toNumber} from '@/hooks/billing';
import {loadPaystack, type PaymentQuote, type PaystackCheckout, usePayments} from '@/hooks/payments';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

/** Amount, fee and total, then hands over to Paystack's secure popup. */
export function PayInvoiceDialog({
    open,
    onOpenChange,
    invoiceUuid,
    balance,
    allowPart,
    onFinished,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceUuid: string;
    balance: number;
    allowPart: boolean;
    onFinished: () => void;
}) {
    const {quote: fetchQuote, checkout, complete, cancel} = usePayments();
    const [amount, setAmount] = useState(String(balance));
    const [quote, setQuote] = useState<PaymentQuote | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (open) setAmount(String(balance));
    }, [open, balance]);

    // Ask the server for the fee and total whenever the amount settles.
    useEffect(() => {
        if (!open) return;
        setQuote(null);
        setError(null);
        const timer = setTimeout(() => {
            fetchQuote(invoiceUuid, allowPart ? amount : undefined)
                .then((r) => (r.success ? setQuote(r.data) : setError(r.message)))
                .catch((e) => setError(e.message || 'Something went wrong'));
        }, 350);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, amount, invoiceUuid, allowPart]);

    const pay = async () => {
        setBusy(true);
        try {
            const r = await checkout(invoiceUuid, allowPart ? amount : undefined);
            if (!r.success) {
                toast.error(r.message);
                setBusy(false);
                return;
            }
            const params: PaystackCheckout = r.data.paystack;
            const PaystackPop = await loadPaystack();
            onOpenChange(false);
            new PaystackPop().newTransaction({
                ...params,
                onSuccess: async () => {
                    const done = await complete(params.reference).catch(() => null);
                    if (done?.success) toast.success(done.message);
                    else toast.error(done?.message || 'Payment sent, but we could not update the invoice yet. Refresh in a moment.');
                    setBusy(false);
                    onFinished();
                },
                onCancel: () => {
                    cancel(params.reference).catch(() => undefined);
                    setBusy(false);
                },
                onError: (e: { message?: string }) => {
                    toast.error(e?.message || 'Paystack could not start the payment');
                    cancel(params.reference).catch(() => undefined);
                    setBusy(false);
                },
            });
        } catch (e: any) {
            toast.error(e.message || 'Something went wrong');
            setBusy(false);
        }
    };

    const fee = quote ? toNumber(quote.fee) : 0;

    return (
        <Dialog open={open} onOpenChange={(next) => !busy && onOpenChange(next)}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Pay online</DialogTitle>
                    <DialogDescription>You&apos;ll finish paying in Paystack&apos;s secure window.</DialogDescription>
                </DialogHeader>

                {allowPart ? (
                    <div className='space-y-2'>
                        <Label htmlFor='pay-amount'>Amount to pay</Label>
                        <div className='relative'>
                            <span className='absolute left-3 top-2 text-sm text-muted-foreground'>₦</span>
                            <Input
                                id='pay-amount'
                                inputMode='decimal'
                                className='pl-7'
                                value={amount}
                                onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ''))}
                            />
                        </div>
                        <p className='text-xs text-muted-foreground'>Balance {naira(balance)}. You can pay part of it now.</p>
                    </div>
                ) : (
                    <p className='text-sm text-muted-foreground'>The school accepts the full balance online.</p>
                )}

                <dl className='space-y-1.5 rounded-[10px] bg-muted/50 p-4 text-sm'>
                    <div className='flex justify-between'>
                        <dt className='text-muted-foreground'>Towards invoice</dt>
                        <dd>{quote ? naira(quote.amount) : '—'}</dd>
                    </div>
                    {fee > 0 && (
                        <div className='flex justify-between'>
                            <dt className='text-muted-foreground'>Paystack fee</dt>
                            <dd>{naira(fee)}</dd>
                        </div>
                    )}
                    <div className='flex justify-between border-t border-border pt-1.5 font-medium'>
                        <dt>You pay</dt>
                        <dd>{quote ? naira(quote.total) : '—'}</dd>
                    </div>
                </dl>
                {error && <p className='text-sm text-destructive'>{error}</p>}

                <DialogFooter>
                    <Button variant='outline' disabled={busy} onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button disabled={busy || !quote} onClick={pay}>
                        <Lock className='h-4 w-4'/>
                        {busy ? 'Opening Paystack...' : quote ? `Pay ${naira(quote.total)}` : 'Pay'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
