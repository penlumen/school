import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CacheService } from '../cache/cache.service.js';
import { DecodedUser } from '../common/types/auth.js';

@Injectable()
export class SubjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  private cacheKey(classUuid: string) {
    return `subjects:index:${classUuid}`;
  }

  async index(classUuid: string) {
    const subjects = await this.cache.remember(this.cacheKey(classUuid), 300, () =>
      this.prisma.subject.findMany({ where: { class_uuid: classUuid } }),
    );
    return { status: 200, success: true, message: 'Subjects retrieved', data: { subjects } };
  }

  async show(subjectUuid: string) {
    const subject = await this.prisma.subject.findUnique({ where: { uuid: subjectUuid } });
    return { status: 200, success: true, message: 'Subject deleted', data: { subject } };
  }

  async create(decoded: DecodedUser, classUuid: string, body: any) {
    const { name, description } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!name) {
      throw new UnprocessableEntityException({ status: 422, success: false, message: 'Name are required' });
    }

    const existingReg = await this.prisma.subject.findUnique({
      where: { class_uuid_name: { name, class_uuid: classUuid } },
    });

    if (existingReg) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Subject name already taken for this class',
      });
    }

    const subject = await this.prisma.subject.create({ data: { name, description, class_uuid: classUuid } });
    await this.cache.del(this.cacheKey(classUuid));

    return { status: 201, success: true, message: 'Subject created', data: { subject } };
  }

  async update(decoded: DecodedUser, subjectUuid: string, body: any) {
    const { name, class_uuid, description } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!name || !class_uuid) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Name and class are required',
      });
    }

    const existingSubject = await this.prisma.subject.findUnique({
      where: { class_uuid_name: { name, class_uuid } },
    });

    if (existingSubject && existingSubject.uuid !== subjectUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Subject name already taken for this class',
      });
    }

    const subject = await this.prisma.subject.update({
      where: { uuid: subjectUuid },
      data: { name, class_uuid, description },
    });
    await this.cache.del(this.cacheKey(class_uuid));

    return { status: 200, success: true, message: 'Subject updated', data: { subject } };
  }

  async remove(decoded: DecodedUser, subjectUuid: string) {
    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    const subject = await this.prisma.subject.delete({ where: { uuid: subjectUuid } });
    await this.cache.del(this.cacheKey(subject.class_uuid));

    return { status: 200, success: true, message: 'Subject deleted' };
  }
}
