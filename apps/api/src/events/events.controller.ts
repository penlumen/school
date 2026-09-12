import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { EventsService } from './events.service.js';

@Controller('event')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('index/:calendar_uuid')
  index(@Param('calendar_uuid') calendarUuid: string) {
    return this.eventsService.index(calendarUuid);
  }

  @Get('show/:uuid')
  show(@Param('uuid') uuid: string) {
    return this.eventsService.show(uuid);
  }

  @Post('create/:calendar_uuid')
  create(
    @Param('calendar_uuid') calendarUuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.eventsService.create(calendarUuid, branchUuid, user, body);
  }

  @Patch('update/:uuid')
  update(@Param('uuid') uuid: string, @Body() body: any) {
    return this.eventsService.update(uuid, body);
  }

  @Delete('delete/:uuid')
  remove(@Param('uuid') uuid: string) {
    return this.eventsService.remove(uuid);
  }
}
