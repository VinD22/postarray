import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { toEpochSeconds } from '../../common/instant';
import { signPayload } from '../../security/signing';
import { createHarness, type Harness } from '../../testing/harness';

/**
 * The Polar webhook receiver.
 *
 * The two properties asserted here are the ones that decide whether a forged or
 * repeated message can grant a paid entitlement: the signature is verified over
 * the raw bytes before the body is parsed, and a repeated event id is
 * acknowledged and processed zero times.
 */

const SECRET = 'test-polar-webhook-secret';

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

function send(input: {
  body: string;
  eventId: string;
  timestamp?: number;
  signature?: string;
}): request.Test {
  const timestamp = input.timestamp ?? toEpochSeconds(harness.clock.now());
  return request(harness.server)
    .post('/v1/webhooks/polar')
    .set('content-type', 'application/json')
    .set('webhook-id', input.eventId)
    .set('webhook-timestamp', String(timestamp))
    .set('webhook-signature', input.signature ?? signPayload(SECRET, String(timestamp), input.body))
    .send(input.body);
}

const payload = JSON.stringify({
  type: 'subscription.active',
  data: { id: 'sub_test', status: 'active' },
});

describe('inbound webhook signature', () => {
  it('accepts a correctly signed event and hands it to billing', async () => {
    const response = await send({ body: payload, eventId: 'evt_1' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: true, duplicate: false });
    expect(processed).toEqual([{ eventId: 'evt_1', eventType: 'subscription.active' }]);
  });

  it('rejects a forged signature and processes nothing', async () => {
    const response = await send({
      body: payload,
      eventId: 'evt_forged',
      signature: 'f'.repeat(64),
    });

    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'signature_mismatch' });
    expect(processed).toHaveLength(0);
  });

  it('rejects a signature computed over different bytes', async () => {
    const timestamp = toEpochSeconds(harness.clock.now());
    const response = await send({
      body: payload,
      eventId: 'evt_tampered',
      timestamp,
      signature: signPayload(SECRET, String(timestamp), '{"type":"subscription.canceled"}'),
    });

    // The signature covers the raw bytes, so a body swapped after signing fails
    // before anything parses it.
    expect(response.status).toBe(403);
    expect(processed).toHaveLength(0);
  });

  it('rejects a replayed message outside the five minute window', async () => {
    const stale = toEpochSeconds(harness.clock.now()) - 600;

    const response = await send({ body: payload, eventId: 'evt_stale', timestamp: stale });

    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'signature_stale' });
    expect(processed).toHaveLength(0);
  });

  it('acknowledges a duplicate event id and processes it exactly once', async () => {
    const first = await send({ body: payload, eventId: 'evt_dupe' });
    const second = await send({ body: payload, eventId: 'evt_dupe' });

    expect(first.status).toBe(200);
    // A duplicate must be a 200: an error would make the provider retry forever.
    expect(second.status).toBe(200);
    expect(second.body).toEqual({ received: true, duplicate: true });
    expect(processed).toHaveLength(1);
  });

  it('rejects a message with no signature at all', async () => {
    const response = await request(harness.server)
      .post('/v1/webhooks/polar')
      .set('content-type', 'application/json')
      .set('webhook-id', 'evt_unsigned')
      .send(payload);

    expect(response.status).toBe(403);
    expect(processed).toHaveLength(0);
  });
});
