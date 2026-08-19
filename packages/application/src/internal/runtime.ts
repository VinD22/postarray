import {
  can,
  type Permission,
  type PolicyActor,
  type PolicyResource,
  type ServiceAccountRestrictions,
  type WorkspacePolicy,
} from '@relay/authz';
import { normalizeScopes, type Role, type Scope } from '@relay/contracts';
import { withWorkspaceContext, type WorkspaceScopedClient } from '@relay/database';

import type { ActorContext, ServiceDeps } from '../types';

import { decisionToError, notFound, toRelayError } from './errors';
import { toProviderId } from './mappers';
import { systemClock } from '../ports/clock';
import type { Clock } from '../types';

export type Db = WorkspaceScopedClient;

/**
 * Everything the policy needs to answer a question about this call, read once
 * per request inside the same transaction as the work itself. Reading it inside
 * the transaction is what makes "demote the user and their token narrows on the
 * next call" true rather than aspirational.
 */
export interface ActorSnapshot {
  readonly ctx: ActorContext;
  readonly policyActor: PolicyActor;
  /** The human behind the call. Null for a pure system actor. */
  readonly userId: string | null;
  readonly workspace: {
    readonly id: string;
    readonly name: string;
    readonly status: string;
    readonly defaultLocale: string;
    readonly defaultTimeZone: string;
    readonly killSwitchEngaged: boolean;
  };
  readonly restrictions: ServiceAccountRestrictions;
  readonly workspacePolicy: WorkspacePolicy;
}

const ACTIVE_MEMBERSHIP_STATES = new Set(['invited', 'active', 'suspended', 'removed']);

function membershipStateOf(value: string): 'invited' | 'active' | 'suspended' | 'removed' {
  return ACTIVE_MEMBERSHIP_STATES.has(value)
    ? (value as 'invited' | 'active' | 'suspended' | 'removed')
    : 'removed';
}

const APPROVAL_LEVEL_BY_INDEX = [
  'level_0_read',
  'level_1_draft',
  'level_2_scheduled',
  'level_3_confirm',
] as const;

function approvalLevelFromInt(value: number): (typeof APPROVAL_LEVEL_BY_INDEX)[number] {
  const clamped = Math.min(3, Math.max(0, Math.trunc(value)));
  return APPROVAL_LEVEL_BY_INDEX[clamped] ?? 'level_0_read';
}

async function loadWorkspace(db: Db, workspaceId: string): Promise<ActorSnapshot['workspace']> {
  const row = await db.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      status: true,
      defaultLocale: true,
      defaultTimeZone: true,
      killSwitchAt: true,
      deletedAt: true,
    },
  });
  if (row === null || row.deletedAt !== null) {
    throw notFound('workspace', workspaceId);
  }
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    defaultLocale: row.defaultLocale,
    defaultTimeZone: row.defaultTimeZone,
    killSwitchEngaged: row.killSwitchAt !== null,
  };
}

async function loadRoleFor(
  db: Db,
  workspaceId: string,
  userId: string,
): Promise<{
  role: Role | null;
  state: 'invited' | 'active' | 'suspended' | 'removed';
  projectScope: readonly string[];
}> {
  const membership = await db.membership.findFirst({
    where: { workspaceId, userId },
    select: { role: true, state: true, projectScope: true },
  });
  if (membership === null) {
    return { role: null, state: 'removed', projectScope: [] };
  }
  return {
    role: membership.role,
    state: membershipStateOf(membership.state),
    projectScope: membership.projectScope,
  };
}

async function loadRoleOverrides(
  db: Db,
  workspaceId: string,
  role: Role | null,
): Promise<PolicyActor['roleOverrides']> {
  if (role === null) {
    return [];
  }
  const rows = await db.rolePermission.findMany({
    where: { workspaceId, role },
    select: { role: true, permission: true, effect: true },
  });
  const overrides: { role: Role; permission: Permission; effect: 'allow' | 'deny' }[] = [];
  for (const row of rows) {
    overrides.push({
      role: row.role,
      // The column is a free string so a future custom role can use it. An
      // unknown value is simply never consulted by the matrix.
      permission: row.permission as Permission,
      effect: row.effect === 'deny' ? 'deny' : 'allow',
    });
  }
  return overrides;
}

