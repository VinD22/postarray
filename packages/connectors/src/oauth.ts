import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

import { type ProviderId, RelayError } from '@relay/contracts';
import { z } from 'zod';

import type { AuthorizationDefinition, CredentialResult, OAuthClientConfig } from './contract.js';
import { ProviderCallError, classifyProviderError, ensureOk, parseProviderBody } from './errors.js';
import type { HttpClient, ProviderHttpClient } from './http.js';
import { type Clock, epochMillisecondsOf, instantOf, systemClock } from './ports.js';
import { SecretValue, leaseSecret } from './vault.js';

/**
 * OAuth 2 authorization code with PKCE, shared by every connector that uses it.
 *
 * Rules that are not negotiable:
 *
 * - `state` is 256 bits of randomness, compared in constant time.
 * - `code_challenge_method` is `S256`. `plain` does not exist here.
 * - The redirect URI is matched by exact string after normalization. No prefix
 *   match, no wildcard, no subdomain tolerance, no path suffix tolerance. The
 *   only relaxation is the loopback port for a native or CLI client.
 * - A refreshed refresh token is returned alongside the access token so the
 *   caller writes both in one transaction. A partially written refresh is the
 *   classic way to lock a customer out of their own connection.
 * - No function here logs a token. Tokens leave as `SecretValue`, which
 *   serializes to `[redacted]`.
 */

export const CODE_CHALLENGE_METHOD = 'S256';
export const STATE_BYTES = 32;
export const CODE_VERIFIER_BYTES = 32;
export const DEFAULT_TRANSACTION_TTL_SECONDS = 600;

function base64Url(bytes: Buffer): string {
  return bytes.toString('base64url');
}

/** 256 bits of entropy, base64url encoded. */
export function generateState(): string {
  return base64Url(randomBytes(STATE_BYTES));
}

/** Constant time comparison of the stored state and the returned state. */
export function verifyState(expected: string, actual: string): boolean {
  const left = Buffer.from(expected, 'utf8');
  const right = Buffer.from(actual, 'utf8');
  if (left.length === 0 || left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

/** RFC 7636 code verifier: 43 characters from 32 random bytes. */
export function generateCodeVerifier(): SecretValue {
  return new SecretValue(base64Url(randomBytes(CODE_VERIFIER_BYTES)), 'code_verifier');
}

/** RFC 7636 S256 challenge. The verifier itself never leaves the vault. */
export function createCodeChallenge(verifier: SecretValue | string): string {
  const value = typeof verifier === 'string' ? verifier : verifier.reveal();
  return base64Url(createHash('sha256').update(value, 'ascii').digest());
}

const LOOPBACK_HOSTS = new Set(['127.0.0.1', '[::1]', '::1']);

/**
 * Normalize for exact comparison: lowercase scheme and host, drop a default
 * port, keep the path byte for byte, and reject a fragment outright.
 */
export function normalizeRedirectUri(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'REDIRECT_URI_MALFORMED' },
    });
  }
  if (url.hash !== '') {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'REDIRECT_URI_HAS_FRAGMENT' },
    });
  }
  const host = url.hostname.toLowerCase();
  const isLoopback = LOOPBACK_HOSTS.has(host) || LOOPBACK_HOSTS.has(`[${host}]`);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && isLoopback)) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'REDIRECT_URI_SCHEME_NOT_ALLOWED', scheme: url.protocol },
    });
  }
  const defaultPort = url.protocol === 'https:' ? '443' : '80';
  const port = url.port === defaultPort ? '' : url.port;
  const authority =
    isLoopback && port !== '' ? `${host}:${port}` : port === '' ? host : `${host}:${port}`;
  return `${url.protocol}//${authority}${url.pathname}${url.search}`;
}

/**
 * Exact match, with the native app relaxation: on a loopback address the port
 * is ignored, because the client picks an ephemeral one. `localhost` by name is
 * never accepted, since name resolution is attacker influenceable.
 */
export function matchesRegisteredRedirect(registered: string, candidate: string): boolean {
  const left = normalizeRedirectUri(registered);
  const right = normalizeRedirectUri(candidate);
  if (left === right) {
    return true;
  }
  const leftUrl = new URL(left);
  const rightUrl = new URL(right);
  const bothLoopback =
    LOOPBACK_HOSTS.has(leftUrl.hostname) && LOOPBACK_HOSTS.has(rightUrl.hostname);
  if (!bothLoopback) {
    return false;
  }
  return (
    leftUrl.protocol === rightUrl.protocol &&
    leftUrl.hostname === rightUrl.hostname &&
    leftUrl.pathname === rightUrl.pathname &&
    leftUrl.search === rightUrl.search
  );
}

