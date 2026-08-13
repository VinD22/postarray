import { mappingForMetric } from '@relay/analytics-domain';
import { computeFreshness } from '@relay/analytics-domain';
import type {
  MetricAvailability,
  MetricObservation,
  MetricScope,
  MetricUnit,
} from '@relay/contracts';

import type {
  ActorContext,
  ServiceDeps,
  WorkerActivityContext,
  WorkerAnalyticsService,
} from '../types';

import { notFound } from '../internal/errors';
import { decimalToNumber, toProviderId } from '../internal/mappers';
import { runInWorkspace, type Db } from '../internal/runtime';

/**
 * Analytics persistence for the worker.
 *
 * The gateway has already decided what each number means. This service only
 * writes it down, and it writes the readings we could not take as well as the
 * ones we could: a metric the provider did not return is stored with a null
 * value and an explicit availability, never as a zero, because a zero here
 * would be indistinguishable from a real zero on every screen downstream.
 */

function context(ctx: WorkerActivityContext): ActorContext {
  return { ...ctx, scopes: [] };
}

/** Contract availability onto the stored enum. Both keep "not read" distinct. */
// `satisfies` rather than an annotation: the annotation is what keeps every
// contract availability mapped, but it also widens the values to `string`, and
// the column is an enum. This keeps the exhaustiveness check and the literals.
const STORED_AVAILABILITY = Object.freeze({
  available: 'available',
  unavailable_provider: 'unsupported',
  unavailable_permission: 'requires_permission',
  unavailable_pending: 'unavailable',
  unavailable_stale: 'unavailable',
} as const) satisfies Readonly<Record<MetricAvailability, string>>;

/** The contract calls it `percent`; the column calls it `percentage`. */
const STORED_UNIT = Object.freeze({
  count: 'count',
  ratio: 'ratio',
  seconds: 'seconds',
  percent: 'percentage',
  currency_minor: 'currency_minor',
} as const) satisfies Readonly<Record<MetricUnit, string>>;

/**
 * The catalog wording for a metric we have not mapped in the registry yet.
 *
 * It says exactly what we know, which is the provider's own field name, and
 * says out loud that it has not been checked against provider documentation.
 * Inventing a definition would be the same lie as inventing a number.
 */
function unverifiedDefinition(provider: string, providerField: string): string {
  return `Reported by ${provider} as "${providerField}". Not yet verified against provider documentation.`;
}

/**
 * Resolve the catalog row for one reading, creating it when this is the first
 * time we have seen the metric. The catalog is global rather than tenant owned,
 * so two workspaces reading the same provider share one definition.
 */
async function definitionIdFor(
  db: Db,
  observation: MetricObservation,
  scope: MetricScope,
): Promise<string> {
  const mapping = mappingForMetric(observation.provider, scope, observation.normalizedName);
  const providerDefinition =
    mapping === null
      ? unverifiedDefinition(observation.provider, observation.providerField)
      : mapping.definition.definition;
  const row = await db.metricDefinition.upsert({
    where: {
      provider_providerFieldName: {
        provider: observation.provider,
        providerFieldName: observation.providerField,
      },
    },
    create: {
      provider: observation.provider,
      providerFieldName: observation.providerField,
      providerDefinition,
      normalizedName: observation.normalizedName,
      unit: STORED_UNIT[observation.unit],
      availability: STORED_AVAILABILITY[observation.availability],
      appliesToPost: scope === 'post',
      appliesToAccount: scope === 'account',
      ...(mapping === null ? {} : { lastVerifiedAt: new Date(mapping.definition.lastVerifiedAt) }),
    },
    update: {},
    select: { id: true },
  });
  return row.id;
}

interface FreshnessRow {
  readonly receiptId: string | null;
  readonly observedAt: Date;
  readonly availability: string;
  readonly provider: string;
  readonly normalizedValue: { toString(): string } | null;
  readonly rawValue: { toString(): string } | null;
  readonly metricDefinition: {
    readonly normalizedName: string;
    readonly providerFieldName: string;
    readonly unit: string;
    readonly appliesToPost: boolean;
  };
}

/**
 * Rebuild the domain observation from a stored row so freshness is computed by
 * the same code the UI uses, rather than by a second date comparison here.
 */
function toDomainObservation(row: FreshnessRow): MetricObservation {
  const available = row.availability === 'available';
  return {
    normalizedName: row.metricDefinition.normalizedName as MetricObservation['normalizedName'],
    provider: toProviderId(row.provider),
    providerField: row.metricDefinition.providerFieldName,
    scope: row.metricDefinition.appliesToPost ? 'post' : 'account',
    value: available ? decimalToNumber(row.normalizedValue ?? row.rawValue) : null,
    unit:
      row.metricDefinition.unit === 'percentage'
        ? 'percent'
        : (row.metricDefinition.unit as MetricUnit),
    denominator: 'none',
    availability: available ? 'available' : 'unavailable_stale',
    observedAt: row.observedAt.toISOString(),
    freshnessSeconds: 0,
    rawProviderPayloadHash: '0'.repeat(64),
  };
}