/**
 * Build the policy actor. The three credential shapes differ only in where the
 * granting user and the narrowing come from; the decision that follows is the
 * same code for all of them.
 */
export async function loadActor(
  db: Db,
  ctx: ActorContext,
  clock: Clock = systemClock,
): Promise<ActorSnapshot> {
  const workspace = await loadWorkspace(db, ctx.workspaceId);
  const scopes: readonly Scope[] = normalizeScopes(ctx.scopes);

  let userId: string | null = null;
  let role: Role | null = null;
  let membershipState: 'invited' | 'active' | 'suspended' | 'removed';
  let projectScope: readonly string[] = [];
  let connectionScope: readonly string[] = [];
  let grantRevoked = false;
  let credentialExpired = false;
  let restrictions: ServiceAccountRestrictions = {};
  let approvalLevel = ctx.approvalLevel;

  if (ctx.actorType === 'user') {
    userId = ctx.actorId;
    const membership = await loadRoleFor(db, ctx.workspaceId, ctx.actorId);
    role = membership.role;
    membershipState = membership.state;
    projectScope = membership.projectScope;
  } else if (ctx.actorType === 'service_account') {
    const account = await db.serviceAccount.findFirst({
      where: { id: ctx.actorId, workspaceId: ctx.workspaceId },
      select: {
        id: true,
        createdByUserId: true,
        projectScope: true,
        connectionScope: true,
        providerScope: true,
        localeScope: true,
        approvedDomains: true,
        maxDailyPublishes: true,
        maxLookAheadDays: true,
        maxApprovalLevel: true,
        disabledAt: true,
      },
    });
    if (account === null) {
      throw notFound('service_account', ctx.actorId);
    }
    userId = account.createdByUserId;
    const membership = await loadRoleFor(db, ctx.workspaceId, account.createdByUserId);
    role = membership.role;
    membershipState = membership.state;
    projectScope = intersect(membership.projectScope, account.projectScope);
    connectionScope = account.connectionScope;
    credentialExpired = account.disabledAt !== null;
    const cap = approvalLevelFromInt(account.maxApprovalLevel);
    restrictions = {
      projectIds: projectScope,
      connectionIds: account.connectionScope,
      providers: account.providerScope.map((provider) => toProviderId(provider)),
      locales: account.localeScope,
      approvedDomains: account.approvedDomains,
      maxDailyPublishes: account.maxDailyPublishes,
      maxLookAheadDays: account.maxLookAheadDays,
      ianaTimeZone: workspace.defaultTimeZone,
      maxApprovalLevel: cap,
      disabled: account.disabledAt !== null,
    };
    approvalLevel = minLevel(ctx.approvalLevel, cap);
  } else if (ctx.actorType === 'oauth_app') {
    const grant = await db.oAuthGrant.findFirst({
      where: { id: ctx.actorId, workspaceId: ctx.workspaceId },
      select: {
        subjectUserId: true,
        projectScope: true,
        connectionScope: true,
        revokedAt: true,
        expiresAt: true,
      },
    });
    if (grant === null) {
      throw notFound('oauth_grant', ctx.actorId);
    }
    userId = grant.subjectUserId;
    const membership = await loadRoleFor(db, ctx.workspaceId, grant.subjectUserId);
    role = membership.role;
    membershipState = membership.state;
    projectScope = intersect(membership.projectScope, grant.projectScope);
    connectionScope = grant.connectionScope;
    grantRevoked = grant.revokedAt !== null;
    credentialExpired =
      grant.expiresAt !== null && grant.expiresAt.getTime() <= clock.now().getTime();
    restrictions = {
      projectIds: projectScope,
      connectionIds: grant.connectionScope,
      ianaTimeZone: workspace.defaultTimeZone,
    };
  } else {
    // A system actor is the worker acting on work a human already authorized.
    membershipState = 'active';
  }

  const policyActor: PolicyActor = {
    actorType: ctx.actorType,
    actorId: ctx.actorId,
    workspaceId: ctx.workspaceId,
    role,
    membershipState,
    scopes,
    approvalLevel,
    projectScope,
    connectionScope,
    grantRevoked,
    credentialExpired,
    workspaceState: workspaceStateOf(workspace.status),
    killSwitchEngaged: workspace.killSwitchEngaged,
    roleOverrides: await loadRoleOverrides(db, ctx.workspaceId, role),
  };

  return {
    ctx,
    policyActor,
    userId,
    workspace,
    restrictions,
    // Self approval stays off. When the setting is exposed it will be read here
    // and nowhere else.
    workspacePolicy: { allowSelfApproval: false },
  };
}

