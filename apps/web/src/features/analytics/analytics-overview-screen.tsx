'use client';

import { useMemo, useRef, useState, type ReactElement } from 'react';
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

import { EmptyScene } from '@/components/empty';

import { csvFilename, csvNumber, toCsv } from '@/lib/export/csv';

import { byBaselineMovement } from './baseline';
import { buildChannelRollups } from './channels';
import { AnalyticsToolbar, type AnalyticsFilters } from './components/analytics-toolbar';
import { AttentionList } from './components/attention-list';
import { ChannelTable } from './components/channel-table';
import { ComparisonTable } from './components/comparison-table';
import { ExportButton } from './components/export-button';
import { FreshnessPanel } from './components/freshness-panel';
import { MetricDefinitionsPanel } from './components/metric-definition';
import { MetricSeriesChart } from './components/metric-series-chart';
import { Observations } from './components/observations';
import { QueryErrorState } from './components/query-error-state';
import { providerLabelKey } from './labels';
import { metricLabelKey } from './metrics';
import { previousPeriod } from './period';
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
  readonly projects: readonly { readonly id: string; readonly name: string }[];
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
  projects,
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
    projectId: filters.projectId,
    connectionIds: filters.connectionIds,
    range: filters.range,
    rankMetric: filters.rankMetric,
    format: filters.format,
  });

  /*
    The comparison, which used to be a checkbox wired to nothing at all. It
    sat in filter state, was passed to no query and changed nothing on the
    screen: a control that lied about what it did.

    It now drives a second read over the period immediately before this one,
    the same length, ending where this one starts. Enabled only when the box
    is ticked, so a reader who does not want the comparison does not pay for
    the request or spend the provider quota behind it.
  */
  const previousRange = useMemo(() => previousPeriod(filters.range), [filters.range]);
  const compareQuery = useAnalyticsOverview(
    {
      projectId: filters.projectId,
      connectionIds: filters.connectionIds,
      range: previousRange,
      rankMetric: filters.rankMetric,
      format: filters.format,
    },
    filters.comparePrevious,
  );

  const metricName = t(metricLabelKey(filters.rankMetric));

  const chartedAccounts = useMemo(
    () =>
      filters.connectionIds.length === 0
        ? accounts
        : accounts.filter((account) => filters.connectionIds.includes(account.connectionId)),
    [accounts, filters.connectionIds],
  );

  const channels = useMemo(
    () => (query.data === undefined ? [] : buildChannelRollups(query.data, chartedAccounts)),
    [query.data, chartedAccounts],
  );

  const previousChannels = useMemo(
    () =>
      compareQuery.data === undefined
        ? undefined
        : buildChannelRollups(compareQuery.data, chartedAccounts),
    [compareQuery.data, chartedAccounts],
  );

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

  // The comparison table's values count up once, on the very first
  // successful load of this screen — never on a filter change, which the
  // `analytics.filter.applied` announcement below already covers. A ref
  // (not state) is deliberate: it must not force an extra render, or the
  // count-up would mount already "used up" and never animate at all.
  const hasAnimatedCountsRef = useRef(false);
  const animateCounts = query.data !== undefined && !hasAnimatedCountsRef.current;
  if (query.data !== undefined && !hasAnimatedCountsRef.current) {
    hasAnimatedCountsRef.current = true;
  }

  const handleFilters = (next: AnalyticsFilters): void => {
    setFilters(next);
    announce(
      t('analytics.filter.applied', {
        count:
          (next.projectId ? 1 : 0) +
          (next.format ? 1 : 0) +
          (next.connectionIds.length > 0 ? 1 : 0),
        results: rows.length,
      }),
      'polite',
    );
  };

  const partial =
    query.data && query.data.accountsWithData < query.data.accountsRequested ? query.data : null;

  /*
    The export is built from what is already rendered, at the moment of the
    click. No second request: a download that fetched again could hand the
    reader a different set of numbers from the one they are looking at.

    An unavailable reading is written as an empty cell. Never a zero, which a
    spreadsheet would happily average, sum and chart alongside real readings.
  */
  const buildExport = (): { filename: string; content: string } | null => {
    if (query.data === undefined || rows.length === 0) return null;

    const project =
      projects.find((one) => one.id === filters.projectId)?.name ??
      t('shell.project.all');

    return {
      filename: csvFilename({
        project,
        from: filters.range.start,
        to: filters.range.end,
      }),
      content: toCsv(rows, [
        { header: t('analytics.table.post'), value: (row) => row.title },
        { header: t('analytics.table.account'), value: (row) => row.account.displayName },
        {
          header: t('analytics.table.provider'),
          value: (row) => t(providerLabelKey(row.account.provider)),
        },
        { header: t('analytics.table.published'), value: (row) => row.publishedAt },
        { header: metricName, value: (row) => csvNumber(row.reading.value) },
        {
          header: t('analytics.definition.term.availability'),
          value: (row) => row.reading.availability,
        },
        { header: t('analytics.table.observedAt'), value: (row) => row.reading.observedAt },
      ]),
    };
  };

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
        projects={projects}
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
          <ExportButton
            className="mt-1 self-start"
            build={buildExport}
            disabled={query.isPending}
          />
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
          // The drawn scene rather than a bare heading: this is what a
          // workspace sees for its whole first week, before ingestion has
          // anything to report. The line under it says why the screen is
          // empty, which is a fact about timing and never about a failure.
          <EmptyState
            illustration={<EmptyScene scene="analytics" />}
            title={t('analytics.state.empty')}
            description={t('analytics.state.emptyBody')}
            example={t('analytics.state.emptyExample')}
          />
        ) : (
          <>
            <ComparisonTable
              rows={rows}
              metricName={metricName}
              onOpenPost={onOpenPost}
              animateCounts={animateCounts}
            />
            <Notice
              tone="neutral"
              title={t('analytics.outcome.separateNote')}
              description={t('analytics.feedback.notComparableFormats')}
            />
          </>
        )}
      </section>

      <Separator />

      <section aria-labelledby="channels-heading" className="flex flex-col gap-4">
        <div className="flex max-w-[70ch] flex-col gap-1">
          <h2 id="channels-heading" className="text-title-md text-text-primary">
            {t('analytics.channels.title')}
          </h2>
          <p className="text-body-md text-text-secondary">{t('analytics.channels.intro')}</p>
          {filters.comparePrevious ? (
            <p className="text-body-sm text-text-tertiary">
              {compareQuery.isPending
                ? t('analytics.compare.loading')
                : compareQuery.isError
                  ? t('analytics.compare.unavailable')
                  : t('analytics.compare.range', {
                      start: previousRange.start.slice(0, 10),
                      end: previousRange.end.slice(0, 10),
                    })}
            </p>
          ) : null}
        </div>

        {query.isPending ? (
          <LoadingState label={t('analytics.state.loading')}>
            <SkeletonTable rows={4} columns={5} />
          </LoadingState>
        ) : channels.length === 0 ? null : (
          <ChannelTable
            rollups={channels}
            rankMetric={filters.rankMetric}
            previous={previousChannels}
            comparing={filters.comparePrevious && !compareQuery.isError}
          />
        )}

        {/* The chart under the table, not above it. The table is the answer
            and the chart is the shape of it. */}
        <MetricSeriesChart
          accounts={chartedAccounts}
          metric={filters.rankMetric}
          range={filters.range}
        />
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
