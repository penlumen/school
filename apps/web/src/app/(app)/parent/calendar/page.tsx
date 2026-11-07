'use client';

import {useEffect, useState} from 'react';

import {type TermDates, useParent} from '@/hooks/parent';
import type {SiteEvent} from '@/hooks/site';
import {eventMonthHeading, isUpcoming} from '@/lib/site-format';
import {Skeleton} from '@/components/ui/skeleton';
import {BillingHeader} from '@/components/app/billing-ui';
import {EventCard} from '@/components/guest/site-ui';

const SCHOOL_NAME = process.env.NEXT_PUBLIC_APP_FULL_NAME || 'School';

const formatDate = (value: string | null) =>
    value ? new Date(value).toLocaleDateString('en-GB', {timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'}) : '—';

export default function ParentCalendarPage() {
    const {calendar} = useParent();
    const [data, setData] = useState<{ events: SiteEvent[]; terms: TermDates[] } | null>(null);

    useEffect(() => {
        calendar().then((r) => setData(r.success ? r.data : {events: [], terms: []}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const upcoming = (data?.events || []).filter(isUpcoming);
    const recent = (data?.events || []).filter((e) => !isUpcoming(e)).reverse();
    const groups = upcoming.reduce<{ month: string; events: SiteEvent[] }[]>((acc, event) => {
        const month = eventMonthHeading(event.date);
        const last = acc[acc.length - 1];
        if (last?.month === month) last.events.push(event);
        else acc.push({month, events: [event]});
        return acc;
    }, []);

    return (
        <div className='space-y-8'>
            <BillingHeader title='Calendar' description='Term dates and school events for your children'/>

            {data === null ? (
                <Skeleton className='h-32 rounded-[10px]'/>
            ) : data.terms.length > 0 && (
                <section className='grid gap-4 md:grid-cols-2'>
                    {data.terms.map((term) => (
                        <div key={term.uuid} className='rounded-[10px] border border-border p-5'>
                            <p className='text-sm text-muted-foreground'>{term.branch.name}</p>
                            <p className='mt-1 font-medium'>{term.session}{term.term ? ` · ${term.term}` : ''}</p>
                            <dl className='mt-4 space-y-2 text-sm'>
                                <div className='flex justify-between gap-3'><dt className='text-muted-foreground'>Term began</dt><dd>{formatDate(term.open_date)}</dd></div>
                                <div className='flex justify-between gap-3'><dt className='text-muted-foreground'>Term ends</dt><dd>{formatDate(term.close_date)}</dd></div>
                                <div className='flex justify-between gap-3'><dt className='text-muted-foreground'>Next term resumes</dt><dd>{formatDate(term.next_term_resumption_date)}</dd></div>
                            </dl>
                        </div>
                    ))}
                </section>
            )}

            <section className='space-y-4'>
                <h2 className='text-lg font-medium'>Upcoming events</h2>
                {data === null ? (
                    <Skeleton className='h-40 rounded-[10px]'/>
                ) : groups.length === 0 ? (
                    <p className='rounded-[10px] border border-dashed border-border p-8 text-center text-sm text-muted-foreground'>
                        No upcoming events right now.
                    </p>
                ) : (
                    <div className='space-y-8'>
                        {groups.map((group) => (
                            <div key={group.month} className='grid gap-4 lg:grid-cols-[180px_1fr]'>
                                <h3 className='font-medium text-muted-foreground'>{group.month}</h3>
                                <div className='space-y-3'>
                                    {group.events.map((event) => <EventCard key={event.uuid} event={event} schoolName={SCHOOL_NAME}/>)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {recent.length > 0 && (
                <section className='space-y-4'>
                    <h2 className='text-lg font-medium'>Recent events</h2>
                    <div className='grid gap-3 lg:grid-cols-2'>
                        {recent.map((event) => <EventCard key={event.uuid} event={event} schoolName={SCHOOL_NAME} compact/>)}
                    </div>
                </section>
            )}
        </div>
    );
}
