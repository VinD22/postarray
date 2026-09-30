import { createHmac } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import {
  WEBHOOK_HEADER_ID,
  WEBHOOK_HEADER_SIGNATURE,
  WEBHOOK_HEADER_TIMESTAMP,
  constantTimeEquals,
  hashBody,
  signWebhook,
  signingKeysFor,
  verifyWebhookSignature,
} from './signature';

/**
 * The published Standard Webhooks vector, from the reference library's own
 * test suite ("sign function works"):
 * https://github.com/standard-webhooks/standard-webhooks/blob/main/libraries/javascript/src/webhook.test.ts
 */
const SPEC_SECRET = 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw';
const SPEC_ID = 'msg_p5jXN8AQM9LWM0D4loKWxJek';
const SPEC_TIMESTAMP = 1_614_265_330;
const SPEC_BODY = '{"test": 2432232314}';
const SPEC_SIGNATURE = 'v1,g0hM9SsE+OTPJTGt/tmIKtSyZlE3uFJELVlNIOLJ1OE=';

/** A made-up secret in Polar's dashboard shape. Not a real key. */
const SECRET = 'whsec_dGVzdC1zZWNyZXQtbm90LWEtcmVhbC1rZXk=';
const BODY = JSON.stringify({ type: 'subscription.created', data: { id: 'sim_sub_000001' } });
const WEBHOOK_ID = 'sim_evt_000001';
const NOW_SECONDS = 1_785_000_000;

/** Independent computation with node:crypto, so the module is not checked against itself. */
function nodeSignature(key: Buffer, id: string, timestamp: number, body: string): string {
  const mac = createHmac('sha256', key).update(`${id}.${timestamp}.${body}`, 'utf8').digest();
  return `v1,${mac.toString('base64')}`;
}

/** Polar's post 2026-09-08 key: the spec's base64 decoding of the remainder. */
function standardKey(secret: string): Buffer {
  return Buffer.from(secret.slice('whsec_'.length), 'base64');
}

/** Polar's legacy key: the UTF-8 bytes of the whole secret string. */
function legacyKey(secret: string): Buffer {
  return Buffer.from(secret, 'utf8');
}

function headers(signature: string, overrides: Record<string, string | undefined> = {}) {
  return {
    [WEBHOOK_HEADER_ID]: WEBHOOK_ID,
    [WEBHOOK_HEADER_TIMESTAMP]: String(NOW_SECONDS),
    [WEBHOOK_HEADER_SIGNATURE]: signature,
    ...overrides,
  };
}

function verify(signature: string, overrides: Record<string, string | undefined> = {}) {
  return verifyWebhookSignature({
    secret: SECRET,
    rawBody: BODY,
    headers: headers(signature, overrides),
    nowSeconds: NOW_SECONDS,
  });
}

const STANDARD_SIGNATURE = nodeSignature(standardKey(SECRET), WEBHOOK_ID, NOW_SECONDS, BODY);
const LEGACY_SIGNATURE = nodeSignature(legacyKey(SECRET), WEBHOOK_ID, NOW_SECONDS, BODY);

describe('the published Standard Webhooks vector', () => {
  it('matches node:crypto, so the test helper is itself correct', () => {
    expect(nodeSignature(standardKey(SPEC_SECRET), SPEC_ID, SPEC_TIMESTAMP, SPEC_BODY)).toBe(
      SPEC_SIGNATURE,
    );
  });

  it('is what signWebhook produces with the Standard Webhooks key', async () => {
    await expect(
      signWebhook({
        secret: SPEC_SECRET,
        webhookId: SPEC_ID,
        timestampSeconds: SPEC_TIMESTAMP,
        rawBody: SPEC_BODY,
        keyDerivation: 'standard_webhooks',
      }),
    ).resolves.toBe(SPEC_SIGNATURE);
  });

  it('verifies', async () => {
    const result = await verifyWebhookSignature({
      secret: SPEC_SECRET,
      rawBody: SPEC_BODY,
      headers: {
        [WEBHOOK_HEADER_ID]: SPEC_ID,
        [WEBHOOK_HEADER_TIMESTAMP]: String(SPEC_TIMESTAMP),
        [WEBHOOK_HEADER_SIGNATURE]: SPEC_SIGNATURE,
      },
      nowSeconds: SPEC_TIMESTAMP,
    });
    expect(result).toEqual({
      state: 'verified',
      webhookId: SPEC_ID,
      timestampSeconds: SPEC_TIMESTAMP,
      keyDerivation: 'standard_webhooks',
    });
  });
});

