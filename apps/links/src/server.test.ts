import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createLogger } from '@relay/observability';
import type { Logger } from '@relay/observability';

import { createKillSwitch } from './cache';
import { fixedClock } from './clock';
import { createMemoryClickSink } from './clicks';
import { createLinksServer } from './server';
import type { LinksServer } from './server';
import { createMemoryShortLinkStore } from './store';
import type { ShortLinkRecord } from './types';

const NOW = Date.parse('2026-08-04T12:30:00.000Z');
const HOST = 'rl.example';

function record(overrides: Partial<ShortLinkRecord> = {}): ShortLinkRecord {
  return {
    linkId: 'lnk_01j0000000000000000000000a',
    workspaceId: 'ws_01j0000000000000000000000b',
    domain: HOST,
    slug: 'spring',
    destinationUrl: 'https://acme.example/spring?utm_source=x',
    state: 'active',
    expiresAt: null,
    safetyVerdict: 'safe',
    ...overrides,
  };
}

const silentLogger: Logger = createLogger({ service: 'links' }, { level: 'silent', pretty: false });

interface Harness {
  readonly server: LinksServer;
  readonly clicks: ReturnType<typeof createMemoryClickSink>;
  readonly store: ReturnType<typeof createMemoryShortLinkStore>;
  readonly clock: ReturnType<typeof fixedClock>;
}

function harness(records: readonly ShortLinkRecord[] = [record()]): Harness {
  const clock = fixedClock(NOW);
  const store = createMemoryShortLinkStore(records);
  const clicks = createMemoryClickSink();
  const server = createLinksServer({
    store,
    clickSink: clicks,
    logger: silentLogger,
    dedupeHashKey: 'test-key-not-a-secret',
    clock,
    killSwitch: createKillSwitch(),
    selfHosts: [HOST],
    abuseReportUrl: 'https://app.example/legal/report',
    rateLimit: { requestLimit: 1000, missLimit: 1000 },
    // Fixtures use RFC 2606 reserved names, which the safety gate correctly
    // refuses as unroutable in production. Declare them routable for the suite.
    safety: { additionalPublicSuffixes: ['.example'] },
  });
  return { server, clicks, store, clock };
}

let current: Harness;

beforeEach(() => {
  current = harness();
});

afterEach(async () => {
  await current.server.app.close();
});

async function get(path: string, headers: Record<string, string> = {}) {
  return current.server.app.inject({
    method: 'GET',
    url: path,
    headers: { host: HOST, ...headers },
  });
}

describe('GET /:slug', () => {
  it('redirects a healthy slug with 302 and no cookie', async () => {
    const response = await get('/spring');
    expect(response.statusCode).toBe(302);
    expect(response.headers['location']).toBe('https://acme.example/spring?utm_source=x');
    expect(response.headers['set-cookie']).toBeUndefined();
    expect(response.headers['referrer-policy']).toBe('no-referrer');
    expect(response.headers['cache-control']).toContain('no-store');
  });

  it('records exactly one privacy-minimizing click with no address or agent', async () => {
    await get('/spring', {
      'user-agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) AppleWebKit/605.1 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
      referer: 'https://www.linkedin.com/feed/',
      'cf-ipcountry': 'de',
      accept: 'text/html',
    });
    expect(current.clicks.events).toHaveLength(1);
    const event = current.clicks.events[0];
    expect(event).toBeDefined();
    if (event === undefined) {
      return;
    }
    expect(event.deviceClass).toBe('mobile');
    expect(event.referrerClass).toBe('social');
    expect(event.botClass).toBe('human');
    expect(event.countryCode).toBe('DE');
    // Coarse to the hour, so a click time is never a timestamp of a person.
    expect(event.occurredAt).toBe('2026-08-04T12:00:00.000Z');
    const serialized = JSON.stringify(event);
    expect(serialized).not.toContain('linkedin');
    expect(serialized).not.toContain('iPhone');
    expect(serialized).not.toContain('127.0.0.1');
  });

  it('gives the same key to a repeat inside the dedupe window', async () => {
    await get('/spring', { 'user-agent': 'Mozilla/5.0 (Macintosh) Chrome/140' });
    current.clock.advance(60_000);
    await get('/spring', { 'user-agent': 'Mozilla/5.0 (Macintosh) Chrome/140' });
    const [first, second] = current.clicks.events;
    expect(first?.dedupeKey).toBeDefined();
    expect(first?.dedupeKey).toBe(second?.dedupeKey);
  });

  it('marks a crawler without refusing it', async () => {
    const response = await get('/spring', { 'user-agent': 'Twitterbot/1.0' });
    expect(response.statusCode).toBe(302);
    expect(current.clicks.events[0]?.botClass).toBe('known_bot');
    expect(current.clicks.events[0]?.deviceClass).toBe('bot');
  });
});

