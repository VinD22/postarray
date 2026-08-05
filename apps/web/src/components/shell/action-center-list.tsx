'use client';

import Link from 'next/link';
import { AlertTriangle, Clock, Eye } from 'lucide-react';
import type { ReactNode } from 'react';

import {
  EmptyState,
  ErrorState,
  LoadingState,
  SkeletonList,
} from '@relay/design-system/patterns';
import { Button, StatusDot } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

import { ApiError, type ActionItemUrgency, type ActionItemView } from '@/lib/api';
import { useSnoozeActionItem } from '@/lib/api/hooks';
import { useFormatters, useTranslations } from '@/lib/i18n';

import {
  ACTION_KIND_DEFINITIONS,
  providerDotKey,
  URGENCY_HINT_KEY,
  URGENCY_LABEL_KEY,
  URGENCY_ORDER,
  URGENCY_SEVERITY_KEY,
} from './action-center-catalog';

const URGENCY_MARK: Readonly<Record<ActionItemUrgency, ReactNode>> = {
  now: <AlertTriangle aria-hidden="true" className="size-4 text-destructive-fg" />,
  soon: <Clock aria-hidden="true" className="size-4 text-warning-fg" />,
  watching: <Eye aria-hidden="true" className="size-4 text-text-tertiary" />,
};

export interface ActionCenterListProps {
  readonly items: readonly ActionItemView[];
  readonly loading: boolean;
  readonly error: ApiError | null;
  readonly onRetry: () => void;
  /** Cap the rows shown. Home uses this; the full queue does not. */
  readonly maxItems?: number;
  readonly showSnooze?: boolean;
  readonly emptyAction?: ReactNode;
}

/**
 * The Action center queue.
 *
 * One list, grouped by urgency, each row ending in one named verb. Rows, not
 * cards: a queue is scanned top to bottom and a card grid destroys that.
 */
export function ActionCenterList({
  items,
  loading,
  error,
  onRetry,
  maxItems,
  showSnooze = true,
  emptyAction,
}: ActionCenterListProps) {
  const t = useTranslations();
  const format = useFormatters();
  const snooze = useSnoozeActionItem();

  if (loading) {
    return (
      <LoadingState label={t('actionCenter.loading')}>
        <SkeletonList rows={4} />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t('actionCenter.errorTitle')}
        description={t(error.actionKey, error.messageValues)}
        {...(error.retryable ? { onRetry } : {})}
        retryLabel={t('action.retry')}
        {...(error.correlationId === null
          ? {}
          : {
              reference: {
                label: t('shell.feedback.correlationId', { correlationId: error.correlationId }),
                value: error.correlationId,
              },
            })}
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        compact
        title={t('actionCenter.empty')}
        description={t('home.needsYou.emptyBody')}
        {...(emptyAction === undefined ? {} : { action: emptyAction })}
      />
    );
  }

  const visible = maxItems === undefined ? items : items.slice(0, maxItems);
  const groups = URGENCY_ORDER.map((urgency) => ({
    urgency,
    rows: visible.filter((item) => item.urgency === urgency),
  })).filter((group) => group.rows.length > 0);

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <section key={group.urgency} aria-labelledby={`action-group-${group.urgency}`}>
          <div className="flex flex-col gap-0.5 pb-1.5">
            <h3
              id={`action-group-${group.urgency}`}
              className="text-label uppercase tracking-wide text-text-tertiary"
            >
              {t(URGENCY_LABEL_KEY[group.urgency])}
            </h3>
            <p className="text-body-sm text-text-tertiary">{t(URGENCY_HINT_KEY[group.urgency])}</p>
          </div>

          <ul className="flex flex-col border-t border-border-subtle">
            {group.rows.map((item) => {
              const definition = ACTION_KIND_DEFINITIONS[item.kind];
              const dotProvider = providerDotKey(item.provider);

              return (
                <li
                  key={item.id}
                  className={cn(
                    'flex flex-col gap-2 border-b border-border-subtle py-3',
                    'sm:flex-row sm:items-start sm:gap-4',
                  )}
                >
                  <span className="mt-0.5 flex shrink-0 items-center gap-1.5">
                    {URGENCY_MARK[item.urgency]}
                    <span className="sr-only">{t(URGENCY_SEVERITY_KEY[item.urgency])}</span>
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="text-body-md text-text-primary">
                      {t(definition.messageKey, item.values)}
                    </p>
                    <p className="flex flex-wrap items-center gap-1.5 text-body-sm text-text-tertiary">
                      {dotProvider === undefined ? null : (
                        <StatusDot provider={dotProvider} aria-hidden="true" />
                      )}
                      <span>{t('actionCenter.affectedAccount', { account: item.subject })}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={item.createdAt}>
                        {format.relative(item.createdAt)}
                      </time>
                      {item.snoozedUntil === null ? null : (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>
                            {t('actionCenter.snoozedUntil', {
                              date: format.dateTime(item.snoozedUntil),
                            })}
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={item.href}>{t(definition.actionKey)}</Link>
                    </Button>
                    {showSnooze && item.snoozedUntil === null ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        loading={snooze.isPending && snooze.variables?.itemId === item.id}
                        loadingLabel={t('loading.default')}
                        onClick={() => {
                          snooze.mutate({
                            itemId: item.id,
                            until: new Date(Date.now() + 86_400_000).toISOString(),
                          });
                        }}
                      >
                        {t('actionCenter.snoozeOneDay')}
                      </Button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
