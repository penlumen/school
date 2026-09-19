import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { StaffAttendanceService } from './staff-attendance.service.js';

@Controller('attendance/staff')
export class StaffAttendanceController {
  constructor(private readonly service: StaffAttendanceService) {}

  @Get('index')
  index(
    @Headers('x-branch-session') branchUuid: string,
    @Query('date') date: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.service.index(branchUuid, date, user);
  }

  @Get('faces')
  faces(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.service.faces(branchUuid, user);
  }

  @Post(':staff_uuid')
  mark(
    @Param('staff_uuid') staffUuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.service.mark(staffUuid, branchUuid, user, body);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.service.update(uuid, user, body);
  }
}
