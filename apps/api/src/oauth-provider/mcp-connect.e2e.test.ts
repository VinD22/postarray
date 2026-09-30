import {
  createDispatcher,
  createIntrospectionVerifier,
  createMcpHttpService,
  createMemoryConfirmationStore,
  createSandboxServices,
  createToolRegistry,
  createWorkspaceKillSwitch,
  type IntrospectionTransport,
} from '@relay/mcp';
import { createLogger } from '@relay/observability';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createHarness, seedSession, type Harness } from '../testing/harness';
import {
  TEST_MCP_RESOURCE,
  TEST_RESOURCE_SERVER_CLIENT_ID,
  TEST_RESOURCE_SERVER_SECRET,
  authed,
  pkcePair,
  redirectLocation,
  registerResourceServerClient,
  withDynamicRegistration,
  withRecordedGrants,
} from '../testing/oauth-flow';

/**
 * Connecting Claude, end to end, in process.
 *
 * The real API (guards, rate limits, body parsers, the OAuth provider) and the
 * real MCP HTTP service, joined by an introspection transport that calls the
 * API. Only the application services and the social providers are doubles.
 * The steps are the ones claude.ai takes after a person pastes the MCP URL:
 * a 401 with a challenge, metadata discovery on both servers, dynamic
 * registration, a signed-out authorize that detours through sign-in, consent,
 * a token request with `resource`, and then tool calls that introspect.
 *
 * Every defect this exercises was a production dead end: the strict
 * introspection schema, the own-tokens-only rule, the missing grant fields,
 * the relative consent redirect, the JSON 401 for a signed-out browser and the
 * missing registration endpoint.
 */

const CLAUDE_CALLBACK = 'https://claude.ai/api/mcp/auth_callback';
const API_ORIGIN = 'https://api.relay.test';

let harness: Harness;

beforeEach(async () => {
  harness = await createHarness({
    services: (base) => withRecordedGrants()(withDynamicRegistration(() => harness)(base)),
  });
  await registerResourceServerClient(harness);
});

afterEach(async () => {
  await harness.close();
});

/** The MCP server's introspection calls, answered by the in-process API. */
function apiTransport(calls: { count: number }): IntrospectionTransport {
  return {
    async post(url, form) {
      calls.count += 1;
      const target = new URL(url);
      expect(target.origin).toBe(API_ORIGIN);
      const response = await request(harness.server).post(target.pathname).type('form').send(form);
      return { status: response.status, body: response.text };
    },
  };
}

function mcpServer(workspaceId: string, calls: { count: number }) {
  const clock = { now: () => harness.clock.now().getTime() };
  const services = createSandboxServices({ clock, workspaceId });
  const registry = createToolRegistry();
  const logger = createLogger({ service: 'mcp' }, { level: 'silent', pretty: false });
  return createMcpHttpService({
    registry,
    dispatcher: createDispatcher({
      registry,
      services,
      auditSink: services.auditSink,
      confirmations: createMemoryConfirmationStore({
        clock,
        confirmUrlTemplate: (id) => `https://app.relay.test/confirm/${id}`,
      }),
      logger,
      clock,
      killSwitch: createWorkspaceKillSwitch(),
      sandbox: true,
    }),
    verifier: createIntrospectionVerifier({
      introspectionUrl: `${API_ORIGIN}/oauth/introspect`,
      resourceUrl: TEST_MCP_RESOURCE,
      transport: apiTransport(calls),
      clientId: TEST_RESOURCE_SERVER_CLIENT_ID,
      clientSecret: TEST_RESOURCE_SERVER_SECRET,
      clock,
    }),
    logger,
    resourceUrl: TEST_MCP_RESOURCE,
    issuerUrl: API_ORIGIN,
    sandbox: true,
  });
}

function mcpCall(server: ReturnType<typeof mcpServer>, body: unknown, token?: string) {
  const call = request(server.server)
    .post('/mcp')
    .set('content-type', 'application/json')
    .set('accept', 'application/json, text/event-stream');
  return (token === undefined ? call : call.set('authorization', `Bearer ${token}`)).send(
    JSON.stringify(body),
  );
}

function rpcResult(text: string): Record<string, unknown> {
  const payload = text.trim().startsWith('{')
    ? text
    : (text
        .split('\n')
        .find((line) => line.startsWith('data:'))
        ?.slice(5) ?? '{}');
  return JSON.parse(payload) as Record<string, unknown>;
}

