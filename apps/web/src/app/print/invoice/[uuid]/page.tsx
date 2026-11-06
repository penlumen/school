'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {Printer} from 'lucide-react';

import {type InvoiceDetail, useBilling} from '@/hooks/billing';
import {Button} from '@/components/ui/button';
import LoadingPage from '@/components/loading-page';
import {InvoiceDocument} from '@/components/app/invoice-document';

/** Bare invoice page, outside the app shell, that opens the print dialog once loaded. */
export default function PrintInvoicePage() {
    const {uuid} = useParams<{ uuid: string }>();
    const {invoice: fetchInvoice} = useBilling();
    const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchInvoice(uuid).then((response) => {
            if (response.success) setInvoice(response.data.invoice);
            else setError(response.message);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid]);

    useEffect(() => {
        if (!invoice) return;
        document.title = invoice.number;
        // Give the logo a moment to load before the dialog snapshots the page.
        const timer = setTimeout(() => window.print(), 400);
        return () => clearTimeout(timer);
    }, [invoice]);

    if (error) return <p className='p-10 text-center text-muted-foreground'>{error}</p>;
    if (!invoice) return <LoadingPage text='Preparing invoice...'/>;

    return (
        <div className='min-h-screen bg-muted py-8 print:bg-white print:py-0'>
            <div className='mx-auto mb-4 flex max-w-[794px] justify-end px-4 print:hidden'>
                <Button onClick={() => window.print()}>
                    <Printer className='h-4 w-4'/>
                    Print
                </Button>
            </div>
            <InvoiceDocument invoice={invoice}/>
        </div>
    );
}
