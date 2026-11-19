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
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  EmailSettingsBody,
  ForgotPasswordBody,
  SetPasswordBody,
  TestEmailBody,
} from '../docs/schemas.js';

/** School Settings › Email (school administrators). */
@Controller('email')
export class EmailController {
  constructor(private readonly emailSettings: EmailSettingsService) {}

  @Get('settings')
  settings(@CurrentUser() user: DecodedUser) {
    return this.emailSettings.settings(user);
  }

  @ApiOperation({ summary: 'Save SMTP settings and email categories' })
  @ApiBody({ type: EmailSettingsBody })
  @Put('settings')
  save(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.emailSettings.save(user, body);
  }

  @ApiOperation({ summary: 'Send a test email with the saved settings' })
  @ApiBody({ type: TestEmailBody })
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
  @ApiOperation({ summary: 'Email a password reset link' })
  @ApiBody({ type: ForgotPasswordBody })
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
  @ApiOperation({ summary: 'Set a password from an invite or reset link' })
  @ApiBody({ type: SetPasswordBody })
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
