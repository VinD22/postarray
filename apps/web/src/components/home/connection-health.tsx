'use client';

import { Link } from '@/components/link';

import { EmptyState, ErrorState, LoadingState, SkeletonList } from '@relay/design-system/patterns';
import { Button, StatusDot } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { ApiError, type ConnectionHealth } from '@/lib/api';
import { useConnections } from '@/lib/api/hooks';
import { useFormatters, useTranslations } from '@/lib/i18n';

import { providerDotKey } from '@/components/shell/action-center-catalog';

import { HomeSection } from './section';

const HEALTH_LABEL_KEY: Readonly<Record<ConnectionHealth, string>> = {
  healthy: 'connection.status.healthy',
  expiring_soon: 'connection.status.expiringSoon',
  expired: 'connection.status.expired',
  revoked: 'connection.status.revoked',
  paused: 'connection.status.paused',
  permission_missing: 'connection.status.permissionMissing',
  review_pending: 'connection.status.reviewPending',
  unknown: 'connection.status.unknown',
};

const HEALTHY_STATES: ReadonlySet<ConnectionHealth> = new Set<ConnectionHealth>(['healthy']);

/**
 * Connection health.
 *
 * One row per account: the identity dot, the account name, the health word and
 * the last publish. Accounts that need attention sort first, because that is
 * the only reason this block is on Home.
 */
export function ConnectionHealth() {
  const t = useTranslations();
  const format = useFormatters();
  const query = useConnections();
  const connections = query.data?.data ?? [];

  const healthy = connections.filter((connection) => HEALTHY_STATES.has(connection.health)).length;
  const attention = connections.length - healthy;

  const sorted = [...connections].sort((left, right) => {
    const leftNeeds = HEALTHY_STATES.has(left.health) ? 1 : 0;
    const rightNeeds = HEALTHY_STATES.has(right.health) ? 1 : 0;
    return leftNeeds - rightNeeds;
  });

  return (
    <HomeSection
      id="home-connections"
      title={t('home.connections.title')}
      meta={
        connections.length === 0 ? undefined : t('home.connections.summary', { healthy, attention })
      }
      link={{ href: '/connections', label: t('home.connections.viewAll') }}
    >
      {query.isPending ? (
        <LoadingState label={t('loading.default')}>
          <SkeletonList rows={3} />
        </LoadingState>
      ) : query.error ? (
        <ErrorState
          title={t('home.error.title')}
          description={t(
            ApiError.is(query.error) ? query.error.actionKey : 'error.internal.action',
            ApiError.is(query.error) ? query.error.messageValues : {},
          )}
          onRetry={() => {
            void query.refetch();
          }}
          retryLabel={t('action.retry')}
        />
      ) : sorted.length === 0 ? (
        <EmptyState
          compact
          title={t('empty.connections.title')}
          description={t('empty.connections.body')}
          action={
            <Button variant="primary" size="sm" asChild>
              <Link href="/connections">{t('empty.connections.action')}</Link>
            </Button>
          }
        />
      ) : (
        <ul className="border-border-subtle flex flex-col border-t">
          {sorted.map((connection) => {
            const dot = providerDotKey(connection.provider);
            const needsAttention = !HEALTHY_STATES.has(connection.health);

            return (
              <li
                key={connection.id}
                className="border-border-subtle flex flex-wrap items-center gap-x-3 gap-y-1 border-b py-2.5"
              >
                {dot === undefined ? null : (
                  <StatusDot
                    provider={dot}
                    aria-hidden="true"
                    className={cn(!needsAttention && 'relay-dot-settle motion-reduce:animate-none')}
                  />
                )}
                <Link
                  href={`/connections/${connection.id}`}
                  className={cn(
                    'text-body-md min-w-0 flex-1 truncate hover:underline',
                    needsAttention
                      ? 'text-text-primary decoration-warning-border underline underline-offset-2'
                      : 'text-text-primary',
                  )}
                >
                  {connection.displayName}
                </Link>

                <span
                  className={cn(
                    'text-body-sm',
                    needsAttention ? 'text-warning-fg font-medium' : 'text-text-secondary',
                  )}
                >
                  {t(HEALTH_LABEL_KEY[connection.health], {
                    relativeTime:
                      connection.expiresAt === null ? '' : format.relative(connection.expiresAt),
                  })}
                </span>

                <span className="text-body-sm text-text-tertiary">
                  {connection.lastPublishedAt === null
                    ? t('connection.lastPublishedNever')
                    : t('connection.lastPublished', {
                        relativeTime: format.relative(connection.lastPublishedAt),
                      })}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </HomeSection>
  );
}
