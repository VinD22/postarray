import { describe, expect, it } from 'vitest';

import { parseRule, serializeRule, toRuleJson } from './rule-serialization';
import type { RuleDraft } from './types';
import { DEFAULT_MEASUREMENT } from './validation';

const fullRule: RuleDraft = {
  id: 'rule_01J',
  name: 'Blog to social',
  state: 'draft',
  trigger: {
    kind: 'analytics_threshold',
    parameters: { metric: 'comments', value: 25 },
    measurement: DEFAULT_MEASUREMENT,
  },
  conditions: [
    { id: 'c1', kind: 'locale', parameters: { locale: 'en' } },
    { id: 'c2', kind: 'duplicate_similarity', parameters: {} },
    { id: 'c3', kind: 'account', parameters: { account: ['conn_a', 'conn_b'] } },
  ],
  actions: [
    { id: 'a1', kind: 'create_draft', parameters: { template: 'blog_announce' } },
    { id: 'a2', kind: 'request_approval', parameters: {} },
  ],
  delaySeconds: 300,
  end: { kind: 'count', runs: 12 },
  connectionIds: ['conn_a', 'conn_b'],
  crossAccount: {
    enabled: false,
    sourceConnectionId: null,
    followUpConnectionId: null,
    preauthorized: false,
  },
};

describe('round tripping between the sentence and the API view', () => {
  it('loses nothing on serialize then parse', () => {
    const parsed = parseRule(serializeRule(fullRule));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.draft).toEqual(fullRule);
    }
  });

  it('produces identical JSON after a round trip, so switching views is stable', () => {
    const once = serializeRule(fullRule);
    const parsed = parseRule(once);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(serializeRule(parsed.draft)).toBe(once);
    }
  });

  it('keeps array parameters intact', () => {
    const parsed = parseRule(serializeRule(fullRule));
    if (!parsed.ok) {
      throw new Error('expected a parse');
    }
    expect(parsed.draft.conditions[2]?.parameters.account).toEqual(['conn_a', 'conn_b']);
  });

  it('keeps the whole measurement block on a threshold trigger', () => {
    const json = toRuleJson(fullRule);
    expect(json.trigger?.measurement).toEqual(DEFAULT_MEASUREMENT);
  });
});

describe('parsing hand edited JSON', () => {
  it('reports a syntax error rather than applying half a rule', () => {
    const result = parseRule('{ "name": ');
    expect(result.ok).toBe(false);
  });

  it('refuses an unknown trigger kind instead of dropping it silently', () => {
    const result = parseRule(
      JSON.stringify({ name: 'x', trigger: { kind: 'auto_like', parameters: {} } }),
    );
    expect(result).toEqual({ ok: false, reason: 'TRIGGER_UNKNOWN' });
  });

  it('refuses an unknown action kind', () => {
    const result = parseRule(
      JSON.stringify({ name: 'x', actions: [{ id: 'a', kind: 'auto_follow' }] }),
    );
    expect(result).toEqual({ ok: false, reason: 'ACTION_UNKNOWN' });
  });

  it('refuses an unknown condition kind', () => {
    const result = parseRule(
      JSON.stringify({ name: 'x', conditions: [{ id: 'c', kind: 'engagement_pod' }] }),
    );
    expect(result).toEqual({ ok: false, reason: 'CONDITION_UNKNOWN' });
  });

  it('requires a name', () => {
    expect(parseRule('{}')).toEqual({ ok: false, reason: 'NAME_MISSING' });
  });

  it('falls back to a manual end condition rather than inventing one', () => {
    const result = parseRule(JSON.stringify({ name: 'x', end: { kind: 'whenever' } }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.draft.end).toEqual({ kind: 'manual' });
    }
  });

  it('never trusts hand edited JSON to grant cross account preauthorization implicitly', () => {
    const result = parseRule(JSON.stringify({ name: 'x', crossAccount: { enabled: true } }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.draft.crossAccount.preauthorized).toBe(false);
    }
  });

  it('drops a measurement block that is missing a required bound', () => {
    const result = parseRule(
      JSON.stringify({
        name: 'x',
        trigger: {
          kind: 'analytics_threshold',
          parameters: {},
          measurement: { metric: 'comments', threshold: 10 },
        },
      }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.draft.trigger?.measurement).toBeUndefined();
    }
  });
});
