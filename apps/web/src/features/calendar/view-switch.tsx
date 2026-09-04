'use client';

/**
 * The view switcher.
 *
 * Day, week, month and list are peer layouts of the same schedule, not four
 * destinations, so this is a radio group rather than tabs: choosing a view
 * redraws the calendar and there is no panel this control owns. Arrow keys
 * move and select in one step and the active choice is the one tab stop.
 *
 * All of that now lives in the design system's `SegmentedControl`, which three
 * other screens were separately reimplementing. What is left here is the one
 * thing that is actually about the calendar: turning a `CalendarView` into a
 * translated label.
 */

import { useMemo, type ReactNode } from 'react';
import { SegmentedControl } from '@relay/design-system/primitives';
import type { CalendarView } from './types';

export interface CalendarViewSwitchProps {
  views: readonly CalendarView[];
  value: CalendarView;
  onValueChange: (view: CalendarView) => void;
  /** Accessible name for the whole control. */
  label: string;
  labelFor: (view: CalendarView) => string;
  className?: string;
}

export function CalendarViewSwitch({
  views,
  value,
  onValueChange,
  label,
  labelFor,
  className,
}: CalendarViewSwitchProps): ReactNode {
  const items = useMemo(
    () => views.map((view) => ({ value: view, label: labelFor(view) })),
    [views, labelFor],
  );

  return (
    <SegmentedControl
      aria-label={label}
      items={items}
      value={value}
      onValueChange={(next) => {
        const view = views.find((candidate) => candidate === next);
        if (view !== undefined) onValueChange(view);
      }}
      className={className}
    />
  );
}
