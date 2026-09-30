import type { AddressInfo } from 'node:net';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';
import { createLogger } from '@relay/observability';
import type { HealthReport } from '@relay/observability';

import type { TokenVerifier, VerifiedGrant } from './auth/verifier';
import { createMemoryConfirmationStore } from './confirmations';
import { createDispatcher, createWorkspaceKillSwitch } from './dispatch';
import { createMcpHttpService } from './http';
import type { McpHttpService } from './http';
import { createSandboxServices } from './sandbox';
import { createToolRegistry } from './tools/index';

/**
 * The HTTP surface as a real MCP client meets it: discovery, the 401 that
 * starts the OAuth flow, preflight, the methods a stateless server refuses,
 * and a real JSON-RPC round trip once a token verifies.
 */

const RESOURCE = 'https://mcp.relay.example/mcp';
const NOW = Date.parse('2026-09-30T12:00:00.000Z');
const GOOD_TOKEN = 'rly_at_goodgood_0123456789';

const GRANT: VerifiedGrant = {
  active: true,
  subject: 'user_01',
  clientId: 'rly_dc_claude',
  grantId: 'grant_01',
  workspaceId: 'ws_sandbox',
  scopes: ['accounts:read', 'drafts:read', 'drafts:write'],
  approvalLevel: 'level_2_scheduled',
  audience: [RESOURCE],
  expiresAt: '2026-09-30T13:00:00.000Z',
  locale: 'en',
  killed: false,
};

let verifierMode: 'ok' | 'down' = 'ok';
let healthStatus: HealthReport['status'] = 'ok';
let service: McpHttpService;
let base: string;

const verifier: TokenVerifier = {
  async verify(token) {
    if (verifierMode === 'down') {
      throw new RelayError('PROVIDER_UNAVAILABLE', {
        messageKey: 'error.internal.message',
        details: { reason: 'INTROSPECTION_UNAVAILABLE' },
      });
    }
    if (token !== GOOD_TOKEN) {
      throw new RelayError('AUTH_REQUIRED', { details: { reason: 'TOKEN_INACTIVE' } });
    }
    return GRANT;
  },
};

beforeEach(async () => {
  verifierMode = 'ok';
  healthStatus = 'ok';
  const clock = { now: () => NOW };
  const services = createSandboxServices({ clock, workspaceId: 'ws_sandbox' });
  const registry = createToolRegistry();
  const logger = createLogger({ service: 'mcp' }, { level: 'silent', pretty: false });
  service = createMcpHttpService({
    registry,
    dispatcher: createDispatcher({
      registry,
      services,
      auditSink: services.auditSink,
      confirmations: createMemoryConfirmationStore({
        clock,
        confirmUrlTemplate: (id) => `https://app.relay.example/confirm/${id}`,
      }),
      logger,
      clock,
      killSwitch: createWorkspaceKillSwitch(),
      sandbox: true,
    }),
    verifier,
    logger,
    resourceUrl: RESOURCE,
    issuerUrl: 'https://api.relay.example',
    sandbox: true,
    health: () => ({ status: healthStatus }) as unknown as HealthReport,
  });
  await new Promise<void>((resolve) => service.server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(service.server.address() as AddressInfo).port}`;
});

afterEach(async () => {
  await new Promise<void>((resolve) => service.server.close(() => resolve()));
});

async function rpc(body: unknown, token = GOOD_TOKEN): Promise<Response> {
  return fetch(`${base}/mcp`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify(body),
  });
}

/** The transport may answer as JSON or as one server-sent event. */
async function rpcResult(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  const payload = text.trim().startsWith('{')
    ? text
    : (text
        .split('\n')
        .find((line) => line.startsWith('data:'))
        ?.slice(5) ?? '{}');
  return JSON.parse(payload) as Record<string, unknown>;
}

describe('discovery and the first 401', () => {
  it('serves protected resource metadata at the path-specific and the root location', async () => {
    for (const path of [
      '/.well-known/oauth-protected-resource/mcp',
      '/.well-known/oauth-protected-resource',
    ]) {
      const response = await fetch(`${base}${path}`);
      expect(response.status).toBe(200);
      const body = (await response.json()) as Record<string, unknown>;
      expect(body['resource']).toBe(RESOURCE);
      expect(body['authorization_servers']).toEqual(['https://api.relay.example']);
      // Derived from the tools, so media tools are requestable too.
      expect(body['scopes_supported']).toEqual(
        expect.arrayContaining(['media:read', 'media:write']),
      );
    }
  });

  it('challenges a request with no credential without calling it invalid', async () => {
    const response = await fetch(`${base}/mcp`, { method: 'POST', body: '{}' });
    expect(response.status).toBe(401);
    const challenge = response.headers.get('www-authenticate') ?? '';
    expect(challenge).toContain(
      'resource_metadata="https://mcp.relay.example/.well-known/oauth-protected-resource/mcp"',
    );
    expect(challenge).toContain('scope="');
    expect(challenge).not.toContain('error=');
    expect(response.headers.get('access-control-expose-headers')).toContain('WWW-Authenticate');
  });

  it('calls a rejected token invalid_token', async () => {
    const response = await rpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, 'rly_at_bad');
    expect(response.status).toBe(401);
    expect(response.headers.get('www-authenticate')).toContain('error="invalid_token"');
  });

  it('answers 503 with a retry when the authorization server cannot', async () => {
    verifierMode = 'down';
    const response = await rpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
    expect(response.status).toBe(503);
    expect(response.headers.get('retry-after')).toBe('5');
    expect(response.headers.get('www-authenticate')).toBeNull();
  });
});

describe('transport rules', () => {
  it('answers a CORS preflight before authentication', async () => {
    const response = await fetch(`${base}/mcp`, {
      method: 'OPTIONS',
      headers: {
        origin: 'https://inspector.example',
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'authorization, content-type',
      },
    });
    expect(response.status).toBe(204);
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(response.headers.get('access-control-allow-headers')).toContain('Authorization');
    expect(response.headers.get('access-control-expose-headers')).toContain('Mcp-Session-Id');
  });

  it('refuses GET and DELETE on the endpoint with 405, since it keeps no stream or session', async () => {
    for (const method of ['GET', 'DELETE']) {
      const response = await fetch(`${base}/mcp`, {
        method,
        headers: { authorization: `Bearer ${GOOD_TOKEN}` },
      });
      expect(response.status, method).toBe(405);
      expect(response.headers.get('allow')).toContain('POST');
    }
  });

  it('reports a down service as 503 on the health check', async () => {
    healthStatus = 'down';
    expect((await fetch(`${base}/healthz`)).status).toBe(503);
    healthStatus = 'ok';
    expect((await fetch(`${base}/healthz`)).status).toBe(200);
  });
});

describe('a verified client', () => {
  it('initializes with instructions, lists titled tools and calls list_projects', async () => {
    const init = await rpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'test', version: '1.0.0' },
      },
    });
    expect(init.status).toBe(200);
    const initialized = (await rpcResult(init))['result'] as Record<string, unknown>;
    expect(String(initialized['instructions'])).toContain('list_projects');

    const listed = await rpcResult(await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list' }));
    const tools = (listed['result'] as { tools: { name: string; title?: string }[] }).tools;
    expect(tools.find((tool) => tool.name === 'list_projects')?.title).toBe('List projects');

    const called = await rpcResult(
      await rpc({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'list_projects', arguments: {} },
      }),
    );
    const result = called['result'] as { isError: boolean; structuredContent: unknown };
    expect(result.isError).toBe(false);
    expect(result.structuredContent).toMatchObject({
      projects: [{ project_id: 'project_sandbox' }],
    });
  });
});
