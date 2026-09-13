'use client';

import {useEffect, useMemo, useState, Fragment} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {toast} from 'sonner';
import {ArrowLeft, ChevronLeft, ChevronRight, Plus} from 'lucide-react';

import {useCalendar} from '@/hooks/calendar';
import {useEvent} from '@/hooks/event';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import LoadingPage from '@/components/loading-page';
import {EventFormSheet, type EventRecord} from '@/components/app/event-form-sheet';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({length: 15}, (_, i) => i + 7); // 07:00 - 21:00

function toKey(date: Date) {
    return date.toISOString().slice(0, 10);
}

function startOfWeek(date: Date) {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // Monday = 0
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
}

function monthGrid(date: Date) {
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const gridStart = startOfWeek(first);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + i);
        days.push(d);
    }
    return days;
}

export default function CalendarDetailPage() {
    const {uuid} = useParams();
    const router = useRouter();
    const {index: indexCalendars} = useCalendar();
    const {index: indexEvents, remove: removeEvent} = useEvent();

    const [isLoading, setIsLoading] = useState(true);
    const [section, setSection] = useState<any>(null);
    const [events, setEvents] = useState<EventRecord[]>([]);
    const [view, setView] = useState<'month' | 'week' | 'day'>('month');
    const [refDate, setRefDate] = useState(new Date());

    const [formOpen, setFormOpen] = useState(false);
    const [activeEvent, setActiveEvent] = useState<EventRecord | null>(null);
    const [formDefaultDate, setFormDefaultDate] = useState<string | undefined>(undefined);
    const [pendingDelete, setPendingDelete] = useState<EventRecord | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [calRes, evRes] = await Promise.all([indexCalendars(), indexEvents(uuid as string)]);
            if (calRes.success) {
                const found = (calRes.data.calendars || []).find((c: any) => c.uuid === uuid);
                setSection(found || null);
                if (found?.open_date) setRefDate(new Date(found.open_date));
                else if (found?.next_term_resumption_date) setRefDate(new Date(found.next_term_resumption_date));
            }
            if (evRes.success) {
                setEvents(evRes.data.events || []);
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (uuid) fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid]);

    const eventsByDay = useMemo(() => {
        const map = new Map<string, EventRecord[]>();
        for (const ev of events) {
            const key = ev.date.slice(0, 10);
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(ev);
        }
        return map;
    }, [events]);

    const handleDeleteEvent = async () => {
        if (!pendingDelete) return;
        try {
            const response = await removeEvent(pendingDelete.uuid);
            if (response.success) {
                toast.success('Event deleted');
            } else {
                toast.error(response.message || 'Failed to delete event');
            }
        } finally {
            setPendingDelete(null);
            fetchData();
        }
    };

    const openAddEvent = (dateKey?: string) => {
        setActiveEvent(null);
        setFormDefaultDate(dateKey || toKey(refDate));
        setFormOpen(true);
    };

    const navigate = (dir: -1 | 1) => {
        const d = new Date(refDate);
        if (view === 'month') d.setMonth(d.getMonth() + dir);
        else if (view === 'week') d.setDate(d.getDate() + dir * 7);
        else d.setDate(d.getDate() + dir);
        setRefDate(d);
    };

    if (isLoading || !section) return <LoadingPage/>;

    return (
        <div className='space-y-6'>
            <Button variant='ghost' size='sm' className='w-fit' onClick={() => router.push('/staff/schedules')}>
                <ArrowLeft className='h-4 w-4'/>
                Back
            </Button>

            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='text-2xl font-bold tracking-tight'>{section.session}</h1>
                    <p className='text-muted-foreground capitalize'>{section.term}</p>
                </div>
                <div className='flex flex-wrap items-center gap-2'>
                    <div className='flex items-center rounded-md border'>
                        <Button variant='ghost' size='icon' onClick={() => navigate(-1)}>
                            <ChevronLeft className='h-4 w-4'/>
                        </Button>
                        <span className='px-2 text-sm font-medium min-w-[110px] text-center'>
                            {refDate.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}
                        </span>
                        <Button variant='ghost' size='icon' onClick={() => navigate(1)}>
                            <ChevronRight className='h-4 w-4'/>
                        </Button>
                    </div>
                    <div className='flex rounded-md border p-0.5'>
                        {(['month', 'week', 'day'] as const).map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`px-3 py-1.5 text-sm rounded capitalize ${
                                    view === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                                }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                    <Button size='sm' onClick={() => openAddEvent()}>
                        <Plus className='h-4 w-4'/>
                        Add event
                    </Button>
                </div>
            </div>

            {view === 'month' && (
                <div className='overflow-x-auto rounded-md border'>
                    <div className='grid grid-cols-7 min-w-[700px]'>
                        {WEEKDAYS.map((day) => (
                            <div key={day} className='border-b bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground'>
                                {day.toUpperCase()}
                            </div>
                        ))}
                        {monthGrid(refDate).map((day) => {
                            const key = toKey(day);
                            const dayEvents = eventsByDay.get(key) || [];
                            const inMonth = day.getMonth() === refDate.getMonth();
                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setRefDate(day);
                                        setView('day');
                                    }}
                                    className={`min-h-[100px] border-b border-r p-2 text-left align-top hover:bg-muted/30 ${
                                        inMonth ? '' : 'text-muted-foreground/40'
                                    }`}
                                >
                                    <span className='text-sm'>{day.getDate()}</span>
                                    <div className='mt-1 space-y-1'>
                                        {dayEvents.slice(0, 2).map((ev) => (
                                            <p
                                                key={ev.uuid}
                                                className='truncate rounded bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary'
                                            >
                                                • {ev.title}
                                            </p>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <p className='text-[10px] text-muted-foreground'>
                                                +{dayEvents.length - 2} more
                                            </p>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {view === 'week' && (
                <div className='overflow-x-auto rounded-md border'>
                    <div className='grid grid-cols-[60px_repeat(7,1fr)] min-w-[900px]'>
                        <div className='border-b border-r bg-muted/40 p-2 text-xs'>Time</div>
                        {Array.from({length: 7}, (_, i) => {
                            const d = new Date(startOfWeek(refDate));
                            d.setDate(d.getDate() + i);
                            return (
                                <div key={i} className='border-b border-r bg-muted/40 p-2 text-center text-xs font-semibold'>
                                    {d.getDate()} <span className='text-muted-foreground'>{WEEKDAYS[i]}</span>
                                </div>
                            );
                        })}
                        {HOURS.map((hour) => (
                            <Fragment key={hour}>
                                <div className='border-b border-r p-2 text-xs text-muted-foreground'>
                                    {hour.toString().padStart(2, '0')}:00
                                </div>
                                {Array.from({length: 7}, (_, i) => {
                                    const d = new Date(startOfWeek(refDate));
                                    d.setDate(d.getDate() + i);
                                    const key = toKey(d);
                                    const hourEvents = (eventsByDay.get(key) || []).filter(
                                        (ev) => ev.start_time && parseInt(ev.start_time.split(':')[0]) === hour
                                    );
                                    return (
                                        <div key={`${key}-${hour}`} className='border-b border-r p-1 min-h-[44px]'>
                                            {hourEvents.map((ev) => (
                                                <button
                                                    key={ev.uuid}
                                                    onClick={() => {
                                                        setActiveEvent(ev);
                                                        setFormOpen(true);
                                                    }}
                                                    className='w-full truncate rounded bg-primary/10 px-1.5 py-0.5 text-[11px] text-primary text-left'
                                                >
                                                    • {ev.title}
                                                </button>
                                            ))}
                                        </div>
                                    );
                                })}
                            </Fragment>
                        ))}
                    </div>
                </div>
            )}

            {view === 'day' && (
                <div className='rounded-md border'>
                    <div className='grid grid-cols-[80px_1fr]'>
                        <div className='border-b border-r bg-muted/40 p-2 text-xs'>Time</div>
                        <div className='border-b bg-muted/40 p-2 text-sm font-semibold'>
                            {refDate.toLocaleDateString('en-US', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}
                        </div>
                        {HOURS.map((hour) => {
                            const key = toKey(refDate);
                            const hourEvents = (eventsByDay.get(key) || []).filter(
                                (ev) => ev.start_time && parseInt(ev.start_time.split(':')[0]) === hour
                            );
                            return (
                                <Fragment key={hour}>
                                    <div className='border-b border-r p-2 text-xs text-muted-foreground'>
                                        {hour.toString().padStart(2, '0')}:00
                                    </div>
                                    <div className='border-b p-1 min-h-[48px] space-y-1'>
                                        {hourEvents.map((ev) => (
                                            <button
                                                key={ev.uuid}
                                                onClick={() => {
                                                    setActiveEvent(ev);
                                                    setFormOpen(true);
                                                }}
                                                className='w-full truncate rounded bg-primary/10 px-2 py-1 text-xs text-primary text-left'
                                            >
                                                • {ev.title}
                                            </button>
                                        ))}
                                    </div>
                                </Fragment>
                            );
                        })}
                    </div>
                </div>
            )}

            <EventFormSheet
                calendarUuid={uuid as string}
                open={formOpen}
                onOpenChange={setFormOpen}
                event={activeEvent}
                defaultDate={formDefaultDate}
                onSaved={fetchData}
            />

            <Dialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete event</DialogTitle>
                        <DialogDescription>
                            You are deleting {pendingDelete?.title}. Do you want to proceed?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setPendingDelete(null)}>
                            Cancel
                        </Button>
                        <Button variant='destructive' onClick={handleDeleteEvent}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
