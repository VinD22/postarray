import { z } from 'zod';

import {
  PUBLISH_STATES,
  accountTypeSchema,
  approvalStateSchema,
  creationSurfaceSchema,
  errorClassSchema,
  providerIdSchema,
  publishStateSchema,
} from './enums';
import type { PublishState } from './enums';
import { errorCodeSchema } from './errors';
import { ID_PREFIXES, idSchema } from './ids';
import {
  checksumSchema,
  currencyCodeSchema,
  ianaTimeZoneSchema,
  isoInstantSchema,
  localDateTimeSchema,
} from './primitives';
import { threadItemKindSchema } from './content';

/**
 * Publishing state, attempts and receipts.
 *
 * A campaign is `partially_published` when one target produced an external post
 * and another did not. A successful target is never rolled back and the whole
 * campaign is never labelled failed while external posts exist.
 */

/** The only allowed transitions. Anything else is a bug, not a business case. */
export const PUBLISH_TRANSITIONS: Readonly<Record<PublishState, readonly PublishState[]>> =
  Object.freeze({
    draft: ['validation_needed', 'approval_requested', 'scheduled', 'canceled'],
    validation_needed: ['draft', 'approval_requested', 'scheduled', 'canceled'],
    approval_requested: ['approved', 'draft', 'validation_needed', 'canceled'],
    approved: ['scheduled', 'preparing_media', 'dispatching', 'draft', 'canceled'],
    scheduled: ['preparing_media', 'dispatching', 'validation_needed', 'canceled'],
    preparing_media: [
      'dispatching',
      'action_required',
      'retry_scheduled',
      'failed_permanently',
      'canceled',
    ],
    dispatching: [
      'provider_processing',
      'published',
      'partially_published',
      'action_required',
      'retry_scheduled',
      'failed_permanently',
    ],
    provider_processing: [
      'published',
      'partially_published',
      'action_required',
      'retry_scheduled',
      'failed_permanently',
    ],
    published: ['partially_published', 'deleted_externally'],
    partially_published: [
      'published',
      'retry_scheduled',
      'action_required',
      'failed_permanently',
      'deleted_externally',
    ],
    action_required: [
      'scheduled',
      'dispatching',
      'retry_scheduled',
      'failed_permanently',
      'canceled',
    ],
    retry_scheduled: [
      'preparing_media',
      'dispatching',
      'action_required',
      'failed_permanently',
      'canceled',
    ],
    failed_permanently: [],
    canceled: [],
    deleted_externally: [],
  });

/** States with no outgoing edge. A job in one of these is finished forever. */
export const TERMINAL_PUBLISH_STATES: readonly PublishState[] = Object.freeze([
  'failed_permanently',
  'canceled',
  'deleted_externally',
]);

/** States in which an external post already exists. */
export const EXTERNALLY_VISIBLE_PUBLISH_STATES: readonly PublishState[] = Object.freeze([
  'published',
  'partially_published',
  'deleted_externally',
]);

export function isTerminal(state: PublishState): boolean {
  return TERMINAL_PUBLISH_STATES.includes(state);
}

export function nextStates(state: PublishState): readonly PublishState[] {
  return PUBLISH_TRANSITIONS[state];
}

export function canTransition(from: PublishState, to: PublishState): boolean {
  return PUBLISH_TRANSITIONS[from].includes(to);
}

/** The state a campaign takes given the states of its targets. */
export function rollUpCampaignState(targetStates: readonly PublishState[]): PublishState {
  if (targetStates.length === 0) {
    return 'draft';
  }
  const published = targetStates.filter((state) => state === 'published').length;
  const finishedBadly = targetStates.filter(
    (state) => state === 'failed_permanently' || state === 'canceled',
  ).length;
  if (published > 0 && published < targetStates.length) {
    return 'partially_published';
  }
  if (published === targetStates.length) {
    return 'published';
  }
  if (finishedBadly === targetStates.length) {
    return 'failed_permanently';
  }
  const firstUnfinished = targetStates.find((state) => !isTerminal(state));
  return firstUnfinished ?? 'failed_permanently';
}

/**
 * Idempotency keys. A create, schedule or publish request must carry one. The
 * key is unique per workspace, and replaying it with a different body is a
 * conflict rather than a second external post.
 */
export const IDEMPOTENCY_KEY_MIN_LENGTH = 8;
export const IDEMPOTENCY_KEY_MAX_LENGTH = 255;
export const IDEMPOTENCY_RETENTION_SECONDS = 60 * 60 * 24;

