import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CacheService } from '../cache/cache.service.js';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async cards(branchUuid: string | undefined) {
    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized branch' });
    }

    const data = await this.cache.remember(`dashboard:cards:${branchUuid}`, 60, async () => {
      const [total_students, total_parents, total_staffs, total_classes] = await Promise.all([
        this.prisma.student.count({ where: { branch_uuid: branchUuid } }),
        this.prisma.branchAccess.count({ where: { branch_uuid: branchUuid, role: 'PARENT' } }),
        this.prisma.branchAccess.count({
          where: { branch_uuid: branchUuid, OR: [{ role: 'ROOT' }, { role: 'ADMIN' }, { role: 'STAFF' }] },
        }),
        this.prisma.class.count({ where: { branch_uuid: branchUuid } }),
      ]);

      return {
        total_parents,
        total_staffs,
        total_classes,
        total_students: total_students || 0,
      };
    });

    return { status: 200, success: true, message: 'Dashboard', data };
  }
}
