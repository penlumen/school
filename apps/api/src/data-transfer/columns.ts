/**
 * Spreadsheet columns for each record type. Exports write these headers and
 * imports read them, so an exported file can be edited and imported back.
 */
export interface ColumnDef {
  key: string;
  label: string;
  required?: boolean;
  hint?: string;
  /** Written by exports for reference, ignored on import. */
  exportOnly?: boolean;
}

export const DATA_TYPES = {
  students: {
    label: 'Students',
    matchBy: 'reg number (or name and class when it is empty)',
    columns: [
      { key: 'name', label: 'Name', required: true },
      {
        key: 'reg_number',
        label: 'Reg number',
        hint: 'Leave empty for new students to number them from the branch prefix',
      },
      {
        key: 'class',
        label: 'Class',
        required: true,
        hint: 'Must match an existing class name',
      },
      { key: 'gender', label: 'Gender', hint: 'Male or Female' },
      { key: 'date_of_birth', label: 'Date of birth', hint: 'dd/mm/yyyy' },
      { key: 'status', label: 'Status', hint: 'active or inactive' },
      {
        key: 'parent_email',
        label: 'Parent email',
        hint: 'Leave empty to add the student without a parent for now',
      },
      {
        key: 'parent_name',
        label: 'Parent name',
        hint: 'Needed when the parent is new',
      },
      { key: 'parent_phone', label: 'Parent phone' },
    ],
  },
  staff: {
    label: 'Staff',
    matchBy: 'email',
    columns: [
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', required: true },
      {
        key: 'position',
        label: 'Position',
        hint: 'ADMINISTRATIVE or ACADEMIC (default)',
      },
      { key: 'phone', label: 'Phone' },
      { key: 'alt_phone', label: 'Alt phone' },
      { key: 'address', label: 'Address' },
    ],
  },
  parents: {
    label: 'Parents',
    matchBy: 'email',
    columns: [
      { key: 'name', label: 'Name', required: true },
      { key: 'email', label: 'Email', required: true },
      {
        key: 'position',
        label: 'Position',
        hint: 'PARENT (default) or GUARDIAN',
      },
      { key: 'phone', label: 'Phone' },
      { key: 'alt_phone', label: 'Alt phone' },
      { key: 'address', label: 'Address' },
    ],
  },
  classes: {
    label: 'Classes',
    matchBy: 'class name',
    columns: [
      { key: 'name', label: 'Name', required: true },
      { key: 'capacity', label: 'Capacity' },
      {
        key: 'teacher_email',
        label: 'Teacher email',
        hint: 'Email of a staff member in this branch',
      },
      { key: 'status', label: 'Status', hint: 'active or inactive' },
    ],
  },
  subjects: {
    label: 'Subjects',
    matchBy: 'class and subject name',
    columns: [
      { key: 'class', label: 'Class', required: true },
      { key: 'name', label: 'Name', required: true },
      { key: 'description', label: 'Description' },
    ],
  },
  results: {
    label: 'Results',
    matchBy: 'reg number and subject, for the chosen term',
    columns: [
      { key: 'reg_number', label: 'Reg number', required: true },
      { key: 'student', label: 'Student', exportOnly: true },
      { key: 'class', label: 'Class', exportOnly: true },
      { key: 'subject', label: 'Subject', required: true },
      { key: 'ca_one', label: 'CA 1', hint: 'Empty keeps the current score' },
      { key: 'ca_two', label: 'CA 2' },
      { key: 'exam', label: 'Exam' },
      { key: 'total', label: 'Total', exportOnly: true },
    ],
  },
} satisfies Record<
  string,
  { label: string; matchBy: string; columns: ColumnDef[] }
>;

export type DataType = keyof typeof DATA_TYPES;

export const isDataType = (value: string): value is DataType =>
  value in DATA_TYPES;

/** "Parent email" / "parent-email" / "PARENT_EMAIL" -> "parent_email". */
export function normalizeKey(header: string, type: DataType) {
  const simple = header
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
  const columns: ColumnDef[] = DATA_TYPES[type].columns;
  const byLabel = columns.find(
    (c) => c.label.toLowerCase().replace(/[\s-]+/g, '_') === simple,
  );
  if (byLabel) return byLabel.key;
  if (type === 'results' && simple === 'examination') return 'exam';
  return simple;
}
