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
import { DecodedUser } from '../common/types/auth.js';
import { EmailSettingsService } from './email-settings.service.js';
import { PasswordService } from './password.service.js';

/** School Settings › Email (school administrators). */
@Controller('email')
export class EmailController {
  constructor(private readonly emailSettings: EmailSettingsService) {}

  @Get('settings')
  settings(@CurrentUser() user: DecodedUser) {
    return this.emailSettings.settings(user);
  }

  @Put('settings')
  save(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.emailSettings.save(user, body);
  }

  @Post('test')
  @HttpCode(200)
  test(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.emailSettings.test(user, body);
  }

  @Get('log')
  log(@CurrentUser() user: DecodedUser) {
    return this.emailSettings.log(user);
  }
}

/** Set-password links: invites and "forgot password". */
@Controller('password')
export class PasswordController {
  constructor(private readonly passwords: PasswordService) {}

  @Public()
  @Post('forgot')
  @HttpCode(200)
  forgot(@Headers('x-school-token') token: string, @Body() body: any) {
    return this.passwords.forgot(token, body);
  }

  @Public()
  @Get('check/:token')
  check(@Param('token') token: string) {
    return this.passwords.check(token);
  }

  @Public()
  @Post('set')
  @HttpCode(200)
  set(@Body() body: any) {
    return this.passwords.set(body);
  }

  @Post('invite/:user')
  @HttpCode(200)
  invite(@Param('user') user: string, @CurrentUser() decoded: DecodedUser) {
    return this.passwords.resendInvite(user, decoded);
  }
}
