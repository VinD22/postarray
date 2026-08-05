import { describe, expect, it } from 'vitest';

import { ERROR_CODES } from '@relay/contracts';

import { fixedClock } from '../clock.js';
import { createEchoProvider } from '../providers/echo.js';
import { TEST_CALL_CONTEXT, createTestGateway } from '../test-support.js';
import { GROWTH_PLAN_FIXTURE_BODY } from './fixture.js';
import { assemblePlan, generateGrowthPlan } from './pipeline.js';
import { buildGrowthContext } from './retrieval.js';
import {
  TEST_PLAN_ID,
  TEST_WORKSPACE_ID,
  makeBusinessProfile,
  makeOpportunity,
  makePlanContext,
} from './testing.js';

const CLOCK = fixedClock('2026-08-04T09:00:00Z');

describe('assemblePlan', () => {
  it('supplies provenance the model is not allowed to author', () => {
    const assembled = assemblePlan(
      { business_snapshot: {} },
      {
        id: TEST_PLAN_ID,
        workspaceId: TEST_WORKSPACE_ID,
        revision: 2,
        generatedAt: '2026-08-04T09:00:00Z',
        model: 'echo-deterministic',
        promptVersion: '2026-08-04.1',
      },
    );

    expect(assembled).toMatchObject({
      id: TEST_PLAN_ID,
      workspaceId: TEST_WORKSPACE_ID,
      revision: 2,
      state: 'draft',
      model: 'echo-deterministic',
    });
  });
});

describe('buildGrowthContext', () => {
  it('refuses to run against an unconfirmed profile', () => {
    expect(() =>
      buildGrowthContext({
        profile: makeBusinessProfile({ confirmedAt: null }),
        brandSources: [],
        opportunities: [],
        tools: [],
        windowStart: '2026-08-10',
        windowEnd: '2026-09-07',
      }),
    ).toThrowError();
  });

  it('passes only active catalog records into the prompt', () => {
    const context = makePlanContext({
      opportunities: [
        makeOpportunity(),
        makeOpportunity({ id: 'opp_00000000000000000000000009', state: 'draft' }),
      ],
    });

    expect(context.allowedOpportunityIds.size).toBe(1);
    expect(context.excludedCatalogIds).toEqual(['opp_00000000000000000000000009']);
  });

  it('drops brand sources that were never approved', () => {
    const context = buildGrowthContext({
      profile: makeBusinessProfile(),
      brandSources: [
        {
          id: 'src_ok',
          title: 'Approved page',
          text: 'We publish weekly.',
          retrievedAt: '2026-08-01T08:00:00Z',
          approved: true,
        },
        {
          id: 'src_not_ok',
          title: 'Unapproved page',
          text: 'Anything at all.',
          retrievedAt: '2026-08-01T08:00:00Z',
          approved: false,
        },
      ],
      opportunities: [],
      tools: [],
      windowStart: '2026-08-10',
      windowEnd: '2026-09-07',
    });

    expect(context.untrustedSources.map((source) => source.id)).toEqual(['src_ok']);
    expect(context.allowedEvidenceIds.has('src_not_ok')).toBe(false);
  });
});

describe('generateGrowthPlan', () => {
  it('produces a validated plan from the offline provider', async () => {
    const { gateway } = createTestGateway();

    const result = await generateGrowthPlan({
      gateway,
      callContext: { ...TEST_CALL_CONTEXT, workspaceId: TEST_WORKSPACE_ID },
      planContext: makePlanContext(),
      clock: CLOCK,
      planId: TEST_PLAN_ID,
      revision: 1,
    });

    expect(result.plan.id).toBe(TEST_PLAN_ID);
    expect(result.plan.state).toBe('draft');
    expect(result.plan.calendar_proposal).toHaveLength(4);
    expect(result.plan.opportunities).toEqual([]);
    expect(result.repairedViolations).toEqual([]);
  });

  it('rejects the whole generation rather than showing part of a bad plan', async () => {
    const provider = createEchoProvider({
      overrides: {
        'growth-plan': {
          ...GROWTH_PLAN_FIXTURE_BODY,
          content_system: {
            ...GROWTH_PLAN_FIXTURE_BODY.content_system,
            weeklyCadence: [{ provider: 'linkedin', postsPerWeek: 9 }],
          },
        },
      },
    });
    const { gateway } = createTestGateway({ provider });

    await expect(
      generateGrowthPlan({
        gateway,
        callContext: { ...TEST_CALL_CONTEXT, workspaceId: TEST_WORKSPACE_ID },
        planContext: makePlanContext(),
        clock: CLOCK,
        planId: TEST_PLAN_ID,
        revision: 1,
      }),
    ).rejects.toMatchObject({ code: ERROR_CODES.AI_OUTPUT_INVALID });
  });

  it('rejects a plan that references a catalog id it was never given', async () => {
    const provider = createEchoProvider({
      overrides: {
        'growth-plan': {
          ...GROWTH_PLAN_FIXTURE_BODY,
          opportunities: [
            {
              opportunityId: 'opp_00000000000000000000000099',
              fitExplanation: 'It looks relevant.',
              effort: 'low',
              requiredAsset: null,
              pitchDraft: 'A short pitch.',
              evidenceIds: ['profile.description'],
              owner: null,
              status: 'proposed',
            },
          ],
        },
      },
    });
    const { gateway } = createTestGateway({ provider });

    await expect(
      generateGrowthPlan({
        gateway,
        callContext: { ...TEST_CALL_CONTEXT, workspaceId: TEST_WORKSPACE_ID },
        planContext: makePlanContext(),
        clock: CLOCK,
        planId: TEST_PLAN_ID,
        revision: 1,
      }),
    ).rejects.toMatchObject({ code: ERROR_CODES.AI_OUTPUT_INVALID });
  });
});
