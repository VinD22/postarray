import { describe, expect, it, vi } from 'vitest';

import type { ContentService, ServiceDeps, WorkerActivityContext } from '../types';

let activeDb: Record<string, unknown>;
vi.mock('../internal/runtime', () => ({
  runInWorkspace: async (
    _deps: unknown,
    _ctx: unknown,
    handler: (db: unknown) => Promise<unknown>,
  ) => handler(activeDb),
}));

import { createWorkerRuleService } from './worker-rules';
import { evaluateRuleConditions } from './automation-rules';

const ctx: WorkerActivityContext = {
  workspaceId: 'ws_1',
  correlationId: 'corr_1',
  actorId: 'worker',
  actorType: 'system',
  surface: 'automation_rule',
  approvalLevel: 'level_3_confirm',
  locale: 'en',
};

function service(content: Partial<ContentService> = {}) {
  return createWorkerRuleService(
    { clock: { now: () => new Date('2026-08-13T00:00:00.000Z') } } as ServiceDeps,
    { createDraft: vi.fn(), ...content } as unknown as ContentService,
  );
}

function rule(overrides: Record<string, unknown> = {}) {
  return {
    id: 'rule_1',
    state: 'active',
    version: 2,
    brandId: 'brand_1',
    actions: [{ kind: 'create_draft', config: {} }],
    conditions: [{ kind: 'platform', config: { providers: ['bluesky'] } }],
    delaySeconds: 60,
    cooldownSeconds: null,
    maxExecutions: null,
    maxExecutionsPerSource: null,
    executionCount: 0,
    runOncePerSource: true,
    requiresApproval: true,
    lastRunAt: null,
    ...overrides,
  };
}

describe('rule condition evaluation', () => {
  it('matches on the trigger event and names the conditions that did not', () => {
    const evaluation = evaluateRuleConditions(
      [
        { kind: 'platform', config: { providers: ['bluesky'] } },
        { kind: 'keyword_present', config: { keywords: ['launch'] } },
      ],
      { provider: 'bluesky', body: 'We are shipping the LAUNCH today' },
    );
    expect(evaluation).toEqual({ matched: true, unmatchedConditionKeys: [] });
  });

  it('fails closed on a condition it cannot answer from the event', () => {
    const evaluation = evaluateRuleConditions(
      [{ kind: 'cadence_budget', config: { maxPerDay: 3 } }],
      { provider: 'bluesky' },
    );
    // An automation that acts because we did not know enough to stop it is the
    // failure mode this direction exists to prevent.
    expect(evaluation).toEqual({ matched: false, unmatchedConditionKeys: ['cadence_budget'] });
  });

  it('treats a metric it was not given as unknown rather than as zero', () => {
    const evaluation = evaluateRuleConditions(
      [{ kind: 'engagement_minimum', config: { metric: 'likes', value: 10 } }],
      { provider: 'bluesky', metrics: {} },
    );
    expect(evaluation.matched).toBe(false);
  });
});

describe('rule definition loading', () => {
  it('reports the rule as the workflow sees it, with consequential actions flagged', async () => {
    activeDb = {
      automationRule: {
        findFirst: vi.fn().mockResolvedValue(
          rule({
            actions: [
              { kind: 'create_draft', config: {} },
              { kind: 'publish_post', config: {} },
            ],
          }),
        ),
      },
    };

    const view = await service().loadRuleDefinition({ ctx, ruleId: 'rule_1' });

    expect(view).toMatchObject({ ruleId: 'rule_1', enabled: true, oncePerSourcePost: true });
    expect(view.actions.map((action) => action.consequential)).toEqual([false, true]);
    // The rule-level delay applies once, before the first action.
    expect(view.actions.map((action) => action.delaySeconds)).toEqual([60, 0]);
  });
});

