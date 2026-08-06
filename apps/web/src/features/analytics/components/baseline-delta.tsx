'use client';

import type { ReactElement } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

import { MINIMUM_BASELINE_SAMPLE } from '../baseline';
import { metricLabelKey } from '../metrics';
import type { BaselineComparison } from '../types';
import { useValueFormat } from '../use-value-format';

/**
 * How far one post sits from its author's own baseline.
 *
 * Decisions worth stating.
 *
 * There is no red or green here. Colour would claim that above is good and
 * below is bad, which is untrue for plenty of metrics and unreadable for anyone
 * who cannot separate the two hues. The direction is a word, and the word is
 * what a screen reader announces.
 *
 * The small `aria-hidden` chip beside the sentence is decorative reinforcement,
 * never the only carrier of the direction: it uses the two neutral brand hues
 * (blue "up", pink "down") rather than success/danger, so it still never claims
 * one direction is good and the other bad. Pink never renders as bare text or a
 * bare icon fill on the canvas (it fails contrast on its own) — the "down" chip
 * is always the mandatory ink-on-fill, 2px-bordered pink surface.
 *
 * A comparison that does not exist says so and says why. It never renders an
 * empty cell, a dash or a zero, all three of which read as "no movement".
 */

export interface BaselineDeltaProps {
  readonly baseline: BaselineComparison | null;
}

export function BaselineDelta({ baseline }: BaselineDeltaProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  if (baseline === null) {
    return (
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-body-md text-text-secondary">{t('analytics.table.noBaseline')}</p>
        <p className="text-body-sm text-text-tertiary">
          {t('analytics.table.noBaselineReason', { required: MINIMUM_BASELINE_SAMPLE })}
        </p>
      </div>
    );
  }

  const percent = format.percent(Math.abs(baseline.deltaRatio));
  const sentence =
    baseline.direction === 'above'
      ? t('analytics.delta.above', { percent })
      : baseline.direction === 'below'
        ? t('analytics.delta.below', { percent })
        : t('analytics.delta.level');

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <p className="text-body-md text-text-primary flex items-center">
        {baseline.direction === 'level' ? null : (
          <span
            aria-hidden="true"
            className={cn(
              'me-1.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full',
              baseline.direction === 'above'
                ? 'bg-accent-subtle text-text-accent'
                : 'border-border-bold bg-blush text-blush-on border-2',
            )}
          >
            {baseline.direction === 'above' ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
          </span>
        )}
        {baseline.direction === 'level' ? null : (
          <span className="pe-1.5 font-medium tabular-nums">
            {format.signedPercent(baseline.deltaRatio)}
          </span>
        )}
        <span className="text-text-secondary">{sentence}</span>
      </p>
      <p className="text-body-sm text-text-tertiary tabular-nums">
        {t('analytics.table.sampleSize', { count: baseline.sampleSize })}
        {baseline.smallSample ? (
          <span className="text-warning-fg ps-2">
            {t('analytics.evidence.smallSample', { count: baseline.sampleSize })}
          </span>
        ) : null}
      </p>
    </div>
  );
}

/**
 * The sentence a screen reader and a print stylesheet both get: the whole
 * comparison, with the metric named, in one line and no layout.
 */
export function baselineSummarySentence(
  t: (key: string, values?: Record<string, string | number>) => string,
  formatPercentValue: (ratio: number) => string,
  baseline: BaselineComparison,
): string {
  const percent = formatPercentValue(Math.abs(baseline.deltaRatio));
  const metric = t(metricLabelKey(baseline.metric));
  const baselineName = t('analytics.baseline.trailingMedian', {
    count: baseline.sampleSize,
  });
  if (baseline.direction === 'above') {
    return t('analytics.feedback.aboveBaseline', {
      percent,
      metric,
      baseline: baselineName,
    });
  }
  if (baseline.direction === 'below') {
    return t('analytics.feedback.belowBaseline', {
      percent,
      metric,
      baseline: baselineName,
    });
  }
  return t('analytics.delta.level');
}