describe('Polar key derivations', () => {
  it('derives the legacy key from the whole string and the spec key from the remainder', () => {
    const keys = signingKeysFor(SECRET);
    expect(keys.map((key) => key.derivation)).toEqual(['polar_legacy', 'standard_webhooks']);
    expect(Buffer.from(keys[0]?.bytes ?? []).equals(legacyKey(SECRET))).toBe(true);
    expect(Buffer.from(keys[1]?.bytes ?? []).equals(standardKey(SECRET))).toBe(true);
  });

  it('gives an unprefixed secret only the legacy key', () => {
    expect(signingKeysFor('plain').map((key) => key.derivation)).toEqual(['polar_legacy']);
    expect(signingKeysFor('whsec_not base64!').map((key) => key.derivation)).toEqual([
      'polar_legacy',
    ]);
  });

  it('accepts a secret generated on or after 2026-09-08 (Standard Webhooks key)', async () => {
    await expect(verify(STANDARD_SIGNATURE)).resolves.toMatchObject({
      state: 'verified',
      keyDerivation: 'standard_webhooks',
    });
  });

  it('accepts a secret generated before 2026-09-08 (UTF-8 bytes of the secret)', async () => {
    await expect(verify(LEGACY_SIGNATURE)).resolves.toMatchObject({
      state: 'verified',
      keyDerivation: 'polar_legacy',
    });
  });

  it('signs with either key on request, matching node:crypto', async () => {
    const input = {
      secret: SECRET,
      webhookId: WEBHOOK_ID,
      timestampSeconds: NOW_SECONDS,
      rawBody: BODY,
    };
    await expect(signWebhook(input)).resolves.toBe(STANDARD_SIGNATURE);
    await expect(signWebhook({ ...input, keyDerivation: 'polar_legacy' })).resolves.toBe(
      LEGACY_SIGNATURE,
    );
  });
});

