import { describe, expect, it, vi } from 'vitest';
import type { DomainEventEnvelope, RealtimeEventInput } from '@relay/contracts';
import type { Logger } from '@relay/observability';

import {
  REALTIME_STREAM_MAX_LEN,
  createRedisRealtimeEventReader,
  createRedisRealtimePublisher,
  realtimeStreamKey,
  workspaceFromRealtimeChannel,
  type RealtimeRedisClient,
} from './redis-realtime-publisher';

const WORKSPACE_A = 'ws_01j0000000000000000000000a';
const WORKSPACE_B = 'ws_01j0000000000000000000000b';
const JOB = 'job_01j0000000000000000000000a';

/** Documented boundary shim: the publisher uses `warn` and nothing else. */
function testLogger(warn: (...args: readonly unknown[]) => void = vi.fn()): Logger {
  return { debug: vi.fn(), info: vi.fn(), warn, error: vi.fn(), child: vi.fn() } as unknown as Logger;
}

const logger = testLogger();

/** A stand-in that records commands rather than a Redis anybody has to run. */
function fakeRedis(): RealtimeRedisClient & {
  readonly calls: { command: string; args: readonly unknown[] }[];
  readonly entries: Map<string, [string, string[]][]>;
} {
  const calls: { command: string; args: readonly unknown[] }[] = [];
  const entries = new Map<string, [string, string[]][]>();
  let sequence = 0;

  return {
    calls,
    entries,
    async xadd(key, ...args) {
      calls.push({ command: 'xadd', args: [key, ...args] });
      sequence += 1;
      const id = `1725357600000-${sequence}`;
      const payload = String(args[args.length - 1]);
      const stream = entries.get(key) ?? [];
      stream.push([id, ['event', payload]]);
      entries.set(key, stream);
      return id;
    },
    async xrange(key, start, end, ...args) {
      calls.push({ command: 'xrange', args: [key, start, end, ...args] });
      const stream = entries.get(key) ?? [];
      if (start === '-') {
        return stream;
      }
      const after = start.slice(1);
      return stream.filter(([id]) => id > after);
    },
    async publish(channel, message) {
      calls.push({ command: 'publish', args: [channel, message] });
      return 1;
    },
    async expire(key, seconds) {
      calls.push({ command: 'expire', args: [key, seconds] });
      return 1;
    },
  };
}

function envelope(overrides: Partial<DomainEventEnvelope> = {}): DomainEventEnvelope {
  return {
    id: 'outbox_01j0000000000000000000000a',
    type: 'post.published',
    workspaceId: WORKSPACE_A,
    occurredAt: '2026-09-03T10:00:00.000Z',
    resourceId: JOB,
    connectionId: null,
    correlationId: null,
    data: {},
    ...overrides,
  };
}

function statusEvent(workspaceId: string): RealtimeEventInput {
  return {
    type: 'post.status',
    workspaceId,
    occurredAt: '2026-09-03T10:00:00.000Z',
    data: { type: 'post.status', publishJobId: JOB, contentItemId: null, state: 'dispatching' },
  };
}

