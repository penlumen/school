import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { HashingService } from '../common/hashing.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { DecodedUser } from '../common/types/auth.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly notifications: NotificationsService,
  ) {}

  async index(
    branchUuid: string | undefined,
    role: 'STAFF' | 'PARENT' | undefined,
    decoded: DecodedUser,
  ) {
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    if (
      decoded.position !== 'ADMINISTRATIVE' &&
      decoded.position !== 'ACADEMIC'
    ) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!role) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Invalid role',
      });
    }

    let user;
    if (role === 'STAFF') {
      user = await this.prisma.branchAccess.findMany({
        where: {
          branch_uuid: branchUuid,
          OR: [{ role: 'ADMIN' }, { role: 'STAFF' }],
        },
        include: { user: true },
        orderBy: [
          { user: { position: 'asc' } },
          { user: { created_at: 'asc' } },
        ],
      });
    } else {
      user = await this.prisma.branchAccess.findMany({
        where: { role, branch_uuid: branchUuid },
        include: { user: true },
        orderBy: [
          { user: { position: 'asc' } },
          { user: { created_at: 'asc' } },
        ],
      });
    }

    return { status: 200, success: true, message: 'Success', data: { user } };
  }

  async show(uuid: string) {
    if (!uuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'UUID is required',
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { uuid },
      include: { heading: true, students: true },
    });

    if (!user) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }

    return {
      status: 200,
      success: true,
      message: 'User retrieved',
      data: { user },
    };
  }

  async create(
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    const {
      name,
      role,
      email,
      position,
      address,
      contact,
      alt_contact,
      avatar,
      face_descriptor,
    } = body;
    // The Add Staff/Add Parent forms don't collect a password (matches the
    // design) — generate one server-side. There's no invite/reset-password
    // flow yet, so this account's password isn't known to anyone until that
    // exists; it's still safely hashed and stored either way.
    const password = body.password || randomBytes(12).toString('base64url');

    const currentUser = await this.prisma.user.findUnique({
      where: { uuid: decoded.uuid },
    });
    if (!currentUser) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!email || !role || !name || !position) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Email, role, name and position are required',
      });
    }

    if (role.toUpperCase() === 'ROOT' || role.toUpperCase() === 'ADMIN') {
      throw new ForbiddenException({
        status: 403,
        success: false,
        message: 'Cannot create Admin or Root account',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        email,
        role: role.toUpperCase() as Role,
        school_uuid: currentUser.school_uuid,
      },
    });

    const existingInCurrentBranch = await this.prisma.branchAccess.findFirst({
      where: { branch_uuid: branchUuid, user_uuid: existingUser?.uuid },
    });

    if (existingUser && !existingInCurrentBranch) {
      return {
        status: 200,
        success: false,
        message:
          'This staff member already exists in the school records. Would you like to add them to this branch?',
        data: { user_uuid: existingUser.uuid },
      };
    } else if (existingUser) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message:
          'This staff member already exists in the school records and current branch.',
      });
    }

    const formatRole = role.toUpperCase() as Role;
    const hashPassword = await this.hashing.createHash(password);

    const newUser = await this.prisma.$transaction(async (tx: any) => {
      const created = await tx.user.create({
        data: {
          name,
          email,
          address,
          contact,
          position,
          alt_contact,
          avatar,
          face_descriptor: face_descriptor || [],
          role: formatRole,
          password: hashPassword,
          school_uuid: currentUser.school_uuid,
        },
      });

      if (created) {
        await tx.branchAccess.create({
          data: {
            branch_uuid: branchUuid,
            role: created.role,
            user_uuid: created.uuid,
            school_uuid: currentUser.school_uuid,
          },
        });
      }

      return created;
    });

    const roleLabel = role.toLowerCase();
    await this.notifications.notifyBranchAdmins(
      branchUuid,
      `${formatRole}_CREATED`,
      'New team member added',
      `${newUser.name} was successfully added as a ${roleLabel}.`,
    );

    return {
      status: 201,
      success: true,
      message: 'User created successfully',
      data: { newUser },
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
      email,
      password,
      position,
      address,
      contact,
      alt_contact,
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

    if (!uuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'User UUID is required',
      });
    }

    if (!email || !name || !position) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Email, role, name and position are required',
      });
    }

    const user = await this.prisma.user.findUnique({ where: { uuid } });
    if (!user) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }

    const existingUser = await this.prisma.user.findFirst({ where: { uuid } });
    if (!existingUser) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'This user does not exist in the school records.',
      });
    }

    const hashPassword = password
      ? await this.hashing.createHash(password)
      : user.password;

    const updatedUser = await this.prisma.user.update({
      where: { uuid },
      data: {
        name,
        email,
        address,
        contact,
        position,
        alt_contact,
        avatar,
        password: hashPassword,
        ...(face_descriptor ? { face_descriptor } : {}),
      },
    });

    return {
      status: 200,
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser },
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

    if (!uuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'User UUID is required',
      });
    }

    const user = await this.prisma.user.findUnique({
      where: { uuid },
      include: { access: true, heading: true, students: true },
    });

    if (!user) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }
    if (user.heading.length > 0) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'User has associated classes and cannot be deleted',
      });
    }
    if (user.students.length > 0) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'User has associated students and cannot be deleted',
      });
    }

    if (
      user.role.toUpperCase() === 'ROOT' ||
      user.role.toUpperCase() === 'ADMIN'
    ) {
      throw new ForbiddenException({
        status: 403,
        success: false,
        message: 'Cannot delete Admin or Root account',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }

    await this.prisma.branchAccess.deleteMany({
      where: { branch_uuid: branchUuid, user_uuid: uuid },
    });

    const existingMultipleBranches = await this.prisma.branchAccess.findMany({
      where: { user_uuid: uuid, NOT: { branch_uuid: branchUuid } },
    });

    if (!existingMultipleBranches || existingMultipleBranches.length === 0) {
      await this.prisma.user.delete({ where: { uuid } });
    }

    return { status: 200, success: true, message: 'User deleted successfully' };
  }
}
