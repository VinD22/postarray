import { Module } from '@nestjs/common';

import { QueueRulesController } from './queue-rules.controller';
import { QueueRulesService } from './queue-rules.service';

@Module({ controllers: [QueueRulesController], providers: [QueueRulesService] })
export class QueueRulesModule {}
