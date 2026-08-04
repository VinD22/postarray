import { describe, expect, it } from 'vitest';

import { PUBLISH_STATES } from './enums.js';
import type { PublishState } from './enums.js';
import {
  IDEMPOTENCY_KEY_MIN_LENGTH,
  PUBLISH_TRANSITIONS,
  TERMINAL_PUBLISH_STATES,
  canTransition,
  idempotencyKeySchema,
  isIdempotencyMismatch,
  isTerminal,
  nextStates,
  rollUpCampaignState,
} from './publishing.js';

const CHECKSUM_A = 'a'.repeat(64);
const CHECKSUM_B = 'b'.repeat(64);

function reachableFrom(start: PublishState): Set<PublishState> {
  const seen = new Set<PublishState>([start]);
  const queue: PublishState[] = [start];
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined) {
      break;
    }
    for (const target of PUBLISH_TRANSITIONS[current]) {
      if (!seen.has(target)) {
        seen.add(target);
        queue.push(target);
      }
    }
  }
  return seen;
}

describe('PUBLISH_TRANSITIONS', () => {
  it('covers exactly the declared state set', () => {
    expect(Object.keys(PUBLISH_TRANSITIONS).sort()).toEqual([...PUBLISH_STATES].sort());
  });

  it('only ever points at known states and never at itself', () => {
    for (const state of PUBLISH_STATES) {
      for (const target of PUBLISH_TRANSITIONS[state]) {
        expect(PUBLISH_STATES).toContain(target);
        expect(target).not.toBe(state);
      }
      expect(new Set(PUBLISH_TRANSITIONS[state]).size).toBe(PUBLISH_TRANSITIONS[state].length);
    }
  });

  it('makes every state reachable from draft', () => {
    const reachable = reachableFrom('draft');
    for (const state of PUBLISH_STATES) {
      expect(reachable.has(state)).toBe(true);
    }
  });

  it('gives terminal states no outgoing edges', () => {
    for (const state of TERMINAL_PUBLISH_STATES) {
      expect(PUBLISH_TRANSITIONS[state]).toEqual([]);
      expect(isTerminal(state)).toBe(true);
    }
    const nonTerminal = PUBLISH_STATES.filter((state) => !isTerminal(state));
    for (const state of nonTerminal) {
      expect(nextStates(state).length).toBeGreaterThan(0);
    }
  });

  it('never re-enters a terminal state from itself and keeps the set minimal', () => {
    const withoutEdges = PUBLISH_STATES.filter(
      (state) => PUBLISH_TRANSITIONS[state].length === 0,
    );
    expect([...withoutEdges].sort()).toEqual([...TERMINAL_PUBLISH_STATES].sort());
  });
});

describe('canTransition', () => {
  it('allows the documented happy path', () => {
    expect(canTransition('draft', 'approval_requested')).toBe(true);
    expect(canTransition('approval_requested', 'approved')).toBe(true);
    expect(canTransition('approved', 'scheduled')).toBe(true);
    expect(canTransition('scheduled', 'preparing_media')).toBe(true);
    expect(canTransition('preparing_media', 'dispatching')).toBe(true);
    expect(canTransition('dispatching', 'provider_processing')).toBe(true);
    expect(canTransition('provider_processing', 'published')).toBe(true);
  });

  it('refuses to skip approval or resurrect a terminal job', () => {
    expect(canTransition('draft', 'published')).toBe(false);
    expect(canTransition('approval_requested', 'dispatching')).toBe(false);
    expect(canTransition('canceled', 'scheduled')).toBe(false);
    expect(canTransition('failed_permanently', 'retry_scheduled')).toBe(false);
    expect(canTransition('deleted_externally', 'published')).toBe(false);
  });

  it('lets a published root degrade to partially published when a comment fails', () => {
    expect(canTransition('published', 'partially_published')).toBe(true);
    expect(canTransition('partially_published', 'published')).toBe(true);
  });
});

describe('rollUpCampaignState', () => {
  it('reports partial success rather than a false failure', () => {
    expect(rollUpCampaignState(['published', 'failed_permanently'])).toBe('partially_published');
  });

  it('reports published only when every target published', () => {
    expect(rollUpCampaignState(['published', 'published'])).toBe('published');
  });

  it('reports failure only when nothing reached the provider', () => {
    expect(rollUpCampaignState(['failed_permanently', 'canceled'])).toBe('failed_permanently');
  });

  it('surfaces the first unfinished target while work continues', () => {
    expect(rollUpCampaignState(['dispatching', 'failed_permanently'])).toBe('dispatching');
    expect(rollUpCampaignState([])).toBe('draft');
  });
});

describe('idempotency', () => {
  it('accepts opaque client keys and rejects unusable ones', () => {
    expect(idempotencyKeySchema.safeParse('publish-2026-08-04-abc123').success).toBe(true);
    expect(idempotencyKeySchema.safeParse('x'.repeat(IDEMPOTENCY_KEY_MIN_LENGTH - 1)).success).toBe(
      false,
    );
    expect(idempotencyKeySchema.safeParse('has spaces here').success).toBe(false);
    expect(idempotencyKeySchema.safeParse('x'.repeat(256)).success).toBe(false);
  });

  it('flags a replay carrying a different body', () => {
    const stored = {
      workspaceId: 'ws_00000000000000000000000000',
      key: 'publish-abc123',
      requestFingerprint: CHECKSUM_A,
      operationId: null,
      createdAt: '2026-08-04T00:00:00.000Z',
      expiresAt: '2026-08-05T00:00:00.000Z',
    };
    expect(isIdempotencyMismatch(stored, CHECKSUM_A)).toBe(false);
    expect(isIdempotencyMismatch(stored, CHECKSUM_B)).toBe(true);
  });
});
