'use client';

import type { ReactElement } from 'react';
import { useTranslations } from '@relay/i18n/react';

import { useValueFormat } from '@/features/analytics/use-value-format';

import type { BreakdownEntry } from '../types';

/**
 * Where the clicks came from, as a ranked list with a proportional rule.
 *
 * The rule under each row is a bar, not a chart: it is 1px tall visual support
 * for a number that is already written out, and it carries no axis, no legend
 * and no tooltip. A pie chart of five referrer classes would take more space
 * and answer fewer questions.
 *
 * Country is coarse by design. Relay keeps a country and a device class, not a
 * city and not a raw address, and the note under the list says so rather than
 * leaving the reader to wonder what was collected.
 */

export interface BreakdownListProps {
  /** Already translated heading. */
  readonly title: string;
  readonly entries: readonly BreakdownEntry[];
  /** Turns a key into a translated label. Identity for countries. */
  readonly labelFor: (key: string) => string;
  readonly emptyText: string;
}

export function BreakdownList({
  title,
  entries,
  labelFor,
  emptyText,
}: BreakdownListProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();

  return (
    <section className="flex min-w-0 flex-col gap-2">
      <h4 className="text-label text-text-tertiary">{title}</h4>
      {entries.length === 0 ? (
        <p className="text-body-md text-text-secondary">{emptyText}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {[...entries]
            .sort((left, right) => right.clicks - left.clicks)
            .map((entry) => (
              <li key={entry.key} className="flex flex-col gap-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-body-md text-text-primary min-w-0 truncate">
                    {labelFor(entry.key)}
                  </span>
                  <span className="text-body-sm text-text-secondary shrink-0 tabular-nums">
                    {format.count(entry.clicks)}
                    <span className="text-text-tertiary ps-2">
                      {t('analytics.links.breakdown.share', {
                        percent: format.percent(entry.share),
                      })}
                    </span>
                  </span>
                </span>
                <span aria-hidden="true" className="bg-border-subtle h-px w-full">
                  <span
                    className="bg-accent block h-px"
                    style={{ inlineSize: `${Math.max(1, entry.share * 100)}%` }}
                  />
                </span>
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
