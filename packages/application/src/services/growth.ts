import {
  GROWTH_PLAN_SECTIONS,
  CapabilityNotImplementedError,
  assumptionSchema,
  factSchema,
  growthPlanSchema,
  opportunityRecordSchema,
  providerIdSchema,
  toolRecordSchema,
  type GrowthExportFormat,
  type GrowthPlan,
  type OperationRef,
  type OpportunityRecord,
  type ToolRecord,
} from '@relay/contracts';
import { z } from 'zod';

import type { ActorContext, ContentService, GrowthService, ServiceDeps } from '../types';
import type {
  BusinessProfileView,
  CalendarEntry,
  ContentItemView,
  GrowthPlanSummaryView,
} from '../views';

import { recordAudit } from '../internal/audit';
import { invalid, notFound } from '../internal/errors';
import { withIdempotency } from '../internal/idempotency';
import { toJson } from '../internal/json';
import { toProviderId } from '../internal/mappers';
import { authorized, type Db } from '../internal/runtime';
import { asOpportunityKind } from '../internal/storage-enums';

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
  description: true,
  markets: true,
  languages: true,
  idealCustomer: true,
  objective: true,
  conversionEvent: true,
  existingChannels: true,
  proofAssets: true,
  competitors: true,
  weeklyCapacityHours: true,
  prohibitedClaims: true,
  prohibitedTopics: true,
  provenClaims: true,
  assumptions: true,
  completenessScore: true,
  confirmedAt: true,
  createdAt: true,
} as const;

interface ProfileRow {
  id: string;
  workspaceId: string;
  brandId: string;
  version: number;
  productName: string | null;
  /** Stored as `product_url`. The view calls it `siteUrl`. */
  productUrl: string | null;
  description: string | null;
  category: string | null;
  markets: string[];
  /** Stored as `languages`. The view calls it `contentLocales`. */
  languages: string[];
  idealCustomer: string | null;
  objective: string | null;
  conversionEvent: string | null;
  existingChannels: unknown;
  proofAssets: string[];
  competitors: unknown;
  weeklyCapacityHours: number | null;
  prohibitedClaims: string[];
  prohibitedTopics: string[];
  provenClaims: unknown;
  assumptions: unknown;
  completenessScore: unknown;
  confirmedAt: Date | null;
  createdAt: Date;
}

const REQUIRED_PROFILE_FIELDS = [
  'productName',
  'description',
  'objective',
  'conversionEvent',
  'contentLocales',
] as const;

const factListSchema = z.array(factSchema);
const assumptionListSchema = z.array(assumptionSchema);
const providerListSchema = z.array(providerIdSchema);
const stringListSchema = z.array(z.string());

function parsedOr<T>(schema: z.ZodType<T>, value: unknown, fallback: T): T {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : fallback;
}

