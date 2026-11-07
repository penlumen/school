import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DATA_SCOPE, OidcService, oauthError } from './oidc.service.js';

const MAX_PAGE = 200;

/**
 * Read-only school data for connected apps, authorised with a client
 * credentials token. Only branches where the app is switched on are visible,
 * and only what an app needs: no parents, contacts, fees or passwords.
 */
@Injectable()
export class DataApiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly oidc: OidcService,
  ) {}

  private async context(authorization: string | undefined) {
    const token = await this.oidc.resolveToken(authorization);
    if (!token.scope.split(' ').includes(DATA_SCOPE)) {
      oauthError(
        'insufficient_scope',
        `This token needs the ${DATA_SCOPE} scope`,
        403,
      );
    }
    const branches = await this.prisma.branch.findMany({
      where: {
        school_uuid: token.app.school_uuid,
        uuid: { notIn: token.app.disabled_branch_uuids },
      },
      select: { uuid: true, name: true },
      orderBy: { created_at: 'asc' },
    });
    return {
      app: token.app,
      branches,
      branchUuids: branches.map((b) => b.uuid),
    };
  }

  /** Narrows to one branch when asked, never outside the app's branches. */
  private branchFilter(allowed: string[], requested: unknown) {
    if (typeof requested === 'string' && requested) {
      return allowed.includes(requested) ? [requested] : [];
    }
    return allowed;
  }

  private paging(query: Record<string, any>) {
    const page = Math.max(1, Number(query.page) || 1);
    const perPage = Math.min(
      MAX_PAGE,
      Math.max(1, Number(query.per_page) || 50),
    );
    return { page, perPage, skip: (page - 1) * perPage };
  }

  private since(query: Record<string, any>) {
    const date = query.updated_since
      ? new Date(String(query.updated_since))
      : null;
    return date && !isNaN(date.getTime()) ? { updated_at: { gte: date } } : {};
  }

  async school(authorization: string | undefined) {
    const { app, branches } = await this.context(authorization);
    const school = await this.prisma.school.findUnique({
      where: { uuid: app.school_uuid },
      select: { uuid: true, name: true, slug: true, avatar: true },
    });
    return { data: { ...school, app: app.key, branches } };
  }

  async students(
    authorization: string | undefined,
    query: Record<string, any>,
  ) {
    const { branchUuids } = await this.context(authorization);
    const { page, perPage, skip } = this.paging(query);
    const where = {
      branch_uuid: { in: this.branchFilter(branchUuids, query.branch_uuid) },
      ...(typeof query.class_uuid === 'string' && {
        class_uuid: query.class_uuid,
      }),
      ...(['active', 'inactive'].includes(query.status) && {
        status: query.status,
      }),
      ...this.since(query),
    };
    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        orderBy: { created_at: 'asc' },
        skip,
        take: perPage,
        select: {
          uuid: true,
          name: true,
          reg_number: true,
          gender: true,
          avatar: true,
          status: true,
          branch_uuid: true,
          class: { select: { uuid: true, name: true } },
          updated_at: true,
        },
      }),
      this.prisma.student.count({ where }),
    ]);
    return { data, page, per_page: perPage, total };
  }

  async classes(authorization: string | undefined, query: Record<string, any>) {
    const { branchUuids } = await this.context(authorization);
    const { page, perPage, skip } = this.paging(query);
    const where = {
      branch_uuid: { in: this.branchFilter(branchUuids, query.branch_uuid) },
      ...this.since(query),
    };
    const [data, total] = await Promise.all([
      this.prisma.class.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: perPage,
        select: {
          uuid: true,
          name: true,
          status: true,
          branch_uuid: true,
          teacher_uuid: true,
          teachers_uuid: true,
          updated_at: true,
          _count: { select: { students: true } },
        },
      }),
      this.prisma.class.count({ where }),
    ]);
    return { data, page, per_page: perPage, total };
  }

  async staff(authorization: string | undefined, query: Record<string, any>) {
    const { app, branchUuids } = await this.context(authorization);
    const { page, perPage, skip } = this.paging(query);
    const where = {
      school_uuid: app.school_uuid,
      role: {
        in: ['ROOT', 'ADMIN', 'STAFF'] as ('ROOT' | 'ADMIN' | 'STAFF')[],
      },
      access: {
        some: {
          branch_uuid: {
            in: this.branchFilter(branchUuids, query.branch_uuid),
          },
        },
      },
    };
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: perPage,
        select: {
          uuid: true,
          name: true,
          email: true,
          avatar: true,
          role: true,
          position: true,
          access: { select: { branch_uuid: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    const data = users.map(({ access, role, ...user }) => ({
      ...user,
      role: role === 'STAFF' ? 'staff' : 'admin',
      branch_uuids: [...new Set(access.map((a) => a.branch_uuid))].filter((b) =>
        branchUuids.includes(b),
      ),
    }));
    return { data, page, per_page: perPage, total };
  }
}
