/**
 * Demo data for local development: one school with two branches, staff,
 * parents, classes, subjects, students, two terms of reports, attendance,
 * events and invoices.
 *
 *   bun run seed            (or: bunx prisma db seed)
 *
 * Safe to run again: it deletes the demo school (slug "demo", and everything
 * under it) and creates it fresh. No other school is touched. It refuses to
 * run when NODE_ENV is production.
 *
 * Sign-in (all accounts share SEED_PASSWORD, default "password"):
 *   admin      admin@demo.test
 *   bursar     bursar@demo.test
 *   teachers   teacher1@demo.test ... teacher8@demo.test
 *   parents    parent1@demo.test ... parent24@demo.test
 *   students   their reg number + PIN 1234 (student portal)
 *
 * The school's token is SEED_SCHOOL_TOKEN or, if unset, NEXT_PUBLIC_SCHOOL_TOKEN
 * from apps/web/.env, so the local web app opens straight onto the demo school.
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to seed demo data with NODE_ENV=production.');
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const SLUG = 'demo';
const PASSWORD = process.env.SEED_PASSWORD || 'password';
const STUDENT_PIN = '1234';
const STUDENTS_PER_CLASS = 8;

// ---------- helpers ----------

// Small seeded random generator, so every run produces the same data.
let state = 20261120;
const random = () => {
  state = (state * 1664525 + 1013904223) % 4294967296;
  return state / 4294967296;
};
const pick = <T>(items: readonly T[]) =>
  items[Math.floor(random() * items.length)];
const between = (min: number, max: number) =>
  min + Math.floor(random() * (max - min + 1));
const halves = (min: number, max: number) => between(min * 2, max * 2) / 2;

const day = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
const today = new Date(
  new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z',
);
const daysAgo = (n: number) => new Date(today.getTime() - n * 86_400_000);

/** The last `count` weekdays before today, oldest first. */
const recentSchoolDays = (count: number) => {
  const days: Date[] = [];
  for (let n = 1; days.length < count; n++) {
    const d = daysAgo(n);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) days.unshift(d);
  }
  return days;
};

function schoolToken() {
  if (process.env.SEED_SCHOOL_TOKEN) return process.env.SEED_SCHOOL_TOKEN;
  try {
    const env = readFileSync(
      join(import.meta.dirname, '../../web/.env'),
      'utf8',
    );
    return env.match(/^NEXT_PUBLIC_SCHOOL_TOKEN\s*=\s*"?([^"\r\n]+)"?/m)?.[1];
  } catch {
    return undefined;
  }
}

// ---------- reference data ----------

const FIRST = {
  male: [
    'Chinedu',
    'Tunde',
    'Ibrahim',
    'Emeka',
    'Seun',
    'Musa',
    'Kelechi',
    'Femi',
    'Uche',
    'Yusuf',
    'Daniel',
    'David',
    'Tobi',
    'Obinna',
    'Ahmed',
    'Samuel',
  ],
  female: [
    'Amaka',
    'Aisha',
    'Funke',
    'Ngozi',
    'Zainab',
    'Blessing',
    'Chioma',
    'Kemi',
    'Halima',
    'Ada',
    'Grace',
    'Esther',
    'Tolu',
    'Ifeoma',
    'Fatima',
    'Ruth',
  ],
};
const SURNAMES = [
  'Okafor',
  'Adeyemi',
  'Bello',
  'Eze',
  'Ogunleye',
  'Abubakar',
  'Nwosu',
  'Balogun',
  'Okeke',
  'Lawal',
  'Ibe',
  'Afolabi',
  'Danjuma',
  'Obi',
  'Salami',
  'Uzor',
  'Olatunji',
  'Garba',
  'Chukwu',
  'Akande',
  'Onyeka',
  'Ajayi',
  'Usman',
  'Nnamdi',
];

