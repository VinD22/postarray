import { GROWTH_PLAN_SCHEMA_VERSION, growthPlanSchema } from '@relay/contracts';
import type { BusinessProfile, GrowthPlan, OpportunityRecord, ToolRecord } from '@relay/contracts';

import { GROWTH_PLAN_FIXTURE_BODY } from './fixture';
import { buildGrowthContext } from './retrieval';
import type { GrowthPlanContext } from './retrieval';

/**
 * Deterministic builders shared by the tests in this package. Kept out of the
 * public entry point on purpose: this is test scaffolding, not product surface.
 */

export const TEST_WORKSPACE_ID = 'ws_00000000000000000000000001';
export const TEST_PROFILE_ID = 'bprof_00000000000000000000000000';
export const TEST_PLAN_ID = 'plan_00000000000000000000000002';
export const TEST_OPPORTUNITY_ID = 'opp_00000000000000000000000003';
export const TEST_TOOL_ID = 'tool_00000000000000000000000004';

export function makeBusinessProfile(overrides: Partial<BusinessProfile> = {}): BusinessProfile {
  return {
    id: TEST_PROFILE_ID,
    workspaceId: TEST_WORKSPACE_ID,
    revision: 1,
    productName: 'Relay',
    siteUrl: 'https://example.test',
    description: 'A publishing control plane for small teams.',
    category: 'software',
    markets: ['US', 'DE'],
    contentLocales: ['en'],
    idealCustomer: 'Solo social media managers.',
    objective: 'Increase qualified trial starts.',
    conversionEvent: 'Trial started from a social referral.',
    existingChannels: ['linkedin'],
    proofAssets: [],
    competitors: [],
    weeklyCapacityHours: 2,
    prohibitedClaims: [],
    prohibitedTopics: [],
    facts: [
      {
        id: 'fact_product',
        statement: 'The product schedules and publishes social posts for small teams.',
        evidenceIds: ['profile.description'],
        confirmedByUser: true,
      },
    ],
    assumptions: [
      {
        id: 'assume_buyer',
        statement: 'The buyer is the person who also writes the posts.',
        confidence: 'medium',
        needsConfirmation: true,
      },
    ],
    completenessScore: 0.8,
    confirmedAt: '2026-08-04T08:00:00Z',
    createdAt: '2026-08-01T08:00:00Z',
    ...overrides,
  };
}

export function makeOpportunity(overrides: Partial<OpportunityRecord> = {}): OpportunityRecord {
  return {
    id: TEST_OPPORTUNITY_ID,
    name: 'Example directory',
    category: 'directory',
    officialUrl: 'https://directory.example.test',
    source: 'editor review 2026-08-01',
    audience: 'Product teams',
    regions: ['US'],
    submissionMethod: 'form',
    rules: ['One submission per product.'],
    costMinor: null,
    currency: null,
    effort: 'low',
    requiredAsset: null,
    affiliate: { isAffiliate: false, disclosureKey: null },
    state: 'active',
    lastVerifiedAt: '2026-08-01T08:00:00Z',
    nextReviewAt: '2026-09-01T08:00:00Z',
    ...overrides,
  };
}

export function makeTool(overrides: Partial<ToolRecord> = {}): ToolRecord {
  return {
    id: TEST_TOOL_ID,
    name: 'Example editor',
    officialUrl: 'https://tool.example.test',
    source: 'editor review 2026-08-01',
    workflows: ['video editing'],
    inputs: ['video'],
    outputs: ['video'],
    priceModel: 'free tier plus paid plans',
    rules: ['Check the licence before commercial use.'],
    limitations: ['No batch export on the free tier.'],
    integrations: [],
    affiliate: { isAffiliate: false, disclosureKey: null },
    state: 'active',
    lastVerifiedAt: '2026-08-01T08:00:00Z',
    nextReviewAt: '2026-09-01T08:00:00Z',
    ...overrides,
  };
}

export function makePlanContext(
  options: {
    readonly profile?: BusinessProfile;
    readonly opportunities?: readonly OpportunityRecord[];
    readonly tools?: readonly ToolRecord[];
  } = {},
): GrowthPlanContext {
  return buildGrowthContext({
    profile: options.profile ?? makeBusinessProfile(),
    projectSources: [],
    opportunities: options.opportunities ?? [],
    tools: options.tools ?? [],
    windowStart: '2026-08-10',
    windowEnd: '2026-09-07',
  });
}

/** A valid plan built from the shipped fixture body plus provenance. */
export function makePlan(overrides: Partial<GrowthPlan> = {}): GrowthPlan {
  return growthPlanSchema.parse({
    ...GROWTH_PLAN_FIXTURE_BODY,
    id: TEST_PLAN_ID,
    workspaceId: TEST_WORKSPACE_ID,
    schemaVersion: GROWTH_PLAN_SCHEMA_VERSION,
    revision: 1,
    state: 'draft',
    generatedAt: '2026-08-04T09:00:00Z',
    model: 'echo-deterministic',
    promptVersion: '2026-08-04.1',
    ...overrides,
  });
}
