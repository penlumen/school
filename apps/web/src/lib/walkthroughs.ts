/**
 * Scenes for the portal walkthrough videos. Screenshots live in
 * public/walkthrough/<role>/<id>.webp; `focus` is the highlighted area as a
 * percentage of the 1280×800 screenshot. Both were captured from a seeded
 * test school, so re-capture them when the screens change.
 */
export interface WalkthroughScene {
    id: string;
    chapter: string;
    title: string;
    caption: string;
    focus: { x: number; y: number; w: number; h: number } | null;
    /** Seconds on screen. */
    duration: number;
}

export type WalkthroughRole = 'staff' | 'parent';

export const WALKTHROUGHS: Record<WalkthroughRole, { title: string; intro: string; scenes: WalkthroughScene[] }> = {
    staff: {
        title: 'Welcome to your school portal',
        intro: 'A two-minute tour of everything staff can do here.',
        scenes: [
            {
                id: 'navigation',
                chapter: 'Getting around',
                title: 'Everything is in the sidebar',
                caption: 'Pages are grouped into Overview, School, Billings and Settings. Click any item to open it; on a phone, tap the menu button at the top.',
                focus: {x: 0, y: 8, w: 19.9, h: 84.9},
                duration: 7,
            },
            {
                id: 'dashboard',
                chapter: 'Getting around',
                title: 'Your dashboard at a glance',
                caption: 'Totals for staff, parents, students and classes, with how they changed since last month, and attendance trends below.',
                focus: {x: 21.9, y: 20.5, w: 76.3, h: 26.3},
                duration: 7,
            },
            {
                id: 'branch',
                chapter: 'Getting around',
                title: 'Switch between branches',
                caption: 'If your school has more than one campus, pick the branch you are working on here. Every page then shows that branch’s data.',
                focus: {x: 0.6, y: 0.9, w: 18.7, h: 6},
                duration: 6,
            },
            {
                id: 'staff',
                chapter: 'People',
                title: 'Staff',
                caption: 'Add staff, set whether they are academic or administrative, and view or edit their details. Administrators also mark staff attendance here.',
                focus: {x: 22, y: 35.6, w: 76.1, h: 18.2},
                duration: 7,
            },
            {
                id: 'students',
                chapter: 'People',
                title: 'Students',
                caption: 'Register students, link each one to a parent and a class, and open a student to see attendance and report cards.',
                focus: {x: 22, y: 28.1, w: 76.1, h: 31.4},
                duration: 7,
            },
            {
                id: 'classes',
                chapter: 'Teaching',
                title: 'Classes',
                caption: 'Create classes, assign teachers and subjects, and mark daily attendance — by list or with facial recognition.',
                focus: {x: 22, y: 28.1, w: 76.1, h: 18.2},
                duration: 7,
            },
            {
                id: 'schedules',
                chapter: 'Teaching',
                title: 'Terms and events',
                caption: 'Set up each session and term, then add events to its calendar. Tick “Show on website” to publish an event on your public site.',
                focus: {x: 22, y: 21.6, w: 76.1, h: 18.2},
                duration: 7,
            },
            {
                id: 'templates',
                chapter: 'Fees',
                title: 'Billing templates',
                caption: 'A template is a list of fees, such as school fees for Basic 1 to 5. Build it once and reuse it every term.',
                focus: {x: 21.9, y: 22.5, w: 76.3, h: 27.9},
                duration: 7,
            },
            {
                id: 'invoices',
                chapter: 'Fees',
                title: 'Invoices and payments',
                caption: 'Issue invoices to one student or a whole class from a template. Record payments with Update status, and print a copy anytime.',
                focus: {x: 21.9, y: 43.3, w: 76.3, h: 47},
                duration: 8,
            },
            {
                id: 'grading',
                chapter: 'Settings',
                title: 'Branch settings and grading',
                caption: 'Update the branch’s details and logo, and set the grade scale used on report cards.',
                focus: {x: 21.9, y: 36.6, w: 76.3, h: 40.1},
                duration: 7,
            },
            {
                id: 'website',
                chapter: 'Settings',
                title: 'Your school website',
                caption: 'School Settings controls your public website: the home page, about page, facilities and photo gallery.',
                focus: {x: 21.9, y: 20.5, w: 14.4, h: 4},
                duration: 7,
            },
            {
                id: 'help',
                chapter: 'Settings',
                title: 'Who’s online, help and alerts',
                caption: 'See which colleagues are online, get alerts from the bell, and open Help to replay this video or take the guided tour.',
                focus: {x: 80.4, y: 1.7, w: 17.7, h: 4.5},
                duration: 7,
            },
        ],
    },
    parent: {
        title: 'Welcome to the parent portal',
        intro: 'A quick tour of how to follow your children’s progress.',
        scenes: [
            {
                id: 'home',
                chapter: 'Your children',
                title: 'Your children at a glance',
                caption: 'Each child has a card with today’s attendance, their attendance over the last 30 days, their latest result and any fees owed.',
                focus: {x: 21.9, y: 41.8, w: 37.3, h: 23.4},
                duration: 8,
            },
            {
                id: 'fees-banner',
                chapter: 'Your children',
                title: 'Fees you owe',
                caption: 'When there is a balance to pay, it shows at the top of your home page. Tap it to see the invoices.',
                focus: {x: 21.9, y: 22.5, w: 76.3, h: 9.8},
                duration: 6,
            },
            {
                id: 'attendance',
                chapter: 'Progress',
                title: 'Attendance, day by day',
                caption: 'Open a child to see each school day: green for present, red for absent. Use the arrows to look at earlier months.',
                focus: {x: 21.9, y: 44.8, w: 45, h: 55.3},
                duration: 7,
            },
            {
                id: 'results',
                chapter: 'Progress',
                title: 'Report cards',
                caption: 'Approved report cards appear under Results. Open one to view it in full or print it.',
                focus: {x: 21.9, y: 37.8, w: 24.6, h: 20.9},
                duration: 7,
            },
            {
                id: 'fees',
                chapter: 'Fees',
                title: 'All your invoices',
                caption: 'Fees lists every invoice for all your children, with what has been paid and what is left.',
                focus: {x: 21.9, y: 43.3, w: 76.3, h: 29},
                duration: 7,
            },
            {
                id: 'invoice',
                chapter: 'Fees',
                title: 'Invoice details and receipts',
                caption: 'Open an invoice to see each fee and every payment the school has recorded. Print it or save it as a PDF.',
                focus: {x: 83.8, y: 25, w: 14.3, h: 30.8},
                duration: 7,
            },
            {
                id: 'calendar',
                chapter: 'School life',
                title: 'Term dates and events',
                caption: 'Calendar shows when term starts and ends, and the events your children’s school has shared with parents.',
                focus: {x: 21.9, y: 22.5, w: 76.3, h: 22.8},
                duration: 7,
            },
            {
                id: 'account',
                chapter: 'School life',
                title: 'Keep your details up to date',
                caption: 'Update your phone numbers and address so the school can reach you, and change your password here.',
                focus: {x: 21.9, y: 31, w: 59.4, h: 45},
                duration: 7,
            },
            {
                id: 'help',
                chapter: 'School life',
                title: 'Alerts and help',
                caption: 'The bell tells you about attendance, results, events and new invoices. Open Help anytime to watch this video again.',
                focus: {x: 89.5, y: 1.7, w: 8.6, h: 4.5},
                duration: 7,
            },
        ],
    },
};
