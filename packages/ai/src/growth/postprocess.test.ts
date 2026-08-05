import { describe, expect, it } from 'vitest';

import type { GrowthPlan } from '@relay/contracts';

import { fixedClock } from '../clock.js';
import { postProcessGrowthPlan } from './postprocess.js';
import type { GrowthRejectionRule } from './postprocess.js';
import {
  TEST_OPPORTUNITY_ID,
  TEST_TOOL_ID,
  makeBusinessProfile,
  makeOpportunity,
  makePlan,
  makePlanContext,
  makeTool,
} from './testing.js';

const NOW = fixedClock('2026-08-04T09:00:00Z').now();

function run(plan: GrowthPlan, context = makePlanContext(), consentAssetIds?: readonly string[]) {
  return postProcessGrowthPlan({
    plan,
    context,
    now: NOW,
    ...(consentAssetIds === undefined ? {} : { consentAssetIds }),
  });
}

function rules(result: { violations: readonly { rule: GrowthRejectionRule }[] }): string[] {
  return [...new Set(result.violations.map((violation) => violation.rule))];
}

describe('postProcessGrowthPlan', () => {
  it('accepts the shipped fixture plan unchanged', () => {
    const result = run(makePlan());
    expect(result.violations).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('R1 rejects a catalog id that was never passed into the prompt', () => {
    const plan = makePlan({
      opportunities: [
        {
          opportunityId: TEST_OPPORTUNITY_ID,
          fitExplanation: 'It reaches the same audience.',
          effort: 'low',
          requiredAsset: null,
          pitchDraft: 'A short, factual pitch about the product.',
          evidenceIds: ['profile.description'],
          owner: null,
          status: 'proposed',
        },
      ],
    });

    expect(rules(run(plan))).toContain('R1_UNKNOWN_CATALOG_ID');
  });

  it('R2 rejects a record that is no longer active', () => {
    const context = makePlanContext({
      opportunities: [makeOpportunity({ state: 'stale' })],
    });
    const plan = makePlan({
      opportunities: [
        {
          opportunityId: TEST_OPPORTUNITY_ID,
          fitExplanation: 'It reaches the same audience.',
          effort: 'low',
          requiredAsset: null,
          pitchDraft: 'A short, factual pitch about the product.',
          evidenceIds: ['profile.description'],
          owner: null,
          status: 'proposed',
        },
      ],
    });

    expect(rules(run(plan, context))).toContain('R2_CATALOG_RECORD_NOT_ACTIVE');
  });

  it('accepts an active catalog record that was passed in', () => {
    const context = makePlanContext({
      opportunities: [makeOpportunity()],
      tools: [makeTool()],
    });
    const plan = makePlan({
      opportunities: [
        {
          opportunityId: TEST_OPPORTUNITY_ID,
          fitExplanation: 'It reaches the same audience.',
          effort: 'low',
          requiredAsset: null,
          pitchDraft: 'A short, factual pitch about the product.',
          evidenceIds: [TEST_OPPORTUNITY_ID],
          owner: null,
          status: 'proposed',
        },
      ],
      tool_recommendations: [
        {
          toolId: TEST_TOOL_ID,
          taskFit: 'It trims the clips this plan needs.',
          limitations: ['No batch export on the free tier.'],
          lastVerifiedAt: '2026-08-01T08:00:00Z',
          affiliate: { isAffiliate: false, disclosureKey: null },
        },
      ],
    });

    expect(run(plan, context).violations).toEqual([]);
  });

  it('R3 rejects an evidence id that traces to nothing', () => {
    const plan = makePlan({
      business_snapshot: {
        ...makePlan().business_snapshot,
        facts: [
          {
            id: 'fact_product',
            statement: 'The product schedules and publishes social posts for small teams.',
            evidenceIds: ['made_up_source'],
            confirmedByUser: true,
          },
        ],
      },
    });

    expect(rules(run(plan))).toContain('R3_UNKNOWN_EVIDENCE_ID');
  });

  it('R5 rejects a URL that reached a text field', () => {
    const base = makePlan();
    const plan = makePlan({
      content_system: {
        ...base.content_system,
        ctaLibrary: ['Read more at https://example.test/post'],
      },
    });

    expect(rules(run(plan))).toContain('R5_CONTACT_OR_URL_IN_TEXT');
  });

  it('R5 rejects an email address', () => {
    const base = makePlan();
    const plan = makePlan({
      content_system: { ...base.content_system, ctaLibrary: ['Write to us at team@example.test'] },
    });

    expect(rules(run(plan))).toContain('R5_CONTACT_OR_URL_IN_TEXT');
  });

  it('R6 rejects a date beyond the planning horizon', () => {
    const base = makePlan();
    const plan = makePlan({
      goals_and_metrics: { ...base.goals_and_metrics, windowEnd: '2028-01-01' },
    });

    expect(rules(run(plan))).toContain('R6_INVALID_DATE');
  });

  it('R6 rejects a date in the past', () => {
    const base = makePlan();
    const plan = makePlan({
      goals_and_metrics: { ...base.goals_and_metrics, windowStart: '2020-01-01' },
    });

    expect(rules(run(plan))).toContain('R6_INVALID_DATE');
  });

  it('R7 rejects a cadence the confirmed capacity cannot sustain', () => {
    const base = makePlan();
    const plan = makePlan({
      content_system: {
        ...base.content_system,
        weeklyCadence: [{ provider: 'linkedin', postsPerWeek: 9 }],
      },
    });

    expect(rules(run(plan))).toContain('R7_CADENCE_OVER_CAPACITY');
  });

  it('R8 rejects an implied automatic submission', () => {
    const base = makePlan();
    const plan = makePlan({
      ugc_plan: { ...base.ugc_plan, goal: 'We will submit this to every directory automatically.' },
    });

    expect(rules(run(plan))).toContain('R8_PROHIBITED_BEHAVIOUR');
  });

  it('R8 rejects a guaranteed outcome', () => {
    const base = makePlan();
    const plan = makePlan({
      goals_and_metrics: {
        ...base.goals_and_metrics,
        objective: 'Get guaranteed reach on every channel.',
      },
    });

    expect(rules(run(plan))).toContain('R8_PROHIBITED_BEHAVIOUR');
  });

  it('R9 rejects a claim the profile put off limits', () => {
    const profile = makeBusinessProfile({ prohibitedClaims: ['fastest'] });
    const context = makePlanContext({ profile });
    const base = makePlan();
    const plan = makePlan({
      goals_and_metrics: { ...base.goals_and_metrics, objective: 'Be known as the fastest tool.' },
    });

    expect(rules(run(plan, context))).toContain('R9_PROHIBITED_CLAIM_OR_TOPIC');
  });

  it('R10 rejects a first person testimonial with no consent artifact', () => {
    const base = makePlan();
    const plan = makePlan({
      content_system: {
        ...base.content_system,
        ctaLibrary: ['I doubled my reach in a week.'],
      },
    });

    expect(rules(run(plan))).toContain('R10_TESTIMONIAL_WITHOUT_CONSENT');
    expect(rules(run(plan, makePlanContext(), ['media_1']))).not.toContain(
      'R10_TESTIMONIAL_WITHOUT_CONSENT',
    );
  });

  it('R11 rejects an assumption restated as a fact elsewhere', () => {
    const base = makePlan();
    const plan = makePlan({
      audiences_and_channels: {
        ...base.audiences_and_channels,
        audiences: [
          {
            name: 'Writers',
            description: 'The buyer is the person who also writes the posts.',
            priority: 1,
          },
        ],
      },
    });

    expect(rules(run(plan))).toContain('R11_ASSUMPTION_STATED_AS_FACT');
  });

  it('R11 accepts the same sentence when it is labelled as an assumption', () => {
    const base = makePlan();
    const plan = makePlan({
      audiences_and_channels: {
        ...base.audiences_and_channels,
        audiences: [
          {
            name: 'Writers',
            description: 'Assumption: the buyer is the person who also writes the posts.',
            priority: 1,
          },
        ],
      },
    });

    expect(rules(run(plan))).not.toContain('R11_ASSUMPTION_STATED_AS_FACT');
  });

  it('R12 rejects an empty risk section when information is missing', () => {
    const plan = makePlan({
      risks_and_unknowns: {
        unsupportedClaims: [],
        missingPermissions: [],
        staleCatalogRecordIds: [],
        assumptionsRequiringConfirmation: [],
      },
    });

    expect(rules(run(plan))).toContain('R12_EMPTY_RISKS_WITH_MISSING_INFORMATION');
  });

  it('R13 rejects zero standing in for an unknown measurement', () => {
    const base = makePlan();
    const plan = makePlan({
      goals_and_metrics: { ...base.goals_and_metrics, baseline: 0 },
    });

    expect(rules(run(plan))).toContain('R13_ZERO_FOR_UNKNOWN_METRIC');
  });

  it('builds a repair instruction naming the rules that failed', () => {
    const base = makePlan();
    const plan = makePlan({
      goals_and_metrics: { ...base.goals_and_metrics, baseline: 0 },
    });

    const result = run(plan);
    expect(result.ok).toBe(false);
    expect(result.repairInstruction).toContain('R13_ZERO_FOR_UNKNOWN_METRIC');
  });
});
