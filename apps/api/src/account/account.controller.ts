import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { AccountService } from './account.service.js';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('show')
  show(@CurrentUser() user: DecodedUser) {
    return this.accountService.account(user);
  }

  @Patch('update')
  update(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.accountService.updateAccount(user, body);
  }

  @Patch('password')
  changePassword(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.accountService.changePassword(user, body);
  }

  @Post('walkthrough-seen')
  walkthroughSeen(@CurrentUser() user: DecodedUser) {
    return this.accountService.markWalkthroughSeen(user);
  }
}
