import { createServer } from 'node:http';
import type { IncomingMessage, Server as NodeHttpServer, ServerResponse } from 'node:http';

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { RelayError } from '@relay/contracts';
import type { HealthReport, Logger } from '@relay/observability';

import {
  PROTECTED_RESOURCE_PATH,
  buildAuthenticateChallenge,
  buildProtectedResourceMetadata,
} from './auth/metadata.js';
import { bearerFromHeader } from './auth/verifier.js';
import type { TokenVerifier, VerifiedGrant } from './auth/verifier.js';
import type { Dispatcher } from './dispatch.js';
import { createMcpServer } from './server.js';
import type { ToolRegistry } from './tools/registry.js';

/**
 * The HTTP surface.
 *
 * Streamable HTTP over TLS, one endpoint, no unauthenticated tools, not even
 * read tools. The server runs stateless: a fresh transport and a fresh protocol
 * server per request, so a token is verified for every single call rather than
 * once when a long-lived connection opened.
 */

export const MCP_PATH = '/mcp';
export const HEALTH_PATH = '/healthz';
export const MAX_BODY_BYTES = 1024 * 1024;

export interface McpHttpOptions {
  readonly registry: ToolRegistry;
  readonly dispatcher: Dispatcher;
  readonly verifier: TokenVerifier;
  readonly logger: Logger;
  /** The canonical URL of this resource. Tokens are bound to it. */
  readonly resourceUrl: string;
  readonly issuerUrl: string;
  readonly documentationUrl?: string | undefined;
  readonly sandbox: boolean;
  readonly health?: (() => HealthReport) | undefined;
}

function sendJson(
  response: ServerResponse,
  status: number,
  body: unknown,
  headers: Readonly<Record<string, string>> = {},
): void {
  const payload = JSON.stringify(body);
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    ...headers,
  });
  response.end(payload);
}

async function readBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
    size += buffer.byteLength;
    if (size > MAX_BODY_BYTES) {
      throw new RelayError('VALIDATION_FAILED', {
        messageKey: 'error.request_invalid.message',
        details: { reason: 'BODY_TOO_LARGE' },
      });
    }
    chunks.push(buffer);
  }
  if (chunks.length === 0) {
    return undefined;
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'BODY_NOT_JSON' },
    });
  }
}

export interface McpHttpService {
  readonly server: NodeHttpServer;
  handle(request: IncomingMessage, response: ServerResponse): Promise<void>;
}

export function createMcpHttpService(options: McpHttpOptions): McpHttpService {
  const metadata = buildProtectedResourceMetadata({
    resourceUrl: options.resourceUrl,
    issuerUrl: options.issuerUrl,
    scopes: [
      'accounts:read',
      'drafts:read',
      'drafts:write',
      'posts:schedule',
      'posts:publish',
      'posts:cancel',
      'analytics:read',
      'growth:read',
      'growth:write',
    ],
    documentationUrl: options.documentationUrl,
  });
  const metadataUrl = new URL(PROTECTED_RESOURCE_PATH, options.resourceUrl).toString();

  const unauthorized = (
    response: ServerResponse,
    error: RelayError,
  ): void => {
    const isScope = error.code === 'SCOPE_INSUFFICIENT';
    sendJson(response, isScope ? 403 : 401, error.toProblemJson(), {
      'www-authenticate': buildAuthenticateChallenge({
        resourceMetadataUrl: metadataUrl,
        error: isScope ? 'insufficient_scope' : 'invalid_token',
        errorDescription: String(error.details['reason'] ?? error.code),
      }),
    });
  };

  const handle = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const url = new URL(request.url ?? '/', options.resourceUrl);

    if (url.pathname === PROTECTED_RESOURCE_PATH && request.method === 'GET') {
      sendJson(response, 200, metadata, { 'cache-control': 'public, max-age=300' });
      return;
    }

    if (url.pathname === HEALTH_PATH && request.method === 'GET') {
      sendJson(
        response,
        200,
        options.health?.() ?? { status: 'ok', service: 'mcp', sandbox: options.sandbox },
      );
      return;
    }

    if (url.pathname !== MCP_PATH) {
      sendJson(response, 404, { error: 'not_found' });
      return;
    }

    // A token in a query parameter ends up in access logs, referrer headers and
    // browser history. Header only, always.
    if (url.searchParams.has('access_token') || url.searchParams.has('token')) {
      unauthorized(
        response,
        new RelayError('AUTH_REQUIRED', {
          messageKey: 'error.unauthenticated.message',
          details: { reason: 'TOKEN_IN_QUERY_PARAMETER' },
        }),
      );
      return;
    }

    const bearer = bearerFromHeader(request.headers['authorization']);
    if (bearer === null) {
      unauthorized(
        response,
        new RelayError('AUTH_REQUIRED', {
          messageKey: 'error.unauthenticated.message',
          details: { reason: 'AUTHORIZATION_HEADER_MISSING' },
        }),
      );
      return;
    }

    let grant: VerifiedGrant;
    try {
      grant = await options.verifier.verify(bearer);
    } catch (error) {
      unauthorized(response, RelayError.fromUnknown(error));
      return;
    }

    let body: unknown;
    try {
      body = request.method === 'POST' ? await readBody(request) : undefined;
    } catch (error) {
      sendJson(response, 400, RelayError.fromUnknown(error).toProblemJson());
      return;
    }

    /**
     * Stateless: a new transport and a new protocol server per request. It
     * costs a little and it buys the guarantee that matters, which is that no
     * call rides on an authorization performed earlier.
     */
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    const server = createMcpServer({
      registry: options.registry,
      dispatcher: options.dispatcher,
      grantForRequest: () => grant,
      sandbox: options.sandbox,
    });

    response.on('close', () => {
      void transport.close();
      void server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(request, response, body);
    } catch (error) {
      options.logger.error({ event: 'mcp.transport_failed', error }, 'mcp.transport_failed');
      if (!response.headersSent) {
        sendJson(response, 500, RelayError.fromUnknown(error).toProblemJson());
      }
    }
  };

  const server = createServer((request, response) => {
    void handle(request, response).catch((error: unknown) => {
      options.logger.error({ event: 'mcp.request_failed', error }, 'mcp.request_failed');
      if (!response.headersSent) {
        sendJson(response, 500, { error: 'internal' });
      }
    });
  });

  return { server, handle };
}
