import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { DecodedUser } from '../common/types/auth.js';
import { BillingService } from './billing.service.js';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  InvoiceCreateBody,
  InvoiceStatusBody,
  TemplateBody,
} from '../docs/schemas.js';

@Controller('billing-template')
export class BillingTemplatesController {
  constructor(private readonly billingService: BillingService) {}

  @Get('index')
  index(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.billingService.templates(branchUuid, user);
  }

  @Get('show/:uuid')
  show(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.billingService.template(uuid, branchUuid, user);
  }

  @ApiOperation({ summary: 'Create a billing template' })
  @ApiBody({ type: TemplateBody })
  @Post('create')
  create(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.billingService.createTemplate(branchUuid, user, body);
  }

  @ApiOperation({ summary: 'Update a billing template' })
  @ApiBody({ type: TemplateBody })
  @Patch('update/:uuid')
  update(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.billingService.updateTemplate(uuid, branchUuid, user, body);
  }

  @Delete('delete/:uuid')
  remove(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.billingService.removeTemplate(uuid, branchUuid, user);
  }
}

@Controller('invoice')
export class InvoicesController {
  constructor(private readonly billingService: BillingService) {}

  @Get('index')
  index(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.billingService.invoices(branchUuid, user);
  }

  @Get('show/:uuid')
  show(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.billingService.invoice(uuid, branchUuid, user);
  }

  @ApiOperation({ summary: 'Issue invoices to one or more students' })
  @ApiBody({ type: InvoiceCreateBody })
  @Post('create')
  create(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.billingService.createInvoices(branchUuid, user, body);
  }

  @ApiOperation({ summary: 'Record a payment, refund or cancellation' })
  @ApiBody({ type: InvoiceStatusBody })
  @Post('bulk-status')
  @HttpCode(200)
  bulkStatus(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.billingService.bulkStatus(branchUuid, user, body);
  }

  @Post('bulk-delete')
  @HttpCode(200)
  bulkDelete(
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.billingService.bulkDelete(branchUuid, user, body);
  }

  @Patch('status/:uuid')
  updateStatus(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
    @Body() body: any,
  ) {
    return this.billingService.updateStatus(uuid, branchUuid, user, body);
  }

  @Delete('delete/:uuid')
  remove(
    @Param('uuid') uuid: string,
    @Headers('x-branch-session') branchUuid: string,
    @CurrentUser() user: DecodedUser,
  ) {
    return this.billingService.removeInvoice(uuid, branchUuid, user);
  }
}