describe('rule execution reservation', () => {
  const reserveInput = {
    ctx,
    ruleId: 'rule_1',
    runId: 'rulerun_1',
    sourceKey: 'post_1',
    now: '2026-08-13T00:00:00.000Z',
  };

  it('claims the slot by inserting the run row', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'rulerun_1' });
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    activeDb = {
      automationRule: { findFirst: vi.fn().mockResolvedValue(rule()), updateMany },
      automationRuleRun: { create },
    };

    await expect(service().reserveRuleExecution(reserveInput)).resolves.toEqual({
      verdict: 'allowed',
      nextEligibleAt: null,
    });
    expect(create.mock.calls[0]?.[0]?.data).toMatchObject({ sourceId: 'post_1', state: 'running' });
    expect(updateMany.mock.calls[0]?.[0]?.data).toMatchObject({ executionCount: 1 });
  });

  it('lets the database decide a race, not a read-then-write here', async () => {
    activeDb = {
      automationRule: { findFirst: vi.fn().mockResolvedValue(rule()), updateMany: vi.fn() },
      automationRuleRun: {
        create: vi.fn().mockRejectedValue(Object.assign(new Error('unique'), { code: 'P2002' })),
      },
    };

    await expect(service().reserveRuleExecution(reserveInput)).resolves.toEqual({
      verdict: 'duplicate_source',
      nextEligibleAt: null,
    });
  });

  it('refuses inside the cooldown and says when the rule is eligible again', async () => {
    activeDb = {
      automationRule: {
        findFirst: vi
          .fn()
          .mockResolvedValue(
            rule({ cooldownSeconds: 3600, lastRunAt: new Date('2026-08-12T23:30:00.000Z') }),
          ),
        updateMany: vi.fn(),
      },
      automationRuleRun: { create: vi.fn() },
    };

    await expect(service().reserveRuleExecution(reserveInput)).resolves.toEqual({
      verdict: 'cooldown',
      nextEligibleAt: '2026-08-13T00:30:00.000Z',
    });
  });

  it('refuses once the execution budget is spent', async () => {
    activeDb = {
      automationRule: {
        findFirst: vi.fn().mockResolvedValue(rule({ maxExecutions: 3, executionCount: 3 })),
        updateMany: vi.fn(),
      },
      automationRuleRun: { create: vi.fn() },
    };

    await expect(service().reserveRuleExecution(reserveInput)).resolves.toMatchObject({
      verdict: 'max_executions',
    });
  });
});

describe('rule action execution', () => {
  const actionInput = {
    ctx,
    ruleId: 'rule_1',
    runId: 'rulerun_1',
    actionId: 'rule_1:0',
    event: { body: 'A new post', title: 'Hello', provider: 'bluesky' },
    dryRun: false,
  } as const;

  it('never lets a rule be the thing that decided an external post happened', async () => {
    activeDb = { automationRule: { findFirst: vi.fn().mockResolvedValue(rule()) } };

    await expect(
      service().executeRuleAction({ ...actionInput, kind: 'publish_post' }),
    ).resolves.toMatchObject({ status: 'approval_required', errorCode: 'APPROVAL_REQUIRED' });
  });

  it('creates a draft through the content service with no targets', async () => {
    const createDraft = vi.fn().mockResolvedValue({ id: 'content_1' });
    activeDb = { automationRule: { findFirst: vi.fn().mockResolvedValue(rule()) } };

    const result = await service({ createDraft }).executeRuleAction({
      ...actionInput,
      kind: 'create_draft',
    });

    expect(result).toMatchObject({ status: 'succeeded', resourceId: 'content_1' });
    const draft = createDraft.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(draft).toMatchObject({ brandId: 'brand_1', body: 'A new post' });
    expect(draft).not.toHaveProperty('targets');
  });

  it('writes nothing at all on a dry run', async () => {
    const createDraft = vi.fn();
    activeDb = {};

    await expect(
      service({ createDraft }).executeRuleAction({
        ...actionInput,
        kind: 'create_draft',
        dryRun: true,
      }),
    ).resolves.toMatchObject({ status: 'skipped', messageKey: 'rule.dry_run' });
    expect(createDraft).not.toHaveBeenCalled();
  });

  it('says not_implemented rather than reporting an action it did not perform', async () => {
    activeDb = { automationRule: { findFirst: vi.fn().mockResolvedValue(rule()) } };

    await expect(
      service().executeRuleAction({ ...actionInput, kind: 'adapt_text' }),
    ).resolves.toEqual({
      status: 'skipped',
      resourceId: null,
      errorCode: 'CAPABILITY_NOT_IMPLEMENTED',
      messageKey: 'rule.action_not_implemented',
    });
  });
});

describe('rule run recording', () => {
  it('closes the reserved row with the outcome of every action', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    activeDb = { automationRuleRun: { updateMany } };

    await service().recordRuleRun({
      ctx,
      ruleId: 'rule_1',
      runId: 'rulerun_1',
      startedAt: '2026-08-13T00:00:00.000Z',
      finishedAt: '2026-08-13T00:00:05.000Z',
      status: 'succeeded',
      actionResults: [{ actionId: 'rule_1:0', status: 'succeeded' }],
      reasonKey: null,
    });

    expect(updateMany.mock.calls[0]?.[0]?.data).toMatchObject({ state: 'succeeded' });
  });
});
