import {
  metrics as otelMetrics,
  type Attributes,
  type Counter as OtelCounter,
  type Histogram as OtelHistogram,
  type Meter,
} from '@opentelemetry/api';

import { isRedactedKey } from '@relay/config';

/**
 * Metrics.
 *
 * A tiny facade over the named product metrics. Values are always kept in
 * memory so tests and the local admin panel can read them without an
 * OpenTelemetry collector, and are always forwarded to the OpenTelemetry
 * metrics API, which is itself a no-op until a meter provider is registered.
 *
 * Attribute values are labels, never payloads: high cardinality identifiers
 * belong in logs and receipts, not here.
 */

export const METRIC_METER_NAME = '@relay/observability';

export type MetricKind = 'counter' | 'histogram';

export interface MetricDefinition {
  readonly name: string;
  readonly kind: MetricKind;
  readonly unit: string;
  /** Attribute names this metric is expected to carry. */
  readonly attributes: readonly string[];
}

/** The product metrics named in the development handoff, section 16. */
export const PRODUCT_METRICS = {
  publishSuccessTotal: {
    name: 'publish_success_total',
    kind: 'counter',
    unit: '1',
    attributes: ['provider', 'content_type', 'account_type', 'surface'],
  },
  publishDuplicatePreventedTotal: {
    name: 'publish_duplicate_prevented_total',
    kind: 'counter',
    unit: '1',
    attributes: ['provider', 'reason'],
  },
  scheduleDispatchLatencySeconds: {
    name: 'schedule_dispatch_latency_seconds',
    kind: 'histogram',
    unit: 's',
    attributes: ['provider', 'surface'],
  },
  tokenRefreshFailuresTotal: {
    name: 'token_refresh_failures_total',
    kind: 'counter',
    unit: '1',
    attributes: ['provider', 'error_class'],
  },
  webhookDeliveryLagSeconds: {
    name: 'webhook_delivery_lag_seconds',
    kind: 'histogram',
    unit: 's',
    attributes: ['event_type', 'outcome'],
  },
  analyticsFreshnessSeconds: {
    name: 'analytics_freshness_seconds',
    kind: 'histogram',
    unit: 's',
    attributes: ['provider', 'metric'],
  },
  aiRequestCostUsd: {
    name: 'ai_request_cost_usd',
    kind: 'histogram',
    unit: 'USD',
    attributes: ['provider', 'model', 'operation', 'locale'],
  },
  providerCostUsd: {
    name: 'provider_cost_usd',
    kind: 'histogram',
    unit: 'USD',
    attributes: ['provider', 'operation'],
  },
} as const satisfies Record<string, MetricDefinition>;

export type ProductMetricKey = keyof typeof PRODUCT_METRICS;

export type MetricAttributes = Readonly<Record<string, string | number | boolean>>;

export interface CounterSample {
  readonly name: string;
  readonly attributes: MetricAttributes;
  readonly value: number;
}

export interface HistogramSample {
  readonly name: string;
  readonly attributes: MetricAttributes;
  readonly count: number;
  readonly sum: number;
  readonly min: number;
  readonly max: number;
}

export interface MetricsSnapshot {
  readonly counters: readonly CounterSample[];
  readonly histograms: readonly HistogramSample[];
}

interface CounterCell {
  readonly name: string;
  readonly attributes: MetricAttributes;
  value: number;
}

interface HistogramCell {
  readonly name: string;
  readonly attributes: MetricAttributes;
  count: number;
  sum: number;
  min: number;
  max: number;
}

const counterCells = new Map<string, CounterCell>();
const histogramCells = new Map<string, HistogramCell>();

let meter: Meter | undefined;
const otelCounters = new Map<string, OtelCounter>();
const otelHistograms = new Map<string, OtelHistogram>();

function getMeter(): Meter | undefined {
  try {
    meter ??= otelMetrics.getMeter(METRIC_METER_NAME);
    return meter;
  } catch {
    return undefined;
  }
}

/** Drop attributes whose name looks like a secret and coerce the rest. */
export function sanitizeAttributes(attributes: MetricAttributes = {}): MetricAttributes {
  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (isRedactedKey(key)) continue;
    if (value === undefined || value === null) continue;
    clean[key] = value;
  }
  return clean;
}

function cellKey(name: string, attributes: MetricAttributes): string {
  const parts = Object.keys(attributes)
    .sort()
    .map((key) => `${key}=${String(attributes[key])}`);
  return `${name}|${parts.join(',')}`;
}

export interface Counter {
  add(value?: number, attributes?: MetricAttributes): void;
}

export interface Histogram {
  record(value: number, attributes?: MetricAttributes): void;
}

