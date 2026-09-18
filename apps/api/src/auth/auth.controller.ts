import { Body, Controller, Get, Headers, HttpCode, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { AuthService } from './auth.service.js';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(201)
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Public()
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
