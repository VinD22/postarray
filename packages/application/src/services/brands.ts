import type { Paginated } from '@relay/contracts';

import type { ActorContext, BrandService, PageQuery, ServiceDeps } from '../types.js';
import type { BrandView } from '../views.js';

import { recordAudit } from '../internal/audit.js';
import { notFound } from '../internal/errors.js';
import { pageArgs, toPage } from '../internal/pagination.js';
import { authorized } from '../internal/runtime.js';

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
  };
}

export function createBrandService(deps: ServiceDeps): BrandService {
  return {
    async list(ctx: ActorContext, query: PageQuery = {}): Promise<Paginated<BrandView>> {
      return authorized(deps, ctx, 'brand.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.brand.findMany({
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
      input: { name: string; slug: string; defaultTimeZone?: string },
    ): Promise<BrandView> {
      return authorized(deps, ctx, 'brand.write', undefined, async (db, actor) => {
        const created = await db.brand.create({
          data: {
            workspaceId: actor.workspace.id,
            name: input.name,
            slug: input.slug,
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
  };
}
