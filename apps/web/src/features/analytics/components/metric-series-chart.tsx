'use client';

import { useMemo, type ReactElement } from 'react';
import type { NormalizedMetricName } from '@relay/contracts';
import { LineChart, type Series } from '@relay/design-system/charts';
import { LoadingState, Notice, SkeletonText } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { metricLabelKey } from '../metrics';
import { useMetricSeries } from '../queries';
import type { AccountRef, AnalyticsRange } from '../types';
import { useValueFormat } from '../use-value-format';

/**
 * The ranked metric per day, for the accounts the reader checked.
 *
 * `useMetricSeries` and the endpoint behind it had no callers at all. This is
 * the caller.
 *
 * Four fixed query slots rather than a loop, because a hook cannot be called
 * conditionally and a chart with a variable number of `useQuery` calls is a
 * chart that breaks the moment someone unchecks an account. Four is also the
 * readable ceiling: past that the lines cross more often than they separate,
 * and the kit's dash patterns run out.
 *
 * Nothing here fills a gap. A day the provider did not report is a break in
 * the line and a sentence under it, both of which the chart kit enforces.
 */

const MAX_SERIES = 4;

export interface MetricSeriesChartProps {
  readonly accounts: readonly AccountRef[];
  readonly metric: NormalizedMetricName;
  readonly range: AnalyticsRange;
}

export function MetricSeriesChart({
  accounts,
  metric,
  range,
}: MetricSeriesChartProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  const charted = accounts.slice(0, MAX_SERIES);

  // Four calls, written out. A loop would read better and would be a hooks
  // violation the first time an account is unchecked: React needs the call
  // count identical between renders. An empty slot is disabled and passes an
  // id it never fetches with.
  const slotA = useMetricSeries(charted[0]?.connectionId ?? '', metric, range, charted[0] !== undefined);
  const slotB = useMetricSeries(charted[1]?.connectionId ?? '', metric, range, charted[1] !== undefined);
  const slotC = useMetricSeries(charted[2]?.connectionId ?? '', metric, range, charted[2] !== undefined);
  const slotD = useMetricSeries(charted[3]?.connectionId ?? '', metric, range, charted[3] !== undefined);
  const queries = useMemo(() => [slotA, slotB, slotC, slotD], [slotA, slotB, slotC, slotD]);

  const metricName = t(metricLabelKey(metric));
  const accountNames = charted.map((account) => account.displayName).join(', ');

  const series = useMemo<readonly Series[]>(
    () =>
      charted.flatMap((account, index) => {
        const data = queries[index]?.data;
        if (data === undefined) return [];
        return [
          {
            id: account.connectionId,
            label: account.displayName,
            // Solid for the first, dashed for every other: the reader tells
            // them apart by pattern and by the legend, never by colour.
            dash: index === 0 ? ('solid' as const) : ('dashed' as const),
            points: data.points.map((point) => ({
              t: point.bucketStart,
              v: point.value,
            })),
          },
        ];
      }),
    [charted, queries],
  );

  if (charted.length === 0) {
    return (
      <Notice
        tone="neutral"
        title={t('analytics.chart.title', { metric: metricName })}
        description={t('analytics.chart.selectAccounts')}
      />
    );
  }

  const pending = queries.some((query, index) => charted[index] !== undefined && query.isPending);
  if (pending) {
    return (
      <LoadingState label={t('analytics.state.loading')}>
        <SkeletonText lines={5} />
      </LoadingState>
    );
  }

  const pointCount = series.reduce((total, one) => total + one.points.length, 0);

  return (
    <LineChart
      series={series}
      formatX={(iso) => format.date(iso)}
      formatY={(value) => format.count(value)}
      messages={{
        caption: t('analytics.chart.caption', { metric: metricName, accounts: accountNames }),
        ariaLabel: t('analytics.chart.ariaLabel', {
          metric: metricName,
          accounts: accountNames,
          start: format.date(range.start),
          end: format.date(range.end),
        }),
        viewAsTable: t('analytics.chart.showTable'),
        tableCaption: t('analytics.chart.tableCaption'),
        xHeader: t('analytics.chart.columnPeriod'),
        unavailable: t('analytics.value.unavailable'),
        gapLegend: t('analytics.chart.gapExplained'),
        pointsLabel: t('analytics.chart.points', { metric: metricName, count: pointCount }),
        empty: t('analytics.chart.empty'),
      }}
    />
  );
}
