import { describe, expect, it } from 'vitest';

import { parseArgs } from './outbox-replay';

describe('outbox-replay argument parsing', () => {
  it('lists everything by default', () => {
    expect(parseArgs(['--list'])).toEqual({ mode: 'list', kind: null, outboxEventId: null });
  });

  it('lists one kind', () => {
    expect(parseArgs(['--list', '--kind', 'post.published'])).toEqual({
      mode: 'list',
      kind: 'post.published',
      outboxEventId: null,
    });
  });

  it('treats a missing kind value as no filter rather than a kind named after a flag', () => {
    expect(parseArgs(['--list', '--kind'])).toEqual({
      mode: 'list',
      kind: null,
      outboxEventId: null,
    });
    expect(parseArgs(['--list', '--kind', '--json'])).toEqual({
      mode: 'list',
      kind: null,
      outboxEventId: null,
    });
  });

  it('replays one row', () => {
    expect(parseArgs(['--replay', 'evt_123'])).toEqual({
      mode: 'replay',
      kind: null,
      outboxEventId: 'evt_123',
    });
  });

  it('refuses to guess when --replay has no id', () => {
    expect(parseArgs(['--replay']).mode).toBe('help');
  });

  it('prints usage when asked for nothing', () => {
    expect(parseArgs([]).mode).toBe('help');
  });
});
