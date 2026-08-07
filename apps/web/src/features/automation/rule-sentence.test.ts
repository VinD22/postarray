import { createTranslator, en } from '@relay/i18n';
import { describe, expect, it } from 'vitest';

import { ruleSentence } from './rule-sentence';
import type { RuleDraft } from './types';

const translator = createTranslator('en', en);
const t = (key: string, values?: Readonly<Record<string, string | number>>): string =>
  translator.format(key, values);

const labels = {
  locale: 'en',
  resolve: (_name: string, value: unknown): string =>
    Array.isArray(value) ? value.join(', ') : String(value),
};

function draft(overrides: Partial<RuleDraft> = {}): RuleDraft {
  return {
    id: null,
    name: 'Blog to social',
    state: 'draft',
    trigger: { kind: 'rss_item', parameters: { feed: 'Acme blog' } },
    conditions: [{ id: 'c1', kind: 'locale', parameters: { locale: 'English' } }],
    actions: [
      { id: 'a1', kind: 'create_draft', parameters: { template: 'Blog announce' } },
      { id: 'a2', kind: 'request_approval', parameters: {} },
    ],
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

describe('ruleSentence', () => {
  it('reads as one sentence naming the trigger, the condition and every action', () => {
    const sentence = ruleSentence({ draft: draft(), t, labels });
    expect(sentence).toContain('a new item appears in Acme blog');
    expect(sentence).toContain('the content language is English');
    expect(sentence).toContain('create a draft from Blog announce');
    expect(sentence).toContain('request human approval');
    expect(sentence).toContain('I turn this off');
  });

  it('uses the no conditions phrasing rather than an empty clause', () => {
    const sentence = ruleSentence({ draft: draft({ conditions: [] }), t, labels });
    expect(sentence.startsWith('When a new item appears in Acme blog, then')).toBe(true);
  });

  it('joins several actions with a locale aware list, not a bare comma', () => {
    const sentence = ruleSentence({ draft: draft(), t, labels });
    expect(sentence).toContain('and request human approval');
  });

  it('renders a missing parameter as a stated absence, never as an empty gap', () => {
    const sentence = ruleSentence({
      draft: draft({ trigger: { kind: 'rss_item', parameters: { feed: null } } }),
      t,
      labels,
    });
    expect(sentence).toContain('not set');
  });

  it('names the run count when the rule stops after a number of runs', () => {
    const sentence = ruleSentence({
      draft: draft({ end: { kind: 'count', runs: 12 } }),
      t,
      labels,
    });
    expect(sentence).toContain('it has run 12 times');
  });

  it('states the delay when there is one', () => {
    const sentence = ruleSentence({
      draft: draft({ delaySeconds: 5400 }),
      t,
      labels,
    });
    expect(sentence).toMatch(/1 hr/);
  });

  it('never renders a raw message key', () => {
    const sentence = ruleSentence({ draft: draft(), t, labels });
    expect(sentence).not.toMatch(/automation\./);
  });
});
