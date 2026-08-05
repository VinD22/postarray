'use client';

import { useMemo, useState, type ReactElement } from 'react';
import type { ContentKind } from '@relay/contracts';
import { useAnnouncer } from '@relay/design-system/hooks';
import {
  EmptyState,
  LoadingState,
  Notice,
  OfflineBanner,
  PartialSuccessNotice,
  SkeletonTable,
} from '@relay/design-system/patterns';
import { Separator } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { byBaselineMovement } from './baseline';
import { AnalyticsToolbar, type AnalyticsFilters } from './components/analytics-toolbar';
import { AttentionList } from './components/attention-list';
import { ComparisonTable } from './components/comparison-table';
import { FreshnessPanel } from './components/freshness-panel';
import { MetricDefinitionsPanel } from './components/metric-definition';
import { Observations } from './components/observations';
import { QueryErrorState } from './components/query-error-state';
import { providerLabelKey } from './labels';
import { metricLabelKey } from './metrics';
import { useAnalyticsOverview } from './queries';
import type { AccountRef, MetricDefinitionView } from './types';
import { useOnlineStatus } from './use-online-status';

/**
 * The analytics overview.
 *
 * The screen is arranged as an argument rather than as a dashboard:
 *
 * 1. The question, in words, as the section heading.
 * 2. The table that answers it, ranked by one metric the reader chose.
 * 3. The accounts whose numbers are missing, with the reason and the fix.
 * 4. Observations, each carrying its sample size, period and confounders.
 * 5. Where every figure came from, and when it was last true.
 * 6. Every definition in full, so nothing important lives only in a tooltip.
 *
 * There is no metric wall at the top. A row of large numbers with no
 * denominator is the fastest way to make an operational screen decorative.
 */

export interface AnalyticsOverviewScreenProps {
  readonly brands: readonly { readonly id: string; readonly name: string }[];
  readonly accounts: readonly AccountRef[];
  readonly initialFilters: AnalyticsFilters;
  readonly formats?: readonly ContentKind[];
  readonly statusHref?: string;
  readonly onOpenPost?: (contentItemId: string) => void;
  readonly onReconnect?: (connectionId: string) => void;
  readonly onOpenConnection?: (connectionId: string) => void;
  readonly onTagExperiment?: () => void;
}

const DEFAULT_FORMATS: readonly ContentKind[] = [
  'text',
  'image',
  'carousel',
  'video',
  'short_video',
  'long_video',
  'document',
  'thread',
];

export function AnalyticsOverviewScreen({
  brands,
  accounts,
  initialFilters,
  formats = DEFAULT_FORMATS,
  statusHref,
  onOpenPost,
  onReconnect,
  onOpenConnection,
  onTagExperiment,
}: AnalyticsOverviewScreenProps): ReactElement {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const online = useOnlineStatus();
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters);

  const query = useAnalyticsOverview({
    brandId: filters.brandId,
    connectionIds: filters.connectionIds,
    range: filters.range,
    rankMetric: filters.rankMetric,
    format: filters.format,
  });

  const metricName = t(metricLabelKey(filters.rankMetric));

  const rows = useMemo(
    () => [...(query.data?.rows ?? [])].sort(byBaselineMovement),
    [query.data?.rows],
  );

  const definitions = useMemo<readonly MetricDefinitionView[]>(() => {
    const seen = new Map<string, MetricDefinitionView>();
    for (const row of query.data?.rows ?? []) {
      const key = `${row.reading.provider}:${row.reading.normalizedName}`;
      if (!seen.has(key)) {
        seen.set(key, row.reading.definition);
      }
    }
    return [...seen.values()];
  }, [query.data?.rows]);

  const handleFilters = (next: AnalyticsFilters): void => {
    setFilters(next);
    announce(
      t('analytics.filter.applied', {
        count:
          (next.brandId ? 1 : 0) + (next.format ? 1 : 0) + (next.connectionIds.length > 0 ? 1 : 0),
        results: rows.length,
      }),
      'polite',
    );
  };

  const partial =
    query.data && query.data.accountsWithData < query.data.accountsRequested ? query.data : null;

  return (
    <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
      {online ? null : (
        <OfflineBanner
          title={t('analytics.state.offlineTitle')}
          description={t('analytics.state.offlineBody')}
        />
      )}

      <AnalyticsToolbar
        filters={filters}
        brands={brands}
        accounts={accounts}
        formats={formats}
        onChange={handleFilters}
      />

      <section aria-labelledby="baseline-question" className="flex flex-col gap-4">
        <div className="flex max-w-[70ch] flex-col gap-1">
          <h2 id="baseline-question" className="text-title-md text-text-primary">
            {t('analytics.question.baseline')}
          </h2>
          <p className="text-body-md text-text-secondary">{t('analytics.question.baselineHelp')}</p>
          <p className="text-body-sm text-text-tertiary">
            {t('analytics.rankMetric.chosen', { metric: metricName })}
          </p>
        </div>

        {partial ? (
          <PartialSuccessNotice
            title={t('analytics.state.partialTitle', {
              loaded: partial.accountsWithData,
              total: partial.accountsRequested,
            })}
            description={t('analytics.state.partialBody')}
            succeededLabel={t('analytics.state.partialSucceeded')}
            failedLabel={t('analytics.state.partialFailed')}
            targets={[
              ...partial.freshness.map((row) => ({
                id: `ok-${row.account.connectionId}`,
                account: `${row.account.displayName} (${t(providerLabelKey(row.account.provider))})`,
                outcome: 'succeeded' as const,
              })),
              ...partial.accountsWithoutData.map((row) => ({
                id: `no-${row.account.connectionId}`,
                account: `${row.account.displayName} (${t(providerLabelKey(row.account.provider))})`,
                outcome: 'failed' as const,
              })),
            ]}
          />
        ) : null}

        {query.isPending ? (
          <LoadingState label={t('analytics.state.loading')}>
            <SkeletonTable rows={6} columns={5} />
          </LoadingState>
        ) : query.isError ? (
          <QueryErrorState
            error={query.error}
            title={t('analytics.state.errorTitle')}
            description={t('analytics.state.errorBody')}
            permission={{
              title: t('analytics.state.permissionTitle'),
              description: t('analytics.state.permissionBody'),
            }}
            rateLimit={{
              title: t('analytics.state.rateLimitTitle', {
                provider: t('analytics.filter.allAccounts'),
              }),
              cause: t('analytics.state.rateLimitCause'),
              alternative: t('analytics.state.rateLimitAlternative'),
            }}
            onRetry={() => {
              void query.refetch();
            }}
            retrying={query.isFetching}
          />
        ) : rows.length === 0 ? (
          <EmptyState
            title={t('analytics.state.empty')}
            description={t('analytics.state.emptyBody')}
            example={t('analytics.state.emptyExample')}
          />
        ) : (
          <>
            <ComparisonTable rows={rows} metricName={metricName} onOpenPost={onOpenPost} />
            <Notice
              tone="neutral"
              title={t('analytics.outcome.separateNote')}
              description={t('analytics.feedback.notComparableFormats')}
            />
          </>
        )}
      </section>

      <Separator />

      <AttentionList
        rows={query.data?.attention ?? []}
        onReconnect={onReconnect}
        onOpenConnection={onOpenConnection}
      />

      <Separator />

      <Observations
        observations={query.data?.observations ?? []}
        onTagExperiment={onTagExperiment}
      />

      <Separator />

      <FreshnessPanel rows={query.data?.freshness ?? []} statusHref={statusHref} />

      <MetricDefinitionsPanel definitions={definitions} />
    </div>
  );
}
