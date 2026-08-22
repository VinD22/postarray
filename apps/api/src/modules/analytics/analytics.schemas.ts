import { z } from 'zod';

import { contentKindSchema, isoInstantSchema, normalizedMetricNameSchema } from '@relay/contracts';

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

/**
 * The overview read.
 *
 * `connectionIds` arrives as one comma separated parameter rather than a
 * repeated key: repeated query keys are the least portable thing in HTTP and
 * this endpoint is called from five surfaces. An empty list means every
 * connected account in scope, which is what the screen asks for on first load.
 */
export const overviewQuerySchema = z
  .object({
    projectId: z.string().trim().min(1).max(128).optional(),
    connectionIds: z
      .string()
      .trim()
      .optional()
      .transform((value) =>
        value === undefined || value.length === 0
          ? []
          : value
              .split(',')
              .map((entry) => entry.trim())
              .filter((entry) => entry.length > 0),
      ),
    from: isoInstantSchema,
    to: isoInstantSchema,
    metric: normalizedMetricNameSchema,
    contentKind: contentKindSchema.optional(),
  })
  .strict();

export const metricSeriesQuerySchema = z
  .object({
    metric: normalizedMetricNameSchema,
    from: isoInstantSchema,
    to: isoInstantSchema,
  })
  .strict();

/** The path-parameter form of the account read. `?connectionId=` also works. */
export const accountRangeQuerySchema = z
  .object({
    from: isoInstantSchema,
    to: isoInstantSchema,
    ianaTimeZone: timeRangeShape.ianaTimeZone.optional(),
  })
  .strict();

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

export type OverviewQuery = z.infer<typeof overviewQuerySchema>;
export type MetricSeriesQuery = z.infer<typeof metricSeriesQuerySchema>;
export type AccountRangeQuery = z.infer<typeof accountRangeQuerySchema>;
export type AccountMetricsQuery = z.infer<typeof accountMetricsQuerySchema>;
export type CompareRequestInput = z.infer<typeof compareRequestSchema>;
export type CreateExperimentInput = z.infer<typeof createExperimentSchema>;
