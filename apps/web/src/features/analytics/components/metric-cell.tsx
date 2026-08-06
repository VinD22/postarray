'use client';

import type { ReactElement } from 'react';
import { useTranslations } from '@relay/i18n/react';

import { CountUp } from '@/components/motion';

import { providerLabelKey } from '../labels';
import { freshnessStateOf, hasValue, metricLabelKey, unavailableReasonKey } from '../metrics';
import type { MetricReading } from '../types';
import { useValueFormat } from '../use-value-format';
import { MetricDefinitionButton } from './metric-definition';

/**
 * A metric inside a dense table cell.
 *
 * `MetricFigure` is the full treatment with a label, a definition line and a
 * freshness label under it. In a table that is four lines per cell and the
 * table stops being readable, so this is the compact form: the number, the
 * definition button, and, when there is no number, the word and the reason on
 * one line.
 *
 * The compact form still never fabricates. It has no code path that produces a
 * zero, a dash or an empty cell for a metric that was not returned, and the
 * reason is always visible text rather than a hover only tooltip.
 */

export interface MetricCellProps {
  readonly reading: MetricReading;
  /** Show the metric name too. Used in the narrow layout where there is no header row. */
  readonly showLabel?: boolean;
  /**
   * Tween the value in from 0 once. Reserved for the comparison table's first
   * successful data load — the caller is responsible for turning this off
   * again after that first render (see `AnalyticsOverviewScreen`), so a
   * filter change never replays the count.
   */
  readonly animate?: boolean;
}

export function MetricCell({
  reading,
  showLabel = false,
  animate = false,
}: MetricCellProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();
  const providerName = t(providerLabelKey(reading.provider));
  const freshness = freshnessStateOf(reading.freshnessSeconds);

  if (!hasValue(reading)) {
    const reasonKey = unavailableReasonKey(reading.availability);
    return (
      <div className="flex min-w-0 flex-col items-start gap-0.5 text-start">
        {showLabel ? (
          <span className="text-label text-text-tertiary">
            {t(metricLabelKey(reading.normalizedName))}
          </span>
        ) : null}
        <span className="text-body-md text-text-secondary">{t('analytics.value.unavailable')}</span>
        <span className="text-body-sm text-text-tertiary max-w-[36ch]">
          {t(reasonKey, {
            provider: providerName,
            time: format.relative(reading.observedAt),
          })}
        </span>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col items-start gap-0.5 text-start">
      {showLabel ? (
        <span className="text-label text-text-tertiary">
          {t(metricLabelKey(reading.normalizedName))}
        </span>
      ) : null}
      <span className="flex items-center gap-1">
        {animate ? (
          <CountUp
            value={reading.value}
            format={(value) => format.valueOf(value, reading.definition.unit)}
            className="text-body-md text-text-primary tabular-nums"
          />
        ) : (
          <span className="text-body-md text-text-primary tabular-nums">
            {format.valueOf(reading.value, reading.definition.unit)}
          </span>
        )}
        <MetricDefinitionButton definition={reading.definition} />
      </span>
      <span
        className={
          freshness === 'stale' ? 'text-body-sm text-warning-fg' : 'text-body-sm text-text-tertiary'
        }
      >
        {freshness === 'stale'
          ? t('analytics.freshness.stale', {
              relativeTime: format.relative(reading.observedAt),
            })
          : t('analytics.freshness.synced', {
              relativeTime: format.relative(reading.observedAt),
            })}
      </span>
    </div>
  );
}
