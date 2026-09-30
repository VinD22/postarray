import { randomBytes } from 'node:crypto';

import { newIdFor } from '@relay/contracts';
import { ACTIVE_LOCALE_CODES } from '@relay/i18n';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createHarness, seedSession, type Harness } from '../testing/harness';
import {
  TEST_CLIENT_ID as CLIENT_ID,
  TEST_REDIRECT_URI as REDIRECT_URI,
  approveAuthorization,
  authed,
  clientRecord,
  pkcePair,
  redirectLocation,
  withRecordedGrants,
} from '../testing/oauth-flow';

/**
 * The authorization code flow with PKCE, end to end.
 *
 * Everything from the discovery document to a working access token, plus the
 * three failures that matter: a replayed code, a wrong verifier, and a redirect
 * URI that is nearly right. Failures on the token endpoint answer in the RFC
 * 6749 shape (`400 {"error":"invalid_grant"}`), which is what OAuth client
 * libraries read.
 */

let harness: Harness;
let recorded: { grantId: string; workspaceId: string }[];

beforeEach(async () => {
  recorded = [];
  harness = await createHarness({ services: withRecordedGrants(recorded) });
  await harness.directory.putOAuthClient(clientRecord(harness));
});

afterEach(async () => {
  await harness.close();
});

function authorizeQuery(challenge: string, overrides: Record<string, string> = {}) {
  return {
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'drafts:read',
    state: randomBytes(16).toString('base64url'),
    code_challenge: challenge,
    code_challenge_method: 'S256',
    ...overrides,
  };
}

