'use client';

import { useMemo } from 'react';

import { Link } from '@/components/link';

import {
  EmptyState,
  ErrorState,
  LoadingState,
  SkeletonTable,
  StatusPill,
} from '@relay/design-system/patterns';
import { Button, StatusDot } from '@relay/design-system/primitives';

import { ApiError } from '@/lib/api';
import { useCalendar } from '@/lib/api/hooks';
import { useSession } from '@/lib/auth/session-context';
import { useFormatters, useTranslations } from '@/lib/i18n';

import { providerDotKey } from '@/components/shell/action-center-catalog';

import { HomeSection } from './section';

const DAY_MS = 86_400_000;

/**
 * The next 24 hours.
 *
 * A table at 768px and above, meaningful rows below it. Times are in the
 * workspace zone and the zone is named under the heading, because a queue that
 * does not say which clock it is on is a scheduling incident waiting to happen.
 */
export function UpcomingQueue() {
  const t = useTranslations();
  const format = useFormatters();
  const { workspace } = useSession();

  const range = useMemo(() => {
    const now = new Date();
    return {
      from: now.toISOString(),
      to: new Date(now.getTime() + DAY_MS).toISOString(),
    };
  }, []);
  const query = useCalendar(range);
  const entries = query.data?.data ?? [];

  return (
    <HomeSection
      id="home-upcoming"
      title={t('home.upcoming.title')}
      meta={t('home.upcoming.timeZoneNote', { timeZone: workspace.timeZone })}
      link={{ href: '/calendar', label: t('home.upcoming.viewAll') }}
    >
      {query.isPending ? (
        <LoadingState label={t('loading.calendar')}>
          <SkeletonTable rows={3} columns={4} />
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
      ) : entries.length === 0 ? (
        <EmptyState
          compact
          title={t('home.upcoming.empty')}
          description={t('home.upcoming.emptyBody')}
          action={
            <Button variant="primary" size="sm" asChild>
              <Link href="/compose">{t('empty.calendar.action')}</Link>
            </Button>
          }
        />
      ) : (
        <div className="relay-scroll-x">
          <table className="text-body-md w-full border-collapse">
            <caption className="sr-only">{t('home.upcoming.title')}</caption>
            <thead>
              <tr className="border-border-subtle border-y text-start">
                <th
                  scope="col"
                  className="text-label text-text-tertiary py-2 pe-4 text-start font-medium"
                >
                  {t('home.upcoming.columnTime')}
                </th>
                <th
                  scope="col"
                  className="text-label text-text-tertiary py-2 pe-4 text-start font-medium"
                >
                  {t('home.upcoming.columnAccount')}
                </th>
                <th
                  scope="col"
                  className="text-label text-text-tertiary py-2 pe-4 text-start font-medium"
                >
                  {t('home.upcoming.columnContent')}
                </th>
                <th
                  scope="col"
                  className="text-label text-text-tertiary py-2 text-start font-medium"
                >
                  {t('home.upcoming.columnStatus')}
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const dot = providerDotKey(entry.provider);
                return (
                  <tr key={entry.contentItemId} className="border-border-subtle border-b align-top">
                    <td className="text-text-primary py-2.5 pe-4 whitespace-nowrap">
                      <time dateTime={entry.scheduledAt}>{format.time(entry.scheduledAt)}</time>
                    </td>
                    <td className="text-text-secondary py-2.5 pe-4">
                      <span className="flex items-center gap-1.5">
                        {dot === undefined ? null : <StatusDot provider={dot} aria-hidden="true" />}
                        <span className="truncate">{entry.accountLabel}</span>
                      </span>
                    </td>
                    <td className="text-text-primary py-2.5 pe-4">
                      <Link href={`/posts/${entry.contentItemId}`} className="hover:underline">
                        {entry.title}
                      </Link>
                      {entry.targetCount > 1 ? (
                        <span className="text-body-sm text-text-tertiary ps-2">
                          {t('calendar.post.targetCount', { count: entry.targetCount })}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2.5">
                      <StatusPill
                        size="sm"
                        state={entry.state}
                        label={t(`state.${entry.state}.label`)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </HomeSection>
  );
}
