import type { ReactNode } from 'react';
import { CalendarClock } from 'lucide-react';
import { VisuallyHidden } from '@relay/design-system/primitives';

import { ProviderMark } from '@/features/connections/provider';

import type { DemoVariantView, DemoWeekdayView } from '../content';
import { DemoPanel } from '../demo-frame';

/**
 * The scheduling half of the demonstration: the time the set is given, then
 * the same three posts sitting on a week.
 *
 * Two things this panel deliberately does not do. It does not draw a month
 * grid, because a month of empty cells is decoration and the point is the
 * three entries. And it does not offer a drag: nothing here moves, and the
 * real calendar's move affordance is a button as well as a drag, which is the
 * rule that keeps this product usable from a keyboard.
 */

export interface SchedulePanelProps {
  readonly label: string;
  /** "Tuesday, 15 September 2026 at 09:15 in Central European Summer Time (GMT+2)". */
  readonly value: string;
  readonly approval: string;
  readonly queue: string;
}

export function SchedulePanel({ label, value, approval, queue }: SchedulePanelProps): ReactNode {
  return (
    <DemoPanel label={label}>
      <p className="text-title-sm text-text-primary flex items-start gap-2 leading-[1.4]">
        <CalendarClock aria-hidden="true" className="text-text-tertiary mt-0.5 size-4 shrink-0" />
        <span className="min-w-0">{value}</span>
      </p>
      <p className="text-body-sm text-text-secondary mt-3 leading-[1.55]">{approval}</p>
      <p className="text-body-sm text-text-tertiary mt-2 leading-[1.55]">{queue}</p>
    </DemoPanel>
  );
}

export interface WeekStripPanelProps {
  readonly label: string;
  readonly week: readonly DemoWeekdayView[];
  readonly caption: string;
  /** Sentence for a weekday with nothing on it, for assistive technology. */
  readonly emptyLabel: string;
}

export function WeekStripPanel({
  label,
  week,
  caption,
  emptyLabel,
}: WeekStripPanelProps): ReactNode {
  return (
    <DemoPanel label={label}>
      {/*
        Five weekdays as a list of columns rather than a table: there is one
        dimension here (the day), so a table would announce a row and column
        position that carries no meaning. Weekday names are never abbreviated
        by slicing the string, which would produce nonsense in most languages.
      */}
      <ol className="grid grid-cols-5 gap-1.5">
        {week.map((day) => (
          <li key={day.weekday} className="min-w-0">
            <p className="text-label text-text-tertiary hyphens-none">{day.name}</p>
            <div className="mt-1.5 space-y-1">
              {day.entries.length === 0 ? (
                <p className="border-border-subtle rounded-sm border border-dashed py-2">
                  <VisuallyHidden>{emptyLabel}</VisuallyHidden>
                  <span aria-hidden="true" className="text-text-tertiary block text-center">
                    &middot;
                  </span>
                </p>
              ) : (
                day.entries.map((entry) => <WeekEntry key={entry.id} entry={entry} />)
              )}
            </div>
          </li>
        ))}
      </ol>
      <p className="text-body-sm text-text-tertiary mt-3 leading-[1.55]">{caption}</p>
    </DemoPanel>
  );
}

/**
 * One entry in the week.
 *
 * The dot is the platform's identity colour and the time is the only thing
 * that fits beside it in a fifth of the width, so the account and platform
 * names ride along as visually hidden text. That keeps the entry honest for a
 * screen reader without truncating a handle on screen.
 */
function WeekEntry({ entry }: { readonly entry: DemoVariantView }): ReactNode {
  return (
    <p className="border-border-default bg-surface-canvas flex flex-wrap items-center gap-1 rounded-sm border px-1.5 py-1">
      <ProviderMark provider={entry.provider} />
      <span className="text-body-sm text-text-primary font-mono tabular-nums">{entry.time}</span>
      <VisuallyHidden>{entry.account}</VisuallyHidden>
    </p>
  );
}
