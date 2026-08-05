import { type ProviderId } from '@relay/contracts';
import { z } from 'zod';

import {
  type ClassifiedProviderError,
  ProviderCallError,
  type ProviderOperation,
  asProviderOperation,
  classifyProviderError,
} from './errors.js';
import {
  type Clock,
  type ConnectorLogger,
  type Sleeper,
  epochMillisecondsOf,
  instantOf,
  noopLogger,
  realSleeper,
  systemClock,
} from './ports.js';
import { sanitizeHeaders, sanitizeText } from './sanitize.js';
import { type UrlGuardOptions, assertSafeUrl } from './ssrf.js';
import { type SecretHandle } from './vault.js';

/**
 * The shared provider HTTP client.
 *
 * One client per provider, constructed once and reused. It owns:
 *
 * - timeouts, per request and per attempt;
 * - bounded retries with full jitter, for operations the caller declared safe
 *   to repeat and only for `TRANSIENT_PROVIDER`;
 * - rate limit awareness driven by response headers, tracked per provider and
 *   per bucket, so the next call knows it must wait before it is sent;
 * - request and response redaction, so nothing token shaped reaches a log;
 * - the SSRF guard, when the URL came from a user rather than from config.
 *
 * A credential is passed as a `SecretHandle`. The plaintext exists only inside
 * the closure that builds the `Authorization` header, and is never returned,
 * logged or stored on the response.
 */

export const DEFAULT_TIMEOUT_MS = 15_000;
export const DEFAULT_MAX_ATTEMPTS = 3;
export const DEFAULT_BASE_BACKOFF_MS = 500;
export const MAX_BACKOFF_MS = 30_000;
export const DEFAULT_MAX_RESPONSE_BYTES = 8 * 1024 * 1024;

export interface RateLimitSnapshot {
  readonly provider: ProviderId;
  readonly bucket: string;
  readonly limit: number | null;
  readonly remaining: number | null;
  readonly resetAt: string | null;
  readonly observedAt: string;
}

const RATE_LIMIT_HEADER_SETS: readonly {
  limit: string;
  remaining: string;
  reset: string;
}[] = [
  { limit: 'x-rate-limit-limit', remaining: 'x-rate-limit-remaining', reset: 'x-rate-limit-reset' },
  { limit: 'x-ratelimit-limit', remaining: 'x-ratelimit-remaining', reset: 'x-ratelimit-reset' },
  { limit: 'ratelimit-limit', remaining: 'ratelimit-remaining', reset: 'ratelimit-reset' },
];

function headerNumber(headers: Readonly<Record<string, string>>, name: string): number | null {
  const raw = headers[name];
  if (raw === undefined) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

/** Read whichever rate limit header family this provider uses. */
export function readRateLimitHeaders(
  headers: Readonly<Record<string, string>>,
  clock: Clock,
): { limit: number | null; remaining: number | null; resetAt: string | null } {
  for (const set of RATE_LIMIT_HEADER_SETS) {
    const remaining = headerNumber(headers, set.remaining);
    const limit = headerNumber(headers, set.limit);
    const reset = headerNumber(headers, set.reset);
    if (remaining === null && limit === null && reset === null) {
      continue;
    }
    let resetAt: string | null = null;
    if (reset !== null) {
      const nowMs = clock.now().getTime();
      // Above one year of seconds it is an absolute epoch second, below it is a delta.
      const atMs = reset > 31_536_000 ? reset * 1000 : nowMs + reset * 1000;
      resetAt = instantOf(atMs);
    }
    return { limit, remaining, resetAt };
  }
  return { limit: null, remaining: null, resetAt: null };
}

/**
 * Per provider, per bucket observations. In process only: the durable record of
 * a provider limit belongs in `provider_limits`, written by the application.
 */
export class RateLimitTracker {
  readonly #entries = new Map<string, RateLimitSnapshot>();

  #key(provider: ProviderId, bucket: string): string {
    return `${provider}:${bucket}`;
  }

  observe(input: {
    provider: ProviderId;
    bucket: string;
    headers: Readonly<Record<string, string>>;
    clock: Clock;
  }): RateLimitSnapshot | null {
    const parsed = readRateLimitHeaders(input.headers, input.clock);
    if (parsed.limit === null && parsed.remaining === null && parsed.resetAt === null) {
      return null;
    }
    const snapshot: RateLimitSnapshot = {
      provider: input.provider,
      bucket: input.bucket,
      limit: parsed.limit,
      remaining: parsed.remaining,
      resetAt: parsed.resetAt,
      observedAt: input.clock.now().toISOString(),
    };
    this.#entries.set(this.#key(input.provider, input.bucket), snapshot);
    return snapshot;
  }

  get(provider: ProviderId, bucket: string): RateLimitSnapshot | null {
    return this.#entries.get(this.#key(provider, bucket)) ?? null;
  }

  /** Seconds the caller must wait before this bucket accepts another call. */
  secondsUntilAvailable(provider: ProviderId, bucket: string, clock: Clock): number {
    const snapshot = this.get(provider, bucket);
    if (snapshot === null || snapshot.remaining === null || snapshot.remaining > 0) {
      return 0;
    }
    if (snapshot.resetAt === null) {
      return 0;
    }
    const resetMs = epochMillisecondsOf(snapshot.resetAt);
    const deltaMs = resetMs - clock.now().getTime();
    return deltaMs <= 0 ? 0 : Math.ceil(deltaMs / 1000);
  }

  clear(): void {
    this.#entries.clear();
  }
}

