import { errorCodeSchema, providerIdSchema, publishStateSchema } from '@relay/contracts';
import { z } from 'zod';

import type {
  PublishPostWorkflowOutput,
  PublishTargetOutcome,
  ThreadSequenceWorkflowOutput,
} from './inputs';

/**
 * Schemas for the values that cross a child workflow boundary.
 *
 * Temporal serializes a child workflow result to JSON and hands it back as an
 * unknown value. Even though both sides ship in the same deployment, a running
 * workflow can outlive a release, so a child started by yesterday's code may
 * answer today's parent. Parsing rather than casting is what keeps that safe.
 */

const publishTargetOutcomeSchema = z
  .object({
    targetId: z.string().min(1),
    connectionId: z.string().min(1),
    provider: providerIdSchema,
    state: publishStateSchema,
    externalPostId: z.string().nullable(),
    permalink: z.string().nullable(),
    receiptId: z.string().nullable(),
    attempts: z.number().int().nonnegative(),
    errorCode: errorCodeSchema.nullable(),
    messageKey: z.string().nullable(),
    failedSequenceItemIds: z.array(z.string()),
    providerCreateCalls: z.number().int().nonnegative(),
  })
  .strict();

const threadSequenceOutputSchema = z
  .object({
    rootExternalPostId: z.string().min(1),
    items: z.array(
      z
        .object({
          threadItemId: z.string().min(1),
          order: z.number().int().nonnegative(),
          kind: z.enum(['comment', 'thread']),
          state: publishStateSchema,
          externalPostId: z.string().nullable(),
          permalink: z.string().nullable(),
          publishedAt: z.string().nullable(),
          errorCode: errorCodeSchema.nullable(),
          delaySeconds: z.number().int().nonnegative(),
        })
        .strict(),
    ),
    failedCount: z.number().int().nonnegative(),
    externalCreateCount: z.number().int().nonnegative(),
  })
  .strict();

const publishPostOutputSchema = z
  .object({
    publishJobId: z.string().min(1),
    state: publishStateSchema,
    targets: z.array(publishTargetOutcomeSchema),
    externalCreateCount: z.number().int().nonnegative(),
  })
  .strict();

export function parsePublishTargetOutcome(value: unknown): PublishTargetOutcome {
  return publishTargetOutcomeSchema.parse(value);
}

export function parseThreadSequenceOutput(value: unknown): ThreadSequenceWorkflowOutput {
  return threadSequenceOutputSchema.parse(value);
}

export function parsePublishPostOutput(value: unknown): PublishPostWorkflowOutput {
  return publishPostOutputSchema.parse(value);
}
