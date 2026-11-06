import { Module } from '@nestjs/common';
import {
  BillingTemplatesController,
  InvoicesController,
} from './billing.controller.js';
import { BillingService } from './billing.service.js';

@Module({
  controllers: [BillingTemplatesController, InvoicesController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
