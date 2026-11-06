import type {SiteEvent} from '@/hooks/site';

// Event dates are stored as calendar dates (midnight UTC), so always format in UTC.
const fmt = (date: string, options: Intl.DateTimeFormatOptions) =>
    new Date(date).toLocaleDateString('en-GB', {timeZone: 'UTC', ...options});

export const eventDay = (date: string) => fmt(date, {day: '2-digit'});
export const eventMonth = (date: string) => fmt(date, {month: 'short'});
export const eventWeekday = (date: string) => fmt(date, {weekday: 'short'});
export const eventMonthHeading = (date: string) => fmt(date, {month: 'long', year: 'numeric'});
export const eventLongDate = (date: string) => fmt(date, {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});

/** "09:00" → "9:00 am" */
export function formatTime(time: string | null) {
    if (!time) return null;
    const [h, m] = time.split(':').map(Number);
    if (Number.isNaN(h)) return time;
    const suffix = h >= 12 ? 'pm' : 'am';
    return `${((h + 11) % 12) + 1}:${String(m || 0).padStart(2, '0')} ${suffix}`;
}

export function eventTimeRange(event: Pick<SiteEvent, 'start_time' | 'end_time'>) {
    const start = formatTime(event.start_time);
    const end = formatTime(event.end_time);
    if (start && end) return `${start} – ${end}`;
    return start || 'All day';
}

export const todayKey = () => new Date().toISOString().slice(0, 10);
export const isUpcoming = (event: SiteEvent) => event.date.slice(0, 10) >= todayKey();

export const termLabel = (calendar: SiteEvent['calendar']) =>
    [calendar.session, calendar.term].filter(Boolean).join(' · ');

/** Plain-text excerpt of rich-text website copy. */
export function excerpt(html: string | null, length = 260) {
    if (!html) return '';
    const text = html
        .replace(/<\/(p|h2|h3|li)>/gi, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
    return text.length > length ? `${text.slice(0, length).replace(/\s+\S*$/, '')}…` : text;
}

export const initials = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/** Builds an .ics file so visitors can add an event to their own calendar. */
export function downloadIcs(event: SiteEvent, schoolName: string) {
    const day = event.date.slice(0, 10).replace(/-/g, '');
    const stamp = (time: string | null) => (time ? `${day}T${time.replace(':', '').padEnd(4, '0')}00` : null);
    const start = stamp(event.start_time);
    const end = stamp(event.end_time);
    const escape = (value: string) => value.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        `PRODID:-//${escape(schoolName)}//Events//EN`,
        'BEGIN:VEVENT',
        `UID:${event.uuid}`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
        start ? `DTSTART:${start}` : `DTSTART;VALUE=DATE:${day}`,
        end ? `DTEND:${end}` : '',
        `SUMMARY:${escape(event.title)}`,
        event.description ? `DESCRIPTION:${escape(event.description)}` : '',
        `LOCATION:${escape([event.location, event.branch.name].filter(Boolean).join(', '))}`,
        'END:VEVENT',
        'END:VCALENDAR',
    ].filter(Boolean);

    const blob = new Blob([lines.join('\r\n')], {type: 'text/calendar'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(url);
}
