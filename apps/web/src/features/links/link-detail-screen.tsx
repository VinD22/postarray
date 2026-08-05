'use client';

import { useMemo, useState, type ReactElement } from 'react';
import {
  CapabilityBadge,
  ConfirmDialog,
  DefinitionList,
  EmptyState,
  LoadingState,
  Notice,
  SkeletonText,
} from '@relay/design-system/patterns';
import { Button, Code, Separator } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { QueryErrorState } from '@/features/analytics/components/query-error-state';
import { TrendChart } from '@/features/analytics/components/trend-chart';
import { deviceLabelKey, referrerLabelKey } from '@/features/analytics/labels';
import { useValueFormat } from '@/features/analytics/use-value-format';

import { BreakdownList } from './components/breakdown-list';
import { DestinationEditDialog } from './components/destination-edit-dialog';
import { useLinkStats, useSetLinkEnabled, useUpdateDestination } from './queries';
import type { DomainVerificationState } from './types';

/**
 * One tracked link, its exact behaviour and its first party measurements.
 *
 * The order is deliberate. What this link does right now comes first, because a
 * person opening this screen during an incident needs the exact destination
 * before they need any statistic. The controls that change public behaviour
 * (edit destination, disable) sit with it. The measurements come after, under a
 * heading that names what they count.
 *
 * Total requests, deduplicated clicks and suspected bots are three separate
 * figures and all three are always shown. Showing only the deduplicated number
 * would hide the filtering, and hiding the filtering is how a measurement stops
 * being auditable.
 */

const DOMAIN_CAPABILITY: Readonly<
  Record<DomainVerificationState, 'supported' | 'requires_review' | 'unsupported' | 'not_implemented'>
> = {
  verified: 'supported',
  pending: 'requires_review',
  failed: 'unsupported',
  default: 'supported',
};

export interface LinkDetailScreenProps {
  readonly linkId: string;
  readonly abuseReportHref?: string;
}

function last30Days(): { readonly start: string; readonly end: string } {
  const end = new Date();
  return {
    start: new Date(end.getTime() - 30 * 86_400_000).toISOString(),
    end: end.toISOString(),
  };
}

