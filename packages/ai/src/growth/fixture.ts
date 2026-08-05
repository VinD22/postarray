import type { GrowthPlanBody } from '../prompts/schemas';

/**
 * A complete, schema-valid growth plan body.
 *
 * This is what the echo provider replays when no API key is configured, which
 * is what makes the Growth Advisor demoable offline. It deliberately ships with
 * an empty opportunity and tool catalog, because that is the honest launch
 * state: an empty Opportunities tab beats one invented URL.
 */
export const GROWTH_PLAN_FIXTURE_BODY: GrowthPlanBody = {
  business_snapshot: {
    businessProfileId: 'bprof_00000000000000000000000000',
    businessProfileRevision: 1,
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
    missingInformation: [
      'No conversion baseline was supplied, so the target below is a starting point rather than a forecast.',
    ],
  },
  goals_and_metrics: {
    objective: 'Increase qualified trial starts from social channels.',
    conversionEvent: 'Trial started from a social referral.',
    baseline: null,
    target: null,
    windowStart: '2026-08-10',
    windowEnd: '2026-09-07',
    supportingMetrics: ['link_clicks', 'reach', 'follower_delta'],
  },
  audiences_and_channels: {
    audiences: [
      {
        name: 'Solo social media managers',
        description: 'One person responsible for several accounts with no approval chain.',
        priority: 1,
      },
    ],
    channels: [
      {
        provider: 'linkedin',
        priority: 1,
        rationale: 'The audience discusses process and tooling there in public.',
        nativeFormats: ['text', 'document'],
        limitations: ['Member level read back of post analytics is restricted.'],
      },
    ],
  },
  content_system: {
    pillars: [
      {
        name: 'How the work actually gets done',
        description: 'Concrete workflow walkthroughs with real screenshots.',
        proofAssetIds: [],
      },
      {
        name: 'What went wrong and what we changed',
        description: 'Post mortems written plainly, including the parts that are still open.',
        proofAssetIds: [],
      },
      {
        name: 'Answers to the questions we keep getting',
        description: 'One question per post, answered without a sales turn.',
        proofAssetIds: [],
      },
    ],
    series: [{ name: 'One question, one answer', cadence: 'weekly' }],
    ctaLibrary: ['Tell us which platform you want next.', 'Try it on one post this week.'],
    localeAdaptations: [{ locale: 'en', notes: 'Source locale. No adaptation needed.' }],
    weeklyCadence: [{ provider: 'linkedin', postsPerWeek: 2 }],
  },
  ugc_plan: {
    goal: 'Collect short workflow clips from existing users that tie back to trial starts.',
    participantProfile:
      'Current users who publish weekly. Employees, affiliates and anyone with an undisclosed material connection are excluded.',
    promptAngles: [
      'Show the calendar the week before a launch.',
      'Show the one step that used to be manual.',
      'Show a mistake the approval step caught.',
      'Show how a post is adapted for a second platform.',
      'Show what a receipt tells you after publishing.',
    ],
    brief:
      'Record sixty seconds of your real screen, say what you were doing and what changed. No script and no product pitch.',
    consentChecklist: [
      'Written permission covering the exact clip.',
      'Named scope of use, duration and territory.',
      'A stated way to withdraw permission later.',
      'Confirmation that no minor appears in the clip.',
      'Confirmation that any music and third party material is cleared.',
    ],
    incentive: null,
    disclosureKey: 'growth.ugc.disclosure',
    reviewWorkflow:
      'Two reviewers check consent, accuracy and any visible customer data before the clip is reused.',
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
          pillar: 'How the work actually gets done',
          contentKind: 'text',
          locale: 'en',
          briefSummary:
            'Walk through scheduling a week of posts, including choosing the time zone.',
          ctaKey: null,
          approvalRequired: true,
          measurementTag: 'w1-workflow',
        },
      ],
    },
    {
      weekNumber: 2,
      startDate: '2026-08-17',
      slots: [
        {
          date: '2026-08-18',
          provider: 'linkedin',
          connectionId: null,
          pillar: 'Answers to the questions we keep getting',
          contentKind: 'text',
          locale: 'en',
          briefSummary: 'Answer why a post can be partially published and what happens next.',
          ctaKey: null,
          approvalRequired: true,
          measurementTag: 'w2-question',
        },
      ],
    },
    {
      weekNumber: 3,
      startDate: '2026-08-24',
      slots: [
        {
          date: '2026-08-25',
          provider: 'linkedin',
          connectionId: null,
          pillar: 'What went wrong and what we changed',
          contentKind: 'text',
          locale: 'en',
          briefSummary: 'Describe a scheduling bug, the fix, and what is still not solved.',
          ctaKey: null,
          approvalRequired: true,
          measurementTag: 'w3-postmortem',
        },
      ],
    },
    {
      weekNumber: 4,
      startDate: '2026-08-31',
      slots: [
        {
          date: '2026-09-01',
          provider: 'linkedin',
          connectionId: null,
          pillar: 'How the work actually gets done',
          contentKind: 'document',
          locale: 'en',
          briefSummary:
            'Share the approval checklist the team actually uses, as a one page document.',
          ctaKey: null,
          approvalRequired: true,
          measurementTag: 'w4-checklist',
        },
      ],
    },
  ],
  risks_and_unknowns: {
    unsupportedClaims: ['Any time saving figure, because no measurement was supplied.'],
    missingPermissions: ['Organization level analytics access has not been granted yet.'],
    staleCatalogRecordIds: [],
    assumptionsRequiringConfirmation: [
      {
        id: 'assume_buyer',
        statement: 'The buyer is the person who also writes the posts.',
        confidence: 'medium',
        needsConfirmation: true,
      },
    ],
  },
};
