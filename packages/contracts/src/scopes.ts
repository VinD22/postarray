import { z } from 'zod';

/**
 * The scope registry shared by API keys, service accounts, third-party OAuth
 * apps and the remote MCP server.
 *
 * There is no implicit escalation. `accounts:write` does not imply
 * `posts:publish`, and no scope implies `billing:read` or `connections:admin`.
 * A consent screen can therefore describe exactly what it is granting.
 */

export const SCOPE_RISKS = ['read', 'reversible', 'consequential'] as const;
export const scopeRiskSchema = z.enum(SCOPE_RISKS);
export type ScopeRisk = z.infer<typeof scopeRiskSchema>;

export interface ScopeDefinition {
  readonly risk: ScopeRisk;
  readonly descriptionKey: string;
}

export const SCOPES = {
  'accounts:read': { risk: 'read', descriptionKey: 'scopes.accounts_read' },
  'accounts:write': { risk: 'reversible', descriptionKey: 'scopes.accounts_write' },
  'drafts:read': { risk: 'read', descriptionKey: 'scopes.drafts_read' },
  'drafts:write': { risk: 'reversible', descriptionKey: 'scopes.drafts_write' },
  'posts:schedule': { risk: 'consequential', descriptionKey: 'scopes.posts_schedule' },
  'posts:publish': { risk: 'consequential', descriptionKey: 'scopes.posts_publish' },
  'posts:cancel': { risk: 'consequential', descriptionKey: 'scopes.posts_cancel' },
  'analytics:read': { risk: 'read', descriptionKey: 'scopes.analytics_read' },
  'media:read': { risk: 'read', descriptionKey: 'scopes.media_read' },
  'media:write': { risk: 'reversible', descriptionKey: 'scopes.media_write' },
  'rules:read': { risk: 'read', descriptionKey: 'scopes.rules_read' },
  'rules:write': { risk: 'consequential', descriptionKey: 'scopes.rules_write' },
  'growth:read': { risk: 'read', descriptionKey: 'scopes.growth_read' },
  'growth:write': { risk: 'reversible', descriptionKey: 'scopes.growth_write' },
  'webhooks:manage': { risk: 'reversible', descriptionKey: 'scopes.webhooks_manage' },
  'billing:read': { risk: 'read', descriptionKey: 'scopes.billing_read' },
  'connections:admin': { risk: 'consequential', descriptionKey: 'scopes.connections_admin' },
} as const satisfies Record<string, ScopeDefinition>;

export type Scope = keyof typeof SCOPES;

export const ALL_SCOPES = Object.keys(SCOPES) as readonly Scope[];

export const scopeSchema = z.enum(ALL_SCOPES as [Scope, ...Scope[]]);

export const scopeListSchema = z.array(scopeSchema);

/** Space delimited form used on the wire by OAuth. */
export const scopeStringSchema = z.string().transform((value, ctx) => {
  const parts = value.split(/\s+/).filter((part) => part.length > 0);
  const parsed: Scope[] = [];
  for (const part of parts) {
    const result = scopeSchema.safeParse(part);
    if (!result.success) {
      ctx.addIssue({ code: 'custom', message: 'UNKNOWN_SCOPE' });
      continue;
    }
    parsed.push(result.data);
  }
  return parsed;
});

export function scopeDefinition(scope: Scope): ScopeDefinition {
  return SCOPES[scope];
}

export function scopeRisk(scope: Scope): ScopeRisk {
  return SCOPES[scope].risk;
}

export function isScope(value: unknown): value is Scope {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(SCOPES, value);
}

/** Scopes whose use produces an external side effect and needs confirmation. */
export const CONSEQUENTIAL_SCOPES: readonly Scope[] = ALL_SCOPES.filter(
  (scope) => SCOPES[scope].risk === 'consequential',
);

export const READ_SCOPES: readonly Scope[] = ALL_SCOPES.filter(
  (scope) => SCOPES[scope].risk === 'read',
);

/**
 * Exact containment. A granted scope satisfies only itself: there is no
 * hierarchy, no wildcard and no read-implied-by-write shortcut.
 */
export function scopeSatisfies(granted: readonly string[], required: Scope): boolean {
  return granted.includes(required);
}

/** Every required scope must be present. An empty requirement is satisfied. */
export function scopesSatisfy(granted: readonly string[], required: readonly Scope[]): boolean {
  return required.every((scope) => scopeSatisfies(granted, scope));
}

/** The subset of `required` that `granted` is missing, in the requested order. */
export function missingScopes(
  granted: readonly string[],
  required: readonly Scope[],
): Scope[] {
  return required.filter((scope) => !scopeSatisfies(granted, scope));
}

/** Drop unknown values and duplicates, preserving registry order. */
export function normalizeScopes(granted: readonly string[]): Scope[] {
  const requested = new Set(granted);
  return ALL_SCOPES.filter((scope) => requested.has(scope));
}

/** True when the grant can cause an external publication. */
export function hasConsequentialScope(granted: readonly string[]): boolean {
  return CONSEQUENTIAL_SCOPES.some((scope) => granted.includes(scope));
}
