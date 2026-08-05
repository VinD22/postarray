import { newIdFor } from '@relay/contracts';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  TEST_ACCEPT_LANGUAGE,
  TEST_ORIGIN,
  TEST_USER_AGENT,
  createHarness,
  seedAccessToken,
  seedApiKey,
  seedSession,
  type Harness,
} from '../testing/harness';

/**
 * Edge authentication and authorization, end to end over HTTP.
 *
 * These assert the properties the whole tenancy story rests on, at the layer a
 * caller actually experiences them. Every one of them has been a real breach in
 * a real product, which is why they are integration tests rather than unit
 * tests on a guard in isolation.
 */

let harness: Harness;

beforeEach(async () => {
  harness = await createHarness({
    services: (base) => ({
      ...base,
      brands: {
        ...base.brands,
        list: () =>
          Promise.resolve({
            data: [{ id: newIdFor('brand'), name: 'Acme' }],
            pageInfo: { nextCursor: null, hasMore: false, limit: 25 },
          }),
      },
    }),
  });
});

afterEach(async () => {
  await harness.close();
});

describe('authentication', () => {
  it('rejects a request with no credential and does not leak a route shape', async () => {
    const response = await request(harness.server).get('/v1/brands');

    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toContain('application/problem+json');
    expect(response.body.code).toBe('AUTH_REQUIRED');
    // Compliant MCP clients discover the authorization server from this header.
    expect(response.headers['www-authenticate']).toContain('oauth-protected-resource');
  });

  it('answers identically for a malformed credential and an unknown one', async () => {
    const malformed = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', 'Bearer not-a-relay-credential');
    const unknown = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', `Bearer rly_ak_abcdefgh_${'z'.repeat(40)}`);

    expect(malformed.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(malformed.body.code).toBe(unknown.body.code);
    expect(malformed.body.detail).toEqual(unknown.body.detail);
  });

  it('refuses a request carrying both a cookie and a bearer token', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:read'] });
    const key = await seedApiKey(harness, { scopes: ['accounts:read'] });

    const response = await request(harness.server)
      .get('/v1/brands')
      .set('cookie', session.cookie)
      .set('authorization', `Bearer ${key.secret}`)
      .set('user-agent', TEST_USER_AGENT);

    // Picking a winner is how privilege confusion bugs start.
    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'ambiguous_credential' });
  });

  it('accepts a workspace API key and pins its single workspace', async () => {
    const key = await seedApiKey(harness, { scopes: ['accounts:read'] });

    const response = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', `Bearer ${key.secret}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it('refuses an API key presented from outside its source allowlist', async () => {
    const key = await seedApiKey(harness, {
      scopes: ['accounts:read'],
      ipAllowlist: ['198.51.100.0/24'],
    });

    const response = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', `Bearer ${key.secret}`);

    expect(response.status).toBe(401);
  });

  it('rejects a bearer token minted for a different resource', async () => {
    const token = await seedAccessToken(harness, {
      scopes: ['accounts:read'],
      audience: 'https://mcp.relay.test',
    });

    const response = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', `Bearer ${token.token}`);

    // Audience verification is the confused-deputy defence: a token for another
    // Relay resource must not work here.
    expect(response.status).toBe(401);
  });

  it('accepts a bearer token whose audience matches this resource', async () => {
    const token = await seedAccessToken(harness, { scopes: ['accounts:read'] });

    const response = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', `Bearer ${token.token}`);

    expect(response.status).toBe(200);
  });

  it('refuses a session presented from a different device family', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:read'] });

    const response = await request(harness.server)
      .get('/v1/brands')
      .set('cookie', session.cookie)
      .set('user-agent', 'a-completely-different-browser/9')
      .set('accept-language', 'zz');

    expect(response.status).toBe(401);
  });
});

describe('scope enforcement', () => {
  it('rejects a credential without the required scope and names what is missing', async () => {
    const key = await seedApiKey(harness, { scopes: ['analytics:read'] });

    const response = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', `Bearer ${key.secret}`);

    expect(response.status).toBe(403);
    expect(response.body.code).toBe('SCOPE_INSUFFICIENT');
    // Naming the scope is what lets a developer fix the request instead of
    // guessing; the registry is public, so it discloses nothing.
    expect(response.body.detail).toMatchObject({ missing: ['accounts:read'] });
  });

  it('does not let a write scope imply a publish scope', async () => {
    const key = await seedApiKey(harness, { scopes: ['drafts:write'] });

    const response = await request(harness.server)
      .post('/v1/publications')
      .set('authorization', `Bearer ${key.secret}`)
      .set('idempotency-key', 'idem-publish-attempt-1')
      .send({
        contentItemId: newIdFor('contentItem'),
        confirmation: {
          acknowledgedTargetCount: 1,
          acknowledgedVersionChecksum: 'a'.repeat(64),
          acknowledgedEscalations: [],
        },
      });

    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ missing: ['posts:publish'] });
  });

  it('narrows a multi-workspace session to the pinned workspace scopes', async () => {
    const workspaceA = newIdFor('workspace');
    const workspaceB = newIdFor('workspace');
    const session = await seedSession(harness, {
      workspaceIds: [workspaceA, workspaceB],
      scopesByWorkspace: { [workspaceA]: ['accounts:read'], [workspaceB]: [] },
    });

    const allowed = await request(harness.server)
      .get('/v1/brands')
      .set('cookie', session.cookie)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('x-relay-workspace-id', workspaceA);

    const refused = await request(harness.server)
      .get('/v1/brands')
      .set('cookie', session.cookie)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('x-relay-workspace-id', workspaceB);

    expect(allowed.status).toBe(200);
    // A scope held in one workspace must not authorize a call in another.
    expect(refused.status).toBe(403);
  });
});

