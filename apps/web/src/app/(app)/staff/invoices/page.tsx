'use client';

import {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {ChevronLeft, ChevronRight, MoreVertical, Plus, Search, Upload} from 'lucide-react';

import {INVOICE_STATUS_LABEL, type InvoiceListItem, type InvoiceStatus, naira, toNumber, useBilling} from '@/hooks/billing';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Skeleton} from '@/components/ui/skeleton';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {BillingHeader, InvoiceStatusBadge} from '@/components/app/billing-ui';
import {CreateInvoiceSheet, UpdateStatusSheet} from '@/components/app/invoice-sheets';

const PAGE_SIZE = 10;
const ALL = 'all';

export default function InvoicesPage() {
    const router = useRouter();
    const {invoices: fetchInvoices, removeInvoice} = useBilling();
    const [invoices, setInvoices] = useState<InvoiceListItem[] | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | typeof ALL>(ALL);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [createOpen, setCreateOpen] = useState(false);
    const [statusInvoice, setStatusInvoice] = useState<InvoiceListItem | null>(null);
    const [pendingDelete, setPendingDelete] = useState<InvoiceListItem | null>(null);

    useEffect(() => {
        fetchInvoices().then((response) => {
            if (response.success) setInvoices(response.data.invoices);
            else {
                toast.error(response.message);
                setInvoices([]);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return (invoices || []).filter(
            (inv) =>
                (statusFilter === ALL || inv.status === statusFilter) &&
                (!q ||
                    inv.number.toLowerCase().includes(q) ||
                    inv.student.name.toLowerCase().includes(q) ||
                    (inv.student.parent?.name || '').toLowerCase().includes(q)),
        );
    }, [invoices, search, statusFilter]);

    const totals = useMemo(() => {
        const active = (invoices || []).filter((i) => i.status !== 'CANCELLED');
        const billed = active.reduce((s, i) => s + toNumber(i.total), 0);
        const paid = (invoices || []).reduce((s, i) => s + toNumber(i.paid), 0);
        const outstanding = active
            .filter((i) => i.status !== 'REFUNDED')
            .reduce((s, i) => s + Math.max(0, toNumber(i.total) - toNumber(i.paid)), 0);
        return {billed, paid, outstanding};
    }, [invoices]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const allOnPage = pageItems.length > 0 && pageItems.every((i) => selected.has(i.uuid));

    const replace = (updated: InvoiceListItem) =>
        setInvoices((current) => (current || []).map((i) => (i.uuid === updated.uuid ? {...i, ...updated} : i)));

    const exportCsv = () => {
        const source = selected.size ? filtered.filter((i) => selected.has(i.uuid)) : filtered;
        const rows = [
            ['Invoice ID', 'Student', 'Class', 'Recipient', 'Total', 'Paid', 'Status', 'Issued', 'Due'],
            ...source.map((i) => [
                i.number,
                i.student.name,
                i.student.class?.name || '',
                i.student.parent?.name || '',
                String(toNumber(i.total)),
                String(toNumber(i.paid)),
                INVOICE_STATUS_LABEL[i.status],
                i.issued_at.slice(0, 10),
                i.due_at?.slice(0, 10) || '',
            ]),
        ];
        const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
        const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv'}));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'invoices.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        const response = await removeInvoice(pendingDelete.uuid);
        if (response.success) {
            setInvoices((current) => (current || []).filter((i) => i.uuid !== pendingDelete.uuid));
            toast.success('Invoice deleted');
        } else {
            toast.error(response.message);
        }
        setPendingDelete(null);
    };

    return (
        <div className='space-y-6'>
            <BillingHeader
                title='Invoices'
                description='View and generate invoices'
                action={
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className='h-4 w-4'/>
                        Create invoice
                    </Button>
                }
            />

            <div className='grid gap-4 sm:grid-cols-3'>
                {[
                    {label: 'Total billed', value: totals.billed},
                    {label: 'Received', value: totals.paid},
                    {label: 'Outstanding', value: totals.outstanding},
                ].map((stat) => (
                    <div key={stat.label} className='rounded-[10px] border border-border p-4'>
                        <p className='text-sm text-muted-foreground'>{stat.label}</p>
                        {invoices === null ? <Skeleton className='mt-2 h-8 w-32'/> : <p className='mt-1 text-2xl font-semibold'>{naira(stat.value)}</p>}
                    </div>
                ))}
            </div>

            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex flex-1 flex-col gap-3 sm:flex-row sm:items-center'>
                    <div className='relative w-full sm:max-w-xs'>
                        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground'/>
                        <Input
                            placeholder='Search invoice, student or parent'
                            className='pl-8'
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={(value) => {
                            setStatusFilter(value as InvoiceStatus | typeof ALL);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className='w-44' aria-label='Filter by status'>
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All statuses</SelectItem>
                            {(Object.keys(INVOICE_STATUS_LABEL) as InvoiceStatus[]).map((s) => (
                                <SelectItem key={s} value={s}>{INVOICE_STATUS_LABEL[s]}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant='outline' onClick={exportCsv} disabled={!filtered.length}>
                    <Upload className='h-4 w-4'/>
                    {selected.size ? `Export ${selected.size} selected` : 'Export CSV'}
                </Button>
            </div>

            <div className='overflow-x-auto'>
                <Table>
                    <TableHeader className='bg-muted/50 [&_tr]:border-0'>
                        <TableRow>
                            <TableHead className='w-10 pl-4'>
                                <Checkbox
                                    aria-label='Select all on this page'
                                    checked={allOnPage}
                                    onCheckedChange={() => {
                                        const next = new Set(selected);
                                        pageItems.forEach((i) => (allOnPage ? next.delete(i.uuid) : next.add(i.uuid)));
                                        setSelected(next);
                                    }}
                                />
                            </TableHead>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>T. Amount</TableHead>
                            <TableHead>P. Amount</TableHead>
                            <TableHead>Recipient</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='w-20 text-center'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices === null ? (
                            Array.from({length: 4}).map((_, i) => (
                                <TableRow key={i}><TableCell colSpan={7}><Skeleton className='h-6 w-full'/></TableCell></TableRow>
                            ))
                        ) : pageItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className='h-32 text-center text-muted-foreground'>
                                    {invoices.length === 0 ? 'No invoices yet. Create one from a billing template.' : 'No invoices match your filters.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            pageItems.map((inv) => (
                                <TableRow key={inv.uuid} className='h-14'>
                                    <TableCell className='pl-4'>
                                        <Checkbox
                                            aria-label={`Select ${inv.number}`}
                                            checked={selected.has(inv.uuid)}
                                            onCheckedChange={() => {
                                                const next = new Set(selected);
                                                if (next.has(inv.uuid)) next.delete(inv.uuid);
                                                else next.add(inv.uuid);
                                                setSelected(next);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/staff/invoices/${inv.uuid}`} className='font-medium hover:underline'>{inv.number}</Link>
                                    </TableCell>
                                    <TableCell>{naira(inv.total)}</TableCell>
                                    <TableCell>{naira(inv.paid)}</TableCell>
                                    <TableCell>
                                        <p>{inv.student.parent?.name || '—'}</p>
                                        <p className='text-xs text-muted-foreground'>
                                            {inv.student.name}{inv.student.class ? ` · ${inv.student.class.name}` : ''}
                                        </p>
                                    </TableCell>
                                    <TableCell><InvoiceStatusBadge status={inv.status}/></TableCell>
                                    <TableCell className='text-center'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' size='icon' aria-label={`Actions for ${inv.number}`}>
                                                    <MoreVertical className='h-4 w-4'/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end' className='w-44'>
                                                <DropdownMenuItem onSelect={() => router.push(`/staff/invoices/${inv.uuid}`)}>View</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => setStatusInvoice(inv)}>Update status</DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => window.open(`/print/invoice/${inv.uuid}`, '_blank')}>Print</DropdownMenuItem>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem className='text-destructive' onSelect={() => setPendingDelete(inv)}>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className='flex items-center justify-between'>
                <span className='text-sm'>Page {page} of {totalPages}</span>
                <div className='flex gap-2'>
                    <Button variant='outline' size='icon' aria-label='Previous page' disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                        <ChevronLeft className='h-4 w-4'/>
                    </Button>
                    <Button variant='outline' size='icon' aria-label='Next page' disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                        <ChevronRight className='h-4 w-4'/>
                    </Button>
                </div>
            </div>

            <CreateInvoiceSheet
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={(created) => setInvoices((current) => [...created, ...(current || [])])}
            />
            <UpdateStatusSheet invoice={statusInvoice} onOpenChange={(open) => !open && setStatusInvoice(null)} onUpdated={replace}/>

            <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete invoice</DialogTitle>
                        <DialogDescription>
                            Delete {pendingDelete?.number} for {pendingDelete?.student.name}? Its payment history is deleted too. To keep a record, mark it as cancelled instead.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setPendingDelete(null)}>Cancel</Button>
                        <Button variant='destructive' onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
