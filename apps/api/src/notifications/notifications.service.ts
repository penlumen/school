import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { FirebaseService } from './firebase.service.js';
import { DecodedUser } from '../common/types/auth.js';

interface NotifyOptions {
  /** User to leave out of the recipients - typically whoever performed the action. */
  excludeUuid?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
  ) {}

  /**
   * Creates an in-app notification for each user, and pushes the same message
   * via FCM to any device tokens they've registered. Both channels always fire
   * together - this is the single place any other service should call to
   * notify someone of something happening.
   *
   * Never throws: a notification failing must not fail the action that
   * triggered it, so errors are logged and swallowed.
   */
  async notifyUsers(
    userUuids: (string | null | undefined)[],
    branchUuid: string,
    type: string,
    title: string,
    message: string,
    options: NotifyOptions = {},
  ) {
    const recipients = [
      ...new Set(userUuids.filter((u): u is string => !!u)),
    ].filter((u) => u !== options.excludeUuid);

    if (recipients.length === 0) return;

    try {
      await this.prisma.notification.createMany({
        data: recipients.map((user_uuid) => ({
          user_uuid,
          branch_uuid: branchUuid,
          type,
          title,
          message,
        })),
      });

      const tokens = await this.prisma.deviceToken.findMany({
        where: { user_uuid: { in: recipients } },
        select: { token: true },
      });

      if (tokens.length > 0) {
        const stale = await this.firebase.sendToTokens(
          tokens.map((t) => t.token),
          title,
          message,
        );
        if (stale.length > 0) {
          await this.prisma.deviceToken.deleteMany({
            where: { token: { in: stale } },
          });
        }
      }
    } catch (error: any) {
      this.logger.warn(`Failed to send ${type} notification: ${error.message}`);
    }
  }

  /** Notifies every user holding one of `roles` on a branch. */
  async notifyBranchRoles(
    branchUuid: string,
    roles: Role[],
    type: string,
    title: string,
    message: string,
    options: NotifyOptions = {},
  ) {
    try {
      const access = await this.prisma.branchAccess.findMany({
        where: { branch_uuid: branchUuid, role: { in: roles } },
        select: { user_uuid: true },
      });
      await this.notifyUsers(
        access.map((a) => a.user_uuid),
        branchUuid,
        type,
        title,
        message,
        options,
      );
    } catch (error: any) {
      this.logger.warn(`Failed to send ${type} notification: ${error.message}`);
    }
  }

  /** Notifies every administrator (ADMIN/ROOT) on a branch. */
  async notifyBranchAdmins(
    branchUuid: string,
    type: string,
    title: string,
    message: string,
    options: NotifyOptions = {},
  ) {
    return this.notifyBranchRoles(
      branchUuid,
      ['ADMIN', 'ROOT'],
      type,
      title,
      message,
      options,
    );
  }

  /** Tells a user they've been given access to another branch. */
  async notifyBranchAccessGranted(userUuid: string, branchUuid: string) {
    const branch = await this.prisma.branch
      .findUnique({ where: { uuid: branchUuid }, select: { name: true } })
      .catch(() => null);
    await this.notifyUsers(
      [userUuid],
      branchUuid,
      'BRANCH_ACCESS_GRANTED',
      'Branch access granted',
      `You have been added to ${branch?.name ?? 'a new branch'}. Switch branches to view it.`,
    );
  }

  async index(decoded: DecodedUser) {
    const [notifications, unread_count] = await Promise.all([
      this.prisma.notification.findMany({
        where: { user_uuid: decoded.uuid },
        orderBy: { created_at: 'desc' },
        take: 50,
      }),
      this.prisma.notification.count({
        where: { user_uuid: decoded.uuid, is_read: false },
      }),
    ]);

    return {
      status: 200,
      success: true,
      message: 'Notifications',
      data: { notifications, unread_count },
    };
  }

  async markRead(uuid: string, decoded: DecodedUser) {
    await this.prisma.notification.updateMany({
      where: { uuid, user_uuid: decoded.uuid },
      data: { is_read: true },
    });

    return {
      status: 200,
      success: true,
      message: 'Notification marked as read',
    };
  }

  async markAllRead(decoded: DecodedUser) {
    await this.prisma.notification.updateMany({
      where: { user_uuid: decoded.uuid, is_read: false },
      data: { is_read: true },
    });

    return {
      status: 200,
      success: true,
      message: 'All notifications marked as read',
    };
  }

  async registerToken(decoded: DecodedUser, token: string, platform?: string) {
    if (!token) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Device token is required',
      });
    }

    await this.prisma.deviceToken.upsert({
      where: { token },
      create: { user_uuid: decoded.uuid, token, platform },
      update: { user_uuid: decoded.uuid, platform },
    });

    return {
      status: 201,
      success: true,
      message: 'Device registered for push notifications',
    };
  }
}
