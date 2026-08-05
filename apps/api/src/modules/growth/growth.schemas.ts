import {
  growthExportFormatSchema,
  isoInstantSchema,
  opportunityCategorySchema,
} from '@relay/contracts';
import { z } from 'zod';

import {
  growthPlanIdSchema,
  growthProfileIdSchema,
  passthroughObjectSchema,
  shortTextSchema,
} from '../../common/schemas.js';

/**
 * Growth Advisor payloads.
 *
 * Two boundaries this module exists to hold.
 *
 * First, plan generation is asynchronous and returns an operation handle. A
 * model call that can take thirty seconds must not be an HTTP request a client
 * waits on, because a timeout then looks the same as a failure.
 *
 * Second, nothing here submits anything anywhere. The advisor produces a plan
 * and a set of catalog-backed opportunities. Converting a plan item into a
 * draft or a calendar proposal is an explicit, per-item act by a person, under
 * the normal scopes and the normal approval policy. There is no route that
 * bulk-submits listings, generates backlinks or schedules a strategy on
 * someone's behalf.
 */

export const businessProfileInputSchema = z
  .object({
    name: shortTextSchema,
    /** What the business does, in the owner's own words. */
    summary: z.string().trim().min(1).max(4000),
    audience: z.string().trim().min(1).max(2000),
    region: z.string().trim().min(1).max(120),
    /** Structured intake answers. Validated in full by the growth service. */
    answers: passthroughObjectSchema.default({}),
  })
  .strict();

export const generatePlanSchema = z.object({ profileId: growthProfileIdSchema }).strict();

export const exportPlanQuerySchema = z.object({ format: growthExportFormatSchema }).strict();

export const planItemSchema = z
  .object({ planId: growthPlanIdSchema, itemId: z.string().trim().min(1).max(128) })
  .strict();

export const listOpportunitiesQuerySchema = z
  .object({
    category: opportunityCategorySchema.optional(),
    region: z.string().trim().min(1).max(120).optional(),
    /** Only records verified since this instant. Staleness is visible, not hidden. */
    verifiedAfter: isoInstantSchema.optional(),
  })
  .strict();

export const listToolsQuerySchema = z
  .object({
    workflow: z.string().trim().min(1).max(120).optional(),
    verifiedAfter: isoInstantSchema.optional(),
  })
  .strict();

export type BusinessProfileInput = z.infer<typeof businessProfileInputSchema>;
