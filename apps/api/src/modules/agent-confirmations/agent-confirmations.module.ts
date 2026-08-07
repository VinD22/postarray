import { Module } from '@nestjs/common';

import { AgentConfirmationsController } from './agent-confirmations.controller';
import { AgentConfirmationsService } from './agent-confirmations.service';

@Module({
  controllers: [AgentConfirmationsController],
  providers: [AgentConfirmationsService],
})
export class AgentConfirmationsModule {}
