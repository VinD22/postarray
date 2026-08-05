/**
 * A seeded plan used by the export tests and by the export preview before the
 * server responds. It is realistic sample content for one fictional workspace,
 * never a customer, a real product claim or an invented metric.
 */

import { GROWTH_PLAN_SCHEMA_VERSION, type GrowthPlan } from '@relay/contracts';

export const SAMPLE_PLAN: GrowthPlan = {
  id: 'plan_01j8f7q2r5v3n9k4m6p8t2w0xy',
  workspaceId: 'ws_01j8f7q2r5v3n9k4m6p8t2w0xz',
  schemaVersion: GROWTH_PLAN_SCHEMA_VERSION,
  revision: 3,
  state: 'draft',
  generatedAt: '2026-08-04T09:00:00.000Z',
  model: 'deepseek-chat',
  promptVersion: 'growth-plan-2026-08-01',
  business_snapshot: {
    businessProfileId: 'bprof_01j8f7q2r5v3n9k4m6p8t2w0y2',
    businessProfileRevision: 2,
    facts: [
      {
        id: 'fact_category',
        statement: 'Scheduling tool for teams that publish in English and German.',
        evidenceIds: ['intake_description'],
        confirmedByUser: true,
      },
      {
        id: 'fact_conversion',
        statement: 'The conversion event is a workspace signup.',
        evidenceIds: ['intake_conversion'],
        confirmedByUser: true,
      },
    ],
    assumptions: [
      {
        id: 'assume_buyer',
        statement: 'Buyers are operations leads at teams of 10 to 50 people.',
        confidence: 'medium',
        needsConfirmation: true,
      },
    ],
    missingInformation: ['No approved customer proof on file.'],
  },
  goals_and_metrics: {
    objective: 'Thirty signups a month attributed to social, measured by UTM campaign.',
    conversionEvent: 'workspace_signup',
    baseline: null,
    target: 30,
    windowStart: '2026-08-10',
    windowEnd: '2026-09-06',
    supportingMetrics: ['profile clicks', 'tracked link clicks'],
  },
  audiences_and_channels: {
    audiences: [
      {
        name: 'Operations leads',
        description: 'Own the publishing calendar and answer for failures.',
        priority: 1,
      },
      {
        name: 'Developers building on the API',
        description: 'Evaluate the MCP server and the CLI before the team does.',
        priority: 2,
      },
    ],
    channels: [
      {
        provider: 'linkedin',
        priority: 1,
        rationale: 'The buyer is present and document posts suit a proof led pillar.',
        nativeFormats: ['text', 'image'],
        limitations: ['Member level analytics are restricted by the provider.'],
      },
      {
        provider: 'x',
        priority: 2,
        rationale: 'Developer audience, and plain text creates are the cheapest format.',
        nativeFormats: ['text'],
        limitations: ['Posts that contain a URL cost more per create.'],
      },
    ],
  },
  content_system: {
    pillars: [
      {
        name: 'Reliability proof',
        description: 'Receipts, retries and what happens when a provider fails.',
        proofAssetIds: [],
      },
      {
        name: 'Migration stories',
        description: 'Moving a calendar without losing history.',
        proofAssetIds: [],
      },
      {
        name: 'Multilingual publishing',
        description: 'Glossary, locale rules and native review.',
        proofAssetIds: [],
      },
    ],
    series: [{ name: 'Receipt of the week', cadence: 'weekly' }],
    ctaLibrary: ['Read the capability page', 'Try it on one account'],
    localeAdaptations: [{ locale: 'de', notes: 'Formal address, no idioms.' }],
    weeklyCadence: [
      { provider: 'linkedin', postsPerWeek: 2 },
      { provider: 'x', postsPerWeek: 2 },
    ],
  },
  ugc_plan: {
    goal: 'Collect twelve short clips of real setups from existing customers.',
    participantProfile: 'Customers who publish to three or more accounts each week.',
    promptAngles: [
      'Show the calendar you actually run.',
      'Show one failure and how you found it.',
      'Show the approval step your team uses.',
      'Show how you handle a second language.',
      'Show what you check before you schedule.',
    ],
    brief: 'One take, under sixty seconds, no script, screen recording is fine.',
    consentChecklist: [
      'Written permission to publish the clip.',
      'Permission for anyone visible or audible in it.',
      'Confirmation that no customer data is on screen.',
      'Agreed disclosure wording if an incentive is given.',
    ],
    incentive: null,
    disclosureKey: 'growth.ugc.disclosure',
    reviewWorkflow: 'Brand approver reviews every clip before it enters the library.',
  },
  opportunities: [],
  tool_recommendations: [],
  calendar_proposal: [
    {
      weekNumber: 1,
      startDate: '2026-08-10',
      slots: [
        {
          date: '2026-08-11',
          provider: 'linkedin',
          connectionId: null,
          pillar: 'Reliability proof',
          contentKind: 'text',
          locale: 'en',
          briefSummary: 'What a publication receipt contains and why it matters.',
          ctaKey: 'Read the capability page',
          approvalRequired: true,
          measurementTag: 'q3-social-reliability',
        },
      ],
    },
    { weekNumber: 2, startDate: '2026-08-17', slots: [] },
    { weekNumber: 3, startDate: '2026-08-24', slots: [] },
    { weekNumber: 4, startDate: '2026-08-31', slots: [] },
  ],
  risks_and_unknowns: {
    unsupportedClaims: ['No customer results can be claimed until proof is approved.'],
    missingPermissions: [],
    staleCatalogRecordIds: [],
    assumptionsRequiringConfirmation: [
      {
        id: 'assume_buyer',
        statement: 'Buyers are operations leads at teams of 10 to 50 people.',
        confidence: 'medium',
        needsConfirmation: true,
      },
    ],
  },
};
