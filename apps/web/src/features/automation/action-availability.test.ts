import { describe, expect, it } from 'vitest';

import { ACTIONS } from './catalog';
import {
  hiddenReasonKey,
  resolveActionAvailability,
  type ConnectionCapabilities,
} from './action-availability';

const everything: Readonly<Record<string, 'supported'>> = {
  publish: 'supported',
  repost: 'supported',
  quote_post: 'supported',
  comment_create: 'supported',
  thread: 'supported',
  first_comment: 'supported',
};

function connection(overrides: Partial<ConnectionCapabilities> = {}): ConnectionCapabilities {
  return {
    connectionId: 'conn_a',
    provider: 'x',
    displayName: 'Acme',
    capabilities: everything,
    ...overrides,
  };
}

describe('resolveActionAvailability', () => {
  it('offers the whole catalog before any account is chosen', () => {
    expect(resolveActionAvailability([]).available).toEqual(ACTIONS);
    expect(resolveActionAvailability([]).hidden).toEqual([]);
  });

  it('hides an action the provider does not offer, rather than disabling it', () => {
    const result = resolveActionAvailability([
      connection({
        provider: 'instagram',
        capabilities: { ...everything, repost: 'unsupported' },
      }),
    ]);
    expect(result.available.some((spec) => spec.kind === 'repost')).toBe(false);
    expect(result.hidden.map((entry) => entry.kind)).toContain('repost');
  });

  it('separates "the provider does not offer this" from "we have not built it"', () => {
    const unsupported = resolveActionAvailability([
      connection({ capabilities: { ...everything, quote_post: 'unsupported' } }),
    ]).hidden.find((entry) => entry.kind === 'quote_post');
    const notBuilt = resolveActionAvailability([
      connection({ capabilities: { ...everything, quote_post: 'not_implemented' } }),
    ]).hidden.find((entry) => entry.kind === 'quote_post');

    expect(unsupported?.support).toBe('unsupported');
    expect(notBuilt?.support).toBe('not_implemented');
    expect(hiddenReasonKey('unsupported')).not.toBe(hiddenReasonKey('not_implemented'));
  });

  it('hides an action unless every selected account supports it', () => {
    const result = resolveActionAvailability([
      connection(),
      connection({
        connectionId: 'conn_b',
        provider: 'youtube',
        displayName: 'Acme Channel',
        capabilities: { ...everything, comment_create: 'not_implemented' },
      }),
    ]);
    expect(result.available.some((spec) => spec.kind === 'follow_up_comment')).toBe(false);
    const hidden = result.hidden.find((entry) => entry.kind === 'follow_up_comment');
    expect(hidden?.displayName).toBe('Acme Channel');
  });

  it('never hides an action that needs no platform capability', () => {
    const result = resolveActionAvailability([
      connection({
        capabilities: {
          publish: 'unsupported',
          repost: 'unsupported',
          quote_post: 'unsupported',
          comment_create: 'unsupported',
          thread: 'unsupported',
          first_comment: 'unsupported',
        },
      }),
    ]);
    expect(result.available.map((spec) => spec.kind)).toContain('create_draft');
    expect(result.available.map((spec) => spec.kind)).toContain('request_approval');
    expect(result.available.map((spec) => spec.kind)).toContain('notify_workspace');
  });

  it('treats an unknown capability key as unavailable rather than as permitted', () => {
    const result = resolveActionAvailability([connection({ capabilities: {} })]);
    expect(result.available.some((spec) => spec.kind === 'repost')).toBe(false);
  });
});
