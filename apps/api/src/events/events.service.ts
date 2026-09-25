import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DecodedUser } from '../common/types/auth.js';

interface EventTagsInput {
  tag_all_staff?: boolean;
  tag_all_parents?: boolean;
  staff_uuids?: string[];
  parent_uuids?: string[];
}

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  private tagInclude = {
    tags: {
      include: { user: { select: { uuid: true, name: true, avatar: true } } },
    },
    created_by: { select: { uuid: true, name: true } },
  };

  async index(calendarUuid: string) {
    if (!calendarUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Calendar uuid is required',
      });
    }

    const events = await this.prisma.event.findMany({
      where: { calendar_uuid: calendarUuid },
      include: this.tagInclude,
      orderBy: { date: 'asc' },
    });

    return { status: 200, success: true, message: 'Events', data: { events } };
  }

  async show(uuid: string) {
    const event = await this.prisma.event.findUnique({
      where: { uuid },
      include: this.tagInclude,
    });
    if (!event) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Event not found',
      });
    }
    return { status: 200, success: true, message: 'Event', data: { event } };
  }

  async create(
    calendarUuid: string,
    branchUuid: string | undefined,
    decoded: DecodedUser,
    body: any,
  ) {
    if (!branchUuid) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Unauthorized branch',
      });
    }

    const { title, description, date, start_time, end_time, location } = body;
    const tags: EventTagsInput = body || {};

    if (!title || !date) {
      throw new BadRequestException({
        status: 400,
        success: false,
        message: 'Title and date are required',
      });
    }

    const event = await this.prisma.event.create({
      data: {
        calendar_uuid: calendarUuid,
        branch_uuid: branchUuid,
        title,
        description,
        date: new Date(date),
        start_time,
        end_time,
        location,
        tag_all_staff: !!tags.tag_all_staff,
        tag_all_parents: !!tags.tag_all_parents,
        created_by_uuid: decoded.uuid,
        tags: {
          create: [
            ...(tags.staff_uuids || []).map((user_uuid) => ({
              user_uuid,
              tag_type: 'STAFF',
            })),
            ...(tags.parent_uuids || []).map((user_uuid) => ({
              user_uuid,
              tag_type: 'PARENT',
            })),
          ],
        },
      },
      include: this.tagInclude,
    });

    return {
      status: 201,
      success: true,
      message: 'Event created',
      data: { event },
    };
  }

  async update(uuid: string, body: any) {
    const existing = await this.prisma.event.findUnique({ where: { uuid } });
    if (!existing) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Event not found',
      });
    }

    const { title, description, date, start_time, end_time, location } = body;
    const tags: EventTagsInput = body || {};

    const event = await this.prisma.$transaction(async (tx: any) => {
      await tx.eventTag.deleteMany({ where: { event_uuid: uuid } });

      return tx.event.update({
        where: { uuid },
        data: {
          title,
          description,
          date: date ? new Date(date) : undefined,
          start_time,
          end_time,
          location,
          tag_all_staff: !!tags.tag_all_staff,
          tag_all_parents: !!tags.tag_all_parents,
          tags: {
            create: [
              ...(tags.staff_uuids || []).map((user_uuid) => ({
                user_uuid,
                tag_type: 'STAFF',
              })),
              ...(tags.parent_uuids || []).map((user_uuid) => ({
                user_uuid,
                tag_type: 'PARENT',
              })),
            ],
          },
        },
        include: this.tagInclude,
      });
    });

    return {
      status: 200,
      success: true,
      message: 'Event updated',
      data: { event },
    };
  }

  async remove(uuid: string) {
    const existing = await this.prisma.event.findUnique({ where: { uuid } });
    if (!existing) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Event not found',
      });
    }

    await this.prisma.event.delete({ where: { uuid } });

    return { status: 200, success: true, message: 'Event deleted' };
  }
}
