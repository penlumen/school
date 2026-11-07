import { Body, Controller, Get, Headers, Put } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { AffectiveService } from './affective.service.js';

@Controller('affective')
export class AffectiveController {
  constructor(private readonly affectiveService: AffectiveService) {}

  @Get('index')
  index(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.affectiveService.index(branchUuid, user);
  }

  @Put('save')
  save(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.affectiveService.save(branchUuid, user, body);
  }
}
