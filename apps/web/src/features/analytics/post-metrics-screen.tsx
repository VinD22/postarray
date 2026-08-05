'use client';

import { useMemo, type ReactElement } from 'react';
import type { NormalizedMetricName } from '@relay/contracts';
import { DefinitionList, LoadingState, Notice, SkeletonText } from '@relay/design-system/patterns';
import { Button, Separator, StatusDot } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { EvidencePanel } from './components/evidence-panel';
import { MetricDefinitionsPanel } from './components/metric-definition';
import { MetricFigure } from './components/metric-figure';
import { QueryErrorState } from './components/query-error-state';
import { formatLabelKey, providerLabelKey } from './labels';
import {
  OUTCOME_GROUPS,
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
 * to enforce: when a provider reports link clicks and Relay also redirected the
 * link, both numbers are shown, both are labelled with what they count, and
 * neither is presented as a correction of the other.
 */

export interface PostMetricsScreenProps {
  readonly contentItemId: string;
  /** Additional readings beyond the ranked one, grouped on this screen. */
  readonly readings?: readonly MetricReading[];
  /** Provider native link clicks against Relay redirect clicks, when both exist. */
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

  const allReadings = useMemo<readonly MetricReading[]>(() => {
    const primary = query.data?.reading;
    return primary ? [primary, ...readings] : readings;
  }, [query.data?.reading, readings]);

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

  const row = query.data;

  return (
    <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
      <section className="flex flex-col gap-3">
        <h2 className="text-title-md text-text-primary text-balance">{row.title}</h2>
        <DefinitionList
          layout="columns"
          items={[
            {
              id: 'account',
              term: t('analytics.table.account'),
              definition: (
                <span className="flex items-center gap-2">
                  <StatusDot provider={row.account.provider} />
                  {row.account.displayName}
                  <span className="text-text-tertiary">
                    {t(providerLabelKey(row.account.provider))}
                  </span>
                </span>
              ),
            },
            {
              id: 'format',
              term: t('analytics.table.format'),
              definition: t(formatLabelKey(row.format)),
            },
            {
              id: 'published',
              term: t('analytics.table.published'),
              definition: (
                <time dateTime={row.publishedAt} className="tabular-nums">
                  {format.dateTime(row.publishedAt)}
                </time>
              ),
            },
          ]}
        />
        {onOpenReceipt ? (
          <Button size="sm" variant="secondary" className="self-start" onClick={onOpenReceipt}>
            {t('action.viewReceipt')}
          </Button>
        ) : null}
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

      {row.baseline ? (
        <>
          <Separator />
          <EvidencePanel row={row} baseline={row.baseline} />
        </>
      ) : null}

      <MetricDefinitionsPanel definitions={definitions} />
    </div>
  );
}
