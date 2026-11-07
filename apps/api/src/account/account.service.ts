import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { HashingService } from '../common/hashing.service.js';
import { DecodedUser } from '../common/types/auth.js';

/** The signed-in user's own account, for staff and parents alike. */
@Injectable()
export class AccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
  ) {}

  private accountSelect = {
    uuid: true,
    name: true,
    email: true,
    contact: true,
    alt_contact: true,
    address: true,
    avatar: true,
    role: true,
    position: true,
    walkthrough_seen_at: true,
  };

  async account(decoded: DecodedUser) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: decoded.uuid },
      select: this.accountSelect,
    });
    return { status: 200, success: true, message: 'Account', data: { user } };
  }

  /**
   * Users may update how the school reaches them. Name, email, role and
   * position stay with the administrators who manage accounts.
   */
  async updateAccount(decoded: DecodedUser, body: any) {
    const clean = (value: unknown, max: number) =>
      typeof value === 'string'
        ? value.trim().slice(0, max) || null
        : undefined;
    const user = await this.prisma.user.update({
      where: { uuid: decoded.uuid },
      data: {
        contact: clean(body?.contact, 40),
        alt_contact: clean(body?.alt_contact, 40),
        address: clean(body?.address, 300),
      },
      select: this.accountSelect,
    });
    return {
      status: 200,
      success: true,
      message: 'Contact details saved',
      data: { user },
    };
  }

  async changePassword(decoded: DecodedUser, body: any) {
    const current =
      typeof body?.current_password === 'string' ? body.current_password : '';
    const next =
      typeof body?.new_password === 'string' ? body.new_password : '';
    if (next.length < 8) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'New password must be at least 8 characters',
      });
    }
    const user = await this.prisma.user.findUnique({
      where: { uuid: decoded.uuid },
      select: { password: true },
    });
    if (!user || !(await this.hashing.compareHash(current, user.password))) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Current password is incorrect',
      });
    }
    await this.prisma.user.update({
      where: { uuid: decoded.uuid },
      data: { password: await this.hashing.createHash(next) },
    });
    return { status: 200, success: true, message: 'Password changed' };
  }

  /** Marks the portal walkthrough as watched (or skipped) so it stops opening automatically. */
  async markWalkthroughSeen(decoded: DecodedUser) {
    const user = await this.prisma.user.update({
      where: { uuid: decoded.uuid },
      data: { walkthrough_seen_at: new Date() },
      select: { walkthrough_seen_at: true },
    });
    return {
      status: 200,
      success: true,
      message: 'Walkthrough marked as seen',
      data: user,
    };
  }
}
