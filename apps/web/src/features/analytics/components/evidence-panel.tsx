'use client';

import type { ReactElement } from 'react';
import { DefinitionList } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { formatLabelKey } from '../labels';
import { metricLabelKey } from '../metrics';
import type { BaselineComparison, ConfounderCode, PostComparisonRow } from '../types';
import { useValueFormat } from '../use-value-format';

/**
 * What a comparison was actually made from.
 *
 * The rule this panel serves: a recommendation cites the posts and the period
 * that support it. Everything the reader needs to disagree with the comparison
 * is here, including the posts themselves, the exclusions, and the things the
 * comparison cannot account for.
 *
 * The confounders are not a disclaimer. They are the specific reasons this
 * particular comparison might mislead, computed per row, and each one names the
 * value that triggered it.
 */

const CONFOUNDER_KEY: Readonly<Record<ConfounderCode, string>> = {
  time_of_day: 'analytics.evidence.confounder.time',
  mixed_formats: 'analytics.evidence.confounder.format',
  follower_change: 'analytics.evidence.confounder.followers',
  paid_distribution: 'analytics.evidence.confounder.paid',
  provider_definition_change: 'analytics.evidence.confounder.provider',
};

export interface EvidencePanelProps {
  readonly row: PostComparisonRow;
  readonly baseline: BaselineComparison;
  /** Extra values some confounder sentences interpolate. */
  readonly confounderValues?: Readonly<Record<string, string | number>>;
}

export function EvidencePanel({
  row,
  baseline,
  confounderValues = {},
}: EvidencePanelProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();
  const metricName = t(metricLabelKey(baseline.metric));

  return (
    <div className="flex flex-col gap-4 bg-surface-sunken p-4">
      <div className="flex max-w-[70ch] flex-col gap-1">
        <h3 className="text-title-sm text-text-primary">
          {t('analytics.evidence.title')}
        </h3>
        <p className="text-body-md text-text-secondary">
          {t('analytics.evidence.baseline', {
            metric: metricName,
            count: baseline.sampleSize,
            account: row.account.displayName,
          })}
        </p>
        <p className="text-body-md text-text-secondary">
          {t('analytics.evidence.comparableBy', {
            format: t(formatLabelKey(baseline.format)),
          })}
        </p>
      </div>

      <DefinitionList
        layout="columns"
        items={[
          {
            id: 'median',
            term: t('analytics.baseline.trailingMedian', { count: baseline.sampleSize }),
            definition: (
              <span className="tabular-nums">
                {format.valueOf(baseline.median, row.reading.definition.unit)}
              </span>
            ),
          },
          {
            id: 'excluded',
            term: t('analytics.evidence.postsUsed'),
            definition: t('analytics.evidence.excluded', {
              count: baseline.excludedCount,
            }),
          },
        ]}
      />

      <div className="flex flex-col gap-2">
        <h4 className="text-label text-text-tertiary">
          {t('analytics.evidence.postsUsed')}
        </h4>
        <ul className="flex flex-col divide-y divide-border-subtle">
          {baseline.comparablePosts.map((post) => (
            <li
              key={post.contentItemId}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 py-1.5"
            >
              <span className="min-w-0 text-body-md text-text-primary">{post.title}</span>
              <span className="flex items-baseline gap-3 text-body-sm text-text-tertiary tabular-nums">
                <time dateTime={post.publishedAt}>{format.date(post.publishedAt)}</time>
                <span className="text-text-secondary">
                  {format.valueOf(post.value, row.reading.definition.unit)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {baseline.smallSample ? (
        <p className="max-w-[70ch] text-body-md text-warning-fg">
          {t('analytics.evidence.smallSample', { count: baseline.sampleSize })}
        </p>
      ) : null}

      {baseline.confounders.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <h4 className="text-label text-text-tertiary">
            {t('analytics.evidence.confounders')}
          </h4>
          <ul className="flex max-w-[70ch] list-disc flex-col gap-1 ps-5 text-body-md text-text-secondary marker:text-text-tertiary">
            {baseline.confounders.map((confounder) => (
              <li key={confounder}>
                {t(CONFOUNDER_KEY[confounder], {
                  account: row.account.displayName,
                  provider: row.reading.provider,
                  metric: metricName,
                  ...confounderValues,
                })}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
