'use client';

/**
 * One connected account.
 *
 * The list answers "which accounts need me". This page answers "what can this
 * specific account actually do", which is a different question and needs the
 * account's own capability snapshot rather than the platform's general one.
 * An Instagram creator account and an Instagram business account are the same
 * platform and different answers.
 */

import type { ReactNode } from 'react';
import {
  Badge,
  Button,
  DefinitionList,
  ErrorState,
  FreshnessLabel,
  LoadingState,
  Notice,
  PageHeader,
  SkeletonList,
  SkeletonText,
  cn,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { useQuery } from '@tanstack/react-query';
import { api, keys, type ApiError } from '@/lib/api';
import { useWorkspaceId } from '@/lib/auth/session-context';
import { useCalendarFormat } from '@/features/calendar/format';
import { CapabilityMatrixView } from './capability-matrix-view';
import { buildCapabilityMatrix } from './capability-matrix';
import { AccountIdentity, useAccountTypeName, useProviderName } from './provider';
import { healthTone, remediationKey } from './health';
import { useConnectionCapabilities } from './use-connections';
import type { ConnectionRow } from './types';

export interface ConnectionDetailScreenProps {
  connectionId: string;
  listHref: string;
}

export function ConnectionDetailScreen({
  connectionId,
  listHref,
}: ConnectionDetailScreenProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();
  const accountTypeName = useAccountTypeName();
  const workspaceId = useWorkspaceId();

  const connection = useQuery<ConnectionRow, ApiError>({
    queryKey: keys.connection(workspaceId, connectionId),
    queryFn: async () => (await api.connections.get(connectionId)) as ConnectionRow,
  });
  const capabilities = useConnectionCapabilities(connectionId);

  if (connection.isPending) {
    return (
      <div className="flex min-h-full flex-col">
        <PageHeader title={t('capability.title')} />
        <div className="px-4 py-6 md:px-6">
          <LoadingState label={t('web.connection.loading')}>
            <div className="flex flex-col gap-6">
              <SkeletonText lines={2} />
              <SkeletonList rows={5} avatar={false} />
            </div>
          </LoadingState>
        </div>
      </div>
    );
  }

  if (connection.isError) {
    return (
      <div className="flex min-h-full flex-col">
        <PageHeader title={t('capability.title')} />
        <div className="px-4 py-6 md:px-6">
          <ErrorState
            title={t('web.connection.error.title')}
            description={t('web.connection.error.body')}
            onRetry={() => void connection.refetch()}
            retryLabel={t('action.retry')}
            secondaryAction={
              <Button variant="ghost" size="sm" asChild>
                <a href={listHref}>{t('connection.title')}</a>
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const row = connection.data;
  const tone = healthTone(row.health);
  const incidentKey = remediationKey(row.health, row.provider);
  const snapshot = capabilities.data ?? null;
  const matrix = buildCapabilityMatrix(snapshot ? [snapshot] : []);

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        breadcrumb={{
          label: t('a11y.region.navigation'),
          items: [
            { id: 'connections', label: t('connection.title'), href: listHref },
            { id: 'account', label: row.displayName },
          ],
        }}
        title={row.displayName}
        description={t('receipt.target', {
          account: row.displayName,
          provider: providerName(row.provider),
        })}
      />

      <div className="flex flex-col gap-8 px-4 py-6 md:px-6">
        <section aria-labelledby="connection-summary" className="flex flex-col gap-3">
          <h2 id="connection-summary" className="text-title-sm text-text-primary">
            {t('common.summary')}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <AccountIdentity
              provider={row.provider}
              accountLabel={row.displayName}
              secondary={row.handle ?? undefined}
            />
            <Badge tone="outline">{accountTypeName(row.accountType)}</Badge>
            <Badge
              tone={
                tone === 'destructive'
                  ? 'destructive'
                  : tone === 'warning'
                    ? 'warning'
                    : tone === 'ok'
                      ? 'success'
                      : 'neutral'
              }
            >
              {t(`web.connection.healthFilter.${row.health}`)}
            </Badge>
          </div>

          {incidentKey ? (
            <Notice
              tone={tone === 'destructive' ? 'destructive' : 'warning'}
              title={t('web.connection.incident.title')}
              description={t(incidentKey, {
                provider: providerName(row.provider),
                account: row.displayName,
                permission: '',
                date: row.expiresAt ? format.date(row.expiresAt) : '',
              })}
            />
          ) : null}

          <DefinitionList
            layout="responsive"
            items={[
              {
                id: 'connected',
                term: t('connection.account.label'),
                definition: t('connection.connectedBy', {
                  name: row.connectedByName,
                  date: format.date(row.connectedAt),
                }),
              },
              {
                id: 'expiry',
                term: t('web.connection.detail.expiryLabel'),
                definition: row.expiresAt ? (
                  <time dateTime={row.expiresAt}>{format.dateTime(row.expiresAt)}</time>
                ) : (
                  <span className="text-text-tertiary">
                    {t('connection.token.expiryUnknown', {
                      provider: providerName(row.provider),
                    })}
                  </span>
                ),
              },
              {
                id: 'published',
                term: t('calendar.queue.published'),
                definition: row.lastPublishedAt
                  ? t('connection.lastPublished', {
                      relativeTime: format.relative(row.lastPublishedAt),
                    })
                  : t('connection.lastPublishedNever'),
              },
              {
                id: 'analytics',
                term: t('capability.feature.analytics'),
                definition: row.lastAnalyticsSyncAt ? (
                  <FreshnessLabel
                    level="aging"
                    text={t('connection.lastAnalyticsSync', {
                      relativeTime: format.relative(row.lastAnalyticsSyncAt),
                    })}
                    isoTimestamp={row.lastAnalyticsSyncAt}
                  />
                ) : (
                  <span className="text-text-tertiary">{t('common.unavailable')}</span>
                ),
              },
            ]}
          />
        </section>

        <section aria-labelledby="connection-capabilities" className={cn('flex flex-col gap-3')}>
          <h2 id="connection-capabilities" className="text-title-sm text-text-primary">
            {t('capability.title')}
          </h2>
          {capabilities.isPending ? (
            <LoadingState label={t('web.connection.loading')}>
              <SkeletonList rows={5} avatar={false} />
            </LoadingState>
          ) : snapshot === null ? (
            <Notice
              tone="warning"
              title={t('web.connection.capability.noSnapshot')}
              description={t('connection.reconnect.body')}
            />
          ) : (
            <CapabilityMatrixView matrix={matrix} accountLabel={row.displayName} />
          )}
        </section>
      </div>
    </div>
  );
}
