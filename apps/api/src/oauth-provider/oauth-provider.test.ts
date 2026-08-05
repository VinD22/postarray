import { randomBytes } from 'node:crypto';

import { newIdFor } from '@relay/contracts';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { instantAfter } from '../common/instant.js';
import { oauthClientRecordSchema } from '../security/records.js';
import {
  TEST_ACCEPT_LANGUAGE,
  TEST_ORIGIN,
  TEST_USER_AGENT,
  createHarness,
  seedSession,
  type Harness,
} from '../testing/harness.js';
import { deriveChallenge } from './pkce.js';

/**
 * The authorization code flow with PKCE, end to end.
 *
 * Everything from the discovery document to a working access token, plus the
 * three failures that matter: a replayed code, a wrong verifier, and a redirect
 * URI that is nearly right.
 */

let harness: Harness;
const CLIENT_ID = 'rly_pk_testclient';
const REDIRECT_URI = 'https://partner.example/callback';

async function registerClient(
  overrides: Partial<{ redirectUris: string[]; clientType: 'public' | 'confidential'; allowedScopes: string[] }> = {},
): Promise<void> {
  await harness.directory.putOAuthClient(
    oauthClientRecordSchema.parse({
      clientId: CLIENT_ID,
      appId: newIdFor('oauthClient'),
      workspaceId: newIdFor('workspace'),
      name: 'Partner App',
      clientType: overrides.clientType ?? 'public',
      secretHash: null,
      previousSecretHash: null,
      previousSecretExpiresAt: null,
      redirectUris: overrides.redirectUris ?? [REDIRECT_URI],
      homepageUrl: 'https://partner.example',
      privacyPolicyUrl: 'https://partner.example/privacy',
      termsUrl: 'https://partner.example/terms',
      logoUrl: null,
      supportEmail: 'support@partner.example',
      allowedScopes: overrides.allowedScopes ?? ['drafts:read', 'drafts:write'],
      firstParty: false,
      disabledAt: null,
      createdAt: harness.clock.now().toISOString(),
    }),
  );
}

interface Session {
  cookie: string;
  csrfToken: string;
  workspaceId: string;
}

function authed(call: request.Test, session: Session): request.Test {
  return call
    .set('cookie', session.cookie)
    .set('origin', TEST_ORIGIN)
    .set('x-relay-csrf-token', session.csrfToken)
    .set('user-agent', TEST_USER_AGENT)
    .set('accept-language', TEST_ACCEPT_LANGUAGE);
}

beforeEach(async () => {
  harness = await createHarness();
  await registerClient();
});

afterEach(async () => {
  await harness.close();
});

function pkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(48).toString('base64url');
  return { verifier, challenge: deriveChallenge(verifier) };
}

/** Reads the Location header of a redirect, failing the test if it is absent. */
function redirectLocation(response: { headers: Record<string, string | undefined> }): string {
  const location = response.headers['location'];
  if (location === undefined) {
    throw new Error('expected a Location header on this redirect response');
  }
  return location;
}

describe('discovery', () => {
  it('publishes authorization server metadata advertising S256 only', async () => {
    const response = await request(harness.server).get('/.well-known/oauth-authorization-server');

    expect(response.status).toBe(200);
    expect(response.body.code_challenge_methods_supported).toEqual(['S256']);
    // Advertising `plain` would invite a client to use it; we do not accept it.
    expect(response.body.grant_types_supported).toEqual(['authorization_code', 'refresh_token']);
    expect(response.body.token_endpoint).toContain('/oauth/token');
  });

  it('publishes the protected resource identifier a token must be bound to', async () => {
    const response = await request(harness.server).get('/.well-known/oauth-protected-resource');

    expect(response.status).toBe(200);
    expect(response.body.resource).toBe('https://api.relay.test');
    expect(response.body.bearer_methods_supported).toEqual(['header']);
  });
});

