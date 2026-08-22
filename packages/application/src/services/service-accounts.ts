import { narrowScopes } from '@relay/authz';
import { normalizeScopes, type ApprovalLevel, type Scope } from '@relay/contracts';

import type { ActorContext, ServiceAccountService, ServiceDeps } from '../types';

import { recordAudit } from '../internal/audit';
import { HASH_ALGORITHM, mintApiKeySecret } from '../internal/api-key-secret';
import { invalid, notFound } from '../internal/errors';
import { authorized, type Db } from '../internal/runtime';
import { rehearseToolCall } from './service-account-dry-run';
import type {
  IssuedServiceAccountCredentialView,
  ServiceAccountDryRunView,
  ServiceAccountView,
} from './service-account-views';

/**
 * Service accounts: the identity an agent acts as.
 *
 * Three properties hold and are proved by the tests next to this file.
 *
 *  1. **The credential is write-only.** It is minted here, hashed immediately,
 *     and returned exactly once from `create` and `rotateCredential`. `list`
 *     and `get` cannot return it, because `ServiceAccountView` has no field it
 *     could travel in. Losing it means rotating, which invalidates the lost one.
 *  2. **An account can never exceed what it was granted.** `narrowScopes`
 *     computes `min(requested, creator role, creator credential)` at creation,
 *     and `loadActor` re-intersects the stored scopes with the *live* role of
 *     the creating user on every request. Demoting that person narrows every
 *     live agent immediately.
 *  3. **It never acts outside its workspace.** Every read and write here goes
 *     through `authorized`, which opens one workspace-scoped transaction with
 *     the RLS claims set; the `where` clauses repeat `workspaceId` so a wrong
 *     id is a `not_found` at this layer as well as at the database.
 *
 * Quiet hours are the one thing the settings form asks for that is not stored:
 * `app.service_accounts` has no column for the window and adding one needs a
 * migration. Rather than accept a restriction and then not enforce it, `create`
 * refuses a narrowed window with `not_implemented`. See the report in
 * `docs/planning`. A full day (`00:00` to `00:00`) is accepted because it
 * restricts nothing.
 */

const MAX_LIFETIME_DAYS = 365;
const DAY_MS = 86_400_000;

const APPROVAL_BY_INDEX: readonly ApprovalLevel[] = [
  'level_0_read',
  'level_1_draft',
  'level_2_scheduled',
  'level_3_confirm',
];

function approvalFromInt(value: number): ApprovalLevel {
  return APPROVAL_BY_INDEX[Math.min(3, Math.max(0, Math.trunc(value)))] ?? 'level_0_read';
}

function approvalToInt(level: ApprovalLevel): number {
  const index = APPROVAL_BY_INDEX.indexOf(level);
  return index < 0 ? 0 : index;
}

const ACCOUNT_SELECT = {
  id: true,
  workspaceId: true,
  name: true,
  description: true,
  scopes: true,
  projectScope: true,
  connectionScope: true,
  localeScope: true,
  approvedDomains: true,
  maxDailyPublishes: true,
  maxLookAheadDays: true,
  maxApprovalLevel: true,
  disabledAt: true,
  createdByUserId: true,
  createdAt: true,
} as const;

interface AccountRow {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  scopes: string[];
  projectScope: string[];
  connectionScope: string[];
  localeScope: string[];
  approvedDomains: string[];
  maxDailyPublishes: number | null;
  maxLookAheadDays: number | null;
  maxApprovalLevel: number;
  disabledAt: Date | null;
  createdByUserId: string;
  createdAt: Date;
}

/** What the live credential contributes to the view. Never the secret. */
interface CredentialFacts {
  readonly prefix: string | null;
  readonly expiresAt: Date | null;
  readonly lastUsedAt: Date | null;
}

const NO_CREDENTIAL: CredentialFacts = { prefix: null, expiresAt: null, lastUsedAt: null };