describe('discovery', () => {
  it('publishes authorization server metadata advertising S256 only', async () => {
    const response = await request(harness.server).get('/.well-known/oauth-authorization-server');

    expect(response.status).toBe(200);
    expect(response.body.code_challenge_methods_supported).toEqual(['S256']);
    // Advertising `plain` would invite a client to use it; we do not accept it.
    expect(response.body.grant_types_supported).toEqual(['authorization_code', 'refresh_token']);
    expect(response.body.token_endpoint).toContain('/oauth/token');
    expect(response.body.registration_endpoint).toBe('https://api.relay.test/oauth/register');
    expect(response.body.ui_locales_supported).toEqual([...ACTIVE_LOCALE_CODES]);
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
    const query = authorizeQuery(challenge);

    const authorize = await authed(
      request(harness.server).get('/oauth/authorize').query(query),
      session,
    );
    expect(authorize.status).toBe(302);
    // The consent screen is in the web app, not on the API host.
    const location = new URL(redirectLocation(authorize));
    expect(`${location.origin}${location.pathname}`).toBe('https://app.relay.test/consent');
    const requestId = location.searchParams.get('request_id');
    expect(requestId).not.toBeNull();

    const consentData = await authed(
      request(harness.server).get('/oauth/consent').query({ request_id: requestId }),
      session,
    );
    expect(consentData.status).toBe(200);
    expect(consentData.body.client.firstParty).toBe(false);
    expect(consentData.body.client.selfAsserted).toBe(false);
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
    expect(redirect.searchParams.get('state')).toBe(query.state);
    expect(redirect.searchParams.get('iss')).toBe('https://api.relay.test');
    const code = redirect.searchParams.get('code');
    expect(code).not.toBeNull();
    // Approving wrote the durable grant, in the workspace the person chose.
    expect(recorded).toEqual([{ grantId: expect.any(String), workspaceId: session.workspaceId }]);

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

  it('accepts the token request form-encoded, as OAuth clients send it', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const flow = await approveAuthorization(harness, session);

    const token = await request(harness.server).post('/oauth/token').type('form').send({
      grant_type: 'authorization_code',
      code: flow.code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: flow.verifier,
    });
    expect(token.status).toBe(200);
  });

  it('refuses a consent for a workspace the person does not belong to', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const { challenge } = pkcePair();
    const authorize = await authed(
      request(harness.server).get('/oauth/authorize').query(authorizeQuery(challenge)),
      session,
    );
    const requestId = new URL(redirectLocation(authorize)).searchParams.get('request_id');
    const consentData = await authed(
      request(harness.server).get('/oauth/consent').query({ request_id: requestId }),
      session,
    );
    const consent = await authed(request(harness.server).post('/oauth/consent'), session).send({
      requestId,
      consentNonce: consentData.body.consentNonce,
      decision: 'approve',
      workspaceId: newIdFor('workspace'),
      grantedScopes: ['drafts:read'],
      consentVersionHash: 'b'.repeat(64),
    });
    expect(consent.status).toBe(404);
    expect(recorded).toHaveLength(0);
  });

  it('rejects a replayed code with invalid_grant and kills the tokens it produced', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const flow = await approveAuthorization(harness, session);
    const exchange = {
      grant_type: 'authorization_code',
      code: flow.code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: flow.verifier,
    };

    const first = await request(harness.server).post('/oauth/token').send(exchange);
    expect(first.status).toBe(200);

    const replay = await request(harness.server).post('/oauth/token').send(exchange);
    expect(replay.status).toBe(400);
    expect(replay.body).toEqual({ error: 'invalid_grant' });

    // The tokens from the first exchange die too: we cannot tell which holder
    // was the attacker, so neither keeps access.
    const afterReplay = await request(harness.server)
      .get('/v1/content')
      .set('authorization', `Bearer ${first.body.access_token}`);
    expect(afterReplay.status).toBe(401);
    expect(harness.logger.messages('warn')).toContain('security.oauth_code_replay');
  });

  it('rejects a wrong code verifier with invalid_grant', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const flow = await approveAuthorization(harness, session);

    const token = await request(harness.server).post('/oauth/token').send({
      grant_type: 'authorization_code',
      code: flow.code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: pkcePair().verifier,
    });

    expect(token.status).toBe(400);
    expect(token.body).toEqual({ error: 'invalid_grant' });
  });

  it('rejects `plain` as a challenge method', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });

    const response = await authed(
      request(harness.server)
        .get('/oauth/authorize')
        .query(authorizeQuery(pkcePair().challenge, { code_challenge_method: 'plain' })),
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
        request(harness.server)
          .get('/oauth/authorize')
          .query(authorizeQuery(pkcePair().challenge, { redirect_uri: candidate })),
        session,
      );
      expect(response.status).toBe(422);
      expect(response.body.detail).toMatchObject({ reason: 'no_exact_match' });
    }
  });

  it('refuses a request left with no scope the application registered', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });

    const response = await authed(
      request(harness.server)
        .get('/oauth/authorize')
        .query(authorizeQuery(pkcePair().challenge, { scope: 'posts:publish' })),
      session,
    );

    expect(response.status).toBe(422);
    expect(response.body.detail).toMatchObject({ reason: 'not_registered' });
  });

  it('narrows a request for more than the application registered instead of failing it', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const authorize = await authed(
      request(harness.server)
        .get('/oauth/authorize')
        .query(
          authorizeQuery(pkcePair().challenge, {
            scope: 'drafts:read drafts:write posts:publish connections:admin',
          }),
        ),
      session,
    );
    expect(authorize.status).toBe(302);
    const requestId = new URL(redirectLocation(authorize)).searchParams.get('request_id');
    const consentData = await authed(
      request(harness.server).get('/oauth/consent').query({ request_id: requestId }),
      session,
    );
    expect(consentData.body.scopes.map((entry: { scope: string }) => entry.scope)).toEqual([
      'drafts:read',
      'drafts:write',
    ]);
  });

  it('never grants a third party the credential administration scope', async () => {
    // Even with it registered, a third party cannot hold it.
    await harness.directory.putOAuthClient(
      clientRecord(harness, { allowedScopes: ['connections:admin'] }),
    );
    const session = await seedSession(harness, { scopes: ['drafts:read'] });

    const response = await authed(
      request(harness.server)
        .get('/oauth/authorize')
        .query(authorizeQuery(pkcePair().challenge, { scope: 'connections:admin' })),
      session,
    );

    expect(response.status).toBe(422);
    expect(response.body.detail).toMatchObject({ reason: 'invalid_scope' });
  });
});

describe('refresh rotation', () => {
  it('rotates on use and destroys the family when a consumed token is replayed', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const flow = await approveAuthorization(harness, session);
    const issued = await request(harness.server).post('/oauth/token').send({
      grant_type: 'authorization_code',
      code: flow.code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: flow.verifier,
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
    expect(replayed.status).toBe(400);
    expect(replayed.body).toEqual({ error: 'invalid_grant' });
    expect(harness.logger.messages('warn')).toContain('security.refresh_reuse_detected');

    // The rotated token is dead too: the whole family was revoked.
    const afterFamilyRevocation = await request(harness.server).post('/oauth/token').send({
      grant_type: 'refresh_token',
      refresh_token: rotated.body.refresh_token,
      client_id: CLIENT_ID,
    });
    expect(afterFamilyRevocation.status).toBe(400);
  });
});
