import type { RealtimeEvent } from '@relay/contracts';
import { realtimeChannel } from '@relay/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RealtimeHub, type RealtimeSubscriberClient } from './realtime-hub';
import { RecordingLogger, asLogger } from '../../testing/fakes';

const WORKSPACE_A = 'ws_01j0000000000000000000000a';
const WORKSPACE_B = 'ws_01j0000000000000000000000b';
const JOB = 'job_01j0000000000000000000000a';

function event(workspaceId: string, id = '1725357600000-1'): RealtimeEvent {
  return {
    id,
    type: 'post.status',
    workspaceId,
    occurredAt: '2026-09-03T10:00:00.000Z',
    data: { type: 'post.status', publishJobId: JOB, contentItemId: null, state: 'published' },
  };
}

/** A pub/sub double that lets a test announce an id the way Redis would. */
function fakeSubscriber(): RealtimeSubscriberClient & {
  readonly channels: Set<string>;
  readonly subscribeCalls: string[];
  readonly unsubscribeCalls: string[];
  announce(channel: string, id: string): void;
} {
  const listeners: ((channel: string, message: string) => void)[] = [];
  const channels = new Set<string>();
  const subscribeCalls: string[] = [];
  const unsubscribeCalls: string[] = [];
  return {
    channels,
    subscribeCalls,
    unsubscribeCalls,
    subscribe(channel) {
      subscribeCalls.push(channel);
      channels.add(channel);
      return Promise.resolve(1);
    },
    unsubscribe(channel) {
      unsubscribeCalls.push(channel);
      channels.delete(channel);
      return Promise.resolve(1);
    },
    on(_event, listener) {
      listeners.push(listener);
      return undefined;
    },
    announce(channel, id) {
      for (const listener of listeners) {
        listener(channel, id);
      }
    },
  };
}

/** A stream that answers `readAt` from what a test put in it, per workspace. */
function fakeReader(entries: Map<string, RealtimeEvent>) {
  return {
    readAt: (workspaceId: string, id: string): Promise<RealtimeEvent | null> => {
      const found = entries.get(`${workspaceId}|${id}`) ?? null;
      return Promise.resolve(found);
    },
  };
}

let subscriber: ReturnType<typeof fakeSubscriber>;
let entries: Map<string, RealtimeEvent>;
let hub: RealtimeHub;

beforeEach(() => {
  subscriber = fakeSubscriber();
  entries = new Map();
  hub = new RealtimeHub({
    subscriber,
    reader: fakeReader(entries),
    logger: asLogger(new RecordingLogger()),
  });
});

/** Let the hub's read-then-deliver microtasks run. */
async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

describe('RealtimeHub', () => {
  it('delivers one event to every client watching that workspace', async () => {
    const first = { send: vi.fn() };
    const second = { send: vi.fn() };
    await hub.add(WORKSPACE_A, first);
    await hub.add(WORKSPACE_A, second);
    entries.set(`${WORKSPACE_A}|1725357600000-1`, event(WORKSPACE_A));

    subscriber.announce(realtimeChannel(WORKSPACE_A), '1725357600000-1');
    await settle();

    expect(first.send).toHaveBeenCalledWith(event(WORKSPACE_A));
    expect(second.send).toHaveBeenCalledWith(event(WORKSPACE_A));
  });

  it('never writes another workspace event to a watching client', async () => {
    const watchingA = { send: vi.fn() };
    await hub.add(WORKSPACE_A, watchingA);
    entries.set(`${WORKSPACE_B}|1725357600000-1`, event(WORKSPACE_B));

    subscriber.announce(realtimeChannel(WORKSPACE_B), '1725357600000-1');
    await settle();

    expect(watchingA.send).not.toHaveBeenCalled();
  });

  it('drops an entry whose payload names a workspace other than its channel', async () => {
    const watchingA = { send: vi.fn() };
    await hub.add(WORKSPACE_A, watchingA);
    // A mis-keyed write: workspace A's stream holding workspace B's event.
    entries.set(`${WORKSPACE_A}|1725357600000-1`, event(WORKSPACE_B));

    subscriber.announce(realtimeChannel(WORKSPACE_A), '1725357600000-1');
    await settle();

    expect(watchingA.send).not.toHaveBeenCalled();
  });

  it('subscribes once for a workspace however many clients it has', async () => {
    await hub.add(WORKSPACE_A, { send: vi.fn() });
    await hub.add(WORKSPACE_A, { send: vi.fn() });

    expect(subscriber.subscribeCalls).toEqual([realtimeChannel(WORKSPACE_A)]);
  });

  it('unsubscribes only when the last client for a workspace leaves', async () => {
    const releaseFirst = await hub.add(WORKSPACE_A, { send: vi.fn() });
    const releaseSecond = await hub.add(WORKSPACE_A, { send: vi.fn() });

    releaseFirst();
    expect(subscriber.unsubscribeCalls).toEqual([]);
    expect(hub.size(WORKSPACE_A)).toBe(1);

    releaseSecond();
    expect(subscriber.unsubscribeCalls).toEqual([realtimeChannel(WORKSPACE_A)]);
    expect(hub.size(WORKSPACE_A)).toBe(0);
  });

  it('stops writing to a client that has been released', async () => {
    const sink = { send: vi.fn() };
    const release = await hub.add(WORKSPACE_A, sink);
    entries.set(`${WORKSPACE_A}|1725357600000-1`, event(WORKSPACE_A));
    release();

    subscriber.announce(realtimeChannel(WORKSPACE_A), '1725357600000-1');
    await settle();

    expect(sink.send).not.toHaveBeenCalled();
  });

  it('keeps delivering to the other clients when one throws', async () => {
    const broken = {
      send: vi.fn(() => {
        throw new Error('socket already closed');
      }),
    };
    const healthy = { send: vi.fn() };
    await hub.add(WORKSPACE_A, broken);
    await hub.add(WORKSPACE_A, healthy);
    entries.set(`${WORKSPACE_A}|1725357600000-1`, event(WORKSPACE_A));

    subscriber.announce(realtimeChannel(WORKSPACE_A), '1725357600000-1');
    await settle();

    expect(healthy.send).toHaveBeenCalledTimes(1);
  });

  it('ignores a channel it did not build', async () => {
    const sink = { send: vi.fn() };
    await hub.add(WORKSPACE_A, sink);

    subscriber.announce('somebody:elses:channel', '1725357600000-1');
    await settle();

    expect(sink.send).not.toHaveBeenCalled();
  });

  it('keeps the connection usable when Redis refuses the subscription', async () => {
    subscriber.subscribe = () => Promise.reject(new Error('ECONNREFUSED'));
    await expect(hub.add(WORKSPACE_A, { send: vi.fn() })).resolves.toBeTypeOf('function');
    expect(hub.size(WORKSPACE_A)).toBe(1);
  });
});
