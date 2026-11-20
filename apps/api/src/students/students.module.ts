import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller.js';
import { StudentsService } from './students.service.js';
import { HashingService } from '../common/hashing.service.js';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, HashingService],
})
export class StudentsModule {}
