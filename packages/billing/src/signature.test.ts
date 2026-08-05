import { describe, expect, it } from 'vitest';

import {
  WEBHOOK_HEADER_ID,
  WEBHOOK_HEADER_SIGNATURE,
  WEBHOOK_HEADER_TIMESTAMP,
  constantTimeEquals,
  decodeSigningSecret,
  hashBody,
  signWebhook,
  verifyWebhookSignature,
} from './signature.js';

const SECRET = 'whsec_dGVzdC1zZWNyZXQtbm90LWEtcmVhbC1rZXk=';
const BODY = JSON.stringify({ type: 'subscription.created', data: { id: 'sim_sub_000001' } });
const NOW_SECONDS = 1_785_000_000;

async function headersFor(overrides: Partial<Record<string, string>> = {}) {
  const webhookId = overrides[WEBHOOK_HEADER_ID] ?? 'sim_evt_000001';
  const timestamp = overrides[WEBHOOK_HEADER_TIMESTAMP] ?? String(NOW_SECONDS);
  const signature =
    overrides[WEBHOOK_HEADER_SIGNATURE] ??
    (await signWebhook({
      secret: SECRET,
      webhookId,
      timestampSeconds: Number(timestamp),
      rawBody: BODY,
    }));
  return {
    [WEBHOOK_HEADER_ID]: webhookId,
    [WEBHOOK_HEADER_TIMESTAMP]: timestamp,
    [WEBHOOK_HEADER_SIGNATURE]: signature,
  };
}

describe('standard webhooks signing', () => {
  it('decodes a whsec_ secret from base64 and a bare secret as utf-8', () => {
    expect(decodeSigningSecret(SECRET).byteLength).toBeGreaterThan(0);
    expect(decodeSigningSecret('plain').byteLength).toBe(5);
  });

  it('produces a v1 signature that verifies', async () => {
    const headers = await headersFor();
    expect(headers[WEBHOOK_HEADER_SIGNATURE]?.startsWith('v1,')).toBe(true);
    const result = await verifyWebhookSignature({
      secret: SECRET,
      rawBody: BODY,
      headers,
      nowSeconds: NOW_SECONDS,
    });
    expect(result.state).toBe('verified');
  });

  it('rejects a forged signature', async () => {
    const headers = await headersFor({ [WEBHOOK_HEADER_SIGNATURE]: 'v1,Zm9yZ2Vk' });
    const result = await verifyWebhookSignature({
      secret: SECRET,
      rawBody: BODY,
      headers,
      nowSeconds: NOW_SECONDS,
    });
    expect(result).toMatchObject({ state: 'rejected', reason: 'no_matching_signature' });
  });

  it('rejects a body that changed after signing', async () => {
    const headers = await headersFor();
    const result = await verifyWebhookSignature({
      secret: SECRET,
      rawBody: `${BODY} `,
      headers,
      nowSeconds: NOW_SECONDS,
    });
    expect(result.state).toBe('rejected');
  });

  it('rejects a replay outside the tolerance window', async () => {
    const headers = await headersFor();
    const result = await verifyWebhookSignature({
      secret: SECRET,
      rawBody: BODY,
      headers,
      nowSeconds: NOW_SECONDS + 4_000,
    });
    expect(result).toMatchObject({ state: 'rejected', reason: 'timestamp_outside_tolerance' });
  });

  it('rejects when headers or the secret are missing', async () => {
    const headers = await headersFor();
    await expect(
      verifyWebhookSignature({ secret: undefined, rawBody: BODY, headers, nowSeconds: NOW_SECONDS }),
    ).resolves.toMatchObject({ reason: 'missing_secret' });
    await expect(
      verifyWebhookSignature({ secret: SECRET, rawBody: BODY, headers: {}, nowSeconds: NOW_SECONDS }),
    ).resolves.toMatchObject({ reason: 'missing_headers' });
  });

  it('accepts a rotated secret carried as a second signature', async () => {
    const primary = await signWebhook({
      secret: SECRET,
      webhookId: 'sim_evt_000009',
      timestampSeconds: NOW_SECONDS,
      rawBody: BODY,
    });
    const result = await verifyWebhookSignature({
      secret: SECRET,
      rawBody: BODY,
      headers: {
        [WEBHOOK_HEADER_ID]: 'sim_evt_000009',
        [WEBHOOK_HEADER_TIMESTAMP]: String(NOW_SECONDS),
        [WEBHOOK_HEADER_SIGNATURE]: `v1,b3RoZXI= ${primary}`,
      },
      nowSeconds: NOW_SECONDS,
    });
    expect(result.state).toBe('verified');
  });

  it('is case insensitive about header names', async () => {
    const headers = await headersFor();
    const upper = {
      'Webhook-Id': headers[WEBHOOK_HEADER_ID],
      'Webhook-Timestamp': headers[WEBHOOK_HEADER_TIMESTAMP],
      'Webhook-Signature': headers[WEBHOOK_HEADER_SIGNATURE],
    };
    const result = await verifyWebhookSignature({
      secret: SECRET,
      rawBody: BODY,
      headers: upper,
      nowSeconds: NOW_SECONDS,
    });
    expect(result.state).toBe('verified');
  });

  it('hashes the raw body deterministically', async () => {
    await expect(hashBody(BODY)).resolves.toMatch(/^[0-9a-f]{64}$/);
    expect(await hashBody(BODY)).toBe(await hashBody(BODY));
    expect(await hashBody(BODY)).not.toBe(await hashBody(`${BODY} `));
  });

  it('compares in constant time without leaking length', () => {
    expect(constantTimeEquals('abc', 'abc')).toBe(true);
    expect(constantTimeEquals('abc', 'abd')).toBe(false);
    expect(constantTimeEquals('abc', 'abcd')).toBe(false);
  });
});
