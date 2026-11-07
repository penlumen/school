import { Injectable, Logger } from '@nestjs/common';
import { createTransport, type Transporter } from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service.js';
import { decryptSecret } from '../common/secrets.js';
import {
  categoryFor,
  type EmailCategory,
  emailTypes,
} from './email-categories.js';
import { renderEmail, type EmailContent } from './email-template.js';

export type SmtpSecurity = 'ssl' | 'starttls' | 'none';

/** What School Settings › Email stores in School.smtp. */
export interface StoredSmtp {
  host: string;
  port: number;
  security: SmtpSecurity;
  username: string | null;
  /** Encrypted with encryptSecret. */
  password: string | null;
  from_name: string | null;
  from_email: string;
  reply_to: string | null;
}

interface Route {
  via: 'school' | 'platform';
  transporter: Transporter;
  from: string;
  replyTo?: string;
}

export interface SendResult {
  sent: boolean;
  error?: string;
}

const quote = (name: string) => `"${name.replace(/["\\]/g, '')}"`;

/** Base URL of the web app, for links in emails. */
export const webUrl = () =>
  (process.env.WEB_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

/**
 * Sends a school's email: through its own SMTP server when it set one up in
 * School Settings, otherwise through the platform's SMTP from the env. Never
 * throws, so a mail problem can't fail the action that triggered it; every
 * attempt is written to EmailLog for the school to see.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  /** Reused per school; rebuilt when its settings change. */
  private readonly transporters = new Map<
    string,
    { key: string; transporter: Transporter }
  >();

  constructor(private readonly prisma: PrismaService) {}

  static platformConfigured() {
    return !!process.env.SMTP_HOST;
  }

  private transporterFor(id: string, options: Record<string, unknown>) {
    const key = JSON.stringify(options);
    const cached = this.transporters.get(id);
    if (cached?.key === key) return cached.transporter;
    cached?.transporter.close();
    const transporter = createTransport({
      ...options,
      pool: true,
      maxConnections: 3,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    } as any);
    this.transporters.set(id, { key, transporter });
    return transporter;
  }

  static smtpOptions(
    smtp: Omit<StoredSmtp, 'password'>,
    password: string | null,
  ) {
    return {
      host: smtp.host,
      port: smtp.port,
      secure: smtp.security === 'ssl',
      requireTLS: smtp.security === 'starttls',
      ignoreTLS: smtp.security === 'none',
      auth: smtp.username
        ? { user: smtp.username, pass: password ?? '' }
        : undefined,
    };
  }

  private route(school: {
    uuid: string;
    name: string;
    email: string;
    smtp: unknown;
  }): Route | null {
    const smtp = school.smtp as StoredSmtp | null;
    if (smtp?.host && smtp.from_email) {
      return {
        via: 'school',
        transporter: this.transporterFor(
          school.uuid,
          MailService.smtpOptions(smtp, decryptSecret(smtp.password)),
        ),
        from: `${quote(smtp.from_name || school.name)} <${smtp.from_email}>`,
        replyTo: smtp.reply_to || undefined,
      };
    }
    if (MailService.platformConfigured()) {
      const from = process.env.SMTP_FROM || process.env.SMTP_USER || '';
      const address = from.match(/<([^>]+)>/)?.[1] ?? from;
      return {
        via: 'platform',
        transporter: this.transporterFor('platform', {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        }),
        // Platform mail still shows the school's name; replies go to the school.
        from: `${quote(school.name)} <${address}>`,
        replyTo: school.email,
      };
    }
    return null;
  }

  private loadSchool(schoolUuid: string) {
    return this.prisma.school.findUnique({
      where: { uuid: schoolUuid },
      select: {
        uuid: true,
        name: true,
        email: true,
        avatar: true,
        theme: true,
        smtp: true,
        email_enabled: true,
        email_types: true,
      },
    });
  }

  /**
   * Sends one email. `force` skips the school's on/off switches, for test
   * emails; account emails are always on anyway.
   */
  async send(
    schoolUuid: string,
    to: string,
    category: EmailCategory,
    content: EmailContent,
    options: { force?: boolean } = {},
  ): Promise<SendResult> {
    try {
      const school = await this.loadSchool(schoolUuid);
      if (!school) return { sent: false, error: 'School not found' };
      if (!options.force && category !== 'account') {
        if (
          !school.email_enabled ||
          !emailTypes(school.email_types)[category]
        ) {
          return { sent: false, error: 'Switched off' };
        }
      }
      const route = this.route(school);
      if (!route) return { sent: false, error: 'No email server is set up' };

      const { html, text } = renderEmail(content, {
        schoolName: school.name,
        logo: school.avatar,
        primary: (school.theme as { primary?: string } | null)?.primary,
      });
      try {
        await route.transporter.sendMail({
          from: route.from,
          replyTo: route.replyTo,
          to,
          subject: content.subject,
          html,
          text,
        });
        await this.log(school.uuid, to, content.subject, category, route.via);
        return { sent: true };
      } catch (error: any) {
        const message = String(error?.message || error).slice(0, 500);
        this.logger.warn(`Email to ${to} failed: ${message}`);
        await this.log(
          school.uuid,
          to,
          content.subject,
          category,
          route.via,
          message,
        );
        return { sent: false, error: message };
      }
    } catch (error: any) {
      this.logger.warn(`Email to ${to} failed: ${error?.message}`);
      return { sent: false, error: error?.message };
    }
  }

  private log(
    schoolUuid: string,
    to: string,
    subject: string,
    category: string,
    via: string,
    error?: string,
  ) {
    return this.prisma.emailLog
      .create({
        data: {
          school_uuid: schoolUuid,
          to,
          subject: subject.slice(0, 200),
          category,
          via,
          status: error ? 'FAILED' : 'SENT',
          error: error ?? null,
        },
      })
      .catch(() => undefined);
  }

  /**
   * Emails the people an in-app notification went to. Runs in the
   * background: callers don't wait for SMTP.
   */
  notifyUsers(
    userUuids: string[],
    branchUuid: string,
    type: string,
    title: string,
    message: string,
  ) {
    void (async () => {
      const [branch, users] = await Promise.all([
        this.prisma.branch.findUnique({
          where: { uuid: branchUuid },
          select: { school_uuid: true },
        }),
        this.prisma.user.findMany({
          where: { uuid: { in: userUuids } },
          select: { email: true, name: true, role: true },
        }),
      ]);
      if (!branch) return;
      for (const user of users) {
        if (!user.email) continue;
        await this.send(branch.school_uuid, user.email, categoryFor(type), {
          subject: title,
          greeting: `Hi ${(user.name || 'there').split(' ')[0]},`,
          paragraphs: [message],
          action: {
            label:
              user.role === 'PARENT' ? 'Open parent portal' : 'Open portal',
            url: `${webUrl()}/login`,
          },
        });
      }
    })().catch((error) =>
      this.logger.warn(`Notification email failed: ${error?.message}`),
    );
  }
}