export function LinkDetailScreen({
  linkId,
  abuseReportHref,
}: LinkDetailScreenProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();
  const range = useMemo(last30Days, []);
  const stats = useLinkStats(linkId, range);
  const updateDestination = useUpdateDestination();
  const setEnabled = useSetLinkEnabled();
  const [editOpen, setEditOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);

  if (stats.isPending) {
    return (
      <div className="px-4 py-6 md:px-6">
        <LoadingState label={t('analytics.state.loading')}>
          <SkeletonText lines={8} />
        </LoadingState>
      </div>
    );
  }

  if (stats.isError) {
    return (
      <div className="px-4 py-6 md:px-6">
        <QueryErrorState
          error={stats.error}
          title={t('analytics.links.errorTitle')}
          description={t('analytics.links.errorBody')}
          permission={{
            title: t('analytics.state.permissionTitle'),
            description: t('analytics.state.permissionBody'),
          }}
          rateLimit={{
            title: t('analytics.state.rateLimitTitle', {
              provider: t('analytics.links.measurementLabel'),
            }),
            cause: t('analytics.state.rateLimitCause'),
            alternative: t('analytics.state.rateLimitAlternative'),
          }}
          onRetry={() => {
            void stats.refetch();
          }}
        />
      </div>
    );
  }

  const { link, measurement } = stats.data;
  const hasEvents = measurement.totalRequests > 0;

  return (
    <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
      <section className="flex flex-col gap-3">
        <h2 className="text-title-md text-text-primary">
          {t('analytics.links.detailTitle', { slug: link.slug })}
        </h2>

        {link.state === 'disabled' ? (
          <Notice
            tone="destructive"
            liveness="status"
            title={t('analytics.links.state.disabled')}
            description={t('analytics.links.state.disabledReason', {
              actor: link.disabledByName ?? t('common.unknown'),
              date: link.disabledAt ? format.date(link.disabledAt) : t('common.unknown'),
              reason: link.disabledReason ?? t('common.notSet'),
            })}
            actions={
              <Button
                size="sm"
                variant="secondary"
                loading={setEnabled.isPending}
                onClick={() =>
                  setEnabled.mutate({
                    shortLinkId: link.id,
                    enabled: true,
                    reason: '',
                    idempotencyKey: crypto.randomUUID(),
                  })
                }
              >
                {t('analytics.links.enable')}
              </Button>
            }
          />
        ) : null}

        <DefinitionList
          layout="columns"
          items={[
            {
              id: 'short',
              term: t('analytics.links.shortUrl'),
              definition: <Code>{link.shortUrl}</Code>,
            },
            {
              id: 'destination',
              term: t('analytics.links.exactRedirect'),
              definition: (
                <span className="break-all">{link.destination}</span>
              ),
              hint: t('analytics.links.exactRedirectHelp'),
            },
            {
              id: 'domain',
              term: t('analytics.links.domainLabel'),
              definition: (
                <span className="flex flex-wrap items-center gap-2">
                  {link.domain.state === 'default'
                    ? t('analytics.links.domainDefault')
                    : link.domain.host}
                  <CapabilityBadge
                    state={DOMAIN_CAPABILITY[link.domain.state]}
                    label={
                      link.domain.state === 'verified'
                        ? t('analytics.links.domainVerified', {
                            date: link.domain.verifiedAt
                              ? format.date(link.domain.verifiedAt)
                              : '',
                          })
                        : link.domain.state === 'pending'
                          ? t('analytics.links.domainPending')
                          : link.domain.state === 'failed'
                            ? t('analytics.links.domainFailed', {
                                date: link.domain.lastCheckedAt
                                  ? format.date(link.domain.lastCheckedAt)
                                  : '',
                              })
                            : t('analytics.links.domainDefault')
                    }
                  />
                </span>
              ),
              hint:
                link.domain.state === 'pending' && link.domain.dnsRecordValue ? (
                  <span className="flex flex-col gap-1">
                    <span>
                      {t('analytics.links.domainPendingHelp', { domain: link.domain.host })}
                    </span>
                    <Code block>
                      {link.domain.dnsRecordName} TXT {link.domain.dnsRecordValue}
                    </Code>
                  </span>
                ) : undefined,
            },
            {
              id: 'campaign',
              term: t('analytics.links.campaign'),
              definition: link.campaign ?? t('common.notSet'),
            },
            {
              id: 'expiry',
              term: t('analytics.links.expiry'),
              definition: link.expiresAt
                ? format.dateTime(link.expiresAt)
                : t('analytics.links.expiryNone'),
              hint: t('analytics.links.expiryHelp'),
            },
            {
              id: 'usage',
              term: t('common.details'),
              definition: t('analytics.links.usedIn', { count: link.usedInPostCount }),
            },
          ]}
        />

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>
            {t('analytics.links.editDestination')}
          </Button>
          {link.state !== 'disabled' ? (
            <Button size="sm" variant="destructive" onClick={() => setDisableOpen(true)}>
              {t('analytics.links.disable')}
            </Button>
          ) : null}
          {abuseReportHref ? (
            <Button size="sm" variant="ghost" asChild>
              <a href={abuseReportHref}>{t('analytics.links.abuseAction')}</a>
            </Button>
          ) : null}
        </div>

        {link.domain.state === 'pending' ? (
          <Button size="sm" variant="ghost" className="self-start">
            {t('analytics.links.domainCheck')}
          </Button>
        ) : null}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-title-sm text-text-primary">
          {t('analytics.links.destinationHistory')}
        </h3>
        <ul className="flex flex-col border-t border-border-subtle">
          {link.destinationHistory.map((version) => (
            <li
              key={version.id}
              className="flex flex-col gap-0.5 border-b border-border-subtle py-2"
            >
              <span className="break-all text-body-md text-text-primary">
                {version.activeTo === null
                  ? t('analytics.links.destinationHistoryCurrent', {
                      destination: version.url,
                      start: format.date(version.activeFrom),
                    })
                  : t('analytics.links.destinationHistoryRow', {
                      destination: version.url,
                      start: format.date(version.activeFrom),
                      end: format.date(version.activeTo),
                    })}
              </span>
              <span className="text-body-sm text-text-tertiary">
                {t('common.createdBy')}
                <span className="ps-1.5">{version.changedByName}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <div className="flex max-w-[70ch] flex-col gap-1">
          <h3 className="text-title-sm text-text-primary">
            {t('analytics.links.measurementLabel')}
          </h3>
          <p className="text-body-md text-text-secondary">
            {t('analytics.links.measurementExplained')}
          </p>
          <p className="text-body-sm text-text-tertiary">
            {t('analytics.links.separateSources')}
          </p>
        </div>

        {!hasEvents ? (
          <EmptyState
            compact
            title={t('analytics.links.noEvents')}
            description={t('analytics.links.noEventsBody')}
          />
        ) : (
          <>
            <DefinitionList
              layout="columns"
              items={[
                {
                  id: 'requests',
                  term: t('analytics.links.totalRequests'),
                  definition: (
                    <span className="tabular-nums">
                      {format.count(measurement.totalRequests)}
                    </span>
                  ),
                },
                {
                  id: 'clicks',
                  term: t('analytics.links.humanClicks'),
                  definition: (
                    <span className="tabular-nums">
                      {format.count(measurement.deduplicatedClicks)}
                    </span>
                  ),
                },
                {
                  id: 'bots',
                  term: t('analytics.links.suspectedBots'),
                  definition: (
                    <span className="tabular-nums">
                      {format.count(measurement.suspectedBots)}
                    </span>
                  ),
                  hint: t('analytics.links.botsNote', {
                    count: measurement.suspectedBots,
                  }),
                },
                {
                  id: 'last',
                  term: t('analytics.links.lastEventLabel'),
                  definition: measurement.lastEventAt
                    ? format.relative(measurement.lastEventAt)
                    : t('analytics.links.noEvents'),
                },
              ]}
            />

            <TrendChart
              unit="count"
              title={t('analytics.links.series.title')}
              summary={t('analytics.chart.summary', {
                metric: t('analytics.links.series.clicks'),
                account: link.slug,
                count: measurement.series.length,
                start: format.date(measurement.periodStart),
                end: format.date(measurement.periodEnd),
              })}
              series={[
                {
                  id: 'requests',
                  normalizedName: 'link_clicks',
                  unit: 'count',
                  label: t('analytics.links.series.requests'),
                  points: measurement.series.map((point) => ({
                    bucketStart: point.bucketStart,
                    bucketSeconds: point.bucketSeconds,
                    value: point.requests,
                  })),
                },
                {
                  id: 'clicks',
                  normalizedName: 'link_clicks',
                  unit: 'count',
                  label: t('analytics.links.series.clicks'),
                  points: measurement.series.map((point) => ({
                    bucketStart: point.bucketStart,
                    bucketSeconds: point.bucketSeconds,
                    value: point.clicks,
                  })),
                },
              ]}
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <BreakdownList
                title={t('analytics.links.referrerClass')}
                entries={measurement.referrers}
                emptyText={t('analytics.links.noEvents')}
                labelFor={(key) => t(referrerLabelKey(key))}
              />
              <BreakdownList
                title={t('analytics.links.deviceClass')}
                entries={measurement.devices}
                emptyText={t('analytics.links.noEvents')}
                labelFor={(key) => t(deviceLabelKey(key))}
              />
              <BreakdownList
                title={t('analytics.links.country')}
                entries={measurement.countries}
                emptyText={t('analytics.links.countryUnknown')}
                labelFor={(key) =>
                  key === 'unknown' ? t('analytics.links.countryUnknown') : key
                }
              />
            </div>

            <p className="max-w-[70ch] text-body-sm text-text-tertiary">
              {t('analytics.links.privacyNote')}
            </p>
          </>
        )}
      </section>

      <DestinationEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        link={link}
        submitting={updateDestination.isPending}
        onSubmit={({ destination, reason }) => {
          updateDestination.mutate(
            {
              shortLinkId: link.id,
              destination,
              reason,
              idempotencyKey: crypto.randomUUID(),
            },
            { onSuccess: () => setEditOpen(false) },
          );
        }}
      />

      <ConfirmDialog
        open={disableOpen}
        onOpenChange={setDisableOpen}
        tone="destructive"
        title={t('analytics.links.disableTitle', { slug: link.slug })}
        description={t('analytics.links.disableBody')}
        consequences={[
          {
            id: 'posts',
            text: t('analytics.links.usedIn', { count: link.usedInPostCount }),
          },
          { id: 'audit', text: t('analytics.links.editDestinationAudit') },
        ]}
        confirmLabel={t('action.disable')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={() =>
          setEnabled.mutateAsync({
            shortLinkId: link.id,
            enabled: false,
            reason: '',
            idempotencyKey: crypto.randomUUID(),
          })
        }
      />
    </div>
  );
}
