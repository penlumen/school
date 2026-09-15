import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { GradesService } from './grades.service.js';

@Controller('grade')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get('index')
  index(@Headers('x-branch-session') branchUuid: string) {
    return this.gradesService.index(branchUuid);
  }

  @Post('create')
  create(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.gradesService.create(branchUuid, user, body);
  }

  @Patch('update/:uuid')
  update(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.gradesService.update(uuid, branchUuid, user, body);
  }

  @Delete('delete/:uuid')
  remove(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.gradesService.remove(uuid, branchUuid, user);
  }
}
