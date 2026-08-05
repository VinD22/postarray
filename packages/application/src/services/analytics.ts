import type { MetricUnit, NormalizedMetricName, Paginated } from '@relay/contracts';

import type { ActorContext, AnalyticsService, PageQuery, ServiceDeps } from '../types.js';
import type {
  ComparisonReport,
  ComparisonRow,
  ExperimentView,
  MetricObservationView,
} from '../views.js';

import { recordAudit } from '../internal/audit.js';
import { notFound } from '../internal/errors.js';
import { decimalToNumber, toProviderId } from '../internal/mappers.js';
import { pageArgs, toPage } from '../internal/pagination.js';
import { authorized, type Db } from '../internal/runtime.js';

/**
 * Analytics.
 *
 * A metric we cannot read is `unavailable_*`, never `0`. The provider's own
 * field name and definition travel with every number, and a provider that
 * forbids deriving or combining its metrics is honoured: those rows are
 * excluded from comparison rather than quietly averaged.
 */

const OBSERVATION_SELECT = {
  id: true,
  observedAt: true,
  rawValue: true,
  normalizedValue: true,
  availability: true,
  provider: true,
  metricDefinition: {
    select: {
      providerFieldName: true,
      providerDefinition: true,
      normalizedName: true,
      unit: true,
      appliesToPost: true,
      derivationRestricted: true,
    },
  },
} as const;

interface ObservationRow {
  id: string;
  observedAt: Date;
  rawValue: { toString(): string } | null;
  normalizedValue: { toString(): string } | null;
  availability: string;
  provider: string;
  metricDefinition: {
    providerFieldName: string;
    providerDefinition: string;
    normalizedName: string;
    unit: string;
    appliesToPost: boolean;
    derivationRestricted: boolean;
  };
}

const AVAILABILITY_MAP: Readonly<Record<string, MetricObservationView['availability']>> = {
  available: 'available',
  unavailable: 'unavailable_provider',
  unsupported: 'unavailable_provider',
  requires_permission: 'unavailable_permission',
  restricted_by_provider: 'unavailable_provider',
};

function toObservationView(row: ObservationRow, now: Date): MetricObservationView {
  const availability = AVAILABILITY_MAP[row.availability] ?? 'unavailable_provider';
  const value = decimalToNumber(row.normalizedValue ?? row.rawValue);
  return {
    normalizedName: row.metricDefinition.normalizedName as NormalizedMetricName,
    provider: toProviderId(row.provider),
    providerField: row.metricDefinition.providerFieldName,
    providerDefinition: row.metricDefinition.providerDefinition,
    scope: row.metricDefinition.appliesToPost ? 'post' : 'account',
    // A missing reading is null with a reason. It is never rendered as zero.
    value: availability === 'available' ? value : null,
    unit: row.metricDefinition.unit as MetricUnit,
    availability,
    observedAt: row.observedAt.toISOString(),
    freshnessSeconds: Math.max(0, Math.round((now.getTime() - row.observedAt.getTime()) / 1000)),
    derivationRestricted: row.metricDefinition.derivationRestricted,
  };
}

function median(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[middle] ?? null;
  }
  const low = sorted[middle - 1];
  const high = sorted[middle];
  return low === undefined || high === undefined ? null : (low + high) / 2;
}

async function observationsFor(db: Db, where: Record<string, unknown>): Promise<ObservationRow[]> {
  return db.metricObservation.findMany({
    where,
    orderBy: { observedAt: 'desc' },
    take: 500,
    select: OBSERVATION_SELECT,
  });
}

