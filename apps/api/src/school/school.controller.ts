import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { SchoolService } from './school.service.js';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get('show')
  show(@CurrentUser() user: DecodedUser) {
    return this.schoolService.show(user);
  }

  @Patch('update')
  update(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.schoolService.update(user, body);
  }

  @Post('facility/create')
  createFacility(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.schoolService.createFacility(user, body);
  }

  @Patch('facility/update/:uuid')
  updateFacility(
    @Param('uuid') uuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.schoolService.updateFacility(uuid, user, body);
  }

  @Delete('facility/delete/:uuid')
  removeFacility(
    @Param('uuid') uuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.schoolService.removeFacility(uuid, user);
  }

  @Post('gallery/create')
  createImage(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.schoolService.createImage(user, body);
  }

  @Patch('gallery/update/:uuid')
  updateImage(
    @Param('uuid') uuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.schoolService.updateImage(uuid, user, body);
  }

  @Delete('gallery/delete/:uuid')
  removeImage(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.schoolService.removeImage(uuid, user);
  }

  @Put('gallery/categories')
  saveCategories(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.schoolService.saveCategories(user, body);
  }
}

/** Read-only endpoints for the public school website, identified by school token. */
@Public()
@Controller('public')
export class PublicSiteController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get('site')
  site(@Headers('x-school-token') token: string) {
    return this.schoolService.publicSite(token);
  }

  @Get('events')
  events(@Headers('x-school-token') token: string) {
    return this.schoolService.publicEvents(token);
  }
}
