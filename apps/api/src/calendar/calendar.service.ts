import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async create(branchUuid: string | undefined, decoded: DecodedUser, body: any) {
    const { session, term, open_date, close_date } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!session || !term || !open_date || !close_date) {
      throw new BadRequestException({
        status: 422,
        success: false,
        message: 'All fields are required',
      });
    }

    if (!branchUuid) {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    const result = await this.prisma.calendar.create({
      data: { branch_uuid: branchUuid, session, term, open_date, close_date },
    });

    return { status: 201, success: true, message: 'Calendar created', data: { calendar: result } };
  }

  async update(uuid: string, branchUuid: string | undefined, decoded: DecodedUser, body: any) {
    const { session, term, open_date, close_date } = body;

    if (decoded.position !== 'ADMINISTRATIVE') {
      throw new BadRequestException({ status: 400, success: false, message: 'Unauthorized' });
    }

    if (!session || !term || !open_date || !close_date) {
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

    const result = await this.prisma.calendar.update({
      where: { uuid },
      data: { session, term, open_date, close_date },
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
