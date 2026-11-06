import { Module } from '@nestjs/common';
import { PublicSiteController, SchoolController } from './school.controller.js';
import { SchoolService } from './school.service.js';

@Module({
  controllers: [SchoolController, PublicSiteController],
  providers: [SchoolService],
})
export class SchoolModule {}