describe('verifyWebhookSignature', () => {
  it('verifies over raw bytes exactly as over their UTF-8 string', async () => {
    const result = await verifyWebhookSignature({
      secret: SECRET,
      rawBody: Buffer.from(BODY, 'utf8'),
      headers: headers(STANDARD_SIGNATURE),
      nowSeconds: NOW_SECONDS,
    });
    expect(result.state).toBe('verified');
  });

  it('rejects a body that changed after signing', async () => {
    const result = await verifyWebhookSignature({
      secret: SECRET,
      rawBody: `${BODY} `,
      headers: headers(STANDARD_SIGNATURE),
      nowSeconds: NOW_SECONDS,
    });
    expect(result).toMatchObject({ state: 'rejected', reason: 'no_matching_signature' });
  });

  it('rejects a signature made with a different secret', async () => {
    const other = nodeSignature(
      standardKey('whsec_b3RoZXItc2VjcmV0LW5vdC1hLXJlYWwta2V5'),
      WEBHOOK_ID,
      NOW_SECONDS,
      BODY,
    );
    await expect(verify(other)).resolves.toMatchObject({
      state: 'rejected',
      reason: 'no_matching_signature',
    });
  });

  it('rejects a signature bound to a different webhook id', async () => {
    await expect(
      verify(STANDARD_SIGNATURE, { [WEBHOOK_HEADER_ID]: 'sim_evt_000002' }),
    ).resolves.toMatchObject({ state: 'rejected', reason: 'no_matching_signature' });
  });

  it('rejects a stale or future timestamp even with a valid MAC', async () => {
    for (const nowSeconds of [NOW_SECONDS + 301, NOW_SECONDS - 301]) {
      await expect(
        verifyWebhookSignature({
          secret: SECRET,
          rawBody: BODY,
          headers: headers(STANDARD_SIGNATURE),
          nowSeconds,
        }),
      ).resolves.toMatchObject({ state: 'rejected', reason: 'timestamp_outside_tolerance' });
    }
    await expect(
      verifyWebhookSignature({
        secret: SECRET,
        rawBody: BODY,
        headers: headers(STANDARD_SIGNATURE),
        nowSeconds: NOW_SECONDS + 300,
      }),
    ).resolves.toMatchObject({ state: 'verified' });
  });

  it('accepts a header carrying several signatures when one is valid', async () => {
    const header = `v1,Zm9yZ2VkLXNpZ25hdHVyZQ== v1a,c29tZXRoaW5nLWVsc2U= ${STANDARD_SIGNATURE}`;
    await expect(verify(header)).resolves.toMatchObject({ state: 'verified' });
  });

  it('rejects a header carrying several signatures when none is valid', async () => {
    await expect(verify('v1,Zm9yZ2Vk v1,b3RoZXI=')).resolves.toMatchObject({
      state: 'rejected',
      reason: 'no_matching_signature',
    });
  });

  it('rejects when any one of the three headers is missing or empty', async () => {
    for (const name of [WEBHOOK_HEADER_ID, WEBHOOK_HEADER_TIMESTAMP, WEBHOOK_HEADER_SIGNATURE]) {
      await expect(verify(STANDARD_SIGNATURE, { [name]: undefined })).resolves.toMatchObject({
        state: 'rejected',
        reason: 'missing_headers',
      });
      await expect(verify(STANDARD_SIGNATURE, { [name]: '' })).resolves.toMatchObject({
        state: 'rejected',
        reason: 'missing_headers',
      });
    }
  });

  it('rejects when the secret is missing', async () => {
    await expect(
      verifyWebhookSignature({
        secret: undefined,
        rawBody: BODY,
        headers: headers(STANDARD_SIGNATURE),
        nowSeconds: NOW_SECONDS,
      }),
    ).resolves.toMatchObject({ reason: 'missing_secret' });
  });

  it('rejects a signature header with no well-formed v1 entry', async () => {
    const hex = createHmac('sha256', legacyKey(SECRET))
      .update(`${NOW_SECONDS}.${BODY}`)
      .digest('hex');
    // The scheme this receiver used to expect: bare hex, or `v1=<hex>`.
    for (const malformed of [hex, `v1=${hex}`, 'v1,', 'v1,***', 'v2,Zm9v']) {
      await expect(verify(malformed)).resolves.toMatchObject({
        state: 'rejected',
        reason: 'signature_malformed',
      });
    }
  });

  it('rejects a timestamp that is not an integer', async () => {
    for (const timestamp of ['hello', '1785000000abc', '1785000000.5', '-1785000000']) {
      await expect(
        verify(STANDARD_SIGNATURE, { [WEBHOOK_HEADER_TIMESTAMP]: timestamp }),
      ).resolves.toMatchObject({ state: 'rejected', reason: 'timestamp_invalid' });
    }
  });

  it('is case insensitive about header names', async () => {
    const result = await verifyWebhookSignature({
      secret: SECRET,
      rawBody: BODY,
      headers: {
        'Webhook-Id': WEBHOOK_ID,
        'Webhook-Timestamp': String(NOW_SECONDS),
        'Webhook-Signature': STANDARD_SIGNATURE,
      },
      nowSeconds: NOW_SECONDS,
    });
    expect(result.state).toBe('verified');
  });
});

describe('helpers', () => {
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
