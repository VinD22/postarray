import {
  GROWTH_PLAN_SECTIONS,
  growthPlanSchema,
  newIdFor,
  opportunityRecordSchema,
  toolRecordSchema,
  type GrowthExportFormat,
  type GrowthPlan,
  type OperationRef,
  type OpportunityRecord,
  type ToolRecord,
} from '@relay/contracts';

import type { ActorContext, ContentService, GrowthService, ServiceDeps } from '../types.js';
import type { BusinessProfileView, CalendarEntry, ContentItemView } from '../views.js';

import { recordAudit } from '../internal/audit.js';
import { invalid, notFound } from '../internal/errors.js';
import { withIdempotency } from '../internal/idempotency.js';
import { authorized, type Db } from '../internal/runtime.js';
import { asOpportunityKind } from '../internal/storage-enums.js';

/**
 * The Growth Advisor.
 *
 * The plan is a versioned document with nine required sections. Facts and
 * assumptions stay separate arrays and an assumption is never promoted into a
 * fact. Opportunities and tools are catalog ids, not free URLs, so a plan that
 * references something the catalog does not hold is rejected here rather than
 * shown to a customer.
 *
 * Nothing in this service publishes or submits anything. Turning a plan item
 * into a draft goes through the normal content path, with the normal scopes and
 * the normal approval policy.
 */

const PROFILE_SELECT = {
  id: true,
  workspaceId: true,
  brandId: true,
  version: true,
  productName: true,
  productUrl: true,
  category: true,
  markets: true,
  languages: true,
  objective: true,
  completenessScore: true,
  confirmedAt: true,
} as const;

interface ProfileRow {
  id: string;
  workspaceId: string;
  brandId: string;
  version: number;
  productName: string | null;
  /** Stored as `product_url`. The view calls it `siteUrl`. */
  productUrl: string | null;
  category: string | null;
  markets: string[];
  /** Stored as `languages`. The view calls it `contentLocales`. */
  languages: string[];
  objective: string | null;
  completenessScore: unknown;
  confirmedAt: Date | null;
}

const REQUIRED_PROFILE_FIELDS = [
  'productName',
  'siteUrl',
  'category',
  'objective',
  'markets',
  'contentLocales',
] as const;

function missingFieldKeys(row: ProfileRow): readonly string[] {
  const missing: string[] = [];
  if (row.productName === null || row.productName === '') {
    missing.push('growth.profile.product_name');
  }
  if (row.productUrl === null || row.productUrl === '') {
    missing.push('growth.profile.site_url');
  }
  if (row.category === null || row.category === '') {
    missing.push('growth.profile.category');
  }
  if (row.objective === null || row.objective === '') {
    missing.push('growth.profile.objective');
  }
  if (row.markets.length === 0) {
    missing.push('growth.profile.markets');
  }
  if (row.languages.length === 0) {
    missing.push('growth.profile.content_locales');
  }
  return missing;
}

function toProfileView(row: ProfileRow): BusinessProfileView {
  const missing = missingFieldKeys(row);
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    brandId: row.brandId,
    revision: row.version,
    productName: row.productName ?? '',
    siteUrl: row.productUrl ?? '',
    category: row.category ?? '',
    markets: [...row.markets],
    contentLocales: [...row.languages],
    objective: row.objective ?? '',
    completenessScore:
      (REQUIRED_PROFILE_FIELDS.length - missing.length) / REQUIRED_PROFILE_FIELDS.length,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    missingFieldKeys: missing,
  };
}

/** Markdown, JSON and YAML exports of the same document. */
function renderMarkdown(plan: GrowthPlan): string {
  const lines: string[] = [`# Growth plan ${plan.id}`, ''];
  for (const section of GROWTH_PLAN_SECTIONS) {
    lines.push(`## ${section.replace(/_/g, ' ')}`, '');
    lines.push('```json', JSON.stringify(plan[section], null, 2), '```', '');
  }
  return lines.join('\n');
}

function renderYaml(value: unknown, indent = 0): string {
  const pad = ' '.repeat(indent);
  if (value === null || value === undefined) {
    return 'null';
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '[]';
    }
    return value
      .map((entry) => `\n${pad}- ${renderYaml(entry, indent + 2).replace(/^\s+/, '')}`)
      .join('');
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return '{}';
    }
    return entries
      .map(([key, entry]) => `\n${pad}${key}: ${renderYaml(entry, indent + 2)}`)
      .join('');
  }
  return JSON.stringify(value);
}

async function requirePlan(db: Db, planId: string): Promise<GrowthPlan> {
  const row = await db.growthPlan.findFirst({
    where: { id: planId },
    select: { id: true, sections: true },
  });
  if (row === null) {
    throw notFound('growth_plan', planId);
  }
  // The stored document is external data as far as this layer is concerned, so
  // it is parsed rather than trusted.
  const parsed = growthPlanSchema.safeParse(row.sections);
  if (!parsed.success) {
    throw invalid('errors.growth_plan_invalid', { planId });
  }
  return parsed.data;
}

