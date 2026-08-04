'use client';

import type { ReactNode } from 'react';
import { cn } from '../utils/cn.js';

export interface DefinitionItem {
  readonly id: string;
  readonly term: ReactNode;
  readonly definition: ReactNode;
  /** A note under the value: a provider definition, a freshness label. */
  readonly hint?: ReactNode;
}

export interface DefinitionListProps {
  items: readonly DefinitionItem[];
  /**
   * `rows` stacks the term above the value and is the mobile default.
   * `columns` puts the term in a fixed inline-start column, which reads better
   * for a receipt or a connection summary on a wide screen.
   */
  layout?: 'rows' | 'columns' | 'responsive';
  className?: string;
}

/**
 * A real `<dl>` for facts that belong together: the receipt header, the
 * connection summary, a metric definition panel.
 *
 * This is the component that replaces a row of small cards. Six facts about
 * one post are six definitions, not six cards, and the definition list keeps
 * the term and value associated for assistive technology.
 */
export function DefinitionList({
  items,
  layout = 'responsive',
  className,
}: DefinitionListProps): ReactNode {
  const columns = layout === 'columns' || layout === 'responsive';
  return (
    <dl
      className={cn(
        'grid gap-x-4 gap-y-2.5',
        layout === 'rows' && 'grid-cols-1',
        layout === 'columns' && 'grid-cols-[minmax(8rem,14rem)_1fr]',
        layout === 'responsive' && 'grid-cols-1 sm:grid-cols-[minmax(8rem,14rem)_1fr]',
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.id} className={cn('contents')}>
          <dt
            className={cn(
              'text-label text-text-tertiary',
              columns ? 'sm:pt-px' : undefined,
            )}
          >
            {item.term}
          </dt>
          <dd className="min-w-0 text-body-md text-text-primary">
            {item.definition}
            {item.hint ? (
              <span className="mt-0.5 block text-body-sm text-text-tertiary">
                {item.hint}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
