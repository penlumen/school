import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DecodedUser } from '../common/types/auth.js';
import { StorageService } from '../storage/storage.service.js';

@Injectable()
export class BranchesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  async index(decoded: DecodedUser) {
    const [branch_access, user] = await Promise.all([
      this.prisma.branchAccess.findMany({
        where: { user_uuid: decoded.uuid, school_uuid: decoded.school_uuid },
        include: { branch: true },
      }),
      this.prisma.user.findUnique({ where: { uuid: decoded.uuid } }),
    ]);

    // Default active branch: the user's last-used branch, if they still have
    // access to it, otherwise fall back to the first branch they can access.
    // This replaces the old forced branch-selection page.
    const hasLastBranch = branch_access.some(
      (a) => a.branch_uuid === user?.last_branch_uuid,
    );
    const active_branch_uuid = hasLastBranch
      ? user!.last_branch_uuid
      : (branch_access[0]?.branch_uuid ?? null);

    return {
      status: 200,
      success: true,
      message: 'Branches Access',
      data: { branch_access, active_branch_uuid },
    };
  }

  async select(uuid: string, decoded: DecodedUser) {
    const access = await this.prisma.branchAccess.findFirst({
      where: { user_uuid: decoded.uuid, branch_uuid: uuid },
    });

    if (!access) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'You do not have access to this branch',
      });
    }

    await this.prisma.user.update({
      where: { uuid: decoded.uuid },
      data: { last_branch_uuid: uuid },
    });

    return { status: 200, success: true, message: 'Active branch updated' };
  }

  async create(decoded: DecodedUser, body: any) {
    const { name, email, contact, address } = body;

    if (decoded.role !== 'ADMIN') {
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
        message: 'Name is required',
      });
    }

    const result = await this.prisma.$transaction(async (tx: any) => {
      const branch = await tx.branch.create({
        data: {
          name,
          email,
          contact,
          address,
          school_uuid: decoded.school_uuid,
        },
      });

      await tx.branchAccess.create({
        data: {
          role: decoded.role,
          user_uuid: decoded.uuid,
          branch_uuid: branch.uuid,
          school_uuid: decoded.school_uuid,
        },
      });

      return branch;
    });

    return {
      status: 201,
      success: true,
      message: 'Branch created successfully',
      data: { branch: result },
    };
  }

  async show(uuid: string, decoded: DecodedUser) {
    if (decoded.role !== 'ADMIN') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    const branch = await this.prisma.branch.findUnique({ where: { uuid } });

    return { status: 200, success: true, message: 'branch', data: { branch } };
  }

  async update(uuid: string, decoded: DecodedUser, body: any) {
    const { name, email, contact, address } = body;

    if (decoded.role !== 'ADMIN') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    const branch = await this.prisma.branch.update({
      where: { uuid },
      data: { name, email, contact, address },
    });

    if (!branch) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Branch not found',
      });
    }

    return {
      status: 200,
      success: true,
      message: 'Branch updated successfully',
      data: { branch },
    };
  }

  async createAccess(
    decoded: DecodedUser,
    branchUuid: string | undefined,
    body: any,
  ) {
    const { user_uuid } = body;

    if (decoded.role !== 'ADMIN') {
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

    if (!user_uuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'User uuid is required',
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { uuid: user_uuid },
    });
    if (!user) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }

    if (!user.school_uuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'User does not have a valid school_uuid',
      });
    }

    await this.prisma.branchAccess.create({
      data: {
        branch_uuid: branchUuid,
        role: user.role,
        user_uuid: user.uuid,
        school_uuid: user.school_uuid,
      },
    });

    return { status: 201, success: true, message: 'Access created' };
  }

  async remove(uuid: string, decoded: DecodedUser) {
    if (decoded.role !== 'ADMIN') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    const branch = await this.prisma.branch.findUnique({
      where: { uuid },
      include: { classes: true },
    });

    if (!branch) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Branch not found',
      });
    }

    await this.prisma.grade.deleteMany({ where: { branch_uuid: uuid } });

    if (branch.classes.length > 0) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Branch has associated classes and cannot be deleted',
      });
    }

    await this.prisma.branchAccess.deleteMany({
      where: { branch_uuid: uuid, user_uuid: uuid },
    });

    const existingMultipleBranches = await this.prisma.branchAccess.findMany({
      where: { user_uuid: uuid, NOT: { branch_uuid: uuid } },
    });

    if (!existingMultipleBranches || existingMultipleBranches.length === 0) {
      await this.prisma.user.delete({ where: { uuid } });
    }

    await this.prisma.branch.delete({
      where: { uuid },
      include: { access: true, classes: true },
    });
    await this.storage.deleteBranchFiles(branch.school_uuid, uuid);

    return {
      status: 200,
      success: true,
      message: 'Branch deleted successfully',
    };
  }
}
