import { Module } from '@nestjs/common';

import { BillingController, PolarWebhookController } from './billing.controller.js';
import { BillingService } from './billing.service.js';

@Module({
  controllers: [BillingController, PolarWebhookController],
  providers: [BillingService],
})
export class BillingModule {}
