/**
 * Email categories a school can switch on or off in School Settings › Email.
 * Every in-app notification type maps to one of these, so new notification
 * types are emailed too (under "school") without extra wiring.
 */
export const EMAIL_CATEGORIES = [
  {
    key: 'account',
    label: 'Account invites and password resets',
    description: 'Links to set or reset a password. Always sent.',
    locked: true,
  },
  {
    key: 'invoices',
    label: 'Invoices',
    description: 'New invoices issued to parents.',
  },
  {
    key: 'payments',
    label: 'Payments',
    description:
      'Payment receipts for parents, and online payments for staff to confirm.',
  },
  {
    key: 'results',
    label: 'Results',
    description:
      'Report cards published to parents, and approval requests for staff.',
  },
  {
    key: 'attendance',
    label: 'Attendance',
    description: 'Absence alerts for parents and staff.',
  },
  {
    key: 'events',
    label: 'Events',
    description: 'Events created, changed or cancelled.',
  },
  {
    key: 'school',
    label: 'Other school updates',
    description:
      'Class changes, new students, branch access and other notifications.',
  },
] as const;

export type EmailCategory = (typeof EMAIL_CATEGORIES)[number]['key'];

const PREFIXES: [string, EmailCategory][] = [
  ['INVOICE_', 'invoices'],
  ['PAYMENT_', 'payments'],
  ['RESULT_', 'results'],
  ['ATTENDANCE_', 'attendance'],
  ['EVENT_', 'events'],
];

/** The category an in-app notification type is emailed under. */
export function categoryFor(type: string): EmailCategory {
  return PREFIXES.find(([prefix]) => type.startsWith(prefix))?.[1] ?? 'school';
}

/** Saved switches merged over the defaults (everything on). */
export function emailTypes(saved: unknown): Record<EmailCategory, boolean> {
  const stored = (saved && typeof saved === 'object' ? saved : {}) as Record<
    string,
    unknown
  >;
  return Object.fromEntries(
    EMAIL_CATEGORIES.map((c) => [
      c.key,
      'locked' in c ? true : stored[c.key] !== false,
    ]),
  ) as Record<EmailCategory, boolean>;
}