function workspaceStateOf(
  status: string,
): 'active' | 'trialing' | 'past_due' | 'read_only' | 'suspended' | 'deleted' {
  switch (status) {
    case 'active':
    case 'trialing':
    case 'past_due':
    case 'read_only':
    case 'suspended':
    case 'deleted':
      return status;
    default:
      return 'suspended';
  }
}

/** Narrowing intersects down the chain. An empty list means "no narrowing". */
function intersect(left: readonly string[], right: readonly string[]): readonly string[] {
  if (left.length === 0) {
    return right;
  }
  if (right.length === 0) {
    return left;
  }
  return left.filter((entry) => right.includes(entry));
}

const LEVEL_ORDER = ['level_0_read', 'level_1_draft', 'level_2_scheduled', 'level_3_confirm'];

function minLevel<T extends string>(left: T, right: T): T {
  return LEVEL_ORDER.indexOf(left) <= LEVEL_ORDER.indexOf(right) ? left : right;
}

/** Throw unless the actor may do this. The decision travels into the error. */
export function guard(
  actor: ActorSnapshot,
  permission: Permission,
  resource?: PolicyResource,
): void {
  const decision = can(actor.policyActor, permission, resource, {
    workspacePolicy: actor.workspacePolicy,
  });
  if (!decision.allowed) {
    throw decisionToError(decision, actor.ctx.correlationId);
  }
}

/**
 * Run `handler` inside one workspace-scoped transaction that already carries
 * the RLS claims, with the actor snapshot loaded. This is the only way a
 * service touches the database.
 */
export async function runInWorkspace<T>(
  deps: ServiceDeps,
  ctx: ActorContext,
  handler: (db: Db, actor: ActorSnapshot) => Promise<T>,
  options: { readonly timeoutMs?: number; readonly maxWaitMs?: number } = {},
): Promise<T> {
  try {
    return await withWorkspaceContext(
      deps.prisma,
      {
        workspaceId: ctx.workspaceId,
        ...(isUuid(ctx.actorId) && ctx.actorType === 'user' ? { userId: ctx.actorId } : {}),
        role: 'service_role',
      },
      async (db) => {
        const actor = await loadActor(db, ctx);
        return handler(db, actor);
      },
      // Prisma's maxWait default is 2000ms — the time it has to acquire a
      // connection and begin the transaction before giving up with
      // "Unable to start a transaction in the given time". Against a remote
      // Neon database that is routinely tighter than one connection
      // round trip, so every workspace-scoped read intermittently failed
      // with a 500 even though the query itself would have succeeded.
      { timeoutMs: options.timeoutMs ?? 15_000, maxWaitMs: options.maxWaitMs ?? 10_000 },
    );
  } catch (error) {
    throw toRelayError(error, ctx.correlationId);
  }
}

/** `runInWorkspace` with the authorization check already applied. */
export async function authorized<T>(
  deps: ServiceDeps,
  ctx: ActorContext,
  permission: Permission,
  resource: PolicyResource | undefined,
  handler: (db: Db, actor: ActorSnapshot) => Promise<T>,
  options: { readonly timeoutMs?: number } = {},
): Promise<T> {
  return runInWorkspace(
    deps,
    ctx,
    async (db, actor) => {
      guard(actor, permission, resource);
      return handler(db, actor);
    },
    options,
  );
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}