export type ProviderRequestBody =
  | { readonly kind: 'json'; readonly value: unknown }
  | { readonly kind: 'form'; readonly value: Readonly<Record<string, string>> }
  | { readonly kind: 'text'; readonly value: string; readonly contentType: string }
  | { readonly kind: 'binary'; readonly value: Uint8Array; readonly contentType: string };

export interface ProviderHttpRequest<T> {
  readonly method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly url: string;
  readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
  readonly headers?: Readonly<Record<string, string>>;
  readonly body?: ProviderRequestBody;
  /** Bearer credential. Plaintext never leaves the handle's callback. */
  readonly auth?: { readonly handle: SecretHandle; readonly scheme?: string };
  /** Zod schema for the response body. Parse, never cast. */
  readonly schema: z.ZodType<T>;
  readonly operation: ProviderOperation;
  /**
   * True only when repeating the call cannot create a second external object.
   * A create is never idempotent until `ensureNotAlreadyPublished()` says so,
   * or the provider accepted an idempotency key.
   */
  readonly idempotent: boolean;
  readonly timeoutMs?: number;
  readonly maxAttempts?: number;
  readonly maxResponseBytes?: number;
  /** Rate limit bucket, when a provider meters endpoints separately. */
  readonly bucket?: string;
  /** Statuses treated as success in addition to 2xx. */
  readonly acceptStatuses?: readonly number[];
  /** Set when the URL came from a user, so the SSRF guard runs first. */
  readonly guard?: UrlGuardOptions;
  readonly signal?: AbortSignal;
}

export interface ProviderHttpResponse<T> {
  readonly status: number;
  readonly data: T;
  readonly headers: Readonly<Record<string, string>>;
  readonly rateLimit: RateLimitSnapshot | null;
  readonly requestId: string | null;
  readonly attempts: number;
  readonly durationMs: number;
}

export interface ProviderHttpClientOptions {
  readonly provider: ProviderId;
  readonly baseUrl?: string;
  readonly defaultHeaders?: Readonly<Record<string, string>>;
  readonly fetchImpl?: typeof fetch;
  readonly clock?: Clock;
  readonly sleeper?: Sleeper;
  readonly logger?: ConnectorLogger;
  readonly rateLimits?: RateLimitTracker;
  readonly timeoutMs?: number;
  readonly maxAttempts?: number;
  readonly baseBackoffMs?: number;
  /** Injected so backoff jitter is deterministic in tests. */
  readonly random?: () => number;
  /** Sleep through a known rate limit window instead of failing immediately. */
  readonly waitForRateLimit?: boolean;
  readonly maxRateLimitWaitSeconds?: number;
}

