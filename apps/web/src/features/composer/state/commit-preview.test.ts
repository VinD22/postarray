import { describe, expect, it } from 'vitest';
import type { CommitPreview } from '@relay/contracts';

import {
  acknowledgedCodes,
  blockerSentence,
  commitAllowed,
  escalationSentence,
  mergedEscalations,
  noteKey,
  type PreviewState,
} from './commit-preview';

const FIRST_USE = {
  code: 'first_use_connection',
  messageKey: 'agent_policy.first_use_connection',
  params: { connectionId: 'conn_2', accountLabel: '@acme', provider: 'linkedin' },
  connectionId: 'conn_2',
};

const IMMEDIATE = {
  code: 'immediate_publish',
  messageKey: 'agent_policy.immediate_publish',
  params: { targetCount: 6 },
};

function preview(overrides: Partial<CommitPreview> = {}): CommitPreview {
  return {
    contentItemId: 'content_1',
    kind: 'schedule',
    targetCount: 6,
    versionChecksum: 'c'.repeat(64),
    externalPublicationCount: 6,
    blockers: [],
    escalations: [FIRST_USE],
    validation: { issues: [] },
    canCommit: true,
    requiresConfirmation: true,
    ...overrides,
  };
}

const ready = (value: CommitPreview): PreviewState => ({ status: 'ready', preview: value });
const label = (provider: string): string => (provider === 'linkedin' ? 'LinkedIn' : provider);

describe('escalation sentences', () => {
  it('names the account and the platform for a first post', () => {
    expect(escalationSentence(FIRST_USE, label)).toEqual({
      key: 'web.commitPreview.escalation.first_use_connection',
      values: expect.objectContaining({ account: '@acme', provider: 'LinkedIn' }),
    });
  });

  it('counts the accounts for publish now', () => {
    expect(escalationSentence(IMMEDIATE, label).values).toEqual(
      expect.objectContaining({ count: 6 }),
    );
  });

  it('falls back to a generic sentence for a code it does not know', () => {
    expect(escalationSentence({ code: 'brand_new', messageKey: 'x', params: {} }, label).key).toBe(
      'web.commitPreview.escalation.other',
    );
    expect(
      blockerSentence({ code: 'outside_allowed_hours', messageKey: 'x', params: {} }).key,
    ).toBe('web.commitPreview.blocker.other');
  });
});

describe('commit gating', () => {
  it('holds the commit until every escalation is ticked', () => {
    const state = ready(preview());
    expect(commitAllowed(state, new Set())).toBe(false);
    expect(commitAllowed(state, new Set([noteKey(FIRST_USE)]))).toBe(true);
  });

  it('holds publish now until immediate_publish and first use are both ticked', () => {
    const state = ready(preview({ kind: 'publish_now', escalations: [IMMEDIATE, FIRST_USE] }));
    expect(commitAllowed(state, new Set([noteKey(IMMEDIATE)]))).toBe(false);
    expect(commitAllowed(state, new Set([noteKey(IMMEDIATE), noteKey(FIRST_USE)]))).toBe(true);
    expect(acknowledgedCodes((state as { preview: CommitPreview }).preview)).toEqual([
      'first_use_connection',
      'immediate_publish',
    ]);
  });

  it('refuses a blocked preview however much is ticked', () => {
    const state = ready(
      preview({
        canCommit: false,
        blockers: [{ code: 'approval_required', messageKey: 'x', params: {} }],
        escalations: [],
      }),
    );
    expect(commitAllowed(state, new Set())).toBe(false);
  });

  it('disables publish now for a role that may not, and lets an unavailable check through', () => {
    expect(commitAllowed({ status: 'forbidden' }, new Set())).toBe(false);
    expect(commitAllowed({ status: 'unavailable' }, new Set())).toBe(true);
    expect(commitAllowed({ status: 'loading' }, new Set())).toBe(false);
  });
});

describe('merged escalations', () => {
  it('shows each note once and marks what only applies to publish now', () => {
    const merged = mergedEscalations(
      ready(preview()),
      ready(preview({ kind: 'publish_now', escalations: [IMMEDIATE, FIRST_USE] })),
    );
    expect(merged.map((entry) => [entry.note.code, entry.publishNowOnly])).toEqual([
      ['first_use_connection', false],
      ['immediate_publish', true],
    ]);
  });
});
