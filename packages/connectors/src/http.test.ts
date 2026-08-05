import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { ProviderCallError } from './errors';
import { ProviderHttpClient, RateLimitTracker, readRateLimitHeaders } from './http';
import { capturingLogger, fixedClock, recordingSleeper } from './ports';
import { leaseSecret } from './vault';

const okSchema = z.object({ id: z.string() });

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
  });
}

function clientWith(
  responses: readonly (() => Response)[],
  overrides: Partial<ConstructorParameters<typeof ProviderHttpClient>[0]> = {},
): {
  client: ProviderHttpClient;
  calls: () => number;
  sleeper: ReturnType<typeof recordingSleeper>;
} {
  let index = 0;
  const sleeper = recordingSleeper();
  const client = new ProviderHttpClient({
    provider: 'fake',
    clock: fixedClock('2026-08-04T12:00:00.000Z'),
    sleeper,
    random: () => 0.5,
    fetchImpl: async () => {
      const next = responses[Math.min(index, responses.length - 1)];
      index += 1;
      if (next === undefined) {
        throw new Error('NO_RESPONSE_CONFIGURED');
      }
      return next();
    },
    ...overrides,
  });
  return { client, calls: () => index, sleeper };
}

describe('ProviderHttpClient', () => {
  it('parses a successful response with the supplied schema', async () => {
    const { client } = clientWith([() => jsonResponse({ id: 'post-1' })]);
    const response = await client.request({
      method: 'GET',
      url: 'https://fake.invalid/posts/1',
      schema: okSchema,
      operation: 'get_status',
      idempotent: true,
    });
    expect(response.data.id).toBe('post-1');
    expect(response.attempts).toBe(1);
  });

  it('retries a transient failure for an idempotent operation', async () => {
    const { client, calls, sleeper } = clientWith([
      () => jsonResponse({ message: 'boom' }, { status: 503 }),
      () => jsonResponse({ id: 'post-2' }),
    ]);
    const response = await client.request({
      method: 'GET',
      url: 'https://fake.invalid/posts/2',
      schema: okSchema,
      operation: 'get_status',
      idempotent: true,
    });
    expect(response.data.id).toBe('post-2');
    expect(calls()).toBe(2);
    expect(sleeper.waits).toHaveLength(1);
  });

  it('never retries an operation the caller did not declare idempotent', async () => {
    const { client, calls } = clientWith([
      () => jsonResponse({ message: 'boom' }, { status: 503 }),
    ]);
    await expect(
      client.request({
        method: 'POST',
        url: 'https://fake.invalid/posts',
        schema: okSchema,
        operation: 'publish',
        idempotent: false,
      }),
    ).rejects.toBeInstanceOf(ProviderCallError);
    expect(calls()).toBe(1);
  });

  it('never retries a permanent failure', async () => {
    const { client, calls } = clientWith([
      () => jsonResponse({ message: 'not found' }, { status: 404 }),
    ]);
    await expect(
      client.request({
        method: 'GET',
        url: 'https://fake.invalid/posts/3',
        schema: okSchema,
        operation: 'get_status',
        idempotent: true,
      }),
    ).rejects.toBeInstanceOf(ProviderCallError);
    expect(calls()).toBe(1);
  });

  it('classifies a response that does not match the schema as unknown', async () => {
    const { client } = clientWith([() => jsonResponse({ unexpected: true })]);
    try {
      await client.request({
        method: 'GET',
        url: 'https://fake.invalid/posts/4',
        schema: okSchema,
        operation: 'get_status',
        idempotent: false,
      });
      expect.unreachable('a schema mismatch must throw');
    } catch (error) {
      expect(ProviderCallError.is(error)).toBe(true);
      if (ProviderCallError.is(error)) {
        expect(error.classified.errorClass).toBe('UNKNOWN');
      }
    }
  });

  it('sends the credential without ever logging it', async () => {
    const logger = capturingLogger();
    let sentAuthorization: string | null = null;
    const sleeper = recordingSleeper();
    const client = new ProviderHttpClient({
      provider: 'fake',
      clock: fixedClock('2026-08-04T12:00:00.000Z'),
      sleeper,
      logger,
      fetchImpl: async (_url, init) => {
        const headers = (init?.headers ?? {}) as Record<string, string>;
        sentAuthorization = headers['authorization'] ?? null;
        return jsonResponse({ id: 'post-5' });
      },
    });
    const handle = leaseSecret({
      secret: 'super-secret-provider-token',
      credentialKind: 'access_token',
      purpose: 'test',
    });
    await client.request({
      method: 'GET',
      url: 'https://fake.invalid/me',
      schema: okSchema,
      operation: 'get_capabilities',
      idempotent: true,
      auth: { handle },
    });
    handle.release();
    expect(sentAuthorization).toBe('Bearer super-secret-provider-token');
    expect(logger.serialized()).not.toContain('super-secret-provider-token');
  });

  it('exposes rate limit headers and refuses to send once the window is used up', async () => {
    const clock = fixedClock('2026-08-04T12:00:00.000Z');
    const { client } = clientWith(
      [
        () =>
          jsonResponse(
            { id: 'post-6' },
            {
              headers: {
                'x-rate-limit-limit': '300',
                'x-rate-limit-remaining': '0',
                'x-rate-limit-reset': '60',
              },
            },
          ),
      ],
      { clock },
    );
    const first = await client.request({
      method: 'GET',
      url: 'https://fake.invalid/posts/6',
      schema: okSchema,
      operation: 'fetch_metrics',
      idempotent: true,
      bucket: 'metrics',
    });
    expect(first.rateLimit?.remaining).toBe(0);

    await expect(
      client.request({
        method: 'GET',
        url: 'https://fake.invalid/posts/7',
        schema: okSchema,
        operation: 'fetch_metrics',
        idempotent: true,
        bucket: 'metrics',
      }),
    ).rejects.toBeInstanceOf(ProviderCallError);
  });

  it('bounds the backoff and honours a provider reset hint', () => {
    const { client } = clientWith([() => jsonResponse({ id: 'x' })]);
    expect(client.backoffMs(1, null)).toBeGreaterThanOrEqual(0);
    expect(client.backoffMs(10, null)).toBeLessThanOrEqual(30_000);
    expect(client.backoffMs(1, 5)).toBe(5000);
  });
});

