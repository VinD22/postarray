import { z } from 'zod';

import { problemJsonSchema } from './errors.js';
import { ID_PREFIXES, idSchema } from './ids.js';
import { isoInstantSchema } from './primitives.js';
import { idempotencyKeySchema } from './publishing.js';

/** Shared REST and webhook envelopes. Every public surface speaks these shapes. */

export const API_VERSION = 'v1';
export const WEBHOOK_SCHEMA_VERSION = '2026-08-04';

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export const cursorSchema = z.string().min(1).max(512);

export const paginationQuerySchema = z
  .object({
    cursor: cursorSchema.optional(),
    limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  })
  .strict();
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const pageInfoSchema = z
  .object({
    nextCursor: cursorSchema.nullable(),
    hasMore: z.boolean(),
    limit: z.number().int().positive(),
  })
  .strict();
export type PageInfo = z.infer<typeof pageInfoSchema>;

export interface Paginated<T> {
  readonly data: readonly T[];
  readonly pageInfo: PageInfo;
}

/** Wrap any item schema in the standard cursor pagination envelope. */
export function paginatedSchema<T extends z.ZodType>(item: T) {
  return z.object({ data: z.array(item), pageInfo: pageInfoSchema }).strict();
}

/** Create, schedule, publish and cancel requests must carry an idempotency key. */
export const idempotentRequestSchema = z
  .object({ idempotencyKey: idempotencyKeySchema })
  .strict();
export type IdempotentRequest = z.infer<typeof idempotentRequestSchema>;

export const OPERATION_STATUSES = [
  'queued',
  'running',
  'succeeded',
  'failed',
  'canceled',
] as const;
export const operationStatusSchema = z.enum(OPERATION_STATUSES);
export type OperationStatus = z.infer<typeof operationStatusSchema>;

/** The handle an async endpoint returns instead of blocking on a workflow. */
export const operationRefSchema = z
  .object({
    operationId: idSchema(ID_PREFIXES.operation),
    status: operationStatusSchema,
    resourceType: z.string().min(1).nullable(),
    resourceId: z.string().min(1).nullable(),
    createdAt: isoInstantSchema,
    completedAt: isoInstantSchema.nullable(),
    error: problemJsonSchema.nullable(),
  })
  .strict();
export type OperationRef = z.infer<typeof operationRefSchema>;

export const WEBHOOK_EVENT_NAMES = [
  'connection.connected',
  'connection.action_required',
  'draft.created',
  'approval.requested',
  'approval.decided',
  'post.scheduled',
  'post.dispatching',
  'post.published',
  'post.partially_published',
  'post.failed',
  'comment.published',
  'comment.failed',
  'analytics.updated',
  'rss.item_processed',
  'rule.run_completed',
  'rule.run_failed',
  'subscription.changed',
] as const;
export const webhookEventNameSchema = z.enum(WEBHOOK_EVENT_NAMES);
export type WebhookEventName = z.infer<typeof webhookEventNameSchema>;

/**
 * Delivery envelope. Receivers verify the signature before parsing, then
 * deduplicate on `id`, which is stable across retries and redeliveries.
 */
export const webhookEnvelopeSchema = z
  .object({
    id: idSchema(ID_PREFIXES.webhookDelivery),
    type: webhookEventNameSchema,
    schemaVersion: z.literal(WEBHOOK_SCHEMA_VERSION),
    apiVersion: z.literal(API_VERSION),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    createdAt: isoInstantSchema,
    /** 1 on first delivery, incremented on every retry and manual redelivery. */
    deliveryAttempt: z.number().int().positive(),
    /** True when the receiver has already been sent this event id. */
    isRedelivery: z.boolean(),
    /** Present on test sends so a receiver never treats one as real traffic. */
    isTest: z.boolean(),
    correlationId: z.string().min(1).nullable(),
    data: z.record(z.string(), z.unknown()),
  })
  .strict();
export type WebhookEnvelope = z.infer<typeof webhookEnvelopeSchema>;

export const WEBHOOK_DELIVERY_STATUSES = [
  'pending',
  'succeeded',
  'failed',
  'exhausted',
  'disabled',
] as const;
export const webhookDeliveryStatusSchema = z.enum(WEBHOOK_DELIVERY_STATUSES);
export type WebhookDeliveryStatus = z.infer<typeof webhookDeliveryStatusSchema>;

export const webhookDeliveryLogSchema = z
  .object({
    id: idSchema(ID_PREFIXES.webhookDelivery),
    endpointId: idSchema(ID_PREFIXES.webhookEndpoint),
    eventName: webhookEventNameSchema,
    status: webhookDeliveryStatusSchema,
    attempt: z.number().int().positive(),
    responseStatus: z.number().int().nullable(),
    responseBodyExcerpt: z.string().nullable(),
    requestedAt: isoInstantSchema,
    completedAt: isoInstantSchema.nullable(),
    nextAttemptAt: isoInstantSchema.nullable(),
  })
  .strict();
export type WebhookDeliveryLog = z.infer<typeof webhookDeliveryLogSchema>;

export const webhookEndpointSchema = z
  .object({
    id: idSchema(ID_PREFIXES.webhookEndpoint),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    url: z.string().min(1),
    events: z.array(webhookEventNameSchema).min(1),
    /** Empty means every connection in the workspace. */
    connectionIds: z.array(idSchema(ID_PREFIXES.connection)),
    enabled: z.boolean(),
    signingSecretVersion: z.number().int().positive(),
    createdAt: isoInstantSchema,
    lastSuccessAt: isoInstantSchema.nullable(),
    lastFailureAt: isoInstantSchema.nullable(),
    consecutiveFailures: z.number().int().nonnegative(),
  })
  .strict();
export type WebhookEndpoint = z.infer<typeof webhookEndpointSchema>;

/** Standard headers the API and webhooks rely on. */
export const API_HEADERS = {
  idempotencyKey: 'idempotency-key',
  correlationId: 'x-relay-correlation-id',
  apiVersion: 'x-relay-api-version',
  webhookId: 'x-relay-webhook-id',
  webhookSignature: 'x-relay-signature',
  webhookTimestamp: 'x-relay-timestamp',
  rateLimitRemaining: 'x-ratelimit-remaining',
  rateLimitReset: 'x-ratelimit-reset',
} as const;

export const PROBLEM_JSON_CONTENT_TYPE = 'application/problem+json';

/** Build an empty page, used by every list endpoint's empty state. */
export function emptyPage<T>(limit: number = DEFAULT_PAGE_SIZE): Paginated<T> {
  return { data: [], pageInfo: { nextCursor: null, hasMore: false, limit } };
}
