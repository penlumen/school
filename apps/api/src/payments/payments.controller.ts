import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  type RawBodyRequest,
} from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { PaymentsService } from './payments.service.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // School Settings › Payments (school administrators)
  @Get('settings')
  settings(@CurrentUser() user: DecodedUser) {
    return this.paymentsService.settings(user);
  }

  @Put('settings')
  saveSettings(@CurrentUser() user: DecodedUser, @Body() body: any) {
    return this.paymentsService.saveSettings(user, body);
  }

  // Parent portal
  @Get('options')
  options(@CurrentUser() user: DecodedUser) {
    return this.paymentsService.options(user);
  }

  @Post('quote/:invoice')
  @HttpCode(200)
  quote(
    @Param('invoice') invoice: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.paymentsService.quote(invoice, user, body);
  }

  @Post('checkout/:invoice')
  @HttpCode(200)
  checkout(
    @Param('invoice') invoice: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.paymentsService.checkout(invoice, user, body);
  }

  @Post('complete/:reference')
  @HttpCode(200)
  complete(
    @Param('reference') reference: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.paymentsService.complete(reference, user);
  }

  @Post('cancel/:reference')
  @HttpCode(200)
  cancel(
    @Param('reference') reference: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.paymentsService.cancel(reference, user);
  }

  // Staff: Billing › Payments
  @Get('index')
  index(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Query('status') status?: string,
  ) {
    return this.paymentsService.index(branchUuid, user, status);
  }

  @Post('confirm/:uuid')
  @HttpCode(200)
  confirm(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.paymentsService.confirm(uuid, branchUuid, user);
  }

  @Post('reject/:uuid')
  @HttpCode(200)
  reject(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.paymentsService.reject(uuid, branchUuid, user, body);
  }

  /** Set this URL in the Paystack dashboard; only works with a secret key. */
  @Public()
  @Post('paystack/webhook/:school')
  @HttpCode(200)
  webhook(
    @Param('school') school: string,
    @Headers('x-paystack-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
    @Body() body: any,
  ) {
    return this.paymentsService.webhook(school, signature, req.rawBody, body);
  }
}
