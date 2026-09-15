import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { StudentAttendanceService } from './student-attendance.service.js';

@Controller('attendance/student')
export class StudentAttendanceController {
  constructor(private readonly service: StudentAttendanceService) {}

  @Get('class/:class_uuid')
  index(
    @Param('class_uuid') classUuid: string,
    @Query('date') date: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.service.index(classUuid, date, user);
  }

  @Get('faces/:class_uuid')
  faces(@Param('class_uuid') classUuid: string, @CurrentUser() user: DecodedUser) {
    return this.service.faces(classUuid, user);
  }

  @Get('history/:student_uuid')
  history(@Param('student_uuid') studentUuid: string, @CurrentUser() user: DecodedUser) {
    return this.service.history(studentUuid, user);
  }

  @Post(':student_uuid')
  mark(
    @Param('student_uuid') studentUuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.service.mark(studentUuid, branchUuid, user, body);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.service.update(uuid, user, body);
  }
}
