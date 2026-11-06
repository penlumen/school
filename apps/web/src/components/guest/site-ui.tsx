'use client';

import type {ReactNode} from 'react';
import {motion} from 'framer-motion';
import {CalendarPlus, Clock, MapPin} from 'lucide-react';

import type {SiteEvent} from '@/hooks/site';
import {cn} from '@/lib/utils';
import {downloadIcs, eventDay, eventMonth, eventTimeRange, eventWeekday, initials, termLabel} from '@/lib/site-format';

/** Fades content up as it scrolls into view. */
export function Reveal({children, delay = 0, className}: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{opacity: 0, y: 24}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-60px'}}
            transition={{duration: 0.5, delay, ease: 'easeOut'}}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function Container({children, className}: { children: ReactNode; className?: string }) {
    return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

export function Eyebrow({children, className}: { children: ReactNode; className?: string }) {
    return (
        <p className={cn('text-sm font-medium uppercase tracking-[0.12em] text-primary', className)}>
            {children}
        </p>
    );
}

export function SectionHeading({
    eyebrow,
    title,
    description,
    align = 'left',
    action,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    align?: 'left' | 'center';
    action?: ReactNode;
}) {
    return (
        <div
            className={cn(
                'mb-10 flex flex-col gap-4 sm:mb-14',
                align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
            )}
        >
            <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
                {eyebrow && <Eyebrow className='mb-3'>{eyebrow}</Eyebrow>}
                <h2 className='text-3xl font-semibold leading-tight tracking-[-0.03em] text-foreground sm:text-4xl'>{title}</h2>
                {description && <p className='mt-4 text-lg leading-relaxed text-muted-foreground'>{description}</p>}
            </div>
            {action}
        </div>
    );
}

/** Compact hero used at the top of inner pages. */
export function PageHero({eyebrow, title, description}: { eyebrow: string; title: string; description?: string | null }) {
    return (
        <section className='relative overflow-hidden border-b border-border bg-[radial-gradient(ellipse_at_top_right,var(--accent),transparent_60%)]'>
            <Container className='py-16 sm:py-24'>
                <Reveal>
                    <Eyebrow className='mb-4'>{eyebrow}</Eyebrow>
                    <h1 className='max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-6xl'>
                        {title}
                    </h1>
                    {description && (
                        <p className='mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground'>{description}</p>
                    )}
                </Reveal>
            </Container>
        </section>
    );
}

/** School logo, or initials on a brand tile when no logo has been uploaded. */
export function SchoolMark({name, logo, className}: { name: string; logo?: string | null; className?: string }) {
    return (
        <span
            className={cn(
                'flex flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary font-semibold text-primary-foreground',
                className,
            )}
        >
            {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={`${name} logo`} className='h-full w-full bg-white object-contain'/>
            ) : (
                initials(name) || 'S'
            )}
        </span>
    );
}

/** Date tile + details for one public event. */
export function EventCard({event, schoolName, compact}: { event: SiteEvent; schoolName: string; compact?: boolean }) {
    return (
        <article className='group flex gap-5 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-[0_4px_30px_rgba(46,45,116,0.1)] sm:p-6'>
            <div className='flex h-20 w-16 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-accent text-accent-foreground'>
                <span className='text-xs font-medium uppercase tracking-wide'>{eventMonth(event.date)}</span>
                <span className='text-2xl font-semibold leading-none tracking-tight'>{eventDay(event.date)}</span>
                <span className='mt-1 text-[11px] text-accent-foreground/70'>{eventWeekday(event.date)}</span>
            </div>
            <div className='min-w-0 flex-1'>
                <div className='mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
                    <span>{termLabel(event.calendar)}</span>
                    <span className='rounded-full bg-muted px-2 py-0.5 text-foreground'>{event.branch.name}</span>
                </div>
                <h3 className='text-lg font-medium leading-snug text-foreground'>{event.title}</h3>
                <div className='mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground'>
                    <span className='flex items-center gap-1.5'>
                        <Clock className='h-4 w-4'/>
                        {eventTimeRange(event)}
                    </span>
                    {event.location && (
                        <span className='flex items-center gap-1.5'>
                            <MapPin className='h-4 w-4'/>
                            {event.location}
                        </span>
                    )}
                </div>
                {!compact && event.description && (
                    <p className='mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground'>{event.description}</p>
                )}
                {!compact && (
                    <button
                        type='button'
                        onClick={() => downloadIcs(event, schoolName)}
                        className='mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline'
                    >
                        <CalendarPlus className='h-4 w-4'/>
                        Add to calendar
                    </button>
                )}
            </div>
        </article>
    );
}

export function EmptyState({title, description}: { title: string; description: string }) {
    return (
        <div className='rounded-2xl border border-dashed border-border px-6 py-16 text-center'>
            <p className='text-lg font-medium text-foreground'>{title}</p>
            <p className='mx-auto mt-2 max-w-md text-muted-foreground'>{description}</p>
        </div>
    );
}
