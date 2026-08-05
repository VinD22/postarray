import { ROLE_RANK } from '@relay/authz';
import type { Paginated, Role } from '@relay/contracts';

import type { ActorContext, MembershipService, PageQuery, ServiceDeps } from '../types.js';
import type { MembershipView } from '../views.js';

import { recordAudit } from '../internal/audit.js';
import { invalid, notFound } from '../internal/errors.js';
import { pageArgs, toPage } from '../internal/pagination.js';
import { authorized, type Db } from '../internal/runtime.js';

/**
 * Membership.
 *
 * A member cannot grant a role above their own, and the last owner cannot be
 * removed or demoted. Both rules are enforced here rather than in a controller,
 * so the CLI and the API get them for free.
 */

const MEMBERSHIP_SELECT = {
  id: true,
  userId: true,
  workspaceId: true,
  role: true,
  state: true,
  brandScope: true,
  invitedAt: true,
  acceptedAt: true,
  user: { select: { email: true, displayName: true } },
} as const;

interface MembershipRow {
  id: string;
  userId: string;
  workspaceId: string;
  role: Role;
  state: string;
  brandScope: string[];
  invitedAt: Date | null;
  acceptedAt: Date | null;
  user: { email: string; displayName: string };
}

function toView(row: MembershipRow): MembershipView {
  const state = row.state;
  return {
    id: row.id,
    userId: row.userId,
    workspaceId: row.workspaceId,
    email: row.user.email,
    displayName: row.user.displayName,
    role: row.role,
    state:
      state === 'invited' || state === 'active' || state === 'suspended' || state === 'removed'
        ? state
        : 'removed',
    brandScope: [...row.brandScope],
    invitedAt: row.invitedAt?.toISOString() ?? null,
    acceptedAt: row.acceptedAt?.toISOString() ?? null,
  };
}

async function assertNotLastOwner(
  db: Db,
  workspaceId: string,
  membershipId: string,
): Promise<void> {
  const membership = await db.membership.findFirst({
    where: { id: membershipId },
    select: { role: true },
  });
  if (membership === null || membership.role !== 'owner') {
    return;
  }
  const owners = await db.membership.count({
    where: { workspaceId, role: 'owner', state: 'active' },
  });
  if (owners <= 1) {
    throw invalid('errors.last_owner_protected', { membershipId });
  }
}

/** A member may never hand out a role above their own. */
function assertCanGrant(actorRole: Role | null, target: Role): void {
  if (actorRole === null || ROLE_RANK[target] > ROLE_RANK[actorRole]) {
    throw invalid('errors.cannot_grant_higher_role', {
      requested: target,
      held: actorRole ?? 'none',
    });
  }
}

export function createMembershipService(deps: ServiceDeps): MembershipService {
  return {
    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<MembershipView>> {
      return authorized(deps, ctx, 'member.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.membership.findMany({
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: MEMBERSHIP_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },

    async get(ctx: ActorContext, membershipId: string): Promise<MembershipView> {
      return authorized(deps, ctx, 'member.read', undefined, async (db) => {
        const row = await db.membership.findFirst({
          where: { id: membershipId },
          select: MEMBERSHIP_SELECT,
        });
        if (row === null) {
          throw notFound('membership', membershipId);
        }
        return toView(row);
      });
    },

    async invite(
      ctx: ActorContext,
      input: { email: string; role: Role; brandScope?: readonly string[] },
    ): Promise<MembershipView> {
      return authorized(deps, ctx, 'member.invite', undefined, async (db, actor) => {
        assertCanGrant(actor.policyActor.role, input.role);

        const email = input.email.trim().toLowerCase();
        const existingUser = await db.user.findUnique({
          where: { email },
          select: { id: true },
        });
        const userId =
          existingUser?.id ??
          (
            await db.user.create({
              data: { email, displayName: email, status: 'invited' },
              select: { id: true },
            })
          ).id;

        const already = await db.membership.findFirst({
          where: { workspaceId: ctx.workspaceId, userId },
          select: { id: true },
        });
        if (already !== null) {
          throw invalid('errors.member_already_invited', { email });
        }

        const created = await db.membership.create({
          data: {
            workspaceId: actor.workspace.id,
            userId,
            role: input.role,
            state: 'invited',
            brandScope: [...(input.brandScope ?? [])],
            ...(actor.userId === null ? {} : { invitedByUserId: actor.userId }),
            invitedAt: deps.clock.now(),
          },
          select: MEMBERSHIP_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'membership.invited',
          targetType: 'membership',
          targetId: created.id,
          after: { role: input.role, brandScope: created.brandScope },
        });

        await deps.mailer.send({
          to: [email],
          subjectKey: 'email.invitation.subject',
          bodyKey: 'email.invitation.body',
          params: { workspaceName: actor.workspace.name, role: input.role },
          locale: ctx.locale,
          workspaceId: ctx.workspaceId,
        });

        return toView(created);
      });
    },

    async changeRole(ctx: ActorContext, membershipId: string, role: Role): Promise<MembershipView> {
      return authorized(deps, ctx, 'member.update_role', undefined, async (db, actor) => {
        assertCanGrant(actor.policyActor.role, role);
        const before = await db.membership.findFirst({
          where: { id: membershipId },
          select: MEMBERSHIP_SELECT,
        });
        if (before === null) {
          throw notFound('membership', membershipId);
        }
        if (before.role === 'owner' && role !== 'owner') {
          await assertNotLastOwner(db, ctx.workspaceId, membershipId);
        }

        const after = await db.membership.update({
          where: { id: membershipId },
          data: { role },
          select: MEMBERSHIP_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'membership.role_changed',
          targetType: 'membership',
          targetId: membershipId,
          before: { role: before.role },
          after: { role },
        });

        return toView(after);
      });
    },

    async remove(ctx: ActorContext, membershipId: string): Promise<void> {
      await authorized(deps, ctx, 'member.remove', undefined, async (db, actor) => {
        const before = await db.membership.findFirst({
          where: { id: membershipId },
          select: MEMBERSHIP_SELECT,
        });
        if (before === null) {
          throw notFound('membership', membershipId);
        }
        await assertNotLastOwner(db, ctx.workspaceId, membershipId);

        await db.membership.update({
          where: { id: membershipId },
          data: { state: 'removed', removedAt: deps.clock.now() },
        });

        await recordAudit(db, actor, {
          action: 'membership.removed',
          targetType: 'membership',
          targetId: membershipId,
          before: { role: before.role, state: before.state },
          after: { state: 'removed' },
        });
      });
    },
  };
}