const SUBJECTS = {
  junior: [
    'Mathematics',
    'English Language',
    'Basic Science',
    'Basic Technology',
    'Social Studies',
    'Civic Education',
    'Computer Studies',
    'French',
    'Christian Religious Studies',
    'Agricultural Science',
  ],
  senior: [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Government',
    'Literature in English',
    'Further Mathematics',
    'Geography',
  ],
  primary: [
    'Mathematics',
    'English Language',
    'Basic Science',
    'Social Studies',
    'Verbal Reasoning',
    'Quantitative Reasoning',
    'Creative Arts',
  ],
};

const GRADES = [
  { score: 75, grade: 'A1', remark: 'Excellent', description: '75-100' },
  { score: 70, grade: 'B2', remark: 'Very good', description: '70-74' },
  { score: 65, grade: 'B3', remark: 'Good', description: '65-69' },
  { score: 60, grade: 'C4', remark: 'Credit', description: '60-64' },
  { score: 55, grade: 'C5', remark: 'Credit', description: '55-59' },
  { score: 50, grade: 'C6', remark: 'Credit', description: '50-54' },
  { score: 45, grade: 'D7', remark: 'Pass', description: '45-49' },
  { score: 40, grade: 'E8', remark: 'Pass', description: '40-44' },
  { score: 0.01, grade: 'F9', remark: 'Fail', description: '0-39' },
];

const TRAITS = [
  'Punctuality',
  'Neatness',
  'Attentiveness',
  'Politeness',
  'Teamwork',
  'Honesty',
];

const TEACHER_REMARKS = [
  'A hardworking student. Keep it up.',
  'Good progress this term; more focus in class will help.',
  'Shows great promise. Should read more.',
  'Well behaved and attentive.',
  'Can do better with more practice at home.',
];
const PRINCIPAL_REMARKS = [
  'An impressive result. Well done.',
  'A good result. Aim higher next term.',
  'Satisfactory. More effort is needed.',
  'Promoted on trial. Work harder.',
];

// ---------- seed ----------