describe('createRedisRealtimePublisher', () => {
  it('appends with a trim bound, refreshes the key expiry, then announces the id', async () => {
    const client = fakeRedis();
    await createRedisRealtimePublisher({ client, logger }).publish(envelope());

    expect(client.calls.map((call) => call.command)).toEqual(['xadd', 'expire', 'publish']);
    expect(client.calls[0]?.args.slice(0, 5)).toEqual([
      realtimeStreamKey(WORKSPACE_A),
      'MAXLEN',
      '~',
      REALTIME_STREAM_MAX_LEN,
      '*',
    ]);
    expect(client.calls[2]?.args[1]).toBe('1725357600000-1');
  });

  it('writes an event only under its own workspace key', async () => {
    const client = fakeRedis();
    const publisher = createRedisRealtimePublisher({ client, logger });
    await publisher.publish(envelope({ workspaceId: WORKSPACE_B }));

    expect([...client.entries.keys()]).toEqual([realtimeStreamKey(WORKSPACE_B)]);
    expect(client.entries.has(realtimeStreamKey(WORKSPACE_A))).toBe(false);
  });

  it('writes nothing for a domain event no screen renders live', async () => {
    const client = fakeRedis();
    await createRedisRealtimePublisher({ client, logger }).publish(
      envelope({ type: 'analytics.updated' }),
    );
    expect(client.calls).toEqual([]);
  });

  it('logs and continues when Redis is unreachable', async () => {
    const client = fakeRedis();
    client.xadd = () => Promise.reject(new Error('ECONNREFUSED'));
    const warn = vi.fn();

    await expect(
      createRedisRealtimePublisher({ client, logger: testLogger(warn) }).publish(envelope()),
    ).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('publishes a status update that has no outbox row behind it', async () => {
    const client = fakeRedis();
    await createRedisRealtimePublisher({ client, logger }).publishStatus(
      statusEvent(WORKSPACE_A),
    );
    expect(client.calls.map((call) => call.command)).toEqual(['xadd', 'expire', 'publish']);
  });
});

describe('createRedisRealtimeEventReader', () => {
  it('replays only what came after the id the client already had', async () => {
    const client = fakeRedis();
    const publisher = createRedisRealtimePublisher({ client, logger });
    await publisher.publishStatus(statusEvent(WORKSPACE_A));
    await publisher.publishStatus(statusEvent(WORKSPACE_A));

    const reader = createRedisRealtimeEventReader(client);
    const replayed = await reader.readRecent(WORKSPACE_A, { since: '1725357600000-1' });

    expect(replayed.map((event) => event.id)).toEqual(['1725357600000-2']);
  });

  it('caps a replay however far behind the client is', async () => {
    const client = fakeRedis();
    const reader = createRedisRealtimeEventReader(client);
    await reader.readRecent(WORKSPACE_A, { since: null, limit: 100_000 });

    expect(client.calls[0]?.args).toEqual([realtimeStreamKey(WORKSPACE_A), '-', '+', 'COUNT', 500]);
  });

  it('reads one workspace and never another', async () => {
    const client = fakeRedis();
    const publisher = createRedisRealtimePublisher({ client, logger });
    await publisher.publishStatus(statusEvent(WORKSPACE_A));

    const reader = createRedisRealtimeEventReader(client);
    expect(await reader.readRecent(WORKSPACE_B, { since: null })).toEqual([]);
  });

  it('drops an entry whose workspace disagrees with the key it was read from', async () => {
    const client = fakeRedis();
    client.entries.set(realtimeStreamKey(WORKSPACE_A), [
      ['1725357600000-1', ['event', JSON.stringify(statusEvent(WORKSPACE_B))]],
    ]);

    const reader = createRedisRealtimeEventReader(client);
    expect(await reader.readRecent(WORKSPACE_A, { since: null })).toEqual([]);
  });

  it('drops an entry that is not the payload we write', async () => {
    const client = fakeRedis();
    client.entries.set(realtimeStreamKey(WORKSPACE_A), [
      ['1725357600000-1', ['event', 'not json']],
      ['1725357600000-2', ['other', '{}']],
    ]);

    const reader = createRedisRealtimeEventReader(client);
    expect(await reader.readRecent(WORKSPACE_A, { since: null })).toEqual([]);
  });
});

describe('workspaceFromRealtimeChannel', () => {
  it('round trips a workspace id', () => {
    expect(workspaceFromRealtimeChannel(realtimeStreamKey(WORKSPACE_A))).toBe(WORKSPACE_A);
  });

  it('refuses to guess at a channel it did not build', () => {
    expect(workspaceFromRealtimeChannel('events:ws_no_braces')).toBeNull();
    expect(workspaceFromRealtimeChannel('something:else')).toBeNull();
  });
});
