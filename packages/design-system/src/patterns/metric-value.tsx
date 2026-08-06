'use client';

import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export type MetricAvailability =
  | 'available'
  /** The provider does not expose this metric at all. */
  | 'unsupported'
  /** We have not built the mapping yet. Different from unsupported. */
  | 'not_implemented'
  /** The provider has it, but this account's permissions do not cover it. */
  | 'permission_required'
  /** The sync has not run yet or failed. The number may arrive later. */
  | 'pending'
  /** The sync failed and will not be retried automatically. */
  | 'unavailable';

export interface MetricValueProps {
  /** The metric name, from the message catalog. */
  label: ReactNode;
  availability: MetricAvailability;
  /**
   * The formatted number. Required when availability is `available`, and
   * deliberately ignored otherwise so a stale value cannot leak through.
   */
  value?: ReactNode;
  /**
   * The word shown in place of a number, from the message catalog. Something
   * like "Unavailable" or "Not supported". Never a zero.
   */
  unavailableText?: ReactNode;
  /**
   * Why there is no number. Required whenever availability is not `available`:
   * "TikTok does not report reach for this account type" is useful, a blank
   * dash is not.
   */
  reason?: ReactNode;
  /** Provider name, denominator, definition. Rendered under the value. */
  definition?: ReactNode;
  /** A FreshnessLabel or equivalent. */
  freshness?: ReactNode;
  size?: 'md' | 'lg';
  className?: string;
}

/**
 * A single normalized metric.
 *
 * The rule this component exists to enforce: **missing data is never zero.**
 * A zero is a measurement. An absent measurement is an absence, and rendering
 * it as `0` invents a fact, breaks every average computed from it, and makes
 * the product untrustworthy in exactly the place trust matters most.
 *
 * So when availability is anything other than `available`, the number is
 * replaced by a word and a reason, in the same box, at the same size, without
 * a decorative gauge or score ring anywhere near it.
 */
export function MetricValue({
  label,
  availability,
  value,
  unavailableText,
  reason,
  definition,
  freshness,
  size = 'md',
  className,
}: MetricValueProps): ReactNode {
  const isAvailable = availability === 'available';

  return (
    <div
      data-availability={availability}
      className={cn('flex min-w-0 flex-col gap-0.5', className)}
    >
      <p className="text-label text-text-tertiary">{label}</p>

      {isAvailable ? (
        <p
          data-numeric=""
          className={cn(
            'text-text-primary font-display tabular-nums',
            size === 'lg' ? 'text-title-lg' : 'text-title-md',
          )}
        >
          {value}
        </p>
      ) : (
        <p className={cn('text-text-tertiary', size === 'lg' ? 'text-title-md' : 'text-title-sm')}>
          {unavailableText}
        </p>
      )}

      {!isAvailable && reason ? <p className="text-body-sm text-text-secondary">{reason}</p> : null}

      {definition ? <p className="text-body-sm text-text-tertiary">{definition}</p> : null}

      {freshness ? <div className="pt-0.5">{freshness}</div> : null}
    </div>
  );
}