export function assertRedirectAllowed(allowlist: readonly string[], candidate: string): string {
  const match = allowlist.find((registered) => matchesRegisteredRedirect(registered, candidate));
  if (match === undefined) {
    throw new RelayError('VALIDATION_FAILED', {
      messageKey: 'error.request_invalid.message',
      details: { reason: 'REDIRECT_URI_NOT_REGISTERED' },
    });
  }
  return normalizeRedirectUri(candidate);
}

export interface AuthorizationRequest {
  readonly authorizationUrl: string;
  readonly state: string;
  /** Stored encrypted in `oauth_transactions`, never sent to the browser. */
  readonly codeVerifier: SecretValue;
  readonly codeChallenge: string;
  readonly redirectUri: string;
  readonly scopes: readonly string[];
  readonly expiresAt: string;
}

/**
 * Build the authorize URL for one connect attempt.
 *
 * ```ts
 * const request = createAuthorizationRequest({
 *   definition: connector.authorization(),
 *   client: { clientId, clientSecret: null, redirectUri },
 *   clock,
 * });
 * ```
 */
export function createAuthorizationRequest(input: {
  definition: AuthorizationDefinition;
  client: OAuthClientConfig;
  clock?: Clock;
  ttlSeconds?: number;
  /** Narrow the requested scopes. Defaults to every required scope. */
  scopes?: readonly string[];
  extraParameters?: Readonly<Record<string, string>>;
}): AuthorizationRequest {
  const clock = input.clock ?? systemClock;
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = createCodeChallenge(codeVerifier);
  const scopes =
    input.scopes ??
    input.definition.scopes.filter((scope) => scope.required).map((scope) => scope.scope);

  const url = new URL(input.definition.authorizeUrl);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', input.client.clientId);
  url.searchParams.set('redirect_uri', normalizeRedirectUri(input.client.redirectUri));
  url.searchParams.set('state', state);
  if (scopes.length > 0) {
    url.searchParams.set('scope', scopes.join(' '));
  }
  if (input.definition.pkceRequired) {
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('code_challenge_method', CODE_CHALLENGE_METHOD);
  }
  for (const [key, value] of Object.entries({
    ...input.definition.extraAuthorizeParameters,
    ...(input.extraParameters ?? {}),
  })) {
    url.searchParams.set(key, value);
  }

  return {
    authorizationUrl: url.toString(),
    state,
    codeVerifier,
    codeChallenge,
    redirectUri: normalizeRedirectUri(input.client.redirectUri),
    scopes,
    expiresAt: instantOf(
      clock.now().getTime() + (input.ttlSeconds ?? DEFAULT_TRANSACTION_TTL_SECONDS) * 1000,
    ),
  };
}

/** Some token endpoints answer with form encoding rather than JSON. */
const tokenResponseSchema = z.preprocess(
  (value) => {
    if (typeof value !== 'string') return value;
    if (!value.includes('=')) return value;
    return Object.fromEntries(new URLSearchParams(value).entries());
  },
  z.looseObject({
    access_token: z.string().min(1),
    token_type: z.string().min(1).optional(),
    expires_in: z.union([z.number(), z.string()]).optional(),
    refresh_token: z.string().min(1).optional(),
    refresh_token_expires_in: z.union([z.number(), z.string()]).optional(),
    scope: z.string().optional(),
  }),
);

