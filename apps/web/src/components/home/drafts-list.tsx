'use client';

import { useQuery } from '@tanstack/react-query';

import {
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  SkeletonList,
} from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';

import { Link } from '@/components/link';
import { ApiError, api } from '@/lib/api';
import { keys } from '@/lib/api/keys';
import { useWorkspaceId } from '@/lib/auth/session-context';
import { useFormatters, useTranslations } from '@/lib/i18n';
import { useOnlineStatus } from '@/lib/utils/use-online-status';

import { draftsListState } from './drafts-list-state';

import { HomeSection } from './section';

const DRAFT_ROWS = 4;

/**
 * Continue drafting.
 *
 * Drafts as rows, most recently edited first, each one reopening the composer
 * on its own URL so nothing typed is lost between sessions. The list reads the
 * same `/content` endpoint every other surface lists drafts through.
 *
 * Seven states, from `draftsListState`: loading, empty, ready, partial (rows
 * from the last good read with a note that the refresh failed), offline,
 * permission denied and rate limited, plus a generic error.
 */
export function DraftsList() {
  const t = useTranslations();
  const format = useFormatters();
  const workspaceId = useWorkspaceId();
  const query = useQuery({
    queryKey: [...keys.content(workspaceId, { state: 'draft' }), DRAFT_ROWS],
    queryFn: () => api.content.list({ state: 'draft', limit: DRAFT_ROWS }),
  });
  const online = useOnlineStatus();
  const drafts = [...(query.data?.data ?? [])].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );
  const apiError = ApiError.is(query.error) ? query.error : null;
  const state = draftsListState({
    isPending: query.isPending,
    hasData: query.data !== undefined,
    rowCount: drafts.length,
    failed: query.error !== null,
    apiError,
    online,
  });
  const retry = () => {
    void query.refetch();
  };

  return (
    <HomeSection id="home-drafts" title={t('home.v2.drafts.title')}>
      {state === 'loading' ? (
        <LoadingState label={t('loading.default')}>
          <SkeletonList rows={3} avatar={false} />
        </LoadingState>
      ) : state === 'offline' ? (
        <Notice tone="neutral" title={t('home.v2.drafts.offlineTitle')}>
          {t('home.v2.drafts.offlineBody')}
        </Notice>
      ) : state === 'denied' ? (
        <Notice tone="neutral" title={t('home.v2.drafts.deniedTitle')}>
          {t('error.forbidden.action')}
        </Notice>
      ) : state === 'rateLimited' ? (
        <ErrorState
          title={t('home.v2.drafts.rateLimitedTitle')}
          description={t('home.v2.drafts.rateLimitedBody')}
          onRetry={retry}
          retrying={query.isFetching}
          retryLabel={t('action.retry')}
        />
      ) : state === 'error' ? (
        <ErrorState
          title={t('home.v2.drafts.errorTitle')}
          description={t(
            apiError ? apiError.actionKey : 'error.internal.action',
            apiError ? apiError.messageValues : {},
          )}
          onRetry={retry}
          retrying={query.isFetching}
          retryLabel={t('action.retry')}
        />
      ) : state === 'empty' ? (
        <EmptyState
          compact
          title={t('home.v2.drafts.empty')}
          description={t('home.v2.drafts.emptyBody')}
          action={
            <Button variant="secondary" size="sm" asChild>
              <Link href="/compose">{t('empty.calendar.action')}</Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {state === 'partial' ? (
            <Notice tone="neutral" title={t('home.v2.drafts.staleTitle')}>
              {online ? t('home.v2.drafts.staleBody') : t('home.v2.drafts.offlineBody')}
            </Notice>
          ) : null}
          <ol className="border-border-subtle border-t">
            {drafts.map((draft) => {
              const title = draft.title.trim() || draft.body.trim();
              return (
                <li
                  key={draft.id}
                  className="border-border-subtle flex flex-col gap-1.5 border-b py-4"
                >
                  <Link
                    href={`/compose?contentItemId=${encodeURIComponent(draft.id)}`}
                    className="text-body-lg text-text-primary w-fit max-w-full truncate font-medium hover:underline"
                  >
                    {title === '' ? t('home.v2.drafts.untitled') : title}
                  </Link>
                  <time dateTime={draft.updatedAt} className="text-label text-text-tertiary">
                    {t('home.v2.drafts.edited', { time: format.dateTime(draft.updatedAt) })}
                  </time>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </HomeSection>
  );
}
