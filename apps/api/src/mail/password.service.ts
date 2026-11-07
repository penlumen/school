import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { HashingService } from '../common/hashing.service.js';
import { DecodedUser } from '../common/types/auth.js';
import { MailService, webUrl } from './mail.service.js';

type Purpose = 'invite' | 'reset';

const LIFETIME_MS: Record<Purpose, number> = {
  invite: 7 * 24 * 60 * 60 * 1000,
  reset: 60 * 60 * 1000,
};

const hash = (token: string) =>
  createHash('sha256').update(token).digest('hex');

/**
 * Set-password links: an invite when staff add someone (their password is
 * random and unknown), and "forgot password" from the login page.
 */
@Injectable()
export class PasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
    private readonly mail: MailService,
  ) {}

  private async issue(userUuid: string, purpose: Purpose) {
    const token = randomBytes(32).toString('base64url');
    // Only the newest link of each kind works.
    await this.prisma.$transaction([
      this.prisma.passwordToken.deleteMany({
        where: { user_uuid: userUuid, purpose, used_at: null },
      }),
      this.prisma.passwordToken.create({
        data: {
          user_uuid: userUuid,
          purpose,
          token_hash: hash(token),
          expires_at: new Date(Date.now() + LIFETIME_MS[purpose]),
        },
      }),
    ]);
    return `${webUrl()}/set-password?token=${token}`;
  }

  /** Emails a new account its set-password link. Never throws. */
  async sendInvite(userUuid: string) {
    const user = await this.prisma.user.findUnique({
      where: { uuid: userUuid },
      select: {
        uuid: true,
        name: true,
        email: true,
        role: true,
        school: { select: { uuid: true, name: true } },
      },
    });
    if (!user?.email || !user.school)
      return { sent: false, error: 'No email address' };
    const link = await this.issue(user.uuid, 'invite');
    const portal = user.role === 'PARENT' ? 'parent portal' : 'staff portal';
    return this.mail.send(user.school.uuid, user.email, 'account', {
      subject: `Your ${user.school.name} account`,
      greeting: `Hi ${(user.name || 'there').split(' ')[0]},`,
      paragraphs: [
        `An account has been created for you on the ${user.school.name} ${portal}.`,
        `Sign in with ${user.email} once you have set your password.`,
      ],
      action: { label: 'Set your password', url: link },
      footnote:
        'This link works once and expires in 7 days. Ask the school to resend it if it runs out.',
    });
  }

  /** Staff resend an invite, e.g. when it expired or went to spam. */
  async resendInvite(userUuid: string, decoded: DecodedUser) {
    const allowed =
      ['ROOT', 'ADMIN'].includes(decoded.role) ||
      decoded.position === 'ADMINISTRATIVE';
    if (!allowed) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }
    const user = await this.prisma.user.findFirst({
      where: { uuid: userUuid, school_uuid: decoded.school_uuid },
      select: { uuid: true, email: true },
    });
    if (!user) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }
    const result = await this.sendInvite(user.uuid);
    if (!result.sent) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: `Couldn't send the invite: ${result.error}`,
      });
    }
    return {
      status: 200,
      success: true,
      message: `Invite sent to ${user.email}`,
    };
  }

  /**
   * Always answers the same way, so the form can't be used to find out which
   * emails have accounts.
   */
  async forgot(schoolToken: string | undefined, body: any) {
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const role = String(body?.role || '').toUpperCase();
    const reply = {
      status: 200,
      success: true,
      message:
        'If that email has an account, we have sent a link to reset the password.',
    };
    if (!schoolToken || !email) return reply;

    const school = await this.prisma.school.findUnique({
      where: { token: schoolToken },
      select: { uuid: true, name: true },
    });
    if (!school) return reply;

    const roles: Role[] =
      role === 'PARENT' ? ['PARENT'] : ['ROOT', 'ADMIN', 'STAFF'];
    const user = await this.prisma.user.findFirst({
      where: {
        school_uuid: school.uuid,
        email: { equals: email, mode: 'insensitive' },
        role: { in: roles },
      },
      select: { uuid: true, name: true, email: true },
    });
    if (!user) return reply;

    // One email every two minutes at most, so the form can't flood an inbox.
    const recent = await this.prisma.passwordToken.findFirst({
      where: {
        user_uuid: user.uuid,
        purpose: 'reset',
        created_at: { gt: new Date(Date.now() - 2 * 60 * 1000) },
      },
    });
    if (recent) return reply;

    const link = await this.issue(user.uuid, 'reset');
    await this.mail.send(school.uuid, user.email, 'account', {
      subject: 'Reset your password',
      greeting: `Hi ${(user.name || 'there').split(' ')[0]},`,
      paragraphs: [
        `Someone asked to reset the password for your ${school.name} account. If it was you, choose a new password below.`,
        "If you didn't ask for this, you can ignore this email and your password stays the same.",
      ],
      action: { label: 'Choose a new password', url: link },
      footnote: 'This link works once and expires in 1 hour.',
    });
    return reply;
  }

  private async findToken(token: unknown) {
    if (typeof token !== 'string' || token.length < 20) return null;
    const record = await this.prisma.passwordToken.findUnique({
      where: { token_hash: hash(token) },
      include: {
        user: { select: { uuid: true, name: true, email: true, role: true } },
      },
    });
    if (!record || record.used_at || record.expires_at < new Date())
      return null;
    return record;
  }

  async check(token: string) {
    const record = await this.findToken(token);
    if (!record) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message:
          'This link has expired or was already used. Ask for a new one.',
      });
    }
    return {
      status: 200,
      success: true,
      message: 'Valid link',
      data: {
        purpose: record.purpose,
        name: record.user.name,
        email: record.user.email,
        role: record.user.role === 'PARENT' ? 'parent' : 'staff',
      },
    };
  }

  async set(body: any) {
    const password = typeof body?.password === 'string' ? body.password : '';
    if (password.length < 8) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'Use at least 8 characters',
      });
    }
    const record = await this.findToken(body?.token);
    if (!record) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message:
          'This link has expired or was already used. Ask for a new one.',
      });
    }
    // Claim the token first so the same link can't set the password twice.
    const claimed = await this.prisma.passwordToken.updateMany({
      where: { uuid: record.uuid, used_at: null },
      data: { used_at: new Date() },
    });
    if (!claimed.count) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'This link was already used. Ask for a new one.',
      });
    }
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { uuid: record.user_uuid },
        data: { password: await this.hashing.createHash(password) },
      }),
      this.prisma.passwordToken.deleteMany({
        where: { user_uuid: record.user_uuid, used_at: null },
      }),
    ]);
    return {
      status: 200,
      success: true,
      message: 'Password saved. You can sign in now.',
      data: {
        email: record.user.email,
        role: record.user.role === 'PARENT' ? 'parent' : 'staff',
      },
    };
  }
}