function buildUrl(base: string | undefined, url: string, query: ProviderHttpRequest<unknown>['query']): string {
  const resolved = base === undefined || /^https?:\/\//i.test(url) ? url : new URL(url, base).toString();
  if (query === undefined) {
    return resolved;
  }
  const parsed = new URL(resolved);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    parsed.searchParams.set(key, String(value));
  }
  return parsed.toString();
}

function encodeBody(body: ProviderRequestBody | undefined): {
  payload: string | Uint8Array | undefined;
  contentType: string | undefined;
} {
  if (body === undefined) {
    return { payload: undefined, contentType: undefined };
  }
  switch (body.kind) {
    case 'json':
      return { payload: JSON.stringify(body.value), contentType: 'application/json' };
    case 'form':
      return {
        payload: new URLSearchParams(body.value).toString(),
        contentType: 'application/x-www-form-urlencoded',
      };
    case 'text':
      return { payload: body.value, contentType: body.contentType };
    case 'binary':
      return { payload: body.value, contentType: body.contentType };
  }
}

/** Read the body with a hard byte ceiling. Anything beyond the cap is dropped. */
async function readCapped(response: Response, maxBytes: number): Promise<Uint8Array> {
  const stream = response.body;
  if (stream === null) {
    return new Uint8Array(0);
  }
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value === undefined) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        break;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const merged = new Uint8Array(total > maxBytes ? maxBytes : total);
  let offset = 0;
  for (const chunk of chunks) {
    if (offset + chunk.byteLength > merged.length) break;
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged;
}

