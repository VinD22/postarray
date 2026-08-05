import { z } from 'zod';

import { catalogStateSchema, contentKindSchema, providerIdSchema } from './enums';
import { ID_PREFIXES, idSchema } from './ids';
import {
  currencyCodeSchema,
  httpsUrlSchema,
  isoDateSchema,
  isoInstantSchema,
  localeSchema,
} from './primitives';

/**
 * The Growth Advisor contract. One versioned schema serves the UI, the API, MCP
 * and the Markdown, JSON and YAML exports.
 *
 * Facts and assumptions are separate arrays. The model never promotes an
 * assumption into a fact, and it returns catalog ids rather than free URLs, so a
 * deterministic post-processor can reject anything it invented.
 */

export const GROWTH_PLAN_SCHEMA_VERSION = '2026-08-04';

/** V1 result caps. They are enforced by the schema, not only by the prompt. */
export const MAX_OPPORTUNITIES = 10;
export const MAX_TOOL_RECOMMENDATIONS = 5;
export const CALENDAR_PROPOSAL_WEEKS = 4;

export const factSchema = z
  .object({
    id: z.string().min(1),
    statement: z.string().min(1),
    /** Where the user or an approved source confirmed this. */
    evidenceIds: z.array(z.string().min(1)).min(1),
    confirmedByUser: z.literal(true),
  })
  .strict();
export type Fact = z.infer<typeof factSchema>;

export const assumptionSchema = z
  .object({
    id: z.string().min(1),
    statement: z.string().min(1),
    confidence: z.enum(['low', 'medium', 'high']),
    needsConfirmation: z.boolean(),
  })
  .strict();
export type Assumption = z.infer<typeof assumptionSchema>;

export const businessProfileSchema = z
  .object({
    id: idSchema(ID_PREFIXES.growthProfile),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    revision: z.number().int().positive(),
    productName: z.string().min(1),
    siteUrl: httpsUrlSchema,
    description: z.string().min(1),
    category: z.string().min(1),
    markets: z.array(z.string().min(1)),
    contentLocales: z.array(localeSchema).min(1),
    idealCustomer: z.string().min(1),
    objective: z.string().min(1),
    conversionEvent: z.string().min(1),
    existingChannels: z.array(providerIdSchema),
    proofAssets: z.array(z.string().min(1)),
    competitors: z.array(z.string().min(1)),
    weeklyCapacityHours: z.number().int().nonnegative(),
    prohibitedClaims: z.array(z.string().min(1)),
    prohibitedTopics: z.array(z.string().min(1)),
    facts: z.array(factSchema),
    assumptions: z.array(assumptionSchema),
    completenessScore: z.number().min(0).max(1),
    confirmedAt: isoInstantSchema.nullable(),
    createdAt: isoInstantSchema,
  })
  .strict();
export type BusinessProfile = z.infer<typeof businessProfileSchema>;

export const affiliateDisclosureSchema = z
  .object({
    isAffiliate: z.boolean(),
    disclosureKey: z.string().min(1).nullable(),
  })
  .strict();
export type AffiliateDisclosure = z.infer<typeof affiliateDisclosureSchema>;

export const OPPORTUNITY_CATEGORIES = [
  'directory',
  'community',
  'publication',
  'launch',
  'partner',
  'integration',
  'event',
] as const;
export const opportunityCategorySchema = z.enum(OPPORTUNITY_CATEGORIES);
export type OpportunityCategory = z.infer<typeof opportunityCategorySchema>;

export const SUBMISSION_METHODS = ['form', 'email', 'account', 'api', 'manual_review'] as const;
export const submissionMethodSchema = z.enum(SUBMISSION_METHODS);
export type SubmissionMethod = z.infer<typeof submissionMethodSchema>;

/**
 * A curated record. Nothing becomes customer visible until an administrator has
 * verified the URL and the rules, so `officialUrl` and `lastVerifiedAt` are
 * required and `source` records where the entry came from.
 */
export const opportunityRecordSchema = z
  .object({
    id: idSchema(ID_PREFIXES.opportunity),
    name: z.string().min(1),
    category: opportunityCategorySchema,
    officialUrl: httpsUrlSchema,
    source: z.string().min(1),
    audience: z.string().min(1),
    regions: z.array(z.string().min(1)),
    submissionMethod: submissionMethodSchema,
    /** The site's own submission and self promotion rules, quoted verbatim. */
    rules: z.array(z.string().min(1)).min(1),
    costMinor: z.number().int().nonnegative().nullable(),
    currency: currencyCodeSchema.nullable(),
    effort: z.enum(['low', 'medium', 'high']),
    requiredAsset: z.string().min(1).nullable(),
    affiliate: affiliateDisclosureSchema,
    state: catalogStateSchema,
    lastVerifiedAt: isoInstantSchema,
    nextReviewAt: isoInstantSchema,
  })
  .strict();
