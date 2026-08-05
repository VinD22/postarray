import { Module } from '@nestjs/common';

import { InboundIntegrationController, WebhooksController } from './webhooks.controller.js';
import { WebhooksService } from './webhooks.service.js';

@Module({
  controllers: [WebhooksController, InboundIntegrationController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
