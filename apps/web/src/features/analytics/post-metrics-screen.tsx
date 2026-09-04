'use client';

import { useMemo, type ReactElement } from 'react';
import type { NormalizedMetricName } from '@relay/contracts';
import { DefinitionList, LoadingState, Notice, SkeletonText } from '@relay/design-system/patterns';
import { Button, Separator } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { csvFilename, csvNumber, toCsv } from '@/lib/export/csv';

import { ExportButton } from './components/export-button';
import { MetricDefinitionsPanel } from './components/metric-definition';
import { MetricFigure } from './components/metric-figure';
import { QueryErrorState } from './components/query-error-state';
import { formatLabelKey, providerLabelKey } from './labels';
import {
  OUTCOME_GROUPS,
  metricLabelKey,
  outcomeGroupHelpKey,
  outcomeGroupLabelKey,
  outcomeGroupOf,
} from './metrics';
import { usePostMetrics } from './queries';
import type { MetricReading, OutcomeGroup } from './types';
import { useValueFormat } from './use-value-format';

/**
 * Everything measured about one post.
 *
 * The metrics are grouped by the question they answer, and the four groups are
 * never added together or reduced to a single figure. A post that was seen a
 * lot and clicked rarely is a different result from one that was seen rarely
 * and clicked often, and one number cannot hold both.
 *
 * The tracked link comparison at the foot is the other rule this screen exists
 * to enforce: when a provider reports link clicks and Post Array also redirected the
 * link, both numbers are shown, both are labelled with what they count, and
 * neither is presented as a correction of the other.
 */

export interface PostMetricsScreenProps {
  readonly contentItemId: string;
  /** Additional readings beyond the ranked one, grouped on this screen. */
  readonly readings?: readonly MetricReading[];
  /** Provider native link clicks against Post Array redirect clicks, when both exist. */
  readonly linkComparison?: {
    readonly providerValue: string;
    readonly relayValue: string;
    readonly provider: string;
  };
  readonly onOpenReceipt?: () => void;
  readonly onOpenLink?: () => void;
}

export function PostMetricsScreen({
  contentItemId,
  readings = [],
  linkComparison,
  onOpenReceipt,
  onOpenLink,
}: PostMetricsScreenProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();
  const query = usePostMetrics(contentItemId);

  const allReadings = useMemo<readonly MetricReading[]>(
    () => [...(query.data?.readings ?? []), ...readings],
    [query.data?.readings, readings],
  );

  const grouped = useMemo(() => {
    const map = new Map<OutcomeGroup, MetricReading[]>();
    for (const reading of allReadings) {
      const group = outcomeGroupOf(reading.normalizedName as NormalizedMetricName);
      const list = map.get(group) ?? [];
      list.push(reading);
      map.set(group, list);
    }
    return map;
  }, [allReadings]);

  const definitions = useMemo(
    () => allReadings.map((reading) => reading.definition),
    [allReadings],
  );

  if (query.isPending) {
    return (
      <div className="px-4 py-6 md:px-6">
        <LoadingState label={t('analytics.state.loading')}>
          <SkeletonText lines={6} />
        </LoadingState>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="px-4 py-6 md:px-6">
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
        />
      </div>
    );
  }

  const post = query.data;
  // One column for the number, named for what the column holds rather than
  // for any single metric: each row names its own metric already.
  const metricValueHeader = t('analytics.table.value');

  return (
    <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
      <section className="flex flex-col gap-3">
        {/*
          Every field here is nullable and every null renders as the word.
          The metrics read identifies nothing about the post, so the title and
          the format come from the content read, which is allowed to fail on
          its own. Readings without a title are still worth showing; an empty
          heading over them would read as a post that has no title.
        */}
        <h2 className="text-title-md text-text-primary text-balance">
          {post.title ?? t('analytics.value.unavailable')}
        </h2>
        <DefinitionList
          layout="columns"
          items={[
            {
              id: 'format',
              term: t('analytics.table.format'),
              definition:
                post.format === null
                  ? t('analytics.value.unavailable')
                  : t(formatLabelKey(post.format)),
            },
            {
              id: 'published',
              term: t('analytics.table.published'),
              definition:
                post.publishedAt === null ? (
                  t('analytics.value.unavailable')
                ) : (
                  <time dateTime={post.publishedAt} className="tabular-nums">
                    {format.dateTime(post.publishedAt)}
                  </time>
                ),
            },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          {onOpenReceipt ? (
            <Button size="sm" variant="secondary" onClick={onOpenReceipt}>
              {t('action.viewReceipt')}
            </Button>
          ) : null}
          <ExportButton
            build={() =>
              allReadings.length === 0
                ? null
                : {
                    filename: csvFilename({
                      project: post.title ?? post.contentItemId,
                      from: post.publishedAt ?? new Date().toISOString(),
                      to: post.publishedAt ?? new Date().toISOString(),
                    }),
                    content: toCsv(allReadings, [
                      {
                        header: t('analytics.definition.term.definition'),
                        value: (item) => t(metricLabelKey(item.normalizedName)),
                      },
                      {
                        header: t('analytics.table.provider'),
                        value: (item) => t(providerLabelKey(item.provider)),
                      },
                      {
                        header: t('analytics.definition.term.providerField'),
                        value: (item) => item.definition.providerField,
                      },
                      // Empty when the provider did not return a reading. A
                      // zero here would be averaged and charted downstream as
                      // if we had measured it.
                      { header: metricValueHeader, value: (item) => csvNumber(item.value) },
                      {
                        header: t('analytics.definition.term.availability'),
                        value: (item) => item.availability,
                      },
                      {
                        header: t('analytics.table.observedAt'),
                        value: (item) => item.observedAt,
                      },
                    ]),
                  }
            }
          />
        </div>
      </section>

      <Separator />

      <Notice tone="neutral" title={t('analytics.outcome.separateNote')} />

      {OUTCOME_GROUPS.map((group) => {
        const groupReadings = grouped.get(group) ?? [];
        if (groupReadings.length === 0) {
          return null;
        }
        return (
          <section key={group} className="flex flex-col gap-3">
            <div className="flex max-w-[70ch] flex-col gap-1">
              <h3 className="text-title-sm text-text-primary">{t(outcomeGroupLabelKey(group))}</h3>
              <p className="text-body-md text-text-secondary">{t(outcomeGroupHelpKey(group))}</p>
            </div>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {groupReadings.map((reading) => (
                <MetricFigure
                  key={`${reading.provider}:${reading.normalizedName}`}
                  reading={reading}
                />
              ))}
            </div>
          </section>
        );
      })}

      {linkComparison ? (
        <Notice
          tone="warning"
          title={t('analytics.links.separateSources')}
          description={t('analytics.links.compareWarning', {
            provider: linkComparison.provider,
            providerValue: linkComparison.providerValue,
            relayValue: linkComparison.relayValue,
          })}
          actions={
            onOpenLink ? (
              <Button size="sm" variant="secondary" onClick={onOpenLink}>
                {t('analytics.tab.links')}
              </Button>
            ) : null
          }
        />
      ) : null}

      <MetricDefinitionsPanel definitions={definitions} />
    </div>
  );
}
