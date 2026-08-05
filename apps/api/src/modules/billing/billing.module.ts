import { Module } from '@nestjs/common';

import { BillingController, PolarWebhookController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  controllers: [BillingController, PolarWebhookController],
  providers: [BillingService],
})
export class BillingModule {}