export type OpportunityRecord = z.infer<typeof opportunityRecordSchema>;

export const toolRecordSchema = z
  .object({
    id: idSchema(ID_PREFIXES.tool),
    name: z.string().min(1),
    officialUrl: httpsUrlSchema,
    source: z.string().min(1),
    workflows: z.array(z.string().min(1)).min(1),
    inputs: z.array(z.string().min(1)),
    outputs: z.array(z.string().min(1)),
    priceModel: z.string().min(1),
    /** Rights, privacy and licensing caveats, quoted from the vendor. */
    rules: z.array(z.string().min(1)).min(1),
    limitations: z.array(z.string().min(1)),
    integrations: z.array(z.string().min(1)),
    affiliate: affiliateDisclosureSchema,
    state: catalogStateSchema,
    lastVerifiedAt: isoInstantSchema,
    nextReviewAt: isoInstantSchema,
  })
  .strict();
export type ToolRecord = z.infer<typeof toolRecordSchema>;

const businessSnapshotSchema = z
  .object({
    businessProfileId: idSchema(ID_PREFIXES.growthProfile),
    businessProfileRevision: z.number().int().positive(),
    facts: z.array(factSchema),
    assumptions: z.array(assumptionSchema),
    missingInformation: z.array(z.string().min(1)),
  })
  .strict();

const goalsAndMetricsSchema = z
  .object({
    objective: z.string().min(1),
    conversionEvent: z.string().min(1),
    baseline: z.number().nullable(),
    target: z.number().nullable(),
    windowStart: isoDateSchema,
    windowEnd: isoDateSchema,
    supportingMetrics: z.array(z.string().min(1)),
  })
  .strict();

const channelPlanSchema = z
  .object({
    provider: providerIdSchema,
    priority: z.number().int().positive(),
    rationale: z.string().min(1),
    nativeFormats: z.array(contentKindSchema).min(1),
    limitations: z.array(z.string().min(1)),
  })
  .strict();

const audiencesAndChannelsSchema = z
  .object({
    audiences: z
      .array(
        z
          .object({
            name: z.string().min(1),
            description: z.string().min(1),
            priority: z.number().int().positive(),
          })
          .strict(),
      )
      .min(1),
    channels: z.array(channelPlanSchema).min(1),
  })
  .strict();

const contentSystemSchema = z
  .object({
    pillars: z
      .array(
        z
          .object({
            name: z.string().min(1),
            description: z.string().min(1),
            proofAssetIds: z.array(z.string().min(1)),
          })
          .strict(),
      )
      .min(3)
      .max(5),
    series: z.array(z.object({ name: z.string().min(1), cadence: z.string().min(1) }).strict()),
    ctaLibrary: z.array(z.string().min(1)).min(1),
    localeAdaptations: z.array(
      z.object({ locale: localeSchema, notes: z.string().min(1) }).strict(),
    ),
    weeklyCadence: z
      .array(
        z
          .object({ provider: providerIdSchema, postsPerWeek: z.number().int().positive() })
          .strict(),
      )
      .min(1),
  })
  .strict();

const ugcPlanSchema = z
  .object({
    goal: z.string().min(1),
    participantProfile: z.string().min(1),
    promptAngles: z.array(z.string().min(1)).min(5).max(5),
    brief: z.string().min(1),
    consentChecklist: z.array(z.string().min(1)).min(1),
    incentive: z.string().nullable(),
    disclosureKey: z.string().min(1),
    reviewWorkflow: z.string().min(1),
  })
  .strict();

const opportunityMatchSchema = z
  .object({
    opportunityId: idSchema(ID_PREFIXES.opportunity),
    fitExplanation: z.string().min(1),
    effort: z.enum(['low', 'medium', 'high']),
    requiredAsset: z.string().min(1).nullable(),
    pitchDraft: z.string().min(1),
    evidenceIds: z.array(z.string().min(1)),
    owner: z.string().nullable(),
    status: z.enum(['proposed', 'accepted', 'dismissed', 'done']),
  })
  .strict();

const toolRecommendationSchema = z
  .object({
    toolId: idSchema(ID_PREFIXES.tool),
    taskFit: z.string().min(1),
    limitations: z.array(z.string().min(1)),
    lastVerifiedAt: isoInstantSchema,
    affiliate: affiliateDisclosureSchema,
  })
  .strict();

