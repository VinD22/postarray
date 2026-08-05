import {
  CALENDAR_PROPOSAL_WEEKS,
  GROWTH_PLAN_SCHEMA_VERSION,
  businessProfileSchema,
  growthPlanSchema,
  opportunityRecordSchema,
  toolRecordSchema,
} from '@relay/contracts';
import type { BusinessProfile, GrowthPlan, OpportunityRecord, ToolRecord } from '@relay/contracts';

import { FIXTURE_NOW, fixtureId, fixtureUrl } from '../ids.js';

/**
 * Growth Advisor fixtures.
 *
 * Facts and assumptions stay in separate arrays, exactly as the contract
 * requires, and nothing here references a real directory, publication, tool or
 * company. Catalog entries point at `example.test` so a fixture can never send
 * a developer, or a test, to somebody else's website.
 */

export function makeBusinessProfile(overrides: Partial<BusinessProfile> = {}): BusinessProfile {
  const workspaceId = overrides.workspaceId ?? fixtureId('workspace', 'fixture-workspace');
  return businessProfileSchema.parse({
    id: fixtureId('growthProfile', 'fixture-profile'),
    workspaceId,
    revision: 1,
    productName: 'Fixture Product',
    siteUrl: fixtureUrl('/'),
    description: 'A fixture product used to exercise the Growth Advisor contract.',
    category: 'developer_tools',
    markets: ['DE', 'US'],
    contentLocales: ['en'],
    idealCustomer: 'Small teams that publish to several social accounts each week.',
    objective: 'Increase qualified trial starts.',
    conversionEvent: 'trial_started',
    existingChannels: ['x', 'linkedin'],
    proofAssets: ['changelog', 'documentation'],
    competitors: ['fixture-competitor-a'],
    weeklyCapacityHours: 4,
    prohibitedClaims: ['guaranteed results'],
    prohibitedTopics: ['politics'],
    facts: [
      {
        id: 'fact_locale',
        statement: 'The team publishes in English only.',
        evidenceIds: ['profile_answer_locale'],
        confirmedByUser: true,
      },
    ],
    assumptions: [
      {
        id: 'assumption_cadence',
        statement: 'Four posts a week is sustainable at the stated capacity.',
        confidence: 'medium',
        needsConfirmation: true,
      },
    ],
    completenessScore: 0.82,
    confirmedAt: FIXTURE_NOW,
    createdAt: FIXTURE_NOW,
    ...overrides,
  });
}

export function makeOpportunity(overrides: Partial<OpportunityRecord> = {}): OpportunityRecord {
  const seed = overrides.name ?? 'fixture-directory';
  return opportunityRecordSchema.parse({
    id: fixtureId('opportunity', seed),
    name: 'Fixture Directory',
    category: 'directory',
    officialUrl: fixtureUrl('/directory'),
    source: 'fixture_catalog',
    audience: 'Teams evaluating publishing tools.',
    regions: ['global'],
    submissionMethod: 'form',
    rules: ['Fixture rule: one submission per product.'],
    costMinor: null,
    currency: null,
    effort: 'low',
    requiredAsset: 'a one paragraph description',
    affiliate: { isAffiliate: false, disclosureKey: null },
    state: 'active',
    lastVerifiedAt: FIXTURE_NOW,
    nextReviewAt: '2026-11-02T12:00:00.000Z',
    ...overrides,
  });
}

export function makeTool(overrides: Partial<ToolRecord> = {}): ToolRecord {
  const seed = overrides.name ?? 'fixture-tool';
  return toolRecordSchema.parse({
    id: fixtureId('tool', seed),
    name: 'Fixture Tool',
    officialUrl: fixtureUrl('/tool'),
    source: 'fixture_catalog',
    workflows: ['image_editing'],
    inputs: ['image'],
    outputs: ['image'],
    priceModel: 'fixture_free_tier',
    rules: ['Fixture rule: check the licence before publishing an output.'],
    limitations: ['Fixture limitation: no batch export.'],
    integrations: [],
    affiliate: { isAffiliate: false, disclosureKey: null },
    state: 'active',
    lastVerifiedAt: FIXTURE_NOW,
    nextReviewAt: '2026-11-02T12:00:00.000Z',
    ...overrides,
  });
}

function calendarWeeks(opportunityConnectionId: string | null) {
  return Array.from({ length: CALENDAR_PROPOSAL_WEEKS }, (_, index) => ({
    weekNumber: index + 1,
    startDate: `2026-08-${String(3 + index * 7).padStart(2, '0')}`,
    slots: [
      {
        date: `2026-08-${String(4 + index * 7).padStart(2, '0')}`,
        provider: 'linkedin' as const,
        connectionId: opportunityConnectionId,
        pillar: 'How it works',
        contentKind: 'text' as const,
        locale: 'en',
        briefSummary: 'Explain one scheduling behaviour and link the documentation.',
        ctaKey: 'growth.cta.readTheDocs',
        approvalRequired: false,
        measurementTag: `week_${index + 1}_linkedin`,
      },
      {
        date: `2026-08-${String(6 + index * 7).padStart(2, '0')}`,
        provider: 'x' as const,
        connectionId: opportunityConnectionId,
        pillar: 'What we shipped',
        contentKind: 'thread' as const,
        locale: 'en',
        briefSummary: 'Summarise the week in three short parts.',
        ctaKey: null,
        approvalRequired: false,
        measurementTag: `week_${index + 1}_x`,
      },
    ],
  }));
}

