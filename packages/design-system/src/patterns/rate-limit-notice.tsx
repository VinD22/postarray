'use client';

import type { ReactNode } from 'react';
import { Gauge } from 'lucide-react';
import { cn } from '../utils/cn';
import { Notice } from './notice';
import { Progress } from '../primitives/progress';

export interface RateLimitUsage {
  /** Consumed units. */
  readonly used: number;
  /** The ceiling for the window. */
  readonly limit: number;
  /** Already formatted by the caller, for example "184 of 300 requests". */
  readonly text: string;
  /** Accessible name for the usage bar, from the message catalog. */
  readonly label: string;
}

export interface RateLimitNoticeProps {
  /** Which limit was reached, and for which account or surface. */
  title: ReactNode;
  /**
   * Why it happened. Provider quota, plan quota, or a burst from an automation
   * rule. The user cannot act on a limit whose cause is unnamed.
   */
  cause: ReactNode;
  /** When the window resets, already formatted in the user's time zone. */
  resetAt: ReactNode;
  /** Label preceding the reset time, from the message catalog. */
  resetLabel: ReactNode;
  usage?: RateLimitUsage | undefined;
  /**
   * A cheaper way to get the same outcome now: schedule instead of publishing,
   * reduce the target count, use the cached analytics window. Every rate limit
   * notice should have one, otherwise it is just a wall.
   */
  alternative?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * The rate and cost limit notice.
 *
 * Four required facts: what the limit is, why it was reached, when it resets,
 * and what to do instead. Managed X usage is metered and passed through at
 * cost, so this notice is also where a user learns that an action has a price
 * before they retry it.
 */
export function RateLimitNotice({
  title,
  cause,
  resetAt,
  resetLabel,
  usage,
  alternative,
  actions,
  className,
}: RateLimitNoticeProps): ReactNode {
  return (
    <Notice
      tone="warning"
      liveness="status"
      icon={<Gauge aria-hidden="true" className="size-4" />}
      title={title}
      description={
        <div className="flex flex-col gap-2">
          <p>{cause}</p>

          {usage ? (
            <div className="flex flex-col gap-1">
              <p className="text-text-secondary tabular-nums">{usage.text}</p>
              <Progress
                label={usage.label}
                valueText={usage.text}
                value={usage.used}
                max={usage.limit}
                tone="warning"
                className={cn('max-w-xs')}
              />
            </div>
          ) : null}

          <p className="text-text-secondary">
            <span className="text-text-primary font-medium">{resetLabel}</span>
            <span aria-hidden="true"> </span>
            <time>{resetAt}</time>
          </p>

          {alternative ? <p>{alternative}</p> : null}
        </div>
      }
      actions={actions}
      className={className}
    />
  );
}