function toView(
  row: AccountRow,
  credential: CredentialFacts,
  createdByName: string | null,
  timeZone: string,
  now: Date,
): ServiceAccountView {
  const expired = credential.expiresAt !== null && credential.expiresAt.getTime() <= now.getTime();
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    name: row.name,
    purpose: row.description ?? '',
    state: row.disabledAt !== null ? 'stopped' : expired ? 'expired' : 'active',
    scopes: normalizeScopes(row.scopes),
    projectIds: [...row.projectScope],
    connectionIds: [...row.connectionScope],
    contentLocales: [...row.localeScope],
    allowedDomains: [...row.approvedDomains],
    maxPostsPerDay: row.maxDailyPublishes,
    lookAheadDays: row.maxLookAheadDays,
    approvalLevel: approvalFromInt(row.maxApprovalLevel),
    timeZone,
    createdByUserId: row.createdByUserId,
    createdByName,
    createdAt: row.createdAt.toISOString(),
    lastUsedAt: credential.lastUsedAt?.toISOString() ?? null,
    credentialExpiresAt: credential.expiresAt?.toISOString() ?? null,
    credentialPrefix: credential.prefix,
  };
}

/** The live credential per account: newest unrevoked key, or nothing. */
async function credentialFactsFor(
  db: Db,
  workspaceId: string,
  accountIds: readonly string[],
): Promise<ReadonlyMap<string, CredentialFacts>> {
  const found = new Map<string, CredentialFacts>();
  if (accountIds.length === 0) {
    return found;
  }
  const rows = await db.apiKey.findMany({
    where: { workspaceId, serviceAccountId: { in: [...accountIds] }, revokedAt: null },
    orderBy: { id: 'desc' },
    // Deliberately never selects `secretHash`. A digest is not a secret, but it
    // is also not something any caller of this service has a use for.
    select: { serviceAccountId: true, prefix: true, expiresAt: true, lastUsedAt: true },
  });
  for (const row of rows) {
    if (row.serviceAccountId !== null && !found.has(row.serviceAccountId)) {
      found.set(row.serviceAccountId, {
        prefix: row.prefix,
        expiresAt: row.expiresAt,
        lastUsedAt: row.lastUsedAt,
      });
    }
  }
  return found;
}

async function namesFor(db: Db, userIds: readonly string[]): Promise<ReadonlyMap<string, string>> {
  const names = new Map<string, string>();
  if (userIds.length === 0) {
    return names;
  }
  const rows = await db.user.findMany({
    where: { id: { in: [...new Set(userIds)] } },
    select: { id: true, displayName: true },
  });
  for (const row of rows) {
    names.set(row.id, row.displayName);
  }
  return names;
}

/** A full day restricts nothing, so it is the only window we can honour. */
function isFullDay(start: string, end: string): boolean {
  return start === end;
}

export interface CreateServiceAccountInput {
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
  /** Null means "the maximum we allow", never "forever". */
  readonly expiresInDays: number | null;
}