function missingFieldKeys(row: ProfileRow): readonly string[] {
  const missing: string[] = [];
  if (row.productName === null || row.productName === '') {
    missing.push('growth.profile.product_name');
  }
  if (row.description === null || row.description === '') {
    missing.push('growth.profile.description');
  }
  if (row.objective === null || row.objective === '') {
    missing.push('growth.profile.objective');
  }
  if (row.conversionEvent === null || row.conversionEvent === '') {
    missing.push('growth.profile.conversion_event');
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
    description: row.description ?? '',
    category: row.category ?? '',
    markets: [...row.markets],
    contentLocales: [...row.languages],
    idealCustomer: row.idealCustomer ?? '',
    objective: row.objective ?? '',
    conversionEvent: row.conversionEvent ?? '',
    existingChannels: parsedOr(providerListSchema, row.existingChannels, []),
    proofAssets: [...row.proofAssets],
    competitors: parsedOr(stringListSchema, row.competitors, []),
    weeklyCapacityHours: row.weeklyCapacityHours,
    prohibitedClaims: [...row.prohibitedClaims],
    prohibitedTopics: [...row.prohibitedTopics],
    facts: parsedOr(factListSchema, row.provenClaims, []),
    assumptions: parsedOr(assumptionListSchema, row.assumptions, []),
    completenessScore:
      (REQUIRED_PROFILE_FIELDS.length - missing.length) / REQUIRED_PROFILE_FIELDS.length,
    confirmedAt: row.confirmedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
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

function weekAt(plan: GrowthPlan, now: Date): number | null {
  const date = now.toISOString().slice(0, 10);
  const week = plan.calendar_proposal.find((entry) => {
    const start = new Date(`${entry.startDate}T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    return date >= entry.startDate && date < end.toISOString().slice(0, 10);
  });
  return week?.weekNumber ?? null;
}

export function createGrowthService(deps: ServiceDeps, content: ContentService): GrowthService {
  return {
    async getBusinessProfile(ctx: ActorContext): Promise<BusinessProfileView | null> {
      return authorized(deps, ctx, 'growth.read', undefined, async (db) => {
        const row = await db.businessProfile.findFirst({
          orderBy: [{ createdAt: 'desc' }, { version: 'desc' }],
          select: PROFILE_SELECT,
        });
        return row === null ? null : toProfileView(row);
      });
    },

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
        idealCustomer?: string;
        objective: string;
        conversionEvent?: string;
        existingChannels?: readonly string[];
        proofAssets?: readonly string[];
        competitors?: readonly string[];
        weeklyCapacityHours?: number;
        prohibitedClaims?: readonly string[];
        prohibitedTopics?: readonly string[];
      },
    ): Promise<BusinessProfileView> {
      return withIdempotency(
        deps.kv,
        ctx,
        {
          operation: 'growth.upsertBusinessProfile',
          body: input,
          resourceIdOf: (profile) => profile.id,
          run: () =>
            authorized(
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
            description: input.description,
            category: input.category,
            markets: [...(input.markets ?? [])],
            languages: [...(input.contentLocales ?? [])],
            idealCustomer: input.idealCustomer ?? null,
            objective: input.objective,
            conversionEvent: input.conversionEvent ?? null,
            proofAssets: [...(input.proofAssets ?? [])],
            competitors: toJson([...(input.competitors ?? [])]),
            weeklyCapacityHours: input.weeklyCapacityHours ?? null,
            prohibitedClaims: [...(input.prohibitedClaims ?? [])],
            prohibitedTopics: [...(input.prohibitedTopics ?? [])],
            completenessScore: Math.round(
              (100 *
                [
                  input.productName,
                  input.description,
                  input.objective,
                  input.conversionEvent ?? '',
                  (input.contentLocales ?? []).join(','),
                ].filter((value) => value.trim() !== '').length) /
                REQUIRED_PROFILE_FIELDS.length,
            ),
          };

          const selectedConnections =
            input.existingChannels === undefined || input.existingChannels.length === 0
              ? []
              : await db.socialConnection.findMany({
                  where: { id: { in: [...input.existingChannels] } },
                  select: { provider: true },
                });
          const existingChannels = [
            ...new Set(selectedConnections.map((connection) => toProviderId(connection.provider))),
          ];

          // A confirmed profile is never edited in place: a change produces a
          // new revision so a plan can name the revision it was built from.
          const row =
            existing === null || existing.confirmedAt !== null
              ? await db.businessProfile.create({
                  data: {
                    ...data,
                    existingChannels: toJson(existingChannels),
                    workspaceId: actor.workspace.id,
                    version: (existing?.version ?? 0) + 1,
                  },
                  select: PROFILE_SELECT,
                })
              : await db.businessProfile.update({
                  where: { id: existing.id },
                  data: { ...data, existingChannels: toJson(existingChannels) },
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
            ),
        },
        deps.clock,
      );
    },

    async confirmBusinessProfile(
      ctx: ActorContext,
      input: {
        profileId: string;
        confirmedAssumptionIds?: readonly string[];
        corrections?: Readonly<Record<string, string>>;
      },
    ): Promise<BusinessProfileView> {
      return withIdempotency(deps.kv, ctx, {
        operation: 'growth.confirmBusinessProfile',
        body: input,
        resourceIdOf: (profile) => profile.id,
        run: () => authorized(deps, ctx, 'growth.write', undefined, async (db, actor) => {
        const row = await db.businessProfile.findFirst({
          where: { id: input.profileId },
          select: PROFILE_SELECT,
        });
        if (row === null) {
          throw notFound('business_profile', input.profileId);
        }
        const missing = missingFieldKeys(row);
        if (missing.length > 0) {
          throw invalid('errors.growth_profile_incomplete', { missing: [...missing] });
        }
        const confirmedIds = new Set(input.confirmedAssumptionIds ?? []);
        const corrections = input.corrections ?? {};
        const assumptions = parsedOr(assumptionListSchema, row.assumptions, []);
        const facts = parsedOr(factListSchema, row.provenClaims, []);
        const assumptionIds = new Set(assumptions.map((assumption) => assumption.id));
        const unknownIds = [...confirmedIds, ...Object.keys(corrections)].filter(
          (id) => !assumptionIds.has(id),
        );
        if (unknownIds.length > 0) {
          throw invalid('errors.growth_assumption_not_found', { ids: [...new Set(unknownIds)] });
        }
        const promoted = assumptions
          .filter((assumption) => confirmedIds.has(assumption.id))
          .map((assumption) => ({
            id: assumption.id,
            statement: corrections[assumption.id] ?? assumption.statement,
            evidenceIds: [`profile.assumption.${assumption.id}`],
            confirmedByUser: true as const,
          }));
        const remaining = assumptions
          .filter((assumption) => !confirmedIds.has(assumption.id))
          .map((assumption) => ({
            ...assumption,
            statement: corrections[assumption.id] ?? assumption.statement,
          }));
        const confirmed = await db.businessProfile.update({
          where: { id: input.profileId },
          data: {
            confirmedAt: deps.clock.now(),
            ...(actor.userId === null ? {} : { confirmedByUserId: actor.userId }),
            provenClaims: toJson([...facts, ...promoted]),
            assumptions: toJson(remaining),
          },
          select: PROFILE_SELECT,
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'business_profile',
          targetId: input.profileId,
          after: { confirmed: true, revision: confirmed.version },
        });
          return toProfileView(confirmed);
        }),
      }, deps.clock);
    },

    /**
     * Generation stays explicitly unavailable until a durable worker workflow
     * can persist an operation and its terminal result. Returning a queued
     * handle without that workflow would strand the user indefinitely.
     */
    async generatePlan(ctx: ActorContext, input: { profileId: string }): Promise<OperationRef> {
      return authorized(deps, ctx, 'growth.write', undefined, async (db) => {
        const profile = await db.businessProfile.findFirst({
          where: { id: input.profileId },
          select: PROFILE_SELECT,
        });
        if (profile === null) {
          throw notFound('business_profile', input.profileId);
        }
        if (profile.confirmedAt === null) {
          throw invalid('errors.growth_profile_unconfirmed', { profileId: input.profileId });
        }
        throw new CapabilityNotImplementedError({
          details: { provider: 'Growth Advisor', capability: 'plan_generation' },
        });
      });
    },

    async getPlan(ctx: ActorContext, planId: string): Promise<GrowthPlan> {
      return authorized(deps, ctx, 'growth.read', undefined, async (db) => requirePlan(db, planId));
    },

    async getCurrentPlan(ctx: ActorContext): Promise<GrowthPlan | null> {
      return authorized(deps, ctx, 'growth.read', undefined, async (db) => {
        const row = await db.growthPlan.findFirst({
          where: { state: { in: ['draft', 'approved'] } },
          orderBy: [{ createdAt: 'desc' }, { version: 'desc' }],
          select: { id: true },
        });
        return row === null ? null : requirePlan(db, row.id);
      });
    },

    async getPlanSummary(ctx: ActorContext): Promise<GrowthPlanSummaryView> {
      return authorized(deps, ctx, 'growth.read', undefined, async (db) => {
        const [profile, row] = await Promise.all([
          db.businessProfile.findFirst({
            orderBy: [{ createdAt: 'desc' }, { version: 'desc' }],
            select: PROFILE_SELECT,
          }),
          db.growthPlan.findFirst({
            where: { state: 'approved', approvedAt: { not: null } },
            orderBy: [{ approvedAt: 'desc' }, { version: 'desc' }],
            select: { id: true, version: true, approvedAt: true },
          }),
        ]);
        const profileComplete =
          profile !== null && profile.confirmedAt !== null && missingFieldKeys(profile).length === 0;
        if (row === null || row.approvedAt === null) {
          return {
            planId: null,
            version: null,
            approvedAt: null,
            currentWeek: null,
            totalWeeks: null,
            undraftedBriefCount: null,
            profileComplete,
          };
        }
        const plan = await requirePlan(db, row.id);
        return {
          planId: row.id,
          version: row.version,
          approvedAt: row.approvedAt.toISOString(),
          currentWeek: weekAt(plan, deps.clock.now()),
          totalWeeks: plan.calendar_proposal.length,
          undraftedBriefCount: null,
          profileComplete,
        };
      });
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
          accountLabel: null,
          contentKind: slot.contentKind,
          state: 'draft',
          instant: new Date(`${slot.date}T09:00:00.000Z`).toISOString(),
          ianaTimeZone: actor.workspace.defaultTimeZone,
          approvalRequired: slot.approvalRequired,
          approvalState: slot.approvalRequired ? 'requested' : 'not_required',
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