describe('connecting an MCP host through OAuth', () => {
  it('registers, signs in, consents, gets a token for /mcp and calls tools', async () => {
    const session = await seedSession(harness, {
      scopes: ['accounts:read', 'drafts:read', 'drafts:write'],
    });
    const introspections = { count: 0 };
    const mcp = mcpServer(session.workspaceId, introspections);

    // 1. No token: a challenge that points at the metadata.
    const unauthenticated = await mcpCall(mcp, { jsonrpc: '2.0', id: 1, method: 'tools/list' });
    expect(unauthenticated.status).toBe(401);
    const challenge = unauthenticated.headers['www-authenticate'] ?? '';
    const metadataUrl = /resource_metadata="([^"]+)"/.exec(challenge)?.[1] ?? '';
    const scope = /scope="([^"]+)"/.exec(challenge)?.[1] ?? '';

    // 2. Protected resource metadata names the API as authorization server.
    const resourceMetadata = await request(mcp.server).get(new URL(metadataUrl).pathname);
    expect(resourceMetadata.body.resource).toBe(TEST_MCP_RESOURCE);
    expect(resourceMetadata.body.authorization_servers).toEqual([API_ORIGIN]);

    // 3. Authorization server metadata advertises registration.
    const serverMetadata = await request(harness.server).get(
      '/.well-known/oauth-authorization-server',
    );
    const registrationPath = new URL(serverMetadata.body.registration_endpoint).pathname;

    // 4. Dynamic client registration, as Claude sends it.
    const registered = await request(harness.server)
      .post(registrationPath)
      .send({
        client_name: 'Claude',
        redirect_uris: [CLAUDE_CALLBACK],
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        token_endpoint_auth_method: 'none',
      });
    expect(registered.status).toBe(201);
    const clientId = registered.body.client_id as string;

    // 5. The browser arrives signed out and is sent to sign in, then back.
    const { verifier, challenge: codeChallenge } = pkcePair();
    const authorizeQuery = {
      response_type: 'code',
      client_id: clientId,
      redirect_uri: CLAUDE_CALLBACK,
      scope,
      state: 'claude-state-0123456789',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      resource: TEST_MCP_RESOURCE,
    };
    const signedOut = await request(harness.server).get('/oauth/authorize').query(authorizeQuery);
    expect(signedOut.status).toBe(302);
    const signIn = new URL(redirectLocation(signedOut));
    const next = new URL(signIn.searchParams.get('next') ?? '');
    expect(next.origin).toBe(API_ORIGIN);

    const signedIn = await authed(
      request(harness.server).get(`${next.pathname}${next.search}`),
      session,
    );
    expect(signedIn.status).toBe(302);
    const consentUrl = new URL(redirectLocation(signedIn));
    expect(`${consentUrl.origin}${consentUrl.pathname}`).toBe('https://app.relay.test/consent');

    // 6. Consent, on the web app's behalf.
    const requestId = consentUrl.searchParams.get('request_id');
    const consentData = await authed(
      request(harness.server).get('/oauth/consent').query({ request_id: requestId }),
      session,
    );
    expect(consentData.body.client.selfAsserted).toBe(true);
    const granted = (consentData.body.scopes as { scope: string }[]).map((entry) => entry.scope);
    // Everything the host asked for from the challenge, narrowed to what it registered.
    expect(granted).toEqual(expect.arrayContaining(['drafts:read', 'drafts:write']));
    const consent = await authed(request(harness.server).post('/oauth/consent'), session).send({
      requestId,
      consentNonce: consentData.body.consentNonce,
      decision: 'approve',
      workspaceId: session.workspaceId,
      grantedScopes: granted,
      consentVersionHash: 'c'.repeat(64),
    });
    const callback = new URL(consent.body.redirectTo);
    expect(callback.origin).toBe('https://claude.ai');
    expect(callback.searchParams.get('state')).toBe(authorizeQuery.state);

    // 7. Token exchange with the RFC 8707 resource, form encoded.
    const token = await request(harness.server)
      .post(new URL(serverMetadata.body.token_endpoint).pathname)
      .type('form')
      .send({
        grant_type: 'authorization_code',
        code: callback.searchParams.get('code'),
        redirect_uri: CLAUDE_CALLBACK,
        client_id: clientId,
        code_verifier: verifier,
        resource: TEST_MCP_RESOURCE,
      });
    expect(token.status).toBe(200);
    const accessToken = token.body.access_token as string;

    // 8. Tool calls, each verified by introspection against the API.
    const initialize = await mcpCall(
      mcp,
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'claude-ai', version: '1.0.0' },
        },
      },
      accessToken,
    );
    expect(initialize.status).toBe(200);

    const projects = await mcpCall(
      mcp,
      {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'list_projects', arguments: {} },
      },
      accessToken,
    );
    expect(projects.status).toBe(200);
    const result = rpcResult(projects.text)['result'] as { isError: boolean };
    expect(result.isError).toBe(false);
    // One introspection served both calls: the verifier caches a success.
    expect(introspections.count).toBe(1);
  });

  it('refuses at /mcp a token minted for the REST API', async () => {
    const session = await seedSession(harness, { scopes: ['drafts:read'] });
    const registered = await request(harness.server)
      .post('/oauth/register')
      .send({ client_name: 'Claude', redirect_uris: [CLAUDE_CALLBACK] });
    const { verifier, challenge } = pkcePair();
    const authorize = await authed(
      request(harness.server).get('/oauth/authorize').query({
        response_type: 'code',
        client_id: registered.body.client_id,
        redirect_uri: CLAUDE_CALLBACK,
        scope: 'drafts:read',
        state: 'state-for-api-token',
        code_challenge: challenge,
        code_challenge_method: 'S256',
      }),
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
      workspaceId: session.workspaceId,
      grantedScopes: ['drafts:read'],
      consentVersionHash: 'c'.repeat(64),
    });
    const token = await request(harness.server)
      .post('/oauth/token')
      .type('form')
      .send({
        grant_type: 'authorization_code',
        code: new URL(consent.body.redirectTo).searchParams.get('code'),
        redirect_uri: CLAUDE_CALLBACK,
        client_id: registered.body.client_id,
        code_verifier: verifier,
      });

    const mcp = mcpServer(session.workspaceId, { count: 0 });
    const refused = await mcpCall(
      mcp,
      { jsonrpc: '2.0', id: 1, method: 'tools/list' },
      token.body.access_token,
    );
    expect(refused.status).toBe(401);
    expect(refused.headers['www-authenticate']).toContain('error="invalid_token"');
  });
});