function toSeconds(value: number | string | undefined): number | null {
  if (value === undefined) return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export const CLIENT_AUTH_METHODS = ['basic', 'body', 'none'] as const;
export type ClientAuthMethod = (typeof CLIENT_AUTH_METHODS)[number];

interface TokenCallInput {
  http: ProviderHttpClient;
  provider: ProviderId;
  definition: AuthorizationDefinition;
  client: OAuthClientConfig;
  clientAuthMethod?: ClientAuthMethod;
  clock?: Clock;
  form: Record<string, string>;
  operation: 'discover_accounts' | 'refresh_credential';
}

async function callTokenEndpoint(input: TokenCallInput): Promise<CredentialResult> {
  const clock = input.clock ?? systemClock;
  const method = input.clientAuthMethod ?? 'body';
  const form: Record<string, string> = { ...input.form, client_id: input.client.clientId };

  let authHeader: { handle: ReturnType<typeof leaseSecret>; scheme: string } | undefined;
  if (method === 'basic' && input.client.clientSecret !== null) {
    const encoded = Buffer.from(
      `${encodeURIComponent(input.client.clientId)}:${encodeURIComponent(
        input.client.clientSecret.reveal(),
      )}`,
      'utf8',
    ).toString('base64');
    authHeader = {
      handle: leaseSecret({
        secret: encoded,
        credentialKind: 'client_secret',
        purpose: 'oauth_token_endpoint',
        clock,
      }),
      scheme: 'Basic',
    };
  } else if (method === 'body' && input.client.clientSecret !== null) {
    form['client_secret'] = input.client.clientSecret.reveal();
  }

  try {
    const response = await input.http.request({
      method: 'POST',
      url: input.definition.tokenUrl,
      body: { kind: 'form', value: form },
      schema: tokenResponseSchema,
      operation: input.operation,
      // A token exchange creates no external post, so a bounded retry is safe.
      idempotent: true,
      bucket: 'oauth_token',
      ...(authHeader === undefined ? {} : { auth: authHeader }),
    });

    const payload = response.data;
    const expiresIn = toSeconds(payload.expires_in);
    const obtainedAt = clock.now();
    return {
      accessToken: new SecretValue(payload.access_token, 'access_token'),
      refreshToken:
        payload.refresh_token === undefined
          ? null
          : new SecretValue(payload.refresh_token, 'refresh_token'),
      tokenType: payload.token_type ?? 'Bearer',
      expiresAt: expiresIn === null ? null : instantOf(obtainedAt.getTime() + expiresIn * 1000),
      grantedScopes:
        payload.scope === undefined ? [] : payload.scope.split(/[\s,]+/).filter(Boolean),
      refreshTokenRotated: payload.refresh_token !== undefined,
      obtainedAt: obtainedAt.toISOString(),
    };
  } finally {
    authHeader?.handle.release();
    // Remove the plaintext secret from the form object we are about to drop.
    delete form['client_secret'];
  }
}

/** Exchange an authorization code. The verifier is revealed only here. */
export async function exchangeAuthorizationCode(input: {
  http: ProviderHttpClient;
  provider: ProviderId;
  definition: AuthorizationDefinition;
  client: OAuthClientConfig;
  code: string;
  codeVerifier: SecretValue;
  clientAuthMethod?: ClientAuthMethod;
  clock?: Clock;
}): Promise<CredentialResult> {
  return await callTokenEndpoint({
    http: input.http,
    provider: input.provider,
    definition: input.definition,
    client: input.client,
    operation: 'discover_accounts',
    ...(input.clientAuthMethod === undefined ? {} : { clientAuthMethod: input.clientAuthMethod }),
    ...(input.clock === undefined ? {} : { clock: input.clock }),
    form: {
      grant_type: 'authorization_code',
      code: input.code,
      redirect_uri: normalizeRedirectUri(input.client.redirectUri),
      ...(input.definition.pkceRequired ? { code_verifier: input.codeVerifier.reveal() } : {}),
    },
  });
}

/**
 * Refresh before expiry, at `refreshAtLifetimeFraction` of the token lifetime.
 * A rotated refresh token comes back on the result so the caller stores both
 * halves atomically.
 */
export async function refreshAccessToken(input: {
  http: ProviderHttpClient;
  provider: ProviderId;
  definition: AuthorizationDefinition;
  client: OAuthClientConfig;
  refreshToken: { use<T>(fn: (plaintext: string) => T | Promise<T>): Promise<T> };
  clientAuthMethod?: ClientAuthMethod;
  clock?: Clock;
  scopes?: readonly string[];
}): Promise<CredentialResult> {
  if (!input.definition.supportsRefresh) {
    throw new RelayError('CAPABILITY_UNSUPPORTED', {
      messageKey: 'error.capability_unsupported.message',
      details: { provider: input.provider, capability: 'refresh_credential' },
    });
  }
  return await input.refreshToken.use(
    async (token) =>
      await callTokenEndpoint({
        http: input.http,
        provider: input.provider,
        definition: input.definition,
        client: input.client,
        operation: 'refresh_credential',
        ...(input.clientAuthMethod === undefined
          ? {}
          : { clientAuthMethod: input.clientAuthMethod }),
        ...(input.clock === undefined ? {} : { clock: input.clock }),
        form: {
          grant_type: 'refresh_token',
          refresh_token: token,
          ...(input.scopes === undefined ? {} : { scope: input.scopes.join(' ') }),
        },
      }),
  );
}

/**
 * Call the provider revoke endpoint. The caller deletes our stored credential
 * whatever happens here: a provider revoke failure must never leave us holding
 * a token we told the user we deleted.
 */
export async function revokeCredential(input: {
  http: ProviderHttpClient;
  provider: ProviderId;
  definition: AuthorizationDefinition;
  client: OAuthClientConfig;
  token: { use<T>(fn: (plaintext: string) => T | Promise<T>): Promise<T> };
  tokenTypeHint?: 'access_token' | 'refresh_token';
  clock?: Clock;
}): Promise<{ revokedAtProvider: boolean; errorClass: string | null }> {
  const revokeUrl = input.definition.revokeUrl;
  if (revokeUrl === null) {
    return { revokedAtProvider: false, errorClass: null };
  }
  try {
    await input.token.use(async (token) => {
      await input.http.request({
        method: 'POST',
        url: revokeUrl,
        body: {
          kind: 'form',
          value: {
            token,
            client_id: input.client.clientId,
            ...(input.tokenTypeHint === undefined ? {} : { token_type_hint: input.tokenTypeHint }),
            ...(input.client.clientSecret === null
              ? {}
              : { client_secret: input.client.clientSecret.reveal() }),
          },
        },
        schema: z.unknown(),
        operation: 'revoke',
        idempotent: true,
        bucket: 'oauth_revoke',
        acceptStatuses: [200, 204, 400, 401],
      });
    });
    return { revokedAtProvider: true, errorClass: null };
  } catch (error) {
    if (ProviderCallError.is(error)) {
      return { revokedAtProvider: false, errorClass: error.classified.errorClass };
    }
    const classified = classifyProviderError({
      provider: input.provider,
      operation: 'revoke',
      body: error,
      ...(input.clock === undefined ? {} : { clock: input.clock }),
    });
    return { revokedAtProvider: false, errorClass: classified.errorClass };
  }
}

/** The instant at which a credential should be refreshed, before it expires. */
export function refreshDueAt(input: {
  obtainedAt: string;
  expiresAt: string | null;
  fraction: number;
}): string | null {
  if (input.expiresAt === null) {
    return null;
  }
  const start = epochMillisecondsOf(input.obtainedAt);
  const end = epochMillisecondsOf(input.expiresAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    return null;
  }
  return instantOf(start + (end - start) * input.fraction);
}

/* --------------------------------------------------- adapter facing helpers */

export interface OAuth2RefreshInput {
  readonly http: HttpClient;
  readonly provider: ProviderId;
  readonly tokenUrl: string;
  readonly clientId: string;
  readonly clientSecret?: string;
  readonly refreshToken: string;
  readonly extraForm?: Readonly<Record<string, string>>;
  /** Send the client credentials as HTTP basic rather than in the form body. */
  readonly basicAuth?: boolean;
  readonly clock: Clock;
}

/**
 * The plain RFC 6749 refresh grant, for adapters that hold the refresh token as
 * a resolved string rather than a handle.
 *
 * A rotated refresh token comes back on the result so the caller writes both
 * halves in one transaction.
 */
export async function refreshOAuth2Token(input: OAuth2RefreshInput): Promise<CredentialResult> {
  const form: Record<string, string> = {
    grant_type: 'refresh_token',
    refresh_token: input.refreshToken,
    client_id: input.clientId,
    ...(input.extraForm ?? {}),
  };
  const headers: Record<string, string> = {};
  if (input.clientSecret !== undefined) {
    if (input.basicAuth === true) {
      headers['authorization'] = `Basic ${Buffer.from(
        `${encodeURIComponent(input.clientId)}:${encodeURIComponent(input.clientSecret)}`,
        'utf8',
      ).toString('base64')}`;
    } else {
      form['client_secret'] = input.clientSecret;
    }
  }

  const response = await input.http.request({
    method: 'POST',
    url: input.tokenUrl,
    form,
    headers,
    accept: 'json',
    provider: input.provider,
    operation: 'refresh_credential',
    idempotent: true,
  });
  const context = { provider: input.provider, operation: 'refresh_credential', clock: input.clock };
  ensureOk(response, context);
  const payload = parseProviderBody(tokenResponseSchema, response, context);

  const expiresIn = toSeconds(payload.expires_in);
  const obtainedAt = input.clock.now();
  return {
    accessToken: new SecretValue(payload.access_token, 'access_token'),
    refreshToken:
      payload.refresh_token === undefined
        ? null
        : new SecretValue(payload.refresh_token, 'refresh_token'),
    tokenType: payload.token_type ?? 'Bearer',
    expiresAt: expiresIn === null ? null : instantOf(obtainedAt.getTime() + expiresIn * 1000),
    grantedScopes: payload.scope === undefined ? [] : payload.scope.split(/[\s,]+/).filter(Boolean),
    refreshTokenRotated: payload.refresh_token !== undefined,
    obtainedAt: obtainedAt.toISOString(),
  };
}
