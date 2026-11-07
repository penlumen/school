import { Controller, Get, Param, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { ParentService } from './parent.service.js';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get('overview')
  overview(@CurrentUser() user: DecodedUser) {
    return this.parentService.overview(user);
  }

  @Get('ward/:uuid')
  ward(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.parentService.ward(uuid, user);
  }

  @Get('ward/:uuid/attendance')
  attendance(
    @Param('uuid') uuid: string,
    @Query('month') month: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.parentService.attendance(uuid, month, user);
  }

  @Get('ward/:uuid/results')
  wardResults(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.parentService.wardResults(uuid, user);
  }

  @Get('result/:uuid')
  result(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.parentService.result(uuid, user);
  }

  @Get('invoices')
  invoices(
    @Query('student_uuid') studentUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.parentService.invoices(user, studentUuid || undefined);
  }

  @Get('invoice/:uuid')
  invoice(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.parentService.invoice(uuid, user);
  }

  @Get('calendar')
  calendar(@CurrentUser() user: DecodedUser) {
    return this.parentService.calendar(user);
  }
}
