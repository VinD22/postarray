import { ERROR_CODES, RelayError, type Locale, type Paginated } from '@relay/contracts';
import { appendAuditEvent, withRlsContext } from '@relay/database';

import type {
  ActorContext,
  IdentityContext,
  PageQuery,
  ServiceDeps,
  WorkspaceService,
} from '../types';
import type { WorkspaceView } from '../views';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { toStoredSurface } from '../internal/mappers';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { workspaceSlug } from '../internal/workspace-slug';

/** Workspace settings and the operator kill switch. */

function toWeekStart(value: number): WorkspaceView['weekStart'] {
  if (value === 0 || value === 1 || value === 6) {
    return value;
  }
  throw new RelayError(ERROR_CODES.INTERNAL, {
    details: { resource: 'workspace', field: 'week_start' },
  });
}

function toHourCycle(value: string): WorkspaceView['hourCycle'] {
  if (value === 'h12' || value === 'h23') {
    return value;
  }
  throw new RelayError(ERROR_CODES.INTERNAL, {
    details: { resource: 'workspace', field: 'hour_cycle' },
  });
}

async function readWorkspace(db: Db, workspaceId: string): Promise<WorkspaceView> {
  const row = await db.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      defaultLocale: true,
      defaultTimeZone: true,
      contentLocales: true,
      markets: true,
      weekStart: true,
      hourCycle: true,
      killSwitchAt: true,
      createdAt: true,
    },
  });
  if (row === null) {
    throw notFound('workspace', workspaceId);
  }
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    defaultLocale: row.defaultLocale,
    defaultTimeZone: row.defaultTimeZone,
    contentLocales: [...row.contentLocales],
    markets: [...row.markets],
    weekStart: toWeekStart(row.weekStart),
    hourCycle: toHourCycle(row.hourCycle),
    killSwitchEngaged: row.killSwitchAt !== null,
    createdAt: row.createdAt.toISOString(),
  };
}

