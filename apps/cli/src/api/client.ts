import { randomUUID } from 'node:crypto';

import { z } from 'zod';
import { API_HEADERS, API_VERSION, RelayError, problemJsonSchema } from '@relay/contracts';
import type { ErrorCode } from '@relay/contracts';

/**
 * The API client.
 *
 * One place that speaks HTTP, one place that turns a response into either a
 * parsed value or a `RelayError`. Every command below it deals in domain types
 * and never in status codes.
 */

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export type FetchLike = (
  input: string,
  init: {
    method: string;
    headers: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
  },
) => Promise<{
  status: number;
  headers: { get(name: string): string | null };
  text(): Promise<string>;
}>;

export interface ApiClientOptions {
  readonly baseUrl: string;
  /** Read from the credential file or the environment. Never from argv. */
  readonly accessToken: string | null;
  readonly workspaceId?: string | null;
  readonly locale?: string;
  readonly fetch?: FetchLike;
  readonly timeoutMs?: number;
  readonly userAgent?: string;
}

export interface RequestOptions<T extends z.ZodType> {
  readonly method: HttpMethod;
  readonly path: string;
  readonly schema: T;
  readonly query?: Readonly<Record<string, string | number | boolean | undefined>>;
  readonly body?: unknown;
  readonly idempotencyKey?: string;
  readonly correlationId?: string;
}

export interface ApiResult<T> {
  readonly data: T;
  readonly correlationId: string;
  readonly rateLimitRemaining: number | null;
}

export const DEFAULT_TIMEOUT_MS = 30_000;

const STATUS_TO_CODE: Readonly<Record<number, ErrorCode>> = {
  400: 'VALIDATION_FAILED',
  401: 'AUTH_REQUIRED',
  402: 'PAYMENT_REQUIRED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  413: 'MEDIA_TOO_LARGE',
  422: 'VALIDATION_FAILED',
  429: 'RATE_LIMITED',
  500: 'INTERNAL',
  501: 'CAPABILITY_NOT_IMPLEMENTED',
  502: 'PROVIDER_TRANSIENT',
  503: 'PROVIDER_UNAVAILABLE',
};

/** The name of a thrown value, without asserting a shape onto it. */
function errorName(error: unknown): string {
  return error instanceof Error ? error.name : 'REQUEST_FAILED';
}

function buildUrl(
  baseUrl: string,
  path: string,
  query: RequestOptions<z.ZodType>['query'],
): string {
  const url = new URL(path.replace(/^\//, ''), baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Turn a non-2xx response into a `RelayError`.
 *
 * The API speaks `application/problem+json`, so in the normal case the error is
 * reconstructed exactly as the server classified it. A response that is not a
 * problem document is mapped from its status rather than guessed at, and its
 * body is discarded: an unparsed body from an unexpected proxy is not something
 * to print to a user.
 */
export function toRelayError(status: number, rawBody: string, correlationId: string): RelayError {
  const parsedBody = ((): unknown => {
    try {
      return JSON.parse(rawBody) as unknown;
    } catch {
      return undefined;
    }
  })();

  const problem = problemJsonSchema.safeParse(parsedBody);
  if (problem.success) {
    return new RelayError(problem.data.code, {
      messageKey: problem.data.messageKey,
      status: problem.data.status,
      retryable: problem.data.retryable,
      details: problem.data.detail ?? {},
      correlationId: problem.data.correlationId ?? correlationId,
    });
  }

  const code = STATUS_TO_CODE[status] ?? 'UNKNOWN';
  return new RelayError(code, { status, correlationId, details: { httpStatus: status } });
}

export interface ApiClient {
  request<T extends z.ZodType>(options: RequestOptions<T>): Promise<ApiResult<z.infer<T>>>;
  readonly baseUrl: string;
  readonly authenticated: boolean;
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  const defaultFetch: FetchLike = async (input, init) => {
    const response = await globalThis.fetch(input, {
      method: init.method,
      headers: init.headers,
      ...(init.body === undefined ? {} : { body: init.body }),
      ...(init.signal === undefined ? {} : { signal: init.signal }),
    });
    return {
      status: response.status,
      headers: { get: (name: string) => response.headers.get(name) },
      text: () => response.text(),
    };
  };
  const doFetch: FetchLike = options.fetch ?? defaultFetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  return {
    baseUrl: options.baseUrl,
    authenticated: options.accessToken !== null,

    async request<T extends z.ZodType>(request: RequestOptions<T>): Promise<ApiResult<z.infer<T>>> {
      if (options.accessToken === null) {
        throw new RelayError('AUTH_REQUIRED', { messageKey: 'error.unauthenticated.message' });
      }

      const correlationId = request.correlationId ?? randomUUID();
      const headers: Record<string, string> = {
        accept: 'application/json, application/problem+json',
        authorization: `Bearer ${options.accessToken}`,
        [API_HEADERS.correlationId]: correlationId,
        [API_HEADERS.apiVersion]: API_VERSION,
        'user-agent': options.userAgent ?? 'relay-cli',
      };
      if (options.workspaceId !== null && options.workspaceId !== undefined) {
        headers['x-relay-workspace-id'] = options.workspaceId;
      }
      if (options.locale !== undefined) {
        headers['accept-language'] = options.locale;
      }
      if (request.idempotencyKey !== undefined) {
        headers[API_HEADERS.idempotencyKey] = request.idempotencyKey;
      }
      if (request.body !== undefined) {
        headers['content-type'] = 'application/json';
      }

      const controller = new AbortController();
      const timer = setTimeout(() => {
        controller.abort();
      }, timeoutMs);

      let status: number;
      let rawBody: string;
      let rateLimitRemaining: string | null;
      try {
        const response = await doFetch(buildUrl(options.baseUrl, request.path, request.query), {
          method: request.method,
          headers,
          ...(request.body === undefined ? {} : { body: JSON.stringify(request.body) }),
          signal: controller.signal,
        });
        status = response.status;
        rawBody = await response.text();
        rateLimitRemaining = response.headers.get(API_HEADERS.rateLimitRemaining);
      } catch (error) {
        throw new RelayError('PROVIDER_UNAVAILABLE', {
          messageKey: 'error.network_unreachable.message',
          correlationId,
          details: { reason: errorName(error) },
          cause: error,
        });
      } finally {
        clearTimeout(timer);
      }

      if (status < 200 || status >= 300) {
        throw toRelayError(status, rawBody, correlationId);
      }

      const parsedBody = ((): unknown => {
        if (rawBody.trim().length === 0) {
          return {};
        }
        try {
          return JSON.parse(rawBody) as unknown;
        } catch (error) {
          throw new RelayError('INTERNAL', {
            messageKey: 'error.internal.message',
            correlationId,
            details: { reason: 'RESPONSE_NOT_JSON' },
            cause: error,
          });
        }
      })();

      const parsed = request.schema.safeParse(parsedBody);
      if (!parsed.success) {
        // A response we cannot understand is a failure, not something to print.
        throw new RelayError('INTERNAL', {
          messageKey: 'error.internal.message',
          correlationId,
          details: {
            reason: 'RESPONSE_SHAPE_UNEXPECTED',
            issues: parsed.error.issues
              .slice(0, 5)
              .map((issue) => issue.path.map(String).join('.')),
          },
        });
      }

      return {
        data: parsed.data,
        correlationId,
        rateLimitRemaining:
          rateLimitRemaining === null ? null : Number.parseInt(rateLimitRemaining, 10),
      };
    },
  };
}