export function createAnalyticsService(deps: ServiceDeps): AnalyticsService {
  return {
    async getPostMetrics(
      ctx: ActorContext,
      input: { receiptId: string },
    ): Promise<readonly MetricObservationView[]> {
      return authorized(deps, ctx, 'analytics.read', undefined, async (db) => {
        const receipt = await db.publicationReceipt.findFirst({
          where: { id: input.receiptId },
          select: { id: true },
        });
        if (receipt === null) {
          throw notFound('publication_receipt', input.receiptId);
        }
        const rows = await observationsFor(db, { receiptId: input.receiptId });
        const now = deps.clock.now();
        return rows.map((row) => toObservationView(row, now));
      });
    },

    async getAccountMetrics(
      ctx: ActorContext,
      input: { connectionId: string; range: { from: string; to: string } },
    ): Promise<readonly MetricObservationView[]> {
      return authorized(
        deps,
        ctx,
        'analytics.read',
        { connectionId: input.connectionId },
        async (db) => {
          const rows = await observationsFor(db, {
            connectionId: input.connectionId,
            observedAt: { gte: new Date(input.range.from), lte: new Date(input.range.to) },
          });
          const now = deps.clock.now();
          return rows.map((row) => toObservationView(row, now));
        },
      );
    },

    /**
     * A comparison against the account's own trailing baseline, never against a
     * global benchmark nobody can inspect. Sample size and every comparability
     * caveat travel with the report; association is not reported as causation.
     */
    async compare(
      ctx: ActorContext,
      input: {
        receiptIds?: readonly string[];
        period?: { from: string; to: string };
        baseline: 'trailing_median' | 'previous_period';
        connectionId?: string;
      },
    ): Promise<ComparisonReport> {
      return authorized(deps, ctx, 'analytics.read', undefined, async (db) => {
        const now = deps.clock.now();
        const caveatKeys: string[] = [];

        const subjectWhere: Record<string, unknown> =
          input.receiptIds !== undefined && input.receiptIds.length > 0
            ? { receiptId: { in: [...input.receiptIds] } }
            : {
                ...(input.connectionId === undefined ? {} : { connectionId: input.connectionId }),
                ...(input.period === undefined
                  ? {}
                  : {
                      observedAt: {
                        gte: new Date(input.period.from),
                        lte: new Date(input.period.to),
                      },
                    }),
              };

        const subjectRows = await observationsFor(db, subjectWhere);

        const baselineWindowStart =
          input.period === undefined
            ? new Date(now.getTime() - 90 * 86_400_000)
            : new Date(
                new Date(input.period.from).getTime() -
                  (new Date(input.period.to).getTime() - new Date(input.period.from).getTime()),
              );
        const baselineRows = await observationsFor(db, {
          ...(input.connectionId === undefined ? {} : { connectionId: input.connectionId }),
          observedAt: {
            gte: baselineWindowStart,
            lt: input.period === undefined ? now : new Date(input.period.from),
          },
        });

        const subject = groupByMetric(subjectRows, now);
        const baseline = groupByMetric(baselineRows, now);

        if (subjectRows.length < 5) {
          caveatKeys.push('analytics.caveat.small_sample');
        }
        if (baselineRows.length === 0) {
          caveatKeys.push('analytics.caveat.no_baseline');
        }

        const names = new Set([...subject.keys(), ...baseline.keys()]);
        const rows: ComparisonRow[] = [];

        for (const name of names) {
          const subjectEntry = subject.get(name);
          const baselineEntry = baseline.get(name);
          const restricted =
            subjectEntry?.derivationRestricted === true ||
            baselineEntry?.derivationRestricted === true;
          const subjectValue = restricted ? null : median(subjectEntry?.values ?? []);
          const baselineValue = restricted ? null : median(baselineEntry?.values ?? []);
          rows.push({
            normalizedName: name,
            unit: subjectEntry?.unit ?? baselineEntry?.unit ?? 'count',
            subject: subjectValue,
            baseline: baselineValue,
            deltaPercent:
              subjectValue === null || baselineValue === null || baselineValue === 0
                ? null
                : ((subjectValue - baselineValue) / baselineValue) * 100,
            availability:
              subjectEntry === undefined || subjectEntry.values.length === 0
                ? 'unavailable_provider'
                : 'available',
            comparable: !restricted,
            caveatKeys: restricted ? ['analytics.caveat.derivation_restricted'] : [],
          });
        }

        return {
          subjectLabel:
            input.receiptIds !== undefined
              ? 'analytics.label.selected_posts'
              : 'analytics.label.period',
          baselineLabel:
            input.baseline === 'trailing_median'
              ? 'analytics.label.trailing_median'
              : 'analytics.label.previous_period',
          sampleSize: subjectRows.length,
          rows,
          caveatKeys,
        };
      });
    },

    async listExperiments(
      ctx: ActorContext,
      query: PageQuery = {},
    ): Promise<Paginated<ExperimentView>> {
      return authorized(deps, ctx, 'analytics.read', undefined, async (db) => {
        const args = pageArgs(query);
        const rows = await db.experiment.findMany({
          orderBy: { id: 'desc' },
          take: args.take,
          skip: args.skip,
          ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
          select: {
            id: true,
            name: true,
            hypothesis: true,
            successMetric: true,
            state: true,
            windowStart: true,
            windowEnd: true,
            caveats: true,
            conclusion: true,
          },
        });
        return toPage(
          rows,
          args,
          (row) => row.id,
          (row): ExperimentView => ({
            id: row.id,
            name: row.name,
            hypothesis: row.hypothesis,
            successMetric: row.successMetric,
            state: row.state,
            windowStart: row.windowStart.toISOString(),
            windowEnd: row.windowEnd.toISOString(),
            caveats: row.caveats,
            conclusion: row.conclusion,
          }),
        );
      });
    },

    /** Tagged before publishing, so the analysis is not entirely post hoc. */
    async createExperiment(
      ctx: ActorContext,
      input: {
        name: string;
        hypothesis: string;
        successMetric: string;
        windowStart: string;
        windowEnd: string;
        campaignId?: string | null;
      },
    ): Promise<ExperimentView> {
      return authorized(deps, ctx, 'experiment.write', undefined, async (db, actor) => {
        if (actor.userId === null) {
          throw notFound('user', ctx.actorId);
        }
        const created = await db.experiment.create({
          data: {
            workspaceId: actor.workspace.id,
            name: input.name,
            hypothesis: input.hypothesis,
            successMetric: input.successMetric,
            windowStart: new Date(input.windowStart),
            windowEnd: new Date(input.windowEnd),
            campaignId: input.campaignId ?? null,
            state: 'planned',
            createdByUserId: actor.userId,
          },
          select: {
            id: true,
            name: true,
            hypothesis: true,
            successMetric: true,
            state: true,
            windowStart: true,
            windowEnd: true,
            caveats: true,
            conclusion: true,
          },
        });
        await recordAudit(db, actor, {
          action: 'workspace.updated',
          targetType: 'experiment',
          targetId: created.id,
          after: { name: created.name, successMetric: created.successMetric },
        });
        return {
          id: created.id,
          name: created.name,
          hypothesis: created.hypothesis,
          successMetric: created.successMetric,
          state: created.state,
          windowStart: created.windowStart.toISOString(),
          windowEnd: created.windowEnd.toISOString(),
          caveats: created.caveats,
          conclusion: created.conclusion,
        };
      });
    },
  };
}

interface MetricGroup {
  readonly values: number[];
  readonly unit: MetricUnit;
  readonly derivationRestricted: boolean;
}

function groupByMetric(
  rows: readonly ObservationRow[],
  now: Date,
): Map<NormalizedMetricName, MetricGroup> {
  const groups = new Map<NormalizedMetricName, MetricGroup>();
  for (const row of rows) {
    const view = toObservationView(row, now);
    const existing = groups.get(view.normalizedName) ?? {
      values: [],
      unit: view.unit,
      derivationRestricted: view.derivationRestricted,
    };
    if (view.value !== null) {
      existing.values.push(view.value);
    }
    groups.set(view.normalizedName, {
      values: existing.values,
      unit: existing.unit,
      derivationRestricted: existing.derivationRestricted || view.derivationRestricted,
    });
  }
  return groups;
}
