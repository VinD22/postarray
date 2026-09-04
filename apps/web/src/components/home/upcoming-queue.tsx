'use client';

import { useMemo } from 'react';

import { Link } from '@/components/link';

import {
  EmptyState,
  ErrorState,
  LoadingState,
  SkeletonList,
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
 * A timeline list at every width. Times are in the workspace zone and the zone
 * is named under the heading, because a queue that does not say which clock it
 * is on is a scheduling incident waiting to happen.
 */
export function UpcomingQueue() {
  const t = useTranslations();
  const format = useFormatters();
  const { workspace, project } = useSession();

  const range = useMemo(() => {
    const now = new Date();
    return {
      from: now.toISOString(),
      to: new Date(now.getTime() + DAY_MS).toISOString(),
    };
  }, []);
  const query = useCalendar({ ...range, ...(project === null ? {} : { projectId: project.id }) });
  const entries = query.data?.data ?? [];

  return (
    <HomeSection
      id="home-upcoming"
      title={t('home.upcoming.title')}
      meta={t('home.v2.queue.timeZone', { timeZone: workspace.timeZone })}
      link={{ href: '/calendar', label: t('home.upcoming.viewAll') }}
    >
      {query.isPending ? (
        <LoadingState label={t('loading.calendar')}>
          <SkeletonList rows={4} avatar={false} />
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
            <Button variant="secondary" size="sm" asChild>
              <Link href="/compose">{t('empty.calendar.action')}</Link>
            </Button>
          }
        />
      ) : (
        <ol className="border-border-subtle border-t">
          {entries.slice(0, 5).map((entry) => {
            const dot = providerDotKey(entry.provider);
            return (
              <li
                key={entry.contentItemId}
                className="border-border-subtle grid gap-3 border-b py-4 md:grid-cols-[6rem_minmax(0,1fr)_auto] md:items-center md:gap-5"
              >
                <time
                  dateTime={entry.scheduledAt}
                  className="text-body-md text-text-primary font-mono whitespace-nowrap"
                >
                  {format.time(entry.scheduledAt)}
                </time>

                <div className="flex min-w-0 flex-col gap-1.5">
                  <Link
                    href={`/posts/${entry.contentItemId}`}
                    className="text-body-lg text-text-primary w-fit max-w-full truncate font-medium hover:underline"
                  >
                    {entry.title}
                  </Link>
                  <p className="text-body-sm text-text-secondary flex min-w-0 flex-wrap items-center gap-1.5">
                    {dot === undefined ? null : <StatusDot provider={dot} aria-hidden="true" />}
                    <span className="truncate">{entry.accountLabel}</span>
                    {entry.targetCount > 1 ? (
                      <span className="text-text-tertiary">
                        {t('calendar.post.targetCount', { count: entry.targetCount })}
                      </span>
                    ) : null}
                  </p>
                </div>

                <StatusPill
                  size="sm"
                  state={entry.state}
                  label={t(`state.${entry.state}.label`)}
                  className="w-fit md:justify-self-end"
                />
              </li>
            );
          })}
        </ol>
      )}
    </HomeSection>
  );
}
