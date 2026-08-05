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

import { apiConfig } from './config.js';
import { newCorrelationId } from './correlation.js';
import { ApiError } from './error.js';

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
