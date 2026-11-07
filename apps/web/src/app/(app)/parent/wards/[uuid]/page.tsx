'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {ArrowLeft, ChevronLeft, ChevronRight, FileText, Mail, Phone} from 'lucide-react';

import {type AttendanceStatus, type ParentInvoice, useParent, type Ward, type WardResult} from '@/hooks/parent';
import {Button} from '@/components/ui/button';
import {Skeleton} from '@/components/ui/skeleton';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {WardAvatar} from '@/components/app/parent-ui';
import {ParentInvoiceList} from '@/components/app/parent-invoice-list';
import {cn} from '@/lib/utils';
import {formatPhone, phoneHref} from '@/lib/phone';

interface WardDetail extends Ward {
    teacher: { name: string | null; email: string; contact: string | null } | null;
}

const thisMonth = () => new Date().toISOString().slice(0, 7);
const shiftMonth = (month: string, delta: number) => {
    const d = new Date(`${month}-01T00:00:00Z`);
    d.setUTCMonth(d.getUTCMonth() + delta);
    return d.toISOString().slice(0, 7);
};
const monthLabel = (month: string) =>
    new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-GB', {timeZone: 'UTC', month: 'long', year: 'numeric'});

const DAY_STYLE: Record<AttendanceStatus, string> = {
    PRESENT: 'bg-success-muted text-success-foreground',
    ABSENT: 'bg-destructive-muted text-destructive',
    PENDING: 'bg-warning-muted text-warning-foreground',
};

