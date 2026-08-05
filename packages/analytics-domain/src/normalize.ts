import { metricObservationSchema } from '@relay/contracts';
import type {
  MetricObservation,
  MetricScope,
  NormalizedMetricName,
  ProviderId,
} from '@relay/contracts';

import { mappingsFor } from './registry.js';
import { UNAVAILABLE_REASON_KEYS } from './types.js';
import type { MetricMapping, NormalizedMetric, UnavailableReason } from './types.js';

/**
 * Normalization.
 *
 * Provider payloads go in, `MetricObservation` values come out, and the raw
 * field name, the provider's own definition, the unit, the denominator and the
 * observation time come out with them.
 *
 * A metric the provider did not return, or that this connection is not
 * permitted to read, is `unavailable_*` with a reason. It is never `0`, it is
 * never interpolated from a neighbouring metric, and it is never estimated
 * silently.
 */

export interface NormalizeInput {
  readonly provider: ProviderId;
  readonly scope: MetricScope;
  /** The provider payload, already parsed and validated by the connector. */
  readonly raw: Readonly<Record<string, unknown>>;
  readonly observedAt: string;
  /** SHA-256 of the raw provider response, so a reading can be traced back. */
  readonly rawProviderPayloadHash: string;
  /** Permissions this connection actually holds. */
  readonly grantedPermissions?: readonly string[];
  readonly freshnessSeconds?: number;
  /**
   * Limit the result to these metrics. Defaults to every metric mapped for the
   * provider and scope, so a missing one is reported rather than omitted.
   */
  readonly metrics?: readonly NormalizedMetricName[];
}

/** Seconds per minute, used when a provider reports minutes and we store seconds. */
const SECONDS_PER_MINUTE = 60;

function readRaw(
  raw: Readonly<Record<string, unknown>>,
  mapping: MetricMapping,
): { field: string; value: unknown } | null {
  const candidates = [mapping.definition.providerField, ...mapping.aliases];
  for (const field of candidates) {
    if (Object.hasOwn(raw, field)) {
      return { field, value: raw[field] };
    }
  }
  return null;
}

/**
 * Convert the provider's number into the unit the registry declares.
 *
 * The only conversion V1 performs is minutes to seconds, and it is declared in
 * the mapping rather than inferred from the field name.
 */
function convert(mapping: MetricMapping, value: number): number {
  if (
    mapping.definition.unit === 'seconds' &&
    mapping.definition.providerField.toLowerCase().includes('minutes')
  ) {
    return value * SECONDS_PER_MINUTE;
  }
  return value;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function observation(
  mapping: MetricMapping,
  input: NormalizeInput,
  value: number | null,
  availability: MetricObservation['availability'],
): MetricObservation {
  return metricObservationSchema.parse({
    normalizedName: mapping.definition.normalizedName,
    provider: mapping.definition.provider,
    providerField: mapping.definition.providerField,
    scope: mapping.definition.scope,
    value,
    unit: mapping.definition.unit,
    denominator: mapping.definition.denominator,
    availability,
    observedAt: input.observedAt,
    freshnessSeconds: input.freshnessSeconds ?? 0,
    rawProviderPayloadHash: input.rawProviderPayloadHash,
  });
}

function unavailable(
  mapping: MetricMapping,
  input: NormalizeInput,
  reason: UnavailableReason,
  rawValue: NormalizedMetric['rawValue'],
): NormalizedMetric {
  return {
    observation: observation(mapping, input, null, reason),
    definition: mapping.definition,
    providerField: mapping.definition.providerField,
    rawValue,
    reason,
    reasonKey: UNAVAILABLE_REASON_KEYS[reason],
    needsReverification: mapping.needsReverification,
  };
}

/**
 * Normalize one provider payload.
 *
 * Every mapped metric produces a row. A metric that is absent produces an
 * `unavailable_pending` row rather than no row at all, so the UI can explain
 * the gap instead of rendering a silent blank.
 */
export function normalizeMetrics(input: NormalizeInput): NormalizedMetric[] {
  const requested = input.metrics;
  const granted = new Set(input.grantedPermissions ?? []);
  const permissionsKnown = input.grantedPermissions !== undefined;
  const results: NormalizedMetric[] = [];

  for (const mapping of mappingsFor(input.provider, input.scope)) {
    if (requested !== undefined && !requested.includes(mapping.definition.normalizedName)) {
      continue;
    }

    if (mapping.definition.availability === 'unavailable_provider') {
      results.push(unavailable(mapping, input, 'unavailable_provider', null));
      continue;
    }

    const required = mapping.requiredPermission;
    if (permissionsKnown && required !== null && !granted.has(required)) {
      results.push(unavailable(mapping, input, 'unavailable_permission', null));
      continue;
    }

    const found = readRaw(input.raw, mapping);
    if (found === null || found.value === null || found.value === undefined) {
      results.push(unavailable(mapping, input, 'unavailable_pending', null));
      continue;
    }

    const numeric = toFiniteNumber(found.value);
    if (numeric === null) {
      results.push(
        unavailable(
          mapping,
          input,
          'unavailable_pending',
          typeof found.value === 'boolean' || typeof found.value === 'string' ? found.value : null,
        ),
      );
      continue;
    }

    results.push({
      observation: observation(mapping, input, convert(mapping, numeric), 'available'),
      definition: mapping.definition,
      providerField: found.field,
      rawValue: numeric,
      reason: null,
      reasonKey: null,
      needsReverification: mapping.needsReverification,
    });
  }

  return results;
}

/** Only the readings that carry a real provider supplied number. */
export function presentMetrics(metrics: readonly NormalizedMetric[]): NormalizedMetric[] {
  return metrics.filter((metric) => metric.observation.availability === 'available');
}

/** Readings we could not produce, grouped by reason, for the UI to explain. */
export function unavailableByReason(
  metrics: readonly NormalizedMetric[],
): Record<UnavailableReason, NormalizedMetricName[]> {
  const grouped: Record<UnavailableReason, NormalizedMetricName[]> = {
    unavailable_provider: [],
    unavailable_permission: [],
    unavailable_pending: [],
    unavailable_stale: [],
  };
  for (const metric of metrics) {
    if (metric.reason !== null) {
      grouped[metric.reason].push(metric.observation.normalizedName);
    }
  }
  return grouped;
}

/** Look one metric up by normalized name. Null when it was not produced. */
export function findMetric(
  metrics: readonly NormalizedMetric[],
  normalizedName: NormalizedMetricName,
): NormalizedMetric | null {
  return metrics.find((metric) => metric.observation.normalizedName === normalizedName) ?? null;
}
