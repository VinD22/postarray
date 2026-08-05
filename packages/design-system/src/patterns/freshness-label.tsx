'use client';

import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../utils/cn';

export type FreshnessLevel = 'fresh' | 'aging' | 'stale' | 'never' | 'syncing';

const levelClass: Record<FreshnessLevel, string> = {
  fresh: 'text-text-tertiary',
  aging: 'text-text-secondary',
  stale: 'text-warning-fg',
  never: 'text-warning-fg',
  syncing: 'text-info-fg',
};

export interface FreshnessLabelProps {
  level: FreshnessLevel;
  /**
   * The already formatted sentence, for example "Synced 12 minutes ago" or
   * "Never synced". Relative time formatting is locale sensitive and belongs
   * in the i18n package, not here.
   */
  text: ReactNode;
  /** The machine-readable instant for `<time datetime>`. */
  isoTimestamp?: string | undefined;
  /** The provider this data came from, named explicitly. */
  source?: ReactNode;
  className?: string;
}

/**
 * When a number was last true.
 *
 * Analytics in this product are always dated. A metric with no freshness label
 * invites the reader to assume it is live, which it never is: providers
 * aggregate on their own schedules and some of them lag by a day. `stale` and
 * `never` are warning coloured and carry an icon, because at that point the
 * age of the number matters more than the number.
 */
export function FreshnessLabel({
  level,
  text,
  isoTimestamp,
  source,
  className,
}: FreshnessLabelProps): ReactNode {
  const showWarning = level === 'stale' || level === 'never';

  return (
    <p
      data-freshness={level}
      className={cn('text-body-sm inline-flex items-center gap-1', levelClass[level], className)}
    >
      {showWarning ? (
        <AlertTriangle aria-hidden="true" className="size-3.5 shrink-0" />
      ) : level === 'syncing' ? (
        <RefreshCw
          aria-hidden="true"
          className="relay-anim-spin size-3.5 shrink-0 motion-reduce:animate-none"
        />
      ) : null}
      <time dateTime={isoTimestamp}>{text}</time>
      {source ? <span className="text-text-tertiary">{source}</span> : null}
    </p>
  );
}
