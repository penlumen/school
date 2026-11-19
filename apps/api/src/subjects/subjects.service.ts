import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
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
    const subjects = await this.cache.remember(
      this.cacheKey(classUuid),
      300,
      () =>
        this.prisma.subject.findMany({
          where: { class_uuid: classUuid },
          orderBy: [{ position: 'asc' }, { created_at: 'asc' }],
        }),
    );
    return {
      status: 200,
      success: true,
      message: 'Subjects retrieved',
      data: { subjects },
    };
  }

  /** Saves the order staff dragged the class's subjects into. */
  async reorder(decoded: DecodedUser, classUuid: string, body: any) {
    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }
    const order: unknown[] = Array.isArray(body?.order) ? body.order : [];
    const subjects = await this.prisma.subject.findMany({
      where: {
        class_uuid: classUuid,
        class: { branch: { school_uuid: decoded.school_uuid } },
      },
      select: { uuid: true },
    });
    const known = new Set(subjects.map((s) => s.uuid));
    if (
      order.length !== known.size ||
      !order.every((uuid) => typeof uuid === 'string' && known.has(uuid))
    ) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Send every subject of the class, in the new order',
      });
    }
    await this.prisma.$transaction(
      (order as string[]).map((uuid, position) =>
        this.prisma.subject.update({ where: { uuid }, data: { position } }),
      ),
    );
    await this.cache.del(this.cacheKey(classUuid));
    return this.index(classUuid);
  }

  async show(subjectUuid: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { uuid: subjectUuid },
    });
    return {
      status: 200,
      success: true,
      message: 'Subject deleted',
      data: { subject },
    };
  }

  async create(decoded: DecodedUser, classUuid: string, body: any) {
    const { name, description } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!name) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Name are required',
      });
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

    // New subjects go to the end of the class's order.
    const last = await this.prisma.subject.aggregate({
      where: { class_uuid: classUuid },
      _max: { position: true },
    });
    const subject = await this.prisma.subject.create({
      data: {
        name,
        description,
        class_uuid: classUuid,
        position: (last._max.position ?? -1) + 1,
      },
    });
    await this.cache.del(this.cacheKey(classUuid));

    return {
      status: 201,
      success: true,
      message: 'Subject created',
      data: { subject },
    };
  }

  async update(decoded: DecodedUser, subjectUuid: string, body: any) {
    const { name, class_uuid, description } = body;

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

    return {
      status: 200,
      success: true,
      message: 'Subject updated',
      data: { subject },
    };
  }

  async remove(decoded: DecodedUser, subjectUuid: string) {
    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    const subject = await this.prisma.subject.delete({
      where: { uuid: subjectUuid },
    });
    await this.cache.del(this.cacheKey(subject.class_uuid));

    return { status: 200, success: true, message: 'Subject deleted' };
  }
}
