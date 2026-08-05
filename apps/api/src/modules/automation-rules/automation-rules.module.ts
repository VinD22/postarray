import { Module } from '@nestjs/common';

import { AutomationRulesController } from './automation-rules.controller.js';
import { AutomationRulesService } from './automation-rules.service.js';

@Module({
  controllers: [AutomationRulesController],
  providers: [AutomationRulesService],
  exports: [AutomationRulesService],
})
export class AutomationRulesModule {}
