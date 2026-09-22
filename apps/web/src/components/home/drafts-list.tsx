'use client';

import { useQuery } from '@tanstack/react-query';

import { EmptyState, ErrorState, LoadingState, SkeletonList } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';

import { Link } from '@/components/link';
import { ApiError, api } from '@/lib/api';
import { keys } from '@/lib/api/keys';
import { useWorkspaceId } from '@/lib/auth/session-context';
import { useFormatters, useTranslations } from '@/lib/i18n';

import { HomeSection } from './section';

const DRAFT_ROWS = 4;

/**
 * Continue drafting.
 *
 * Drafts as rows, most recently edited first, each one reopening the composer
 * on its own URL so nothing typed is lost between sessions. The list reads the
 * same `/content` endpoint every other surface lists drafts through.
 */
export function DraftsList() {
  const t = useTranslations();
  const format = useFormatters();
  const workspaceId = useWorkspaceId();
  const query = useQuery({
    queryKey: [...keys.content(workspaceId, { state: 'draft' }), DRAFT_ROWS],
    queryFn: () => api.content.list({ state: 'draft', limit: DRAFT_ROWS }),
  });
  const drafts = [...(query.data?.data ?? [])].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );

  return (
    <HomeSection id="home-drafts" title={t('home.v2.drafts.title')}>
      {query.isPending ? (
        <LoadingState label={t('loading.default')}>
          <SkeletonList rows={3} avatar={false} />
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
      ) : drafts.length === 0 ? (
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
      )}
    </HomeSection>
  );
}
