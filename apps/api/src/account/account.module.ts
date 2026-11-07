import { Module } from '@nestjs/common';
import { HashingService } from '../common/hashing.service.js';
import { AccountController } from './account.controller.js';
import { AccountService } from './account.service.js';

@Module({
  controllers: [AccountController],
  providers: [AccountService, HashingService],
})
export class AccountModule {}