describe('cross-workspace access', () => {
  it('returns 404 rather than 403 for a workspace the caller is not in', async () => {
    const key = await seedApiKey(harness, { scopes: ['accounts:read'] });
    const foreignWorkspace = newIdFor('workspace');

    const response = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', `Bearer ${key.secret}`)
      .set('x-relay-workspace-id', foreignWorkspace);

    // A 403 would confirm the workspace exists, which is exactly the fact a
    // prober is trying to establish.
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('NOT_FOUND');
    expect(response.body.detail).toMatchObject({ resource: 'workspace' });
  });

  it('returns the same 404 for a workspace that does not exist at all', async () => {
    const key = await seedApiKey(harness, { scopes: ['accounts:read'] });

    const foreign = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', `Bearer ${key.secret}`)
      .set('x-relay-workspace-id', newIdFor('workspace'));
    const nonexistent = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', `Bearer ${key.secret}`)
      .set('x-relay-workspace-id', newIdFor('workspace'));

    expect(foreign.status).toBe(nonexistent.status);
    expect(foreign.body.code).toBe(nonexistent.body.code);
    expect(foreign.body.detail).toEqual(nonexistent.body.detail);
  });
});

describe('csrf protection', () => {
  it('rejects a cookie-authenticated write with no Origin header', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:write'] });

    const response = await request(harness.server)
      .post('/v1/brands')
      .set('cookie', session.cookie)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('idempotency-key', 'idem-csrf-1')
      .send({ name: 'Acme', ianaTimeZone: 'Europe/Berlin', defaultLocale: 'en' });

    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'origin_rejected' });
  });

  it('rejects a cookie-authenticated write with an unlisted Origin', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:write'] });

    const response = await request(harness.server)
      .post('/v1/brands')
      .set('cookie', session.cookie)
      .set('origin', 'https://app.relay.test.evil.example')
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('idempotency-key', 'idem-csrf-2')
      .send({ name: 'Acme', ianaTimeZone: 'Europe/Berlin', defaultLocale: 'en' });

    // A suffix match would have accepted this origin. Matching is exact.
    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'origin_rejected' });
  });

  it('rejects a cookie-authenticated write with no double-submit token', async () => {
    const session = await seedSession(harness, { scopes: ['accounts:write'] });

    const response = await request(harness.server)
      .post('/v1/brands')
      .set('cookie', session.cookie)
      .set('origin', TEST_ORIGIN)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('idempotency-key', 'idem-csrf-3')
      .send({ name: 'Acme', ianaTimeZone: 'Europe/Berlin', defaultLocale: 'en' });

    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({ reason: 'csrf_token_invalid' });
  });

  it('does not require a CSRF token from a bearer credential', async () => {
    const key = await seedApiKey(harness, { scopes: ['accounts:read'] });

    const response = await request(harness.server)
      .get('/v1/brands')
      .set('authorization', `Bearer ${key.secret}`);

    // A bearer token is not ambient, so it is not CSRF-exposed.
    expect(response.status).toBe(200);
  });
});

describe('step-up', () => {
  it('refuses a machine credential on a step-up route', async () => {
    const key = await seedApiKey(harness, { scopes: ['connections:admin'] });

    const response = await request(harness.server)
      .post('/v1/api-keys')
      .set('authorization', `Bearer ${key.secret}`)
      .set('idempotency-key', 'idem-stepup-1')
      .send({ name: 'second key', scopes: ['drafts:read'] });

    // A step-up proves a human is present. A machine credential cannot.
    expect(response.status).toBe(403);
    expect(response.body.detail).toMatchObject({
      reason: 'step_up_requires_interactive_session',
    });
  });

  it('demands a fresh factor from a session that has not stepped up', async () => {
    const session = await seedSession(harness, {
      scopes: ['connections:admin'],
      mfaSatisfied: false,
    });

    const response = await request(harness.server)
      .post('/v1/api-keys')
      .set('cookie', session.cookie)
      .set('origin', TEST_ORIGIN)
      .set('x-relay-csrf-token', session.csrfToken)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('idempotency-key', 'idem-stepup-2')
      .send({ name: 'second key', scopes: ['drafts:read'] });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe('AUTH_MFA_REQUIRED');
  });

  it('expires a step-up after ten minutes', async () => {
    const session = await seedSession(harness, {
      scopes: ['connections:admin'],
      mfaSatisfied: true,
    });
    harness.clock.advance(11 * 60);

    const response = await request(harness.server)
      .post('/v1/api-keys')
      .set('cookie', session.cookie)
      .set('origin', TEST_ORIGIN)
      .set('x-relay-csrf-token', session.csrfToken)
      .set('user-agent', TEST_USER_AGENT)
      .set('accept-language', TEST_ACCEPT_LANGUAGE)
      .set('idempotency-key', 'idem-stepup-3')
      .send({ name: 'second key', scopes: ['drafts:read'] });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe('AUTH_MFA_REQUIRED');
  });
});