export function createWorkspaceService(deps: ServiceDeps): WorkspaceService {
  return {
    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<WorkspaceView>> {
      return authorized(deps, ctx, 'workspace.read', undefined, async (db) => {
        const args = pageArgs(query);
        const workspace = await readWorkspace(db, ctx.workspaceId);
        return toPage(
          [workspace],
          args,
          (row) => row.id,
          (row) => row,
        );
      });
    },

    async get(ctx: ActorContext, workspaceId?: string): Promise<WorkspaceView> {
      const requestedId = workspaceId ?? ctx.workspaceId;
      if (requestedId !== ctx.workspaceId) {
        throw notFound('workspace', requestedId);
      }
      return authorized(deps, ctx, 'workspace.read', undefined, async (db) =>
        readWorkspace(db, requestedId),
      );
    },

    async create(
      ctx: IdentityContext,
      input: { name: string; ianaTimeZone: string; defaultLocale: Locale },
    ): Promise<WorkspaceView> {
      if (ctx.userId === undefined) {
        throw invalid('errors.auth_profile_required');
      }
      const userId = ctx.userId;
      return withRlsContext(deps.prisma, { role: 'service_role' }, async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });
        if (user === null) {
          throw notFound('user', userId);
        }
        const created = await tx.workspace.create({
          data: {
            name: input.name,
            slug: workspaceSlug(input.name),
            ownerUserId: user.id,
            defaultLocale: input.defaultLocale,
            defaultTimeZone: input.ianaTimeZone,
            contentLocales: [input.defaultLocale],
            brands: {
              create: {
                name: input.name,
                slug: workspaceSlug(input.name),
                defaultTimeZone: input.ianaTimeZone,
              },
            },
            memberships: {
              create: {
                userId: user.id,
                role: 'owner',
                state: 'active',
                acceptedAt: deps.clock.now(),
              },
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            defaultLocale: true,
            defaultTimeZone: true,
            contentLocales: true,
            markets: true,
            weekStart: true,
            hourCycle: true,
            killSwitchAt: true,
            createdAt: true,
          },
        });
        await appendAuditEvent(tx, {
          workspaceId: created.id,
          actor: { type: 'user', id: user.id },
          surface: toStoredSurface(ctx.surface),
          action: 'workspace.created',
          target: { type: 'workspace', id: created.id },
          after: {
            name: created.name,
            defaultLocale: created.defaultLocale,
            defaultTimeZone: created.defaultTimeZone,
          },
          metadata: { contractSurface: ctx.surface },
          correlationId: ctx.correlationId,
        });
        return {
          id: created.id,
          name: created.name,
          slug: created.slug,
          status: created.status,
          defaultLocale: created.defaultLocale,
          defaultTimeZone: created.defaultTimeZone,
          contentLocales: [...created.contentLocales],
          markets: [...created.markets],
          weekStart: toWeekStart(created.weekStart),
          hourCycle: toHourCycle(created.hourCycle),
          killSwitchEngaged: created.killSwitchAt !== null,
          createdAt: created.createdAt.toISOString(),
        };
      });
    },

    async update(
      ctx: ActorContext,
      workspaceIdOrPatch:
        | string
        | {
            name?: string;
            defaultLocale?: string;
            defaultTimeZone?: string;
            ianaTimeZone?: string;
            contentLocales?: readonly string[];
            markets?: readonly string[];
            weekStart?: 0 | 1 | 6;
            hourCycle?: 'h12' | 'h23';
          },
      suppliedPatch?: {
        name?: string;
        defaultLocale?: string;
        defaultTimeZone?: string;
        ianaTimeZone?: string;
        contentLocales?: readonly string[];
        markets?: readonly string[];
        weekStart?: 0 | 1 | 6;
        hourCycle?: 'h12' | 'h23';
      },
    ): Promise<WorkspaceView> {
      const workspaceId =
        typeof workspaceIdOrPatch === 'string' ? workspaceIdOrPatch : ctx.workspaceId;
      const patch =
        typeof workspaceIdOrPatch === 'string' ? (suppliedPatch ?? {}) : workspaceIdOrPatch;
      if (workspaceId !== ctx.workspaceId) {
        throw notFound('workspace', workspaceId);
      }
      return authorized(deps, ctx, 'workspace.update', undefined, async (db, actor) => {
        const before = await readWorkspace(db, workspaceId);
        await db.workspace.update({
          where: { id: workspaceId },
          data: {
            ...(patch.name === undefined ? {} : { name: patch.name }),
            ...(patch.defaultLocale === undefined ? {} : { defaultLocale: patch.defaultLocale }),
            ...(patch.defaultTimeZone === undefined && patch.ianaTimeZone === undefined
              ? {}
              : { defaultTimeZone: patch.defaultTimeZone ?? patch.ianaTimeZone }),
            ...(patch.contentLocales === undefined
              ? {}
              : { contentLocales: [...patch.contentLocales] }),
            ...(patch.markets === undefined ? {} : { markets: [...patch.markets] }),
            ...(patch.weekStart === undefined ? {} : { weekStart: patch.weekStart }),
            ...(patch.hourCycle === undefined ? {} : { hourCycle: patch.hourCycle }),
          },
        });
        const after = await readWorkspace(db, workspaceId);
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'workspace',
          targetId: workspaceId,
          before,
          after,
        });
        return after;
      });
    },

    async listForUser(userId: string): Promise<readonly WorkspaceView[]> {
      return withRlsContext(deps.prisma, { role: 'service_role' }, async (tx) => {
        const memberships = await tx.membership.findMany({
          where: { userId, state: 'active' },
          orderBy: { workspace: { createdAt: 'asc' } },
          select: {
            workspace: {
              select: {
                id: true,
                name: true,
                slug: true,
                status: true,
                defaultLocale: true,
                defaultTimeZone: true,
                contentLocales: true,
                markets: true,
                weekStart: true,
                hourCycle: true,
                killSwitchAt: true,
                createdAt: true,
              },
            },
          },
        });
        return memberships.map(({ workspace }) => ({
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          status: workspace.status,
          defaultLocale: workspace.defaultLocale,
          defaultTimeZone: workspace.defaultTimeZone,
          contentLocales: [...workspace.contentLocales],
          markets: [...workspace.markets],
          weekStart: toWeekStart(workspace.weekStart),
          hourCycle: toHourCycle(workspace.hourCycle),
          killSwitchEngaged: workspace.killSwitchAt !== null,
          createdAt: workspace.createdAt.toISOString(),
        }));
      });
    },

    /**
     * Stops every outbound provider call for this tenant within one request.
     * Nothing already published is touched; nothing new leaves.
     */
    async engageKillSwitch(ctx: ActorContext, reasonKey: string): Promise<WorkspaceView> {
      return authorized(deps, ctx, 'workspace.update', undefined, async (db, actor) => {
        const before = await readWorkspace(db, ctx.workspaceId);
        await db.workspace.update({
          where: { id: ctx.workspaceId },
          data: { killSwitchAt: deps.clock.now(), killSwitchReason: reasonKey },
        });
        const after = await readWorkspace(db, ctx.workspaceId);
        await recordAudit(db, actor, {
          action: 'workspace.kill_switch_engaged',
          targetType: 'workspace',
          targetId: ctx.workspaceId,
          before,
          after,
          metadata: { reasonKey },
        });
        return after;
      });
    },

    async releaseKillSwitch(ctx: ActorContext): Promise<WorkspaceView> {
      return authorized(deps, ctx, 'workspace.update', undefined, async (db, actor) => {
        const before = await readWorkspace(db, ctx.workspaceId);
        await db.workspace.update({
          where: { id: ctx.workspaceId },
          data: { killSwitchAt: null, killSwitchReason: null },
        });
        const after = await readWorkspace(db, ctx.workspaceId);
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'workspace',
          targetId: ctx.workspaceId,
          before,
          after,
          metadata: { killSwitchReleased: true },
        });
        return after;
      });
    },
  };
}
