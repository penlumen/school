import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Position, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CacheService } from '../cache/cache.service.js';
import { HashingService } from '../common/hashing.service.js';
import { normalizePhone } from '../common/phone.js';
import { nextRegNumber } from '../common/reg-number.js';
import { DecodedUser } from '../common/types/auth.js';
import { PasswordService } from '../mail/password.service.js';
import { WebhooksService } from '../integrations/webhooks.service.js';
import {
  DATA_TYPES,
  type DataType,
  isDataType,
  normalizeKey,
} from './columns.js';

const MAX_ROWS = 2000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Row = Record<string, string>;
type Action = 'create' | 'update' | 'unchanged' | 'error';

export interface RowResult {
  /** Spreadsheet row number (the header is row 1). */
  row: number;
  action: Action;
  /** What identifies the record, e.g. a reg number or email. */
  key: string;
  errors: string[];
  changes: string[];
}

/** A checked row and, unless it has errors, how to save it. */
interface Planned extends RowResult {
  apply?: () => Promise<void>;
}

const lower = (value: string) => value.trim().toLowerCase();

/**
 * Spreadsheet import and export for one branch. Imports are checked in full
 * first (dry run, nothing saved) so staff can see what will be created,
 * updated or rejected; running it again without dry_run saves the rows that
 * passed. Rows are matched to existing records and updated, never duplicated.
 */
