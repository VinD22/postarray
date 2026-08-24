/**
 * The fetch wrapper.
 *
 * Responsibilities, in order:
 *  1. Attach the session. The session is an httpOnly cookie, so the browser
 *     sends it; server-side calls forward the incoming cookie header instead.
 *  2. Inject a correlation id on every request.
 *  3. Require an `Idempotency-Key` on every create, schedule, publish and
 *     cancel. A missing key is a programming error and throws before the
 *     request leaves the process.
 *  4. Parse `application/problem+json` into a typed `ApiError`.
 *  5. Refresh once on 401 and replay, and treat 403 as a scope or role problem
 *     that must never trigger a refresh loop.
 */

import { API_HEADERS, PROBLEM_JSON_CONTENT_TYPE, type ProblemJson } from '@relay/contracts';

import { apiConfig } from './config';
import { newCorrelationId } from './correlation';
import { ApiError } from './error';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/** Methods whose effect is externally visible and must be replay safe. */
const IDEMPOTENT_REQUIRED_METHODS: ReadonlySet<HttpMethod> = new Set(['POST', 'PUT']);

export interface RequestOptions {
  readonly method?: HttpMethod;
  readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
  readonly body?: unknown;
  /** Required for every request that creates, schedules, publishes or cancels. */
  readonly idempotencyKey?: string;
  /**
   * Set on a mutation that has no external side effect (renaming a draft, for
   * example) to opt out of the idempotency requirement deliberately.
   */
  readonly sideEffectFree?: boolean;
  readonly signal?: AbortSignal;
  /** Cookie header to forward when the call originates on the server. */
  readonly forwardCookie?: string;
  /**
   * `user-agent` and `accept-language` to forward alongside `forwardCookie`.
   *
   * The API binds a session to a fingerprint of these two headers at signin
   * (`clientFingerprint`, `apps/api/src/security/csrf.ts`) and rejects any
   * request whose fingerprint doesn't match — a deliberate anti-hijacking
   * check. A server-rendered page calls the API from the Next server, not the
   * browser, so without this the request carries Node's own `user-agent` (or
   * none) instead of the visitor's, the fingerprint never matches, and every
   * signed-in page load 401s and redirects back to sign-in. Forwarding the
   * cookie alone reproduces exactly that loop.
   */
  readonly forwardHeaders?: { readonly userAgent?: string; readonly acceptLanguage?: string };
}

/**
 * The subset of `RequestOptions` a Server Component passes down to a resource
 * call it makes directly (outside `requireSession`). Only `require-session.ts`
 * forwards these automatically; any other server-side read — the composer's
 * bootstrap, for instance — has to be given them explicitly, the same way.
 */
export interface ForwardAuth {
  readonly forwardCookie?: string;
  readonly forwardHeaders?: { readonly userAgent?: string; readonly acceptLanguage?: string };
}

/** Refresh state, so ten parallel 401s produce one refresh, not ten. */
let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(baseUrl: string): Promise<boolean> {
  const existing = refreshInFlight;
  if (existing !== null) {
    return existing;
  }
  const started = (async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/auth/session/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { [API_HEADERS.correlationId]: newCorrelationId() },
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      // Release on the next tick so concurrent callers all observe this result.
      queueMicrotask(() => {
        refreshInFlight = null;
      });
    }
  })();
  refreshInFlight = started;
  return started;
}

