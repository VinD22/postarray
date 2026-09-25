import type { NormalizedMetricName } from '@relay/contracts';

import type { ActorContext, ServiceDeps } from '../types';
import { notFound } from '../internal/errors';
import { decimalToNumber, toProviderId } from '../internal/mappers';
import { authorized } from '../internal/runtime';
import { BEST_TIME_MINIMUM_TOTAL, findBestBand } from './ai-suggestions-best-time';
import type { BestTimeReading } from './ai-suggestions-best-time';
import { bestTimeRequestSchema } from './ai-suggestions-types';
import type { BestTimeView } from './ai-suggestions-types';

/**
 * Reads one account's own post readings for the posting time hint. The
 * statistics live in `ai-suggestions-best-time.ts`; this file only loads rows.
 */

const BEST_TIME_READINGS = 2000;
const BEST_TIME_METRICS: readonly NormalizedMetricName[] = ['impressions', 'reach', 'views'];

export const BEST_TIME_REASON_KEYS = {
  smallSample: 'web.suggest.bestTime.smallSample',
  noDifference: 'web.suggest.bestTime.noDifference',
  noMetric: 'web.suggest.bestTime.noMetric',
} as const;

export async function readBestTime(
  deps: ServiceDeps,
  ctx: ActorContext,
  rawInput: unknown,
): Promise<BestTimeView> {
  const input = bestTimeRequestSchema.parse(rawInput);
  return authorized(deps, ctx, 'analytics.read', undefined, async (db, actor) => {
    const connection = await db.socialConnection.findFirst({
      where: { id: input.connectionId, workspaceId: ctx.workspaceId },
      select: { id: true, provider: true },
    });
    if (connection === null) {
      throw notFound('connection', input.connectionId);
    }
    const timeZone = actor.workspace.defaultTimeZone;

    let best: { metric: NormalizedMetricName; readings: BestTimeReading[] } | null = null;
    for (const metric of BEST_TIME_METRICS) {
      const rows = await db.metricObservation.findMany({
        where: {
          workspaceId: ctx.workspaceId,
          connectionId: connection.id,
          receiptId: { not: null },
          metricDefinition: { normalizedName: metric },
        },
        orderBy: { observedAt: 'desc' },
        take: BEST_TIME_READINGS,
        select: {
          receiptId: true,
          availability: true,
          normalizedValue: true,
          rawValue: true,
          receipt: { select: { publishedAt: true } },
        },
      });
      // Latest reading per post. An unavailable reading stays null.
      const byReceipt = new Map<string, BestTimeReading>();
      for (const row of rows) {
        if (row.receiptId === null || row.receipt === null || byReceipt.has(row.receiptId)) {
          continue;
        }
        byReceipt.set(row.receiptId, {
          publishedAt: row.receipt.publishedAt,
          value:
            row.availability === 'available'
              ? decimalToNumber(row.normalizedValue ?? row.rawValue)
              : null,
        });
      }
      const readings = [...byReceipt.values()];
      const usable = readings.filter((entry) => entry.value !== null).length;
      if (best === null || usable > best.readings.filter((e) => e.value !== null).length) {
        best = { metric, readings };
      }
      if (usable >= BEST_TIME_MINIMUM_TOTAL) {
        break;
      }
    }

    if (best === null || best.readings.length === 0) {
      return {
        status: 'unavailable',
        connectionId: connection.id,
        reasonKey: BEST_TIME_REASON_KEYS.noMetric,
        totalSampleSize: 0,
        minimumSample: BEST_TIME_MINIMUM_TOTAL,
      };
    }

    const result = findBestBand(best.readings, timeZone);
    if (result.outcome !== 'found') {
      return {
        status: 'unavailable',
        connectionId: connection.id,
        reasonKey:
          result.outcome === 'insufficient_history'
            ? BEST_TIME_REASON_KEYS.smallSample
            : BEST_TIME_REASON_KEYS.noDifference,
        totalSampleSize: result.totalSampleSize,
        minimumSample: BEST_TIME_MINIMUM_TOTAL,
      };
    }
    return {
      status: 'available',
      connectionId: connection.id,
      provider: toProviderId(connection.provider),
      metric: best.metric,
      timeZone,
      startHour: result.startHour,
      endHour: result.endHour,
      ratio: result.ratio,
      bandSampleSize: result.bandSampleSize,
      totalSampleSize: result.totalSampleSize,
    };
  });
}
