import { describe, expect, it } from 'vitest';

import { SecretValue } from '../../vault';
import { createSimulator } from '../shared/testing';
import { createAppPasswordSession } from './app-password';

/**
 * The app password exchange.
 *
 * Bluesky needs no provider app review, which makes it the connector that
 * proves the whole connect pipeline. There is no live account here, so these
 * tests run against the recorded `com.atproto.server.createSession` shape and
 * assert the three things that matter: the session pair is parsed rather than
 * cast, a rejected password is a person-fixable provider failure rather than a
 * crash, and the app password never survives the call.
 */

const SESSION_URL = 'https://bsky.invalid/xrpc/com.atproto.server.createSession';
const APP_PASSWORD = 'fake-app-password-not-a-real-credential';
const SCOPES = ['atproto:repo.write', 'atproto:repo.read'] as const;
const clock = { now: () => new Date('2026-08-12T00:00:00.000Z') };

/** The recorded shape, with token fields the shared fixture deliberately omits. */
const SESSION_BODY = {
  did: 'did:plc:fakedidfakedidfake01',
  handle: 'sample-studio.fake.invalid',
  accessJwt: 'fake.access.jwt',
  refreshJwt: 'fake.refresh.jwt',
  active: true,
};

function sessionCall(route: { status?: number; body?: unknown }) {
  const { client, handle } = createSimulator([
    {
      method: 'POST',
      match: 'com.atproto.server.createSession',
      status: route.status ?? 200,
      body: route.body ?? SESSION_BODY,
    },
  ]);
  return {
    simulator: handle,
    run: () =>
      createAppPasswordSession({
        http: client,
        sessionUrl: SESSION_URL,
        identifier: 'sample-studio.fake.invalid',
        appPassword: new SecretValue(APP_PASSWORD, 'provider_secret'),
        grantedScopes: SCOPES,
        clock,
      }),
  };
}

describe('bluesky app password session', () => {
  it('turns a session response into a refreshable credential', async () => {
    const credential = await sessionCall({}).run();

    expect(credential.accessToken.reveal()).toBe('fake.access.jwt');
    expect(credential.refreshToken?.reveal()).toBe('fake.refresh.jwt');
    expect(credential.tokenType).toBe('bearer');
    // The AT Protocol returns no expiry, so we report unknown rather than
    // inventing a lifetime for a token we would then refresh at the wrong time.
    expect(credential.expiresAt).toBeNull();
    expect(credential.refreshTokenRotated).toBe(true);
    expect(credential.grantedScopes).toEqual([...SCOPES]);
    expect(credential.obtainedAt).toBe('2026-08-12T00:00:00.000Z');
  });

  it('sends the identifier and password to the connector-declared endpoint', async () => {
    const { simulator, run } = sessionCall({});
    await run();

    const [call] = simulator.callsTo('createSession');
    expect(call?.method).toBe('POST');
    expect(call?.url).toBe(SESSION_URL);
    expect(call?.json).toEqual({
      identifier: 'sample-studio.fake.invalid',
      password: APP_PASSWORD,
    });
  });

  it('reports a rejected app password as a provider failure the person can fix', async () => {
    const attempt = sessionCall({
      status: 401,
      body: { error: 'AuthenticationRequired', message: 'Invalid identifier or password' },
    });

    await expect(attempt.run()).rejects.toThrow();
  });

  it('refuses a session response missing a refresh token instead of storing half a grant', async () => {
    const { accessJwt: _accessJwt, refreshJwt: _refreshJwt, ...withoutTokens } = SESSION_BODY;
    const attempt = sessionCall({ body: withoutTokens });

    await expect(attempt.run()).rejects.toThrow();
  });

  it('never lets the app password out through the result', async () => {
    const credential = await sessionCall({}).run();

    // `SecretValue` redacts on serialization; the app password is not on the
    // result at all, and neither token is the password we sent.
    expect(JSON.stringify(credential)).not.toContain(APP_PASSWORD);
    expect(credential.accessToken.reveal()).not.toBe(APP_PASSWORD);
  });
});