function buildUrl(baseUrl: string, path: string, query: RequestOptions['query']): string {
  const url = new URL(`${baseUrl}/${apiConfig.apiVersion}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

function parseRetryAfter(response: Response): number | null {
  const header =
    response.headers.get('retry-after') ?? response.headers.get(API_HEADERS.rateLimitReset);
  if (!header) {
    return null;
  }
  const seconds = Number.parseInt(header, 10);
  return Number.isFinite(seconds) ? seconds : null;
}

async function readProblem(response: Response): Promise<Partial<ProblemJson>> {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes(PROBLEM_JSON_CONTENT_TYPE) && !contentType.includes('json')) {
    return {};
  }
  try {
    const parsed: unknown = await response.json();
    return typeof parsed === 'object' && parsed !== null ? (parsed as Partial<ProblemJson>) : {};
  } catch {
    return {};
  }
}

function assertIdempotency(method: HttpMethod, options: RequestOptions, path: string): void {
  if (!IDEMPOTENT_REQUIRED_METHODS.has(method)) {
    return;
  }
  if (options.sideEffectFree === true || options.idempotencyKey !== undefined) {
    return;
  }
  throw new Error(
    `Missing Idempotency-Key for ${method} ${path}. Generate one with newIdempotencyKey() when the user commits to the action, or pass sideEffectFree when the call has no external effect.`,
  );
}

async function performOnce(
  baseUrl: string,
  path: string,
  options: RequestOptions,
  correlationId: string,
): Promise<Response> {
  const method = options.method ?? 'GET';
  const headers: Record<string, string> = {
    accept: 'application/json',
    [API_HEADERS.correlationId]: correlationId,
    [API_HEADERS.apiVersion]: apiConfig.apiVersion,
  };
  if (options.body !== undefined) {
    headers['content-type'] = 'application/json';
  }
  if (options.idempotencyKey !== undefined) {
    headers[API_HEADERS.idempotencyKey] = options.idempotencyKey;
  }
  if (options.forwardCookie !== undefined) {
    headers['cookie'] = options.forwardCookie;
    // A browser sets its own `Origin` on every cross-origin request; Node's
    // server-side `fetch` does not. The API's CSRF guard rejects any
    // cookie-authenticated, state-changing request with no allowed `Origin`
    // (`apps/api/src/guards/csrf.guard.ts`), so a Server Component making a
    // POST/PATCH/DELETE with a forwarded cookie — creating a draft on first
    // visit to `/compose`, for instance — always 403'd without this. The API
    // is configured to trust exactly this origin already (`APP_URL`); this is
    // that same origin, read from the equivalent client-side env var.
    const appOrigin = process.env.NEXT_PUBLIC_APP_URL;
    if (appOrigin !== undefined && appOrigin.length > 0) {
      headers['origin'] = appOrigin.replace(/\/+$/, '');
    }
  }
  if (options.forwardHeaders?.userAgent !== undefined) {
    headers['user-agent'] = options.forwardHeaders.userAgent;
  }
  if (options.forwardHeaders?.acceptLanguage !== undefined) {
    headers['accept-language'] = options.forwardHeaders.acceptLanguage;
  }
  const cookieSource =
    options.forwardCookie ?? (typeof document === 'undefined' ? undefined : document.cookie);
  if (STATE_CHANGING_METHODS.has(method)) {
    const csrfToken = readCookie(cookieSource, 'relay_csrf');
    if (csrfToken !== undefined) {
      headers[API_HEADERS.csrfToken] = csrfToken;
    }
  }
  const workspaceId = readCookie(cookieSource, 'relay_ws');
  if (workspaceId !== undefined) {
    headers[API_HEADERS.workspaceId] = workspaceId;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, apiConfig.timeoutMs);
  options.signal?.addEventListener('abort', () => {
    controller.abort();
  });

  try {
    return await fetch(buildUrl(baseUrl, path, options.query), {
      method,
      credentials: 'include',
      headers,
      signal: controller.signal,
      ...(options.body === undefined ? {} : { body: JSON.stringify(options.body) }),
    });
  } finally {
    clearTimeout(timeout);
  }
}

const STATE_CHANGING_METHODS: ReadonlySet<HttpMethod> = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function readCookie(source: string | undefined, name: string): string | undefined {
  if (source === undefined) {
    return undefined;
  }
  for (const part of source.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0 || part.slice(0, separator).trim() !== name) {
      continue;
    }
    const value = part.slice(separator + 1).trim();
    try {
      return decodeURIComponent(value);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/**
 * Send one request and return the parsed body.
 *
 * Throws `ApiError` and nothing else. A caller never has to inspect a status
 * code or a raw response.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  assertIdempotency(method, options, path);

  const correlationId = newCorrelationId();
  const baseUrl = apiConfig.baseUrl;
  if (baseUrl === null) {
    throw ApiError.network(correlationId);
  }

  let response: Response;
  try {
    response = await performOnce(baseUrl, path, options, correlationId);
  } catch {
    const online = typeof navigator === 'undefined' ? true : navigator.onLine;
    throw online ? ApiError.network(correlationId) : ApiError.offline(correlationId);
  }

  // 401 is a session problem: refresh once, then replay the exact request,
  // including its idempotency key, so the replay cannot duplicate anything.
  if (response.status === 401) {
    const refreshed = await refreshSession(baseUrl);
    if (refreshed) {
      try {
        response = await performOnce(baseUrl, path, options, correlationId);
      } catch {
        throw ApiError.network(correlationId);
      }
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    const problem = await readProblem(response);
    // 403 is a role or scope decision. It is never retried and never refreshed:
    // a refreshed session has exactly the same permissions.
    throw ApiError.fromProblem(
      problem,
      response.status,
      response.headers.get(API_HEADERS.correlationId) ?? correlationId,
      parseRetryAfter(response),
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    return undefined as T;
  }
}

/**
 * Send raw bytes to an upload ticket URL.
 *
 * An upload ticket points at one of two very different places and they must not
 * be treated the same way:
 *
 *  - **Post Array's own storage.** The ticket URL sits on the configured API origin
 *    (`{API_URL}/v1/media/uploads/...`). That endpoint authenticates the caller
 *    from the session cookie and requires `media:write`, and the browser is on a
 *    different origin (web 3000, api 3001), where `fetch` omits credentials by
 *    default. So this PUT needs exactly what every other mutation gets:
 *    `credentials: 'include'`, the CSRF token, the active workspace and a
 *    correlation id. Without them the upload 401s or 403s.
 *  - **A remote signed URL** (S3 or R2 presigned PUT). The signature covers the
 *    request; sending cookies or extra Post Array headers is at best useless and at
 *    worst breaks the signature or leaks the session to a third party origin.
 *    Those requests carry the ticket's own headers and nothing else, with
 *    credentials explicitly omitted.
 *
 * The two are told apart by origin, not by guessing at the path: same origin as
 * the configured API base means it is ours.
 */
export function isRelayUploadUrl(uploadUrl: string): boolean {
  const baseUrl = apiConfig.baseUrl;
  if (baseUrl === null) {
    return false;
  }
  try {
    return new URL(uploadUrl).origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
}

export interface UploadRequestOptions {
  readonly method?: 'PUT' | 'POST';
  /** Headers the upload ticket said to send. Always forwarded verbatim. */
  readonly ticketHeaders?: Readonly<Record<string, string>>;
  readonly signal?: AbortSignal;
}

/**
 * Throws `ApiError` on failure, like `request`, so a caller never inspects a
 * status code.
 */
export async function sendUpload(
  uploadUrl: string,
  body: Blob,
  options: UploadRequestOptions = {},
): Promise<void> {
  const correlationId = newCorrelationId();
  const headers: Record<string, string> = { ...options.ticketHeaders };
  const relayOwned = isRelayUploadUrl(uploadUrl);

  if (relayOwned) {
    headers[API_HEADERS.correlationId] = correlationId;
    headers[API_HEADERS.apiVersion] = apiConfig.apiVersion;
    const cookieSource = typeof document === 'undefined' ? undefined : document.cookie;
    const csrfToken = readCookie(cookieSource, 'relay_csrf');
    if (csrfToken !== undefined) {
      headers[API_HEADERS.csrfToken] = csrfToken;
    }
    const workspaceId = readCookie(cookieSource, 'relay_ws');
    if (workspaceId !== undefined) {
      headers[API_HEADERS.workspaceId] = workspaceId;
    }
  }

  let response: Response;
  try {
    response = await fetch(uploadUrl, {
      method: options.method ?? 'PUT',
      // Post Array's own endpoint authenticates from the session cookie across
      // origins. A presigned third party URL must never receive it.
      credentials: relayOwned ? 'include' : 'omit',
      headers,
      body,
      ...(options.signal === undefined ? {} : { signal: options.signal }),
    });
  } catch {
    const online = typeof navigator === 'undefined' ? true : navigator.onLine;
    throw online ? ApiError.network(correlationId) : ApiError.offline(correlationId);
  }

  if (!response.ok) {
    const problem = await readProblem(response);
    throw ApiError.fromProblem(
      problem,
      response.status,
      response.headers.get(API_HEADERS.correlationId) ?? correlationId,
      parseRetryAfter(response),
    );
  }
}
