'use client';

import { useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import {
  ConfirmDialog,
  DefinitionList,
  EmptyState,
  LoadingState,
  Notice,
  SkeletonText,
} from '@relay/design-system/patterns';
import { Badge, Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { QueryErrorState } from '@/features/analytics/components/query-error-state';
import { useValueFormat } from '@/features/analytics/use-value-format';

import { useDeleteFeed, useFeedHealth, useUpdateFeed } from './rss-queries';
import type { FeedItemOutcome } from './rss-types';

/**
 * One feed, its health and what it has actually produced.
 *
 * Feed health is four facts and they are all shown, because each one fails
 * differently: when we last checked, when the feed last had a new item, when we
 * last created something from it, and what the last error was. A feed that is
 * polled every hour and has produced nothing for a fortnight is working
 * perfectly and still needs somebody to look at it.
 *
 * Duplicates skipped is a first class number for the same reason. It is the
 * evidence that fingerprinting is doing its job rather than the feed being
 * quiet.
 */

const OUTCOME_KEY: Readonly<Record<FeedItemOutcome, string>> = {
  draft: 'automation.rss.itemOutcome.draft',
  scheduled: 'automation.rss.itemOutcome.scheduled',
  published: 'automation.rss.itemOutcome.published',
  awaiting_approval: 'automation.rss.itemOutcome.awaitingApproval',
  duplicate: 'automation.rss.itemOutcome.duplicate',
  failed: 'automation.rss.itemOutcome.failed',
};

const OUTCOME_TONE: Readonly<
  Record<FeedItemOutcome, 'neutral' | 'accent' | 'success' | 'warning' | 'destructive'>
> = {
  draft: 'neutral',
  scheduled: 'accent',
  published: 'success',
  awaiting_approval: 'warning',
  duplicate: 'neutral',
  failed: 'destructive',
};

export interface FeedDetailScreenProps {
  readonly feedId: string;
  readonly feedTitle?: string;
}

export function FeedDetailScreen({ feedId, feedTitle }: FeedDetailScreenProps): ReactElement {
  const t = useTranslations();
  const router = useRouter();
  const format = useValueFormat();
  const health = useFeedHealth(feedId);
  const update = useUpdateFeed();
  const remove = useDeleteFeed();
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (health.isPending) {
    return (
      <div className="px-4 py-6 md:px-6">
        <LoadingState label={t('automation.state.loading')}>
          <SkeletonText lines={6} />
        </LoadingState>
      </div>
    );
  }

  if (health.isError) {
    return (
      <div className="px-4 py-6 md:px-6">
        <QueryErrorState
          error={health.error}
          title={t('automation.rss.errorTitle')}
          description={t('automation.rss.errorBody')}
          permission={{
            title: t('automation.state.permissionTitle'),
            description: t('automation.state.permissionBody'),
          }}
          rateLimit={{
            title: t('automation.state.rateLimitTitle'),
            cause: t('automation.state.rateLimitCause'),
            alternative: t('automation.state.rateLimitAlternative'),
          }}
          onRetry={() => {
            void health.refetch();
          }}
        />
      </div>
    );
  }

  const data = health.data;
  const title = feedTitle ?? t('automation.rss.healthTitle');
  const paused = data.state === 'paused';

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-title-md text-text-primary">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            loading={update.isPending}
            onClick={() => update.mutate({ feedId, draft: {} })}
          >
            {paused ? t('automation.rss.resumeFeed') : t('automation.rss.pauseFeed')}
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            {t('action.remove')}
          </Button>
        </div>
      </div>

      {data.lastErrorReason ? (
        <Notice
          tone="warning"
          liveness="status"
          title={t('automation.rss.health.error', { reason: data.lastErrorReason })}
          description={t('automation.rss.errorBody')}
        />
      ) : null}

      <section aria-labelledby="feed-health-heading" className="flex flex-col gap-3">
        <h3 id="feed-health-heading" className="text-title-sm text-text-primary">
          {t('automation.rss.healthTitle')}
        </h3>
        <DefinitionList
          layout="columns"
          items={[
            {
              id: 'poll',
              term: t('automation.rss.health.lastPollLabel'),
              definition:
                data.lastPollAt === null ? t('common.notSet') : format.relative(data.lastPollAt),
              hint:
                data.nextPollAt === null
                  ? undefined
                  : t('automation.rss.health.nextPoll', {
                      relativeTime: format.relative(data.nextPollAt),
                    }),
            },
            {
              id: 'item',
              term: t('automation.rss.health.lastItemLabel'),
              definition:
                data.lastNewItemAt === null
                  ? t('common.notSet')
                  : format.relative(data.lastNewItemAt),
            },
            {
              id: 'post',
              term: t('automation.rss.health.lastPostLabel'),
              definition:
                data.lastCreatedDraftAt === null
                  ? t('common.notSet')
                  : format.relative(data.lastCreatedDraftAt),
            },
            {
              id: 'processed',
              term: t('automation.rss.health.processedLabel'),
              definition: t('automation.rss.health.itemsProcessed', {
                count: data.itemsProcessed,
              }),
              hint: t('automation.rss.health.duplicatesSkipped', {
                count: data.duplicatesSkipped,
              }),
            },
          ]}
        />
      </section>

      <section aria-labelledby="feed-items-heading" className="flex flex-col gap-3">
        <h3 id="feed-items-heading" className="text-title-sm text-text-primary">
          {t('automation.rss.recentItems')}
        </h3>

        {data.recentItems.length === 0 ? (
          <EmptyState
            compact
            title={t('automation.rss.recentItems')}
            description={t('automation.rules.runs.empty')}
          />
        ) : (
          <ul className="border-border-subtle flex flex-col border-t">
            {data.recentItems.map((item) => (
              <li
                key={item.id}
                className="border-border-subtle flex flex-col gap-1 border-b py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-body-md text-text-primary">{item.title}</span>
                  <time
                    dateTime={item.seenAt}
                    className="text-body-sm text-text-tertiary tabular-nums"
                  >
                    {format.dateTime(item.seenAt)}
                  </time>
                </div>
                <Badge tone={OUTCOME_TONE[item.outcome]}>
                  {t(OUTCOME_KEY[item.outcome], {
                    time: item.scheduledFor ? format.dateTime(item.scheduledFor) : '',
                    reason: item.failureReason ?? '',
                  })}
                </Badge>
              </li>
            ))}
          </ul>
        )}

        <Notice tone="neutral" title={t('automation.rss.dedupe')} />
      </section>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        tone="destructive"
        title={t('automation.rss.deleteTitle', { title })}
        description={t('automation.rss.deleteBody')}
        confirmLabel={t('action.remove')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={async () => {
          await remove.mutateAsync(feedId);
          setDeleteOpen(false);
          router.push('/automation/rss');
        }}
      />
    </div>
  );
}
