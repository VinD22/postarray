'use client';

import type { ReactElement } from 'react';
import { FreshnessLabel, MetricValue } from '@relay/design-system/patterns';
import { Badge } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { providerLabelKey } from '../labels';
import {
  freshnessStateOf,
  metricLabelKey,
  toDesignSystemAvailability,
  unavailableReasonKey,
} from '../metrics';
import type { MetricReading } from '../types';
import { useValueFormat } from '../use-value-format';
import { MetricDefinitionButton } from './metric-definition';

/**
 * One normalized metric, with everything needed to trust it.
 *
 * The component exists so that no screen can accidentally render a bare number.
 * Passing a `MetricReading` gets you the value, the provider, the definition
 * and the freshness, or, when there is no value, the word and the reason there
 * is not. There is no prop that turns any of that off.
 *
 * A reading whose availability is anything but `available` renders through the
 * design system's `MetricValue`, which physically ignores the value field. That
 * is the last line of defence against a stale number leaking onto the screen.
 */

export interface MetricFigureProps {
  readonly reading: MetricReading;
  readonly size?: 'md' | 'lg';
  /** Hide the definition button when the definition is already inline nearby. */
  readonly hideDefinitionButton?: boolean;
  readonly className?: string;
}

export function MetricFigure({
  reading,
  size = 'md',
  hideDefinitionButton = false,
  className,
}: MetricFigureProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  const providerName = t(providerLabelKey(reading.provider));
  const metricName = t(metricLabelKey(reading.normalizedName));
  const availability = toDesignSystemAvailability(reading.availability);
  const reasonKey = unavailableReasonKey(reading.availability);
  const freshness = freshnessStateOf(reading.freshnessSeconds);

  const label = (
    <span className="flex items-center gap-1">
      {metricName}
      {hideDefinitionButton ? null : <MetricDefinitionButton definition={reading.definition} />}
    </span>
  );

  return (
    <MetricValue
      className={className ?? ''}
      label={label}
      size={size}
      availability={availability}
      value={
        <span className="flex flex-wrap items-baseline gap-2">
          {format.value(reading)}
          {reading.estimate ? <Badge tone="warning">{t('analytics.value.estimated')}</Badge> : null}
        </span>
      }
      unavailableText={t('analytics.value.unavailable')}
      reason={
        reasonKey === ''
          ? undefined
          : t(reasonKey, {
              provider: providerName,
              time: format.relative(reading.observedAt),
            })
      }
      definition={
        <span className="flex flex-col gap-0.5">
          <span>
            {t('analytics.definition.provider', {
              provider: providerName,
              providerField: reading.definition.providerField,
            })}
          </span>
          {reading.estimate ? (
            <span>{t('analytics.value.estimatedMethod', { method: reading.estimate.method })}</span>
          ) : null}
        </span>
      }
      freshness={
        <FreshnessLabel
          level={freshness}
          isoTimestamp={reading.observedAt}
          text={
            freshness === 'stale'
              ? t('analytics.freshness.stale', {
                  relativeTime: format.relative(reading.observedAt),
                })
              : t('analytics.freshness.synced', {
                  relativeTime: format.relative(reading.observedAt),
                })
          }
        />
      }
    />
  );
}
