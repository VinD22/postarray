import { createHash, randomBytes } from 'node:crypto';

import { ROLE_RANK } from '@relay/authz';
import { WORKSPACE_MEMBER_LIMIT, type Paginated, type Role } from '@relay/contracts';
import { appendAuditEvent, withRlsContext } from '@relay/database';

import type {
  ActorContext,
  IdentityContext,
  MembershipService,
  PageQuery,
  ServiceDeps,
} from '../types';
import type { InvitationView, MembershipView } from '../views';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { toStoredSurface } from '../internal/mappers';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';

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
  projectScope: true,
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
  projectScope: string[];
  invitedAt: Date | null;
  acceptedAt: Date | null;
  user: { email: string; displayName: string };
}

const INVITATION_SELECT = {
  id: true,
  workspaceId: true,
  email: true,
  role: true,
  state: true,
  expiresAt: true,
  createdAt: true,
} as const;

interface InvitationRow {
  id: string;
  workspaceId: string;
  email: string;
  role: Role;
  state: string;
  expiresAt: Date;
  createdAt: Date;
}

function toInvitationView(row: InvitationRow): InvitationView {
  const state =
    row.state === 'pending' ||
    row.state === 'accepted' ||
    row.state === 'revoked' ||
    row.state === 'expired'
      ? row.state
      : 'expired';
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    email: row.email,
    role: row.role,
    state,
    expiresAt: row.expiresAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

function invitationTokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

const INVITATION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

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
    projectScope: [...row.projectScope],
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
      input: { email: string; role: Role; note?: string },
    ): Promise<InvitationView> {
      return authorized(deps, ctx, 'member.invite', undefined, async (db, actor) => {
        assertCanGrant(actor.policyActor.role, input.role);
        if (actor.userId === null) {
          throw invalid('errors.human_actor_required');
        }

        const email = input.email.trim().toLowerCase();
        const existingUser = await db.user.findUnique({
          where: { email },
          select: { id: true },
        });
        if (
          existingUser !== null &&
          (await db.membership.findFirst({
            where: { userId: existingUser.id, state: { in: ['invited', 'active'] } },
            select: { id: true },
          })) !== null
        ) {
          throw invalid('errors.member_already_invited', { email });
        }

        await db.invitation.updateMany({
          where: { state: 'pending', expiresAt: { lte: deps.clock.now() } },
          data: { state: 'expired' },
        });
        const existingInvitation = await db.invitation.findFirst({
          where: { email, state: 'pending', expiresAt: { gt: deps.clock.now() } },
          select: { id: true },
        });
        if (existingInvitation !== null) {
          throw invalid('errors.member_already_invited', { email });
        }

        const [memberCount, invitationCount] = await Promise.all([
          db.membership.count({ where: { state: { in: ['invited', 'active'] } } }),
          db.invitation.count({
            where: { state: 'pending', expiresAt: { gt: deps.clock.now() } },
          }),
        ]);
        if (memberCount + invitationCount >= WORKSPACE_MEMBER_LIMIT) {
          throw invalid('errors.member_limit_reached', {
            limit: WORKSPACE_MEMBER_LIMIT,
            used: memberCount + invitationCount,
          });
        }

        const token = randomBytes(32).toString('base64url');
        const expiresAt = new Date(deps.clock.now().getTime() + INVITATION_LIFETIME_MS);
        const created = await db.invitation.create({
          data: {
            workspaceId: ctx.workspaceId,
            email,
            role: input.role,
            invitedByUserId: actor.userId,
            tokenHash: invitationTokenHash(token),
            expiresAt,
            ...(input.note === undefined ? {} : { note: input.note }),
          },
          select: INVITATION_SELECT,
        });

        await recordAudit(db, actor, {
          action: 'membership.invited',
          targetType: 'invitation',
          targetId: created.id,
          after: { role: input.role, expiresAt },
        });

        const appUrl = deps.config.core.appUrl;
        if (appUrl === undefined) {
          throw invalid('errors.app_url_required');
        }
        const invitationUrl = new URL('/invitations/accept', appUrl);
        invitationUrl.searchParams.set('token', token);
        await deps.mailer.send({
          to: [email],
          subjectKey: 'email.invitation.subject',
          bodyKey: 'email.invitation.body',
          params: {
            workspaceName: actor.workspace.name,
            role: input.role,
            invitationUrl: invitationUrl.toString(),
            expiresAt: expiresAt.toISOString(),
          },
          locale: ctx.locale,
          workspaceId: ctx.workspaceId,
        });

        return toInvitationView(created);
      });
    },

    async listInvitations(
      ctx: ActorContext,
      query: PageQuery = {},
    ): Promise<Paginated<InvitationView>> {
      return authorized(deps, ctx, 'member.read', undefined, async (db) => {
        await db.invitation.updateMany({
          where: { state: 'pending', expiresAt: { lte: deps.clock.now() } },
          data: { state: 'expired' },
        });
        const args = pageArgs(query);
        const rows = await db.invitation.findMany({
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: INVITATION_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toInvitationView);
      });
    },

    async revokeInvitation(ctx: ActorContext, invitationId: string): Promise<void> {
      await authorized(deps, ctx, 'member.invite', undefined, async (db, actor) => {
        const invitation = await db.invitation.findFirst({
          where: { id: invitationId },
          select: INVITATION_SELECT,
        });
        if (invitation === null) {
          throw notFound('invitation', invitationId);
        }
        if (invitation.state === 'pending') {
          await db.invitation.update({
            where: { id: invitationId },
            data: { state: 'revoked', revokedAt: deps.clock.now() },
          });
          await recordAudit(db, actor, {
            action: 'membership.invitation_revoked',
            targetType: 'invitation',
            targetId: invitationId,
            before: { state: invitation.state },
            after: { state: 'revoked' },
          });
        }
      });
    },

    async acceptInvitation(ctx: IdentityContext, token: string): Promise<MembershipView> {
      if (ctx.userId === undefined) {
        throw invalid('errors.auth_profile_required');
      }
      return withRlsContext(deps.prisma, { role: 'service_role' }, async (tx) => {
        const invitation = await tx.invitation.findUnique({
          where: { tokenHash: invitationTokenHash(token) },
        });
        if (invitation === null || invitation.state !== 'pending') {
          throw invalid('errors.invitation_invalid');
        }
        if (invitation.expiresAt <= deps.clock.now()) {
          await tx.invitation.update({
            where: { id: invitation.id },
            data: { state: 'expired' },
          });
          throw invalid('errors.invitation_expired');
        }
        const user = await tx.user.findUnique({
          where: { id: ctx.userId },
          select: { id: true, email: true },
        });
        if (user === null || user.email.toLowerCase() !== invitation.email.toLowerCase()) {
          throw invalid('errors.invitation_email_mismatch');
        }
        const existing = await tx.membership.findUnique({
          where: {
            workspaceId_userId: { workspaceId: invitation.workspaceId, userId: user.id },
          },
          select: { id: true, state: true },
        });
        if (existing !== null && existing.state === 'active') {
          throw invalid('errors.member_already_joined');
        }
        const membership = await tx.membership.upsert({
          where: {
            workspaceId_userId: { workspaceId: invitation.workspaceId, userId: user.id },
          },
          create: {
            workspaceId: invitation.workspaceId,
            userId: user.id,
            role: invitation.role,
            state: 'active',
            invitedByUserId: invitation.invitedByUserId,
            invitedAt: invitation.createdAt,
            acceptedAt: deps.clock.now(),
          },
          update: {
            role: invitation.role,
            state: 'active',
            removedAt: null,
            acceptedAt: deps.clock.now(),
          },
          select: MEMBERSHIP_SELECT,
        });
        await tx.invitation.update({
          where: { id: invitation.id },
          data: { state: 'accepted', acceptedAt: deps.clock.now() },
        });
        await appendAuditEvent(tx, {
          workspaceId: invitation.workspaceId,
          actor: { type: 'user', id: user.id },
          surface: toStoredSurface(ctx.surface),
          action: 'membership.invitation_accepted',
          target: { type: 'membership', id: membership.id },
          after: { role: membership.role, state: membership.state },
          metadata: { contractSurface: ctx.surface },
          correlationId: ctx.correlationId,
        });
        return toView(membership);
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

    async updateRole(ctx: ActorContext, membershipId: string, role: Role): Promise<MembershipView> {
      return this.changeRole(ctx, membershipId, role);
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
