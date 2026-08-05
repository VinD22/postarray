import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';
import type { PolarConfig } from '@relay/config';

import {
  HttpPolarClient,
  POLAR_API_BASE_URLS,
  createPolarClient,
  isSimulated,
  polarClientFromSdk,
} from './client.js';
import type { PolarSdkLike } from './client.js';
import { LocalPolarSimulator } from './simulator.js';
import { MutableClock } from './time.js';

const NOW = '2026-08-04T14:00:00.000Z';

const subscriptionBody = {
  id: 'sim_sub_000001',
  status: 'trialing',
  customer_id: 'sim_cust_000001',
  product_id: 'sim_prod_monthly',
  amount: 2_900,
  currency: 'usd',
  recurring_interval: 'month',
  current_period_start: NOW,
  current_period_end: '2026-08-11T14:00:00.000Z',
  cancel_at_period_end: false,
  canceled_at: null,
  started_at: NOW,
  ends_at: null,
  ended_at: null,
  trial_start: NOW,
  trial_end: '2026-08-11T14:00:00.000Z',
  created_at: NOW,
  modified_at: NOW,
  metadata: { workspaceId: 'ws_01' },
  /** A field Polar added after we wrote this parser. It must not break us. */
  some_future_field: 'ignored',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('choosing an implementation', () => {
  const base: PolarConfig = {
    accessToken: undefined,
    webhookSecret: undefined,
    server: 'sandbox',
    monthlyProductId: undefined,
    annualProductId: undefined,
    trialDays: 7,
  };

  it('falls back to the local simulator when no access token is configured', () => {
    const client = createPolarClient({ config: base, clock: new MutableClock(NOW) });
    expect(client).toBeInstanceOf(LocalPolarSimulator);
    expect(isSimulated(client)).toBe(true);
    expect(client.mode).toBe('simulator');
  });

  it('uses the live client when a token is present', () => {
    const client = createPolarClient({
      config: { ...base, accessToken: 'polar_at_example' },
      clock: new MutableClock(NOW),
      fetchImpl: async () => jsonResponse({}),
    });
    expect(client).toBeInstanceOf(HttpPolarClient);
    expect(isSimulated(client)).toBe(false);
  });

  it('switches base url between sandbox and production', () => {
    expect(POLAR_API_BASE_URLS.sandbox).not.toBe(POLAR_API_BASE_URLS.production);
  });
});

describe('the live client parses at the boundary', () => {
  function clientWith(handler: (url: string, init: RequestInit) => Response): HttpPolarClient {
    return new HttpPolarClient({
      accessToken: 'polar_at_example',
      server: 'sandbox',
      fetchImpl: async (input, init) => handler(String(input), init ?? {}),
    });
  }

  it('normalises a subscription and tolerates unknown fields', async () => {
    const client = clientWith(() => jsonResponse(subscriptionBody));
    const subscription = await client.getSubscription('sim_sub_000001');
    expect(subscription?.currency).toBe('USD');
    expect(subscription?.interval).toBe('month');
    expect(subscription?.metadata.workspaceId).toBe('ws_01');
  });

  it('returns null rather than throwing on a 404', async () => {
    const client = clientWith(() => jsonResponse({ detail: 'not found' }, 404));
    await expect(client.getSubscription('sim_sub_missing')).resolves.toBeNull();
  });

  it('classifies a 500 as retryable and a 400 as permanent', async () => {
    const transient = clientWith(() => jsonResponse({ detail: 'oops' }, 503));
    await expect(transient.getProduct('sim_prod_monthly')).rejects.toMatchObject({
      code: 'PROVIDER_TRANSIENT',
      retryable: true,
    });

    const permanent = clientWith(() => jsonResponse({ detail: 'bad' }, 400));
    await expect(permanent.getProduct('sim_prod_monthly')).rejects.toMatchObject({
      code: 'PROVIDER_PERMANENT',
      retryable: false,
    });
  });

  it('raises a validation error rather than casting an unusable payload', async () => {
    const client = clientWith(() => jsonResponse({ id: 'sim_sub_1' }));
    await expect(client.getSubscription('sim_sub_1')).rejects.toBeInstanceOf(RelayError);
  });

  it('passes the idempotency key through on checkout creation', async () => {
    let seenKey: string | undefined;
    const client = clientWith((_url, init) => {
      const headers = (init.headers ?? {}) as Record<string, string>;
      seenKey = headers['idempotency-key'];
      return jsonResponse({
        id: 'sim_checkout_1',
        status: 'open',
        url: 'https://polar.simulator.example.test/checkout/sim_checkout_1',
        product_id: 'sim_prod_monthly',
        customer_id: null,
        customer_email: null,
        success_url: 'https://app.example.test/billing/return',
        expires_at: '2026-08-05T14:00:00.000Z',
        created_at: NOW,
        modified_at: NOW,
        metadata: {},
      });
    });
    await client.createCheckout({
      productId: 'sim_prod_monthly',
      successUrl: 'https://app.example.test/billing/return',
      idempotencyKey: 'checkout-ws_01-0001',
    });
    expect(seenKey).toBe('checkout-ws_01-0001');
  });

  it('sends nothing at all when there is no usage to report', async () => {
    let called = 0;
    const client = clientWith(() => {
      called += 1;
      return jsonResponse({});
    });
    await expect(client.ingestUsage([])).resolves.toEqual({ accepted: 0 });
    expect(called).toBe(0);
  });
});

describe('the official SDK adapter', () => {
  it('re-parses every SDK result with our own schemas', async () => {
    const sdk: PolarSdkLike = {
      products: { get: async () => ({}) },
      customers: { get: async () => ({}) },
      checkouts: { create: async () => ({}), get: async () => ({}) },
      subscriptions: {
        get: async () => subscriptionBody,
        list: async () => ({
          items: [subscriptionBody],
          pagination: { total_count: 1, max_page: 1 },
        }),
        update: async () => subscriptionBody,
      },
      orders: { get: async () => ({}), list: async () => ({ items: [] }) },
      customerSessions: { create: async () => ({}) },
      events: { ingest: async () => ({}) },
    };
    const client = polarClientFromSdk(sdk, 'sandbox');
    const subscription = await client.getSubscription('sim_sub_000001');
    expect(subscription?.currency).toBe('USD');

    const page = await client.listSubscriptions({});
    expect(page.items).toHaveLength(1);
    expect(page.nextPage).toBeNull();

    await expect(client.getProduct('sim_prod_monthly')).rejects.toBeInstanceOf(RelayError);
  });
});
