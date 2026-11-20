'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {CheckCircle2, ChevronLeft, ChevronRight, Clock3, MoreVertical, Search, Trash2, XCircle} from 'lucide-react';

import {useResult} from '@/hooks/result';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
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
import {BillingHeader} from '@/components/app/billing-ui';
import {DataTransferMenu} from '@/components/app/data-transfer-menu';
import {cn} from '@/lib/utils';
import {formatDate} from '@/lib/date';
import Cookies from 'js-cookie';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';

type ResultStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface ReportRow {
    uuid: string;
    class_uuid: string;
    class_name: string;
    overall: number;
    average: number | null;
    subjects: number;
    status: ResultStatus;
    approval_requested: boolean;
    updated_at: string;
    student: { uuid: string; name: string; reg_number: string; avatar: string | null };
    calendar: { uuid: string; session: string; term: string | null } | null;
}

interface ReportList {
    results: ReportRow[];
    total: number;
    limit: number;
    counts: Partial<Record<ResultStatus, number>>;
    filters: {
        classes: { uuid: string; name: string }[];
        terms: { uuid: string; session: string; term: string | null; status: string }[];
        all_classes: boolean;
    };
}

const ALL = 'all';

const STATUS: Record<ResultStatus, { label: string; className: string; icon: React.ElementType }> = {
    PENDING: {label: 'Pending', className: 'bg-warning-muted text-warning-foreground', icon: Clock3},
    APPROVED: {label: 'Approved', className: 'bg-success-muted text-success-foreground', icon: CheckCircle2},
    REJECTED: {label: 'Rejected', className: 'bg-destructive-muted text-destructive', icon: XCircle},
};

