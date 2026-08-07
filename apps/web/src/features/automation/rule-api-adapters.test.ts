import { describe, expect, it } from 'vitest';

import type { RuleView } from '@/lib/api';

import { parseSampleEvent, toRuleDraft, toRuleInput, toRuleRun } from './rule-api-adapters';
import type { RuleDraft } from './types';

const MEASUREMENT = {
  metric: 'comments',
  threshold: 10,
  windowSeconds: 86_400,
  expirySeconds: 604_800,
  cooldownSeconds: 3_600,
  maxExecutionsPerPost: 1,
  staleAfterSeconds: 21_600,
} as const;

function draft(): RuleDraft {
  return {
    id: null,
    name: 'Respond to traction',
    state: 'draft',
    trigger: {
      kind: 'analytics_threshold',
      parameters: { metric: 'comments', value: 10 },
      measurement: MEASUREMENT,
    },
    conditions: [],
    actions: [{ id: 'action-1', kind: 'request_approval', parameters: {} }],
    delaySeconds: 60,
    end: { kind: 'manual' },
    connectionIds: ['conn_01'],
    crossAccount: {
      enabled: false,
      sourceConnectionId: null,
      followUpConnectionId: null,
      preauthorized: false,
    },
  };
}

function apiRule(): RuleView {
  return {
    id: 'rule_01',
    workspaceId: 'ws_01',
    brandId: 'brand_01',
    name: 'Respond to traction',
    state: 'active',
    trigger: {
      kind: 'analytics_threshold',
      config: { metric: 'comments', value: 10, measurement: MEASUREMENT },
    },
    conditions: [],
    actions: [{ kind: 'request_approval', config: {} }],
    delaySeconds: 60,
    endCondition: { kind: 'manual' },
    requiresApproval: true,
    preauthorizedConnectionIds: ['conn_01'],
    version: 2,
    executionCount: 0,
    maxExecutionsPerSource: 1,
    maxExecutions: null,
    lastRunAt: null,
    pausedReasonKey: null,
  };
}

describe('automation API adapters', () => {
  it('sends tenant scope and threshold guards without browser-only fields', () => {
    const input = toRuleInput(draft(), 'brand_01');

    expect(input).toMatchObject({
      brandId: 'brand_01',
      preauthorizedConnectionIds: ['conn_01'],
      requiresApproval: true,
      endCondition: { kind: 'manual' },
      maxExecutionsPerSource: 1,
      cooldownSeconds: 3_600,
      measurementWindowSeconds: 86_400,
    });
    expect(input).not.toHaveProperty('affectedConnectionIds');
    expect(input).not.toHaveProperty('crossAccount');
  });

  it('round trips the persisted rule into the editor without treating guard metadata as a parameter', () => {
    const result = toRuleDraft(apiRule());

    expect(result.state).toBe('active');
    expect(result.trigger?.measurement).toEqual(MEASUREMENT);
    expect(result.trigger?.parameters).toEqual({ metric: 'comments', value: 10 });
    expect(result.connectionIds).toEqual(['conn_01']);
  });

  it('keeps pending and running outcomes distinct from skipped', () => {
    const base = {
      id: 'run_01',
      ruleId: 'rule_01',
      ruleVersion: 1,
      isTest: false,
      sourceKind: 'webhook',
      sourceId: null,
      performedActions: [],
      blockedReasonKey: null,
      errorCode: null,
      startedAt: '2026-08-06T00:00:00.000Z',
      endedAt: null,
    } as const;

    expect(toRuleRun({ ...base, state: 'pending' }).outcome).toBe('pending');
    expect(toRuleRun({ ...base, state: 'running' }).outcome).toBe('running');
  });

  it('accepts only JSON objects as sample events', () => {
    expect(parseSampleEvent('{"source":"test"}')).toEqual({ source: 'test' });
    expect(() => parseSampleEvent('[]')).toThrow(TypeError);
  });
});
