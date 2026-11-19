/**
 * Dates are shown as dd/mm/yyyy everywhere in the app, whatever the
 * browser's locale. Calendar dates (term dates, due dates, dates of birth)
 * are stored as midnight UTC, so those are read in UTC to avoid showing the
 * day before in timezones behind UTC.
 */

type DateInput = string | Date | null | undefined;

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}(T00:00:00(\.0+)?Z)?$/;
const pad = (n: number) => String(n).padStart(2, '0');

function parts(value: DateInput) {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
    if (isNaN(date.getTime())) return null;
    const utc = typeof value === 'string' && DATE_ONLY.test(value);
    return {
        date,
        day: utc ? date.getUTCDate() : date.getDate(),
        month: (utc ? date.getUTCMonth() : date.getMonth()) + 1,
        year: utc ? date.getUTCFullYear() : date.getFullYear(),
        weekday: date.toLocaleDateString('en-GB', {weekday: 'short', ...(utc && {timeZone: 'UTC'})}),
    };
}

/** 19/11/2026 */
export function formatDate(value: DateInput, fallback = '—') {
    const p = parts(value);
    return p ? `${pad(p.day)}/${pad(p.month)}/${p.year}` : fallback;
}

/** 19/11/2026, 15:45 */
export function formatDateTime(value: DateInput, fallback = '—') {
    const p = parts(value);
    if (!p) return fallback;
    return `${formatDate(value)}, ${pad(p.date.getHours())}:${pad(p.date.getMinutes())}`;
}

/** Thu 19/11/2026 */
export function formatWeekdayDate(value: DateInput, fallback = '—') {
    const p = parts(value);
    return p ? `${p.weekday} ${formatDate(value)}` : fallback;
}

/** "19/11/2026" -> "2026-11-19"; null if it isn't a real date. */
export function parseDisplayDate(value: string): string | null {
    const match = value.trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
    if (!match) return null;
    const [day, month, year] = [Number(match[1]), Number(match[2]), Number(match[3])];
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return `${year}-${pad(month)}-${pad(day)}`;
}