function counterFor(definition: MetricDefinition): Counter {
  return {
    add(value = 1, attributes = {}) {
      if (!Number.isFinite(value)) return;
      const clean = sanitizeAttributes(attributes);
      const key = cellKey(definition.name, clean);
      const cell = counterCells.get(key);
      if (cell === undefined) {
        counterCells.set(key, { name: definition.name, attributes: clean, value });
      } else {
        cell.value += value;
      }
      const activeMeter = getMeter();
      if (activeMeter === undefined) return;
      try {
        let instrument = otelCounters.get(definition.name);
        if (instrument === undefined) {
          instrument = activeMeter.createCounter(definition.name, { unit: definition.unit });
          otelCounters.set(definition.name, instrument);
        }
        instrument.add(value, clean as Attributes);
      } catch {
        // A broken exporter must not break the operation being measured.
      }
    },
  };
}

function histogramFor(definition: MetricDefinition): Histogram {
  return {
    record(value, attributes = {}) {
      if (!Number.isFinite(value)) return;
      const clean = sanitizeAttributes(attributes);
      const key = cellKey(definition.name, clean);
      const cell = histogramCells.get(key);
      if (cell === undefined) {
        histogramCells.set(key, {
          name: definition.name,
          attributes: clean,
          count: 1,
          sum: value,
          min: value,
          max: value,
        });
      } else {
        cell.count += 1;
        cell.sum += value;
        cell.min = Math.min(cell.min, value);
        cell.max = Math.max(cell.max, value);
      }
      const activeMeter = getMeter();
      if (activeMeter === undefined) return;
      try {
        let instrument = otelHistograms.get(definition.name);
        if (instrument === undefined) {
          instrument = activeMeter.createHistogram(definition.name, { unit: definition.unit });
          otelHistograms.set(definition.name, instrument);
        }
        instrument.record(value, clean as Attributes);
      } catch {
        // See above: telemetry is best effort.
      }
    },
  };
}

const instruments = {
  publishSuccessTotal: counterFor(PRODUCT_METRICS.publishSuccessTotal),
  publishDuplicatePreventedTotal: counterFor(PRODUCT_METRICS.publishDuplicatePreventedTotal),
  scheduleDispatchLatencySeconds: histogramFor(PRODUCT_METRICS.scheduleDispatchLatencySeconds),
  tokenRefreshFailuresTotal: counterFor(PRODUCT_METRICS.tokenRefreshFailuresTotal),
  webhookDeliveryLagSeconds: histogramFor(PRODUCT_METRICS.webhookDeliveryLagSeconds),
  analyticsFreshnessSeconds: histogramFor(PRODUCT_METRICS.analyticsFreshnessSeconds),
  aiRequestCostUsd: histogramFor(PRODUCT_METRICS.aiRequestCostUsd),
  providerCostUsd: histogramFor(PRODUCT_METRICS.providerCostUsd),
} as const;

/**
 * The named product metrics.
 *
 * ```ts
 * productMetrics.publishSuccessTotal.add(1, { provider: 'x', surface: 'api' });
 * productMetrics.scheduleDispatchLatencySeconds.record(12.4, { provider: 'x' });
 * ```
 */
export const productMetrics: {
  readonly publishSuccessTotal: Counter;
  readonly publishDuplicatePreventedTotal: Counter;
  readonly scheduleDispatchLatencySeconds: Histogram;
  readonly tokenRefreshFailuresTotal: Counter;
  readonly webhookDeliveryLagSeconds: Histogram;
  readonly analyticsFreshnessSeconds: Histogram;
  readonly aiRequestCostUsd: Histogram;
  readonly providerCostUsd: Histogram;
} = instruments;

/** Ad hoc counter for a metric that is not part of the named product set. */
export function getCounter(name: string, unit = '1'): Counter {
  return counterFor({ name, kind: 'counter', unit, attributes: [] });
}

/** Ad hoc histogram for a metric that is not part of the named product set. */
export function getHistogram(name: string, unit = '1'): Histogram {
  return histogramFor({ name, kind: 'histogram', unit, attributes: [] });
}

/** Measure `fn` into a histogram, in seconds, whether it resolves or throws. */
export async function timeIt<T>(
  histogram: Histogram,
  attributes: MetricAttributes,
  fn: () => Promise<T> | T,
): Promise<T> {
  const startedAt = Date.now();
  try {
    return await fn();
  } finally {
    histogram.record((Date.now() - startedAt) / 1000, attributes);
  }
}

/** Everything recorded in this process. The admin panel and tests read this. */
export function getMetricsSnapshot(): MetricsSnapshot {
  return {
    counters: [...counterCells.values()].map((cell) => ({
      name: cell.name,
      attributes: cell.attributes,
      value: cell.value,
    })),
    histograms: [...histogramCells.values()].map((cell) => ({
      name: cell.name,
      attributes: cell.attributes,
      count: cell.count,
      sum: cell.sum,
      min: cell.min,
      max: cell.max,
    })),
  };
}

export function resetMetrics(): void {
  counterCells.clear();
  histogramCells.clear();
}
