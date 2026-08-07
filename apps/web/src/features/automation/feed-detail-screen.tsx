'use client';

import { useState, type ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import {
  ConfirmDialog,
  DefinitionList,
  LoadingState,
  Notice,
  SkeletonText,
} from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { QueryErrorState } from '@/features/analytics/components/query-error-state';
import { useValueFormat } from '@/features/analytics/use-value-format';

import { useDeleteFeed, useFeedHealth, useUpdateFeed } from './rss-queries';

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
  const paused = data.paused;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-title-md text-text-primary">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            loading={update.isPending}
            onClick={() => update.mutate({ feedId, draft: { paused: !paused } })}
          >
            {paused ? t('automation.rss.resumeFeed') : t('automation.rss.pauseFeed')}
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            {t('action.remove')}
          </Button>
        </div>
      </div>

      {data.issueKeys.length > 0 && !paused ? (
        <Notice
          tone="warning"
          liveness="status"
          title={t('automation.rss.errorTitle')}
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
              id: 'processed',
              term: t('automation.rss.health.processedLabel'),
              definition: t('automation.rss.health.itemsProcessed', {
                count: data.itemsLast30Days,
              }),
            },
          ]}
        />
      </section>

      <Notice tone="neutral" title={t('automation.rss.dedupe')} />

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
