import type { ApprovalLevel, Scope } from '@relay/contracts';

/**
 * A service account, as every surface sees it.
 *
 * There is deliberately no credential field on this type. A list endpoint that
 * could return a secret is a list endpoint that eventually does, so the secret
 * is not reachable from the shape at all: it exists only on
 * `IssuedServiceAccountCredentialView`, which only `create` and
 * `rotateCredential` return.
 *
 * `credentialExpiresAt` and `lastUsedAt` come from the live credential row, so
 * they answer "is this thing still able to act, and has it" without revealing
 * anything that would let anyone act as it.
 */
export interface ServiceAccountView {
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
  /** External publications per rolling day. `null` means no cadence ceiling. */
  readonly maxPostsPerDay: number | null;
  readonly lookAheadDays: number | null;
  readonly approvalLevel: ApprovalLevel;
  /** The workspace time zone the cadence and look-ahead are measured in. */
  readonly timeZone: string;
  readonly createdByUserId: string;
  readonly createdByName: string | null;
  readonly createdAt: string;
  /** From the live credential. Null when the account has never been used. */
  readonly lastUsedAt: string | null;
  /** From the live credential. Null when no live credential exists. */
  readonly credentialExpiresAt: string | null;
  /** Public, non-secret fragment of the live credential. Safe to display. */
  readonly credentialPrefix: string | null;
}

/**
 * The only shape that ever carries a service-account secret.
 *
 * Returned by `create` and `rotateCredential`, once, and never persisted in
 * this form. There is no endpoint that can produce it again: recovering a lost
 * credential means rotating, which invalidates the lost one.
 */
export interface IssuedServiceAccountCredentialView {
  readonly account: ServiceAccountView;
  /** Full credential text. Show once, never log, never store. */
  /** Durable id of the credential row this call created. Not a secret. */
  readonly credentialId: string;
  readonly plaintext: string;
  readonly expiresAt: string;
  /**
   * Public prefixes of the credentials this call invalidated.
   *
   * The edge keeps its own verification index, and a rotation that revokes the
   * durable row but leaves that index in place leaves the old credential
   * working. The caller needs the prefixes to drop it, so they travel with the
   * new secret rather than being discoverable only by scanning.
   */
  readonly revokedPrefixes: readonly string[];
}

/**
 * The answer to "what would this account be allowed to do".
 *
 * A rehearsal, not an execution. It runs the same scope and approval-level
 * checks the real call runs and performs no work, so `outcome: 'ok'` means
 * "this would have been permitted", never "this happened".
 */
export interface ServiceAccountDryRunView {
  readonly outcome: 'ok' | 'denied';
  readonly body: Readonly<Record<string, unknown>>;
  /** An i18n message key. Null when the call would have been permitted. */
  readonly reason: string | null;
}
