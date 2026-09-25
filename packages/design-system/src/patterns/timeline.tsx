'use client';

import type { ReactNode } from 'react';
import { AlertTriangle, Check, Circle, Clock, RotateCcw, X } from 'lucide-react';
import { cn } from '../utils/cn';

export type TimelineOutcome =
  'completed' | 'current' | 'pending' | 'retried' | 'warning' | 'failed';

export interface TimelineEvent {
  readonly id: string;
  /** What happened. A short sentence, from the message catalog. */
  readonly title: ReactNode;
  /** When, already formatted in the user's time zone. */
  readonly timestamp?: ReactNode;
  /** The machine-readable instant, for the `<time datetime>` attribute. */
  readonly isoTimestamp?: string | undefined;
  /** Who or what caused it: a person, a policy, an automation rule, an agent. */
  readonly actor?: ReactNode;
  /** Sanitized detail: an external id, a permalink, a failure reason. */
  readonly detail?: ReactNode;
  readonly outcome: TimelineOutcome;
}

const outcomeIcon: Record<TimelineOutcome, ReactNode> = {
  completed: <Check aria-hidden="true" className="size-3" strokeWidth={3} />,
  current: <Clock aria-hidden="true" className="size-3" />,
  pending: <Circle aria-hidden="true" className="size-2" />,
  retried: <RotateCcw aria-hidden="true" className="size-3" />,
  warning: <AlertTriangle aria-hidden="true" className="size-3" />,
  failed: <X aria-hidden="true" className="size-3" strokeWidth={3} />,
};

const outcomeMarker: Record<TimelineOutcome, string> = {
  completed: 'border-success-border bg-success-bg text-success-fg',
  current: 'border-accent bg-accent-subtle text-text-accent',
  pending: 'border-border-default bg-surface-sunken text-text-tertiary',
  retried: 'border-info-border bg-info-bg text-info-fg',
  warning: 'border-warning-border bg-warning-bg text-warning-fg',
  failed: 'border-destructive-border bg-destructive-bg text-destructive-fg',
};

export interface TimelineProps {
  /** Accessible name for the list, from the message catalog. */
  label: string;
  events: readonly TimelineEvent[];
  className?: string;
}

/**
 * The vertical event timeline behind the publication receipt.
 *
 * It is an ordered list, so a screen reader hears "list, 8 items" and can walk
 * it, rather than a stack of unrelated cards. The connecting rule is drawn on
 * the inline start of the marker column and mirrors in RTL for free because it
 * uses the inline axis.
 *
 * Every row carries an icon and a tone. The state of a step is never inferred
 * from a colour, because a receipt is the document people screenshot and
 * forward.
 */
export function Timeline({ label, events, className }: TimelineProps): ReactNode {
  return (
    <ol aria-label={label} className={cn('flex flex-col', className)}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <li key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border',
                  outcomeMarker[event.outcome],
                )}
              >
                {outcomeIcon[event.outcome]}
              </span>
              {isLast ? null : (
                <span aria-hidden="true" className="bg-border-default w-px flex-1" />
              )}
            </div>

            <div className={cn('flex min-w-0 flex-1 flex-col gap-0.5', isLast ? 'pb-0' : 'pb-4')}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <p className="text-body-md text-text-primary font-medium">{event.title}</p>
                {event.timestamp ? (
                  <time
                    dateTime={event.isoTimestamp}
                    className="mono-id text-body-sm text-text-tertiary"
                  >
                    {event.timestamp}
                  </time>
                ) : null}
              </div>
              {event.actor ? (
                <p className="text-body-sm text-text-secondary">{event.actor}</p>
              ) : null}
              {event.detail ? (
                <div className="text-body-sm text-text-secondary">{event.detail}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
