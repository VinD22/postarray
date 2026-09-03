import { z } from 'zod';

import { WEBHOOK_EVENT_NAMES } from './api';
import { isoInstantSchema } from './primitives';

/**
 * Everything the outbox carries that describes something which already
 * happened, as opposed to a workflow intent asking for something to happen.
 *
 * The customer-facing subset is `WEBHOOK_EVENT_NAMES`. The rest are internal:
 * they reach the notification writer and the realtime stream and never leave
 * the product.
 */
export const DOMAIN_EVENT_TYPES = [
  ...WEBHOOK_EVENT_NAMES,
  'notification.requested',
  'media.scanned',
  'report.ready',
] as const;

export const domainEventTypeSchema = z.enum(DOMAIN_EVENT_TYPES);
export type DomainEventType = z.infer<typeof domainEventTypeSchema>;

/**
 * One domain event, as the dispatcher hands it to each sink.
 *
 * `id` is the outbox row id, which is stable across retries. Every sink is
 * expected to be idempotent on it, because a row whose third sink threw is
 * redelivered to all three.
 */
export const domainEventEnvelopeSchema = z
  .object({
    id: z.string().min(1),
    type: domainEventTypeSchema,
    workspaceId: z.string().min(1),
    occurredAt: isoInstantSchema,
    resourceId: z.string().min(1),
    connectionId: z.string().min(1).nullable(),
    correlationId: z.string().min(1).nullable(),
    data: z.record(z.string(), z.unknown()),
  })
  .strict();

export type DomainEventEnvelope = z.infer<typeof domainEventEnvelopeSchema>;