@Injectable()
export class DataTransferService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly hashing: HashingService,
    private readonly passwords: PasswordService,
    private readonly webhooks: WebhooksService,
  ) {}

  private assertManager(decoded: DecodedUser) {
    const allowed =
      ['ROOT', 'ADMIN'].includes(decoded.role) ||
      decoded.position === 'ADMINISTRATIVE';
    if (!allowed) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Only administrators can import or export records',
      });
    }
  }

  private invalid(message: string): never {
    throw new UnprocessableEntityException({
      status: 422,
      success: false,
      message,
    });
  }

  private async branch(branchUuid: string | undefined, decoded: DecodedUser) {
    const branch = branchUuid
      ? await this.prisma.branch.findFirst({
          where: { uuid: branchUuid, school_uuid: decoded.school_uuid },
          select: { uuid: true, name: true, reg_prefix: true },
        })
      : null;
    if (!branch) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }
    return branch;
  }

  private type(value: string): DataType {
    if (!isDataType(value)) this.invalid('Unknown record type');
    return value;
  }

  private async term(branchUuid: string, calendarUuid: unknown) {
    const term =
      typeof calendarUuid === 'string' && calendarUuid
        ? await this.prisma.calendar.findFirst({
            where: { uuid: calendarUuid, branch_uuid: branchUuid },
          })
        : null;
    if (!term) this.invalid('Choose a term from this branch');
    return term;
  }

  types() {
    return {
      status: 200,
      success: true,
      message: 'Record types',
      data: { types: DATA_TYPES },
    };
  }

  // ---------- Export ----------

  async export(
    typeParam: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
    query: Record<string, string>,
  ) {
    this.assertManager(decoded);
    const type = this.type(typeParam);
    const branch = await this.branch(branchUuid, decoded);
    const rows = await this.exportRows(type, branch.uuid, query);
    return {
      status: 200,
      success: true,
      message: `${rows.length} ${DATA_TYPES[type].label.toLowerCase()}`,
      data: { columns: DATA_TYPES[type].columns, rows },
    };
  }

  private async exportRows(
    type: DataType,
    branchUuid: string,
    query: Record<string, string>,
  ) {
    switch (type) {
      case 'students': {
        const students = await this.prisma.student.findMany({
          where: { branch_uuid: branchUuid },
          orderBy: [{ class: { name: 'asc' } }, { name: 'asc' }],
          select: {
            name: true,
            reg_number: true,
            gender: true,
            status: true,
            class: { select: { name: true } },
            parent: { select: { email: true, name: true, contact: true } },
          },
        });
        return students.map((s) => ({
          name: s.name,
          reg_number: s.reg_number,
          class: s.class?.name ?? '',
          gender: s.gender ?? '',
          status: s.status,
          parent_email: s.parent?.email ?? '',
          parent_name: s.parent?.name ?? '',
          parent_phone: s.parent?.contact ?? '',
        }));
      }
      case 'staff':
      case 'parents': {
        const roles: Role[] =
          type === 'staff' ? ['ROOT', 'ADMIN', 'STAFF'] : ['PARENT'];
        const access = await this.prisma.branchAccess.findMany({
          where: { branch_uuid: branchUuid, role: { in: roles } },
          select: {
            user: {
              select: {
                name: true,
                email: true,
                position: true,
                contact: true,
                alt_contact: true,
                address: true,
              },
            },
          },
        });
        const seen = new Set<string>();
        return access
          .map((a) => a.user)
          .filter(
            (u): u is NonNullable<typeof u> =>
              !!u && !seen.has(u.email) && !!seen.add(u.email),
          )
          .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
          .map((u) => ({
            name: u.name ?? '',
            email: u.email,
            position: u.position ?? '',
            phone: u.contact ?? '',
            alt_phone: u.alt_contact ?? '',
            address: u.address ?? '',
          }));
      }
      case 'classes': {
        const classes = await this.prisma.class.findMany({
          where: { branch_uuid: branchUuid },
          orderBy: { name: 'asc' },
          select: {
            name: true,
            capacity: true,
            status: true,
            teacher: { select: { email: true } },
          },
        });
        return classes.map((c) => ({
          name: c.name,
          capacity: c.capacity ?? '',
          teacher_email: c.teacher?.email ?? '',
          status: c.status,
        }));
      }
      case 'subjects': {
        const subjects = await this.prisma.subject.findMany({
          where: { class: { branch_uuid: branchUuid } },
          orderBy: [{ class: { name: 'asc' } }, { name: 'asc' }],
          select: {
            name: true,
            description: true,
            class: { select: { name: true } },
          },
        });
        return subjects.map((s) => ({
          class: s.class?.name ?? '',
          name: s.name,
          description: s.description ?? '',
        }));
      }
      case 'results': {
        const term = await this.term(branchUuid, query.calendar_uuid);
        const results = await this.prisma.result.findMany({
          where: {
            calendar_uuid: term.uuid,
            student: { branch_uuid: branchUuid },
          },
          orderBy: [{ class_name: 'asc' }],
          select: {
            class_name: true,
            student: { select: { name: true, reg_number: true } },
            assessments: { orderBy: { subject: 'asc' } },
          },
        });
        return results
          .sort((a, b) =>
            (a.student?.name ?? '').localeCompare(b.student?.name ?? ''),
          )
          .flatMap((r) =>
            r.assessments.map((a) => ({
              reg_number: r.student?.reg_number ?? '',
              student: r.student?.name ?? '',
              class: r.class_name,
              subject: a.subject,
              ca_one: Number(a.ca_one),
              ca_two: Number(a.ca_two),
              exam: Number(a.examination),
              total: Number(a.overall),
            })),
          );
      }
    }
  }

  // ---------- Import ----------

  async import(
    typeParam: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    this.assertManager(decoded);
    const type = this.type(typeParam);
    const branch = await this.branch(branchUuid, decoded);
    if (!Array.isArray(body?.rows)) this.invalid('rows must be a list');
    if (body.rows.length === 0) this.invalid('The file has no rows');
    if (body.rows.length > MAX_ROWS) {
      this.invalid(`Import at most ${MAX_ROWS} rows at a time`);
    }
    const rows: Row[] = body.rows.map((raw: unknown) => {
      const row: Row = {};
      for (const [key, value] of Object.entries(
        (raw ?? {}) as Record<string, unknown>,
      )) {
        row[normalizeKey(key, type)] =
          value === null || value === undefined ? '' : String(value).trim();
      }
      return row;
    });

    const planned = await this.plan(type, rows, branch, decoded, body);
    const dryRun = body?.dry_run !== false;

    if (!dryRun) {
      for (const item of planned) {
        if (
          item.action === 'error' ||
          item.action === 'unchanged' ||
          !item.apply
        )
          continue;
        try {
          await item.apply();
        } catch (error: any) {
          item.errors.push(
            error?.response?.message ||
              error?.message ||
              'Could not save this row',
          );
          item.action = 'error';
        }
      }
      if (type === 'classes')
        await this.cache.delByPrefix(`classes:index:${branch.uuid}:`);
      if (type === 'subjects' || type === 'classes')
        await this.cache.delByPrefix('subjects:index:');
    }

    const results: RowResult[] = planned.map(
      ({ apply: _apply, ...rest }) => rest,
    );
    const count = (action: Action) =>
      results.filter((r) => r.action === action).length;
    const summary = {
      create: count('create'),
      update: count('update'),
      unchanged: count('unchanged'),
      error: count('error'),
    };
    const done = summary.create + summary.update;
    return {
      status: 200,
      success: true,
      message: dryRun
        ? `Ready to import: ${summary.create} new, ${summary.update} to update, ${summary.error} with errors`
        : `Imported ${done} ${done === 1 ? 'row' : 'rows'}${summary.error ? `; ${summary.error} not imported` : ''}`,
      data: { dry_run: dryRun, summary, rows: results },
    };
  }

  private plan(
    type: DataType,
    rows: Row[],
    branch: { uuid: string; reg_prefix: string | null },
    decoded: DecodedUser,
    body: any,
  ): Promise<Planned[]> {
    switch (type) {
      case 'students':
        return this.planStudents(rows, branch, decoded);
      case 'staff':
        return this.planPeople(rows, branch.uuid, decoded, 'staff');
      case 'parents':
        return this.planPeople(rows, branch.uuid, decoded, 'parents');
      case 'classes':
        return this.planClasses(rows, branch.uuid, decoded);
      case 'subjects':
        return this.planSubjects(rows, branch.uuid);
      case 'results':
        return this.planResults(rows, branch.uuid, body?.calendar_uuid);
    }
  }

  /** Flags the second and later rows that use the same key. */
  private duplicates(
    planned: Planned[],
    keyOf: (p: Planned) => string,
    label: string,
  ) {
    const first = new Map<string, number>();
    for (const item of planned) {
      const key = keyOf(item);
      if (!key) continue;
      const seen = first.get(key);
      if (seen !== undefined) {
        item.errors.push(`Same ${label} as row ${seen}`);
        item.action = 'error';
      } else first.set(key, item.row);
    }
  }

  private start(row: number, key: string): Planned {
    return { row, action: 'create', key, errors: [], changes: [] };
  }

  private phone(value: string, label: string, errors: string[]) {
    if (!value) return undefined;
    try {
      return normalizePhone(value, label) ?? undefined;
    } catch (error: any) {
      errors.push(
        error?.response?.message || `${label} is not a valid phone number`,
      );
      return undefined;
    }
  }

  /** New staff and parents: random password plus an invite to choose their own. */
  private async createUser(
    data: {
      name: string;
      email: string;
      role: Role;
      position: Position;
      contact?: string;
      alt_contact?: string;
      address?: string;
    },
    branchUuid: string,
    schoolUuid: string,
  ) {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        school_uuid: schoolUuid,
        password: await this.hashing.createHash(
          randomBytes(12).toString('base64url'),
        ),
        face_descriptor: [],
      },
    });
    await this.prisma.branchAccess.create({
      data: {
        branch_uuid: branchUuid,
        school_uuid: schoolUuid,
        user_uuid: user.uuid,
        role: user.role,
      },
    });
    void this.passwords.sendInvite(user.uuid).catch(() => undefined);
    return user;
  }

  // ----- Students -----

  private async planStudents(
    rows: Row[],
    branch: { uuid: string; reg_prefix: string | null },
    decoded: DecodedUser,
  ) {
    const [classes, students, parents] = await Promise.all([
      this.prisma.class.findMany({
        where: { branch_uuid: branch.uuid },
        select: { uuid: true, name: true },
      }),
      this.prisma.student.findMany({
        where: { branch_uuid: branch.uuid },
        select: {
          uuid: true,
          reg_number: true,
          name: true,
          class_uuid: true,
          gender: true,
          status: true,
          parent_uuid: true,
        },
      }),
      this.prisma.user.findMany({
        where: { school_uuid: decoded.school_uuid, role: 'PARENT' },
        select: { uuid: true, email: true },
      }),
    ]);
    const classByName = new Map(classes.map((c) => [lower(c.name), c]));
    const studentByReg = new Map(students.map((s) => [lower(s.reg_number), s]));
    // Rows without a reg number match a student of the same name in the same
    // class, so importing the same file twice doesn't add them twice.
    const studentByNameClass = new Map(
      students.map((s) => [`${lower(s.name)}|${s.class_uuid}`, s]),
    );
    const parentByEmail = new Map(parents.map((p) => [lower(p.email), p.uuid]));
    // New parents named in the file, created once however many children they have.
    const newParents = new Map<
      string,
      { name: string; phone?: string; uuid?: string }
    >();

    const planned = rows.map((row, i) => {
      const item = this.start(i + 2, row.reg_number || '(next number)');
      const errors = item.errors;
      if (!row.name) errors.push('Name is required');

      const cls = classByName.get(lower(row.class || ''));
      if (!row.class) errors.push('Class is required');
      else if (!cls)
        errors.push(`No class named "${row.class}" in this branch`);

      const gender = !row.gender
        ? undefined
        : /^m(ale)?$/i.test(row.gender)
          ? 'Male'
          : /^f(emale)?$/i.test(row.gender)
            ? 'Female'
            : (errors.push('Gender must be Male or Female'), undefined);
      const status = !row.status
        ? undefined
        : ['active', 'inactive'].includes(lower(row.status))
          ? lower(row.status)
          : (errors.push('Status must be active or inactive'), undefined);

      const email = lower(row.parent_email || '');
      let parentUuid = parentByEmail.get(email);
      if (!email) errors.push('Parent email is required');
      else if (!EMAIL.test(email)) errors.push('Parent email is not valid');
      else if (!parentUuid) {
        const phone = this.phone(
          row.parent_phone || '',
          'Parent phone',
          errors,
        );
        if (!row.parent_name && !newParents.has(email)) {
          errors.push(
            `No parent with email ${email}; add a Parent name to create them`,
          );
        } else if (!newParents.has(email)) {
          newParents.set(email, { name: row.parent_name, phone });
        }
      }

      const existing = row.reg_number
        ? studentByReg.get(lower(row.reg_number))
        : cls && row.name
          ? studentByNameClass.get(`${lower(row.name)}|${cls.uuid}`)
          : undefined;
      if (!row.reg_number && !existing && !branch.reg_prefix) {
        errors.push(
          'Add a reg number, or set a prefix in Branch Settings to number students automatically',
        );
      }

      if (errors.length) {
        item.action = 'error';
        return item;
      }

      if (existing) {
        item.key = existing.reg_number;
        const changes = item.changes;
        if (existing.name !== row.name) changes.push('name');
        if (existing.class_uuid !== cls!.uuid) changes.push('class');
        if (gender && existing.gender !== gender) changes.push('gender');
        if (status && existing.status !== status) changes.push('status');
        if (parentUuid && existing.parent_uuid !== parentUuid)
          changes.push('parent');
        if (!parentUuid) changes.push('parent');
        item.action = changes.length ? 'update' : 'unchanged';
      }

      item.apply = async () => {
        parentUuid ??= await this.parentFor(
          email,
          newParents,
          branch.uuid,
          decoded.school_uuid,
        );
        if (existing) {
          const student = await this.prisma.student.update({
            where: { uuid: existing.uuid },
            data: {
              name: row.name,
              class_uuid: cls!.uuid,
              parent_uuid: parentUuid,
              ...(gender && { gender }),
              ...(status && { status }),
            },
            include: { class: true },
          });
          this.emitStudent(decoded.school_uuid, 'student.updated', student);
          return;
        }
        for (let attempt = 0; ; attempt++) {
          const reg_number =
            row.reg_number ||
            (await nextRegNumber(this.prisma, branch.uuid, branch.reg_prefix!));
          try {
            const student = await this.prisma.student.create({
              data: {
                name: row.name,
                reg_number,
                branch_uuid: branch.uuid,
                class_uuid: cls!.uuid,
                parent_uuid: parentUuid,
                gender,
                status: status ?? 'active',
                face_descriptor: [],
              },
              include: { class: true },
            });
            item.key = student.reg_number;
            this.emitStudent(decoded.school_uuid, 'student.created', student);
            return;
          } catch (error: any) {
            if (error?.code !== 'P2002' || row.reg_number || attempt >= 4) {
              throw error?.code === 'P2002'
                ? new Error('Reg number already taken')
                : error;
            }
          }
        }
      };
      return item;
    });
    this.duplicates(
      planned,
      (p) =>
        rows[p.row - 2].reg_number ? lower(rows[p.row - 2].reg_number) : '',
      'reg number',
    );
    return planned;
  }

  private async parentFor(
    email: string,
    newParents: Map<string, { name: string; phone?: string; uuid?: string }>,
    branchUuid: string,
    schoolUuid: string,
  ) {
    const pending = newParents.get(email)!;
    if (!pending.uuid) {
      const user = await this.createUser(
        {
          name: pending.name,
          email,
          role: 'PARENT',
          position: 'PARENT',
          contact: pending.phone,
        },
        branchUuid,
        schoolUuid,
      );
      pending.uuid = user.uuid;
    }
    return pending.uuid;
  }

  private emitStudent(
    schoolUuid: string,
    event: 'student.created' | 'student.updated',
    s: {
      uuid: string;
      name: string;
      reg_number: string;
      status: string;
      branch_uuid: string;
      class_uuid: string;
      class: { name: string } | null;
    },
  ) {
    this.webhooks.emit(schoolUuid, s.branch_uuid, event, {
      uuid: s.uuid,
      name: s.name,
      reg_number: s.reg_number,
      status: s.status,
      class: { uuid: s.class_uuid, name: s.class?.name ?? null },
    });
  }

  // ----- Staff and parents -----

  private async planPeople(
    rows: Row[],
    branchUuid: string,
    decoded: DecodedUser,
    kind: 'staff' | 'parents',
  ) {
    const roles: Role[] =
      kind === 'staff' ? ['ROOT', 'ADMIN', 'STAFF'] : ['PARENT'];
    const positions: Position[] =
      kind === 'staff'
        ? ['ADMINISTRATIVE', 'ACADEMIC']
        : ['PARENT', 'GUARDIAN'];
    const users = await this.prisma.user.findMany({
      where: { school_uuid: decoded.school_uuid, role: { in: roles } },
      select: {
        uuid: true,
        email: true,
        name: true,
        role: true,
        position: true,
        contact: true,
        alt_contact: true,
        address: true,
        access: { where: { branch_uuid: branchUuid }, select: { id: true } },
      },
    });
    const byEmail = new Map(users.map((u) => [lower(u.email), u]));

    const planned = rows.map((row, i) => {
      const email = lower(row.email || '');
      const item = this.start(i + 2, email);
      const errors = item.errors;
      if (!row.name) errors.push('Name is required');
      if (!email) errors.push('Email is required');
      else if (!EMAIL.test(email)) errors.push('Email is not valid');
      const position = row.position
        ? (positions.find((p) => p === row.position.toUpperCase()) ??
          (errors.push(`Position must be ${positions.join(' or ')}`),
          undefined))
        : undefined;
      const contact = this.phone(row.phone || '', 'Phone', errors);
      const alt_contact = this.phone(row.alt_phone || '', 'Alt phone', errors);
      if (errors.length) {
        item.action = 'error';
        return item;
      }

      const existing = byEmail.get(email);
      // Admin accounts keep their position; only their details change.
      const canChangePosition =
        existing?.role !== 'ROOT' && existing?.role !== 'ADMIN';
      const data = {
        name: row.name,
        ...(position && canChangePosition && { position }),
        ...(contact && { contact }),
        ...(alt_contact && { alt_contact }),
        ...(row.address && { address: row.address }),
      };

      if (existing) {
        const changes = item.changes;
        if (existing.name !== row.name) changes.push('name');
        if (data.position && existing.position !== data.position)
          changes.push('position');
        if (contact && existing.contact !== contact) changes.push('phone');
        if (alt_contact && existing.alt_contact !== alt_contact)
          changes.push('alt phone');
        if (row.address && existing.address !== row.address)
          changes.push('address');
        if (!existing.access.length) changes.push('added to this branch');
        item.action = changes.length ? 'update' : 'unchanged';
        item.apply = async () => {
          await this.prisma.user.update({
            where: { uuid: existing.uuid },
            data,
          });
          if (!existing.access.length) {
            await this.prisma.branchAccess.create({
              data: {
                branch_uuid: branchUuid,
                school_uuid: decoded.school_uuid,
                user_uuid: existing.uuid,
                role: existing.role,
              },
            });
          }
        };
        return item;
      }

      item.apply = async () => {
        const user = await this.createUser(
          {
            name: row.name,
            email,
            role: kind === 'staff' ? 'STAFF' : 'PARENT',
            position: position ?? (kind === 'staff' ? 'ACADEMIC' : 'PARENT'),
            contact,
            alt_contact,
            address: row.address || undefined,
          },
          branchUuid,
          decoded.school_uuid,
        );
        if (kind === 'staff') {
          this.webhooks.emit(decoded.school_uuid, branchUuid, 'staff.created', {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            position: user.position,
          });
        }
      };
      return item;
    });
    this.duplicates(
      planned,
      (p) => lower(rows[p.row - 2].email || ''),
      'email',
    );
    return planned;
  }

  // ----- Classes and subjects -----

  private async planClasses(
    rows: Row[],
    branchUuid: string,
    decoded: DecodedUser,
  ) {
    const [classes, teachers] = await Promise.all([
      this.prisma.class.findMany({ where: { branch_uuid: branchUuid } }),
      this.prisma.user.findMany({
        where: {
          school_uuid: decoded.school_uuid,
          role: { in: ['ROOT', 'ADMIN', 'STAFF'] },
          access: { some: { branch_uuid: branchUuid } },
        },
        select: { uuid: true, email: true },
      }),
    ]);
    const byName = new Map(classes.map((c) => [lower(c.name), c]));
    const teacherByEmail = new Map(
      teachers.map((t) => [lower(t.email), t.uuid]),
    );

    const planned = rows.map((row, i) => {
      const item = this.start(i + 2, row.name || '');
      const errors = item.errors;
      if (!row.name) errors.push('Name is required');
      const capacity =
        row.capacity === '' || row.capacity === undefined
          ? undefined
          : Number(row.capacity);
      if (
        capacity !== undefined &&
        (!Number.isInteger(capacity) || capacity < 0)
      ) {
        errors.push('Capacity must be a whole number');
      }
      const teacherUuid = row.teacher_email
        ? teacherByEmail.get(lower(row.teacher_email))
        : undefined;
      if (row.teacher_email && !teacherUuid) {
        errors.push(
          `No staff member with email ${row.teacher_email} in this branch`,
        );
      }
      const status = !row.status
        ? undefined
        : ['active', 'inactive'].includes(lower(row.status))
          ? lower(row.status)
          : (errors.push('Status must be active or inactive'), undefined);
      if (errors.length) {
        item.action = 'error';
        return item;
      }

      const existing = byName.get(lower(row.name));
      const data = {
        name: row.name,
        ...(capacity !== undefined && { capacity }),
        ...(teacherUuid && { teacher_uuid: teacherUuid }),
        ...(status && { status }),
      };
      if (existing) {
        const changes = item.changes;
        if (existing.name !== row.name) changes.push('name');
        if (capacity !== undefined && existing.capacity !== capacity)
          changes.push('capacity');
        if (teacherUuid && existing.teacher_uuid !== teacherUuid)
          changes.push('teacher');
        if (status && existing.status !== status) changes.push('status');
        item.action = changes.length ? 'update' : 'unchanged';
      }
      item.apply = async () => {
        const saved = existing
          ? await this.prisma.class.update({
              where: { uuid: existing.uuid },
              data,
            })
          : await this.prisma.class.create({
              data: { ...data, branch_uuid: branchUuid },
            });
        this.webhooks.emit(
          decoded.school_uuid,
          branchUuid,
          existing ? 'class.updated' : 'class.created',
          {
            uuid: saved.uuid,
            name: saved.name,
            status: saved.status,
            teacher_uuid: saved.teacher_uuid,
            teachers_uuid: saved.teachers_uuid,
          },
        );
      };
      return item;
    });
    this.duplicates(
      planned,
      (p) => lower(rows[p.row - 2].name || ''),
      'class name',
    );
    return planned;
  }

  private async planSubjects(rows: Row[], branchUuid: string) {
    const classes = await this.prisma.class.findMany({
      where: { branch_uuid: branchUuid },
      select: {
        uuid: true,
        name: true,
        subjects: { select: { uuid: true, name: true, description: true } },
      },
    });
    const byName = new Map(classes.map((c) => [lower(c.name), c]));

    const planned = rows.map((row, i) => {
      const item = this.start(
        i + 2,
        [row.class, row.name].filter(Boolean).join(' · '),
      );
      const cls = byName.get(lower(row.class || ''));
      if (!row.class) item.errors.push('Class is required');
      else if (!cls)
        item.errors.push(`No class named "${row.class}" in this branch`);
      if (!row.name) item.errors.push('Name is required');
      if (item.errors.length) {
        item.action = 'error';
        return item;
      }
      const existing = cls!.subjects.find(
        (s) => lower(s.name) === lower(row.name),
      );
      if (existing) {
        if (row.description && existing.description !== row.description)
          item.changes.push('description');
        if (existing.name !== row.name) item.changes.push('name');
        item.action = item.changes.length ? 'update' : 'unchanged';
      }
      item.apply = async () => {
        if (existing) {
          await this.prisma.subject.update({
            where: { uuid: existing.uuid },
            data: {
              name: row.name,
              ...(row.description && { description: row.description }),
            },
          });
        } else {
          await this.prisma.subject.create({
            data: {
              class_uuid: cls!.uuid,
              name: row.name,
              description: row.description || null,
            },
          });
        }
      };
      return item;
    });
    this.duplicates(
      planned,
      (p) =>
        `${lower(rows[p.row - 2].class || '')}|${lower(rows[p.row - 2].name || '')}`,
      'class and subject',
    );
    return planned;
  }

  // ----- Results -----

  private async planResults(
    rows: Row[],
    branchUuid: string,
    calendarUuid: unknown,
  ) {
    const term = await this.term(branchUuid, calendarUuid);
    const students = await this.prisma.student.findMany({
      where: { branch_uuid: branchUuid },
      select: {
        uuid: true,
        name: true,
        reg_number: true,
        class_uuid: true,
        class: { select: { name: true, subjects: { select: { name: true } } } },
        results: {
          where: { calendar_uuid: term.uuid },
          select: {
            uuid: true,
            class_uuid: true,
            status: true,
            assessments: true,
          },
        },
      },
    });
    const byReg = new Map(students.map((s) => [lower(s.reg_number), s]));

    const score = (
      value: string | undefined,
      label: string,
      errors: string[],
    ) => {
      if (value === undefined || value === '') return undefined;
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0 || n > 100) {
        errors.push(`${label} must be a number from 0 to 100`);
        return undefined;
      }
      return Math.round(n * 100) / 100;
    };

    const planned = rows.map((row, i) => {
      const item = this.start(
        i + 2,
        [row.reg_number, row.subject].filter(Boolean).join(' · '),
      );
      const errors = item.errors;
      const student = byReg.get(lower(row.reg_number || ''));
      if (!row.reg_number) errors.push('Reg number is required');
      else if (!student)
        errors.push(
          `No student with reg number ${row.reg_number} in this branch`,
        );
      if (!row.subject) errors.push('Subject is required');
      const subject = student?.class?.subjects.find(
        (s) => lower(s.name) === lower(row.subject || ''),
      )?.name;
      if (student && row.subject && !subject) {
        errors.push(
          `${student.class?.name ?? 'This class'} has no subject "${row.subject}"`,
        );
      }
      const ca_one = score(row.ca_one, 'CA 1', errors);
      const ca_two = score(row.ca_two, 'CA 2', errors);
      const exam = score(row.exam, 'Exam', errors);

      const result = student?.results.find(
        (r) => r.class_uuid === student.class_uuid,
      );
      if (result?.status === 'APPROVED') {
        errors.push(
          'This report is already approved; reopen it before changing scores',
        );
      }
      const current = result?.assessments.find((a) => a.subject === subject);
      const next = {
        ca_one: ca_one ?? Number(current?.ca_one ?? 0),
        ca_two: ca_two ?? Number(current?.ca_two ?? 0),
        examination: exam ?? Number(current?.examination ?? 0),
      };
      if (
        !errors.length &&
        next.ca_one + next.ca_two + next.examination > 100
      ) {
        errors.push('CA 1 + CA 2 + Exam is more than 100');
      }
      if (errors.length) {
        item.action = 'error';
        return item;
      }

      if (current) {
        if (Number(current.ca_one) !== next.ca_one) item.changes.push('CA 1');
        if (Number(current.ca_two) !== next.ca_two) item.changes.push('CA 2');
        if (Number(current.examination) !== next.examination)
          item.changes.push('exam');
        item.action = item.changes.length ? 'update' : 'unchanged';
      } else {
        item.changes.push(result ? 'new subject score' : 'new report');
        item.action = result ? 'update' : 'create';
      }

      item.apply = async () => {
        const target = await this.resultFor(student!, term.uuid);
        const overall = next.ca_one + next.ca_two + next.examination;
        await this.prisma.assessments.upsert({
          where: {
            result_uuid_subject: { result_uuid: target, subject: subject! },
          },
          update: { ...next, overall },
          create: { result_uuid: target, subject: subject!, ...next, overall },
        });
        const sum = await this.prisma.assessments.aggregate({
          where: { result_uuid: target },
          _sum: { overall: true },
        });
        await this.prisma.result.update({
          where: { uuid: target },
          data: { overall: Number(sum._sum.overall ?? 0) },
        });
      };
      return item;
    });
    this.duplicates(
      planned,
      (p) =>
        `${lower(rows[p.row - 2].reg_number || '')}|${lower(rows[p.row - 2].subject || '')}`,
      'student and subject',
    );
    return planned;
  }

  /** The student's report for the term, created with every class subject if missing. */
  private async resultFor(
    student: {
      uuid: string;
      class_uuid: string;
      class: { name: string; subjects: { name: string }[] } | null;
    },
    calendarUuid: string,
  ) {
    const result = await this.prisma.result.upsert({
      where: {
        calendar_uuid_class_uuid_student_uuid: {
          calendar_uuid: calendarUuid,
          class_uuid: student.class_uuid,
          student_uuid: student.uuid,
        },
      },
      update: {},
      create: {
        calendar_uuid: calendarUuid,
        class_uuid: student.class_uuid,
        class_name: student.class?.name ?? '',
        student_uuid: student.uuid,
      },
    });
    await this.prisma.assessments.createMany({
      data: (student.class?.subjects ?? []).map((s) => ({
        result_uuid: result.uuid,
        subject: s.name,
      })),
      skipDuplicates: true,
    });
    return result.uuid;
  }
}
