'use client';

/**
 * The weekly digest, on Home.
 *
 * The rows are stored by the weekly digest workflow: a deterministic floor built
 * from receipts and normalized metrics, plus, when the writing assistant is on
 * and its numbers passed the audit, a few narrated sentences. A narrated row is
 * labelled as such. Every row is an i18n key and its arguments, so nothing
 * here is English the server wrote.
 *
 * Before the first published week the card keeps its empty state, which says
 * what the digest is made of and why it is not here yet.
 *
 * The email preference lives here, beside the thing it mails, and is changed
 * through the same `insights` use case the API, MCP and CLI reach.
 */

import { type ReactNode } from 'react';

import { Notice, SkeletonText } from '@relay/design-system/patterns';
import { Switch } from '@relay/design-system/primitives';
import { cn, panelSurface } from '@relay/design-system/utils';

import { EmptyScene } from '@/components/empty';
import {
  useDigestSettings,
  useLatestDigest,
  useUpdateDigestSettings,
} from '@/features/analytics/insights-queries';
import { useFormatters, useTranslations } from '@/lib/i18n';

import { HomeSection } from './section';

export function DigestCard(): ReactNode {
  const t = useTranslations();
  const query = useLatestDigest();

  return (
    <HomeSection id="home-digest" title={t('home.v2.digest.title')}>
      {query.isPending ? (
        <div aria-busy="true" aria-label={t('insight.digest.card.loading')}>
          <SkeletonText lines={3} />
        </div>
      ) : query.isError ? (
        <Notice tone="neutral" title={t('insight.digest.card.error')} />
      ) : query.data === null ? (
        <div className={cn(panelSurface, 'flex flex-col items-center gap-4 px-4 py-6')}>
          <EmptyScene scene="digest" />
          <div className="flex max-w-[52ch] flex-col gap-1 text-center">
            <h3 className="font-display text-title-sm text-text-primary font-bold">
              {t('home.v2.digest.emptyTitle')}
            </h3>
            <p className="text-body-sm text-text-secondary">{t('home.v2.digest.emptyBody')}</p>
          </div>
        </div>
      ) : (
        <DigestBody digest={query.data} />
      )}
      <EmailPreference />
    </HomeSection>
  );
}

function DigestBody({
  digest,
}: {
  readonly digest: NonNullable<ReturnType<typeof useLatestDigest>['data']>;
}): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const date = (iso: string): string => formatters.date(`${iso}T12:00:00Z`);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body-sm text-text-tertiary">
        {t('insight.digest.card.intro', {
          windowStart: date(digest.windowStart),
          windowEnd: date(digest.windowEnd),
        })}
      </p>
      <ul className="flex flex-col gap-2">
        {digest.rows.map((row) => (
          <li
            key={`${row.messageKey}:${JSON.stringify(row.messageArgs)}`}
            className="flex flex-col gap-0.5"
          >
            <p className="text-body-md text-text-primary max-w-[60ch]">
              {t(row.messageKey, row.messageArgs)}
            </p>
            {row.isNarrative ? (
              <p className="text-body-sm text-text-tertiary">
                {t('insight.digest.card.narrative')}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="text-body-sm text-text-tertiary max-w-[60ch]">
        {digest.fallbackReasonKey === null
          ? t(digest.source === 'ai' ? 'digest.source.ai' : 'digest.source.deterministic')
          : t(digest.fallbackReasonKey)}
      </p>
    </div>
  );
}

function EmailPreference(): ReactNode {
  const t = useTranslations();
  const settings = useDigestSettings();
  const update = useUpdateDigestSettings();

  if (settings.data === undefined) {
    return null;
  }
  return (
    <div className="border-border-subtle mt-3 flex flex-col gap-2 border-t pt-3">
      <label className="text-body-sm text-text-secondary flex items-center justify-between gap-3">
        <span>{t('insight.digest.card.emailToggle')}</span>
        <Switch
          checked={settings.data.emailEnabled}
          disabled={!settings.data.canChange || update.isPending}
          aria-label={t('insight.digest.card.emailToggle')}
          onCheckedChange={(next) => update.mutate(next === true)}
        />
      </label>
      {update.isError ? (
        <p role="alert" className="text-body-sm text-destructive-fg">
          {t('insight.digest.card.emailFailed')}
        </p>
      ) : update.isSuccess ? (
        <p role="status" className="text-body-sm text-text-tertiary">
          {t('insight.digest.card.emailSaved')}
        </p>
      ) : null}
    </div>
  );
}
