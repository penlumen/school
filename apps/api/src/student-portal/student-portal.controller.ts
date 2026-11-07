import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { StudentRoute } from '../common/decorators/student-route.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { StudentPortalService } from './student-portal.service.js';

@Controller()
export class StudentPortalController {
  constructor(private readonly portal: StudentPortalService) {}

  @Public()
  @Post('student-portal/login')
  @HttpCode(200)
  login(@Headers('x-school-token') token: string, @Body() body: any) {
    return this.portal.login(token, body);
  }

  @StudentRoute()
  @Get('student-portal/overview')
  overview(@CurrentUser() user: DecodedUser) {
    return this.portal.overview(user);
  }

  @Get('student/pin/:uuid')
  pinStatus(@Param('uuid') uuid: string, @CurrentUser() user: DecodedUser) {
    return this.portal.pinStatus(uuid, user);
  }

  /** Staff: set (6 digits) or clear (null) a student's portal PIN. */
  @Put('student/pin/:uuid')
  setPin(
    @Param('uuid') uuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.portal.setPin(uuid, user, body);
  }
}