describe('authorization code flow with PKCE', () => {
  it('completes: authorize, consent, token, and the token works', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const { verifier, challenge } = pkcePair();
    const state = randomBytes(16).toString('base64url');

    const authorize = await authed(
      request(harness.server).get('/oauth/authorize').query({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'drafts:read',
        state,
        code_challenge: challenge,
        code_challenge_method: 'S256',
      }),
      session,
    );

    expect(authorize.status).toBe(302);
    const requestId = new URL(redirectLocation(authorize), TEST_ORIGIN).searchParams.get(
      'request_id',
    );
    expect(requestId).not.toBeNull();

    const consentData = await authed(
      request(harness.server).get('/oauth/consent').query({ request_id: requestId }),
      session,
    );
    expect(consentData.status).toBe(200);
    expect(consentData.body.client.firstParty).toBe(false);
    expect(consentData.body.scopes).toEqual([
      { scope: 'drafts:read', risk: 'read', descriptionKey: 'scopes.drafts_read' },
    ]);

    const consent = await authed(request(harness.server).post('/oauth/consent'), session).send({
      requestId,
      consentNonce: consentData.body.consentNonce,
      decision: 'approve',
      workspaceId: session.workspaceId,
      grantedScopes: ['drafts:read'],
      consentVersionHash: 'b'.repeat(64),
    });
    expect(consent.status).toBe(200);

    const redirect = new URL(consent.body.redirectTo);
    expect(redirect.origin + redirect.pathname).toBe(REDIRECT_URI);
    expect(redirect.searchParams.get('state')).toBe(state);
    const code = redirect.searchParams.get('code');
    expect(code).not.toBeNull();

    const token = await request(harness.server).post('/oauth/token').send({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    });

    expect(token.status).toBe(200);
    expect(token.body.token_type).toBe('Bearer');
    expect(token.body.scope).toBe('drafts:read');
    expect(token.body.access_token).toMatch(/^rly_at_/);
    expect(token.body.refresh_token).toMatch(/^rly_rt_/);
    // A token response must not be cached by anything in between.
    expect(token.headers['cache-control']).toBe('no-store');

    const authenticated = await request(harness.server)
      .get('/v1/content')
      .set('authorization', `Bearer ${token.body.access_token}`);
    expect(authenticated.status).toBe(200);
  });

  it('rejects a replayed code and kills the tokens it produced', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const { verifier, challenge } = pkcePair();

    const authorize = await authed(
      request(harness.server).get('/oauth/authorize').query({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'drafts:read',
        state: randomBytes(16).toString('base64url'),
        code_challenge: challenge,
        code_challenge_method: 'S256',
      }),
      session,
    );
    const requestId = new URL(redirectLocation(authorize), TEST_ORIGIN).searchParams.get(
      'request_id',
    );
    const consentData = await authed(
      request(harness.server).get('/oauth/consent').query({ request_id: requestId }),
      session,
    );
    const consent = await authed(request(harness.server).post('/oauth/consent'), session).send({
      requestId,
      consentNonce: consentData.body.consentNonce,
      decision: 'approve',
      workspaceId: session.workspaceId,
      grantedScopes: ['drafts:read'],
      consentVersionHash: 'b'.repeat(64),
    });
    const code = new URL(consent.body.redirectTo).searchParams.get('code');

    const first = await request(harness.server).post('/oauth/token').send({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    });
    expect(first.status).toBe(200);

    const replay = await request(harness.server).post('/oauth/token').send({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    });
    expect(replay.status).toBe(403);

    // The tokens from the first exchange die too: we cannot tell which holder
    // was the attacker, so neither keeps access.
    const afterReplay = await request(harness.server)
      .get('/v1/content')
      .set('authorization', `Bearer ${first.body.access_token}`);
    expect(afterReplay.status).toBe(401);
    expect(harness.logger.messages('warn')).toContain('security.oauth_code_replay');
  });

  it('rejects a wrong code verifier', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const { challenge } = pkcePair();
    const wrong = pkcePair().verifier;

    const authorize = await authed(
      request(harness.server).get('/oauth/authorize').query({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'drafts:read',
        state: randomBytes(16).toString('base64url'),
        code_challenge: challenge,
        code_challenge_method: 'S256',
      }),
      session,
    );
    const requestId = new URL(redirectLocation(authorize), TEST_ORIGIN).searchParams.get(
      'request_id',
    );
    const consentData = await authed(
      request(harness.server).get('/oauth/consent').query({ request_id: requestId }),
      session,
    );
    const consent = await authed(request(harness.server).post('/oauth/consent'), session).send({
      requestId,
      consentNonce: consentData.body.consentNonce,
      decision: 'approve',
      workspaceId: session.workspaceId,
      grantedScopes: ['drafts:read'],
      consentVersionHash: 'b'.repeat(64),
    });

    const token = await request(harness.server).post('/oauth/token').send({
      grant_type: 'authorization_code',
      code: new URL(consent.body.redirectTo).searchParams.get('code'),
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: wrong,
    });

    expect(token.status).toBe(403);
  });

  it('rejects `plain` as a challenge method', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });

    const response = await authed(
      request(harness.server).get('/oauth/authorize').query({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'drafts:read',
        state: randomBytes(16).toString('base64url'),
        code_challenge: pkcePair().challenge,
        code_challenge_method: 'plain',
      }),
      session,
    );

    expect(response.status).toBe(422);
  });

  it('rejects a redirect URI that only nearly matches', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });

    for (const candidate of [
      `${REDIRECT_URI}/`,
      `${REDIRECT_URI}?x=1`,
      'https://partner.example.evil/callback',
      'https://partner.example/callback2',
    ]) {
      const response = await authed(
        request(harness.server).get('/oauth/authorize').query({
          response_type: 'code',
          client_id: CLIENT_ID,
          redirect_uri: candidate,
          scope: 'drafts:read',
          state: randomBytes(16).toString('base64url'),
          code_challenge: pkcePair().challenge,
          code_challenge_method: 'S256',
        }),
        session,
      );
      expect(response.status).toBe(422);
      expect(response.body.detail).toMatchObject({ reason: 'no_exact_match' });
    }
  });

  it('refuses a scope the application did not register', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });

    const response = await authed(
      request(harness.server).get('/oauth/authorize').query({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'posts:publish',
        state: randomBytes(16).toString('base64url'),
        code_challenge: pkcePair().challenge,
        code_challenge_method: 'S256',
      }),
      session,
    );

    expect(response.status).toBe(422);
    expect(response.body.detail).toMatchObject({ reason: 'not_registered' });
  });

  it('never grants a third party the credential administration scope', async () => {
    await harness.directory.putOAuthClient(
      oauthClientRecordSchema.parse({
        clientId: CLIENT_ID,
        appId: newIdFor('oauthClient'),
        workspaceId: newIdFor('workspace'),
        name: 'Partner App',
        clientType: 'public',
        secretHash: null,
        previousSecretHash: null,
        previousSecretExpiresAt: null,
        redirectUris: [REDIRECT_URI],
        homepageUrl: 'https://partner.example',
        privacyPolicyUrl: 'https://partner.example/privacy',
        termsUrl: 'https://partner.example/terms',
        logoUrl: null,
        supportEmail: 'support@partner.example',
        // Even with it registered, a third party cannot hold it.
        allowedScopes: ['connections:admin'],
        firstParty: false,
        disabledAt: null,
        createdAt: harness.clock.now().toISOString(),
      }),
    );
    const session = await seedSession(harness, { scopes: ['drafts:read'] });

    const response = await authed(
      request(harness.server).get('/oauth/authorize').query({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'connections:admin',
        state: randomBytes(16).toString('base64url'),
        code_challenge: pkcePair().challenge,
        code_challenge_method: 'S256',
      }),
      session,
    );

    expect(response.status).toBe(422);
    expect(response.body.detail).toMatchObject({ reason: 'invalid_scope' });
  });
});

