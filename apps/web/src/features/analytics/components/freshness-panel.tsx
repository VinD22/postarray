'use client';

import type { ReactElement } from 'react';
import { Clock } from 'lucide-react';
import { FreshnessLabel } from '@relay/design-system/patterns';
import { StatusDot } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { providerLabelKey } from '../labels';
import type { AccountFreshnessRow } from '../types';
import { useValueFormat } from '../use-value-format';

/**
 * When each account's numbers were last true.
 *
 * This is a row list rather than a set of cards, because it is one fact per
 * account read down a column. It is also not optional chrome: a screen full of
 * figures with no date on them invites the reader to assume they are live, and
 * none of them are.
 *
 * The instant itself renders in the monospace face with tabular figures, and
 * a small `aria-hidden` clock marks the whole "when" group — both purely
 * typographic reinforcement of what the sentence already says, never a
 * replacement for it.
 */

export interface FreshnessPanelProps {
  readonly rows: readonly AccountFreshnessRow[];
  readonly statusHref?: string;
}

export function FreshnessPanel({ rows, statusHref }: FreshnessPanelProps): ReactElement | null {
  const t = useTranslations();
  const format = useValueFormat();

  if (rows.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="freshness-heading" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex max-w-[70ch] flex-col gap-1">
          <h2 id="freshness-heading" className="text-title-sm text-text-primary">
            {t('analytics.freshness.title')}
          </h2>
          <p className="text-body-md text-text-secondary">{t('analytics.freshness.intro')}</p>
        </div>
        {statusHref ? (
          <a
            className="text-body-sm text-text-accent underline underline-offset-2"
            href={statusHref}
          >
            {t('analytics.freshness.openStatus')}
          </a>
        ) : null}
      </div>

      <ul className="border-border-subtle flex flex-col border-t">
        {rows.map((row) => (
          <li
            key={row.account.connectionId}
            className="border-border-subtle flex flex-col gap-1 border-b py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <span className="text-body-md text-text-primary flex min-w-0 items-center gap-2">
              <StatusDot provider={row.account.provider} />
              {t('analytics.freshness.accountRow', {
                account: row.account.displayName,
                provider: t(providerLabelKey(row.account.provider)),
              })}
            </span>

            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <Clock aria-hidden="true" className="text-text-tertiary size-3.5 self-center" />
              {row.lastSuccessAt === null ? (
                <FreshnessLabel
                  level="never"
                  text={t('analytics.freshness.never')}
                  className="font-mono tabular-nums"
                />
              ) : (
                <FreshnessLabel
                  level={row.state}
                  isoTimestamp={row.lastSuccessAt}
                  className="font-mono tabular-nums"
                  text={
                    row.state === 'stale'
                      ? t('analytics.freshness.stale', {
                          relativeTime: format.relative(row.lastSuccessAt),
                        })
                      : t('analytics.freshness.synced', {
                          relativeTime: format.relative(row.lastSuccessAt),
                        })
                  }
                />
              )}
              {row.nextAttemptAt ? (
                <span className="text-body-sm text-text-tertiary font-mono tabular-nums">
                  {t('analytics.freshness.nextAttempt', {
                    relativeTime: format.relative(row.nextAttemptAt),
                  })}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
