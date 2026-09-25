'use client';

import { Link } from '@/components/link';

import { EmptyState, ErrorState, LoadingState, SkeletonList } from '@relay/design-system/patterns';
import { Button, StatusDot } from '@relay/design-system/primitives';

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
 * A workspace-level summary followed only by accounts that need attention.
 * Healthy account detail belongs on Connections; Home stays a decision surface.
 */
export function ConnectionHealth() {
  const t = useTranslations();
  const format = useFormatters();
  const query = useConnections();
  const connections = query.data?.data ?? [];

  const healthy = connections.filter((connection) => HEALTHY_STATES.has(connection.health)).length;
  const attention = connections.length - healthy;

  const needsAttention = connections.filter((connection) => !HEALTHY_STATES.has(connection.health));

  return (
    <HomeSection
      id="home-connections"
      title={t('home.connections.title')}
      summary={
        connections.length === 0
          ? undefined
          : t('home.v2.connections.summary', { healthy, attention })
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
      ) : connections.length === 0 ? (
        <EmptyState
          compact
          title={t('empty.connections.title')}
          description={t('empty.connections.body')}
          action={
            <Button variant="secondary" size="sm" asChild>
              <Link href="/connections">{t('empty.connections.action')}</Link>
            </Button>
          }
        />
      ) : needsAttention.length === 0 ? null : (
        <ul className="border-border-subtle flex flex-col border-t">
          {needsAttention.map((connection) => {
            const dot = providerDotKey(connection.provider);

            return (
              <li
                key={connection.id}
                className="border-border-subtle flex flex-wrap items-center gap-x-3 gap-y-1 border-b py-4"
              >
                {dot === undefined ? null : <StatusDot provider={dot} aria-hidden="true" />}
                <Link
                  href={`/connections/${connection.id}`}
                  className="text-body-md text-text-primary decoration-warning-border hover:decoration-warning-fg min-w-0 flex-1 truncate underline underline-offset-2"
                >
                  {connection.displayName}
                </Link>

                <span className="text-body-sm text-warning-fg font-medium">
                  {t(HEALTH_LABEL_KEY[connection.health], {
                    relativeTime:
                      connection.expiresAt === null ? '' : format.relative(connection.expiresAt),
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