describe('readRateLimitHeaders', () => {
  const clock = fixedClock('2026-08-04T12:00:00.000Z');

  it('reads a delta style reset', () => {
    const parsed = readRateLimitHeaders(
      { 'ratelimit-limit': '100', 'ratelimit-remaining': '7', 'ratelimit-reset': '30' },
      clock,
    );
    expect(parsed.remaining).toBe(7);
    expect(parsed.resetAt).toBe('2026-08-04T12:00:30.000Z');
  });

  it('reads an absolute epoch reset', () => {
    const epochSeconds = Math.floor(clock.now().getTime() / 1000) + 45;
    const parsed = readRateLimitHeaders({ 'x-ratelimit-reset': String(epochSeconds) }, clock);
    expect(parsed.resetAt).toBe('2026-08-04T12:00:45.000Z');
  });

  it('returns nulls when the provider sends nothing', () => {
    expect(readRateLimitHeaders({}, clock)).toEqual({
      limit: null,
      remaining: null,
      resetAt: null,
    });
  });
});

describe('RateLimitTracker', () => {
  it('reports how long a bucket must wait', () => {
    const clock = fixedClock('2026-08-04T12:00:00.000Z');
    const tracker = new RateLimitTracker();
    tracker.observe({
      provider: 'x',
      bucket: 'publish',
      headers: { 'x-rate-limit-remaining': '0', 'x-rate-limit-reset': '120' },
      clock,
    });
    expect(tracker.secondsUntilAvailable('x', 'publish', clock)).toBe(120);
    clock.advance(120_000);
    expect(tracker.secondsUntilAvailable('x', 'publish', clock)).toBe(0);
  });

  it('does not wait when the bucket still has room', () => {
    const clock = fixedClock('2026-08-04T12:00:00.000Z');
    const tracker = new RateLimitTracker();
    tracker.observe({
      provider: 'x',
      bucket: 'publish',
      headers: { 'x-rate-limit-remaining': '5', 'x-rate-limit-reset': '120' },
      clock,
    });
    expect(tracker.secondsUntilAvailable('x', 'publish', clock)).toBe(0);
  });
});
