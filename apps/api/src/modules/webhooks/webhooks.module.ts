import { Module } from '@nestjs/common';

import { InboundIntegrationController, WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  controllers: [WebhooksController, InboundIntegrationController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
