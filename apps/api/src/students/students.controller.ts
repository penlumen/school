import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { StudentsService } from './students.service.js';

@Controller('student')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('index')
  index(@Headers('x-branch-session') branchUuid: string, @CurrentUser() user: DecodedUser) {
    return this.studentsService.index(branchUuid, user);
  }

  @Post('create')
  create(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.studentsService.create(branchUuid, user, body);
  }

  @Get('show/:uuid')
  show(@Param('uuid') uuid: string) {
    return this.studentsService.show(uuid);
  }

  @Patch('update/:uuid')
  update(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.studentsService.update(uuid, branchUuid, user, body);
  }

  @Delete('delete/:uuid')
  remove(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.studentsService.remove(uuid, branchUuid, user);
  }
}
