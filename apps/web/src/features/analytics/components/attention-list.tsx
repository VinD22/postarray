'use client';

import type { ReactElement } from 'react';
import { EmptyState } from '@relay/design-system/patterns';
import { Button, StatusDot } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { providerLabelKey } from '../labels';
import type { AccountAttentionReason, AccountAttentionRow } from '../types';
import { useValueFormat } from '../use-value-format';

/**
 * Accounts whose numbers cannot be trusted, and why.
 *
 * Every reason maps to exactly one remediation, and the remediation is the
 * button on the row. An account with a missing analytics permission is a
 * reconnect, an account with no posts is not a problem at all and gets no
 * button, and a failing sync links to the connection where the failure is
 * recorded. A list of problems with no verb on it is a list nobody acts on.
 */

const REASON_KEY: Readonly<Record<AccountAttentionReason, string>> = {
  permission_missing: 'analytics.accounts.reason.permission',
  access_expired: 'analytics.accounts.reason.expired',
  stale: 'analytics.accounts.reason.stale',
  sync_failing: 'analytics.accounts.reason.syncFailing',
  no_posts: 'analytics.accounts.reason.noPosts',
};

export interface AttentionListProps {
  readonly rows: readonly AccountAttentionRow[];
  readonly onReconnect?: (connectionId: string) => void;
  readonly onOpenConnection?: (connectionId: string) => void;
}

export function AttentionList({
  rows,
  onReconnect,
  onOpenConnection,
}: AttentionListProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  if (rows.length === 0) {
    return (
      <EmptyState
        compact
        title={t('analytics.question.accounts')}
        description={t('analytics.accounts.empty')}
      />
    );
  }

  return (
    <section aria-labelledby="attention-heading" className="flex flex-col gap-3">
      <h2 id="attention-heading" className="text-title-sm text-text-primary">
        {t('analytics.accounts.title')}
      </h2>

      <ul className="flex flex-col border-t border-border-subtle">
        {rows.map((row) => {
          const needsReconnect =
            row.reason === 'permission_missing' || row.reason === 'access_expired';
          return (
            <li
              key={`${row.account.connectionId}:${row.reason}`}
              className="flex flex-col gap-2 border-b border-border-subtle py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="flex items-center gap-2 text-body-md text-text-primary">
                  <StatusDot provider={row.account.provider} />
                  {row.account.displayName}
                  <span className="text-text-tertiary">
                    {t(providerLabelKey(row.account.provider))}
                  </span>
                </span>
                <p className="max-w-[70ch] text-body-md text-text-secondary">
                  {t(REASON_KEY[row.reason], {
                    date: row.since ? format.date(row.since) : '',
                    relativeTime: row.since ? format.relative(row.since) : '',
                    count: row.consecutiveFailures,
                    reason: row.failureCode ?? '',
                  })}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {needsReconnect && onReconnect ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onReconnect(row.account.connectionId)}
                  >
                    {t('action.reconnect')}
                  </Button>
                ) : null}
                {row.reason === 'sync_failing' && onOpenConnection ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onOpenConnection(row.account.connectionId)}
                  >
                    {t('action.viewDetails')}
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
