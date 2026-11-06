'use client';

import {useEffect, useState} from 'react';
import {toast} from 'sonner';

import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type ArrivalFilter = 'any' | 'before' | 'after';

interface AttendanceReviewProps {
    /** Changes to this key (e.g. the person's uuid) trigger a refetch. */
    subjectKey: string;
    fetchHistory: (month: string) => Promise<{ success: boolean; data?: any; message?: string }>;
}

const STATUS_STYLE: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    PRESENT: 'bg-emerald-100 text-emerald-700',
    ABSENT: 'bg-red-100 text-red-700',
};

const MONTHS_TO_SHOW = 12;

function monthKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function recentMonths() {
    const now = new Date();
    return Array.from({length: MONTHS_TO_SHOW}, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
            value: monthKey(date),
            label: date.toLocaleDateString('en-GB', {month: 'long', year: 'numeric'}),
        };
    });
}

/** Arrival is when the record was first marked (same value the daily log shows as "Time"). */
function arrivalMinutes(record: any) {
    const arrived = new Date(record.created_at);
    return arrived.getHours() * 60 + arrived.getMinutes();
}

function parseTime(value: string) {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
}

function percent(part: number, total: number) {
    return total > 0 ? `${Math.round((part / total) * 100)}%` : '—';
}

function Stat({label, value, hint}: { label: string; value: string; hint?: string }) {
    return (
        <div className='rounded-md border px-3 py-2'>
            <p className='text-xs text-muted-foreground'>{label}</p>
            <p className='text-lg font-semibold'>{value}</p>
            {hint && <p className='text-[11px] text-muted-foreground'>{hint}</p>}
        </div>
    );
}

export function AttendanceReview({subjectKey, fetchHistory}: AttendanceReviewProps) {
    const [months] = useState(recentMonths);
    const [month, setMonth] = useState(months[0].value);
    const [arrival, setArrival] = useState<ArrivalFilter>('any');
    const [time, setTime] = useState('08:00');
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetchHistory(month)
            .then((response) => {
                if (cancelled) return;
                if (response.success) {
                    setRecords(response.data.attendance || []);
                } else {
                    toast.error(response.message || 'Failed to load attendance');
                }
            })
            .catch((error: any) => {
                if (!cancelled) toast.error(error.message || 'Failed to load attendance');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectKey, month]);

    const present = records.filter((r) => r.status === 'PRESENT');
    const absentCount = records.filter((r) => r.status === 'ABSENT').length;
    const pendingCount = records.length - present.length - absentCount;
    const filterActive = arrival !== 'any' && !!time;

    const matchesArrival = (record: any) => {
        if (!filterActive) return true;
        if (record.status !== 'PRESENT') return false;
        const minutes = arrivalMinutes(record);
        return arrival === 'before' ? minutes < parseTime(time) : minutes >= parseTime(time);
    };

    const matching = present.filter(matchesArrival);
    const visible = filterActive ? matching : records;

    return (
        <div className='space-y-3'>
            <div className='grid grid-cols-2 gap-2'>
                <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className='col-span-2 w-full'>
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        {months.map((m) => (
                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={arrival} onValueChange={(v) => setArrival(v as ArrivalFilter)}>
                    <SelectTrigger className={`w-full ${arrival === 'any' ? 'col-span-2' : ''}`}>
                        <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='any'>Any arrival time</SelectItem>
                        <SelectItem value='before'>Arrived before</SelectItem>
                        <SelectItem value='after'>Arrived at/after</SelectItem>
                    </SelectContent>
                </Select>
                {arrival !== 'any' && (
                    <Input type='time' value={time} onChange={(e) => setTime(e.target.value)}/>
                )}
            </div>

            <div className='grid grid-cols-2 gap-2'>
                <Stat
                    label='Attendance rate'
                    value={percent(present.length, present.length + absentCount)}
                    hint={pendingCount > 0 ? `${pendingCount} pending excluded` : undefined}
                />
                <Stat
                    label='Present / Absent'
                    value={`${present.length} / ${absentCount}`}
                    hint={`${records.length} day${records.length === 1 ? '' : 's'} recorded`}
                />
                {filterActive && (
                    <Stat
                        label={arrival === 'before' ? `Arrived before ${time}` : `Arrived at/after ${time}`}
                        value={`${matching.length} day${matching.length === 1 ? '' : 's'}`}
                        hint={`${percent(matching.length, present.length)} of present days`}
                    />
                )}
            </div>

            {loading ? (
                <p className='text-sm text-muted-foreground text-center py-6'>Loading...</p>
            ) : visible.length === 0 ? (
                <p className='text-sm text-muted-foreground text-center py-6'>
                    {filterActive ? 'No arrivals match this filter.' : 'No attendance records for this month.'}
                </p>
            ) : (
                <div className='space-y-2'>
                    {visible.map((record) => (
                        <div
                            key={record.uuid}
                            className='flex items-center justify-between rounded-md border px-3 py-2'
                        >
                            <div>
                                <p className='text-sm'>
                                    {new Date(record.date).toLocaleDateString('en-GB', {
                                        weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC',
                                    })}
                                </p>
                                {record.status === 'PRESENT' && (
                                    <p className='text-xs text-muted-foreground'>
                                        Arrived {new Date(record.created_at).toLocaleTimeString([], {
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                    </p>
                                )}
                            </div>
                            <Badge className={STATUS_STYLE[record.status] || STATUS_STYLE.PENDING}>
                                {record.status.charAt(0) + record.status.slice(1).toLowerCase()}
                            </Badge>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