export function createWorkerAnalyticsService(deps: ServiceDeps): WorkerAnalyticsService {
  return {
    async writeObservations(input) {
      if (input.observations.length === 0) {
        return { observedCount: 0, unavailableCount: 0 };
      }
      return runInWorkspace(deps, context(input.ctx), async (db) => {
        const connection = await db.socialConnection.findFirst({
          where: { id: input.connectionId, workspaceId: input.ctx.workspaceId },
          select: { id: true, provider: true },
        });
        if (connection === null) {
          throw notFound('connection', input.connectionId, input.ctx.correlationId);
        }
        const receipt =
          input.receiptId === null
            ? null
            : await db.publicationReceipt.findFirst({
                where: { id: input.receiptId, workspaceId: input.ctx.workspaceId },
                select: { id: true, externalPostId: true },
              });
        if (input.receiptId !== null && receipt === null) {
          throw notFound('publication_receipt', input.receiptId, input.ctx.correlationId);
        }

        let observedCount = 0;
        for (const observation of input.observations) {
          const metricDefinitionId = await definitionIdFor(db, observation, input.scope);
          const data = {
            workspaceId: input.ctx.workspaceId,
            metricDefinitionId,
            receiptId: receipt?.id ?? null,
            connectionId: connection.id,
            provider: observation.provider,
            externalPostId: receipt?.externalPostId ?? null,
            observedAt: new Date(observation.observedAt),
            // A reading we could not take is null with a reason. Never zero.
            rawValue: observation.value,
            normalizedValue: observation.value,
            availability: STORED_AVAILABILITY[observation.availability],
            unavailableReason:
              observation.availability === 'available' ? null : observation.availability,
            sourceResponseHash: observation.rawProviderPayloadHash,
          };
          if (receipt === null) {
            await db.metricObservation.create({ data });
          } else {
            // One reading per receipt, metric and instant, so a retried activity
            // rewrites its own row instead of doubling the history.
            await db.metricObservation.upsert({
              where: {
                receiptId_metricDefinitionId_observedAt: {
                  receiptId: receipt.id,
                  metricDefinitionId,
                  observedAt: data.observedAt,
                },
              },
              create: data,
              update: {
                rawValue: data.rawValue,
                normalizedValue: data.normalizedValue,
                availability: data.availability,
                unavailableReason: data.unavailableReason,
                sourceResponseHash: data.sourceResponseHash,
              },
            });
          }
          if (observation.availability === 'available') {
            observedCount += 1;
          }
        }
        return {
          observedCount,
          unavailableCount: input.observations.length - observedCount,
        };
      });
    },

    async recordAnalyticsRun(input) {
      await runInWorkspace(deps, context(input.ctx), async (db) => {
        const connection = await db.socialConnection.findFirst({
          where: { id: input.connectionId, workspaceId: input.ctx.workspaceId },
          select: { id: true, provider: true },
        });
        if (connection === null) {
          throw notFound('connection', input.connectionId, input.ctx.correlationId);
        }
        const startedAt = new Date(input.startedAt);
        const finishedAt = new Date(input.finishedAt);
        await db.analyticsSyncRun.create({
          data: {
            workspaceId: input.ctx.workspaceId,
            connectionId: connection.id,
            provider: connection.provider,
            state: input.errorCode === null ? 'succeeded' : 'failed',
            scope: input.observedCount + input.unavailableCount === 0 ? 'account' : 'post',
            windowStart: startedAt,
            windowEnd: finishedAt,
            observationsWritten: input.observedCount,
            errorCode: input.errorCode,
            startedAt,
            endedAt: finishedAt,
          },
        });

        // Freshness is user visible: every number in this product is displayed
        // with how stale it is, so the run is not finished until the receipts it
        // touched carry the instant their readings were actually taken.
        const rows = await db.metricObservation.findMany({
          where: {
            connectionId: connection.id,
            observedAt: { gte: startedAt },
            receiptId: { not: null },
          },
          take: 500,
          select: {
            receiptId: true,
            observedAt: true,
            availability: true,
            provider: true,
            normalizedValue: true,
            rawValue: true,
            metricDefinition: {
              select: {
                normalizedName: true,
                providerFieldName: true,
                unit: true,
                appliesToPost: true,
              },
            },
          },
        });
        const freshness = computeFreshness({
          observations: rows.map((row) => toDomainObservation(row)),
          now: deps.clock.now(),
        });
        if (freshness.lastObservedAt === null) {
          // Nothing was read, so nothing is claimed. The receipt keeps saying it
          // has never synced rather than borrowing this run's clock.
          return;
        }
        const receiptIds = [
          ...new Set(
            rows
              .map((row) => row.receiptId)
              .filter((receiptId): receiptId is string => receiptId !== null),
          ),
        ];
        await db.publicationReceipt.updateMany({
          where: { id: { in: receiptIds }, workspaceId: input.ctx.workspaceId },
          data: { lastAnalyticsSyncAt: new Date(freshness.lastObservedAt) },
        });
      });
    },
  };
}
