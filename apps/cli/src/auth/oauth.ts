import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

import { z } from 'zod';
import { RelayError, scopeSchema } from '@relay/contracts';
import type { Scope } from '@relay/contracts';

import { DISCOVERY_PATHS } from '../api/routes';

/**
 * CLI login.
 *
 * Two flows, both public-client shaped, both PKCE. The device flow is the
 * default because it works over SSH and in a container where no browser exists.
 * The authorization-code flow binds to `127.0.0.1` on an ephemeral port, which
 * is the only redirect target a public client should ever use.
 *
 * There is no password grant and no long-lived workspace token. A token that
 * cannot be revoked per client is not a credential, it is a liability.
 */

export const authorizationServerMetadataSchema = z
  .object({
    issuer: z.string().min(1),
    authorization_endpoint: z.string().min(1).optional(),
    token_endpoint: z.string().min(1),
    device_authorization_endpoint: z.string().min(1).optional(),
    revocation_endpoint: z.string().min(1).optional(),
    scopes_supported: z.array(z.string()).optional(),
    code_challenge_methods_supported: z.array(z.string()).optional(),
    grant_types_supported: z.array(z.string()).optional(),
  })
  .strip();
export type AuthorizationServerMetadata = z.infer<typeof authorizationServerMetadataSchema>;

export const deviceAuthorizationSchema = z
  .object({
    device_code: z.string().min(1),
    user_code: z.string().min(1),
    verification_uri: z.string().min(1),
    verification_uri_complete: z.string().min(1).optional(),
    expires_in: z.number().int().positive(),
    interval: z.number().int().positive().default(5),
  })
  .strip();
export type DeviceAuthorization = z.infer<typeof deviceAuthorizationSchema>;

export const tokenResponseSchema = z
  .object({
    access_token: z.string().min(1),
    token_type: z.string().min(1),
    expires_in: z.number().int().positive().optional(),
    refresh_token: z.string().min(1).optional(),
    scope: z.string().optional(),
    /** Our issuer returns these so the CLI can show what it is bound to. */
    workspace_id: z.string().min(1).optional(),
    sub: z.string().min(1).optional(),
  })
  .strip();
export type TokenResponse = z.infer<typeof tokenResponseSchema>;

export const tokenErrorSchema = z
  .object({
    error: z.string().min(1),
    error_description: z.string().optional(),
  })
  .strip();

export type HttpPost = (
  url: string,
  form: Readonly<Record<string, string>>,
) => Promise<{ status: number; body: string }>;

export type HttpGet = (url: string) => Promise<{ status: number; body: string }>;

export interface OAuthTransport {
  get: HttpGet;
  post: HttpPost;
}

/** The default transport. Form encoded, as the OAuth specs require. */
export function createFetchTransport(fetchImpl: typeof fetch = fetch): OAuthTransport {
  return {
    async get(url: string) {
      const response = await fetchImpl(url, { headers: { accept: 'application/json' } });
      return { status: response.status, body: await response.text() };
    },
    async post(url: string, form: Readonly<Record<string, string>>) {
      const response = await fetchImpl(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
        body: new URLSearchParams(form).toString(),
      });
      return { status: response.status, body: await response.text() };
    },
  };
}

function parseJson(body: string): unknown {
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return undefined;
  }
}

function oauthError(body: string, fallback: string): RelayError {
  const parsed = tokenErrorSchema.safeParse(parseJson(body));
  const reason = parsed.success ? parsed.data.error : fallback;
  const code =
    reason === 'access_denied' || reason === 'invalid_grant' ? 'FORBIDDEN' : 'AUTH_REQUIRED';
  return new RelayError(code, {
    messageKey: code === 'FORBIDDEN' ? 'error.forbidden.message' : 'error.unauthenticated.message',
    details: { oauthError: reason },
  });
}

export async function discoverAuthorizationServer(
  apiUrl: string,
  transport: OAuthTransport,
): Promise<AuthorizationServerMetadata> {
  const url = new URL(DISCOVERY_PATHS.authorizationServer, apiUrl).toString();
  const response = await transport.get(url);
  if (response.status !== 200) {
    throw new RelayError('AUTH_REQUIRED', {
      messageKey: 'error.unauthenticated.message',
      details: { reason: 'DISCOVERY_UNAVAILABLE', httpStatus: response.status },
    });
  }
  const parsed = authorizationServerMetadataSchema.safeParse(parseJson(response.body));
  if (!parsed.success) {
    throw new RelayError('INTERNAL', {
      messageKey: 'error.internal.message',
      details: { reason: 'DISCOVERY_SHAPE_UNEXPECTED' },
    });
  }
  return parsed.data;
}

export interface PkcePair {
  readonly verifier: string;
  readonly challenge: string;
  readonly method: 'S256';
}

export function createPkcePair(): PkcePair {
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge, method: 'S256' };
}

