import { z } from 'zod';
import { RelayError, approvalLevelSchema, normalizeScopes, scopeSchema } from '@relay/contracts';
import type { ApprovalLevel, Scope } from '@relay/contracts';

/**
 * Token verification.
 *
 * Every call is re-verified. There is no session, no "already authenticated
 * connection" and no trust carried over from a previous request, because an
 * MCP connection is long lived and a grant can be revoked in the middle of it.
 *
 * Audience binding is mandatory. A token whose audience we did not check is a
 * token minted for somebody else's service, and accepting it is the classic
 * confused deputy. It is the single most important line in this file.
 */

export const verifiedGrantSchema = z
  .object({
    active: z.literal(true),
    /** The granting user, not the agent host. */
    subject: z.string().min(1),
    /** The registered developer app the agent is running as. */
    clientId: z.string().min(1),
    grantId: z.string().min(1),
    workspaceId: z.string().min(1),
    scopes: z.array(scopeSchema),
    approvalLevel: approvalLevelSchema,
    audience: z.array(z.string().min(1)).min(1),
    expiresAt: z.string().min(1),
    locale: z.string().min(1).default('en'),
    /** Set by the operator or the workspace owner. Checked on every call. */
    killed: z.boolean().default(false),
  })
  .strict();
export type VerifiedGrant = z.infer<typeof verifiedGrantSchema>;

/** Introspection response, parsed at the boundary like any external input. */
export const introspectionResponseSchema = z
  .object({
    active: z.boolean(),
    sub: z.string().optional(),
    client_id: z.string().optional(),
    grant_id: z.string().optional(),
    workspace_id: z.string().optional(),
    scope: z.string().optional(),
    approval_level: z.string().optional(),
    aud: z.union([z.string(), z.array(z.string())]).optional(),
    exp: z.number().int().optional(),
    locale: z.string().optional(),
    killed: z.boolean().optional(),
  })
  .strip();
export type IntrospectionResponse = z.infer<typeof introspectionResponseSchema>;

export interface TokenVerifier {
  /** Returns a grant or throws. It never returns a partially trusted result. */
  verify(bearerToken: string): Promise<VerifiedGrant>;
}

export interface IntrospectionTransport {
  post(
    url: string,
    form: Readonly<Record<string, string>>,
  ): Promise<{ status: number; body: string }>;
}

export interface IntrospectionVerifierOptions {
  readonly introspectionUrl: string;
  /** The canonical identifier of this resource. A token must name it. */
  readonly resourceUrl: string;
  readonly transport: IntrospectionTransport;
  /** Credentials this resource server uses to call introspection. */
  readonly clientId: string;
  readonly clientSecret: string;
  readonly clock: { now(): number };
  /** How long a positive verification may be reused. Kept very short. */
  readonly cacheTtlSeconds?: number;
}

export const DEFAULT_VERIFICATION_CACHE_TTL_SECONDS = 30;

function authRequired(reason: string): RelayError {
  return new RelayError('AUTH_REQUIRED', {
    messageKey: 'error.unauthenticated.message',
    details: { reason },
  });
}

function toApprovalLevel(value: string | undefined): ApprovalLevel {
  const parsed = approvalLevelSchema.safeParse(value);
  // An unknown or missing level is the least privileged one, never the most.
  return parsed.success ? parsed.data : 'level_0_read';
}

function audienceOf(value: string | readonly string[] | undefined): readonly string[] {
  if (value === undefined) {
    return [];
  }
  return typeof value === 'string' ? [value] : [...value];
}

/**
 * Compare audience values as exact strings after trailing-slash normalization.
 * No prefix matching: `https://mcp.relay.example` must not accept a token for
 * `https://mcp.relay.example.attacker.test`.
 */
function audienceMatches(audience: readonly string[], resourceUrl: string): boolean {
  const normalize = (value: string): string => value.replace(/\/+$/, '').toLowerCase();
  const expected = normalize(resourceUrl);
  return audience.some((entry) => normalize(entry) === expected);
}

export function createIntrospectionVerifier(
  options: IntrospectionVerifierOptions,
): TokenVerifier {
  const ttlMs = (options.cacheTtlSeconds ?? DEFAULT_VERIFICATION_CACHE_TTL_SECONDS) * 1000;
  const cache = new Map<string, { grant: VerifiedGrant; expiresAtMs: number }>();

  return {
    async verify(bearerToken: string): Promise<VerifiedGrant> {
      if (bearerToken.trim().length === 0) {
        throw authRequired('TOKEN_MISSING');
      }

      const cached = cache.get(bearerToken);
      if (cached !== undefined && cached.expiresAtMs > options.clock.now()) {
        return cached.grant;
      }
      cache.delete(bearerToken);

      const response = await options.transport.post(options.introspectionUrl, {
        token: bearerToken,
        token_type_hint: 'access_token',
        client_id: options.clientId,
        client_secret: options.clientSecret,
        resource: options.resourceUrl,
      });

      if (response.status < 200 || response.status >= 300) {
        throw authRequired('INTROSPECTION_FAILED');
      }

      let body: unknown;
      try {
        body = JSON.parse(response.body) as unknown;
      } catch {
        throw authRequired('INTROSPECTION_MALFORMED');
      }

      const parsed = introspectionResponseSchema.safeParse(body);
      if (!parsed.success || !parsed.data.active) {
        throw authRequired('TOKEN_INACTIVE');
      }

      const audience = audienceOf(parsed.data.aud);
      if (audience.length === 0 || !audienceMatches(audience, options.resourceUrl)) {
        // The confused deputy defence. Never relax this.
        throw authRequired('AUDIENCE_MISMATCH');
      }

      const subject = parsed.data.sub;
      const clientId = parsed.data.client_id;
      const workspaceId = parsed.data.workspace_id;
      if (subject === undefined || clientId === undefined || workspaceId === undefined) {
        throw authRequired('TOKEN_INCOMPLETE');
      }

      const expiresAtSeconds = parsed.data.exp;
      if (expiresAtSeconds !== undefined && expiresAtSeconds * 1000 <= options.clock.now()) {
        throw authRequired('TOKEN_EXPIRED');
      }

      const scopes: Scope[] = normalizeScopes(
        (parsed.data.scope ?? '').split(/\s+/).filter((value) => value.length > 0),
      );

      const grant = verifiedGrantSchema.parse({
        active: true,
        subject,
        clientId,
        grantId: parsed.data.grant_id ?? clientId,
        workspaceId,
        scopes,
        approvalLevel: toApprovalLevel(parsed.data.approval_level),
        audience,
        expiresAt: new globalThis.Date(
          expiresAtSeconds === undefined
            ? options.clock.now() + ttlMs
            : expiresAtSeconds * 1000,
        ).toISOString(),
        locale: parsed.data.locale ?? 'en',
        killed: parsed.data.killed ?? false,
      });

      if (grant.killed) {
        throw new RelayError('FORBIDDEN', {
          messageKey: 'error.forbidden.message',
          details: { reason: 'GRANT_DISABLED' },
        });
      }

      cache.set(bearerToken, { grant, expiresAtMs: options.clock.now() + ttlMs });
      return grant;
    },
  };
}

/** Extract the bearer token. Header only: never a query parameter. */
export function bearerFromHeader(headerValue: string | undefined): string | null {
  if (headerValue === undefined) {
    return null;
  }
  const match = headerValue.match(/^Bearer\s+([^\s]+)$/i);
  return match?.[1] ?? null;
}
