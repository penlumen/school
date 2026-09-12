import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { SubjectsService } from './subjects.service.js';

@Controller('subject')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get('index/:class_uuid')
  index(@Param('class_uuid') classUuid: string) {
    return this.subjectsService.index(classUuid);
  }

  @Get('show/:subject_uuid')
  show(@Param('subject_uuid') subjectUuid: string) {
    return this.subjectsService.show(subjectUuid);
  }

  @Post('create/:class_uuid')
  create(
    @CurrentUser() user: DecodedUser,
    @Param('class_uuid') classUuid: string,
    @Body() body: any,
  ) {
    return this.subjectsService.create(user, classUuid, body);
  }

  @Patch('update/:subject_uuid')
  update(
    @CurrentUser() user: DecodedUser,
    @Param('subject_uuid') subjectUuid: string,
    @Body() body: any,
  ) {
    return this.subjectsService.update(user, subjectUuid, body);
  }

  @Delete('delete/:subject_uuid')
  remove(@CurrentUser() user: DecodedUser, @Param('subject_uuid') subjectUuid: string) {
    return this.subjectsService.remove(user, subjectUuid);
  }
}
