import { describe, expect, it } from 'vitest';

import { FakeClock } from './clock.js';
import { ControllableKeyValueStore } from './kv.js';

function make(): { store: ControllableKeyValueStore; clock: FakeClock } {
  const clock = new FakeClock('2026-08-04T12:00:00.000Z');
  return { store: new ControllableKeyValueStore({ clock }), clock };
}

describe('the controllable key value store', () => {
  it('reads back what it stored, by value', async () => {
    const { store } = make();
    const value = { targets: ['a', 'b'] };
    await store.set('draft:1', value);
    value.targets.push('c');
    expect(await store.get<typeof value>('draft:1')).toEqual({ targets: ['a', 'b'] });
  });

  it('returns null for a key that was never written', async () => {
    const { store } = make();
    expect(await store.get('missing')).toBeNull();
  });

  it('latches on setIfAbsent, which is what makes a request idempotent', async () => {
    const { store } = make();
    expect(await store.setIfAbsent('idem:key-1', { jobId: 'job_1' })).toBe(true);
    expect(await store.setIfAbsent('idem:key-1', { jobId: 'job_2' })).toBe(false);
    expect(await store.get<{ jobId: string }>('idem:key-1')).toEqual({ jobId: 'job_1' });
  });

  it('expires against the injected clock, never against real time', async () => {
    const { store, clock } = make();
    await store.set('idem:key-2', 1, { ttlSeconds: 60 });
    expect(await store.ttlSeconds('idem:key-2')).toBe(60);

    clock.advanceSeconds(59);
    expect(await store.get('idem:key-2')).toBe(1);

    clock.advanceSeconds(2);
    expect(await store.get('idem:key-2')).toBeNull();
    expect(await store.setIfAbsent('idem:key-2', 2)).toBe(true);
  });

  it('extends a ttl and reports when there is none', async () => {
    const { store, clock } = make();
    await store.set('a', 1);
    expect(await store.ttlSeconds('a')).toBeNull();
    expect(await store.expire('a', 30)).toBe(true);
    clock.advanceSeconds(31);
    expect(await store.get('a')).toBeNull();
    expect(await store.expire('a', 30)).toBe(false);
  });

  it('counts, which is how rate and cadence budgets are tested', async () => {
    const { store } = make();
    expect(await store.increment('cadence:x')).toBe(1);
    expect(await store.increment('cadence:x', 4)).toBe(5);
  });

  it('lists live keys under a prefix, in order', async () => {
    const { store, clock } = make();
    await store.set('job:b', 1);
    await store.set('job:a', 1);
    await store.set('other:c', 1, { ttlSeconds: 10 });
    expect(await store.keys('job:')).toEqual(['job:a', 'job:b']);
    clock.advanceSeconds(11);
    expect(await store.keys()).toEqual(['job:a', 'job:b']);
    expect(store.size()).toBe(2);
  });

  it('injects failures so the unhappy path is exercised on purpose', async () => {
    const { store } = make();
    store.failNext('setIfAbsent', 1);
    await expect(store.setIfAbsent('idem:key-3', 1)).rejects.toThrow('KV_UNAVAILABLE');
    await expect(store.setIfAbsent('idem:key-3', 1)).resolves.toBe(true);
  });

  it('records every call so a test can assert on access, not on internals', async () => {
    const { store } = make();
    await store.set('a', 1);
    await store.get('a');
    expect(store.calls).toEqual([
      { operation: 'set', key: 'a' },
      { operation: 'get', key: 'a' },
    ]);
  });

  it('clears everything, including recorded calls and pending failures', async () => {
    const { store } = make();
    await store.set('a', 1);
    store.failNext('get');
    await store.clear();
    expect(store.size()).toBe(0);
    expect(store.calls).toHaveLength(0);
    await expect(store.get('a')).resolves.toBeNull();
  });
});
