/**
 * Errors thrown by this package.
 *
 * These are developer-facing. They carry a stable `code` so a caller can branch
 * on it, and they never contain a user-facing sentence: the API layer maps a
 * code to an i18n key from `@relay/i18n`.
 *
 * TODO(database): once `@relay/contracts` ships `RelayError`, extend it here so
 * every package throws one shape. The `code` values below are already the ones
 * the contract will use.
 */

export const DATABASE_ERROR_CODES = {
  /** `withWorkspace` was called without a usable workspace id. */
  workspaceScopeMissing: 'database.workspace_scope_missing',
  /** A tenant-owned model was reached without a workspace scope. */
  tenantModelUnscoped: 'database.tenant_model_unscoped',
  /** A caller tried to read or write across a workspace boundary. */
  workspaceScopeConflict: 'database.workspace_scope_conflict',
  /** A row was returned whose workspace does not match the active scope. */
  crossTenantRow: 'database.cross_tenant_row',
  /** The RLS claim context was malformed. */
  invalidRlsContext: 'database.invalid_rls_context',
  /** A migration file or the ledger is in an unexpected state. */
  migrationFailed: 'database.migration_failed',
} as const;

export type DatabaseErrorCode =
  (typeof DATABASE_ERROR_CODES)[keyof typeof DATABASE_ERROR_CODES];

export class DatabaseError extends Error {
  readonly code: DatabaseErrorCode;
  readonly details: Readonly<Record<string, string>>;

  constructor(
    code: DatabaseErrorCode,
    message: string,
    details: Readonly<Record<string, string>> = {},
  ) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.details = details;
  }
}

export function isDatabaseError(value: unknown): value is DatabaseError {
  return value instanceof DatabaseError;
}
