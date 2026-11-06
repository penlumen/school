import { Module } from '@nestjs/common';
import { PresenceGateway } from './presence.gateway.js';

@Module({
  providers: [PresenceGateway],
})
export class PresenceModule {}