describe('refresh rotation', () => {
  it('rotates on use and destroys the family when a consumed token is replayed', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const { verifier, challenge } = pkcePair();

    const authorize = await authed(
      request(harness.server).get('/oauth/authorize').query({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'drafts:read',
        state: randomBytes(16).toString('base64url'),
        code_challenge: challenge,
        code_challenge_method: 'S256',
      }),
      session,
    );
    const requestId = new URL(redirectLocation(authorize), TEST_ORIGIN).searchParams.get(
      'request_id',
    );
    const consentData = await authed(
      request(harness.server).get('/oauth/consent').query({ request_id: requestId }),
      session,
    );
    const consent = await authed(request(harness.server).post('/oauth/consent'), session).send({
      requestId,
      consentNonce: consentData.body.consentNonce,
      decision: 'approve',
      workspaceId: session.workspaceId,
      grantedScopes: ['drafts:read'],
      consentVersionHash: 'b'.repeat(64),
    });
    const issued = await request(harness.server).post('/oauth/token').send({
      grant_type: 'authorization_code',
      code: new URL(consent.body.redirectTo).searchParams.get('code'),
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    });

    const rotated = await request(harness.server).post('/oauth/token').send({
      grant_type: 'refresh_token',
      refresh_token: issued.body.refresh_token,
      client_id: CLIENT_ID,
    });
    expect(rotated.status).toBe(200);
    expect(rotated.body.refresh_token).not.toBe(issued.body.refresh_token);

    const replayed = await request(harness.server).post('/oauth/token').send({
      grant_type: 'refresh_token',
      refresh_token: issued.body.refresh_token,
      client_id: CLIENT_ID,
    });
    expect(replayed.status).toBe(403);
    expect(harness.logger.messages('warn')).toContain('security.refresh_reuse_detected');

    // The rotated token is dead too: the whole family was revoked.
    const afterFamilyRevocation = await request(harness.server).post('/oauth/token').send({
      grant_type: 'refresh_token',
      refresh_token: rotated.body.refresh_token,
      client_id: CLIENT_ID,
    });
    expect(afterFamilyRevocation.status).toBe(403);
  });
});
