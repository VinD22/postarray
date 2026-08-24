import type { Prisma } from '@prisma/client';
import { ID_PREFIXES, isId } from '@relay/contracts';

import { DATABASE_ERROR_CODES, DatabaseError } from '../errors';
import type { RelayPrismaClient } from '../client';

import { withWorkspace, type WorkspaceScopedClient } from './workspace-scope';

/**
 * Row level security for server-side connections.
 *
 * Data API traffic reaches Postgres with Neon Auth claims. A worker, the Nest
 * API and the CLI hold a direct connection and no proxy sets claims for them, so without
 * this helper their queries would run with empty claims. Because every policy in
 * `0020_rls_policies.sql` denies on empty claims, that fails closed rather than
 * open, but it also means nothing works. This is how a server-side caller says
 * who it is.
 *
 * The GUC is set with `is_local = true`, so it lives exactly as long as the
 * transaction. There is no way to leak an identity onto the next checkout of a
 * pooled connection.
 */

export type RlsRole = 'anon' | 'authenticated' | 'service_role';

export interface RlsClaims {
  /** Post Array user id. Read by `app.current_user_id()`. */
  readonly userId?: string;
  /**
   * Narrows the actor to one workspace. It intersects with real membership in
   * `app.current_workspace_ids()`, so setting it can only reduce access.
   */
  readonly workspaceId?: string;
  readonly role?: RlsRole;
  /** Neon Auth subject, when the Post Array user id has not been resolved yet. */
  readonly authSubjectId?: string;
  /** The developer application acting on the user's behalf, for the audit line. */
  readonly clientId?: string;
}

export type RlsTransactionClient = Prisma.TransactionClient;

export interface RlsContextOptions {
  /** Transaction timeout in milliseconds. Prisma default is 5000. */
  readonly timeoutMs?: number;
  /** Time to wait for a connection before giving up. Prisma default is 2000. */
  readonly maxWaitMs?: number;
}

/**
 * Runs `handler` inside one transaction whose RLS claims are `claims`.
 *
 * Every statement the handler issues, including a raw one, is evaluated against
 * those claims. Nothing outside the transaction is affected.
 */
export async function withRlsContext<T>(
  prisma: RelayPrismaClient,
  claims: RlsClaims,
  handler: (tx: RlsTransactionClient) => Promise<T>,
  options: RlsContextOptions = {},
): Promise<T> {
  const payload = buildClaimsPayload(claims);

  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT set_config('request.jwt.claims', ${payload}, true)`;
      return handler(tx);
    },
    {
      ...(options.timeoutMs === undefined ? {} : { timeout: options.timeoutMs }),
      ...(options.maxWaitMs === undefined ? {} : { maxWait: options.maxWaitMs }),
    },
  );
}

/**
 * The common case: a trusted server-side operation acting inside one workspace,
 * with the workspace filter injected as well as the RLS claims.
 *
 * Both layers are present on purpose. The proxy catches the mistake in review
 * and in a unit test; the policy catches it in production.
 */
export async function withWorkspaceContext<T>(
  prisma: RelayPrismaClient,
  input: { readonly workspaceId: string; readonly userId?: string; readonly role?: RlsRole },
  handler: (db: WorkspaceScopedClient) => Promise<T>,
  options: RlsContextOptions = {},
): Promise<T> {
  return withRlsContext(
    prisma,
    {
      workspaceId: input.workspaceId,
      ...(input.userId === undefined ? {} : { userId: input.userId }),
      role: input.role ?? 'service_role',
    },
    async (tx) => handler(withWorkspace(tx as unknown as RelayPrismaClient, input.workspaceId)),
    options,
  );
}

/**
 * Claims for a trusted operator path: migrations, seeding, reconciliation jobs
 * and anything that legitimately spans tenants. Every use is expected to write
 * an audit event.
 */
export function serviceRoleClaims(userId?: string): RlsClaims {
  return userId === undefined ? { role: 'service_role' } : { role: 'service_role', userId };
}

/** Serializes claims into the exact JSON shape the SQL helpers read. */
export function buildClaimsPayload(claims: RlsClaims): string {
  const payload: Record<string, string> = {
    role: claims.role ?? 'authenticated',
  };

  if (claims.userId !== undefined) {
    assertRelayId(claims.userId, ID_PREFIXES.user, 'userId');
    payload['relay_user_id'] = claims.userId;
  }

  if (claims.workspaceId !== undefined) {
    assertRelayId(claims.workspaceId, ID_PREFIXES.workspace, 'workspaceId');
    payload['relay_workspace_id'] = claims.workspaceId;
  }

  if (claims.authSubjectId !== undefined) {
    assertAuthSubject(claims.authSubjectId);
    payload['sub'] = claims.authSubjectId;
  }

  if (claims.clientId !== undefined) {
    assertRelayId(claims.clientId, ID_PREFIXES.oauthClient, 'clientId');
    payload['relay_client_id'] = claims.clientId;
  }

  return JSON.stringify(payload);
}

function assertAuthSubject(value: string): void {
  const hasControlCharacter = [...value].some((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint <= 31 || codePoint === 127;
  });
  if (value.length < 1 || value.length > 128 || /\s/u.test(value) || hasControlCharacter) {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.invalidRlsContext,
      'RLS claim "authSubjectId" must be an opaque identifier.',
      { field: 'authSubjectId' },
    );
  }
}

function assertRelayId(value: string, prefix: string, field: string): void {
  if (!isId(prefix, value)) {
    throw new DatabaseError(
      DATABASE_ERROR_CODES.invalidRlsContext,
      `RLS claim "${field}" must be a valid Post Array identifier.`,
      { field },
    );
  }
}
