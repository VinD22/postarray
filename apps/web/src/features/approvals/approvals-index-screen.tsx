'use client';

import type { ReactNode } from 'react';

import { Link } from '@/components/link';
import { ApiError } from '@/lib/api/error';
import { useMembers } from '@/lib/api/hooks';
import { useFormatters, useTranslations } from '@/lib/i18n';

import {
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  OfflineBanner,
  PageHeader,
  PermissionDenied,
  RateLimitNotice,
  SkeletonList,
} from '@relay/design-system/patterns';
import { Badge, Button } from '@relay/design-system/primitives';

import { approvalsIndexState } from './approvals-index-state';
import { usePendingApprovals } from './use-pending-approvals';

/**
 * `/approvals`: every review waiting on the signed-in person.
 *
 * The API lists pending requests only. A decided request is not listed here;
 * its decision lives on the post it belongs to, and the page says so rather
 * than inventing a history view the API does not serve.
 */
export function ApprovalsIndexScreen(): ReactNode {
  const t = useTranslations();
  const format = useFormatters();
  const query = usePendingApprovals();
  const membersQuery = useMembers();
  const error = query.isError ? (ApiError.is(query.error) ? query.error : null) : null;
  const rows = query.data?.data ?? [];

  const state = approvalsIndexState({
    isPending: query.isPending,
    error: query.isError
      ? (error ?? { isOffline: false, isAuthorization: false, isRateLimited: false })
      : null,
    count: rows.length,
    hasMore: query.data?.pageInfo.hasMore ?? false,
    membersFailed: membersQuery.isError,
  });

  const retry = (
    <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
      {t('action.retry')}
    </Button>
  );

  let body: ReactNode;
  switch (state) {
    case 'loading':
      body = (
        <LoadingState label={t('web.approvals.index.loading')}>
          <SkeletonList rows={4} avatar={false} />
        </LoadingState>
      );
      break;
    case 'offline':
      body = (
        <OfflineBanner
          title={t('web.approvals.index.offline.title')}
          description={t('web.approvals.index.offline.body')}
          actions={retry}
        />
      );
      break;
    case 'permission-denied':
      body = (
        <PermissionDenied
          title={t('permission.denied.title')}
          description={t('web.approvals.index.denied.body')}
        />
      );
      break;
    case 'rate-limited':
      body = (
        <RateLimitNotice
          title={t('rateLimit.title')}
          cause={t('web.approvals.index.rateLimited.cause')}
          resetLabel={t('web.calendar.rateLimited.resetLabel')}
          resetAt={
            error?.retryAfterSeconds == null
              ? t('common.unavailable')
              : format.duration(error.retryAfterSeconds * 1000)
          }
          alternative={t('rateLimit.cheaperAlternative')}
          actions={retry}
        />
      );
      break;
    case 'error':
      body = (
        <ErrorState
          title={t('web.approvals.index.error.title')}
          description={t('web.approvals.index.error.body')}
          onRetry={() => void query.refetch()}
          retryLabel={t('action.retry')}
          retrying={query.isFetching}
          {...(error?.correlationId
            ? { reference: { label: t('receipt.correlationId'), value: error.correlationId } }
            : {})}
        />
      );
      break;
    case 'empty':
      body = (
        <EmptyState
          title={t('web.approvals.index.empty.title')}
          description={t('web.approvals.index.empty.body')}
          action={
            <Button variant="secondary" asChild>
              <Link href="/calendar">{t('calendar.title')}</Link>
            </Button>
          }
        />
      );
      break;
    default:
      body = (
        <div className="flex flex-col gap-4">
          {state === 'partial' && query.data?.pageInfo.hasMore ? (
            <Notice
              tone="neutral"
              title={t('web.approvals.index.partial.more', { count: rows.length })}
            />
          ) : null}
          {state === 'partial' && membersQuery.isError ? (
            <Notice tone="warning" title={t('web.approvals.index.partial.members')} />
          ) : null}
          <ul className="border-border-subtle divide-border-subtle flex flex-col divide-y border-y">
            {rows.map((approval) => {
              const name =
                membersQuery.data?.data.find((member) => member.userId === approval.requestedBy)
                  ?.name ?? t('common.unavailable');
              const relativeTime = format.relative(approval.createdAt);
              return (
                <li
                  key={approval.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="text-body-sm text-text-secondary flex flex-wrap items-center gap-x-3 gap-y-1">
                      <Badge tone="warning">{t(`state.approval.${approval.state}.label`)}</Badge>
                      {approval.dueAt === null ? null : (
                        <span>
                          {t('web.approvals.index.due', { date: format.dateTime(approval.dueAt) })}
                        </span>
                      )}
                    </div>
                    <p className="text-body text-text-primary">
                      {t('approval.requestedBy', { name, relativeTime })}
                    </p>
                    {approval.note === null ? null : (
                      <p className="text-body-sm text-text-secondary break-words">
                        {approval.note}
                      </p>
                    )}
                  </div>
                  <Button variant="secondary" size="sm" asChild>
                    <Link
                      href={`/approvals/${approval.id}`}
                      aria-label={t('web.approvals.index.reviewLabel', { name, relativeTime })}
                    >
                      {t('web.approvals.index.review')}
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
          <p className="text-body-sm text-text-secondary">{t('web.approvals.index.decidedNote')}</p>
        </div>
      );
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader
        title={t('approval.title')}
        titleStyle="strong"
        description={t('web.approvals.index.description')}
      />
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">{body}</div>
    </div>
  );
}
