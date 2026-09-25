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
import { ClassesService } from './classes.service.js';

@Controller('class')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get('index')
  index(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.classesService.index(branchUuid, user);
  }

  @Post('create')
  create(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.classesService.create(branchUuid, user, body);
  }

  @Get('show/:uuid')
  show(@Param('uuid') uuid: string) {
    return this.classesService.show(uuid);
  }

  @Patch('update/:uuid')
  update(
    @Param('uuid') uuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.classesService.update(uuid, user, body);
  }

  @Delete('delete/:uuid')
  remove(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.classesService.remove(uuid, user);
  }
}
