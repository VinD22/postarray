import {
  ERROR_CODES,
  PROJECT_LIMIT_ENTITLEMENT_KEY,
  RelayError,
  normalizeProjectLimit,
  type Paginated,
} from '@relay/contracts';

import type { ActorContext, BrandService, PageQuery, ServiceDeps } from '../types';
import type { BrandView } from '../views';

import { recordAudit } from '../internal/audit';
import { notFound } from '../internal/errors';
import { pageArgs, toPage } from '../internal/pagination';
import { authorized, type Db } from '../internal/runtime';
import { workspaceSlug } from '../internal/workspace-slug';

/** Brands: voice, claims, blocked terms, domains and scheduling defaults. */

const BRAND_SELECT = {
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
  archivedAt: true,
  createdAt: true,
  updatedAt: true,
  socialConnections: { select: { id: true, status: true } },
} as const;

interface BrandRow {
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
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  socialConnections: readonly { id: string; status: string }[];
}

function toView(row: BrandRow): BrandView {
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
    db.brand.count({ where: { archivedAt: null } }),
    db.entitlement.findFirst({
      where: { key: PROJECT_LIMIT_ENTITLEMENT_KEY },
      select: { numericValue: true },
    }),
  ]);
  assertProjectSlotAvailable(used, normalizeProjectLimit(entitlement?.numericValue));
}

function assertProjectArchivable(row: BrandRow): void {
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

async function requireAnotherActiveProject(db: Db, brandId: string): Promise<void> {
  const remaining = await db.brand.count({
    where: { id: { not: brandId }, archivedAt: null },
  });
  if (remaining > 0) {
    return;
  }
  throw new RelayError(ERROR_CODES.CONFLICT, {
    messageKey: 'errors.project_last_active',
    details: {},
  });
}

export function createBrandService(deps: ServiceDeps): BrandService {
  return {
    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<BrandView>> {
      return authorized(deps, ctx, 'brand.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.brand.findMany({
          where: { archivedAt: null },
          orderBy: { id: 'asc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: BRAND_SELECT,
        });
        return toPage(rows, args, (row) => row.id, toView);
      });
    },

    async get(ctx: ActorContext, brandId: string): Promise<BrandView> {
      return authorized(deps, ctx, 'brand.read', { brandId }, async (db) => {
        const row = await db.brand.findFirst({ where: { id: brandId }, select: BRAND_SELECT });
        if (row === null) {
          throw notFound('brand', brandId);
        }
        return toView(row);
      });
    },

    async create(
      ctx: ActorContext,
      input: { name: string; defaultTimeZone?: string },
    ): Promise<BrandView> {
      return authorized(deps, ctx, 'brand.write', undefined, async (db, actor) => {
        await requireProjectSlot(db);
        const created = await db.brand.create({
          data: {
            workspaceId: actor.workspace.id,
            name: input.name,
            slug: workspaceSlug(input.name),
            defaultTimeZone: input.defaultTimeZone ?? actor.workspace.defaultTimeZone,
          },
          select: BRAND_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'brand',
          targetId: created.id,
          after: { name: created.name, slug: created.slug },
        });
        return toView(created);
      });
    },

    async update(
      ctx: ActorContext,
      brandId: string,
      patch: Partial<BrandView>,
    ): Promise<BrandView> {
      return authorized(deps, ctx, 'brand.write', { brandId }, async (db, actor) => {
        const before = await db.brand.findFirst({ where: { id: brandId }, select: BRAND_SELECT });
        if (before === null) {
          throw notFound('brand', brandId);
        }
        const after = await db.brand.update({
          where: { id: brandId },
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
          select: BRAND_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'brand',
          targetId: brandId,
          before: toView(before),
          after: toView(after),
        });
        return toView(after);
      });
    },

    async archive(ctx: ActorContext, brandId: string): Promise<BrandView> {
      return authorized(deps, ctx, 'brand.delete', { brandId }, async (db, actor) => {
        const before = await db.brand.findFirst({ where: { id: brandId }, select: BRAND_SELECT });
        if (before === null) {
          throw notFound('brand', brandId);
        }
        assertProjectArchivable(before);
        await requireAnotherActiveProject(db, brandId);
        const row = await db.brand.update({
          where: { id: brandId },
          data: { archivedAt: deps.clock.now() },
          select: BRAND_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'brand',
          targetId: brandId,
          after: { archived: true },
        });
        return toView(row);
      });
    },

    async delete(ctx: ActorContext, brandId: string): Promise<void> {
      await authorized(deps, ctx, 'brand.delete', { brandId }, async (db, actor) => {
        const row = await db.brand.findFirst({ where: { id: brandId }, select: BRAND_SELECT });
        if (row === null) {
          throw notFound('brand', brandId);
        }
        assertProjectArchivable(row);
        await requireAnotherActiveProject(db, brandId);
        await db.brand.update({
          where: { id: brandId },
          data: { archivedAt: deps.clock.now() },
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'brand',
          targetId: brandId,
          after: { archived: true },
        });
      });
    },
  };
}