async function main() {
  const token = schoolToken();
  if (token) {
    const holder = await prisma.school.findUnique({
      where: { token },
      select: { slug: true },
    });
    if (holder && holder.slug !== SLUG) {
      throw new Error(
        `School token ${token} already belongs to school "${holder.slug}". Set SEED_SCHOOL_TOKEN to another value.`,
      );
    }
  }

  const removed = await prisma.school.deleteMany({ where: { slug: SLUG } });
  if (removed.count) console.log('Removed the previous demo school.');

  const password = await bcrypt.hash(PASSWORD, 10);
  const pin = await bcrypt.hash(STUDENT_PIN, 10);

  // ----- School and branches -----
  const school = await prisma.school.create({
    data: {
      slug: SLUG,
      ...(token ? { token } : {}),
      name: 'Penlumen Demo School',
      email: 'info@demo.test',
      contact: '+2348012345678',
      address: '12 Admiralty Way, Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos',
      country: 'Nigeria',
      subtext: 'Raising curious, confident and kind learners since 2004.',
      about:
        'Penlumen Demo School is a co-educational day school offering nursery, primary and secondary education with a strong focus on science, the arts and character.',
      mission:
        'To give every child an excellent education in a safe and caring environment.',
      vision:
        'To be the school families trust most for academic excellence and good character.',
      features: [
        {
          icon: 'graduation-cap',
          title: 'Experienced teachers',
          description: 'Qualified, caring teachers in every class.',
        },
        {
          icon: 'flask-conical',
          title: 'Modern laboratories',
          description: 'Fully equipped science and computer labs.',
        },
        {
          icon: 'trophy',
          title: 'Sports and clubs',
          description: 'Football, debate, coding and music clubs every week.',
        },
      ],
      values: [
        {
          title: 'Integrity',
          description: 'We do the right thing, even when no one is watching.',
        },
        {
          title: 'Excellence',
          description: 'We aim high in everything we do.',
        },
        {
          title: 'Respect',
          description: 'We value every person in our community.',
        },
      ],
      theme: { preset: 'forest', primary: '#166534' },
      allow_part_payment: true,
      facilities: {
        create: [
          {
            title: 'Science laboratory',
            description: 'Physics, chemistry and biology practicals.',
            position: 0,
          },
          {
            title: 'Library',
            description: 'Over 5,000 books and a quiet reading room.',
            position: 1,
          },
          {
            title: 'Sports field',
            description: 'A full-size football pitch and running track.',
            position: 2,
          },
        ],
      },
    },
  });

  const branchData = [
    {
      name: 'Main Campus',
      reg_prefix: 'PDS/MC',
      address: '12 Admiralty Way, Lekki Phase 1, Lagos',
      email: 'main@demo.test',
      contact: '+2348012345678',
    },
    {
      name: 'Ikeja Annex',
      reg_prefix: 'PDS/IK',
      address: '4 Allen Avenue, Ikeja, Lagos',
      email: 'ikeja@demo.test',
      contact: '+2348087654321',
    },
  ];
  const branches = [];
  for (const b of branchData) {
    branches.push(
      await prisma.branch.create({ data: { school_uuid: school.uuid, ...b } }),
    );
  }
  const [main, annex] = branches;

  // ----- Users -----
  // created_at is backdated so the dashboard's "vs last term" figures look real:
  // most people joined in 2024, a few this term (which started 14/09/2026).
  const LONG_AGO = day('2024-09-02');
  const THIS_TERM = day('2026-09-16');
  const newUser = (data: {
    name: string;
    email: string;
    role: 'ADMIN' | 'STAFF' | 'PARENT';
    position: 'ADMINISTRATIVE' | 'ACADEMIC' | 'PARENT' | 'GUARDIAN';
    contact?: string;
    address?: string;
    created_at?: Date;
  }) =>
    prisma.user.create({
      data: {
        created_at: LONG_AGO,
        ...data,
        password,
        school_uuid: school.uuid,
        face_descriptor: [],
        walkthrough_seen_at: new Date(),
      },
    });
  const grantAccess = (
    user: {
      uuid: string;
      role: 'ADMIN' | 'STAFF' | 'PARENT' | 'ROOT';
      created_at: Date;
    },
    branchUuids: string[],
  ) =>
    prisma.branchAccess.createMany({
      data: branchUuids.map((branch_uuid) => ({
        user_uuid: user.uuid,
        role: user.role,
        school_uuid: school.uuid,
        branch_uuid,
        created_at: user.created_at,
      })),
    });

  const admin = await newUser({
    name: 'Adaeze Okonkwo',
    email: 'admin@demo.test',
    role: 'ADMIN',
    position: 'ADMINISTRATIVE',
    contact: '+2348030000001',
  });
  await grantAccess(admin, [main.uuid, annex.uuid]);
  await prisma.user.update({
    where: { uuid: admin.uuid },
    data: { last_branch_uuid: main.uuid },
  });

  const bursar = await newUser({
    name: 'Kunle Adebayo',
    email: 'bursar@demo.test',
    role: 'STAFF',
    position: 'ADMINISTRATIVE',
    contact: '+2348030000002',
  });
  await grantAccess(bursar, [main.uuid, annex.uuid]);

  const teachers = [];
  for (let i = 1; i <= 8; i++) {
    const gender = i % 2 ? 'female' : 'male';
    const teacher = await newUser({
      name: `${pick(gender === 'female' ? ['Mrs.', 'Miss'] : ['Mr.'])} ${pick(FIRST[gender])} ${pick(SURNAMES)}`,
      email: `teacher${i}@demo.test`,
      role: 'STAFF',
      position: 'ACADEMIC',
      contact: `+23480300001${String(i).padStart(2, '0')}`,
      created_at: i === 6 || i === 8 ? THIS_TERM : LONG_AGO,
    });
    await grantAccess(teacher, [i <= 6 ? main.uuid : annex.uuid]);
    teachers.push(teacher);
  }

  const parents = [];
  for (let i = 1; i <= 24; i++) {
    const surname = SURNAMES[i - 1];
    const gender = i % 3 ? 'female' : 'male';
    const parent = await newUser({
      name: `${gender === 'female' ? 'Mrs.' : 'Mr.'} ${pick(FIRST[gender])} ${surname}`,
      email: `parent${i}@demo.test`,
      role: 'PARENT',
      position: i % 7 === 0 ? 'GUARDIAN' : 'PARENT',
      contact: `+23481${String(10000000 + i * 7919).slice(0, 8)}`,
      address: `${between(1, 99)} ${pick(['Awolowo Road', 'Bode Thomas Street', 'Adeola Odeku Street', 'Opebi Road', 'Admiralty Way'])}, Lagos`,
      created_at: i % 6 === 0 ? THIS_TERM : LONG_AGO,
    });
    await grantAccess(parent, [i <= 18 ? main.uuid : annex.uuid]);
    parents.push(parent);
  }

  // ----- Per-branch setup: grading, traits, terms, classes -----
  const classPlan = [
    {
      branch: main,
      names: ['JSS 1', 'JSS 2', 'JSS 3'],
      subjects: SUBJECTS.junior,
      teachers: teachers.slice(0, 3),
      parents: parents.slice(0, 18),
      admitted: [26, 25, 24],
      ages: [11, 12, 13],
    },
    {
      branch: main,
      names: ['SSS 1', 'SSS 2', 'SSS 3'],
      subjects: SUBJECTS.senior,
      teachers: teachers.slice(3, 6),
      parents: parents.slice(0, 18),
      admitted: [23, 22, 21],
      ages: [14, 15, 16],
    },
    {
      branch: annex,
      names: ['Primary 4', 'Primary 5'],
      subjects: SUBJECTS.primary,
      teachers: teachers.slice(6, 8),
      parents: parents.slice(18),
      admitted: [24, 23],
      ages: [9, 10],
    },
  ];

  const terms = new Map<
    string,
    { previous: { uuid: string }; current: { uuid: string } }
  >();
  for (const branch of branches) {
    await prisma.grade.createMany({
      data: GRADES.map((g) => ({ ...g, branch_uuid: branch.uuid })),
    });
    await prisma.affectiveTrait.createMany({
      data: TRAITS.map((name, position) => ({
        name,
        position,
        branch_uuid: branch.uuid,
      })),
    });
    const previous = await prisma.calendar.create({
      data: {
        branch_uuid: branch.uuid,
        session: '2025/2026',
        term: 'Third Term',
        status: 'INACTIVE',
        open_date: day('2026-04-27'),
        close_date: day('2026-07-24'),
        next_term_resumption_date: day('2026-09-14'),
      },
    });
    const current = await prisma.calendar.create({
      data: {
        branch_uuid: branch.uuid,
        session: '2026/2027',
        term: 'First Term',
        status: 'ACTIVE',
        open_date: day('2026-09-14'),
        close_date: day('2026-12-18'),
        next_term_resumption_date: day('2027-01-11'),
      },
    });
    terms.set(branch.uuid, { previous, current });
  }
  const traitsByBranch = new Map<string, { uuid: string; name: string }[]>();
  for (const branch of branches) {
    traitsByBranch.set(
      branch.uuid,
      await prisma.affectiveTrait.findMany({
        where: { branch_uuid: branch.uuid },
        select: { uuid: true, name: true },
      }),
    );
  }

  // ----- Classes, subjects, students -----
  type SeededStudent = {
    uuid: string;
    name: string;
    parent_uuid: string | null;
    branch_uuid: string;
    class_uuid: string;
    class_name: string;
    subjects: string[];
    ability: number;
  };
  const students: SeededStudent[] = [];
  const usedNames = new Set<string>();
  const regCounter = new Map<string, number>();

  for (const plan of classPlan) {
    for (const [index, name] of plan.names.entries()) {
      const klass = await prisma.class.create({
        data: {
          branch_uuid: plan.branch.uuid,
          name,
          capacity: 30,
          created_at: LONG_AGO,
          teacher_uuid: plan.teachers[index].uuid,
          teachers_uuid: plan.teachers
            .filter((_, i) => i !== index)
            .map((t) => t.uuid)
            .slice(0, 1),
        },
      });
      await prisma.subject.createMany({
        data: plan.subjects.map((subject, position) => ({
          class_uuid: klass.uuid,
          name: subject,
          position,
        })),
      });

      for (let n = 0; n < STUDENTS_PER_CLASS; n++) {
        const gender = random() < 0.5 ? 'male' : 'female';
        // Siblings: most parents have one or two children across the classes.
        const parent =
          n === STUDENTS_PER_CLASS - 1 && index === 0
            ? null
            : pick(plan.parents);
        const surname = parent
          ? parent.name!.split(' ').at(-1)!
          : pick(SURNAMES);
        let fullName = '';
        do fullName = `${pick(FIRST[gender])} ${surname}`;
        while (usedNames.has(fullName));
        usedNames.add(fullName);

        const year = plan.admitted[index];
        const stem = `${plan.branch.reg_prefix}/${year}`;
        const next = (regCounter.get(stem) ?? 1000) + 1;
        regCounter.set(stem, next);
        const age = plan.ages[index];

        const student = await prisma.student.create({
          data: {
            branch_uuid: plan.branch.uuid,
            class_uuid: klass.uuid,
            parent_uuid: parent?.uuid ?? null,
            reg_number: `${stem}/${next}`,
            name: fullName,
            gender,
            date_of_birth: day(
              `${2026 - age}-${String(between(1, 12)).padStart(2, '0')}-${String(between(1, 28)).padStart(2, '0')}`,
            ),
            face_descriptor: [],
            pin_hash: pin,
            // Admitted in September of their admission year; this year's intake joined this term.
            created_at: year === 26 ? THIS_TERM : day(`20${year}-09-08`),
          },
        });
        students.push({
          uuid: student.uuid,
          name: fullName,
          parent_uuid: parent?.uuid ?? null,
          branch_uuid: plan.branch.uuid,
          class_uuid: klass.uuid,
          class_name: name,
          subjects: plan.subjects,
          ability: 0.45 + random() * 0.5,
        });
      }
    }
  }

  // ----- Reports: last term approved, this term in progress -----
  const score = (ability: number, max: number) =>
    Math.min(
      max,
      Math.max(
        0,
        halves(
          Math.floor(max * (ability - 0.2)),
          Math.ceil(max * (ability + 0.12)),
        ),
      ),
    );
  for (const [i, s] of students.entries()) {
    const { previous, current } = terms.get(s.branch_uuid)!;
    const traits = traitsByBranch.get(s.branch_uuid)!;

    for (const term of ['previous', 'current'] as const) {
      const calendar = term === 'previous' ? previous : current;
      // This term: about half the reports have scores; a few await approval.
      const filled = term === 'previous' || i % 2 === 0;
      const rows = s.subjects.map((subject) => {
        const assessment = filled ? score(s.ability, 40) : 0;
        const examination = filled ? score(s.ability, 60) : 0;
        return {
          subject,
          assessment: new Prisma.Decimal(assessment),
          examination: new Prisma.Decimal(examination),
          overall: new Prisma.Decimal(assessment + examination),
        };
      });
      const overall = rows.reduce((sum, r) => sum + Number(r.overall), 0);
      const approved = term === 'previous';
      const result = await prisma.result.create({
        data: {
          student_uuid: s.uuid,
          calendar_uuid: calendar.uuid,
          class_uuid: s.class_uuid,
          class_name: s.class_name,
          overall,
          status: approved
            ? 'APPROVED'
            : filled && i % 6 === 0
              ? 'REJECTED'
              : 'PENDING',
          approval_requested: !approved && filled && i % 6 !== 0 && i % 4 === 0,
          created_at: approved ? day('2026-07-10') : day('2026-10-05'),
          updated_at: approved ? day('2026-07-20') : daysAgo(between(1, 20)),
          teacher_remark:
            approved || (filled && i % 4 === 0) ? pick(TEACHER_REMARKS) : null,
          principal_remark: approved ? pick(PRINCIPAL_REMARKS) : null,
          assessments: { create: rows },
        },
      });
      if (approved) {
        await prisma.affectiveRating.createMany({
          data: traits.map((t) => ({
            result_uuid: result.uuid,
            trait_uuid: t.uuid,
            trait_name: t.name,
            rating: between(3, 5),
          })),
        });
      }
    }
  }

  // ----- Attendance: the last two weeks -----
  const schoolDays = recentSchoolDays(10);
  await prisma.studentAttendance.createMany({
    data: students.flatMap((s) =>
      schoolDays.map((date) => ({
        student_uuid: s.uuid,
        branch_uuid: s.branch_uuid,
        class_uuid: s.class_uuid,
        date,
        status: random() < 0.93 ? ('PRESENT' as const) : ('ABSENT' as const),
        marked_by_uuid: admin.uuid,
      })),
    ),
  });
  const staffBranch = [
    [bursar, main],
    ...teachers.map((t, i) => [t, i < 6 ? main : annex] as const),
  ] as const;
  await prisma.staffAttendance.createMany({
    data: staffBranch.flatMap(([staff, branch]) =>
      schoolDays.map((date) => ({
        staff_uuid: staff.uuid,
        branch_uuid: branch.uuid,
        date,
        status: random() < 0.95 ? ('PRESENT' as const) : ('ABSENT' as const),
        marked_by_uuid: admin.uuid,
      })),
    ),
  });

  // ----- Events this term -----
  for (const branch of branches) {
    const { current } = terms.get(branch.uuid)!;
    const events = [
      {
        title: 'Parent-teacher meeting',
        description:
          "Meet your child's teachers to discuss progress this term.",
        date: day('2026-10-24'),
        start_time: '10:00',
        end_time: '13:00',
        location: 'School hall',
        tag_all_parents: true,
        tag_all_staff: true,
        is_public: false,
      },
      {
        title: 'Inter-house sports',
        description:
          'Annual inter-house sports competition. Parents are welcome.',
        date: day('2026-11-28'),
        start_time: '09:00',
        end_time: '15:00',
        location: 'Sports field',
        tag_all_parents: true,
        tag_all_staff: true,
        is_public: true,
      },
      {
        title: 'Staff training',
        description: 'Training on the new report card and score limits.',
        date: day('2026-11-25'),
        start_time: '14:00',
        end_time: '16:00',
        location: 'Staff room',
        tag_all_parents: false,
        tag_all_staff: true,
        is_public: false,
      },
      {
        title: 'First term examinations begin',
        description: 'Examinations run for two weeks.',
        date: day('2026-12-01'),
        start_time: '08:00',
        end_time: '14:00',
        location: 'Classrooms',
        tag_all_parents: true,
        tag_all_staff: true,
        is_public: true,
      },
      {
        title: 'Carol service and end of term',
        description: 'Carols, a short play and the end-of-term address.',
        date: day('2026-12-17'),
        start_time: '11:00',
        end_time: '13:00',
        location: 'School hall',
        tag_all_parents: true,
        tag_all_staff: true,
        is_public: true,
      },
    ];
    await prisma.event.createMany({
      data: events.map((e) => ({
        ...e,
        calendar_uuid: current.uuid,
        branch_uuid: branch.uuid,
        created_by_uuid: admin.uuid,
      })),
    });
  }

  // ----- Billing: fee templates and this term's invoices -----
  let invoiceNo = 0;
  for (const branch of branches) {
    const { current } = terms.get(branch.uuid)!;
    const items =
      branch === main
        ? [
            ['Tuition', 185000],
            ['Development levy', 25000],
            ['Books and stationery', 30000],
            ['ICT', 15000],
          ]
        : [
            ['Tuition', 120000],
            ['Books and stationery', 20000],
            ['Lunch', 45000],
          ];
    const template = await prisma.billingTemplate.create({
      data: {
        branch_uuid: branch.uuid,
        name: '2026/2027 First Term Fees',
        description: 'School fees for the first term.',
        items: {
          create: items.map(([description, amount], position) => ({
            description: String(description),
            amount: new Prisma.Decimal(amount),
            position,
          })),
        },
      },
    });
    await prisma.billingTemplate.create({
      data: {
        branch_uuid: branch.uuid,
        name: 'School bus',
        description: 'Optional termly transport.',
        items: {
          create: [
            {
              description: 'School bus (term)',
              amount: new Prisma.Decimal(60000),
            },
          ],
        },
      },
    });
    const total = items.reduce((sum, [, amount]) => sum + Number(amount), 0);

    for (const s of students.filter((x) => x.branch_uuid === branch.uuid)) {
      invoiceNo++;
      const roll = random();
      const status =
        roll < 0.45
          ? 'FULL_PAYMENT'
          : roll < 0.7
            ? 'PART_PAYMENT'
            : roll < 0.95
              ? 'PENDING'
              : 'CANCELLED';
      const paid =
        status === 'FULL_PAYMENT'
          ? total
          : status === 'PART_PAYMENT'
            ? Math.round((total * between(30, 70)) / 100 / 1000) * 1000
            : 0;
      const history: Prisma.InvoiceStatusChangeCreateWithoutInvoiceInput[] = [
        {
          status: 'PENDING',
          amount: new Prisma.Decimal(0),
          description: 'Invoice issued',
          created_by_uuid: bursar.uuid,
          created_at: day('2026-09-14'),
        },
      ];
      if (paid)
        history.push({
          status: status as 'FULL_PAYMENT' | 'PART_PAYMENT',
          amount: new Prisma.Decimal(paid),
          description:
            status === 'FULL_PAYMENT'
              ? 'Paid in full (bank transfer)'
              : 'Part payment (bank transfer)',
          created_by_uuid: bursar.uuid,
          created_at: day('2026-09-28'),
        });
      if (status === 'CANCELLED')
        history.push({
          status: 'CANCELLED',
          amount: new Prisma.Decimal(0),
          description: 'Student on scholarship',
          created_by_uuid: admin.uuid,
          created_at: day('2026-09-20'),
        });
      await prisma.invoice.create({
        data: {
          number: `INV-2609-${String(invoiceNo).padStart(4, '0')}DEMO`,
          branch_uuid: branch.uuid,
          student_uuid: s.uuid,
          template_uuid: template.uuid,
          class_uuid: s.class_uuid,
          calendar_uuid: current.uuid,
          status,
          total: new Prisma.Decimal(total),
          paid: new Prisma.Decimal(paid),
          issued_at: day('2026-09-14'),
          due_at: day('2026-10-09'),
          items: {
            create: items.map(([description, amount], position) => ({
              description: String(description),
              amount: new Prisma.Decimal(amount),
              position,
            })),
          },
          history: { create: history },
        },
      });
    }
  }

  // ----- Summary -----
  const count = (n: number, word: string, plural = `${word}s`) =>
    `${n} ${n === 1 ? word : plural}`;
  console.log(
    `\nSeeded "${school.name}" (slug ${SLUG}${token ? `, token ${token}` : ''}):`,
  );
  console.log(
    `  ${count(branches.length, 'branch', 'branches')}, ${count(teachers.length + 2, 'staff member')}, ${count(parents.length, 'parent')}, ${count(students.length, 'student')}`,
  );
  console.log(
    `  ${count(students.length * 2, 'report')} (last term approved, this term in progress), ${count(invoiceNo, 'invoice')}, ${count(schoolDays.length, 'day')} of attendance`,
  );
  console.log(`\nSign in with password "${PASSWORD}":`);
  console.log(
    '  admin@demo.test (admin), bursar@demo.test, teacher1-8@demo.test, parent1-24@demo.test',
  );
  console.log(
    `  Student portal: any reg number (e.g. PDS/MC/26/1001) with PIN ${STUDENT_PIN}`,
  );
  if (!token)
    console.log(
      '\nNo school token found: set SEED_SCHOOL_TOKEN or NEXT_PUBLIC_SCHOOL_TOKEN in apps/web/.env to open the demo school from the web app.',
    );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
