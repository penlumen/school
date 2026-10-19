import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CalendarStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { DecodedUser } from '../common/types/auth.js';

@Injectable()
export class CalendarService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  /** Lets everyone on the branch know a term has just become the active one. */
  private async notifyTermActivated(
    calendar: {
      branch_uuid: string;
      session: string;
      term: string | null;
      close_date: Date | null;
    },
    decoded: DecodedUser,
  ) {
    const closes = calendar.close_date
      ? ` It runs until ${new Date(calendar.close_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.`
      : '';
    await this.notifications.notifyBranchRoles(
      calendar.branch_uuid,
      ['ROOT', 'ADMIN', 'STAFF', 'PARENT'],
      'TERM_ACTIVATED',
      'New term started',
      `${calendar.term ?? 'A new term'} of the ${calendar.session} session is now active.${closes}`,
      { excludeUuid: decoded.uuid },
    );
  }

  async index(branchUuid: string | undefined) {
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    const calendars = await this.prisma.calendar.findMany({
      where: { branch_uuid: branchUuid },
      orderBy: { created_at: 'desc' },
    });

    return {
      status: 200,
      success: true,
      message: 'Calendars',
      data: { calendars },
    };
  }

  /** The one ACTIVE term for a branch, if any - what report generation targets by default. */
  async active(branchUuid: string) {
    return this.prisma.calendar.findFirst({
      where: { branch_uuid: branchUuid, status: 'ACTIVE' },
    });
  }

  async create(
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    const { session, term, next_term_resumption_date, close_date } = body;
    const status: CalendarStatus =
      body.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE';

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!session || !term || !next_term_resumption_date || !close_date) {
      throw new BadRequestException({
        status: 422,
        success: false,
        message: 'All fields are required',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

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
          next_term_resumption_date: next_term_resumption_date
            ? new Date(next_term_resumption_date).toISOString()
            : null,
          status,
        },
      });
    });

    if (result.status === 'ACTIVE') {
      await this.notifyTermActivated(result, decoded);
    }

    return {
      status: 201,
      success: true,
      message: 'Calendar created',
      data: { calendar: result },
    };
  }

  async update(
    uuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    const { session, term, next_term_resumption_date, close_date } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!session || !term || !next_term_resumption_date || !close_date) {
      throw new BadRequestException({
        status: 422,
        success: false,
        message: 'All fields are required',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    const existingCalendar = await this.prisma.calendar.findUnique({
      where: { uuid },
    });
    if (!existingCalendar) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Calendar not found',
      });
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
          next_term_resumption_date: next_term_resumption_date
            ? new Date(next_term_resumption_date).toISOString()
            : null,
          status:
            body.status === 'ACTIVE' || body.status === 'INACTIVE'
              ? body.status
              : undefined,
        },
      });
    });

    if (result.status === 'ACTIVE' && existingCalendar.status !== 'ACTIVE') {
      await this.notifyTermActivated(result, decoded);
    }

    return {
      status: 200,
      success: true,
      message: 'Calendar updated',
      data: { calendar: result },
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

    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized',
      });
    }

    try {
      const calendar = await this.prisma.calendar.findUnique({
        where: { uuid },
      });
      if (!calendar) {
        throw new NotFoundException({
          status: 404,
          success: false,
          message: 'Calendar not found',
        });
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
