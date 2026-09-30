import { oauthIntrospectionResponseSchema } from '@relay/contracts';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { hashSecret } from '../security/credentials';
import { createHarness, seedSession, type Harness } from '../testing/harness';
import {
  TEST_CLIENT_ID,
  TEST_MCP_RESOURCE,
  TEST_REDIRECT_URI,
  TEST_RESOURCE_SERVER_CLIENT_ID,
  TEST_RESOURCE_SERVER_SECRET,
  approveAuthorization,
  clientRecord,
  registerResourceServerClient,
  withRecordedGrants,
} from '../testing/oauth-flow';

/**
 * Introspection as the MCP resource server uses it.
 *
 * The regression this guards: Claude's tokens are issued to Claude's client,
 * the MCP server introspects them with its own client, and the old rules
 * ("own tokens only", a strict schema without `resource`, no grant fields)
 * made every one of them either a 4xx or `TOKEN_INCOMPLETE` at `/mcp`.
 */

let harness: Harness;

beforeEach(async () => {
  harness = await createHarness({ services: withRecordedGrants() });
  await harness.directory.putOAuthClient(
    clientRecord(harness, { allowedScopes: ['drafts:read', 'drafts:write', 'posts:schedule'] }),
  );
  await registerResourceServerClient(harness);
});

afterEach(async () => {
  await harness.close();
});

async function tokenFor(
  resource?: string,
): Promise<{ access_token: string; refresh_token: string }> {
  const session = await seedSession(harness, { scopes: ['drafts:read', 'drafts:write'] });
  const flow = await approveAuthorization(harness, session, {
    scope: 'drafts:read drafts:write',
    ...(resource === undefined ? {} : { resource }),
  });
  const token = await request(harness.server)
    .post('/oauth/token')
    .send({
      grant_type: 'authorization_code',
      code: flow.code,
      redirect_uri: TEST_REDIRECT_URI,
      client_id: TEST_CLIENT_ID,
      code_verifier: flow.verifier,
      ...(resource === undefined ? {} : { resource }),
    });
  expect(token.status).toBe(200);
  return token.body;
}

function introspect(form: Record<string, string>) {
  return request(harness.server)
    .post('/oauth/introspect')
    .type('form')
    .send({
      client_id: TEST_RESOURCE_SERVER_CLIENT_ID,
      client_secret: TEST_RESOURCE_SERVER_SECRET,
      token_type_hint: 'access_token',
      ...form,
    });
}

describe('introspection by the MCP resource server', () => {
  it('answers a token bound to the MCP resource with every field the verifier needs', async () => {
    const issued = await tokenFor(TEST_MCP_RESOURCE);

    const response = await introspect({ token: issued.access_token, resource: TEST_MCP_RESOURCE });

    expect(response.status).toBe(200);
    const body = oauthIntrospectionResponseSchema.parse(response.body);
    expect(body).toMatchObject({
      active: true,
      client_id: TEST_CLIENT_ID,
      aud: TEST_MCP_RESOURCE,
      scope: 'drafts:read drafts:write',
      approval_level: 'level_2_scheduled',
      locale: 'en',
      killed: false,
    });
    expect(body.sub).toMatch(/^user_/);
    expect(body.grant_id).toMatch(/^grant_/);
    expect(body.workspace_id).toMatch(/^ws_/);
    expect(response.headers['cache-control']).toBe('no-store');
  });

  it('reads a token minted for the REST API as inactive', async () => {
    const issued = await tokenFor();
    const response = await introspect({ token: issued.access_token });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ active: false });
  });

  it('reads a token as inactive when the named resource is not its audience', async () => {
    const issued = await tokenFor(TEST_MCP_RESOURCE);
    const response = await introspect({
      token: issued.access_token,
      resource: 'https://api.relay.test',
    });
    expect(response.body).toEqual({ active: false });
  });

  it('keeps any other confidential client to its own tokens', async () => {
    await harness.directory.putOAuthClient(
      clientRecord(harness, {
        clientId: 'rly_pk_othercc',
        clientType: 'confidential',
        secretHash: hashSecret('another-confidential-secret', harness.directory.pepper),
      }),
    );
    const issued = await tokenFor(TEST_MCP_RESOURCE);
    const response = await request(harness.server).post('/oauth/introspect').type('form').send({
      token: issued.access_token,
      client_id: 'rly_pk_othercc',
      client_secret: 'another-confidential-secret',
    });
    expect(response.body).toEqual({ active: false });
  });

  it('answers a wrong secret with 401 invalid_client, not a problem document', async () => {
    const issued = await tokenFor(TEST_MCP_RESOURCE);
    const response = await introspect({
      token: issued.access_token,
      client_secret: 'definitely-not-the-secret',
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'invalid_client' });
  });

  it('answers a malformed request with 400 invalid_request', async () => {
    const response = await introspect({ token: 'short' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'invalid_request' });
  });

  it('is not throttled at the browser rate the MCP server would otherwise hit', async () => {
    const issued = await tokenFor(TEST_MCP_RESOURCE);
    for (let call = 0; call < 70; call += 1) {
      const response = await introspect({ token: issued.access_token });
      expect(response.status).toBe(200);
    }
  });
});