export function createServiceAccountService(deps: ServiceDeps): ServiceAccountService {
  async function issueCredential(
    db: Db,
    input: {
      readonly workspaceId: string;
      readonly accountId: string;
      readonly name: string;
      readonly scopes: readonly Scope[];
      readonly createdByUserId: string;
      readonly expiresAt: Date;
    },
  ): Promise<{ readonly id: string; readonly plaintext: string; readonly prefix: string }> {
    const minted = mintApiKeySecret();
    const row = await db.apiKey.create({
      data: {
        workspaceId: input.workspaceId,
        serviceAccountId: input.accountId,
        name: input.name,
        prefix: minted.prefix,
        // Only the digest is written. The plaintext exists solely in the value
        // returned from this call and in the caller's memory.
        secretHash: minted.storedHash,
        hashAlgorithm: HASH_ALGORITHM,
        scopes: [...input.scopes],
        expiresAt: input.expiresAt,
        createdByUserId: input.createdByUserId,
      },
      select: { id: true },
    });
    return { id: row.id, plaintext: minted.plaintext, prefix: minted.prefix };
  }

  function lifetimeMs(expiresInDays: number | null): number {
    const days = expiresInDays === null ? MAX_LIFETIME_DAYS : expiresInDays;
    if (!Number.isFinite(days) || days < 1) {
      throw invalid('errors.service_account_expiry_required', {});
    }
    if (days > MAX_LIFETIME_DAYS) {
      throw invalid('errors.service_account_expiry_too_far', { maxDays: MAX_LIFETIME_DAYS });
    }
    return days * DAY_MS;
  }

  return {
    async list(ctx: ActorContext): Promise<readonly ServiceAccountView[]> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        const rows = await db.serviceAccount.findMany({
          where: { workspaceId: actor.workspace.id },
          orderBy: { id: 'desc' },
          take: 200,
          select: ACCOUNT_SELECT,
        });
        const credentials = await credentialFactsFor(
          db,
          actor.workspace.id,
          rows.map((row) => row.id),
        );
        const names = await namesFor(
          db,
          rows.map((row) => row.createdByUserId),
        );
        const now = deps.clock.now();
        return rows.map((row) =>
          toView(
            row,
            credentials.get(row.id) ?? NO_CREDENTIAL,
            names.get(row.createdByUserId) ?? null,
            actor.workspace.defaultTimeZone,
            now,
          ),
        );
      });
    },

    async create(
      ctx: ActorContext,
      input: CreateServiceAccountInput,
    ): Promise<IssuedServiceAccountCredentialView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        const role = actor.policyActor.role;
        if (role === null || actor.userId === null) {
          throw invalid('errors.service_account_requires_member', {});
        }
        if (!isFullDay(input.quietHoursStart, input.quietHoursEnd)) {
          // Accepting a window we cannot store would be a restriction the
          // refusal path never applies. `not_implemented` is the honest state.
          throw invalid('errors.service_account_quiet_hours_not_implemented', {});
        }

        // A credential cannot mint a wider credential than it holds itself.
        const narrowed = narrowScopes({
          requested: input.scopes,
          grantorRole: role,
          ...(actor.policyActor.actorType === 'user'
            ? {}
            : { holderScopes: actor.policyActor.scopes }),
        });
        if (narrowed.granted.length === 0) {
          throw invalid('errors.service_account_scopes_refused', {
            refused: [...narrowed.refused],
          });
        }

        const now = deps.clock.now();
        const expiresAt = new Date(now.getTime() + lifetimeMs(input.expiresInDays));

        const created = await db.serviceAccount.create({
          data: {
            workspaceId: actor.workspace.id,
            name: input.name,
            description: input.purpose.length === 0 ? null : input.purpose,
            scopes: [...narrowed.granted],
            projectScope: [...input.projectIds],
            connectionScope: [...input.connectionIds],
            localeScope: [...input.contentLocales],
            approvedDomains: [...input.allowedDomains],
            maxDailyPublishes: input.maxPostsPerDay,
            maxLookAheadDays: input.lookAheadDays,
            maxApprovalLevel: approvalToInt(input.approvalLevel),
            createdByUserId: actor.userId,
          },
          select: ACCOUNT_SELECT,
        });

        const credential = await issueCredential(db, {
          workspaceId: actor.workspace.id,
          accountId: created.id,
          name: input.name,
          scopes: narrowed.granted,
          createdByUserId: actor.userId,
          expiresAt,
        });

        await recordAudit(db, actor, {
          action: 'service_account.created',
          targetType: 'service_account',
          targetId: created.id,
          after: {
            name: input.name,
            scopes: [...narrowed.granted],
            approvalLevel: input.approvalLevel,
            credentialPrefix: credential.prefix,
            credentialExpiresAt: expiresAt.toISOString(),
          },
          metadata: { refusedScopes: [...narrowed.refused] },
        });

        const names = await namesFor(db, [created.createdByUserId]);
        return {
          account: toView(
            created,
            { prefix: credential.prefix, expiresAt, lastUsedAt: null },
            names.get(created.createdByUserId) ?? null,
            actor.workspace.defaultTimeZone,
            now,
          ),
          credentialId: credential.id,
          // The only moment the plaintext exists outside the caller's memory.
          plaintext: credential.plaintext,
          expiresAt: expiresAt.toISOString(),
          revokedPrefixes: [],
        };
      });
    },

    async rotateCredential(
      ctx: ActorContext,
      serviceAccountId: string,
    ): Promise<IssuedServiceAccountCredentialView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        if (actor.userId === null) {
          throw invalid('errors.service_account_requires_member', {});
        }
        const account = await db.serviceAccount.findFirst({
          where: { id: serviceAccountId, workspaceId: actor.workspace.id },
          select: ACCOUNT_SELECT,
        });
        if (account === null) {
          throw notFound('service_account', serviceAccountId);
        }

        const now = deps.clock.now();
        const superseded = await db.apiKey.findMany({
          where: {
            workspaceId: actor.workspace.id,
            serviceAccountId: account.id,
            revokedAt: null,
          },
          select: { serviceAccountId: true, prefix: true, expiresAt: true, lastUsedAt: true },
        });
        // The old credential dies first. The reverse order leaves two live
        // credentials for a moment, which is the one state a rotation may
        // never produce.
        await db.apiKey.updateMany({
          where: {
            workspaceId: actor.workspace.id,
            serviceAccountId: account.id,
            revokedAt: null,
          },
          data: { revokedAt: now },
        });

        const expiresAt = new Date(now.getTime() + MAX_LIFETIME_DAYS * DAY_MS);
        const credential = await issueCredential(db, {
          workspaceId: actor.workspace.id,
          accountId: account.id,
          name: account.name,
          scopes: normalizeScopes(account.scopes),
          createdByUserId: actor.userId,
          expiresAt,
        });

        await recordAudit(db, actor, {
          action: 'service_account.credential_rotated',
          targetType: 'service_account',
          targetId: account.id,
          after: {
            credentialPrefix: credential.prefix,
            credentialExpiresAt: expiresAt.toISOString(),
          },
        });

        const names = await namesFor(db, [account.createdByUserId]);
        return {
          account: toView(
            account,
            { prefix: credential.prefix, expiresAt, lastUsedAt: null },
            names.get(account.createdByUserId) ?? null,
            actor.workspace.defaultTimeZone,
            now,
          ),
          credentialId: credential.id,
          plaintext: credential.plaintext,
          expiresAt: expiresAt.toISOString(),
          revokedPrefixes: superseded.map((row) => row.prefix),
        };
      });
    },

    async setEnabled(
      ctx: ActorContext,
      serviceAccountId: string,
      enabled: boolean,
    ): Promise<ServiceAccountView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        const before = await db.serviceAccount.findFirst({
          where: { id: serviceAccountId, workspaceId: actor.workspace.id },
          select: ACCOUNT_SELECT,
        });
        if (before === null) {
          throw notFound('service_account', serviceAccountId);
        }
        const now = deps.clock.now();
        const after = await db.serviceAccount.update({
          where: { id: before.id },
          data: { disabledAt: enabled ? null : now },
          select: ACCOUNT_SELECT,
        });

        await recordAudit(db, actor, {
          action: enabled ? 'service_account.resumed' : 'service_account.stopped',
          targetType: 'service_account',
          targetId: before.id,
          before: { disabled: before.disabledAt !== null },
          after: { disabled: after.disabledAt !== null },
        });

        const credentials = await credentialFactsFor(db, actor.workspace.id, [after.id]);
        const names = await namesFor(db, [after.createdByUserId]);
        return toView(
          after,
          credentials.get(after.id) ?? NO_CREDENTIAL,
          names.get(after.createdByUserId) ?? null,
          actor.workspace.defaultTimeZone,
          now,
        );
      });
    },

    async dryRun(
      ctx: ActorContext,
      input: {
        readonly serviceAccountId: string;
        readonly tool: string;
        readonly args: Readonly<Record<string, unknown>>;
      },
    ): Promise<ServiceAccountDryRunView> {
      return authorized(deps, ctx, 'developer.manage', undefined, async (db, actor) => {
        const account = await db.serviceAccount.findFirst({
          where: { id: input.serviceAccountId, workspaceId: actor.workspace.id },
          select: ACCOUNT_SELECT,
        });
        if (account === null) {
          throw notFound('service_account', input.serviceAccountId);
        }
        // Nothing below writes, calls a provider or creates a record. A dry run
        // that could act would be an unaudited execution path.
        return rehearseToolCall(
          {
            disabled: account.disabledAt !== null,
            scopes: normalizeScopes(account.scopes),
            approvalLevel: approvalFromInt(account.maxApprovalLevel),
            projectIds: account.projectScope,
            connectionIds: account.connectionScope,
          },
          input.tool,
          input.args,
        );
      });
    },
  };
}
