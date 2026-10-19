import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { DecodedUser } from '../common/types/auth.js';

interface EventTagsInput {
  tag_all_staff?: boolean;
  tag_all_parents?: boolean;
  staff_uuids?: string[];
  parent_uuids?: string[];
}

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  private tagInclude = {
    tags: {
      include: { user: { select: { uuid: true, name: true, avatar: true } } },
    },
    created_by: { select: { uuid: true, name: true } },
  };

  /** Everyone an event is tagged for: individual tags plus all staff/parents when those flags are set. */
  private async taggedUserUuids(event: {
    branch_uuid: string;
    tag_all_staff: boolean;
    tag_all_parents: boolean;
    tags: { user_uuid: string }[];
  }) {
    const roles = [
      ...(event.tag_all_staff ? (['ADMIN', 'STAFF'] as const) : []),
      ...(event.tag_all_parents ? (['PARENT'] as const) : []),
    ];
    const roleAccess = roles.length
      ? await this.prisma.branchAccess.findMany({
          where: { branch_uuid: event.branch_uuid, role: { in: [...roles] } },
          select: { user_uuid: true },
        })
      : [];

    return [
      ...event.tags.map((t) => t.user_uuid),
      ...roleAccess.map((a) => a.user_uuid),
    ];
  }

  private describeEvent(event: {
    title: string;
    date: Date;
    location?: string | null;
  }) {
    const date = event.date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `"${event.title}" on ${date}${event.location ? ` at ${event.location}` : ''}`;
  }

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

    await this.notifications.notifyUsers(
      await this.taggedUserUuids(event),
      branchUuid,
      'EVENT_CREATED',
      'You have been tagged in an event',
      `You were tagged in ${this.describeEvent(event)}.`,
      { excludeUuid: decoded.uuid },
    );

    return {
      status: 201,
      success: true,
      message: 'Event created',
      data: { event },
    };
  }

  async update(uuid: string, decoded: DecodedUser, body: any) {
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

    await this.notifications.notifyUsers(
      await this.taggedUserUuids(event),
      event.branch_uuid,
      'EVENT_UPDATED',
      'Event updated',
      `${this.describeEvent(event)} has been updated.`,
      { excludeUuid: decoded.uuid },
    );

    return {
      status: 200,
      success: true,
      message: 'Event updated',
      data: { event },
    };
  }

  async remove(uuid: string, decoded: DecodedUser) {
    const existing = await this.prisma.event.findUnique({
      where: { uuid },
      include: { tags: true },
    });
    if (!existing) {
      throw new NotFoundException({
        status: 404,
        success: false,
        message: 'Event not found',
      });
    }

    // Resolve recipients before deleting - the tags cascade away with the event.
    const recipients = await this.taggedUserUuids(existing);
    await this.prisma.event.delete({ where: { uuid } });

    await this.notifications.notifyUsers(
      recipients,
      existing.branch_uuid,
      'EVENT_CANCELLED',
      'Event cancelled',
      `${this.describeEvent(existing)} has been cancelled.`,
      { excludeUuid: decoded.uuid },
    );

    return { status: 200, success: true, message: 'Event deleted' };
  }
}
