/**
 * The separate Penlumen apps a school can connect. Each is its own project
 * and repository; this system is the hub they sign in through and read
 * school data from (see docs/integrations.md).
 */
export const APP_CATALOG = [
  {
    key: 'lms',
    name: 'Learning',
    full_name: 'Learning Management System',
    description: 'Lessons, assignments and course materials for each class.',
    icon: 'book-open',
  },
  {
    key: 'vls',
    name: 'Virtual Lab',
    full_name: 'Virtual Lab System',
    description: 'Hands-on science and computing experiments in the browser.',
    icon: 'flask-conical',
  },
  {
    key: 'ems',
    name: 'Exams',
    full_name: 'Exam Management System',
    description: 'Online tests and exams, marked and fed into report cards.',
    icon: 'clipboard-check',
  },
] as const;

export type AppKey = (typeof APP_CATALOG)[number]['key'];
