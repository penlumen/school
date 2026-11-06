'use client';

import {useMemo, useState} from 'react';

import {type SiteEvent, useSite} from '@/hooks/site';
import {eventMonthHeading, isUpcoming, termLabel} from '@/lib/site-format';
import {Skeleton} from '@/components/ui/skeleton';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Container, EmptyState, EventCard, PageHero, Reveal} from '@/components/guest/site-ui';
import {cn} from '@/lib/utils';

const ALL = 'all';

export default function EventsPage() {
    const {site, events, loading, fallbackName} = useSite();
    const name = site?.name || fallbackName;
    const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
    const [term, setTerm] = useState(ALL);
    const [branch, setBranch] = useState(ALL);

    // Term and campus filters come from the schedules the events belong to.
    const terms = useMemo(() => {
        const seen = new Map<string, string>();
        events.forEach((e) => seen.set(e.calendar.uuid, termLabel(e.calendar)));
        return Array.from(seen, ([uuid, label]) => ({uuid, label}));
    }, [events]);
    const branches = useMemo(() => {
        const seen = new Map<string, string>();
        events.forEach((e) => seen.set(e.branch.uuid, e.branch.name));
        return Array.from(seen, ([uuid, label]) => ({uuid, label}));
    }, [events]);

    const filtered = events.filter(
        (e) =>
            (view === 'upcoming' ? isUpcoming(e) : !isUpcoming(e)) &&
            (term === ALL || e.calendar.uuid === term) &&
            (branch === ALL || e.branch.uuid === branch),
    );
    // Past events read most-recent first.
    const ordered = view === 'past' ? [...filtered].reverse() : filtered;

    const groups = ordered.reduce<{ month: string; events: SiteEvent[] }[]>((acc, event) => {
        const month = eventMonthHeading(event.date);
        const last = acc[acc.length - 1];
        if (last?.month === month) last.events.push(event);
        else acc.push({month, events: [event]});
        return acc;
    }, []);

    const upcomingCount = events.filter(isUpcoming).length;

    return (
        <>
            <PageHero
                eyebrow='Events'
                title='What’s happening at school'
                description={`Open days, celebrations, sports and term dates at ${name}, straight from our school calendar.`}
            />

            <section className='py-16 sm:py-20'>
                <Container>
                    <div className='mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                        <div role='tablist' aria-label='Event timeframe' className='inline-flex w-fit rounded-full bg-muted p-1'>
                            {(['upcoming', 'past'] as const).map((value) => (
                                <button
                                    key={value}
                                    role='tab'
                                    aria-selected={view === value}
                                    onClick={() => setView(value)}
                                    className={cn(
                                        'rounded-full px-5 py-2 text-sm capitalize transition-colors',
                                        view === value ? 'bg-background font-medium text-foreground shadow-sm' : 'text-muted-foreground',
                                    )}
                                >
                                    {value}
                                    {value === 'upcoming' && upcomingCount > 0 && (
                                        <span className='ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground'>{upcomingCount}</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className='flex flex-wrap gap-3'>
                            {terms.length > 1 && (
                                <Select value={term} onValueChange={setTerm}>
                                    <SelectTrigger className='w-56 rounded-full' aria-label='Filter by term'>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL}>All terms</SelectItem>
                                        {terms.map((t) => <SelectItem key={t.uuid} value={t.uuid}>{t.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                            {branches.length > 1 && (
                                <Select value={branch} onValueChange={setBranch}>
                                    <SelectTrigger className='w-48 rounded-full' aria-label='Filter by campus'>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL}>All campuses</SelectItem>
                                        {branches.map((b) => <SelectItem key={b.uuid} value={b.uuid}>{b.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className='space-y-4'>
                            {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className='h-32 rounded-2xl'/>)}
                        </div>
                    ) : groups.length === 0 ? (
                        <EmptyState
                            title={view === 'upcoming' ? 'No upcoming events' : 'No past events'}
                            description={
                                view === 'upcoming'
                                    ? 'New dates are added to the school calendar throughout the term. Check back soon.'
                                    : 'Events will appear here once they have taken place.'
                            }
                        />
                    ) : (
                        <div className='space-y-14'>
                            {groups.map((group) => (
                                <div key={group.month} className='grid gap-6 lg:grid-cols-[200px_1fr]'>
                                    <h2 className='text-lg font-medium text-foreground lg:sticky lg:top-24 lg:h-fit'>{group.month}</h2>
                                    <div className='space-y-4'>
                                        {group.events.map((event, index) => (
                                            <Reveal key={event.uuid} delay={index * 0.05}>
                                                <EventCard event={event} schoolName={name}/>
                                            </Reveal>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Container>
            </section>
        </>
    );
}
