import { Module } from '@nestjs/common';
import { ResultsModule } from '../results/results.module.js';
import { BillingModule } from '../billing/billing.module.js';
import { ParentController } from './parent.controller.js';
import { ParentService } from './parent.service.js';

@Module({
  imports: [ResultsModule, BillingModule],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
