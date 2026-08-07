import { z } from 'zod';

import { cursorQuerySchema, timeRangeSchema, timeRangeShape } from '../../common/pagination';
import { connectionIdSchema, receiptIdSchema, shortTextSchema } from '../../common/schemas';

/**
 * Analytics and experiment payloads.
 *
 * Every range is zone-qualified, because "last 7 days" is a different set of
 * posts in Auckland than in Los Angeles, and a report that silently uses the
 * server's zone is a report that disagrees with the calendar the user was
 * looking at when they asked.
 *
 * A metric we cannot read comes back as `unavailable_*`, never as zero. Zero
 * views and "the provider did not tell us" are different facts, and merging
 * them is how a dashboard talks a customer out of a channel that was working.
 */

export const accountMetricsQuerySchema = z
  .object({ connectionId: connectionIdSchema, ...timeRangeShape })
  .strict();

/** Compare either a named set of receipts, or a period against a baseline. */
export const compareRequestSchema = z
  .object({
    baseline: z.enum(['previous_period', 'trailing_median']),
    receiptIds: z.array(receiptIdSchema).min(2).max(50).optional(),
    period: timeRangeSchema.optional(),
    connectionId: connectionIdSchema.optional(),
  })
  .strict()
  .refine((value) => value.receiptIds !== undefined || value.period !== undefined, {
    error: 'RECEIPTS_OR_PERIOD_REQUIRED',
  });

export const listExperimentsQuerySchema = cursorQuerySchema;

export const createExperimentSchema = z
  .object({
    name: shortTextSchema,
    hypothesis: z.string().trim().min(1).max(2000),
    successMetric: z.string().trim().min(1).max(64),
    windowStart: timeRangeShape.from,
    windowEnd: timeRangeShape.to,
    campaignId: z.string().trim().min(1).max(128).nullable().optional(),
  })
  .strict();

export type AccountMetricsQuery = z.infer<typeof accountMetricsQuerySchema>;
export type CompareRequestInput = z.infer<typeof compareRequestSchema>;
export type CreateExperimentInput = z.infer<typeof createExperimentSchema>;