function parseMaybeJson(text: string, contentType: string | null): unknown {
  if (text === '') return null;
  const isJson = contentType !== null && /json/i.test(contentType);
  if (!isJson && !/^[[{]/.test(text.trimStart())) {
    return text;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export class ProviderHttpClient {
  readonly provider: ProviderId;
  readonly rateLimits: RateLimitTracker;
  readonly #options: ProviderHttpClientOptions;
  readonly #clock: Clock;
  readonly #sleeper: Sleeper;
  readonly #logger: ConnectorLogger;
  readonly #fetch: typeof fetch;
  readonly #random: () => number;

  constructor(options: ProviderHttpClientOptions) {
    this.#options = options;
    this.provider = options.provider;
    this.#clock = options.clock ?? systemClock;
    this.#sleeper = options.sleeper ?? realSleeper;
    this.#logger = options.logger ?? noopLogger;
    this.#fetch = options.fetchImpl ?? fetch;
    this.#random = options.random ?? Math.random;
    this.rateLimits = options.rateLimits ?? new RateLimitTracker();
  }

  /** Full jitter exponential backoff, honouring any provider reset hint. */
  backoffMs(attempt: number, retryAfterSeconds: number | null): number {
    const base = this.#options.baseBackoffMs ?? DEFAULT_BASE_BACKOFF_MS;
    const exponential = Math.min(base * 2 ** Math.max(0, attempt - 1), MAX_BACKOFF_MS);
    const jittered = Math.floor(this.#random() * exponential);
    const hinted = retryAfterSeconds === null ? 0 : retryAfterSeconds * 1000;
    return Math.min(Math.max(jittered, hinted), MAX_BACKOFF_MS);
  }

  async request<T>(request: ProviderHttpRequest<T>): Promise<ProviderHttpResponse<T>> {
    const bucket = request.bucket ?? request.operation;
    const maxAttempts = Math.max(
      1,
      request.idempotent ? (request.maxAttempts ?? this.#options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS) : 1,
    );
    const startedMs = this.#clock.now().getTime();
    let lastError: ProviderCallError | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await this.#respectKnownRateLimit(bucket, request.operation);
      try {
        const response = await this.#attempt(request, bucket, attempt);
        return {
          ...response,
          attempts: attempt,
          durationMs: this.#clock.now().getTime() - startedMs,
        };
      } catch (error) {
        if (!ProviderCallError.is(error)) {
          throw error;
        }
        lastError = error;
        const canRetry = request.idempotent && error.classified.retryable && attempt < maxAttempts;
        this.#logger.warn(
          {
            provider: this.provider,
            operation: request.operation,
            attempt,
            maxAttempts,
            errorClass: error.classified.errorClass,
            remediationCode: error.classified.remediationCode,
            httpStatus: error.classified.httpStatus,
            willRetry: canRetry,
          },
          'connector.http.attempt_failed',
        );
        if (!canRetry) {
          throw error;
        }
        await this.#sleeper.sleep(this.backoffMs(attempt, error.classified.retryAfterSeconds));
      }
    }
    throw lastError ?? new ProviderCallError(this.#classify(request.operation, {}));
  }

  #classify(
    operation: ProviderOperation,
    input: { status?: number; body?: unknown; headers?: Readonly<Record<string, string>>; transportCode?: string },
  ): ClassifiedProviderError {
    return classifyProviderError({
      provider: this.provider,
      operation,
      clock: this.#clock,
      ...(input.status === undefined ? {} : { status: input.status }),
      ...(input.body === undefined ? {} : { body: input.body }),
      ...(input.headers === undefined ? {} : { headers: input.headers }),
      ...(input.transportCode === undefined ? {} : { transportCode: input.transportCode }),
    });
  }

  async #respectKnownRateLimit(bucket: string, operation: ProviderOperation): Promise<void> {
    const waitSeconds = this.rateLimits.secondsUntilAvailable(this.provider, bucket, this.#clock);
    if (waitSeconds <= 0) {
      return;
    }
    const cap = this.#options.maxRateLimitWaitSeconds ?? 60;
    if (this.#options.waitForRateLimit === true && waitSeconds <= cap) {
      this.#logger.info(
        { provider: this.provider, bucket, waitSeconds },
        'connector.http.rate_limit_wait',
      );
      await this.#sleeper.sleep(waitSeconds * 1000);
      return;
    }
    throw new ProviderCallError(
      this.#classify(operation, {
        status: 429,
        body: { message: 'rate limit window still open' },
        headers: { 'retry-after': String(waitSeconds) },
      }),
    );
  }

  /**
   * One exchange: build, guard, send, observe the rate limit and read the body.
   * It throws only for a transport failure, never for a status code, so both
   * `request()` and the non throwing `HttpClient` facade can build on it.
   */
  async #exchange(input: {
    method: ProviderHttpRequest<unknown>['method'];
    url: string;
    query: ProviderHttpRequest<unknown>['query'];
    headers: ProviderHttpRequest<unknown>['headers'];
    body: ProviderRequestBody | undefined;
    auth: ProviderHttpRequest<unknown>['auth'];
    operation: ProviderOperation;
    bucket: string;
    attempt: number;
    idempotent: boolean;
    timeoutMs: number | undefined;
    maxResponseBytes: number | undefined;
    guard: UrlGuardOptions | undefined;
    signal: AbortSignal | undefined;
  }): Promise<Exchange> {
    const url = buildUrl(this.#options.baseUrl, input.url, input.query);
    if (input.guard !== undefined) {
      await assertSafeUrl(url, input.guard);
    }

    const { payload, contentType } = encodeBody(input.body);
    const headers: Record<string, string> = {
      accept: 'application/json',
      ...Object.fromEntries(
        Object.entries(this.#options.defaultHeaders ?? {}).map(([key, value]) => [
          key.toLowerCase(),
          value,
        ]),
      ),
      ...Object.fromEntries(
        Object.entries(input.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value]),
      ),
    };
    if (contentType !== undefined) {
      headers['content-type'] = contentType;
    }

    const controller = new AbortController();
    const timeoutMs = input.timeoutMs ?? this.#options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const onOuterAbort = (): void => controller.abort(input.signal?.reason);
    input.signal?.addEventListener('abort', onOuterAbort, { once: true });

    this.#logger.debug(
      {
        provider: this.provider,
        operation: input.operation,
        method: input.method,
        url: sanitizeText(url),
        attempt: input.attempt,
        idempotent: input.idempotent,
      },
      'connector.http.request',
    );

    const dispatch = async (authorization: string | undefined): Promise<Response> => {
      const finalHeaders = authorization === undefined ? headers : { ...headers, authorization };
      return await this.#fetch(url, {
        method: input.method,
        headers: finalHeaders,
        redirect: 'error',
        signal: controller.signal,
        // A fresh view over its own buffer, so the body type is exactly what
        // both the DOM and the undici definitions of `BodyInit` accept.
        ...(payload === undefined
          ? {}
          : { body: typeof payload === 'string' ? payload : new Uint8Array(payload) }),
      });
    };

    try {
      let response: Response;
      try {
        const auth = input.auth;
        response =
          auth === undefined
            ? await dispatch(undefined)
            : await auth.handle.use(
                async (token) => await dispatch(`${auth.scheme ?? 'Bearer'} ${token}`),
              );
      } catch (cause) {
        if (controller.signal.aborted) {
          throw new ProviderCallError(
            this.#classify(input.operation, {
              transportCode: 'UND_ERR_HEADERS_TIMEOUT',
              body: cause,
            }),
            { cause },
          );
        }
        throw new ProviderCallError(this.#classify(input.operation, { body: cause }), { cause });
      }

      const rawHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        rawHeaders[key.toLowerCase()] = value;
      });
      const rateLimit = this.rateLimits.observe({
        provider: this.provider,
        bucket: input.bucket,
        headers: rawHeaders,
        clock: this.#clock,
      });
      const safeHeaders = sanitizeHeaders(rawHeaders);
      const bytes = await readCapped(
        response,
        input.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES,
      );
      const text = new TextDecoder().decode(bytes);
      const parsed = parseMaybeJson(text, response.headers.get('content-type'));

      return {
        status: response.status,
        rawHeaders,
        safeHeaders,
        bytes,
        text,
        parsed,
        rateLimit,
        requestId:
          safeHeaders['x-request-id'] ??
          safeHeaders['request-id'] ??
          safeHeaders['x-requestid'] ??
          null,
      };
    } finally {
      clearTimeout(timer);
      input.signal?.removeEventListener('abort', onOuterAbort);
    }
  }

  async #attempt<T>(
    request: ProviderHttpRequest<T>,
    bucket: string,
    attempt: number,
  ): Promise<Omit<ProviderHttpResponse<T>, 'attempts' | 'durationMs'>> {
    const exchange = await this.#exchange({
      method: request.method,
      url: request.url,
      query: request.query,
      headers: request.headers,
      body: request.body,
      auth: request.auth,
      operation: request.operation,
      bucket,
      attempt,
      idempotent: request.idempotent,
      timeoutMs: request.timeoutMs,
      maxResponseBytes: request.maxResponseBytes,
      guard: request.guard,
      signal: request.signal,
    });

    const accepted =
      (exchange.status >= 200 && exchange.status < 300) ||
      (request.acceptStatuses ?? []).includes(exchange.status);
    if (!accepted) {
      throw new ProviderCallError(
        this.#classify(request.operation, {
          status: exchange.status,
          body: exchange.parsed,
          headers: exchange.rawHeaders,
        }),
      );
    }

    const result = request.schema.safeParse(exchange.parsed);
    if (!result.success) {
      // A response we cannot parse is UNKNOWN with sanitized evidence, never a
      // crash and never a silent success.
      throw new ProviderCallError(
        this.#classify(request.operation, {
          body: {
            message: 'provider response did not match the expected schema',
            issues: result.error.issues.slice(0, 10).map((issue) => ({
              path: issue.path.map((segment) => String(segment)).join('.'),
              code: issue.code,
            })),
          },
          headers: exchange.rawHeaders,
        }),
      );
    }

    return {
      status: exchange.status,
      data: result.data,
      headers: exchange.safeHeaders,
      rateLimit: exchange.rateLimit,
      requestId: exchange.requestId,
    };
  }

  /**
   * Send one request and resolve for every status code.
   *
   * An adapter has to read a non-2xx body to tell a duplicate content rejection
   * from a rate limit, so this deliberately does not throw on a status. It
   * throws only for a transport failure, already classified.
   */
  async send(input: HttpRequest): Promise<HttpResponse> {
    const operation = asProviderOperation(input.operation);
    const bucket = input.bucket ?? operation;
    await this.#respectKnownRateLimit(bucket, operation);
    const exchange = await this.#exchange({
      method: input.method,
      url: input.url,
      query: input.query,
      headers: input.headers,
      body: bodyFromHttpRequest(input),
      auth: input.auth,
      operation,
      bucket,
      attempt: 1,
      idempotent: input.idempotent ?? false,
      timeoutMs: input.timeoutMs,
      maxResponseBytes: input.maxResponseBytes,
      guard: input.guard,
      signal: input.signal,
    });
    const accept = input.accept ?? 'json';
    return {
      status: exchange.status,
      ok: exchange.status >= 200 && exchange.status < 300,
      headers: exchange.safeHeaders,
      body: accept === 'json' ? exchange.parsed : accept === 'text' ? exchange.text : null,
      text: accept === 'binary' || accept === 'none' ? '' : exchange.text,
      bytes: accept === 'binary' ? exchange.bytes : EMPTY_BYTES,
      requestId: exchange.requestId,
    };
  }

  /** The narrow, non throwing view an adapter consumes. */
  asHttpClient(): HttpClient {
    return { request: async (input: HttpRequest): Promise<HttpResponse> => await this.send(input) };
  }
}

