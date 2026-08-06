'use client';

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
      <Link href={`/posts/${receipt.contentItemId}/receipt`} className="hover:underline">
        {receipt.title}
      </Link>
    ),
    ...(receipt.publishedAt === null
      ? {}
      : { timestamp: format.dateTime(receipt.publishedAt), isoTimestamp: receipt.publishedAt }),
    actor: t('home.receipts.publishedTo', { account: receipt.accountLabel }),
    detail:
      receipt.failedItemCount > 0
        ? t('state.partially_published.description', {
            published: 1,
            failed: receipt.failedItemCount,
          })
        : t(`state.${receipt.state}.label`),
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
      link={{ href: '/receipts', label: t('home.receipts.viewAll') }}
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
