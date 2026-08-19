import {
  ERROR_CODES,
  PROJECT_LIMIT_ENTITLEMENT_KEY,
  RelayError,
  normalizeProjectLimit,
  type Paginated,
} from '@relay/contracts';

import type { ActorContext, ProjectService, PageQuery, ServiceDeps } from '../types';
import type { ProjectView } from '../views';

import { recordAudit } from '../internal/audit';
import { notFound } from '../internal/errors';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { workspaceSlug } from '../internal/workspace-slug';

/** Projects: voice, claims, blocked terms, domains and scheduling defaults. */

const PROJECT_SELECT = {
  id: true,
  workspaceId: true,
  name: true,
  slug: true,
  voice: true,
  audience: true,
  approvedClaims: true,
  blockedTerms: true,
  domains: true,
  defaultTimeZone: true,
  defaultShortLinkOn: true,
  rememberTargetsEnabled: true,
  archivedAt: true,
  createdAt: true,
  updatedAt: true,
  socialConnections: { select: { id: true, status: true } },
} as const;

interface ProjectRow {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  voice: string | null;
  audience: string | null;
  approvedClaims: string[];
  blockedTerms: string[];
  domains: string[];
  defaultTimeZone: string | null;
  defaultShortLinkOn: boolean;
  rememberTargetsEnabled: boolean;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  socialConnections: readonly { id: string; status: string }[];
}

function toView(row: ProjectRow): ProjectView {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    name: row.name,
    slug: row.slug,
    voice: row.voice,
    audience: row.audience,
    approvedClaims: [...row.approvedClaims],
    blockedTerms: [...row.blockedTerms],
    domains: [...row.domains],
    defaultTimeZone: row.defaultTimeZone,
    defaultShortLinkOn: row.defaultShortLinkOn,
    rememberTargetsEnabled: row.rememberTargetsEnabled,
    archived: row.archivedAt !== null,
    connectionIds: row.socialConnections.map((connection) => connection.id),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function assertProjectSlotAvailable(used: number, limit: number): void {
  if (used < limit) {
    return;
  }
  throw new RelayError(ERROR_CODES.QUOTA_EXCEEDED, {
    messageKey: 'errors.project_limit_reached',
    details: { used, limit },
  });
}

async function requireProjectSlot(db: Db): Promise<void> {
  const [used, entitlement] = await Promise.all([
    db.project.count({ where: { archivedAt: null } }),
    db.entitlement.findFirst({
      where: { key: PROJECT_LIMIT_ENTITLEMENT_KEY },
      select: { numericValue: true },
    }),
  ]);
  assertProjectSlotAvailable(used, normalizeProjectLimit(entitlement?.numericValue));
}

function assertProjectArchivable(row: ProjectRow): void {
  const connected = row.socialConnections.filter(
    (connection) => connection.status !== 'disconnected',
  );
  if (connected.length === 0) {
    return;
  }
  throw new RelayError(ERROR_CODES.CONFLICT, {
    messageKey: 'errors.project_has_connections',
    details: { connected: connected.length },
  });
}

async function requireAnotherActiveProject(db: Db, projectId: string): Promise<void> {
  const remaining = await db.project.count({
    where: { id: { not: projectId }, archivedAt: null },
  });
  if (remaining > 0) {
    return;
  }
  throw new RelayError(ERROR_CODES.CONFLICT, {
    messageKey: 'errors.project_last_active',
    details: {},
  });
}

export function createProjectService(deps: ServiceDeps): ProjectService {
  return {
    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<ProjectView>> {
      return authorized(deps, ctx, 'project.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.project.findMany({
          where: { archivedAt: null },
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: PROJECT_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },

    async get(ctx: ActorContext, projectId: string): Promise<ProjectView> {
      return authorized(deps, ctx, 'project.read', { projectId }, async (db) => {
        const row = await db.project.findFirst({ where: { id: projectId }, select: PROJECT_SELECT });
        if (row === null) {
          throw notFound('project', projectId);
        }
        return toView(row);
      });
    },

    async create(
      ctx: ActorContext,
      input: { name: string; defaultTimeZone?: string },
    ): Promise<ProjectView> {
      return authorized(deps, ctx, 'project.write', undefined, async (db, actor) => {
        await requireProjectSlot(db);
        const created = await db.project.create({
          data: {
            workspaceId: actor.workspace.id,
            name: input.name,
            slug: workspaceSlug(input.name),
            defaultTimeZone: input.defaultTimeZone ?? actor.workspace.defaultTimeZone,
          },
          select: PROJECT_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'project',
          targetId: created.id,
          after: { name: created.name, slug: created.slug },
        });
        return toView(created);
      });
    },

    async update(
      ctx: ActorContext,
      projectId: string,
      patch: Partial<ProjectView>,
    ): Promise<ProjectView> {
      return authorized(deps, ctx, 'project.write', { projectId }, async (db, actor) => {
        const before = await db.project.findFirst({ where: { id: projectId }, select: PROJECT_SELECT });
        if (before === null) {
          throw notFound('project', projectId);
        }
        const after = await db.project.update({
          where: { id: projectId },
          data: {
            ...(patch.name === undefined ? {} : { name: patch.name }),
            ...(patch.voice === undefined ? {} : { voice: patch.voice }),
            ...(patch.audience === undefined ? {} : { audience: patch.audience }),
            ...(patch.approvedClaims === undefined
              ? {}
              : { approvedClaims: [...patch.approvedClaims] }),
            ...(patch.blockedTerms === undefined ? {} : { blockedTerms: [...patch.blockedTerms] }),
            ...(patch.domains === undefined ? {} : { domains: [...patch.domains] }),
            ...(patch.defaultTimeZone === undefined
              ? {}
              : { defaultTimeZone: patch.defaultTimeZone }),
            ...(patch.defaultShortLinkOn === undefined
              ? {}
              : { defaultShortLinkOn: patch.defaultShortLinkOn }),
          },
          select: PROJECT_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'project',
          targetId: projectId,
          before: toView(before),
          after: toView(after),
        });
        return toView(after);
      });
    },

    async archive(ctx: ActorContext, projectId: string): Promise<ProjectView> {
      return authorized(deps, ctx, 'project.delete', { projectId }, async (db, actor) => {
        const before = await db.project.findFirst({ where: { id: projectId }, select: PROJECT_SELECT });
        if (before === null) {
          throw notFound('project', projectId);
        }
        assertProjectArchivable(before);
        await requireAnotherActiveProject(db, projectId);
        const row = await db.project.update({
          where: { id: projectId },
          data: { archivedAt: deps.clock.now() },
          select: PROJECT_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'project',
          targetId: projectId,
          after: { archived: true },
        });
        return toView(row);
      });
    },

    async delete(ctx: ActorContext, projectId: string): Promise<void> {
      await authorized(deps, ctx, 'project.delete', { projectId }, async (db, actor) => {
        const row = await db.project.findFirst({ where: { id: projectId }, select: PROJECT_SELECT });
        if (row === null) {
          throw notFound('project', projectId);
        }
        assertProjectArchivable(row);
        await requireAnotherActiveProject(db, projectId);
        await db.project.update({
          where: { id: projectId },
          data: { archivedAt: deps.clock.now() },
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'project',
          targetId: projectId,
          after: { archived: true },
        });
      });
    },
  };
}