interface Exchange {
  readonly status: number;
  readonly rawHeaders: Record<string, string>;
  readonly safeHeaders: Record<string, string>;
  readonly bytes: Uint8Array;
  readonly text: string;
  readonly parsed: unknown;
  readonly rateLimit: RateLimitSnapshot | null;
  readonly requestId: string | null;
}

const EMPTY_BYTES = new Uint8Array(0);

/**
 * The adapter facing HTTP surface.
 *
 * `request` resolves for every HTTP status and throws only for a transport
 * failure, because an adapter must read a non-2xx body to classify it. Use
 * `ensureOk()` and `parseProviderBody()` from `./errors.js` on the way back.
 */
export interface HttpRequest {
  readonly method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly url: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
  readonly json?: unknown;
  readonly form?: Readonly<Record<string, string>>;
  readonly body?: Uint8Array | string;
  readonly contentType?: string;
  readonly accept?: 'json' | 'text' | 'binary' | 'none';
  readonly timeoutMs?: number;
  readonly maxResponseBytes?: number;
  readonly provider?: string;
  readonly operation: string;
  readonly bucket?: string;
  /** True only when repeating the call cannot create a second external object. */
  readonly idempotent?: boolean;
  readonly auth?: { readonly handle: SecretHandle; readonly scheme?: string };
  readonly guard?: UrlGuardOptions;
  readonly signal?: AbortSignal;
}

export interface HttpResponse {
  readonly status: number;
  readonly ok: boolean;
  readonly headers: Readonly<Record<string, string>>;
  /** Parsed JSON when `accept` is `json`, the raw text when it is `text`. */
  readonly body: unknown;
  readonly text: string;
  readonly bytes: Uint8Array;
  readonly requestId: string | null;
}

export interface HttpClient {
  request(input: HttpRequest): Promise<HttpResponse>;
}

function bodyFromHttpRequest(input: HttpRequest): ProviderRequestBody | undefined {
  if (input.json !== undefined) {
    return { kind: 'json', value: input.json };
  }
  if (input.form !== undefined) {
    return { kind: 'form', value: input.form };
  }
  if (typeof input.body === 'string') {
    return { kind: 'text', value: input.body, contentType: input.contentType ?? 'text/plain' };
  }
  if (input.body !== undefined) {
    return {
      kind: 'binary',
      value: input.body,
      contentType: input.contentType ?? 'application/octet-stream',
    };
  }
  return undefined;
}

/** Build the non throwing client an adapter is constructed with. */
export function createHttpClient(options: ProviderHttpClientOptions): HttpClient {
  return new ProviderHttpClient(options).asHttpClient();
}
