'use client';

import { Check } from 'lucide-react';

import { Link } from '@/components/link';

import {
  EmptyState,
  ErrorState,
  LoadingState,
  SkeletonList,
  Timeline,
  type TimelineEvent,
} from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';

import { ApiError } from '@/lib/api';
import { useRecentReceipts } from '@/lib/api/hooks';
import { useFormatters, useTranslations } from '@/lib/i18n';
import { EmptyScene } from '@/components/empty';
import { LiveBadge } from '@/components/motion';

import { HomeSection } from './section';

/**
 * Recent receipts.
 *
 * A timeline rather than a list of cards, because what the reader is doing here
 * is checking a sequence: what published, when, and whether anything inside it
 * failed. A partial publication says so on the row and never reads as a plain
 * success.
 */
export function RecentReceipts() {
  const t = useTranslations();
  const format = useFormatters();
  const query = useRecentReceipts(4);
  const receipts = query.data?.data ?? [];

  const events: TimelineEvent[] = receipts.map((receipt) => ({
    id: receipt.receiptId,
    title: (
      <Link href={`/posts/${receipt.contentItemId}`} className="hover:underline">
        {receipt.title}
      </Link>
    ),
    ...(receipt.publishedAt === null
      ? {}
      : { timestamp: format.dateTime(receipt.publishedAt), isoTimestamp: receipt.publishedAt }),
    actor: t('home.receipts.publishedTo', { account: receipt.accountLabel }),
    // A published receipt carries the live badge rather than a state word:
    // this row is reporting an event that happened, and the badge is the
    // gesture this product uses for that everywhere else. A partial one keeps
    // its sentence, because "some of it worked" is not something a badge can
    // say honestly.
    detail:
      receipt.failedItemCount > 0 ? (
        t('state.partially_published.description', {
          published: 1,
          failed: receipt.failedItemCount,
        })
      ) : receipt.state === 'published' ? (
        <LiveBadge
          live
          label={t('state.published.label')}
          icon={<Check aria-hidden="true" className="size-3" />}
          className="px-2 py-0.5"
        />
      ) : (
        t(`state.${receipt.state}.label`)
      ),
    outcome:
      receipt.state === 'published'
        ? ('completed' as const)
        : receipt.state === 'partially_published'
          ? ('warning' as const)
          : ('failed' as const),
  }));

  return (
    <HomeSection
      id="home-receipts"
      title={t('home.receipts.title')}
      link={{ href: '/calendar', label: t('home.upcoming.viewAll') }}
    >
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
      ) : events.length === 0 ? (
        <EmptyState
          compact
          illustration={<EmptyScene scene="receipts" />}
          title={t('home.receipts.empty')}
          description={t('home.receipts.emptyBody')}
          action={
            <Button variant="secondary" size="sm" asChild>
              <Link href="/compose">{t('empty.calendar.action')}</Link>
            </Button>
          }
        />
      ) : (
        <Timeline label={t('receipt.timeline.title')} events={events} />
      )}
    </HomeSection>
  );
}
