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
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { UserBody } from '../docs/schemas.js';

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

  @ApiOperation({ summary: 'Add a staff member or parent' })
  @ApiBody({ type: UserBody })
  @Post('create')
  create(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.usersService.create(branchUuid, user, body);
  }

  @Post('attach/:uuid')
  attach(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.usersService.attach(uuid, branchUuid, user);
  }

  @ApiOperation({ summary: 'Update a staff member or parent' })
  @ApiBody({ type: UserBody })
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
