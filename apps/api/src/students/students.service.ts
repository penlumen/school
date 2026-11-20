import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { parseRecordStatus } from '../common/record-status.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { StorageService } from '../storage/storage.service.js';
import { WebhooksService } from '../integrations/webhooks.service.js';
import { nextRegNumber } from '../common/reg-number.js';
import { DecodedUser } from '../common/types/auth.js';
import { HashingService } from '../common/hashing.service.js';
import { normalizePhone } from '../common/phone.js';
import { PasswordService } from '../mail/password.service.js';
import { randomBytes } from 'crypto';
import { Position } from '@prisma/client';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly storage: StorageService,
    private readonly webhooks: WebhooksService,
    private readonly hashing: HashingService,
    private readonly passwords: PasswordService,
  ) {}

  /**
   * Checks the "New parent" details sent with a new student, before anything
   * is saved. An email that already belongs to a parent is refused so the
   * existing record is picked instead of duplicated.
   */
  private async checkNewParent(input: any, schoolUuid: string) {
    const invalid = (message: string): never => {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message,
      });
    };
    const name = typeof input?.name === 'string' ? input.name.trim() : '';
    const email =
      typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '';
    if (!name) invalid("Enter the parent's name");
    if (!email || !EMAIL.test(email)) {
      invalid("Enter the parent's email address");
    }
    const position: Position =
      input?.position === 'GUARDIAN' ? 'GUARDIAN' : 'PARENT';
    const existing = await this.prisma.user.findFirst({
      where: {
        school_uuid: schoolUuid,
        role: 'PARENT',
        email: { equals: email, mode: 'insensitive' },
      },
      select: { name: true },
    });
    if (existing) {
      invalid(
        `${existing.name ?? 'A parent'} already has the email ${email}. Untick New parent and choose them from the list.`,
      );
    }
    return {
      name,
      email,
      position,
      contact: normalizePhone(input?.contact, 'Parent phone'),
      address:
        typeof input?.address === 'string'
          ? input.address.trim() || null
          : null,
    };
  }

  async index(branchUuid: string | undefined, decoded: DecodedUser) {
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Branch ID is required',
      });
    }

    let students: any = [];

    if (decoded.position === 'ADMINISTRATIVE') {
      students = await this.prisma.student.findMany({
        where: { branch_uuid: branchUuid },
        include: { parent: true, class: true },
        orderBy: { class: { name: 'asc' } },
      });
    } else if (decoded.position === 'ACADEMIC') {
      students = await this.prisma.student.findMany({
        where: {
          branch_uuid: branchUuid,
          class: { teacher_uuid: decoded.uuid },
        },
        include: { parent: true, class: true },
        orderBy: { class: { name: 'asc' } },
      });
    }

    return {
      status: 200,
      success: true,
      message: 'Students retrieved successfully',
      data: { students },
    };
  }

  /**
   * The parent to link, if any: '' or null means none yet. Must be a parent
   * account in the same school.
   */
  private async parentFor(value: unknown, schoolUuid: string) {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    const parent = await this.prisma.user.findFirst({
      where: { uuid: String(value), school_uuid: schoolUuid, role: 'PARENT' },
      select: { uuid: true },
    });
    if (!parent) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Choose a parent from this school',
      });
    }
    return parent.uuid;
  }

  /** "YYYY-MM-DD" or empty (cleared); undefined leaves it unchanged. */
  private dateOfBirth(value: unknown) {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    const text = String(value);
    const date = new Date(`${text.slice(0, 10)}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}/.test(text) ||
      isNaN(date.getTime()) ||
      date > new Date() ||
      date.getUTCFullYear() < 1900
    ) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Enter a valid date of birth',
      });
    }
    return date;
  }

  private async branchPrefix(branchUuid: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { uuid: branchUuid },
      select: { reg_prefix: true },
    });
    return branch?.reg_prefix ?? null;
  }

  /** What the Add Student form fills in; the number is only taken on save. */
  async nextRegNumber(branchUuid: string | undefined) {
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Branch ID is required',
      });
    }
    const prefix = await this.branchPrefix(branchUuid);
    return {
      status: 200,
      success: true,
      message: 'Next registration number',
      data: {
        prefix,
        reg_number: prefix
          ? await nextRegNumber(this.prisma, branchUuid, prefix)
          : null,
      },
    };
  }

  async show(uuid: string) {
    const student = await this.prisma.student.findUnique({
      where: { uuid },
      include: { parent: true, class: true },
    });

    if (!student) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Student not found',
      });
    }

    return {
      status: 200,
      success: true,
      message: 'Student',
      data: { student },
    };
  }

  async create(
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    const { name, parent_uuid, class_uuid, gender, avatar, face_descriptor } =
      body;
    let reg_number =
      typeof body.reg_number === 'string' ? body.reg_number.trim() : '';

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!name || !class_uuid) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Name and class are required',
      });
    }
    // A student can be added before their parent; link one later. A new
    // parent can also be sent along and is created with the student.
    const newParent = body.new_parent
      ? await this.checkNewParent(body.new_parent, decoded.school_uuid)
      : null;
    let parentUuid = newParent
      ? null
      : ((await this.parentFor(parent_uuid, decoded.school_uuid)) ?? null);
    const dateOfBirth = this.dateOfBirth(body.date_of_birth) ?? null;

    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    // Left blank: number the student from the branch prefix.
    const prefix = reg_number ? null : await this.branchPrefix(branchUuid);
    if (!reg_number && !prefix) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message:
          'Enter a registration number, or set a prefix in Branch Settings to number students automatically',
      });
    }

    if (reg_number) {
      const existingReg = await this.prisma.student.findUnique({
        where: {
          branch_uuid_reg_number: { branch_uuid: branchUuid, reg_number },
        },
      });

      if (existingReg) {
        throw new BadRequestException({
          status: 400,
          success: false,
          message: 'Registration number already taken',
        });
      }
    }

    let createdParentUuid: string | null = null;
    if (newParent) {
      const parent = await this.prisma.user.create({
        data: {
          ...newParent,
          role: 'PARENT',
          school_uuid: decoded.school_uuid,
          // Unknown to anyone: the invite email lets them choose their own.
          password: await this.hashing.createHash(
            randomBytes(12).toString('base64url'),
          ),
          face_descriptor: [],
        },
      });
      await this.prisma.branchAccess.create({
        data: {
          branch_uuid: branchUuid,
          school_uuid: decoded.school_uuid,
          user_uuid: parent.uuid,
          role: 'PARENT',
        },
      });
      createdParentUuid = parentUuid = parent.uuid;
    }

    // Two students added at once can be given the same generated number;
    // the unique index catches it and the next number is tried.
    let result;
    try {
      for (let attempt = 0; ; attempt++) {
        if (prefix) {
          reg_number = await nextRegNumber(this.prisma, branchUuid, prefix);
        }
        try {
          result = await this.prisma.student.create({
            data: {
              uuid: body.uuid || undefined,
              name,
              reg_number,
              parent_uuid: parentUuid,
              date_of_birth: dateOfBirth,
              branch_uuid: branchUuid,
              class_uuid,
              gender,
              avatar,
              face_descriptor: face_descriptor || [],
            },
            include: { class: true },
          });
          break;
        } catch (error: any) {
          if (error?.code !== 'P2002') throw error;
          if (!prefix || attempt >= 4) {
            throw new BadRequestException({
              status: 400,
              success: false,
              message: 'Registration number already taken',
            });
          }
        }
      }
    } catch (error) {
      // Don't leave a parent behind for a student that wasn't saved.
      if (createdParentUuid) {
        await this.prisma.user
          .delete({ where: { uuid: createdParentUuid } })
          .catch(() => undefined);
      }
      throw error;
    }
    if (createdParentUuid) {
      void this.passwords.sendInvite(createdParentUuid).catch(() => undefined);
    }

    await this.notifications.notifyBranchAdmins(
      branchUuid,
      'STUDENT_CREATED',
      'New student added',
      `${result.name} was successfully added as a student to ${result.class?.name || 'a'} class.`,
    );
    await this.notifications.notifyUsers(
      [result.parent_uuid],
      branchUuid,
      'STUDENT_ENROLLED',
      'Student enrolled',
      `${result.name} has been enrolled in ${result.class?.name || 'a class'}.`,
    );
    this.webhooks.emit(
      decoded.school_uuid,
      result.branch_uuid,
      'student.created',
      {
        uuid: result.uuid,
        name: result.name,
        reg_number: result.reg_number,
        status: result.status,
        class: { uuid: result.class_uuid, name: result.class?.name ?? null },
      },
    );

    return {
      status: 201,
      success: true,
      message: 'Student created',
      data: { student: result },
    };
  }

  async update(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    const {
      name,
      reg_number,
      parent_uuid,
      class_uuid,
      gender,
      avatar,
      face_descriptor,
    } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!name || !class_uuid || !reg_number) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Name, class and Registration number are required',
      });
    }
    const parentUuid = await this.parentFor(parent_uuid, decoded.school_uuid);
    const dateOfBirth = this.dateOfBirth(body.date_of_birth);

    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    const existingReg = await this.prisma.student.findUnique({
      where: {
        branch_uuid_reg_number: { branch_uuid: branchUuid, reg_number },
      },
    });

    if (existingReg && existingReg.uuid !== uuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Registration number already taken',
      });
    }

    const status = parseRecordStatus(body.status);
    const previousStudent = await this.prisma.student.findUnique({
      where: { uuid },
    });
    const result = await this.prisma.student.update({
      where: { uuid },
      data: {
        name,
        reg_number,
        parent_uuid: parentUuid,
        date_of_birth: dateOfBirth,
        class_uuid,
        gender,
        avatar,
        status,
        ...(face_descriptor ? { face_descriptor } : {}),
      },
      include: { class: true },
    });

    if (previousStudent && previousStudent.class_uuid !== result.class_uuid) {
      await this.notifications.notifyUsers(
        [result.parent_uuid],
        branchUuid,
        'STUDENT_CLASS_CHANGED',
        'Class changed',
        `${result.name} has been moved to ${result.class.name}.`,
      );
      await this.notifications.notifyUsers(
        [result.class.teacher_uuid, ...result.class.teachers_uuid],
        branchUuid,
        'STUDENT_CLASS_CHANGED',
        'New student in your class',
        `${result.name} has joined ${result.class.name}.`,
        { excludeUuid: decoded.uuid },
      );
    }

    this.webhooks.emit(
      decoded.school_uuid,
      result.branch_uuid,
      'student.updated',
      {
        uuid: result.uuid,
        name: result.name,
        reg_number: result.reg_number,
        status: result.status,
        class: { uuid: result.class_uuid, name: result.class?.name ?? null },
      },
    );

    if (previousStudent?.avatar && previousStudent.avatar !== result.avatar) {
      const oldKey = this.storage.keyFromUrl(previousStudent.avatar);
      if (oldKey) await this.storage.delete(oldKey);
    }

    return {
      status: 200,
      success: true,
      message: 'Student updated',
      data: { student: result },
    };
  }

  async remove(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
  ) {
    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    try {
      const student = await this.prisma.student.findUnique({ where: { uuid } });
      if (!student) {
        throw new NotFoundException({
          status: 404,
          success: false,
          message: 'Student not found',
        });
      }

      await this.prisma.result.deleteMany({ where: { student_uuid: uuid } });
      await this.storage.deleteAvatar(
        decoded.school_uuid,
        student.branch_uuid,
        'student',
        uuid,
      );
      const legacyKey = this.storage.keyFromUrl(student.avatar);
      if (legacyKey) await this.storage.delete(legacyKey);
      await this.prisma.student.delete({ where: { uuid } });
      this.webhooks.emit(
        decoded.school_uuid,
        student.branch_uuid,
        'student.deleted',
        {
          uuid: student.uuid,
        },
      );

      return { status: 200, success: true, message: 'Student deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        status: 500,
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
