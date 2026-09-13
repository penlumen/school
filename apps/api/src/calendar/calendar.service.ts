import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CalendarStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { DecodedUser } from '../common/types/auth.js';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async index(branchUuid: string | undefined) {
    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    const calendars = await this.prisma.calendar.findMany({
      where: { branch_uuid: branchUuid },
      orderBy: { created_at: 'desc' },
    });

    return { status: 200, success: true, message: 'Calendars', data: { calendars } };
  }

  /** The one ACTIVE term for a branch, if any - what report generation targets by default. */
  async active(branchUuid: string) {
    return this.prisma.calendar.findFirst({ where: { branch_uuid: branchUuid, status: 'ACTIVE' } });
  }

  async create(branchUuid: string | undefined, decoded: DecodedUser, body: any) {
    const { session, term, next_term_resumption_date, close_date } = body;
    const status: CalendarStatus = body.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!session || !term || !next_term_resumption_date || !close_date) {
      throw new BadRequestException({
        status: 422,
        success: false,
        message: 'All fields are required',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    // Derive this term's open_date from the previous term's
    // next_term_resumption_date - null if this is the branch's first term.
    const previousTerm = await this.prisma.calendar.findFirst({
      where: { branch_uuid: branchUuid },
      orderBy: { created_at: 'desc' },
    });

    const result = await this.prisma.$transaction(async (tx: any) => {
      if (status === 'ACTIVE') {
        await tx.calendar.updateMany({
          where: { branch_uuid: branchUuid, status: 'ACTIVE' },
          data: { status: 'INACTIVE' },
        });
      }

      return tx.calendar.create({
        data: {
          branch_uuid: branchUuid,
          session,
          term,
          open_date: previousTerm?.next_term_resumption_date ?? null,
          close_date: close_date ? new Date(close_date).toISOString() : null,
          next_term_resumption_date: next_term_resumption_date ? new Date(next_term_resumption_date).toISOString() : null,
          status,
        },
      });
    });

    return { status: 201, success: true, message: 'Calendar created', data: { calendar: result } };
  }

  async update(uuid: string, branchUuid: string | undefined, decoded: DecodedUser, body: any) {
    const { session, term, next_term_resumption_date, close_date } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!session || !term || !next_term_resumption_date || !close_date) {
      throw new BadRequestException({
        status: 422,
        success: false,
        message: 'All fields are required',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    const existingCalendar = await this.prisma.calendar.findUnique({ where: { uuid } });
    if (!existingCalendar) {
      throw new NotFoundException({ status: 404, success: false, message: 'Calendar not found' });
    }

    const makeActive = body.status === 'ACTIVE';

    const result = await this.prisma.$transaction(async (tx: any) => {
      if (makeActive) {
        await tx.calendar.updateMany({
          where: { branch_uuid: branchUuid, status: 'ACTIVE', NOT: { uuid } },
          data: { status: 'INACTIVE' },
        });
      }

      return tx.calendar.update({
        where: { uuid },
        data: {
          session,
          term,
          close_date: close_date ? new Date(close_date).toISOString() : null,
          next_term_resumption_date: next_term_resumption_date ? new Date(next_term_resumption_date).toISOString() : null,
          status: body.status === 'ACTIVE' || body.status === 'INACTIVE' ? body.status : undefined,
        },
      });
    });

    return { status: 200, success: true, message: 'Calendar updated', data: { calendar: result } };
  }

  async remove(uuid: string, branchUuid: string | undefined, decoded: DecodedUser) {
    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    try {
      const calendar = await this.prisma.calendar.findUnique({ where: { uuid } });
      if (!calendar) {
        throw new NotFoundException({ status: 404, success: false, message: 'Calendar not found' });
      }

      await this.prisma.calendar.delete({ where: { uuid } });

      return { status: 200, success: true, message: 'Calendar deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({
        status: 500,
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
