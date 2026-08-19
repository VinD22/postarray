import { RelayError } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { FixedClock } from '../ports/clock';
import { MemoryKeyValueStore } from '../ports/key-value';
import type { ActorContext } from '../types';

import { fingerprintOf, publishJobIdempotencyKey, withIdempotency } from './idempotency';

function context(overrides: Partial<ActorContext> = {}): ActorContext {
  return {
    actorType: 'user',
    actorId: 'user-1',
    workspaceId: 'ws-1',
    scopes: [],
    surface: 'api',
    correlationId: 'corr-1',
    approvalLevel: 'level_3_confirm',
    locale: 'en',
    ...overrides,
  };
}

describe('withIdempotency', () => {
  it('runs the operation when no key is supplied', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    let calls = 0;
    const result = await withIdempotency(kv, context(), {
      operation: 'content.createDraft',
      body: { body: 'hello' },
      run: async () => {
        calls += 1;
        return { id: 'content-1' };
      },
    });
    expect(result).toEqual({ id: 'content-1' });
    expect(calls).toBe(1);
  });

  it('replays the stored result for the same workspace and key', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    const ctx = context({ idempotencyKey: 'create-draft-001' });
    let calls = 0;
    const run = async (): Promise<{ id: string }> => {
      calls += 1;
      return { id: `content-${calls}` };
    };

    const first = await withIdempotency(kv, ctx, {
      operation: 'content.createDraft',
      body: { body: 'hello' },
      run,
    });
    const second = await withIdempotency(kv, ctx, {
      operation: 'content.createDraft',
      body: { body: 'hello' },
      run,
    });

    expect(first).toEqual({ id: 'content-1' });
    expect(second).toEqual({ id: 'content-1' });
    expect(calls).toBe(1);
  });

  it('replays regardless of key order in the request body', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    const ctx = context({ idempotencyKey: 'create-draft-002' });
    let calls = 0;
    const run = async (): Promise<{ id: string }> => {
      calls += 1;
      return { id: 'content-1' };
    };

    await withIdempotency(kv, ctx, {
      operation: 'content.createDraft',
      body: { body: 'hello', projectId: 'project-1' },
      run,
    });
    await withIdempotency(kv, ctx, {
      operation: 'content.createDraft',
      body: { projectId: 'project-1', body: 'hello' },
      run,
    });
    expect(calls).toBe(1);
  });

  it('raises IDEMPOTENCY_MISMATCH when the body differs', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    const ctx = context({ idempotencyKey: 'create-draft-003' });
    await withIdempotency(kv, ctx, {
      operation: 'content.createDraft',
      body: { body: 'hello' },
      run: async () => ({ id: 'content-1' }),
    });

    await expect(
      withIdempotency(kv, ctx, {
        operation: 'content.createDraft',
        body: { body: 'a different post entirely' },
        run: async () => ({ id: 'content-2' }),
      }),
    ).rejects.toMatchObject({ code: 'IDEMPOTENCY_MISMATCH' });
  });

  it('isolates the same key in a different workspace', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    let calls = 0;
    const run = async (): Promise<{ id: string }> => {
      calls += 1;
      return { id: `content-${calls}` };
    };
    await withIdempotency(kv, context({ idempotencyKey: 'shared-key-01' }), {
      operation: 'content.createDraft',
      body: { body: 'hello' },
      run,
    });
    const other = await withIdempotency(
      kv,
      context({ idempotencyKey: 'shared-key-01', workspaceId: 'ws-2' }),
      { operation: 'content.createDraft', body: { body: 'hello' }, run },
    );
    expect(other).toEqual({ id: 'content-2' });
    expect(calls).toBe(2);
  });

  it('does not poison the key when the operation fails', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    const ctx = context({ idempotencyKey: 'create-draft-004' });

    await expect(
      withIdempotency(kv, ctx, {
        operation: 'content.createDraft',
        body: { body: 'hello' },
        run: async () => {
          throw new RelayError('INTERNAL');
        },
      }),
    ).rejects.toBeInstanceOf(RelayError);

    const retried = await withIdempotency(kv, ctx, {
      operation: 'content.createDraft',
      body: { body: 'hello' },
      run: async () => ({ id: 'content-1' }),
    });
    expect(retried).toEqual({ id: 'content-1' });
  });

  it('rejects a malformed idempotency key', async () => {
    const kv = new MemoryKeyValueStore(new FixedClock());
    await expect(
      withIdempotency(kv, context({ idempotencyKey: 'no' }), {
        operation: 'content.createDraft',
        body: {},
        run: async () => ({ id: 'content-1' }),
      }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED' });
  });
});

describe('fingerprintOf', () => {
  it('is stable across key ordering', () => {
    expect(fingerprintOf('op', { a: 1, b: 2 })).toBe(fingerprintOf('op', { b: 2, a: 1 }));
  });

  it('separates different operations carrying the same body', () => {
    expect(fingerprintOf('schedule', { a: 1 })).not.toBe(fingerprintOf('publish', { a: 1 }));
  });
});

describe('publishJobIdempotencyKey', () => {
  it('is deterministic for the same version, target and instant', () => {
    const input = {
      contentVersionId: 'version-1',
      connectionId: 'conn-1',
      scheduledInstant: '2026-08-04T10:00:00.000Z',
    };
    expect(publishJobIdempotencyKey(input)).toBe(publishJobIdempotencyKey(input));
  });

  it('differs per target, so two accounts never share one job', () => {
    const base = {
      contentVersionId: 'version-1',
      scheduledInstant: '2026-08-04T10:00:00.000Z',
    };
    expect(publishJobIdempotencyKey({ ...base, connectionId: 'conn-1' })).not.toBe(
      publishJobIdempotencyKey({ ...base, connectionId: 'conn-2' }),
    );
  });

  it('differs when the content version changes', () => {
    const base = {
      connectionId: 'conn-1',
      scheduledInstant: '2026-08-04T10:00:00.000Z',
    };
    expect(publishJobIdempotencyKey({ ...base, contentVersionId: 'v1' })).not.toBe(
      publishJobIdempotencyKey({ ...base, contentVersionId: 'v2' }),
    );
  });

  it('fits inside the wire format for an idempotency key', () => {
    const key = publishJobIdempotencyKey({
      contentVersionId: 'version-1',
      connectionId: 'conn-1',
      scheduledInstant: '2026-08-04T10:00:00.000Z',
    });
    expect(key.length).toBeGreaterThanOrEqual(8);
    expect(key.length).toBeLessThanOrEqual(255);
    expect(key).toMatch(/^[A-Za-z0-9_.:-]+$/);
  });
});