describe('RFC 8707 resource on the token endpoint', () => {
  it('refuses a resource that does not match the code binding with invalid_target', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const flow = await approveAuthorization(harness, session, { resource: TEST_MCP_RESOURCE });
    const token = await request(harness.server).post('/oauth/token').send({
      grant_type: 'authorization_code',
      code: flow.code,
      redirect_uri: TEST_REDIRECT_URI,
      client_id: TEST_CLIENT_ID,
      code_verifier: flow.verifier,
      resource: 'https://api.relay.test',
    });
    expect(token.status).toBe(400);
    expect(token.body).toEqual({ error: 'invalid_target' });
  });

  it('accepts the bound resource on refresh and keeps the approval level and locale', async () => {
    const issued = await tokenFor(TEST_MCP_RESOURCE);
    const refreshed = await request(harness.server).post('/oauth/token').type('form').send({
      grant_type: 'refresh_token',
      refresh_token: issued.refresh_token,
      client_id: TEST_CLIENT_ID,
      resource: TEST_MCP_RESOURCE,
    });
    expect(refreshed.status).toBe(200);

    const response = await introspect({ token: refreshed.body.access_token });
    expect(response.body).toMatchObject({
      active: true,
      approval_level: 'level_2_scheduled',
      locale: 'en',
      aud: TEST_MCP_RESOURCE,
    });
  });

  it('refuses to authorize for a resource that is not one of ours', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    await expect(
      approveAuthorization(harness, session, { resource: 'https://elsewhere.example/mcp' }),
    ).rejects.toThrow('authorize answered 422');
  });
});

describe('token endpoint errors in the RFC 6749 shape', () => {
  it('answers an unknown client with 401 invalid_client', async () => {
    const response = await request(harness.server).post('/oauth/token').send({
      grant_type: 'refresh_token',
      refresh_token: 'rly_rt_0000000000000000000000',
      client_id: 'rly_pk_nobody_at_all',
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'invalid_client' });
  });

  it('answers an unsupported grant type and a malformed request with 400', async () => {
    const unsupported = await request(harness.server).post('/oauth/token').send({
      grant_type: 'password',
      client_id: TEST_CLIENT_ID,
    });
    expect(unsupported.status).toBe(400);
    expect(unsupported.body).toEqual({ error: 'unsupported_grant_type' });

    const malformed = await request(harness.server).post('/oauth/token').send({
      grant_type: 'authorization_code',
      client_id: TEST_CLIENT_ID,
    });
    expect(malformed.status).toBe(400);
    expect(malformed.body).toEqual({ error: 'invalid_request' });
    expect(malformed.headers['cache-control']).toBe('no-store');
  });
});
