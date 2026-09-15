import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CacheService } from '../cache/cache.service.js';
import { DecodedUser } from '../common/types/auth.js';

@Injectable()
export class GradesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  private cacheKey(branchUuid: string) {
    return `grades:index:${branchUuid}`;
  }

  async index(branchUuid: string | undefined) {
    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    const grades = await this.cache.remember(this.cacheKey(branchUuid), 300, () =>
      this.prisma.grade.findMany({
        where: { branch_uuid: branchUuid },
        orderBy: { score: 'desc' },
      }),
    );

    return { status: 200, success: true, message: 'Grades', data: { grades } };
  }

  async create(branchUuid: string | undefined, decoded: DecodedUser, body: any) {
    const { score, grade, remark, description } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!score || !grade || !remark) {
      throw new BadRequestException({
        status: 422,
        success: false,
        message: 'Score, Grade and Remark are required',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    const result = await this.prisma.grade.create({
      data: { branch_uuid: branchUuid, grade, score, remark, description },
    });
    await this.cache.del(this.cacheKey(branchUuid));

    return { status: 201, success: true, message: 'Grade created', data: { grade: result } };
  }

  async update(uuid: string, branchUuid: string | undefined, decoded: DecodedUser, body: any) {
    const { score, grade, remark, description } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!score || !grade || !remark) {
      throw new BadRequestException({
        status: 422,
        success: false,
        message: 'Score, Grade and Remark are required',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    const existingGrade = await this.prisma.grade.findUnique({ where: { uuid } });
    if (!existingGrade) {
      throw new NotFoundException({ status: 404, success: false, message: 'Grade not found' });
    }

    const result = await this.prisma.grade.update({
      where: { uuid },
      data: { grade, score, remark, description },
    });
    await this.cache.del(this.cacheKey(branchUuid));

    return { status: 200, success: true, message: 'Grade updated', data: { grade: result } };
  }

  async remove(uuid: string, branchUuid: string | undefined, decoded: DecodedUser) {
    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    try {
      const grade = await this.prisma.grade.findUnique({ where: { uuid } });
      if (!grade) {
        throw new NotFoundException({ status: 404, success: false, message: 'Grade not found' });
      }

      await this.prisma.grade.delete({ where: { uuid } });
      await this.cache.del(this.cacheKey(branchUuid));

      return { status: 200, success: true, message: 'Grade deleted' };
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