const calendarSlotSchema = z
  .object({
    date: isoDateSchema,
    provider: providerIdSchema,
    connectionId: idSchema(ID_PREFIXES.connection).nullable(),
    pillar: z.string().min(1),
    contentKind: contentKindSchema,
    locale: localeSchema,
    briefSummary: z.string().min(1),
    ctaKey: z.string().min(1).nullable(),
    approvalRequired: z.boolean(),
    measurementTag: z.string().min(1),
  })
  .strict();

const calendarWeekSchema = z
  .object({
    weekNumber: z.number().int().min(1).max(CALENDAR_PROPOSAL_WEEKS),
    startDate: isoDateSchema,
    slots: z.array(calendarSlotSchema),
  })
  .strict();

const risksAndUnknownsSchema = z
  .object({
    unsupportedClaims: z.array(z.string().min(1)),
    missingPermissions: z.array(z.string().min(1)),
    staleCatalogRecordIds: z.array(z.string().min(1)),
    assumptionsRequiringConfirmation: z.array(assumptionSchema),
  })
  .strict();

/** Exactly nine sections, in a stable order, with the V1 caps applied. */
export const growthPlanSchema = z
  .object({
    id: idSchema(ID_PREFIXES.growthPlan),
    workspaceId: idSchema(ID_PREFIXES.workspace),
    schemaVersion: z.literal(GROWTH_PLAN_SCHEMA_VERSION),
    revision: z.number().int().positive(),
    state: z.enum(['draft', 'approved', 'superseded']),
    generatedAt: isoInstantSchema,
    model: z.string().min(1),
    promptVersion: z.string().min(1),
    business_snapshot: businessSnapshotSchema,
    goals_and_metrics: goalsAndMetricsSchema,
    audiences_and_channels: audiencesAndChannelsSchema,
    content_system: contentSystemSchema,
    ugc_plan: ugcPlanSchema,
    opportunities: z.array(opportunityMatchSchema).max(MAX_OPPORTUNITIES),
    tool_recommendations: z.array(toolRecommendationSchema).max(MAX_TOOL_RECOMMENDATIONS),
    calendar_proposal: z.array(calendarWeekSchema).length(CALENDAR_PROPOSAL_WEEKS),
    risks_and_unknowns: risksAndUnknownsSchema,
  })
  .strict()
  .superRefine((plan, ctx) => {
    const factIds = new Set(plan.business_snapshot.facts.map((fact) => fact.id));
    for (const assumption of plan.business_snapshot.assumptions) {
      if (factIds.has(assumption.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['business_snapshot', 'assumptions'],
          message: 'FACT_AND_ASSUMPTION_ID_COLLISION',
        });
      }
    }
    const weekNumbers = plan.calendar_proposal.map((week) => week.weekNumber).sort();
    const expected = Array.from({ length: CALENDAR_PROPOSAL_WEEKS }, (_, index) => index + 1);
    if (weekNumbers.join(',') !== expected.join(',')) {
      ctx.addIssue({
        code: 'custom',
        path: ['calendar_proposal'],
        message: 'CALENDAR_WEEKS_MUST_BE_1_TO_4',
      });
    }
  });
export type GrowthPlan = z.infer<typeof growthPlanSchema>;

export const GROWTH_PLAN_SECTIONS = [
  'business_snapshot',
  'goals_and_metrics',
  'audiences_and_channels',
  'content_system',
  'ugc_plan',
  'opportunities',
  'tool_recommendations',
  'calendar_proposal',
  'risks_and_unknowns',
] as const;
export type GrowthPlanSection = (typeof GROWTH_PLAN_SECTIONS)[number];

export const GROWTH_EXPORT_FORMATS = ['markdown', 'json', 'yaml'] as const;
export const growthExportFormatSchema = z.enum(GROWTH_EXPORT_FORMATS);
export type GrowthExportFormat = z.infer<typeof growthExportFormatSchema>;

/** True when every referenced catalog id is present and active. */
export function referencedCatalogIds(plan: GrowthPlan): {
  opportunityIds: string[];
  toolIds: string[];
} {
  return {
    opportunityIds: plan.opportunities.map((match) => match.opportunityId),
    toolIds: plan.tool_recommendations.map((recommendation) => recommendation.toolId),
  };
}

/** A catalog record is publishable to customers only in the `active` state. */
export function isCustomerVisible(record: OpportunityRecord | ToolRecord): boolean {
  return record.state === 'active';
}
