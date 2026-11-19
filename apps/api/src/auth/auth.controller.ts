import { Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { AuthService } from './auth.service.js';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginBody, RegisterBody } from '../docs/schemas.js';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Register a school and its first admin' })
  @ApiBody({ type: RegisterBody })
  @Post('register')
  @HttpCode(201)
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Public()
  @ApiOperation({ summary: 'Sign in as staff or parent' })
  @ApiBody({ type: LoginBody })
  @Post('login')
  @HttpCode(200)
  login(@Headers('x-school-token') schoolToken: string, @Body() body: any) {
    return this.authService.login(schoolToken, body);
  }

  @Get('profile')
  profile(@CurrentUser() user: DecodedUser) {
    return this.authService.profile(user);
  }
}
