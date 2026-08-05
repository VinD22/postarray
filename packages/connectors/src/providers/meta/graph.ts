import { z } from 'zod';

import {
  REMEDIATION,
  ensureOk,
  parseProviderBody,
  providerFailure,
  type ConnectorDeps,
  type HttpResponse,
  type RemediationCode,
} from '../shared/contract-shape.js';

/**
 * The shared Meta Graph client used by the Instagram, Facebook Pages and Threads adapters.
 *
 * Meta's three publishing surfaces share an OAuth app, an error envelope, a paging shape
 * and a container lifecycle, so they share this module. What they do not share is their
 * permissions, their account rules or their capability snapshots, and those stay separate.
 *
 * Meta documentation changes frequently and was intermittently rate limited during
 * research. Every version and field here is re-verified before implementation.
 */

/**
 * The Graph API version. Reviewed 4 August 2026. Meta ships a new version roughly three
 * times a year and deprecates on a published schedule, so this is one constant with its
 * review date rather than a value scattered through the adapters.
 */
export const GRAPH_VERSION = 'v26.0';
export const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;
/**
 * Threads versions independently of the Facebook family and is on `v1.0`. Reviewed
 * 4 August 2026.
 */
export const THREADS_GRAPH_VERSION = 'v1.0';
export const THREADS_GRAPH_BASE = `https://graph.threads.net/${THREADS_GRAPH_VERSION}`;
export const FACEBOOK_OAUTH_BASE = 'https://www.facebook.com/v26.0/dialog/oauth';
export const THREADS_OAUTH_BASE = 'https://threads.net/oauth/authorize';

/** Meta's error envelope. Every Graph failure arrives in this shape. */
export const metaErrorSchema = z
  .object({
    error: z
      .object({
        message: z.string().optional(),
        type: z.string().optional(),
        code: z.number().int().optional(),
        error_subcode: z.number().int().optional(),
        error_user_title: z.string().optional(),
        error_user_msg: z.string().optional(),
        fbtrace_id: z.string().optional(),
        is_transient: z.boolean().optional(),
      })
      .loose()
      .optional(),
  })
  .loose();
export type MetaError = z.infer<typeof metaErrorSchema>;

export const metaPagingSchema = z
  .object({
    cursors: z.object({ before: z.string().optional(), after: z.string().optional() }).loose().optional(),
    next: z.string().optional(),
    previous: z.string().optional(),
  })
  .loose();

/** A container created by the two step publish flow. The id is not a post id. */
export const metaContainerSchema = z.object({ id: z.string().min(1) }).loose();

export const metaPublishSchema = z.object({ id: z.string().min(1) }).loose();

export const META_CONTAINER_STATUSES = [
  'EXPIRED',
  'ERROR',
  'FINISHED',
  'IN_PROGRESS',
  'PUBLISHED',
] as const;

export const metaContainerStatusSchema = z
  .object({
    id: z.string().min(1),
    status_code: z.enum(META_CONTAINER_STATUSES).optional(),
    status: z.string().optional(),
    error_message: z.string().optional(),
  })
  .loose();
export type MetaContainerStatus = z.infer<typeof metaContainerStatusSchema>;

export const metaLongLivedTokenSchema = z
  .object({
    access_token: z.string().min(1),
    token_type: z.string().optional(),
    expires_in: z.number().int().optional(),
  })
  .loose();

export const metaPageSchema = z
  .object({
    id: z.string().min(1),
    name: z.string(),
    // Page access token. It is handed straight to the vault and never logged or returned.
    access_token: z.string().optional(),
    category: z.string().optional(),
    tasks: z.array(z.string()).optional(),
    picture: z
      .object({ data: z.object({ url: z.string().optional() }).loose().optional() })
      .loose()
      .optional(),
    instagram_business_account: z.object({ id: z.string().min(1) }).loose().optional(),
  })
  .loose();
export type MetaPage = z.infer<typeof metaPageSchema>;

export const metaPagesResponseSchema = z
  .object({ data: z.array(metaPageSchema).default([]), paging: metaPagingSchema.optional() })
  .loose();

export const metaDebugTokenSchema = z
  .object({
    data: z
      .object({
        app_id: z.string().optional(),
        is_valid: z.boolean().optional(),
        scopes: z.array(z.string()).default([]),
        expires_at: z.number().int().optional(),
        user_id: z.string().optional(),
      })
      .loose(),
  })
  .loose();

/** The Meta tasks that permit creating content on a Page. */
export const PAGE_PUBLISH_TASKS = new Set(['CREATE_CONTENT', 'MANAGE']);