export function createGrowthService(deps: ServiceDeps, content: ContentService): GrowthService {
  return {
    async upsertBusinessProfile(
      ctx: ActorContext,
      input: {
        profileId?: string;
        brandId: string;
        productName: string;
        siteUrl: string;
        description: string;
        category: string;
        markets?: readonly string[];
        contentLocales?: readonly string[];
        objective: string;
        conversionEvent?: string;
      },
    ): Promise<BusinessProfileView> {
      return authorized(
        deps,
        ctx,
        'growth.write',
        { brandId: input.brandId },
        async (db, actor) => {
          const existing =
            input.profileId === undefined
              ? await db.businessProfile.findFirst({
                  where: { brandId: input.brandId },
                  orderBy: { version: 'desc' },
                  select: PROFILE_SELECT,
                })
              : await db.businessProfile.findFirst({
                  where: { id: input.profileId },
                  select: PROFILE_SELECT,
                });

          const data = {
            brandId: input.brandId,
            productName: input.productName,
            productUrl: input.siteUrl,
            category: input.category,
            markets: [...(input.markets ?? [])],
            languages: [...(input.contentLocales ?? [])],
            objective: input.objective,
          };

          // A confirmed profile is never edited in place: a change produces a
          // new revision so a plan can name the revision it was built from.
          const row =
            existing === null || existing.confirmedAt !== null
              ? await db.businessProfile.create({
                  data: {
                    ...data,
                    workspaceId: actor.workspace.id,
                    version: (existing?.version ?? 0) + 1,
                  },
                  select: PROFILE_SELECT,
                })
              : await db.businessProfile.update({
                  where: { id: existing.id },
                  data,
                  select: PROFILE_SELECT,
                });

          await recordAudit(db, actor, {
            action: 'workspace.updated',
            targetType: 'business_profile',
            targetId: row.id,
            after: { revision: row.version, brandId: input.brandId },
          });

          return toProfileView(row);
        },
      );
    },

    async confirmBusinessProfile(
      ctx: ActorContext,
      profileId: string,
    ): Promise<BusinessProfileView> {
      return authorized(deps, ctx, 'growth.write', undefined, async (db, actor) => {
        const row = await db.businessProfile.findFirst({
          where: { id: profileId },
          select: PROFILE_SELECT,
        });
        if (row === null) {
          throw notFound('business_profile', profileId);
        }
        const missing = missingFieldKeys(row);
        if (missing.length > 0) {
          throw invalid('errors.growth_profile_incomplete', { missing: [...missing] });
        }
        const confirmed = await db.businessProfile.update({
          where: { id: profileId },
          data: { confirmedAt: deps.clock.now() },
          select: PROFILE_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'business_profile',
          targetId: profileId,
          after: { confirmed: true, revision: confirmed.version },
        });
        return toProfileView(confirmed);
      });
    },

    /** Asynchronous: generation runs in the worker under the AI guardrails. */
    async generatePlan(ctx: ActorContext, input: { profileId: string }): Promise<OperationRef> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'growth.generatePlan',
        body: input,
        run: async () =>
          authorized(deps, ctx, 'growth.write', undefined, async (db, actor) => {
            const profile = await db.businessProfile.findFirst({
              where: { id: input.profileId },
              select: PROFILE_SELECT,
            });
            if (profile === null) {
              throw notFound('business_profile', input.profileId);
            }
            // A plan is only ever built from a profile a human confirmed.
            if (profile.confirmedAt === null) {
              throw invalid('errors.growth_profile_unconfirmed', {
                profileId: input.profileId,
              });
            }
            if (!deps.ai.isAvailable()) {
              throw invalid('errors.ai_unavailable', {});
            }

            const operationId = newIdFor('operation');
            await recordAudit(db, actor, {
              action: 'workspace.updated',
              targetType: 'growth_plan_generation',
              targetId: operationId,
              after: { profileId: input.profileId, revision: profile.version },
            });

            return {
              operationId,
              status: 'queued',
              resourceType: 'growth_plan',
              resourceId: null,
              createdAt: deps.clock.now().toISOString(),
              completedAt: null,
              error: null,
            } satisfies OperationRef;
          }),
      });
    },

    async getPlan(ctx: ActorContext, planId: string): Promise<GrowthPlan> {
      return authorized(deps, ctx, 'growth.read', undefined, async (db) => requirePlan(db, planId));
    },

    async exportPlan(
      ctx: ActorContext,
      input: { planId: string; format: GrowthExportFormat },
    ): Promise<{ contentType: string; body: string }> {
      return authorized(deps, ctx, 'growth.export', undefined, async (db, actor) => {
        const plan = await requirePlan(db, input.planId);
        await recordAudit(db, actor, {
          action: 'data.exported',
          targetType: 'growth_plan',
          targetId: input.planId,
          after: { format: input.format },
        });
        switch (input.format) {
          case 'json':
            return {
              contentType: 'application/json',
              body: JSON.stringify(plan, null, 2),
            };
          case 'yaml':
            return {
              contentType: 'application/yaml',
              body: renderYaml(plan).replace(/^\n/, ''),
            };
          case 'markdown':
            return { contentType: 'text/markdown', body: renderMarkdown(plan) };
        }
      });
    },

    /** A plan item becomes a normal draft under the normal rules. */
    async createDraftFromItem(
      ctx: ActorContext,
      input: { planId: string; itemId: string },
    ): Promise<ContentItemView> {
      const slot = await authorized(deps, ctx, 'growth.read', undefined, async (db) => {
        const plan = await requirePlan(db, input.planId);
        const found = plan.calendar_proposal
          .flatMap((week) => week.slots)
          .find((entry) => entry.measurementTag === input.itemId);
        if (found === undefined) {
          throw notFound('growth_plan_item', input.itemId);
        }
        const planRow = await db.growthPlan.findFirst({
          where: { id: input.planId },
          select: { brandId: true },
        });
        if (planRow === null) {
          throw notFound('growth_plan', input.planId);
        }
        return { slot: found, brandId: planRow.brandId };
      });

      return content.createDraft(ctx, {
        brandId: slot.brandId,
        title: slot.slot.pillar,
        body: slot.slot.briefSummary,
        contentKind: slot.slot.contentKind,
        locale: slot.slot.locale,
        ...(slot.slot.connectionId === null
          ? {}
          : { targets: [{ connectionId: slot.slot.connectionId }] }),
      });
    },

    async proposeSlotFromItem(
      ctx: ActorContext,
      input: { planId: string; itemId: string },
    ): Promise<CalendarEntry> {
      return authorized(deps, ctx, 'growth.read', undefined, async (db, actor) => {
        const plan = await requirePlan(db, input.planId);
        const week = plan.calendar_proposal.find((entry) =>
          entry.slots.some((slot) => slot.measurementTag === input.itemId),
        );
        const slot = week?.slots.find((entry) => entry.measurementTag === input.itemId);
        if (slot === undefined) {
          throw notFound('growth_plan_item', input.itemId);
        }
        const planRow = await db.growthPlan.findFirst({
          where: { id: input.planId },
          select: { brandId: true },
        });
        if (planRow === null) {
          throw notFound('growth_plan', input.planId);
        }

        // A proposal, not a schedule. Nothing is created until the draft goes
        // through the publishing path.
        return {
          jobId: null,
          contentItemId: input.itemId,
          title: slot.pillar,
          brandId: planRow.brandId,
          campaignId: null,
          connectionId: slot.connectionId,
          provider: slot.provider,
          state: 'draft',
          instant: new Date(`${slot.date}T09:00:00.000Z`).toISOString(),
          ianaTimeZone: actor.workspace.defaultTimeZone,
          approvalRequired: slot.approvalRequired,
        };
      });
    },

    /** Only `active` catalog records are ever customer visible. */
    async listOpportunities(
      ctx: ActorContext,
      input: { category?: string; region?: string; verifiedAfter?: string } = {},
    ): Promise<readonly OpportunityRecord[]> {
      return authorized(deps, ctx, 'growth.read', undefined, async (db) => {
        // `category` names an opportunity kind in the catalog. An unrecognised
        // one is a bad request, not an empty catalog.
        const kind = input.category === undefined ? undefined : asOpportunityKind(input.category);
        if (input.category !== undefined && kind === undefined) {
          throw invalid('errors.unknown_opportunity_kind', { category: input.category });
        }
        const rows = await db.growthOpportunity.findMany({
          where: {
            state: 'active',
            ...(kind === undefined ? {} : { kind }),
            ...(input.region === undefined ? {} : { regions: { has: input.region } }),
            ...(input.verifiedAfter === undefined
              ? {}
              : { lastVerifiedAt: { gte: new Date(input.verifiedAfter) } }),
          },
          orderBy: { name: 'asc' },
          take: 100,
        });
        const records: OpportunityRecord[] = [];
        for (const row of rows) {
          const parsed = opportunityRecordSchema.safeParse(row);
          if (parsed.success) {
            records.push(parsed.data);
          }
        }
        return records;
      });
    },

    async listTools(
      ctx: ActorContext,
      input: { workflow?: string; verifiedAfter?: string } = {},
    ): Promise<readonly ToolRecord[]> {
      return authorized(deps, ctx, 'growth.read', undefined, async (db) => {
        const rows = await db.toolCatalogEntry.findMany({
          where: {
            state: 'active',
            ...(input.verifiedAfter === undefined
              ? {}
              : { lastVerifiedAt: { gte: new Date(input.verifiedAfter) } }),
          },
          orderBy: { name: 'asc' },
          take: 100,
        });
        const records: ToolRecord[] = [];
        for (const row of rows) {
          const parsed = toolRecordSchema.safeParse(row);
          if (
            parsed.success &&
            (input.workflow === undefined || parsed.data.workflows.includes(input.workflow))
          ) {
            records.push(parsed.data);
          }
        }
        return records;
      });
    },
  };
}
