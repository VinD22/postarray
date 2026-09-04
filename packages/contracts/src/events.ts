import { z } from 'zod';

import { WEBHOOK_EVENT_NAMES } from './api';
import { publishStateSchema, type PublishState } from './enums';
import { ID_PREFIXES, idSchema } from './ids';
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

/* -------------------------------------------------------------------------- */
/* Realtime                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * What a connected client is told about, live.
 *
 * This is deliberately a much smaller list than `DOMAIN_EVENT_TYPES`. A domain
 * event exists to be delivered exactly once to a customer's endpoint; a
 * realtime event exists to tell a browser tab that something it is already
 * showing is now stale. Anything a screen does not render live has no reason
 * to be here.
 */
export const REALTIME_EVENT_TYPES = [
  'post.status',
  'receipt.updated',
  'action_item.created',
  'upload.scanned',
  'connection.status',
  'notification.created',
] as const;

export const realtimeEventTypeSchema = z.enum(REALTIME_EVENT_TYPES);
export type RealtimeEventType = z.infer<typeof realtimeEventTypeSchema>;

/**
 * A Redis stream entry id, `<milliseconds>-<sequence>`.
 *
 * It is also the SSE `id:` a client sends back as `Last-Event-ID`, which is
 * what makes a reconnect resume rather than restart. Validated rather than
 * trusted, because it arrives from a header a client controls.
 */
export const realtimeEventIdSchema = z.string().regex(/^\d+-\d+$/);

/**
 * The connection states a live update can report.
 *
 * Declared here rather than imported from the database enum because
 * `@relay/contracts` depends on nothing. The RLS-side enum is the source of
 * truth for storage; this is the source of truth for the wire, and the
 * publisher parses against it, so a state that reaches a client is always one
 * of these.
 */
export const REALTIME_CONNECTION_STATUSES = [
  'active',
  'action_required',
  'expired',
  'revoked',
  'paused',
  'disconnected',
] as const;
export const realtimeConnectionStatusSchema = z.enum(REALTIME_CONNECTION_STATUSES);

/**
 * Where an uploaded asset is in the scan pipeline.
 *
 * The pipeline itself lands with the media scan slice. The wire vocabulary is
 * fixed here so the stream and the client can be built and tested against it
 * before the producer exists.
 */
export const REALTIME_MEDIA_SCAN_STATES = ['pending', 'scanning', 'clean', 'rejected'] as const;
export const realtimeMediaScanStateSchema = z.enum(REALTIME_MEDIA_SCAN_STATES);

/**
 * The payload.
 *
 * Ids and enumerations only. No title, no caption, no provider response, no
 * error prose, nothing a person wrote. A client that needs the substance
 * refetches it through the normal authorized endpoint, which is what keeps
 * this stream from quietly becoming a second read path with no authorization
 * of its own and no audit trail behind it.
 */
export const realtimeEventDataSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('post.status'),
    publishJobId: idSchema(ID_PREFIXES.publishJob),
    /** Null when the producer knew the job but not the item it belongs to. */
    contentItemId: idSchema(ID_PREFIXES.contentItem).nullable(),
    state: publishStateSchema,
  }),
  z.object({
    type: z.literal('receipt.updated'),
    receiptId: idSchema(ID_PREFIXES.receipt),
    publishJobId: idSchema(ID_PREFIXES.publishJob).nullable(),
    contentItemId: idSchema(ID_PREFIXES.contentItem).nullable(),
  }),
  z.object({
    type: z.literal('action_item.created'),
    actionItemId: z.string().min(1),
    kind: z.string().min(1),
  }),
  z.object({
    type: z.literal('upload.scanned'),
    mediaAssetId: idSchema(ID_PREFIXES.media),
    scanState: realtimeMediaScanStateSchema,
  }),
  z.object({
    type: z.literal('connection.status'),
    connectionId: idSchema(ID_PREFIXES.connection),
    status: realtimeConnectionStatusSchema,
  }),
  z.object({
    type: z.literal('notification.created'),
    notificationId: z.string().min(1),
    kind: z.string().min(1),
  }),
]);

export type RealtimeEventData = z.infer<typeof realtimeEventDataSchema>;

