import { API_HEADERS } from '@relay/contracts';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';

import { createHarness, TEST_ORIGIN, type Harness } from './testing/harness';

/**
 * CORS as a real browser experiences it.
 *
 * A misconfigured `allowedHeaders` list does not fail loudly: every unit test
 * that calls the API directly (supertest, `fetch` without `mode: 'cors'`,
 * curl) skips the browser's own preflight enforcement entirely, so the whole
 * suite can be green while a real browser cannot complete a single request.
 * That happened here — `x-relay-api-version`, sent by the web client on every
 * call (`apps/web/src/lib/api/transport.ts`), was missing from
 * `allowedHeaders`, so the preflight for `/v1/auth/signin` failed with
 * `Access-Control-Allow-Headers` not covering it and sign-in was unreachable
 * from any browser. This test issues the exact preflight a browser sends
 * rather than trusting a route test's more permissive transport.
 */

let harness: Harness;

afterEach(async () => {
  await harness.close();
});

describe('CORS preflight', () => {
  it('allows every header the web client sends on every request', async () => {
    harness = await createHarness();

    // These two are unconditional in `performOnce` — set on literally every
    // call the client makes, not opted into per request.
    const alwaysSent = [API_HEADERS.correlationId, API_HEADERS.apiVersion];

    const response = await request(harness.server)
      .options('/v1/auth/signin')
      .set('Origin', TEST_ORIGIN)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', [...alwaysSent, 'content-type'].join(','));

    expect(response.status).toBe(204);
    const allowed = (response.headers['access-control-allow-headers'] ?? '')
      .split(',')
      .map((header: string) => header.trim().toLowerCase());

    for (const header of alwaysSent) {
      expect(allowed, `${header} must be in allowedHeaders`).toContain(header.toLowerCase());
    }
  });

  it('allows the headers a write request adds: idempotency, csrf and workspace', async () => {
    harness = await createHarness();

    // Sent conditionally, but sent on almost every mutating call a signed-in
    // browser makes — a schedule, a publish, anything scoped to a workspace.
    const writeHeaders = [
      API_HEADERS.idempotencyKey,
      API_HEADERS.csrfToken,
      API_HEADERS.workspaceId,
    ];

    const response = await request(harness.server)
      .options('/v1/content')
      .set('Origin', TEST_ORIGIN)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', writeHeaders.join(','));

    expect(response.status).toBe(204);
    const allowed = (response.headers['access-control-allow-headers'] ?? '')
      .split(',')
      .map((header: string) => header.trim().toLowerCase());

    for (const header of writeHeaders) {
      expect(allowed, `${header} must be in allowedHeaders`).toContain(header.toLowerCase());
    }
  });

  it('rejects a header nobody asked to allow, so this test would have caught the bug', async () => {
    harness = await createHarness();

    const response = await request(harness.server)
      .options('/v1/auth/signin')
      .set('Origin', TEST_ORIGIN)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'x-not-a-real-header');

    const allowed = (response.headers['access-control-allow-headers'] ?? '')
      .split(',')
      .map((header: string) => header.trim().toLowerCase());
    expect(allowed).not.toContain('x-not-a-real-header');
  });
});