export interface LoginResult {
  readonly accessToken: string;
  readonly refreshToken: string | null;
  readonly expiresInSeconds: number | null;
  readonly scopes: readonly Scope[];
  readonly subject: string;
  readonly workspaceId: string;
  readonly issuer: string;
}

function toLoginResult(
  token: TokenResponse,
  metadata: AuthorizationServerMetadata,
  fallbackWorkspaceId: string | null,
): LoginResult {
  if (token.token_type.toLowerCase() !== 'bearer') {
    throw new RelayError('AUTH_REQUIRED', {
      messageKey: 'error.unauthenticated.message',
      details: { reason: 'UNSUPPORTED_TOKEN_TYPE' },
    });
  }
  const scopes = (token.scope ?? '')
    .split(/\s+/)
    .filter((value) => value.length > 0)
    .map((value) => scopeSchema.safeParse(value))
    .flatMap((result) => (result.success ? [result.data] : []));

  const workspaceId = token.workspace_id ?? fallbackWorkspaceId;
  if (workspaceId === null || workspaceId === undefined) {
    throw new RelayError('WORKSPACE_NOT_FOUND', {
      messageKey: 'error.workspace_not_found.message',
      details: { reason: 'TOKEN_WITHOUT_WORKSPACE' },
    });
  }

  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token ?? null,
    expiresInSeconds: token.expires_in ?? null,
    scopes,
    subject: token.sub ?? 'unknown',
    workspaceId,
    issuer: metadata.issuer,
  };
}

export interface DeviceLoginOptions {
  readonly apiUrl: string;
  readonly clientId: string;
  readonly scopes: readonly Scope[];
  readonly transport: OAuthTransport;
  /** Called once with the URL and code so the caller decides how to show them. */
  readonly onPrompt: (authorization: DeviceAuthorization) => void;
  readonly sleep?: (ms: number) => Promise<void>;
  readonly maxPollSeconds?: number;
  readonly workspaceId?: string | null;
}

const DEFAULT_MAX_POLL_SECONDS = 600;

export async function deviceLogin(options: DeviceLoginOptions): Promise<LoginResult> {
  const metadata = await discoverAuthorizationServer(options.apiUrl, options.transport);
  const deviceEndpoint = metadata.device_authorization_endpoint;
  if (deviceEndpoint === undefined) {
    throw new RelayError('CAPABILITY_NOT_IMPLEMENTED', {
      messageKey: 'error.not_implemented.message',
      details: { reason: 'DEVICE_FLOW_UNSUPPORTED' },
    });
  }

  const pkce = createPkcePair();
  const start = await options.transport.post(deviceEndpoint, {
    client_id: options.clientId,
    scope: options.scopes.join(' '),
    code_challenge: pkce.challenge,
    code_challenge_method: pkce.method,
  });
  if (start.status < 200 || start.status >= 300) {
    throw oauthError(start.body, 'device_authorization_failed');
  }
  const authorization = deviceAuthorizationSchema.safeParse(parseJson(start.body));
  if (!authorization.success) {
    throw new RelayError('INTERNAL', {
      messageKey: 'error.internal.message',
      details: { reason: 'DEVICE_AUTHORIZATION_SHAPE_UNEXPECTED' },
    });
  }

  options.onPrompt(authorization.data);

  const sleep =
    options.sleep ??
    ((ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms).unref();
      }));

  let intervalSeconds = authorization.data.interval;
  const budgetSeconds = Math.min(
    options.maxPollSeconds ?? DEFAULT_MAX_POLL_SECONDS,
    authorization.data.expires_in,
  );
  let waitedSeconds = 0;

  for (;;) {
    await sleep(intervalSeconds * 1000);
    waitedSeconds += intervalSeconds;
    if (waitedSeconds > budgetSeconds) {
      throw new RelayError('AUTH_REQUIRED', {
        messageKey: 'error.session_expired.message',
        details: { reason: 'DEVICE_CODE_EXPIRED' },
      });
    }

    const poll = await options.transport.post(metadata.token_endpoint, {
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      device_code: authorization.data.device_code,
      client_id: options.clientId,
      code_verifier: pkce.verifier,
    });

    if (poll.status >= 200 && poll.status < 300) {
      const token = tokenResponseSchema.safeParse(parseJson(poll.body));
      if (!token.success) {
        throw new RelayError('INTERNAL', {
          messageKey: 'error.internal.message',
          details: { reason: 'TOKEN_SHAPE_UNEXPECTED' },
        });
      }
      return toLoginResult(token.data, metadata, options.workspaceId ?? null);
    }

    const failure = tokenErrorSchema.safeParse(parseJson(poll.body));
    const reason = failure.success ? failure.data.error : 'unknown_error';
    if (reason === 'authorization_pending') {
      continue;
    }
    if (reason === 'slow_down') {
      intervalSeconds += 5;
      continue;
    }
    throw oauthError(poll.body, reason);
  }
}

