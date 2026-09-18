import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { BranchesService } from './branches.service.js';

@Controller('branch')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get('index')
  index(@CurrentUser() user: DecodedUser) {
    return this.branchesService.index(user);
  }

  @Post('select/:uuid')
  select(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.branchesService.select(uuid, user);
  }

  @Post('create')
  create(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.branchesService.create(user, body);
  }

  @Get('show/:uuid')
  show(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.branchesService.show(uuid, user);
  }

  @Patch('update/:uuid')
  update(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.branchesService.update(uuid, user, body);
  }

  @Post('create/access')
  createAccess(
    @CurrentUser() user: DecodedUser,
    @Headers('x-branch-session') branchUuid: string,
    @Body() body: any,
  ) {
    return this.branchesService.createAccess(user, branchUuid, body);
  }

  @Delete('delete/:uuid')
  remove(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.branchesService.remove(uuid, user);
  }
}