export const idempotencyKeySchema = z
  .string()
  .min(IDEMPOTENCY_KEY_MIN_LENGTH)
  .max(IDEMPOTENCY_KEY_MAX_LENGTH)
  .regex(/^[A-Za-z0-9_.:-]+$/, { error: 'INVALID_IDEMPOTENCY_KEY' });
export type IdempotencyKey = z.infer<typeof idempotencyKeySchema>;

export const idempotencyRecordSchema = z
  .object({
    workspaceId: idSchema(ID_PREFIXES.workspace),
    key: idempotencyKeySchema,
    /** Checksum of the canonical request body the key was first used with. */
    requestFingerprint: checksumSchema,
    operationId: idSchema(ID_PREFIXES.operation).nullable(),
    createdAt: isoInstantSchema,
    expiresAt: isoInstantSchema,
  })
  .strict();
export type IdempotencyRecord = z.infer<typeof idempotencyRecordSchema>;

/** A replay with a different body must be rejected, never silently accepted. */
export function isIdempotencyMismatch(
  stored: IdempotencyRecord,
  incomingFingerprint: string,
): boolean {
  return stored.requestFingerprint !== incomingFingerprint;
}

export const publishAttemptSchema = z
  .object({
    id: idSchema(ID_PREFIXES.publishAttempt),
    publishJobId: idSchema(ID_PREFIXES.publishJob),
    attemptNumber: z.number().int().positive(),
    startedAt: isoInstantSchema,
    finishedAt: isoInstantSchema.nullable(),
    resultState: publishStateSchema,
    errorClass: errorClassSchema.nullable(),
    errorCode: errorCodeSchema.nullable(),
    retryable: z.boolean(),
    nextRetryAt: isoInstantSchema.nullable(),
    providerRequestId: z.string().nullable(),
    httpStatus: z.number().int().nullable(),
    /** Provider response with tokens, headers and payloads already stripped. */
    sanitizedResponse: z.record(z.string(), z.unknown()),
  })
  .strict();
export type PublishAttempt = z.infer<typeof publishAttemptSchema>;

export const publishJobSchema = z
  .object({
    id: idSchema(ID_PREFIXES.publishJob),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    contentItemId: idSchema(ID_PREFIXES.contentItem),
    contentVersionId: idSchema(ID_PREFIXES.contentVersion),
    postVariantId: idSchema(ID_PREFIXES.postVariant),
    connectionId: idSchema(ID_PREFIXES.connection),
    provider: providerIdSchema,
    state: publishStateSchema,
    scheduledInstant: isoInstantSchema,
    scheduledLocalTime: localDateTimeSchema,
    ianaTimeZone: ianaTimeZoneSchema,
    idempotencyKey: idempotencyKeySchema,
    temporalWorkflowId: z.string().min(1),
    approvalRequired: z.boolean(),
    approvalState: approvalStateSchema,
    capabilityVersion: z.string().min(1),
    createdVia: creationSurfaceSchema,
    attemptCount: z.number().int().nonnegative(),
    lastErrorCode: errorCodeSchema.nullable(),
    createdAt: isoInstantSchema,
    updatedAt: isoInstantSchema,
    canceledAt: isoInstantSchema.nullable(),
  })
  .strict()
  .superRefine((job, ctx) => {
    if (job.approvalRequired && job.approvalState !== 'approved') {
      const dispatched: readonly PublishState[] = [
        'preparing_media',
        'dispatching',
        'provider_processing',
        'published',
        'partially_published',
      ];
      if (dispatched.includes(job.state)) {
        ctx.addIssue({ code: 'custom', path: ['state'], message: 'APPROVAL_NOT_SATISFIED' });
      }
    }
  });
export type PublishJob = z.infer<typeof publishJobSchema>;

export const receiptItemSchema = z
  .object({
    kind: z.union([z.literal('root'), threadItemKindSchema]),
    order: z.number().int().nonnegative(),
    threadItemId: idSchema(ID_PREFIXES.comment).nullable(),
    state: publishStateSchema,
    externalPostId: z.string().nullable(),
    permalink: z.string().nullable(),
    delaySeconds: z.number().int().nonnegative(),
    publishedAt: isoInstantSchema.nullable(),
    errorCode: errorCodeSchema.nullable(),
  })
  .strict();
export type ReceiptItem = z.infer<typeof receiptItemSchema>;

export const receiptApprovalSchema = z
  .object({
    state: approvalStateSchema,
    approvalId: idSchema(ID_PREFIXES.approval).nullable(),
    decidedBy: z.string().nullable(),
    decidedAt: isoInstantSchema.nullable(),
    policyKey: z.string().nullable(),
  })
  .strict();
