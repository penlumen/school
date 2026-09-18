import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { FirebaseService } from './firebase.service.js';
import { DecodedUser } from '../common/types/auth.js';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
  ) {}

  /**
   * Creates an in-app notification for every administrator on a branch, and
   * pushes the same message via FCM to any device tokens they've registered.
   * Both channels always fire together - this is the single place any other
   * service should call to notify admins of something happening.
   */
  async notifyBranchAdmins(branchUuid: string, type: string, title: string, message: string) {
    const admins = await this.prisma.branchAccess.findMany({
      where: { branch_uuid: branchUuid, OR: [{ role: 'ADMIN' }, { role: 'ROOT' }] },
      select: { user_uuid: true },
    });

    if (admins.length === 0) return;

    await this.prisma.notification.createMany({
      data: admins.map((a) => ({
        user_uuid: a.user_uuid,
        branch_uuid: branchUuid,
        type,
        title,
        message,
      })),
    });

    const tokens = await this.prisma.deviceToken.findMany({
      where: { user_uuid: { in: admins.map((a) => a.user_uuid) } },
      select: { token: true },
    });

    if (tokens.length > 0) {
      const stale = await this.firebase.sendToTokens(tokens.map((t) => t.token), title, message);
      if (stale.length > 0) {
        await this.prisma.deviceToken.deleteMany({ where: { token: { in: stale } } });
      }
    }
  }

  async index(decoded: DecodedUser) {
    const [notifications, unread_count] = await Promise.all([
      this.prisma.notification.findMany({
        where: { user_uuid: decoded.uuid },
        orderBy: { created_at: 'desc' },
        take: 50,
      }),
      this.prisma.notification.count({ where: { user_uuid: decoded.uuid, is_read: false } }),
    ]);

    return { status: 200, success: true, message: 'Notifications', data: { notifications, unread_count } };
  }

  async markRead(uuid: string, decoded: DecodedUser) {
    await this.prisma.notification.updateMany({
      where: { uuid, user_uuid: decoded.uuid },
      data: { is_read: true },
    });

    return { status: 200, success: true, message: 'Notification marked as read' };
  }

  async markAllRead(decoded: DecodedUser) {
    await this.prisma.notification.updateMany({
      where: { user_uuid: decoded.uuid, is_read: false },
      data: { is_read: true },
    });

    return { status: 200, success: true, message: 'All notifications marked as read' };
  }

  async registerToken(decoded: DecodedUser, token: string, platform?: string) {
    if (!token) {
      throw new BadRequestException({ status: 400, success: false, message: 'Device token is required' });
    }

    await this.prisma.deviceToken.upsert({
      where: { token },
      create: { user_uuid: decoded.uuid, token, platform },
      update: { user_uuid: decoded.uuid, platform },
    });

    return { status: 201, success: true, message: 'Device registered for push notifications' };
  }
}