describe('refusals are indistinguishable', () => {
  it('answers unknown, disabled, expired and blocked identically', async () => {
    const clock = fixedClock(NOW);
    const store = createMemoryShortLinkStore([
      record({ slug: 'off', linkId: 'lnk_off', state: 'disabled' }),
      record({ slug: 'gone', linkId: 'lnk_gone', state: 'expired' }),
      record({ slug: 'bad', linkId: 'lnk_bad', state: 'blocked' }),
      record({
        slug: 'stale',
        linkId: 'lnk_stale',
        expiresAt: '2026-08-01T00:00:00.000Z',
      }),
      record({ slug: 'flagged', linkId: 'lnk_flagged', safetyVerdict: 'blocked' }),
    ]);
    const server = createLinksServer({
      store,
      clickSink: createMemoryClickSink(),
      logger: silentLogger,
      dedupeHashKey: 'k',
      clock,
      selfHosts: [HOST],
      rateLimit: { requestLimit: 1000, missLimit: 1000 },
      // Fixtures use RFC 2606 reserved names, which the safety gate correctly
      // refuses as unroutable in production. Declare them routable for the suite.
      safety: { additionalPublicSuffixes: ['.example'] },
    });

    const paths = ['/never-existed', '/off', '/gone', '/bad', '/stale', '/flagged'];
    const responses = await Promise.all(
      paths.map((path) => server.app.inject({ method: 'GET', url: path, headers: { host: HOST } })),
    );

    const bodies = new Set(responses.map((response) => response.body));
    const codes = new Set(responses.map((response) => response.statusCode));
    expect(codes).toEqual(new Set([404]));
    expect(bodies.size, 'every refusal must render the same page apart from its reference').toBe(
      responses.length,
    );
    const withoutReference = new Set(
      responses.map((response) => response.body.replace(/Reference [0-9a-f-]+/, 'Reference X')),
    );
    expect(withoutReference.size).toBe(1);
    await server.app.close();
  });

  it('never redirects to an unsafe destination even if the row says active', async () => {
    const clock = fixedClock(NOW);
    const store = createMemoryShortLinkStore([
      record({ slug: 'ssrf', destinationUrl: 'http://169.254.169.254/latest/meta-data' }),
      record({ slug: 'loop', linkId: 'lnk_loop', destinationUrl: `https://${HOST}/spring` }),
      record({
        slug: 'phish',
        linkId: 'lnk_ph',
        destinationUrl: 'https://bank.example@evil.test/',
      }),
      record({
        slug: 'chain',
        linkId: 'lnk_ch',
        destinationUrl: 'https://ok.example/?url=http://10.0.0.1/',
      }),
    ]);
    const clicks = createMemoryClickSink();
    const server = createLinksServer({
      store,
      clickSink: clicks,
      logger: silentLogger,
      dedupeHashKey: 'k',
      clock,
      selfHosts: [HOST],
      rateLimit: { requestLimit: 1000, missLimit: 1000 },
      // Fixtures use RFC 2606 reserved names, which the safety gate correctly
      // refuses as unroutable in production. Declare them routable for the suite.
      safety: { additionalPublicSuffixes: ['.example'] },
    });
    for (const slug of ['ssrf', 'loop', 'phish', 'chain']) {
      const response = await server.app.inject({
        method: 'GET',
        url: `/${slug}`,
        headers: { host: HOST },
      });
      expect(response.statusCode, slug).toBe(404);
      expect(response.headers['location'], slug).toBeUndefined();
    }
    expect(clicks.events).toHaveLength(0);
    await server.app.close();
  });
});

describe('kill switch', () => {
  it('stops a single link within one request', async () => {
    expect((await get('/spring')).statusCode).toBe(302);
    current.server.killSwitch.apply({
      global: false,
      workspaceIds: [],
      linkIds: ['lnk_01j0000000000000000000000a'],
    });
    expect((await get('/spring')).statusCode).toBe(404);
  });

  it('stops a workspace', async () => {
    current.server.killSwitch.apply({
      global: false,
      workspaceIds: ['ws_01j0000000000000000000000b'],
      linkIds: [],
    });
    expect((await get('/spring')).statusCode).toBe(404);
  });

  it('stops everything', async () => {
    current.server.killSwitch.apply({ global: true, workspaceIds: [], linkIds: [] });
    expect((await get('/spring')).statusCode).toBe(404);
  });
});

describe('enumeration', () => {
  it('throttles a source probing unknown slugs', async () => {
    const clock = fixedClock(NOW);
    const server = createLinksServer({
      store: createMemoryShortLinkStore([record()]),
      clickSink: createMemoryClickSink(),
      logger: silentLogger,
      dedupeHashKey: 'k',
      clock,
      rateLimit: { missLimit: 3, requestLimit: 1000 },
    });
    const probe = (index: number) =>
      server.app.inject({
        method: 'GET',
        url: `/probe${index}`,
        headers: { host: HOST, 'x-forwarded-for': '203.0.113.7' },
      });

    for (let index = 0; index < 3; index += 1) {
      expect((await probe(index)).statusCode).toBe(404);
    }
    const throttled = await probe(99);
    expect(throttled.statusCode).toBe(429);
    expect(throttled.headers['retry-after']).toBeDefined();
    await server.app.close();
  });

  it('rejects a malformed slug without a lookup', async () => {
    const response = await get('/a');
    expect(response.statusCode).toBe(404);
  });
});

describe('static and support routes', () => {
  it('reports health', async () => {
    const response = await get('/healthz');
    expect(response.statusCode).toBe(200);
    const body = response.json() as { status: string; service: string };
    expect(body.status).toBe('ok');
    expect(body.service).toBe('links');
  });

  it('disallows indexing', async () => {
    const response = await get('/robots.txt');
    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('Disallow: /');
  });

  it('accepts an abuse report and returns a reference', async () => {
    const response = await current.server.app.inject({
      method: 'POST',
      url: '/_abuse',
      headers: { host: HOST, 'content-type': 'application/json' },
      payload: { slug: 'spring', reason: 'phishing', detail: 'looks like a bank login' },
    });
    expect(response.statusCode).toBe(202);
    const body = response.json() as { status: string; reference: string };
    expect(body.status).toBe('received');
    expect(body.reference).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('rejects a malformed abuse report', async () => {
    const response = await current.server.app.inject({
      method: 'POST',
      url: '/_abuse',
      headers: { host: HOST, 'content-type': 'application/json' },
      payload: { slug: 'spring', reason: 'whatever' },
    });
    expect(response.statusCode).toBe(400);
  });
});
