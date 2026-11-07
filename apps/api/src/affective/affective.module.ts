import { Module } from '@nestjs/common';
import { AffectiveController } from './affective.controller.js';
import { AffectiveService } from './affective.service.js';

@Module({
  controllers: [AffectiveController],
  providers: [AffectiveService],
})
export class AffectiveModule {}
