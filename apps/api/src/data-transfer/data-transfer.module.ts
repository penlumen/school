import { Module } from '@nestjs/common';
import { HashingService } from '../common/hashing.service.js';
import { DataTransferController } from './data-transfer.controller.js';
import { DataTransferService } from './data-transfer.service.js';

@Module({
  controllers: [DataTransferController],
  providers: [DataTransferService, HashingService],
})
export class DataTransferModule {}
