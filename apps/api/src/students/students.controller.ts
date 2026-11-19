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
import { StudentsService } from './students.service.js';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { StudentBody } from '../docs/schemas.js';

@Controller('student')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('index')
  index(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.studentsService.index(branchUuid, user);
  }

  @ApiOperation({ summary: 'Add a student' })
  @ApiBody({ type: StudentBody })
  @Post('create')
  create(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.studentsService.create(branchUuid, user, body);
  }

  @Get('next-reg-number')
  nextRegNumber(@Headers('x-branch-session') branchUuid: string) {
    return this.studentsService.nextRegNumber(branchUuid);
  }

  @Get('show/:uuid')
  show(@Param('uuid') uuid: string) {
    return this.studentsService.show(uuid);
  }

  @ApiOperation({ summary: 'Update a student' })
  @ApiBody({ type: StudentBody })
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
