import { Module } from '@nestjs/common';
import { HashingService } from '../common/hashing.service.js';
import { StudentPortalController } from './student-portal.controller.js';
import { StudentPortalService } from './student-portal.service.js';

@Module({
  controllers: [StudentPortalController],
  providers: [StudentPortalService, HashingService],
})
export class StudentPortalModule {}