function AttendanceTab({uuid}: { uuid: string }) {
    const {attendance} = useParent();
    const [month, setMonth] = useState(thisMonth());
    const [data, setData] = useState<{
        records: { date: string; status: AttendanceStatus }[];
        summary: { present: number; absent: number; rate: number | null };
    } | null>(null);

    useEffect(() => {
        setData(null);
        attendance(uuid, month).then((r) => r.success && setData(r.data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid, month]);

    const first = new Date(`${month}-01T00:00:00Z`);
    const daysInMonth = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    // Monday-first grid offset.
    const offset = (first.getUTCDay() + 6) % 7;
    const byDate = new Map((data?.records || []).map((r) => [r.date, r.status]));
    const today = new Date().toISOString().slice(0, 10);

    return (
        <div className='space-y-5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' size='icon' aria-label='Previous month' onClick={() => setMonth((m) => shiftMonth(m, -1))}>
                        <ChevronLeft className='h-4 w-4'/>
                    </Button>
                    <p className='w-40 text-center font-medium'>{monthLabel(month)}</p>
                    <Button
                        variant='outline'
                        size='icon'
                        aria-label='Next month'
                        disabled={month >= thisMonth()}
                        onClick={() => setMonth((m) => shiftMonth(m, 1))}
                    >
                        <ChevronRight className='h-4 w-4'/>
                    </Button>
                </div>
                {data && (
                    <div className='flex gap-4 text-sm'>
                        <span><span className='font-medium'>{data.summary.present}</span> <span className='text-muted-foreground'>present</span></span>
                        <span><span className='font-medium'>{data.summary.absent}</span> <span className='text-muted-foreground'>absent</span></span>
                        <span><span className='font-medium'>{data.summary.rate === null ? '—' : `${data.summary.rate}%`}</span> <span className='text-muted-foreground'>attendance</span></span>
                    </div>
                )}
            </div>

            {data === null ? (
                <Skeleton className='h-72 rounded-[10px]'/>
            ) : (
                <div className='max-w-xl'>
                    <div className='grid grid-cols-7 gap-1.5 text-center text-xs text-muted-foreground'>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d} className='py-1'>{d}</span>)}
                    </div>
                    <div className='mt-1 grid grid-cols-7 gap-1.5'>
                        {Array.from({length: offset}).map((_, i) => <span key={`pad-${i}`}/>)}
                        {Array.from({length: daysInMonth}).map((_, i) => {
                            const date = `${month}-${String(i + 1).padStart(2, '0')}`;
                            const status = byDate.get(date);
                            return (
                                <span
                                    key={date}
                                    title={status ? `${date}: ${status.toLowerCase()}` : date}
                                    className={cn(
                                        'flex aspect-square items-center justify-center rounded-md text-sm',
                                        status ? DAY_STYLE[status] : 'text-muted-foreground',
                                        date === today && 'ring-2 ring-primary',
                                    )}
                                >
                                    {i + 1}
                                </span>
                            );
                        })}
                    </div>
                    <div className='mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground'>
                        <span className='flex items-center gap-1.5'><span className='h-3 w-3 rounded-sm bg-success-muted'/> Present</span>
                        <span className='flex items-center gap-1.5'><span className='h-3 w-3 rounded-sm bg-destructive-muted'/> Absent</span>
                        <span className='flex items-center gap-1.5'><span className='h-3 w-3 rounded-sm border border-border'/> Not recorded</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function ResultsTab({uuid}: { uuid: string }) {
    const {wardResults} = useParent();
    const [results, setResults] = useState<WardResult[] | null>(null);

    useEffect(() => {
        wardResults(uuid).then((r) => setResults(r.success ? r.data.results : []));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid]);

    if (results === null) return <Skeleton className='h-32 rounded-[10px]'/>;
    if (results.length === 0) {
        return (
            <p className='rounded-[10px] border border-dashed border-border p-8 text-center text-sm text-muted-foreground'>
                No report cards yet. They appear here once the school has approved them.
            </p>
        );
    }

    return (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            {results.map((result) => (
                <a
                    key={result.uuid}
                    href={`/report/${result.uuid}`}
                    target='_blank'
                    rel='noreferrer'
                    className='rounded-[10px] border border-border p-5 transition-shadow hover:shadow-[0_4px_30px_rgba(46,45,116,0.1)]'
                >
                    <div className='flex items-start justify-between gap-3'>
                        <div>
                            <p className='font-medium'>{result.calendar?.term || 'Term report'}</p>
                            <p className='text-sm text-muted-foreground'>{result.calendar?.session} · {result.class_name}</p>
                        </div>
                        <span className='flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent text-accent-foreground'>
                            <FileText className='h-5 w-5'/>
                        </span>
                    </div>
                    <div className='mt-4 flex items-end justify-between border-t border-border pt-4'>
                        <div>
                            <p className='text-2xl font-semibold'>{result.average ?? '—'}{result.average != null && '%'}</p>
                            <p className='text-xs text-muted-foreground'>Average over {result.subjects} subjects</p>
                        </div>
                        <span className='text-sm font-medium text-primary'>View report card</span>
                    </div>
                </a>
            ))}
        </div>
    );
}

function FeesTab({uuid}: { uuid: string }) {
    const {invoices} = useParent();
    const [list, setList] = useState<ParentInvoice[] | null>(null);

    useEffect(() => {
        invoices(uuid).then((r) => setList(r.success ? r.data.invoices : []));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid]);

    if (list === null) return <Skeleton className='h-32 rounded-[10px]'/>;
    return <ParentInvoiceList invoices={list} showStudent={false}/>;
}

export default function WardPage() {
    const {uuid} = useParams<{ uuid: string }>();
    const {ward: fetchWard} = useParent();
    const [ward, setWard] = useState<WardDetail | null>(null);
    const [missing, setMissing] = useState(false);

    useEffect(() => {
        fetchWard(uuid).then((r) => (r.success ? setWard(r.data.ward) : setMissing(true)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid]);

    if (missing) {
        return (
            <div className='py-20 text-center'>
                <p className='font-medium'>Child not found</p>
                <Link href='/parent/dashboard' className='mt-2 inline-block text-sm text-primary hover:underline'>Back to home</Link>
            </div>
        );
    }

    if (!ward) {
        return (
            <div className='space-y-4'>
                <Skeleton className='h-16 w-72'/>
                <Skeleton className='h-72 w-full'/>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            <Link href='/parent/dashboard' className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground'>
                <ArrowLeft className='h-4 w-4'/> Home
            </Link>

            <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-center gap-4'>
                    <WardAvatar name={ward.name} avatar={ward.avatar} className='h-16 w-16 text-lg'/>
                    <div>
                        <h1 className='text-xl font-medium'>{ward.name}</h1>
                        <p className='text-muted-foreground'>{ward.class.name} · {ward.branch.name} · Reg. no. {ward.reg_number}</p>
                    </div>
                </div>
                {ward.teacher?.name && (
                    <div className='rounded-[10px] border border-border px-4 py-3 text-sm'>
                        <p className='text-xs text-muted-foreground'>Class teacher</p>
                        <p className='font-medium'>{ward.teacher.name}</p>
                        <div className='mt-1 flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground'>
                            {ward.teacher.contact && (
                                <a href={phoneHref(ward.teacher.contact)} className='flex items-center gap-1 hover:text-foreground'>
                                    <Phone className='h-3.5 w-3.5'/> {formatPhone(ward.teacher.contact)}
                                </a>
                            )}
                            <a href={`mailto:${ward.teacher.email}`} className='flex items-center gap-1 hover:text-foreground'>
                                <Mail className='h-3.5 w-3.5'/> Email
                            </a>
                        </div>
                    </div>
                )}
            </div>

            <Tabs defaultValue='attendance'>
                <TabsList>
                    <TabsTrigger value='attendance'>Attendance</TabsTrigger>
                    <TabsTrigger value='results'>Results</TabsTrigger>
                    <TabsTrigger value='fees'>Fees</TabsTrigger>
                </TabsList>
                <TabsContent value='attendance' className='pt-4'><AttendanceTab uuid={ward.uuid}/></TabsContent>
                <TabsContent value='results' className='pt-4'><ResultsTab uuid={ward.uuid}/></TabsContent>
                <TabsContent value='fees' className='pt-4'><FeesTab uuid={ward.uuid}/></TabsContent>
            </Tabs>
        </div>
    );
}
