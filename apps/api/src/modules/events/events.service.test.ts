import { RelayError, type RealtimeEvent } from '@relay/contracts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EventsService, MAX_STREAMS_PER_USER, MAX_STREAMS_PER_WORKSPACE } from './events.service';
import { RealtimeHub } from './realtime-hub';
import { MemoryKeyValueStore } from '../../runtime/redis-key-value-store';
import { RecordingLogger, asLogger } from '../../testing/fakes';
import type { ActorContext } from '../../application/port';

const WORKSPACE_A = 'ws_01j0000000000000000000000a';
const WORKSPACE_B = 'ws_01j0000000000000000000000b';

function actor(overrides: Partial<ActorContext> = {}): ActorContext {
  return {
    actorType: 'user',
    actorId: 'user_01j0000000000000000000000a',
    workspaceId: WORKSPACE_A,
    scopes: ['accounts:read'],
    surface: 'web',
    correlationId: 'corr-1',
    approvalLevel: 'level_0_read',
    locale: 'en',
    ...overrides,
  };
}

function event(workspaceId: string, id: string): RealtimeEvent {
  return {
    id,
    type: 'post.status',
    workspaceId,
    occurredAt: '2026-09-03T10:00:00.000Z',
    data: {
      type: 'post.status',
      publishJobId: 'job_01j0000000000000000000000a',
      contentItemId: null,
      state: 'published',
    },
  };
}

let kv: MemoryKeyValueStore;
let readRecent: ReturnType<typeof vi.fn>;
let service: EventsService;

beforeEach(() => {
  kv = new MemoryKeyValueStore();
  readRecent = vi.fn(() => Promise.resolve([]));
  const hub = new RealtimeHub({
    subscriber: {
      subscribe: () => Promise.resolve(1),
      unsubscribe: () => Promise.resolve(1),
      on: () => undefined,
    },
    reader: { readAt: () => Promise.resolve(null) },
    logger: asLogger(new RecordingLogger()),
  });
  service = new EventsService(kv, hub, { readRecent, readAt: () => Promise.resolve(null) });
});

describe('stream admission', () => {
  it('lets an ordinary connection through', async () => {
    const lease = await service.openStream(actor(), { send: vi.fn() });
    await expect(lease.release()).resolves.toBeUndefined();
  });

  it('refuses a person who has opened more streams than tabs anybody has', async () => {
    for (let index = 0; index < MAX_STREAMS_PER_USER; index += 1) {
      await service.openStream(actor(), { send: vi.fn() });
    }
    await expect(service.openStream(actor(), { send: vi.fn() })).rejects.toBeInstanceOf(RelayError);
  });

  it('refuses a workspace over its cap even when each person is under theirs', async () => {
    for (let index = 0; index < MAX_STREAMS_PER_WORKSPACE; index += 1) {
      await service.openStream(actor({ actorId: `user_${index}` }), { send: vi.fn() });
    }
    await expect(
      service.openStream(actor({ actorId: 'user_last' }), { send: vi.fn() }),
    ).rejects.toBeInstanceOf(RelayError);
  });

  it('gives the slot back so a refused connection does not cost one', async () => {
    for (let index = 0; index < MAX_STREAMS_PER_USER; index += 1) {
      await service.openStream(actor(), { send: vi.fn() });
    }
    await expect(service.openStream(actor(), { send: vi.fn() })).rejects.toBeInstanceOf(RelayError);

    expect(await kv.get(`relay:sse:actor:${WORKSPACE_A}:${actor().actorId}`)).toBe(
      String(MAX_STREAMS_PER_USER),
    );
  });

  it('frees the slot on release, so a reconnecting tab is not locked out', async () => {
    const leases = [];
    for (let index = 0; index < MAX_STREAMS_PER_USER; index += 1) {
      leases.push(await service.openStream(actor(), { send: vi.fn() }));
    }
    await leases[0]?.release();

    await expect(service.openStream(actor(), { send: vi.fn() })).resolves.toBeDefined();
  });

  it('counts a release once however often it is called', async () => {
    const lease = await service.openStream(actor(), { send: vi.fn() });
    await lease.release();
    await lease.release();

    expect(await kv.get(`relay:sse:ws:${WORKSPACE_A}`)).toBe('0');
  });

  it('counts each workspace separately', async () => {
    for (let index = 0; index < MAX_STREAMS_PER_USER; index += 1) {
      await service.openStream(actor(), { send: vi.fn() });
    }
    await expect(
      service.openStream(actor({ workspaceId: WORKSPACE_B }), { send: vi.fn() }),
    ).resolves.toBeDefined();
  });
});

describe('replay', () => {
  it('asks for the caller pinned workspace and never one it was handed', async () => {
    readRecent.mockResolvedValue([event(WORKSPACE_A, '1725357600000-2')]);
    await service.replay(actor(), { since: '1725357600000-1', limit: 10 });

    expect(readRecent).toHaveBeenCalledWith(WORKSPACE_A, {
      since: '1725357600000-1',
      limit: 10,
    });
  });

  it('reads from the tail when the client has seen nothing', async () => {
    await service.replay(actor(), { since: null });
    expect(readRecent).toHaveBeenCalledWith(WORKSPACE_A, { since: null });
  });
});
