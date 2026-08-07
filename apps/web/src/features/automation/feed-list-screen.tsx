'use client';

import type { ReactElement } from 'react';
import { EmptyState, LoadingState, SkeletonList } from '@relay/design-system/patterns';
import { Badge, Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { QueryErrorState } from '@/features/analytics/components/query-error-state';
import { useValueFormat } from '@/features/analytics/use-value-format';
import { useLocalizedRouter } from '@/lib/i18n';

import { useFeeds } from './rss-queries';
import type { FeedHealthState, FeedPublishPolicy } from './rss-types';

/**
 * Every feed this workspace polls.
 *
 * Health leads the row after the title, because the failure mode of a feed is
 * silence: it keeps existing, keeps being polled, and quietly stops producing
 * anything. "No new item for 14 days" is the row that makes somebody check
 * whether the publisher moved their feed.
 */

const POLICY_KEY: Readonly<Record<FeedPublishPolicy, string>> = {
  draft: 'automation.rss.policy.draft',
  approval: 'automation.rss.policy.approval',
};

const HEALTH_TONE: Readonly<
  Record<FeedHealthState, 'success' | 'warning' | 'destructive' | 'neutral'>
> = {
  ok: 'success',
  stalled: 'warning',
  failing: 'destructive',
  paused: 'neutral',
};

export function FeedListScreen(): ReactElement {
  const t = useTranslations();
  const router = useLocalizedRouter();
  const format = useValueFormat();
  const feeds = useFeeds();

  const healthLabel = (state: FeedHealthState, lastNewItemAt: string | null): string => {
    if (state === 'ok') {
      return t('automation.rss.healthOk');
    }
    if (state === 'paused') {
      return t('automation.rules.state.paused');
    }
    if (state === 'stalled') {
      return t('automation.rss.healthStalled', {
        duration: lastNewItemAt ? format.relative(lastNewItemAt) : t('common.unknown'),
      });
    }
    return t('automation.rss.errorTitle');
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex max-w-[70ch] flex-col gap-1">
          <h2 className="text-title-md text-text-primary">{t('automation.rss.title')}</h2>
          <p className="text-body-md text-text-secondary">{t('automation.rss.subtitle')}</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/automation/rss/new')}>
          {t('automation.rss.add')}
        </Button>
      </div>

      {feeds.isPending ? (
        <LoadingState label={t('automation.state.loading')}>
          <SkeletonList rows={3} avatar={false} />
        </LoadingState>
      ) : feeds.isError ? (
        <QueryErrorState
          error={feeds.error}
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
            void feeds.refetch();
          }}
        />
      ) : feeds.data.length === 0 ? (
        <EmptyState
          title={t('automation.rss.empty')}
          description={t('automation.rss.emptyBody')}
          example={t('automation.rss.emptyExample')}
          action={
            <Button variant="primary" onClick={() => router.push('/automation/rss/new')}>
              {t('automation.rss.add')}
            </Button>
          }
        />
      ) : (
        <ul className="border-border-subtle flex flex-col border-t">
          {feeds.data.map((feed) => (
            <li key={feed.id} className="border-border-subtle border-b py-3">
              <button
                type="button"
                className="flex min-h-11 w-full flex-col items-start gap-1 text-start"
                onClick={() => router.push(`/automation/rss/${feed.id}`)}
              >
                <span className="text-body-lg text-text-primary">{feed.title}</span>
                <span className="text-body-sm text-text-secondary w-full truncate">{feed.url}</span>
                <span className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge tone={HEALTH_TONE[feed.health]}>
                    {healthLabel(feed.health, feed.lastNewItemAt)}
                  </Badge>
                  <span className="text-body-sm text-text-tertiary">
                    {t(POLICY_KEY[feed.policy])}
                  </span>
                  {feed.lastPollAt ? (
                    <span className="text-body-sm text-text-tertiary">
                      {t('automation.rss.health.lastPoll', {
                        relativeTime: format.relative(feed.lastPollAt),
                      })}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
