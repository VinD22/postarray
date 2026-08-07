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
} from '../../application/port';
import { SERVICES } from '../../application/tokens';
import type { CreateDraftInput } from '../content/content.schemas';
import type { CreateWebhookEndpointInput, UpdateWebhookEndpointInput } from './webhooks.schemas';

function toEndpoint(view: import('../../application/port').WebhookEndpointView): WebhookEndpoint {
  return {
    id: view.id,
    workspaceId: view.workspaceId,
    url: view.url,
    events: [...view.subscribedEvents],
    connectionIds: [...view.connectionScope],
    enabled: view.state === 'active',
    signingSecretVersion: 1,
    createdAt: view.createdAt,
    lastSuccessAt: null,
    lastFailureAt: null,
    consecutiveFailures: view.consecutiveFailures,
  };
}

function toDelivery(
  view: import('../../application/port').WebhookDeliveryView,
): WebhookDeliveryLog {
  const status =
    view.state === 'delivered'
      ? ('succeeded' as const)
      : view.state === 'dead_lettered'
        ? ('exhausted' as const)
        : view.state === 'failed'
          ? ('failed' as const)
          : ('pending' as const);
  return {
    id: view.id,
    endpointId: view.endpointId,
    eventName: view.eventType,
    status,
    attempt: Math.max(1, view.attemptCount),
    responseStatus: view.responseStatus,
    responseBodyExcerpt: view.responseSnippet,
    requestedAt: view.createdAt,
    completedAt: view.deliveredAt,
    nextAttemptAt: view.nextAttemptAt,
  };
}

/** Transport-level delegation for webhook endpoints and inbound integrations. */
@Injectable()
export class WebhooksService {
  constructor(@Inject(SERVICES) private readonly services: Services) {}

  async list(ctx: ActorContext, query: CursorQuery): Promise<Paginated<WebhookEndpoint>> {
    const page = await this.services.webhooks.list(ctx, query);
    return { ...page, data: page.data.map(toEndpoint) };
  }

  create(
    ctx: ActorContext,
    input: CreateWebhookEndpointInput,
  ): Promise<{ endpoint: WebhookEndpoint; signingSecret: string }> {
    return this.services.webhooks
      .create(ctx, {
        name: input.name ?? new URL(input.url).hostname,
        url: input.url,
        events: input.events,
        connectionScope: input.connectionIds,
      })
      .then((created) => ({ ...created, endpoint: toEndpoint(created.endpoint) }));
  }

  async update(
    ctx: ActorContext,
    endpointId: string,
    patch: UpdateWebhookEndpointInput,
  ): Promise<WebhookEndpoint> {
    const updated = await this.services.webhooks.update(ctx, endpointId, {
      ...(patch.url === undefined ? {} : { url: patch.url }),
      ...(patch.events === undefined ? {} : { events: patch.events }),
      ...(patch.connectionIds === undefined ? {} : { connectionScope: patch.connectionIds }),
      ...(patch.enabled === undefined ? {} : { paused: !patch.enabled }),
    });
    return toEndpoint(updated);
  }

  delete(ctx: ActorContext, endpointId: string): Promise<void> {
    return this.services.webhooks.delete(ctx, endpointId);
  }

  rotateSecret(
    ctx: ActorContext,
    endpointId: string,
  ): Promise<{ endpoint: WebhookEndpoint; signingSecret: string }> {
    return this.services.webhooks
      .rotateSecret(ctx, endpointId)
      .then((created) => ({ ...created, endpoint: toEndpoint(created.endpoint) }));
  }

  async testDelivery(ctx: ActorContext, endpointId: string): Promise<WebhookDeliveryLog> {
    return toDelivery(await this.services.webhooks.testDelivery(ctx, endpointId));
  }

  listDeliveries(
    ctx: ActorContext,
    endpointId: string,
    query: CursorQuery,
  ): Promise<Paginated<WebhookDeliveryLog>> {
    return this.services.webhooks
      .listDeliveries(ctx, { endpointId, ...query })
      .then((page) => ({ ...page, data: page.data.map(toDelivery) }));
  }

  redeliver(ctx: ActorContext, deliveryId: string): Promise<WebhookDeliveryLog> {
    return this.services.webhooks.redeliver(ctx, deliveryId).then(toDelivery);
  }

  createDraftFromInbound(ctx: ActorContext, draft: CreateDraftInput): Promise<ContentItemView> {
    return this.services.content.createDraft(ctx, draft);
  }

  startRuleFromInbound(
    ctx: ActorContext,
    input: { ruleName: string; event: ViewModel },
  ): Promise<OperationRef> {
    return this.services.automationRules.triggerFromInbound(ctx, input);
  }
}
