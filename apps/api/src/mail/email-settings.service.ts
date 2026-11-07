import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { DecodedUser } from '../common/types/auth.js';
import { decryptSecret, encryptSecret, secretHint } from '../common/secrets.js';
import { EMAIL_CATEGORIES, emailTypes } from './email-categories.js';
import {
  MailService,
  type SmtpSecurity,
  type StoredSmtp,
} from './mail.service.js';

const SECURITY: SmtpSecurity[] = ['ssl', 'starttls', 'none'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** School Settings › Email: the school's SMTP server and which emails go out. */
@Injectable()
export class EmailSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  private assertAdmin(decoded: DecodedUser) {
    if (!['ROOT', 'ADMIN'].includes(decoded.role)) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Only school administrators can change email settings',
      });
    }
  }

  private invalid(message: string): never {
    throw new UnprocessableEntityException({
      status: 422,
      success: false,
      message,
    });
  }

  private text(value: unknown, max: number) {
    return typeof value === 'string'
      ? value.trim().slice(0, max) || null
      : null;
  }

  private async school(uuid: string) {
    return this.prisma.school.findUniqueOrThrow({
      where: { uuid },
      select: {
        email: true,
        email_enabled: true,
        smtp: true,
        email_types: true,
      },
    });
  }

  private view(school: Awaited<ReturnType<EmailSettingsService['school']>>) {
    const smtp = school.smtp as StoredSmtp | null;
    const password = decryptSecret(smtp?.password);
    const platform = MailService.platformConfigured();
    return {
      email_enabled: school.email_enabled,
      sender: smtp?.host ? 'school' : platform ? 'platform' : 'none',
      platform_available: platform,
      school_email: school.email,
      smtp: smtp?.host
        ? {
            host: smtp.host,
            port: smtp.port,
            security: smtp.security,
            username: smtp.username,
            has_password: !!password,
            password_hint: secretHint(password),
            password_unreadable: !!smtp.password && !password,
            from_name: smtp.from_name,
            from_email: smtp.from_email,
            reply_to: smtp.reply_to,
          }
        : null,
      types: emailTypes(school.email_types),
      categories: EMAIL_CATEGORIES,
    };
  }

  async settings(decoded: DecodedUser) {
    this.assertAdmin(decoded);
    return {
      status: 200,
      success: true,
      message: 'Email settings',
      data: { settings: this.view(await this.school(decoded.school_uuid)) },
    };
  }

  async save(decoded: DecodedUser, body: any) {
    this.assertAdmin(decoded);
    const current = await this.school(decoded.school_uuid);
    const data: Prisma.SchoolUpdateInput = {};

    if ('email_enabled' in body)
      data.email_enabled = body.email_enabled === true;

    if ('types' in body && body.types && typeof body.types === 'object') {
      const types: Record<string, boolean> = {};
      for (const category of EMAIL_CATEGORIES) {
        if ('locked' in category) continue;
        if (category.key in body.types)
          types[category.key] = body.types[category.key] !== false;
        else
          types[category.key] = emailTypes(current.email_types)[category.key];
      }
      data.email_types = types;
    }

    if ('smtp' in body) {
      if (!body.smtp) {
        data.smtp = Prisma.DbNull;
      } else {
        const input = body.smtp;
        const previous = current.smtp as StoredSmtp | null;
        const host = this.text(input.host, 200);
        const port = Number(input.port);
        const security = input.security as SmtpSecurity;
        const fromEmail = this.text(input.from_email, 200);
        const replyTo = this.text(input.reply_to, 200);
        if (!host || !/^[a-z0-9.-]+$/i.test(host))
          this.invalid('Enter the SMTP server, like smtp.gmail.com');
        if (!Number.isInteger(port) || port < 1 || port > 65535)
          this.invalid('Enter a port between 1 and 65535');
        if (!SECURITY.includes(security))
          this.invalid('Choose how to secure the connection');
        if (!fromEmail || !EMAIL.test(fromEmail))
          this.invalid('Enter the address emails are sent from');
        if (replyTo && !EMAIL.test(replyTo))
          this.invalid('Enter a valid reply-to address');

        // Undefined keeps the saved password, '' or null removes it.
        let password = previous?.password ?? null;
        if ('password' in input) {
          const value =
            typeof input.password === 'string' ? input.password : '';
          password = value ? encryptSecret(value) : null;
        }

        const smtp: StoredSmtp = {
          host,
          port,
          security,
          username: this.text(input.username, 200),
          password,
          from_name: this.text(input.from_name, 100),
          from_email: fromEmail,
          reply_to: replyTo,
        };
        data.smtp = smtp as unknown as Prisma.InputJsonValue;
      }
    }

    const school = await this.prisma.school.update({
      where: { uuid: decoded.school_uuid },
      data,
      select: {
        email: true,
        email_enabled: true,
        smtp: true,
        email_types: true,
      },
    });
    return {
      status: 200,
      success: true,
      message: 'Email settings saved',
      data: { settings: this.view(school) },
    };
  }

  /** Sends a test email with the saved settings and reports the SMTP error, if any. */
  async test(decoded: DecodedUser, body: any) {
    this.assertAdmin(decoded);
    const to = this.text(body?.to, 200) ?? decoded.email;
    if (!to || !EMAIL.test(to))
      this.invalid('Enter the address to send the test to');
    const result = await this.mail.send(
      decoded.school_uuid,
      to,
      'account',
      {
        subject: 'Test email',
        paragraphs: [
          'This is a test from School Settings › Email. If you can read it, your school can send email.',
        ],
      },
      { force: true },
    );
    if (!result.sent) {
      this.invalid(`Couldn't send the test email: ${result.error}`);
    }
    return { status: 200, success: true, message: `Test email sent to ${to}` };
  }

  async log(decoded: DecodedUser) {
    this.assertAdmin(decoded);
    const emails = await this.prisma.emailLog.findMany({
      where: { school_uuid: decoded.school_uuid },
      orderBy: { created_at: 'desc' },
      take: 50,
      select: {
        uuid: true,
        to: true,
        subject: true,
        category: true,
        status: true,
        via: true,
        error: true,
        created_at: true,
      },
    });
    return {
      status: 200,
      success: true,
      message: 'Email log',
      data: { emails },
    };
  }
}
