import { createHmac } from 'node:crypto';

import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { toEpochSeconds } from '../../common/instant';
import { createHarness, type Harness } from '../../testing/harness';

/**
 * The Polar webhook receiver.
 *
 * The properties asserted here are the ones that decide whether a forged or
 * repeated message can grant a paid entitlement: the signature is verified
 * over the raw bytes before the body is parsed, and a repeated event id is
 * acknowledged and processed zero times.
 *
 * Signatures are computed here with node:crypto from the Standard Webhooks
 * definition (https://www.standardwebhooks.com/), not with the module under
 * test, so a receiver that agrees with itself but not with Polar fails.
 */

/** The same fake secret the harness config carries. Not a real key. */
const SECRET = 'whsec_dGVzdC1wb2xhci13ZWJob29rLXNlY3JldC1ub3QtYS1yZWFsLWtleQ==';

/** Secrets Polar generated on or after 2026-09-08: the spec's base64 key. */
const STANDARD_KEY = Buffer.from(SECRET.slice('whsec_'.length), 'base64');
/** Secrets Polar generated before then: the UTF-8 bytes of the whole string. */
const LEGACY_KEY = Buffer.from(SECRET, 'utf8');

function sign(key: Buffer, id: string, timestamp: number, body: string): string {
  const mac = createHmac('sha256', key).update(`${id}.${timestamp}.${body}`, 'utf8').digest();
  return `v1,${mac.toString('base64')}`;
}

let harness: Harness;
let processed: { eventId: string; eventType: string }[] = [];

beforeEach(async () => {
  processed = [];
  harness = await createHarness({
    services: (base) => ({
      ...base,
      billing: {
        ...base.billing,
        handleProviderWebhook: (input) => {
          processed.push({ eventId: input.eventId, eventType: input.eventType });
          return Promise.resolve({ processed: true, duplicate: false });
        },
      },
    }),
  });
});

afterEach(async () => {
  await harness.close();
});

function now(): number {
  return toEpochSeconds(harness.clock.now());
}

function send(input: {
  body: string;
  eventId: string;
  timestamp?: number;
  signature?: string;
  omit?: 'webhook-id' | 'webhook-timestamp' | 'webhook-signature';
}): request.Test {
  const timestamp = input.timestamp ?? now();
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'webhook-id': input.eventId,
    'webhook-timestamp': String(timestamp),
    'webhook-signature':
      input.signature ?? sign(STANDARD_KEY, input.eventId, timestamp, input.body),
  };
  if (input.omit !== undefined) {
    delete headers[input.omit];
  }
  return request(harness.server).post('/v1/webhooks/polar').set(headers).send(input.body);
}

const payload = JSON.stringify({
  type: 'subscription.active',
  data: { id: 'sub_test', status: 'active' },
});

