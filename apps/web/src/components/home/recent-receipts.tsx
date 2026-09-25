'use client';

import { Link } from '@/components/link';

import { EmptyState, ErrorState, LoadingState, SkeletonList } from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';

import { ApiError } from '@/lib/api';
import { useRecentReceipts } from '@/lib/api/hooks';
import { useFormatters, useTranslations } from '@/lib/i18n';
import { EmptyScene } from '@/components/empty';

import { HomeSection } from './section';

/**
 * Recent receipts.
 *
 * A compact sequence of publication evidence. It keeps the title, outcome and
 * time, while account details live on the receipt itself. A partial publication
 * still says so in full and never reads as a plain success.
 */
export function RecentReceipts() {
  const t = useTranslations();
  const format = useFormatters();
  const query = useRecentReceipts(3);
  const receipts = query.data?.data ?? [];

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
      ) : receipts.length === 0 ? (
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
        <ol className="border-border-subtle border-t">
          {receipts.map((receipt) => (
            <li
              key={receipt.receiptId}
              className="border-border-subtle flex flex-col gap-1.5 border-b py-4"
            >
              <Link
                href={`/posts/${receipt.contentItemId}`}
                className="text-body-lg text-text-primary w-fit max-w-full truncate font-medium hover:underline"
              >
                {receipt.title}
              </Link>
              <p className="text-body-sm text-text-tertiary">
                {receipt.failedItemCount > 0
                  ? t('state.partially_published.description', {
                      published: 1,
                      failed: receipt.failedItemCount,
                    })
                  : t(`state.${receipt.state}.label`)}
              </p>
              {receipt.publishedAt === null ? null : (
                <time dateTime={receipt.publishedAt} className="text-label text-text-tertiary">
                  {format.dateTime(receipt.publishedAt)}
                </time>
              )}
            </li>
          ))}
        </ol>
      )}
    </HomeSection>
  );
}