export interface MakeGrowthPlanInput {
  readonly workspaceId?: string;
  readonly profile?: BusinessProfile;
  readonly opportunity?: OpportunityRecord;
  readonly tool?: ToolRecord;
  readonly connectionId?: string | null;
}

/** A complete, schema-valid nine section plan with a four week calendar. */
export function makeGrowthPlan(input: MakeGrowthPlanInput = {}): GrowthPlan {
  const profile = input.profile ?? makeBusinessProfile();
  const opportunity = input.opportunity ?? makeOpportunity();
  const tool = input.tool ?? makeTool();
  const connectionId = input.connectionId ?? null;
  return growthPlanSchema.parse({
    id: fixtureId('growthPlan', 'fixture-plan'),
    workspaceId: input.workspaceId ?? profile.workspaceId,
    schemaVersion: GROWTH_PLAN_SCHEMA_VERSION,
    revision: 1,
    state: 'draft',
    generatedAt: FIXTURE_NOW,
    model: 'fixture-model',
    promptVersion: 'fixture-prompt-1',
    business_snapshot: {
      businessProfileId: profile.id,
      businessProfileRevision: profile.revision,
      facts: profile.facts,
      assumptions: profile.assumptions,
      missingInformation: ['No conversion baseline was supplied.'],
    },
    goals_and_metrics: {
      objective: profile.objective,
      conversionEvent: profile.conversionEvent,
      baseline: null,
      target: null,
      windowStart: '2026-08-03',
      windowEnd: '2026-08-30',
      supportingMetrics: ['impressions', 'link_clicks'],
    },
    audiences_and_channels: {
      audiences: [
        {
          name: 'Small marketing teams',
          description: 'Two to five people publishing weekly across several accounts.',
          priority: 1,
        },
      ],
      channels: [
        {
          provider: 'linkedin',
          priority: 1,
          rationale: 'The stated audience already reads long form there.',
          nativeFormats: ['text', 'document'],
          limitations: ['No native threads.'],
        },
        {
          provider: 'x',
          priority: 2,
          rationale: 'Short updates and threads reach the same audience quickly.',
          nativeFormats: ['text', 'thread'],
          limitations: ['Per operation cost applies.'],
        },
      ],
    },
    content_system: {
      pillars: [
        {
          name: 'What we shipped',
          description: 'Concrete changes, plainly described.',
          proofAssetIds: ['changelog'],
        },
        {
          name: 'How it works',
          description: 'One behaviour explained at a time.',
          proofAssetIds: ['documentation'],
        },
        {
          name: 'What went wrong',
          description: 'Incidents and what changed afterwards.',
          proofAssetIds: [],
        },
      ],
      series: [{ name: 'Release notes', cadence: 'weekly' }],
      ctaLibrary: ['growth.cta.readTheDocs', 'growth.cta.startTrial'],
      localeAdaptations: [{ locale: 'en', notes: 'Plain English, no jargon.' }],
      weeklyCadence: [
        { provider: 'linkedin', postsPerWeek: 2 },
        { provider: 'x', postsPerWeek: 3 },
      ],
    },
    ugc_plan: {
      goal: 'Collect short customer descriptions of one workflow.',
      participantProfile: 'Existing customers who publish weekly.',
      promptAngles: [
        'Show the schedule you actually run.',
        'Show one thing that used to take longer.',
        'Show how approvals work on your team.',
        'Show a post that failed and what you did.',
        'Show your favourite keyboard shortcut.',
      ],
      brief: 'One short clip or screenshot, with permission to reuse it.',
      consentChecklist: [
        'Written permission to reuse the content.',
        'Permission from anyone appearing in it.',
      ],
      incentive: null,
      disclosureKey: 'growth.ugc.disclosure',
      reviewWorkflow: 'An approver reviews every submission before it is scheduled.',
    },
    opportunities: [
      {
        opportunityId: opportunity.id,
        fitExplanation: 'The directory lists tools for the stated audience.',
        effort: 'low',
        requiredAsset: 'a one paragraph description',
        pitchDraft: 'A short, factual description of what the product does.',
        evidenceIds: ['fact_locale'],
        owner: null,
        status: 'proposed',
      },
    ],
    tool_recommendations: [
      {
        toolId: tool.id,
        taskFit: 'Crops and resizes screenshots before upload.',
        limitations: ['Fixture limitation: no batch export.'],
        lastVerifiedAt: FIXTURE_NOW,
        affiliate: { isAffiliate: false, disclosureKey: null },
      },
    ],
    calendar_proposal: calendarWeeks(connectionId),
    risks_and_unknowns: {
      unsupportedClaims: [],
      missingPermissions: ['Link click metrics need an additional scope.'],
      staleCatalogRecordIds: [],
      assumptionsRequiringConfirmation: profile.assumptions,
    },
  });
}