export interface AuthorizationCodeLoginOptions {
  readonly apiUrl: string;
  readonly clientId: string;
  readonly scopes: readonly Scope[];
  readonly transport: OAuthTransport;
  /** Called with the URL the person must open. The CLI never launches a browser. */
  readonly onPrompt: (authorizationUrl: string) => void;
  readonly timeoutMs?: number;
  readonly workspaceId?: string | null;
}

const DEFAULT_AUTH_CODE_TIMEOUT_MS = 300_000;
const CALLBACK_PATH = '/callback';

/**
 * Authorization code with PKCE against a loopback redirect.
 *
 * The listener binds to `127.0.0.1` explicitly rather than `localhost`, because
 * `localhost` can resolve to an address another process is listening on. It
 * accepts exactly one request, compares `state` in constant time and shuts down
 * whatever the outcome.
 */
export async function authorizationCodeLogin(
  options: AuthorizationCodeLoginOptions,
): Promise<LoginResult> {
  const metadata = await discoverAuthorizationServer(options.apiUrl, options.transport);
  const authorizationEndpoint = metadata.authorization_endpoint;
  if (authorizationEndpoint === undefined) {
    throw new RelayError('CAPABILITY_NOT_IMPLEMENTED', {
      messageKey: 'error.not_implemented.message',
      details: { reason: 'AUTHORIZATION_CODE_FLOW_UNSUPPORTED' },
    });
  }

  const pkce = createPkcePair();
  const state = randomUUID();
  const server = createServer();

  const received = new Promise<{ code: string; state: string }>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new RelayError('AUTH_REQUIRED', {
          messageKey: 'error.session_expired.message',
          details: { reason: 'AUTHORIZATION_TIMED_OUT' },
        }),
      );
    }, options.timeoutMs ?? DEFAULT_AUTH_CODE_TIMEOUT_MS);
    timer.unref();

    server.on('request', (request, response) => {
      const url = new URL(request.url ?? '/', 'http://127.0.0.1');
      if (url.pathname !== CALLBACK_PATH) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end();
        return;
      }
      const code = url.searchParams.get('code');
      const returnedState = url.searchParams.get('state');
      response
        .writeHead(200, {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'no-store',
        })
        .end('relay-cli: you can close this window\n');
      clearTimeout(timer);
      if (code === null || returnedState === null) {
        reject(
          new RelayError('AUTH_REQUIRED', {
            messageKey: 'error.unauthenticated.message',
            details: { reason: 'CALLBACK_INCOMPLETE' },
          }),
        );
        return;
      }
      resolve({ code, state: returnedState });
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  try {
    const address: AddressInfo | string | null = server.address();
    if (address === null || typeof address === 'string') {
      throw new RelayError('INTERNAL', {
        messageKey: 'error.internal.message',
        details: { reason: 'LOOPBACK_LISTENER_FAILED' },
      });
    }
    const redirectUri = `http://127.0.0.1:${address.port}${CALLBACK_PATH}`;
    const authorizationUrl = new URL(authorizationEndpoint);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('client_id', options.clientId);
    authorizationUrl.searchParams.set('redirect_uri', redirectUri);
    authorizationUrl.searchParams.set('scope', options.scopes.join(' '));
    authorizationUrl.searchParams.set('state', state);
    authorizationUrl.searchParams.set('code_challenge', pkce.challenge);
    authorizationUrl.searchParams.set('code_challenge_method', pkce.method);
    options.onPrompt(authorizationUrl.toString());

    const callback = await received;
    const expected = Buffer.from(state, 'utf8');
    const actual = Buffer.from(callback.state, 'utf8');
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      throw new RelayError('FORBIDDEN', {
        messageKey: 'error.forbidden.message',
        details: { reason: 'STATE_MISMATCH' },
      });
    }

    const exchange = await options.transport.post(metadata.token_endpoint, {
      grant_type: 'authorization_code',
      code: callback.code,
      client_id: options.clientId,
      redirect_uri: redirectUri,
      code_verifier: pkce.verifier,
    });
    if (exchange.status < 200 || exchange.status >= 300) {
      throw oauthError(exchange.body, 'token_exchange_failed');
    }
    const token = tokenResponseSchema.safeParse(parseJson(exchange.body));
    if (!token.success) {
      throw new RelayError('INTERNAL', {
        messageKey: 'error.internal.message',
        details: { reason: 'TOKEN_SHAPE_UNEXPECTED' },
      });
    }
    return toLoginResult(token.data, metadata, options.workspaceId ?? null);
  } finally {
    server.close();
  }
}

/** Revoke at the issuer, then forget locally. Local-only logout is not logout. */
export async function revokeToken(
  apiUrl: string,
  transport: OAuthTransport,
  clientId: string,
  token: string,
): Promise<boolean> {
  const metadata = await discoverAuthorizationServer(apiUrl, transport);
  if (metadata.revocation_endpoint === undefined) {
    return false;
  }
  const response = await transport.post(metadata.revocation_endpoint, {
    token,
    client_id: clientId,
    token_type_hint: 'access_token',
  });
  return response.status >= 200 && response.status < 300;
}
