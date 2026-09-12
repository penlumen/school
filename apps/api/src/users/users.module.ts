import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { HashingService } from '../common/hashing.service.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService, HashingService],
})
export class UsersModule {}
