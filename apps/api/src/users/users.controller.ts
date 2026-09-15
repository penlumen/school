import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { UsersService } from './users.service.js';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('index')
  index(
    @Headers('x-branch-session') branchUuid: string,
    @Query('role') role: 'STAFF' | 'PARENT',
    @CurrentUser() user: DecodedUser,
  ) {
    return this.usersService.index(branchUuid, role, user);
  }

  @Get('show/:uuid')
  show(@Param('uuid') uuid: string) {
    return this.usersService.show(uuid);
  }

  @Post('create')
  create(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.usersService.create(branchUuid, user, body);
  }

  @Patch('update/:uuid')
  update(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.usersService.update(uuid, branchUuid, user, body);
  }

  @Delete('delete/:uuid')
  remove(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.usersService.remove(uuid, branchUuid, user);
  }
}
