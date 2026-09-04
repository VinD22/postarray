import {
  domainEventEnvelopeSchema,
  isoInstantSchema,
  type DomainEventEnvelope,
  type WebhookEventName,
} from '@relay/contracts';

import type {
  ClaimedDomainEventRow,
  Clock,
  DomainEventService,
  RealtimePublisherPort,
  WebhookService,
} from '../types';
import type { Logger } from '@relay/observability';

import { WEBHOOK_EVENT_NAME_SET } from '../internal/webhook-events';

/**
 * Fan one domain event out to everything that cares.
 *
 * The outbox gives durability: an emitter writes its event in the same
 * transaction as the receipt or job it describes, so an event cannot exist
 * without the fact it reports, and cannot be lost once that fact is committed.
 * This service is the other half, the part that was missing entirely: it takes
 * a claimed row and delivers it to each sink.
 *
 * Sinks run in order and every one of them must be idempotent, because a row
 * whose third sink throws is retried through all three. Webhooks deduplicate
 * on `(endpoint, eventId)`; the realtime sink is best effort and never fails
 * the row, because a dropped live update costs a refresh while a stuck outbox
 * row costs the event.
 */
export interface DomainEventServiceDeps {
  readonly webhooks: WebhookService;
  readonly clock: Clock;
  readonly logger: Logger;
  /** Absent until a deployment has Redis. Live updates are best effort. */
  readonly realtime?: RealtimePublisherPort;
}

export function createDomainEventService(deps: DomainEventServiceDeps): DomainEventService {
  return {
    async dispatch(row: ClaimedDomainEventRow): Promise<void> {
      const envelope = toEnvelope(row, deps.clock.now());

      if (isWebhookEventName(envelope.type)) {
        await deps.webhooks.emit(envelope.type, envelope.data, {
          workspaceId: envelope.workspaceId,
          connectionId: envelope.connectionId,
          correlationId: envelope.correlationId,
        });
      }

      // Sinks two and three, the notification writer and the realtime
      // publisher, arrive with their own slices. Until then a domain event
      // reaches customer endpoints and stops, which is already the difference
      // between working webhooks and none.
      await deps.realtime?.publish(envelope).catch((error: unknown) => {
        deps.logger.warn(
          { outboxEventId: envelope.id, type: envelope.type, error: String(error) },
          'domain_event.realtime_publish_failed',
        );
      });
    },
  };
}

function isWebhookEventName(type: DomainEventEnvelope['type']): type is WebhookEventName {
  return WEBHOOK_EVENT_NAME_SET.has(type);
}

/**
 * Rebuild the envelope from the stored row.
 *
 * Emitters write `{ resourceId, ...payload }`, so `resourceId` is lifted back
 * out and the remainder is the event data. `connectionId` is read from the
 * payload when the emitter knew one, which is what lets an endpoint scoped to
 * particular channels filter correctly.
 */
function toEnvelope(row: ClaimedDomainEventRow, now: Date): DomainEventEnvelope {
  const payload = isRecord(row.payload) ? row.payload : {};
  const { resourceId, connectionId, correlationId, ...data } = payload;

  return domainEventEnvelopeSchema.parse({
    id: row.id,
    type: row.kind,
    workspaceId: row.workspaceId,
    occurredAt: isoInstantSchema.parse((row.createdAt ?? now).toISOString()),
    resourceId: typeof resourceId === 'string' ? resourceId : row.dedupeKey,
    connectionId: typeof connectionId === 'string' ? connectionId : null,
    correlationId: typeof correlationId === 'string' ? correlationId : null,
    data,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
