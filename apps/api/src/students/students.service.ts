import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { StorageService } from '../storage/storage.service.js';
import { DecodedUser } from '../common/types/auth.js';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly storage: StorageService,
  ) {}

  async index(branchUuid: string | undefined, decoded: DecodedUser) {
    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Branch ID is required' });
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
        where: { branch_uuid: branchUuid, class: { teacher_uuid: decoded.uuid } },
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

  async show(uuid: string) {
    const student = await this.prisma.student.findUnique({
      where: { uuid },
      include: { parent: true, class: true },
    });

    if (!student) {
      throw new NotFoundException({ status: 404, success: false, message: 'Student not found' });
    }

    return { status: 200, success: true, message: 'Student', data: { student } };
  }

  async create(branchUuid: string | undefined, decoded: DecodedUser, body: any) {
    const { name, reg_number, parent_uuid, class_uuid, gender, avatar, face_descriptor } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!name || !parent_uuid || !class_uuid || !reg_number) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Name, Parent, class and Registration number are required',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    const existingReg = await this.prisma.student.findUnique({
      where: { branch_uuid_reg_number: { branch_uuid: branchUuid, reg_number } },
    });

    if (existingReg) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Registration number already taken',
      });
    }

    const result = await this.prisma.student.create({
      data: {
        uuid: body.uuid || undefined,
        name,
        reg_number,
        parent_uuid,
        branch_uuid: branchUuid,
        class_uuid,
        gender,
        avatar,
        face_descriptor: face_descriptor || [],
      },
      include: { class: true },
    });

    await this.notifications.notifyBranchAdmins(
      branchUuid,
      'STUDENT_CREATED',
      'New student added',
      `${result.name} was successfully added as a student to ${result.class?.name || 'a'} class.`,
    );

    return { status: 201, success: true, message: 'Student created', data: { student: result } };
  }

  async update(uuid: string, branchUuid: string | undefined, decoded: DecodedUser, body: any) {
    const { name, reg_number, parent_uuid, class_uuid, gender, avatar, face_descriptor } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!name || !parent_uuid || !class_uuid || !reg_number) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Name, Parent, class and Registration number are required',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    const existingReg = await this.prisma.student.findUnique({
      where: { branch_uuid_reg_number: { branch_uuid: branchUuid, reg_number } },
    });

    if (existingReg && existingReg.uuid !== uuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Registration number already taken',
      });
    }

    const previousStudent = await this.prisma.student.findUnique({ where: { uuid } });
    const result = await this.prisma.student.update({
      where: { uuid },
      data: { name, reg_number, parent_uuid, class_uuid, gender, avatar, ...(face_descriptor ? { face_descriptor } : {}) },
    });

    if (previousStudent?.avatar && previousStudent.avatar !== result.avatar) {
      const oldKey = this.storage.keyFromUrl(previousStudent.avatar);
      if (oldKey) await this.storage.delete(oldKey);
    }

    return { status: 200, success: true, message: 'Student updated', data: { student: result } };
  }

  async remove(uuid: string, branchUuid: string | undefined, decoded: DecodedUser) {
    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    try {
      const student = await this.prisma.student.findUnique({ where: { uuid } });
      if (!student) {
        throw new NotFoundException({ status: 404, success: false, message: 'Student not found' });
      }

      await this.prisma.result.deleteMany({ where: { student_uuid: uuid } });
      await this.storage.deleteAvatar(decoded.school_uuid, student.branch_uuid, 'student', uuid);
      const legacyKey = this.storage.keyFromUrl(student.avatar);
      if (legacyKey) await this.storage.delete(legacyKey);
      await this.prisma.student.delete({ where: { uuid } });

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