function StatusBadge({status, requested}: { status: ResultStatus; requested: boolean }) {
    const {label, className, icon: Icon} = STATUS[status];
    return (
        <span className='inline-flex flex-col gap-0.5'>
            <span className={cn('inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', className)}>
                <Icon className='h-3.5 w-3.5'/>
                {label}
            </span>
            {status === 'PENDING' && requested && (
                <span className='text-[11px] text-muted-foreground'>Approval requested</span>
            )}
        </span>
    );
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function ReportsPage() {
    const router = useRouter();
    const {index, remove, bulkStatus, bulkDelete} = useResult();
    // Same rule as the API: administrators approve and reject.
    const viewer = JSON.parse(Cookies.get('user') || 'null');
    const isAdmin = ['ROOT', 'ADMIN'].includes(viewer?.role) || viewer?.position === 'ADMINISTRATIVE';
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [rejecting, setRejecting] = useState(false);
    const [reason, setReason] = useState('');
    const [bulkBusy, setBulkBusy] = useState(false);
    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
    const [data, setData] = useState<ReportList | null>(null);
    const [loading, setLoading] = useState(true);
    const [classUuid, setClassUuid] = useState(ALL);
    const [status, setStatus] = useState<ResultStatus | typeof ALL>(ALL);
    const [term, setTerm] = useState(ALL);
    const [search, setSearch] = useState('');
    const [debounced, setDebounced] = useState('');
    const [page, setPage] = useState(1);
    const [pendingDelete, setPendingDelete] = useState<ReportRow | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounced(search.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    // Any filter change starts again from the first page.
    const filterBy = <T,>(set: (value: T) => void) => (value: T) => {
        set(value);
        setPage(1);
    };

    const load = async () => {
        setLoading(true);
        try {
            const response = await index({page, status, class_uuid: classUuid, calendar_uuid: term, search: debounced});
            if (response.success) {
                setData(response.data);
                setSelected(new Set());
            } else toast.error(response.message);
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, classUuid, status, term, debounced]);

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        const response = await remove(pendingDelete.uuid);
        if (response.success) {
            toast.success('Report deleted');
            load();
        } else {
            toast.error(response.message);
        }
        setPendingDelete(null);
    };

    const applyBulk = async (status: 'APPROVED' | 'REJECTED') => {
        setBulkBusy(true);
        try {
            const response = await bulkStatus([...selected], status, status === 'REJECTED' ? reason.trim() : undefined);
            if (!response.success) return toast.error(response.message);
            toast.success(response.message);
            setRejecting(false);
            setReason('');
            load();
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setBulkBusy(false);
        }
    };

    const deleteSelected = async () => {
        setBulkBusy(true);
        try {
            const response = await bulkDelete([...selected]);
            if (!response.success) return toast.error(response.message);
            toast.success(response.message);
            setConfirmBulkDelete(false);
            load();
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setBulkBusy(false);
        }
    };

    const pageRows = data?.results || [];
    const allOnPage = pageRows.length > 0 && pageRows.every((r) => selected.has(r.uuid));
    const toggle = (uuid: string) =>
        setSelected((current) => {
            const next = new Set(current);
            if (next.has(uuid)) next.delete(uuid);
            else next.add(uuid);
            return next;
        });

    const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;
    const totalAll = data ? Object.values(data.counts).reduce((sum, n) => sum + (n || 0), 0) : 0;
    const classes = data?.filters.classes || [];

    return (
        <div className='space-y-6'>
            <BillingHeader
                title='Reports'
                description={
                    data && !data.filters.all_classes
                        ? 'Results for the classes you teach'
                        : 'Results and report cards for every class'
                }
                action={<DataTransferMenu types={['results']} onImported={load}/>}
            />

            {/* Status summary doubles as a quick filter. */}
            <div className='flex flex-wrap gap-2'>
                {([ALL, 'PENDING', 'APPROVED', 'REJECTED'] as const).map((value) => {
                    const count = value === ALL ? totalAll : data?.counts[value] || 0;
                    return (
                        <button
                            key={value}
                            type='button'
                            onClick={() => filterBy(setStatus)(value)}
                            className={cn(
                                'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                                status === value
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {value === ALL ? 'All' : STATUS[value].label}
                            <span className={cn('ml-1.5 tabular-nums', status === value ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                                {data ? count : '…'}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
                <div className='relative w-full lg:max-w-xs'>
                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground'/>
                    <Input
                        placeholder='Search student or reg. no.'
                        className='pl-8'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={classUuid} onValueChange={filterBy(setClassUuid)}>
                    <SelectTrigger className='w-full lg:w-48' aria-label='Filter by class'>
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>{data?.filters.all_classes === false ? 'All my classes' : 'All classes'}</SelectItem>
                        {classes.map((c) => <SelectItem key={c.uuid} value={c.uuid}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={status} onValueChange={(value) => filterBy(setStatus)(value as ResultStatus | typeof ALL)}>
                    <SelectTrigger className='w-full lg:w-44' aria-label='Filter by status'>
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All statuses</SelectItem>
                        {(Object.keys(STATUS) as ResultStatus[]).map((s) => <SelectItem key={s} value={s}>{STATUS[s].label}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={term} onValueChange={filterBy(setTerm)}>
                    <SelectTrigger className='w-full lg:w-56' aria-label='Filter by term'>
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>All terms</SelectItem>
                        {(data?.filters.terms || []).map((t) => (
                            <SelectItem key={t.uuid} value={t.uuid}>
                                {t.session}{t.term ? ` · ${t.term}` : ''}{t.status === 'ACTIVE' ? ' (current)' : ''}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {data && classes.length === 0 ? (
                <div className='rounded-[10px] border border-dashed border-border px-6 py-14 text-center'>
                    <p className='font-medium'>You aren’t assigned to any classes yet</p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                        Reports appear here for the classes you teach. Ask an administrator to add you to a class.
                    </p>
                </div>
            ) : (
                <div className='space-y-3'>
                {isAdmin && selected.size > 0 && (
                    <div className='flex flex-wrap items-center gap-2 rounded-[10px] border border-border bg-muted/40 px-4 py-2 text-sm'>
                        <span className='font-medium'>{selected.size} selected</span>
                        <Button size='sm' disabled={bulkBusy} onClick={() => applyBulk('APPROVED')}>
                            <CheckCircle2 className='h-4 w-4'/>
                            {bulkBusy ? 'Saving...' : 'Approve'}
                        </Button>
                        <Button size='sm' variant='outline' disabled={bulkBusy} onClick={() => setRejecting(true)}>
                            <XCircle className='h-4 w-4'/> Reject
                        </Button>
                        <Button size='sm' variant='outline' className='text-destructive' disabled={bulkBusy} onClick={() => setConfirmBulkDelete(true)}>
                            <Trash2 className='h-4 w-4'/> Delete
                        </Button>
                        <Button size='sm' variant='ghost' disabled={bulkBusy} onClick={() => setSelected(new Set())}>
                            Clear
                        </Button>
                    </div>
                )}
                <div className='overflow-x-auto'>
                    <Table>
                        <TableHeader className='bg-muted/50 [&_tr]:border-0'>
                            <TableRow>
                                {isAdmin && (
                                    <TableHead className='w-10 pl-4'>
                                        <Checkbox
                                            aria-label='Select all reports on this page'
                                            checked={allOnPage}
                                            disabled={!pageRows.length}
                                            onCheckedChange={() =>
                                                setSelected((current) => {
                                                    const next = new Set(current);
                                                    pageRows.forEach((r) => (allOnPage ? next.delete(r.uuid) : next.add(r.uuid)));
                                                    return next;
                                                })
                                            }
                                        />
                                    </TableHead>
                                )}
                                <TableHead className={isAdmin ? '' : 'pl-4'}>Student</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Term</TableHead>
                                <TableHead className='text-center'>Average</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last updated</TableHead>
                                <TableHead className='w-16 text-center'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && !data ? (
                                Array.from({length: 5}).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={isAdmin ? 8 : 7}><Skeleton className='h-8 w-full'/></TableCell></TableRow>
                                ))
                            ) : !data || data.results.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isAdmin ? 8 : 7} className='h-32 text-center text-muted-foreground'>
                                        No reports match these filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.results.map((report) => (
                                    <TableRow
                                        key={report.uuid}
                                        className={cn('h-14 cursor-pointer', loading && 'opacity-60')}
                                        onClick={() => router.push(`/staff/reports/${report.uuid}`)}
                                    >
                                        {isAdmin && (
                                            <TableCell className='pl-4' onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    aria-label={`Select ${report.student.name}'s report`}
                                                    checked={selected.has(report.uuid)}
                                                    onCheckedChange={() => toggle(report.uuid)}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell className={isAdmin ? '' : 'pl-4'}>
                                            <div className='flex items-center gap-3'>
                                                <Avatar className='h-8 w-8'>
                                                    <AvatarImage src={report.student.avatar || ''} alt=''/>
                                                    <AvatarFallback className='bg-accent text-xs text-accent-foreground'>{initials(report.student.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <Link
                                                        href={`/staff/reports/${report.uuid}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className='font-medium hover:underline'
                                                    >
                                                        {report.student.name}
                                                    </Link>
                                                    <p className='text-xs text-muted-foreground'>{report.student.reg_number}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{report.class_name}</TableCell>
                                        <TableCell className='text-sm'>
                                            {report.calendar ? (
                                                <>
                                                    <p>{report.calendar.term || '—'}</p>
                                                    <p className='text-xs text-muted-foreground'>{report.calendar.session}</p>
                                                </>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell className='text-center'>
                                            <p className='font-medium tabular-nums'>{report.average ?? '—'}{report.average != null && '%'}</p>
                                            <p className='text-xs text-muted-foreground'>{report.subjects} {report.subjects === 1 ? 'subject' : 'subjects'}</p>
                                        </TableCell>
                                        <TableCell><StatusBadge status={report.status} requested={report.approval_requested}/></TableCell>
                                        <TableCell className='text-sm text-muted-foreground'>
                                            {formatDate(report.updated_at)}
                                        </TableCell>
                                        <TableCell className='text-center' onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant='ghost' size='icon' aria-label={`Actions for ${report.student.name}`}>
                                                        <MoreVertical className='h-4 w-4'/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align='end'>
                                                    <DropdownMenuItem onSelect={() => router.push(`/staff/reports/${report.uuid}`)}>Open report</DropdownMenuItem>
                                                    {report.status === 'APPROVED' && (
                                                        <DropdownMenuItem onSelect={() => window.open(`/report/${report.uuid}`, '_blank')}>
                                                            Print report card
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem className='text-destructive' onSelect={() => setPendingDelete(report)}>
                                                        Delete report
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                </div>
            )}

            {data && data.total > 0 && (
                <div className='flex items-center justify-between'>
                    <span className='text-sm'>
                        Page {page} of {totalPages} · {data.total} {data.total === 1 ? 'report' : 'reports'}
                    </span>
                    <div className='flex gap-2'>
                        <Button variant='outline' size='icon' aria-label='Previous page' disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                            <ChevronLeft className='h-4 w-4'/>
                        </Button>
                        <Button variant='outline' size='icon' aria-label='Next page' disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                            <ChevronRight className='h-4 w-4'/>
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={confirmBulkDelete} onOpenChange={(open) => !bulkBusy && setConfirmBulkDelete(open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {selected.size} {selected.size === 1 ? 'report' : 'reports'}?</DialogTitle>
                        <DialogDescription>
                            Their scores, remarks and ratings are deleted too, including approved reports parents can see. This can&apos;t be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' disabled={bulkBusy} onClick={() => setConfirmBulkDelete(false)}>Cancel</Button>
                        <Button variant='destructive' disabled={bulkBusy} onClick={deleteSelected}>
                            {bulkBusy ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={rejecting} onOpenChange={(open) => !bulkBusy && setRejecting(open)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject {selected.size} {selected.size === 1 ? 'report' : 'reports'}?</DialogTitle>
                        <DialogDescription>
                            Their class teachers are notified so they can review them. The reason is included in the notification.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-2'>
                        <Label htmlFor='reject-reason'>Reason (optional)</Label>
                        <Textarea
                            id='reject-reason'
                            value={reason}
                            maxLength={300}
                            placeholder='e.g. Exam scores are missing for some subjects'
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant='outline' disabled={bulkBusy} onClick={() => setRejecting(false)}>Cancel</Button>
                        <Button variant='destructive' disabled={bulkBusy} onClick={() => applyBulk('REJECTED')}>
                            {bulkBusy ? 'Rejecting...' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete report</DialogTitle>
                        <DialogDescription>
                            Delete {pendingDelete?.student.name}’s {pendingDelete?.calendar?.term || ''} report and all its scores? This cannot be undone.
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
