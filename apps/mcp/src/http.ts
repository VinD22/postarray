import { createServer } from 'node:http';
import type { IncomingMessage, Server as NodeHttpServer, ServerResponse } from 'node:http';

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { RelayError } from '@relay/contracts';
import type { HealthReport, Logger } from '@relay/observability';

import {
  buildAuthenticateChallenge,
  buildProtectedResourceMetadata,
  protectedResourceMetadataUrl,
  protectedResourcePaths,
} from './auth/metadata';
import { bearerFromHeader } from './auth/verifier';
import type { TokenVerifier, VerifiedGrant } from './auth/verifier';
import type { Dispatcher } from './dispatch';
import { CORS_HEADERS, PREFLIGHT_HEADERS, readBody, sendJson } from './http-support';
import { createMcpServer } from './server';
import type { ToolRegistry } from './tools/registry';

/**
 * The HTTP surface.
 *
 * Streamable HTTP over TLS, one endpoint, no unauthenticated tools, not even
 * read tools. The server runs stateless: a fresh transport and a fresh protocol
 * server per request, so a token is verified for every single call rather than
 * once when a long-lived connection opened. Stateless also means there is no
 * server-to-client stream and no session to delete, so `GET` and `DELETE` on
 * the endpoint answer 405 with `Allow: POST`, which is what the transport spec
 * tells a client to expect.
 */

export { MAX_BODY_BYTES } from './http-support';

export const MCP_PATH = '/mcp';
export const HEALTH_PATH = '/healthz';

/**
 * Every scope a tool in the registry can require, advertised in the metadata
 * and in challenges. Derived, so a new tool's scope is requestable the day the
 * tool ships instead of being refused at consent because nobody asked for it.
 */
export function scopesOf(registry: ToolRegistry): readonly string[] {
  return [...new Set(registry.tools.flatMap((tool) => tool.scopes))].sort();
}

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

export interface McpHttpService {
  readonly server: NodeHttpServer;
  handle(request: IncomingMessage, response: ServerResponse): Promise<void>;
}

const AUTH_FAILURE_CODES = new Set(['AUTH_REQUIRED', 'AUTH_INVALID_CREDENTIALS', 'FORBIDDEN']);

export function createMcpHttpService(options: McpHttpOptions): McpHttpService {
  const scopes = scopesOf(options.registry);
  const metadata = buildProtectedResourceMetadata({
    resourceUrl: options.resourceUrl,
    issuerUrl: options.issuerUrl,
    scopes,
    documentationUrl: options.documentationUrl,
  });
  const metadataPaths = new Set(protectedResourcePaths(options.resourceUrl));
  const metadataUrl = protectedResourceMetadataUrl(options.resourceUrl);
  const scopeHint = scopes.join(' ');

  /** No credential at all: say where to get one, without calling it invalid. */
  const challengeMissing = (response: ServerResponse, reason: string): void => {
    sendJson(
      response,
      401,
      new RelayError('AUTH_REQUIRED', {
        messageKey: 'error.unauthenticated.message',
        details: { reason },
      }).toProblemJson(),
      {
        'www-authenticate': buildAuthenticateChallenge({
          resourceMetadataUrl: metadataUrl,
          requiredScope: scopeHint,
        }),
      },
    );
  };

  /** A credential was presented and verification refused or could not decide. */
  const refuse = (response: ServerResponse, error: RelayError): void => {
    if (error.code === 'SCOPE_INSUFFICIENT') {
      sendJson(response, 403, error.toProblemJson(), {
        'www-authenticate': buildAuthenticateChallenge({
          resourceMetadataUrl: metadataUrl,
          error: 'insufficient_scope',
          requiredScope: scopeHint,
        }),
      });
      return;
    }
    if (!AUTH_FAILURE_CODES.has(error.code)) {
      // The authorization server is down or refused our own client. The token
      // may be perfectly good, so it is not called invalid: retry later.
      sendJson(response, error.status >= 500 ? error.status : 503, error.toProblemJson(), {
        'retry-after': '5',
      });
      return;
    }
    sendJson(response, 401, error.toProblemJson(), {
      'www-authenticate': buildAuthenticateChallenge({
        resourceMetadataUrl: metadataUrl,
        error: 'invalid_token',
        errorDescription: String(error.details['reason'] ?? error.code),
        requiredScope: scopeHint,
      }),
    });
  };

  const handle = async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const url = new URL(request.url ?? '/', options.resourceUrl);
    const method = (request.method ?? 'GET').toUpperCase();

    // Preflight is answered before anything else: a browser sends it without
    // the Authorization header, so it can never pass authentication.
    if (method === 'OPTIONS') {
      response.writeHead(204, PREFLIGHT_HEADERS);
      response.end();
      return;
    }

    if (metadataPaths.has(url.pathname) && method === 'GET') {
      sendJson(response, 200, metadata, { 'cache-control': 'public, max-age=300' });
      return;
    }

    if (url.pathname === HEALTH_PATH && method === 'GET') {
      const report = options.health?.() ?? {
        status: 'ok',
        service: 'mcp',
        sandbox: options.sandbox,
      };
      // A load balancer reads the status code, not the body.
      sendJson(response, report.status === 'down' ? 503 : 200, report);
      return;
    }

    if (url.pathname !== MCP_PATH) {
      sendJson(response, 404, { error: 'not_found' });
      return;
    }

    if (method !== 'POST') {
      sendJson(response, 405, { error: 'method_not_allowed' }, { allow: 'POST, OPTIONS' });
      return;
    }

    // A token in a query parameter ends up in access logs, referrer headers and
    // browser history. Header only, always.
    if (url.searchParams.has('access_token') || url.searchParams.has('token')) {
      refuse(
        response,
        new RelayError('AUTH_REQUIRED', {
          messageKey: 'error.unauthenticated.message',
          details: { reason: 'TOKEN_IN_QUERY_PARAMETER' },
        }),
      );
      return;
    }

    const authorization = request.headers['authorization'];
    const bearer = bearerFromHeader(authorization);
    if (bearer === null) {
      if (authorization === undefined) {
        challengeMissing(response, 'AUTHORIZATION_HEADER_MISSING');
      } else {
        refuse(
          response,
          new RelayError('AUTH_REQUIRED', {
            messageKey: 'error.unauthenticated.message',
            details: { reason: 'AUTHORIZATION_HEADER_MALFORMED' },
          }),
        );
      }
      return;
    }

    let grant: VerifiedGrant;
    try {
      grant = await options.verifier.verify(bearer);
    } catch (error) {
      const relayError = RelayError.fromUnknown(error);
      if (!AUTH_FAILURE_CODES.has(relayError.code)) {
        options.logger.warn(
          { event: 'mcp.verification_unavailable', reason: relayError.details['reason'] },
          'mcp.verification_unavailable',
        );
      }
      refuse(response, relayError);
      return;
    }

    let body: unknown;
    try {
      body = await readBody(request);
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

    for (const [name, value] of Object.entries(CORS_HEADERS)) {
      response.setHeader(name, value);
    }

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
