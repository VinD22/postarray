import { API_HEADERS, newIdFor } from '@relay/contracts';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  TEST_ACCEPT_LANGUAGE,
  TEST_ORIGIN,
  TEST_USER_AGENT,
  createHarness,
  seedSession,
  type Harness,
} from '../../testing/harness';

/**
 * Connecting Bluesky with an app password.
 *
 * The outcome of this route is the same as `oauth/begin`: publishing power over
 * a third-party identity. So the edge properties asserted here are the same
 * ones, plus the one that is specific to a secret arriving in a request body,
 * which is that the secret never reaches a log line.
 */

let harness: Harness;
const connectWithProviderSecret = vi.fn();

const APP_PASSWORD = 'fake-app-password-not-a-real-credential';

beforeEach(async () => {
  connectWithProviderSecret.mockReset();
  harness = await createHarness({
    services: (base) => ({
      ...base,
      connections: { ...base.connections, connectWithProviderSecret },
    }),
  });
});

afterEach(async () => {
  await harness.close();
});

function post(session: Awaited<ReturnType<typeof seedSession>>, body: Record<string, string>) {
  return request(harness.server)
    .post('/v1/connections/secret/begin')
    .set('cookie', session.cookie)
    .set(API_HEADERS.workspaceId, session.workspaceId)
    .set(API_HEADERS.csrfToken, session.csrfToken)
    .set(API_HEADERS.idempotencyKey, `secret_begin_${session.sessionId}`)
    .set('origin', TEST_ORIGIN)
    .set('user-agent', TEST_USER_AGENT)
    .set('accept-language', TEST_ACCEPT_LANGUAGE)
    .send(body);
}

describe('provider secret connect route', () => {
  it('returns a transaction id the existing pending and claim endpoints can finish', async () => {
    const session = await seedSession(harness, {
      scopes: ['connections:admin'],
      mfaSatisfied: true,
      approvalLevel: 'level_3_confirm',
    });
    const transactionId = newIdFor('oauthTransaction');
    connectWithProviderSecret.mockResolvedValue({ transactionId });

    const response = await post(session, {
      provider: 'bluesky',
      identifier: 'sample-studio.fake.invalid',
      appPassword: APP_PASSWORD,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ transactionId });
    expect(connectWithProviderSecret).toHaveBeenCalledWith(expect.anything(), {
      provider: 'bluesky',
      identifier: 'sample-studio.fake.invalid',
      appPassword: APP_PASSWORD,
    });
  });

  it('is a step-up action, exactly like starting an OAuth handshake', async () => {
    const session = await seedSession(harness, {
      scopes: ['connections:admin'],
      mfaSatisfied: false,
      approvalLevel: 'level_2_scheduled',
    });

    const response = await post(session, {
      provider: 'bluesky',
      identifier: 'sample-studio.fake.invalid',
      appPassword: APP_PASSWORD,
    });

    // Step-up asks the person to prove it again, so it is 401 rather than a
    // flat refusal. That is the same answer `oauth/begin` gives.
    expect(response.status).toBe(401);
    expect(connectWithProviderSecret).not.toHaveBeenCalled();
  });

  it('is not reachable from the read scope', async () => {
    const session = await seedSession(harness, {
      scopes: ['accounts:read'],
      mfaSatisfied: true,
      approvalLevel: 'level_3_confirm',
    });

    const response = await post(session, {
      provider: 'bluesky',
      identifier: 'sample-studio.fake.invalid',
      appPassword: APP_PASSWORD,
    });

    expect(response.status).toBe(403);
    expect(connectWithProviderSecret).not.toHaveBeenCalled();
  });

  it('refuses a provider whose official flow is not an app password', async () => {
    const session = await seedSession(harness, {
      scopes: ['connections:admin'],
      mfaSatisfied: true,
      approvalLevel: 'level_3_confirm',
    });

    const response = await post(session, {
      provider: 'x',
      identifier: 'someone',
      appPassword: APP_PASSWORD,
    });

    expect(response.status).toBe(422);
    expect(connectWithProviderSecret).not.toHaveBeenCalled();
  });

  it('never writes the app password to a log line', async () => {
    const session = await seedSession(harness, {
      scopes: ['connections:admin'],
      mfaSatisfied: true,
      approvalLevel: 'level_3_confirm',
    });
    connectWithProviderSecret.mockResolvedValue({
      transactionId: newIdFor('oauthTransaction'),
    });

    await post(session, {
      provider: 'bluesky',
      identifier: 'sample-studio.fake.invalid',
      appPassword: APP_PASSWORD,
    });

    expect(JSON.stringify(harness.logger.lines)).not.toContain(APP_PASSWORD);
  });
});
