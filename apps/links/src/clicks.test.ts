import { describe, expect, it, vi } from 'vitest';

import { createLogger } from '@relay/observability';

import { createBufferedClickSink, createMemoryClickSink } from './clicks';
import type { ClickEvent } from './types';

const logger = createLogger({ service: 'links' }, { level: 'silent', pretty: false });

function event(index: number): ClickEvent {
  return {
    linkId: `lnk_${index}`,
    workspaceId: 'ws_1',
    occurredAt: '2026-08-04T12:00:00.000Z',
    countryCode: 'DE',
    deviceClass: 'desktop',
    referrerClass: 'direct',
    botClass: 'human',
    dedupeKey: `key-${index}`,
    dedupeExpiresAt: '2026-08-05T12:00:00.000Z',
  };
}

describe('createBufferedClickSink', () => {
  it('does not write inline and flushes in batches', async () => {
    const batches: (readonly ClickEvent[])[] = [];
    const sink = createBufferedClickSink({
      logger,
      maxBatchSize: 3,
      flushIntervalMs: 5,
      write: async (events) => {
        batches.push(events);
      },
    });

    sink.record(event(1));
    sink.record(event(2));
    expect(batches).toHaveLength(0);

    sink.record(event(3));
    await sink.flush();
    expect(batches).toHaveLength(1);
    expect(batches[0]).toHaveLength(3);
    await sink.close();
  });

  it('drops the oldest events rather than growing without bound', async () => {
    const written: ClickEvent[] = [];
    const sink = createBufferedClickSink({
      logger,
      maxBatchSize: 1000,
      maxBufferedEvents: 4,
      flushIntervalMs: 60_000,
      write: async (events) => {
        written.push(...events);
      },
    });
    for (let index = 0; index < 10; index += 1) {
      sink.record(event(index));
    }
    expect(sink.bufferedCount).toBe(4);
    expect(sink.droppedCount).toBe(6);
    await sink.flush();
    expect(written.map((entry) => entry.linkId)).toEqual(['lnk_6', 'lnk_7', 'lnk_8', 'lnk_9']);
    await sink.close();
  });

  it('survives a failing writer without blocking the caller', async () => {
    const write = vi.fn(async () => {
      throw new Error('database is unhappy');
    });
    const sink = createBufferedClickSink({ logger, maxBatchSize: 1, flushIntervalMs: 5, write });
    sink.record(event(1));
    await sink.flush();
    expect(write).toHaveBeenCalledTimes(1);
    expect(sink.droppedCount).toBe(1);
    await sink.close();
  });

  it('stops accepting events after close', async () => {
    const sink = createBufferedClickSink({ logger, write: async () => undefined });
    await sink.close();
    sink.record(event(1));
    expect(sink.bufferedCount).toBe(0);
    expect(sink.droppedCount).toBe(1);
  });
});

describe('createMemoryClickSink', () => {
  it('keeps everything for inspection', async () => {
    const sink = createMemoryClickSink();
    sink.record(event(1));
    await sink.flush();
    expect(sink.events).toHaveLength(1);
  });
});
