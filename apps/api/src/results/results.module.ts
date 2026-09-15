import { Module } from '@nestjs/common';
import { ResultsController } from './results.controller.js';
import { ResultsService } from './results.service.js';
import { ReportGateway } from './report.gateway.js';

@Module({
  controllers: [ResultsController],
  providers: [ResultsService, ReportGateway],
})
export class ResultsModule {}
