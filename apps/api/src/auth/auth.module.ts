import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { HashingService } from '../common/hashing.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashingService],
})
export class AuthModule {}
