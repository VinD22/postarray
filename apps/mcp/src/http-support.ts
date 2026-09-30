import type { IncomingMessage, ServerResponse } from 'node:http';

import { RelayError } from '@relay/contracts';

/**
 * Transport plumbing for the HTTP surface: JSON responses, bounded body
 * reading and CORS.
 *
 * CORS is open (`*`) on purpose and safe for the same reason: this server
 * never reads a cookie. The only credential is a bearer token in a header a
 * page can only send if it already holds the token. Exposing
 * `WWW-Authenticate` is what lets a browser-based MCP client read the
 * challenge and find the authorization server at all.
 */

export const MAX_BODY_BYTES = 1024 * 1024;

export const CORS_HEADERS: Readonly<Record<string, string>> = {
  'access-control-allow-origin': '*',
  'access-control-expose-headers': 'WWW-Authenticate, Mcp-Session-Id, Mcp-Protocol-Version',
};

export const PREFLIGHT_HEADERS: Readonly<Record<string, string>> = {
  ...CORS_HEADERS,
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers':
    'Authorization, Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
  'access-control-max-age': '600',
};

export function sendJson(
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
    ...CORS_HEADERS,
    ...headers,
  });
  response.end(payload);
}

export async function readBody(request: IncomingMessage): Promise<unknown> {
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
