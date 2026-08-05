import { afterEach, describe, expect, it } from 'vitest';

import {
  addSpanEvent,
  isTracingEnabled,
  setSpanAttributes,
  shutdownTracing,
  startTracing,
  withSpan,
} from './tracing';

afterEach(async () => {
  await shutdownTracing();
});

describe('startTracing', () => {
  it('is a no-op when no endpoint is configured', async () => {
    expect(await startTracing('api', { endpoint: '' })).toBe(false);
    expect(isTracingEnabled()).toBe(false);
  });

  it('is a no-op when the endpoint is blank', async () => {
    expect(await startTracing('api', { endpoint: '   ' })).toBe(false);
  });
});

describe('shutdownTracing', () => {
  it('is safe when tracing never started', async () => {
    await expect(shutdownTracing()).resolves.toBeUndefined();
  });
});

describe('withSpan', () => {
  it('returns the result of the wrapped work', async () => {
    const result = await withSpan('publish.dispatch', { provider: 'fake' }, () => 'published');
    expect(result).toBe('published');
  });

  it('awaits an async function', async () => {
    const result = await withSpan('publish.dispatch', {}, async () => {
      await Promise.resolve();
      return 42;
    });
    expect(result).toBe(42);
  });

  it('rethrows the original error unchanged', async () => {
    const failure = new Error('provider rejected the request');
    await expect(
      withSpan('publish.dispatch', { provider: 'x' }, () => {
        throw failure;
      }),
    ).rejects.toBe(failure);
  });

  it('runs the work even with no tracer provider registered', async () => {
    let ran = false;
    await withSpan('noop', {}, () => {
      ran = true;
    });
    expect(ran).toBe(true);
  });
});

describe('span helpers', () => {
  it('never throw without an active span', () => {
    expect(() => setSpanAttributes({ provider: 'x' })).not.toThrow();
    expect(() => addSpanEvent('publish.retry', { attempt: 2 })).not.toThrow();
  });
});