export type ReceiptApproval = z.infer<typeof receiptApprovalSchema>;

export const receiptCostSchema = z
  .object({
    currency: currencyCodeSchema,
    estimatedMinor: z.number().int().nonnegative(),
    actualMinor: z.number().int().nonnegative().nullable(),
    reconciledAt: isoInstantSchema.nullable(),
  })
  .strict();
export type ReceiptCost = z.infer<typeof receiptCostSchema>;

/**
 * Immutable evidence of one external publication. `published` requires an
 * external id or equivalent provider evidence, not merely a 2xx from a media
 * container step.
 */
export const publicationReceiptSchema = z
  .object({
    id: idSchema(ID_PREFIXES.receipt),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    publishJobId: idSchema(ID_PREFIXES.publishJob),
    provider: providerIdSchema,
    accountType: accountTypeSchema,
    connectionId: idSchema(ID_PREFIXES.connection),
    externalAccountId: z.string().min(1),
    externalPostId: z.string().min(1),
    permalink: z.string().nullable(),
    contentVersionId: idSchema(ID_PREFIXES.contentVersion),
    contentVersionChecksum: checksumSchema,
    capabilityVersion: z.string().min(1),
    scheduledLocalTime: localDateTimeSchema,
    ianaTimeZone: ianaTimeZoneSchema,
    scheduledInstant: isoInstantSchema,
    dispatchedAt: isoInstantSchema,
    publishedAt: isoInstantSchema,
    creationSurface: creationSurfaceSchema,
    approval: receiptApprovalSchema,
    cost: receiptCostSchema.nullable(),
    attempts: z.array(publishAttemptSchema),
    sanitizedProviderResponse: z.record(z.string(), z.unknown()),
    root: receiptItemSchema,
    items: z.array(receiptItemSchema),
    lastAnalyticsSyncAt: isoInstantSchema.nullable(),
    createdAt: isoInstantSchema,
  })
  .strict();
export type PublicationReceipt = z.infer<typeof publicationReceiptSchema>;

/** Every state, for exhaustiveness checks in consumers. */
export const ALL_PUBLISH_STATES: readonly PublishState[] = PUBLISH_STATES;

/**
 * A hold on a scheduled job.
 *
 * A hold is deliberately not a `PublishState`. The state machine above answers
 * "where is this job in its lifecycle"; a hold answers "who stopped the clock,
 * and why". Modelling it as a state would have forced a second `scheduled`-like
 * node with the same outgoing edges, and would have made the two reasons below
 * indistinguishable the moment they overlapped.
 *
 * `billing` is set by the entitlement path when a workspace loses full access
 * (`scheduledPostDisposition` in `@relay/billing` returns `pause_by_billing`).
 * `user` is set by a person from the calendar. They must stay distinguishable:
 * resuming a billing hold is a payment problem, not a scheduling one, and no
 * amount of clicking Resume should clear it.
 */
export const PUBLISH_HOLD_REASONS = ['user', 'billing'] as const;
export const publishHoldReasonSchema = z.enum(PUBLISH_HOLD_REASONS);
export type PublishHoldReason = z.infer<typeof publishHoldReasonSchema>;

export const publishHoldSchema = z
  .object({
    reason: publishHoldReasonSchema,
    since: isoInstantSchema,
    /** Null when the hold was applied by the system rather than by a person. */
    byUserId: idSchema(ID_PREFIXES.user).nullable(),
  })
  .strict();
export type PublishHold = z.infer<typeof publishHoldSchema>;

/**
 * States in which stopping the clock still means something.
 *
 * Everything else is either already outside our control or already finished.
 * A job that is `preparing_media`, `dispatching` or `provider_processing` owns
 * an in-flight external side effect and is never paused; a job that already
 * published is never un-published.
 */
export const PAUSABLE_PUBLISH_STATES: readonly PublishState[] = Object.freeze([
  'validation_needed',
  'approval_requested',
  'approved',
  'scheduled',
  'action_required',
  'retry_scheduled',
]);

/** Why a pause was refused, or null when it is allowed. */
export type PauseRefusal = 'already_published' | 'in_flight' | 'terminal';

export function pauseRefusal(state: PublishState): PauseRefusal | null {
  if (EXTERNALLY_VISIBLE_PUBLISH_STATES.includes(state)) {
    return 'already_published';
  }
  if (isTerminal(state)) {
    return 'terminal';
  }
  return PAUSABLE_PUBLISH_STATES.includes(state) ? null : 'in_flight';
}

export function canPause(state: PublishState): boolean {
  return pauseRefusal(state) === null;
}
