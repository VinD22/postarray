'use client';

import type { ReactElement } from 'react';
import { EmptyState, SkeletonText } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useWhatWorks } from '../insights-queries';
import { useValueFormat } from '../use-value-format';

/**
 * What is in your images, joined with how those posts did against your own
 * median on the same platform.
 *
 * Rows only exist above the server's sample threshold, and the no-causation
 * caveat is always shown beside them at the same size. A failed read renders
 * nothing: this section is a hint, and its absence claims nothing.
 */
export function WhatWorks(): ReactElement | null {
  const t = useTranslations();
  const format = useValueFormat();
  const query = useWhatWorks();

  if (query.isError) {
    return null;
  }

  return (
    <section aria-labelledby="what-works-heading" className="flex flex-col gap-4">
      <div className="flex max-w-[70ch] flex-col gap-1">
        <h2 id="what-works-heading" className="text-title-sm text-text-primary">
          {t('insight.whatWorks.title')}
        </h2>
        <p className="text-body-md text-text-secondary">{t('insight.whatWorks.intro')}</p>
      </div>
      {query.isPending ? (
        <SkeletonText lines={3} />
      ) : query.data.rows.length === 0 ? (
        <EmptyState
          compact
          title={t('insight.whatWorks.title')}
          description={t(query.data.emptyReasonKey ?? 'insight.whatWorks.empty.noPosts', {
            count: query.data.minimumSample,
          })}
        />
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {query.data.rows.map((row) => (
              <li
                key={`${row.provider}:${row.trait}:${row.metric}`}
                className="flex flex-col gap-0.5"
              >
                <p className="text-body-sm text-text-tertiary">
                  {t(`web.provider.${row.provider}`)}
                </p>
                <p className="text-body-lg text-text-primary max-w-[70ch]">
                  {t('insight.whatWorks.row', { trait: row.trait, ratio: format.count(row.ratio) })}
                </p>
                <p className="text-body-sm text-text-tertiary tabular-nums">
                  {t('insight.whatWorks.sample', { count: row.sampleSize })}
                </p>
              </li>
            ))}
          </ul>
          <p className="text-body-md text-text-secondary max-w-[70ch]">
            {t('insight.whatWorks.caveat')}
          </p>
        </>
      )}
    </section>
  );
}
