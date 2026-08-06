import {
  growthExportFormatSchema,
  isoInstantSchema,
  opportunityCategorySchema,
} from '@relay/contracts';
import { z } from 'zod';

import {
  brandIdSchema,
  growthPlanIdSchema,
  growthProfileIdSchema,
  shortTextSchema,
} from '../../common/schemas';

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
    profileId: growthProfileIdSchema.optional(),
    brandId: brandIdSchema,
    productName: shortTextSchema,
    siteUrl: z.string().trim().url().max(2048),
    description: z.string().trim().min(1).max(4000),
    category: shortTextSchema,
    markets: z.array(z.string().trim().min(1).max(120)).max(100).optional(),
    contentLocales: z.array(z.string().trim().min(1).max(35)).max(25).optional(),
    objective: z.string().trim().min(1).max(2000),
    conversionEvent: shortTextSchema.optional(),
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