export function canPublishToPage(page: MetaPage): boolean {
  const tasks = page.tasks ?? [];
  return tasks.some((task) => PAGE_PUBLISH_TASKS.has(task));
}

/**
 * Turn a Meta error into a remediation key. Meta's numeric codes are the only reliable
 * signal; the message text is localized and must never be pattern matched for control flow
 * beyond the documented codes.
 */
export function metaRemediation(response: HttpResponse): RemediationCode | undefined {
  const parsed = metaErrorSchema.safeParse(response.body);
  if (!parsed.success || parsed.data.error === undefined) {
    return undefined;
  }
  const { code, error_subcode: subcode } = parsed.data.error;
  if (code === 190) {
    return REMEDIATION.reconnectAccount;
  }
  if (code === 200 || code === 10 || (code !== undefined && code >= 200 && code <= 299)) {
    return REMEDIATION.grantAdditionalPermission;
  }
  if (code === 4 || code === 17 || code === 32 || code === 613) {
    return REMEDIATION.providerRateLimited;
  }
  if (code === 100 && subcode === 2207050) {
    return REMEDIATION.mediaInvalid;
  }
  if (code === 368) {
    return REMEDIATION.providerRejectedContent;
  }
  return undefined;
}

/** The provider's own stated reason, sanitized for display. Never a raw payload. */
export function metaUserMessage(response: HttpResponse): string | null {
  const parsed = metaErrorSchema.safeParse(response.body);
  if (!parsed.success || parsed.data.error === undefined) {
    return null;
  }
  const message = parsed.data.error.error_user_msg ?? parsed.data.error.error_user_title ?? null;
  return message === null ? null : message.slice(0, 300);
}

export type MetaSurface = 'instagram' | 'facebook' | 'threads';

export interface MetaClient {
  readonly base: string;
  get(input: {
    path: string;
    accessToken: string;
    query?: Readonly<Record<string, string | number | boolean | undefined>>;
    operation: string;
  }): Promise<HttpResponse>;
  post(input: {
    path: string;
    accessToken: string;
    query?: Readonly<Record<string, string | number | boolean | undefined>>;
    json?: unknown;
    operation: string;
  }): Promise<HttpResponse>;
  delete(input: { path: string; accessToken: string; operation: string }): Promise<HttpResponse>;
  /** Throws a classified RelayError with a Meta remediation key when the call failed. */
  require(response: HttpResponse, operation: string): void;
  parse<T>(
    schema: {
      safeParse(value: unknown): { success: true; data: T } | { success: false; error: unknown };
    },
    response: HttpResponse,
    operation: string,
  ): T;
}

/** Build a Graph client bound to one Meta surface and its base URL. */
export function createMetaClient(deps: ConnectorDeps, surface: MetaSurface): MetaClient {
  const base = surface === 'threads' ? THREADS_GRAPH_BASE : GRAPH_BASE;

  function authHeaders(accessToken: string): Record<string, string> {
    // The token travels in the Authorization header rather than in the query string, so it
    // cannot end up in a proxy access log.
    return { authorization: `Bearer ${accessToken}` };
  }

  return {
    base,
    async get(input) {
      return deps.http.request({
        method: 'GET',
        url: `${base}${input.path}`,
        headers: authHeaders(input.accessToken),
        ...(input.query === undefined ? {} : { query: input.query }),
        accept: 'json',
        provider: surface,
        operation: input.operation,
      });
    },
    async post(input) {
      return deps.http.request({
        method: 'POST',
        url: `${base}${input.path}`,
        headers: authHeaders(input.accessToken),
        ...(input.query === undefined ? {} : { query: input.query }),
        ...(input.json === undefined ? {} : { json: input.json }),
        accept: 'json',
        provider: surface,
        operation: input.operation,
      });
    },
    async delete(input) {
      return deps.http.request({
        method: 'DELETE',
        url: `${base}${input.path}`,
        headers: authHeaders(input.accessToken),
        accept: 'json',
        provider: surface,
        operation: input.operation,
      });
    },
    require(response, operation) {
      if (response.ok) {
        return;
      }
      const remediationCode = metaRemediation(response);
      const providerMessage = metaUserMessage(response);
      throw providerFailure({
        provider: surface,
        operation,
        response,
        ...(remediationCode === undefined ? {} : { remediationCode }),
        details: providerMessage === null ? {} : { providerMessage },
      });
    },
    parse(schema, response, operation) {
      ensureOk(response, { provider: surface, operation, response });
      return parseProviderBody(schema, response, { provider: surface, operation, response });
    },
  };
}
