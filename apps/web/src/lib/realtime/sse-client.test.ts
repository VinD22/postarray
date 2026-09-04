import { describe, expect, it } from 'vitest';

import { parseFrames, reconnectDelayMs } from './sse-client';

describe('parseFrames', () => {
  it('decodes one event', () => {
    const { frames, rest } = parseFrames(
      'id: 1725357600000-1\nevent: post.status\ndata: {"a":1}\n\n',
    );

    expect(frames).toEqual([{ id: '1725357600000-1', event: 'post.status', data: '{"a":1}' }]);
    expect(rest).toBe('');
  });

  it('keeps a half arrived frame for the next chunk', () => {
    const first = parseFrames('data: {"a":1}\n\ndata: {"b":');
    expect(first.frames).toHaveLength(1);

    const second = parseFrames(`${first.rest}2}\n\n`);
    expect(second.frames[0]?.data).toBe('{"b":2}');
  });

  it('ignores the heartbeat, which carries nothing by design', () => {
    expect(parseFrames(': ping\n\n').frames).toEqual([]);
  });

  it('accepts the line endings a proxy might rewrite', () => {
    const { frames } = parseFrames('id: 1-0\r\ndata: {}\r\n\r\n');
    expect(frames).toEqual([{ id: '1-0', event: 'message', data: '{}' }]);
  });

  it('joins a payload split across several data lines', () => {
    const { frames } = parseFrames('data: line one\ndata: line two\n\n');
    expect(frames[0]?.data).toBe('line one\nline two');
  });

  it('reports no id when the server sent none, so the resume point is unchanged', () => {
    expect(parseFrames('data: {}\n\n').frames[0]?.id).toBeNull();
  });
});

describe('reconnectDelayMs', () => {
  it('waits longer after each consecutive failure', () => {
    const first = reconnectDelayMs(1, () => 1);
    const third = reconnectDelayMs(3, () => 1);
    expect(third).toBeGreaterThan(first);
  });

  it('never waits more than half a minute', () => {
    expect(reconnectDelayMs(50, () => 1)).toBeLessThanOrEqual(30_000);
  });

  it('spreads reconnects, so a deploy does not bring every tab back at once', () => {
    expect(reconnectDelayMs(4, () => 0)).not.toBe(reconnectDelayMs(4, () => 1));
  });
});
