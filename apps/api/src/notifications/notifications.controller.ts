import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { NotificationsService } from './notifications.service.js';

@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('index')
  index(@CurrentUser() user: DecodedUser) {
    return this.notificationsService.index(user);
  }

  @Patch('read/:uuid')
  markRead(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.notificationsService.markRead(uuid, user);
  }

  @Post('read-all')
  markAllRead(@CurrentUser() user: DecodedUser) {
    return this.notificationsService.markAllRead(user);
  }

  @Post('device-token')
  registerToken(
    @CurrentUser() user: DecodedUser,
    @Body() body: { token: string; platform?: string },
  ) {
    return this.notificationsService.registerToken(
      user,
      body.token,
      body.platform,
    );
  }
}
