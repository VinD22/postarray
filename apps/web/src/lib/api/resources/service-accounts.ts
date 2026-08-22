/** Service accounts: the identities agents act as. */

import type { ApprovalLevel, Scope } from '@relay/contracts';

import { call } from '../call';

/**
 * The identity, as the API returns it.
 *
 * There is deliberately no credential field. The list endpoint cannot return a
 * secret, so no screen can accidentally render one; only `create` and `rotate`
 * ever see plaintext, once each.
 */
export interface ServiceAccountApiView {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly purpose: string;
  readonly state: 'active' | 'stopped' | 'expired';
  readonly scopes: readonly Scope[];
  readonly projectIds: readonly string[];
  readonly connectionIds: readonly string[];
  readonly contentLocales: readonly string[];
  readonly allowedDomains: readonly string[];
  readonly maxPostsPerDay: number | null;
  readonly lookAheadDays: number | null;
  readonly approvalLevel: ApprovalLevel;
  readonly timeZone: string;
  readonly createdByUserId: string;
  readonly createdByName: string | null;
  readonly createdAt: string;
  readonly lastUsedAt: string | null;
  readonly credentialExpiresAt: string | null;
  readonly credentialPrefix: string | null;
}

/** The only response shape that ever carries a secret. */
export interface IssuedServiceAccountApiView {
  readonly account: ServiceAccountApiView;
  readonly secret: string;
  readonly expiresAt: string;
}

export interface ServiceAccountDryRunApiView {
  readonly outcome: 'ok' | 'denied';
  readonly body: Readonly<Record<string, unknown>>;
  readonly reason: string | null;
}

export interface CreateServiceAccountBody {
  readonly name: string;
  readonly purpose: string;
  readonly scopes: readonly Scope[];
  readonly projectIds: readonly string[];
  readonly connectionIds: readonly string[];
  readonly contentLocales: readonly string[];
  readonly allowedDomains: readonly string[];
  readonly maxPostsPerDay: number | null;
  readonly lookAheadDays: number | null;
  readonly quietHoursStart: string;
  readonly quietHoursEnd: string;
  readonly approvalLevel: ApprovalLevel;
  readonly expiresInDays: number | null;
}

export const serviceAccountsApi = {
  list: (): Promise<{ data: readonly ServiceAccountApiView[] }> =>
    call('/service-accounts', {}, () => ({ data: [] })),

  /** The secret is returned once and never again. */
  create: (
    input: CreateServiceAccountBody,
    idempotencyKey: string,
  ): Promise<IssuedServiceAccountApiView | null> =>
    call('/service-accounts', { method: 'POST', body: input, idempotencyKey }, () => null),

  /** Mints a new secret and invalidates the previous one. */
  rotate: (serviceAccountId: string): Promise<IssuedServiceAccountApiView | null> =>
    call(`/service-accounts/${serviceAccountId}/credential`, { method: 'POST' }, () => null),

  setEnabled: (serviceAccountId: string, enabled: boolean): Promise<ServiceAccountApiView | null> =>
    call(
      `/service-accounts/${serviceAccountId}`,
      { method: 'PATCH', body: { enabled } },
      () => null,
    ),

  /** A rehearsal. The server runs the same gates and performs no work. */
  dryRun: (
    serviceAccountId: string,
    input: { tool: string; args: unknown },
  ): Promise<ServiceAccountDryRunApiView> =>
    call(`/service-accounts/${serviceAccountId}/dry-run`, { method: 'POST', body: input }, () => ({
      outcome: 'denied' as const,
      body: {},
      reason: 'agent_policy.unknown_tool',
    })),
};
