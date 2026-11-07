import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service.js';
import { HashingService } from '../common/hashing.service.js';
import { DecodedUser } from '../common/types/auth.js';
import { APP_CATALOG } from '../integrations/app-catalog.js';

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const PIN = /^\d{6}$/;

/**
 * Student portal: students sign in with their registration number and a
 * 6-digit PIN that staff set. Their token carries role STUDENT, which the
 * auth guard only lets through to @StudentRoute() endpoints.
 */
@Injectable()
export class StudentPortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingService,
  ) {}

  private invalidLogin(): never {
    throw new UnauthorizedException({
      status: 401,
      success: false,
      message: 'Invalid registration number or PIN',
    });
  }

  async login(schoolToken: string | undefined, body: any) {
    const regNumber =
      typeof body?.reg_number === 'string' ? body.reg_number.trim() : '';
    const pin = typeof body?.pin === 'string' ? body.pin.trim() : '';
    if (!schoolToken || !regNumber || !pin) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Enter your registration number and PIN',
      });
    }
    const school = await this.prisma.school.findUnique({
      where: { token: schoolToken },
      select: { uuid: true },
    });
    if (!school) this.invalidLogin();

    // Registration numbers are unique per branch, so a school with several
    // branches can have more than one match; the PIN decides which.
    const candidates = await this.prisma.student.findMany({
      where: {
        reg_number: { equals: regNumber, mode: 'insensitive' },
        branch: { school_uuid: school.uuid },
        pin_hash: { not: null },
        status: 'active',
      },
      select: {
        uuid: true,
        name: true,
        avatar: true,
        reg_number: true,
        pin_hash: true,
        pin_locked_until: true,
      },
    });
    if (candidates.length === 0) this.invalidLogin();

    const now = new Date();
    const open = candidates.filter(
      (c) => !c.pin_locked_until || c.pin_locked_until < now,
    );
    if (open.length === 0) {
      throw new UnauthorizedException({
        status: 401,
        success: false,
        message: 'Too many wrong PINs. Try again in 15 minutes.',
      });
    }

    for (const student of open) {
      if (await this.hashing.compareHash(pin, student.pin_hash!)) {
        await this.prisma.student.update({
          where: { uuid: student.uuid },
          data: { pin_failed: 0, pin_locked_until: null },
        });
        const token = jwt.sign(
          {
            uuid: student.uuid,
            role: 'STUDENT',
            email: '',
            position: 'STUDENT',
            school_uuid: school.uuid,
          },
          process.env.JWT_SECRET || 'default_secret',
          { expiresIn: '1d' },
        );
        return {
          status: 200,
          success: true,
          message: 'Signed in',
          data: {
            token,
            user: {
              uuid: student.uuid,
              name: student.name,
              avatar: student.avatar,
              reg_number: student.reg_number,
              role: 'STUDENT',
            },
          },
        };
      }
    }

    // Count the miss against every open match; lock after too many.
    for (const student of open) {
      const updated = await this.prisma.student.update({
        where: { uuid: student.uuid },
        data: { pin_failed: { increment: 1 } },
        select: { pin_failed: true },
      });
      if (updated.pin_failed >= MAX_ATTEMPTS) {
        await this.prisma.student.update({
          where: { uuid: student.uuid },
          data: {
            pin_failed: 0,
            pin_locked_until: new Date(Date.now() + LOCK_MS),
          },
        });
      }
    }
    this.invalidLogin();
  }

  async overview(decoded: DecodedUser) {
    if ((decoded.role as string) !== 'STUDENT') {
      throw new ForbiddenException({
        status: 403,
        success: false,
        message: 'Only students have a student portal',
      });
    }
    const student = await this.prisma.student.findFirst({
      where: {
        uuid: decoded.uuid,
        status: 'active',
        branch: { school_uuid: decoded.school_uuid },
      },
      select: {
        uuid: true,
        name: true,
        avatar: true,
        reg_number: true,
        class: { select: { name: true } },
        branch: {
          select: {
            name: true,
            school: { select: { name: true, avatar: true } },
          },
        },
      },
    });
    if (!student) {
      throw new UnauthorizedException({
        status: 401,
        success: false,
        message: 'Unauthenticated',
        error: 'unauthenticated',
      });
    }
    return {
      status: 200,
      success: true,
      message: 'Student overview',
      data: {
        student,
        // Every app is "coming soon" until the school connects it.
        apps: APP_CATALOG.map((app) => ({
          ...app,
          status: 'coming_soon' as const,
          launch_url: null,
        })),
      },
    };
  }

  private assertManager(decoded: DecodedUser) {
    const allowed =
      ['ROOT', 'ADMIN'].includes(decoded.role) ||
      decoded.position === 'ADMINISTRATIVE';
    if (!allowed) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Only administrators can manage student PINs',
      });
    }
  }

  /** Whether a student can sign in, for the staff edit form. */
  async pinStatus(uuid: string, decoded: DecodedUser) {
    this.assertManager(decoded);
    const student = await this.prisma.student.findFirst({
      where: { uuid, branch: { school_uuid: decoded.school_uuid } },
      select: { pin_hash: true, pin_locked_until: true },
    });
    if (!student) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Student not found',
      });
    }
    const locked =
      student.pin_locked_until && student.pin_locked_until > new Date()
        ? student.pin_locked_until
        : null;
    return {
      status: 200,
      success: true,
      message: 'PIN status',
      data: { has_pin: !!student.pin_hash, locked_until: locked },
    };
  }

  /** Staff set or clear a student's portal PIN. */
  async setPin(uuid: string, decoded: DecodedUser, body: any) {
    this.assertManager(decoded);
    const student = await this.prisma.student.findFirst({
      where: { uuid, branch: { school_uuid: decoded.school_uuid } },
      select: { uuid: true, name: true },
    });
    if (!student) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Student not found',
      });
    }
    const pin = body?.pin === null ? null : String(body?.pin ?? '').trim();
    if (pin !== null && !PIN.test(pin)) {
      throw new UnprocessableEntityException({
        status: 422,
        success: false,
        message: 'The PIN must be 6 digits',
      });
    }
    await this.prisma.student.update({
      where: { uuid },
      data: {
        pin_hash: pin ? await this.hashing.createHash(pin) : null,
        pin_failed: 0,
        pin_locked_until: null,
      },
    });
    return {
      status: 200,
      success: true,
      message: pin
        ? `PIN set. ${student.name} can now sign in to the student portal.`
        : `Student portal access removed for ${student.name}`,
      data: { has_pin: !!pin },
    };
  }
}