const realtimeEventShape = {
  type: realtimeEventTypeSchema,
  workspaceId: idSchema(ID_PREFIXES.workspace),
  occurredAt: isoInstantSchema,
  data: realtimeEventDataSchema,
};

function typesAgree(event: { type: string; data: { type: string } }): boolean {
  return event.type === event.data.type;
}

function typeMismatch(): { error: string; path: PropertyKey[] } {
  return { error: 'REALTIME_EVENT_TYPE_MISMATCH', path: ['type'] };
}

/**
 * An event as a publisher hands it over, before the stream assigns an id.
 *
 * The discriminant appears twice on purpose. A client filters on the outer
 * `type` without narrowing the union first, and the inner one is what makes
 * the payload a discriminated union at all. The refinement is what stops the
 * two from ever disagreeing.
 */
export const realtimeEventInputSchema = z
  .object(realtimeEventShape)
  .strict()
  .refine(typesAgree, typeMismatch());

export type RealtimeEventInput = z.infer<typeof realtimeEventInputSchema>;

/** An event as a subscriber reads it back, carrying its stream id. */
export const realtimeEventSchema = z
  .object({ id: realtimeEventIdSchema, ...realtimeEventShape })
  .strict()
  .refine(typesAgree, typeMismatch());

export type RealtimeEvent = z.infer<typeof realtimeEventSchema>;

/** The publish states a `post.*` domain event reports, by event name. */
const POST_EVENT_STATES: Readonly<Record<string, PublishState>> = {
  'post.scheduled': 'scheduled',
  'post.dispatching': 'dispatching',
  'post.published': 'published',
  'post.partially_published': 'partially_published',
  'post.failed': 'failed_permanently',
};

function stringField(data: Readonly<Record<string, unknown>>, name: string): string | null {
  const value = data[name];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

/**
 * Translate one domain event into the live updates it implies.
 *
 * Zero, one or two: most domain events mean nothing to a screen, a post state
 * change means one, and a publish that produced a receipt means both the state
 * and the receipt, because the receipt screen and the post screen are
 * different queries.
 *
 * Every result is parsed before it is returned. An emitter that writes a
 * malformed payload therefore produces no live update rather than a
 * malformed one, which is the behaviour a best-effort sink should have.
 */
export function toRealtimeEvents(envelope: DomainEventEnvelope): readonly RealtimeEventInput[] {
  const base = { workspaceId: envelope.workspaceId, occurredAt: envelope.occurredAt };
  const data = envelope.data;
  const candidates: unknown[] = [];

  const postState = POST_EVENT_STATES[envelope.type];
  if (postState !== undefined) {
    candidates.push({
      ...base,
      type: 'post.status',
      data: {
        type: 'post.status',
        publishJobId: stringField(data, 'publishJobId') ?? envelope.resourceId,
        contentItemId: stringField(data, 'contentItemId'),
        state: postState,
      },
    });
    const receiptId = stringField(data, 'receiptId');
    if (receiptId !== null) {
      candidates.push({
        ...base,
        type: 'receipt.updated',
        data: {
          type: 'receipt.updated',
          receiptId,
          publishJobId: stringField(data, 'publishJobId') ?? envelope.resourceId,
          contentItemId: stringField(data, 'contentItemId'),
        },
      });
    }
  }

  if (envelope.type === 'connection.action_required' || envelope.type === 'connection.connected') {
    candidates.push({
      ...base,
      type: 'connection.status',
      data: {
        type: 'connection.status',
        connectionId: envelope.connectionId ?? envelope.resourceId,
        status: envelope.type === 'connection.connected' ? 'active' : 'action_required',
      },
    });
  }

  if (envelope.type === 'media.scanned') {
    candidates.push({
      ...base,
      type: 'upload.scanned',
      data: {
        type: 'upload.scanned',
        mediaAssetId: envelope.resourceId,
        scanState: stringField(data, 'scanState') ?? 'clean',
      },
    });
  }

  if (envelope.type === 'notification.requested') {
    candidates.push({
      ...base,
      type: 'notification.created',
      data: {
        type: 'notification.created',
        notificationId: envelope.id,
        kind: stringField(data, 'messageKey') ?? envelope.type,
      },
    });
  }

  return candidates.flatMap((candidate) => {
    const parsed = realtimeEventInputSchema.safeParse(candidate);
    return parsed.success ? [parsed.data] : [];
  });
}
