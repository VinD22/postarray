import {
  canonicalJson,
  metricObservationSchema,
  unavailableObservation,
  type MetricAvailability,
  type MetricDenominator,
  type MetricObservation,
  type MetricScope,
  type MetricUnit,
  type NormalizedMetricName,
  type ProviderId,
} from '@relay/contracts';

/**
 * Metric mapping helpers.
 *
 * The rules that matter: never compute a metric the provider did not return, never fill a
 * gap with zero, and always carry the provider's own field name next to the number.
 */

/**
 * A synchronous digest of the raw payload, used only to prove two observations came from
 * the same provider response. It is not a security primitive: it never leaves the process
 * as anything but an opaque identifier and it is computed over the sanitized payload.
 */
export function payloadHash(payload: unknown): string {
  const text = canonicalJson(payload);
  // FNV-1a over 4 independent offsets, concatenated to 64 hex characters. Deterministic,
  // dependency free and synchronous, which is what the observation schema needs.
  const offsets = [0x811c9dc5, 0x01000193, 0x7fffffff, 0x2545f491];
  const parts: string[] = [];
  for (const offset of offsets) {
    let hash = offset >>> 0;
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    parts.push(hash.toString(16).padStart(8, '0'));
  }
  return parts.join('').padEnd(64, '0').slice(0, 64);
}

/** One provider field mapped onto one normalized metric name. */
export interface MetricFieldMapping {
  readonly providerField: string;
  readonly normalizedName: NormalizedMetricName;
  readonly unit: MetricUnit;
  readonly denominator: MetricDenominator;
}

export interface MapMetricsInput {
  readonly provider: ProviderId;
  readonly scope: MetricScope;
  readonly mappings: readonly MetricFieldMapping[];
  /** Field name to raw value, exactly as the provider returned it. */
  readonly values: Readonly<Record<string, unknown>>;
  readonly observedAt: string;
  readonly rawPayload: unknown;
  readonly freshnessSeconds?: number;
  /**
   * Why a field is missing. `unavailable_permission` when a scope or review is missing,
   * `unavailable_pending` when the provider has not computed it yet.
   */
  readonly missingAvailability?: Exclude<MetricAvailability, 'available'>;
}

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/**
 * Map a provider response onto observations. Every mapping produces exactly one
 * observation: present fields carry the value, absent fields are `unavailable_*` with a
 * null value, which the contract schema enforces.
 */
export function mapMetrics(input: MapMetricsInput): MetricObservation[] {
  const hash = payloadHash(input.rawPayload);
  const missing = input.missingAvailability ?? 'unavailable_provider';
  return input.mappings.map((mapping) => {
    const value = readNumber(input.values[mapping.providerField]);
    if (value === null) {
      return unavailableObservation({
        normalizedName: mapping.normalizedName,
        provider: input.provider,
        providerField: mapping.providerField,
        scope: input.scope,
        availability: missing,
        observedAt: input.observedAt,
        rawProviderPayloadHash: hash,
        unit: mapping.unit,
        denominator: mapping.denominator,
        freshnessSeconds: input.freshnessSeconds ?? 0,
      });
    }
    return metricObservationSchema.parse({
      normalizedName: mapping.normalizedName,
      provider: input.provider,
      providerField: mapping.providerField,
      scope: input.scope,
      value,
      unit: mapping.unit,
      denominator: mapping.denominator,
      availability: 'available',
      observedAt: input.observedAt,
      freshnessSeconds: input.freshnessSeconds ?? 0,
      rawProviderPayloadHash: hash,
    });
  });
}

/**
 * Every mapped field reported as unavailable for one stated reason. Used when a provider
 * has not approved our app for an insights product: the honest answer is "we cannot read
 * this", not a screen of zeros.
 */
export function allUnavailable(
  input: Omit<MapMetricsInput, 'values'> & {
    readonly missingAvailability: Exclude<MetricAvailability, 'available'>;
  },
): MetricObservation[] {
  return mapMetrics({ ...input, values: {} });
}

/** The normalized names a mapping table covers, for the capability snapshot. */
export function normalizedNames(mappings: readonly MetricFieldMapping[]): NormalizedMetricName[] {
  return [...new Set(mappings.map((mapping) => mapping.normalizedName))];
}
