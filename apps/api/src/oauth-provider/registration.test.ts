import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createHarness, seedApiKey, seedSession, type Harness } from '../testing/harness';
import {
  approveAuthorization,
  withDynamicRegistration,
  withRecordedGrants,
} from '../testing/oauth-flow';

/**
 * RFC 7591 dynamic client registration and the signed-out authorize path:
 * the two steps a Claude connector takes before a person ever sees a screen.
 */

const CLAUDE_CALLBACK = 'https://claude.ai/api/mcp/auth_callback';
const CLAUDE_COM_CALLBACK = 'https://claude.com/api/mcp/auth_callback';

let harness: Harness;
let registered: string[];

beforeEach(async () => {
  registered = [];
  harness = await createHarness({
    services: (base) =>
      withRecordedGrants()(withDynamicRegistration(() => harness, registered)(base)),
  });
});

afterEach(async () => {
  await harness.close();
});

function register(body: Record<string, unknown>) {
  return request(harness.server).post('/oauth/register').send(body);
}

describe('dynamic client registration', () => {
  it('registers Claude as a public client with both callbacks', async () => {
    const response = await register({
      client_name: 'Claude',
      redirect_uris: [CLAUDE_CALLBACK, CLAUDE_COM_CALLBACK],
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      token_endpoint_auth_method: 'none',
      // Unknown metadata is ignored, as RFC 7591 requires.
      software_statement_extra: 'ignored',
    });

    expect(response.status).toBe(201);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.body).toMatchObject({
      client_name: 'Claude',
      redirect_uris: [CLAUDE_CALLBACK, CLAUDE_COM_CALLBACK],
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
    });
    expect(response.body.client_id).toMatch(/^rly_dc_/);
    expect(response.body).not.toHaveProperty('client_secret');
    // Never the credential administration scope.
    expect(response.body.scope.split(' ')).not.toContain('connections:admin');
  });

  it('answers an identical registration with the same client', async () => {
    const body = { client_name: 'Claude', redirect_uris: [CLAUDE_CALLBACK] };
    const first = await register(body);
    const second = await register(body);
    expect(second.body.client_id).toBe(first.body.client_id);
    expect(registered).toHaveLength(1);
  });

  it('accepts loopback http for native clients such as Claude Code', async () => {
    const response = await register({
      client_name: 'Claude Code',
      redirect_uris: ['http://localhost:33418/callback'],
    });
    expect(response.status).toBe(201);
  });

  it('refuses insecure, fragment and nested redirect URIs with invalid_redirect_uri', async () => {
    for (const uri of [
      'http://claude.ai/api/mcp/auth_callback',
      'https://client.example/cb#fragment',
      'https://client.example/cb?next=https://evil.example',
    ]) {
      const response = await register({ client_name: 'Somebody', redirect_uris: [uri] });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('invalid_redirect_uri');
    }
    const missing = await register({ client_name: 'Somebody' });
    expect(missing.body.error).toBe('invalid_redirect_uri');
    expect(registered).toHaveLength(0);
  });

  it('registers public clients only', async () => {
    const response = await register({
      client_name: 'Confidential',
      redirect_uris: [CLAUDE_CALLBACK],
      token_endpoint_auth_method: 'client_secret_basic',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('invalid_client_metadata');
  });

  it('refuses oversized metadata and unsupported grant types', async () => {
    const oversized = await register({
      client_name: 'Big',
      redirect_uris: [CLAUDE_CALLBACK],
      contacts: ['x'.repeat(300)],
      padding: 'y'.repeat(9000),
    });
    expect(oversized.body.error).toBe('invalid_client_metadata');

    const implicit = await register({
      client_name: 'Implicit',
      redirect_uris: [CLAUDE_CALLBACK],
      grant_types: ['implicit'],
    });
    expect(implicit.body.error).toBe('invalid_client_metadata');
  });

  it('rate limits registrations from one address', async () => {
    let limited = false;
    for (let attempt = 0; attempt < 32; attempt += 1) {
      const response = await register({
        client_name: `Client ${attempt}`,
        redirect_uris: [CLAUDE_CALLBACK],
      });
      limited ||= response.status === 429;
    }
    expect(limited).toBe(true);
  });

  it('marks a registered client as self-asserted on the consent screen', async () => {
    const client = await register({ client_name: 'Claude', redirect_uris: [CLAUDE_CALLBACK] });
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const flow = await approveAuthorization(harness, session, {
      clientId: client.body.client_id,
      redirectUri: CLAUDE_CALLBACK,
    });
    expect(flow.redirectTo.origin).toBe('https://claude.ai');
    expect(flow.consentData.client).toMatchObject({
      name: 'Claude',
      selfAsserted: true,
      firstParty: false,
      logoUrl: null,
    });

    const token = await request(harness.server).post('/oauth/token').type('form').send({
      grant_type: 'authorization_code',
      code: flow.code,
      redirect_uri: CLAUDE_CALLBACK,
      client_id: client.body.client_id,
      code_verifier: flow.verifier,
    });
    expect(token.status).toBe(200);
  });
});

describe('authorize for a signed-out browser', () => {
  const query = {
    response_type: 'code',
    client_id: 'rly_pk_testclient',
    redirect_uri: 'https://partner.example/callback',
    scope: 'drafts:read',
    state: 'state-value-123456',
    code_challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    code_challenge_method: 'S256',
  };

  it('sends the browser to sign in, with this request as the way back', async () => {
    const response = await request(harness.server).get('/oauth/authorize').query(query);

    expect(response.status).toBe(302);
    const location = new URL(response.headers['location'] ?? '');
    expect(`${location.origin}${location.pathname}`).toBe('https://app.relay.test/sign-in');
    const next = new URL(location.searchParams.get('next') ?? '');
    expect(`${next.origin}${next.pathname}`).toBe('https://api.relay.test/oauth/authorize');
    expect(next.searchParams.get('client_id')).toBe('rly_pk_testclient');
    expect(next.searchParams.get('code_challenge')).toBe(query.code_challenge);
  });

  it('still refuses a malformed request before sending anyone to sign in', async () => {
    const response = await request(harness.server)
      .get('/oauth/authorize')
      .query({ ...query, code_challenge_method: 'plain' });
    expect(response.status).toBe(422);
  });

  it('refuses a machine credential, which cannot consent', async () => {
    const key = await seedApiKey(harness, { scopes: ['drafts:read'] });
    const response = await request(harness.server)
      .get('/oauth/authorize')
      .query(query)
      .set('authorization', `Bearer ${key.secret}`);
    expect(response.status).toBe(403);
  });
});