describe('inbound webhook signature', () => {
  it('accepts an event signed with the Standard Webhooks key and hands it to billing', async () => {
    const response = await send({ body: payload, eventId: 'evt_1' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: true, duplicate: false });
    expect(processed).toEqual([{ eventId: 'evt_1', eventType: 'subscription.active' }]);
  });

  it('accepts an event signed with the legacy key of an older Polar secret', async () => {
    const timestamp = now();
    const response = await send({
      body: payload,
      eventId: 'evt_legacy',
      timestamp,
      signature: sign(LEGACY_KEY, 'evt_legacy', timestamp, payload),
    });

    expect(response.status).toBe(200);
    expect(processed).toEqual([{ eventId: 'evt_legacy', eventType: 'subscription.active' }]);
  });

  it('verifies the bytes as sent, not a re-serialization of the parsed body', async () => {
    // Odd spacing and key order that JSON.stringify of the parsed object would not reproduce.
    const body =
      '{ "data" : {"status":"active",  "id":"sub_test"},\n "type":"subscription.active" }';

    const response = await send({ body, eventId: 'evt_raw' });

    expect(response.status).toBe(200);
    expect(processed).toEqual([{ eventId: 'evt_raw', eventType: 'subscription.active' }]);
  });

  it('accepts a header with several signatures when one of them is valid', async () => {
    const timestamp = now();
    const valid = sign(STANDARD_KEY, 'evt_multi', timestamp, payload);
    const response = await send({
      body: payload,
      eventId: 'evt_multi',
      timestamp,
      signature: `v1,Zm9yZ2VkLXNpZ25hdHVyZQ== ${valid}`,
    });

    expect(response.status).toBe(200);
    expect(processed).toHaveLength(1);
  });

  it('rejects a forged signature and processes nothing', async () => {
    const response = await send({
      body: payload,
      eventId: 'evt_forged',
      signature: 'v1,Zm9yZ2VkLXNpZ25hdHVyZQ==',
    });

    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'signature_mismatch' });
    expect(processed).toHaveLength(0);
  });

  it('rejects a signature made with a different secret', async () => {
    const timestamp = now();
    const otherKey = Buffer.from('b3RoZXItc2VjcmV0LW5vdC1hLXJlYWwta2V5', 'base64');
    const response = await send({
      body: payload,
      eventId: 'evt_other_secret',
      timestamp,
      signature: sign(otherKey, 'evt_other_secret', timestamp, payload),
    });

    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'signature_mismatch' });
    expect(processed).toHaveLength(0);
  });

  it('rejects a signature computed over different bytes', async () => {
    const timestamp = now();
    const response = await send({
      body: payload,
      eventId: 'evt_tampered',
      timestamp,
      signature: sign(STANDARD_KEY, 'evt_tampered', timestamp, '{"type":"subscription.canceled"}'),
    });

    // The signature covers the raw bytes, so a body swapped after signing fails
    // before anything parses it.
    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'signature_mismatch' });
    expect(processed).toHaveLength(0);
  });

  it('rejects a valid signature replayed under a different event id', async () => {
    const timestamp = now();
    const response = await send({
      body: payload,
      eventId: 'evt_renamed',
      timestamp,
      signature: sign(STANDARD_KEY, 'evt_original', timestamp, payload),
    });

    // The id is signed, so a replay cannot dodge deduplication by renaming itself.
    expect(response.status).toBe(403);
    expect(processed).toHaveLength(0);
  });

  it('rejects a replayed message outside the five minute window', async () => {
    const stale = now() - 301;

    const response = await send({ body: payload, eventId: 'evt_stale', timestamp: stale });

    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'signature_stale' });
    expect(processed).toHaveLength(0);
  });

  it('rejects a signature header in any other scheme', async () => {
    const timestamp = now();
    const hex = createHmac('sha256', SECRET).update(`${timestamp}.${payload}`).digest('hex');
    const response = await send({
      body: payload,
      eventId: 'evt_hex',
      timestamp,
      signature: `v1=${hex}`,
    });

    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'signature_malformed' });
    expect(processed).toHaveLength(0);
  });

  it.each(['webhook-id', 'webhook-timestamp', 'webhook-signature'] as const)(
    'rejects a message without %s',
    async (omit) => {
      const response = await send({ body: payload, eventId: 'evt_partial', omit });

      expect(response.status).toBe(403);
      expect(response.body.detail).toMatchObject({ reason: 'signature_missing' });
      expect(processed).toHaveLength(0);
    },
  );

  it('acknowledges a duplicate event id and processes it exactly once', async () => {
    const first = await send({ body: payload, eventId: 'evt_dupe' });
    const second = await send({ body: payload, eventId: 'evt_dupe' });

    expect(first.status).toBe(200);
    // A duplicate must be a 200: an error would make the provider retry forever.
    expect(second.status).toBe(200);
    expect(second.body).toEqual({ received: true, duplicate: true });
    expect(processed).toHaveLength(1);
  });
});
