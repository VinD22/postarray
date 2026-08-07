import {
  growthExportFormatSchema,
  isoInstantSchema,
  opportunityCategorySchema,
} from '@relay/contracts';
import { z } from 'zod';

import {
  brandIdSchema,
  connectionIdSchema,
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
    siteUrl: z.union([z.string().trim().url().max(2048), z.literal('')]),
    description: z.string().trim().min(1).max(4000),
    category: z.string().trim().max(200),
    markets: z.array(z.string().trim().min(1).max(120)).max(100).optional(),
    contentLocales: z.array(z.string().trim().min(1).max(35)).max(25).optional(),
    idealCustomer: z.string().trim().max(4000).optional(),
    objective: z.string().trim().min(1).max(2000),
    conversionEvent: shortTextSchema.optional(),
    existingChannels: z.array(connectionIdSchema).max(10).optional(),
    proofAssets: z.array(z.string().trim().min(1).max(500)).max(100).optional(),
    competitors: z.array(z.string().trim().min(1).max(500)).max(100).optional(),
    weeklyCapacityHours: z.number().int().min(0).max(168).optional(),
    prohibitedClaims: z.array(z.string().trim().min(1).max(500)).max(100).optional(),
    prohibitedTopics: z.array(z.string().trim().min(1).max(500)).max(100).optional(),
  })
  .strict();

export const confirmBusinessProfileSchema = z
  .object({
    confirmedAssumptionIds: z.array(z.string().trim().min(1).max(128)).max(100).optional(),
    corrections: z.record(z.string().max(128), z.string().trim().min(1).max(2000)).optional(),
  })
  .strict();

export const growthPlanSummarySchema = z
  .object({
    planId: growthPlanIdSchema.nullable(),
    version: z.number().int().positive().nullable(),
    approvedAt: isoInstantSchema.nullable(),
    currentWeek: z.number().int().positive().nullable(),
    totalWeeks: z.number().int().positive().nullable(),
    undraftedBriefCount: z.number().int().nonnegative().nullable(),
    profileComplete: z.boolean(),
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
