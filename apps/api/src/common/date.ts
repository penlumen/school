/**
 * dd/mm/yyyy, the date format used everywhere in the app. Dates here are
 * calendar dates stored as midnight UTC, so they are read in UTC.
 */
export function formatDate(date: Date | string) {
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
}
