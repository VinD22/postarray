import { describe, expect, it } from 'vitest';

import type { RuleDraft } from './types';
import {
  DEFAULT_MEASUREMENT,
  activationBlockers,
  maxExternalActionsPerRun,
  requiresCrossAccountPreauthorization,
  saveIssues,
} from './validation';

function draft(overrides: Partial<RuleDraft> = {}): RuleDraft {
  return {
    id: null,
    name: 'Blog to social',
    state: 'draft',
    trigger: { kind: 'post_published', parameters: {} },
    conditions: [],
    actions: [{ id: 'a1', kind: 'create_draft', parameters: { template: 'blog' } }],
    delaySeconds: 0,
    end: { kind: 'manual' },
    connectionIds: ['conn_a'],
    crossAccount: {
      enabled: false,
      sourceConnectionId: null,
      followUpConnectionId: null,
      preauthorized: false,
    },
    ...overrides,
  };
}

function keys(issues: readonly { readonly key: string }[]): readonly string[] {
  return issues.map((issue) => issue.key);
}

describe('saveIssues', () => {
  it('accepts a coherent rule', () => {
    expect(saveIssues(draft())).toEqual([]);
  });

  it('requires a trigger', () => {
    expect(keys(saveIssues(draft({ trigger: null })))).toContain(
      'automation.editor.error.noTrigger',
    );
  });

  it('requires at least one action', () => {
    expect(keys(saveIssues(draft({ actions: [] })))).toContain('automation.editor.error.noAction');
  });

  it('requires every required parameter of the chosen action', () => {
    const issues = saveIssues(
      draft({ actions: [{ id: 'a1', kind: 'create_draft', parameters: {} }] }),
    );
    expect(keys(issues)).toContain('automation.editor.error.missingParameter');
  });

  it('does not demand accounts for a rule that only creates drafts', () => {
    expect(keys(saveIssues(draft({ connectionIds: [] })))).not.toContain(
      'automation.editor.error.noAccounts',
    );
  });

  it('demands accounts as soon as an action reaches a platform', () => {
    const issues = saveIssues(
      draft({
        connectionIds: [],
        actions: [{ id: 'a1', kind: 'publish_post', parameters: {} }],
      }),
    );
    expect(keys(issues)).toContain('automation.editor.error.noAccounts');
  });
});

describe('engagement threshold triggers', () => {
  const thresholdDraft = (measurement?: typeof DEFAULT_MEASUREMENT): RuleDraft =>
    draft({
      trigger: {
        kind: 'analytics_threshold',
        parameters: { metric: 'comments', value: 25 },
        ...(measurement ? { measurement } : {}),
      },
    });

  it('refuses to save without a measurement block at all', () => {
    const issues = keys(saveIssues(thresholdDraft()));
    expect(issues).toContain('automation.threshold.windowRequired');
    expect(issues).toContain('automation.threshold.cooldownRequired');
  });

  it('requires a window, an expiry, a cooldown and an execution cap', () => {
    const issues = keys(
      saveIssues(
        thresholdDraft({
          ...DEFAULT_MEASUREMENT,
          windowSeconds: 0,
          cooldownSeconds: 0,
          expirySeconds: 0,
          maxExecutionsPerPost: 0,
        }),
      ),
    );
    expect(issues).toContain('automation.threshold.windowRequired');
    expect(issues).toContain('automation.threshold.cooldownRequired');
    expect(issues).toContain('automation.threshold.maxExecutions');
  });

  it('defaults to running once per source post', () => {
    expect(DEFAULT_MEASUREMENT.maxExecutionsPerPost).toBe(1);
  });

  it('defaults to a finite staleness limit, so a missing metric cannot authorize an action', () => {
    expect(DEFAULT_MEASUREMENT.staleAfterSeconds).toBeGreaterThan(0);
  });

  it('accepts the documented defaults unchanged', () => {
    expect(saveIssues(thresholdDraft(DEFAULT_MEASUREMENT))).toEqual([]);
  });
});

describe('cross account follow up', () => {
  const crossDraft = (preauthorized: boolean): RuleDraft =>
    draft({
      actions: [{ id: 'a1', kind: 'cross_account_follow_up', parameters: { account: 'conn_b' } }],
      crossAccount: {
        enabled: true,
        sourceConnectionId: 'conn_a',
        followUpConnectionId: 'conn_b',
        preauthorized,
      },
    });

  it('is detected from the action list rather than from a toggle', () => {
    expect(requiresCrossAccountPreauthorization(crossDraft(false))).toBe(true);
    expect(requiresCrossAccountPreauthorization(draft())).toBe(false);
  });

  it('cannot be saved without explicit preauthorization', () => {
    expect(keys(saveIssues(crossDraft(false)))).toContain(
      'automation.crossAccount.preauthorizeRequired',
    );
  });

  it('cannot be activated without both accounts named', () => {
    const blockers = activationBlockers(
      draft({
        actions: [{ id: 'a1', kind: 'cross_account_follow_up', parameters: { account: 'conn_b' } }],
        crossAccount: {
          enabled: true,
          sourceConnectionId: 'conn_a',
          followUpConnectionId: null,
          preauthorized: true,
        },
      }),
    );
    expect(keys(blockers)).toContain('automation.crossAccount.preauthorizeRequired');
  });

  it('is fine once both accounts are named and preauthorized', () => {
    expect(activationBlockers(crossDraft(true))).toEqual([]);
  });
});

describe('maxExternalActionsPerRun', () => {
  it('is zero when nothing reaches a platform', () => {
    expect(maxExternalActionsPerRun(draft())).toBe(0);
  });

  it('is one consequential action per selected account', () => {
    const value = maxExternalActionsPerRun(
      draft({
        connectionIds: ['conn_a', 'conn_b', 'conn_c'],
        actions: [
          { id: 'a1', kind: 'create_draft', parameters: { template: 'blog' } },
          { id: 'a2', kind: 'schedule_post', parameters: {} },
          { id: 'a3', kind: 'publish_post', parameters: {} },
        ],
      }),
    );
    expect(value).toBe(6);
  });
});
