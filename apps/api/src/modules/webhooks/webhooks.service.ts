import { Inject, Injectable } from '@nestjs/common';
import type {
  OperationRef,
  Paginated,
  WebhookDeliveryLog,
  WebhookEndpoint,
} from '@relay/contracts';

import type {
  ActorContext,
  ContentItemView,
  CursorQuery,
  Services,
  ViewModel,
} from '../../application/port.js';
import { SERVICES } from '../../application/tokens.js';

/** Transport-level delegation for webhook endpoints and inbound integrations. */
@Injectable()
export class WebhooksService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<WebhookEndpoint>> {
    return this.services.webhooks.list(ctx, query);
  }

  create(ctx: ActorContext, input: ViewModel): Promise<WebhookEndpoint> {
    return this.services.webhooks.create(ctx, input);
  }

  update(ctx: ActorContext, endpointId: string, patch: ViewModel): Promise<WebhookEndpoint> {
    return this.services.webhooks.update(ctx, endpointId, patch);
  }

  delete(ctx: ActorContext, endpointId: string): Promise<void> {
    return this.services.webhooks.delete(ctx, endpointId);
  }

  testDelivery(ctx: ActorContext, endpointId: string): Promise<WebhookDeliveryLog> {
    return this.services.webhooks.testDelivery(ctx, endpointId);
  }

  listDeliveries(
    ctx: ActorContext,
    endpointId: string,
    query: CursorQuery,
  ): Promise<Paginated<WebhookDeliveryLog>> {
    return this.services.webhooks.listDeliveries(ctx, { endpointId, ...query });
  }

  redeliver(ctx: ActorContext, deliveryId: string): Promise<WebhookDeliveryLog> {
    return this.services.webhooks.redeliver(ctx, deliveryId);
  }

  createDraftFromInbound(ctx: ActorContext, draft: ViewModel): Promise<ContentItemView> {
    return this.services.content.createDraft(ctx, draft);
  }

  startRuleFromInbound(
    ctx: ActorContext,
    input: { ruleName: string; event: ViewModel },
  ): Promise<OperationRef> {
    return this.services.automationRules.triggerFromInbound(ctx, input);
  }
}
