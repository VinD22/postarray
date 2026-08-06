'use client';

/**
 * The view switcher.
 *
 * Day, week, month and list are peer layouts of the same schedule, not four
 * destinations, so this reads as a segmented control: one ink-bordered
 * track, one sliding yellow thumb that tracks the active choice with GSAP
 * Flip. It is built on the design system's `Tabs` for the roving-tabindex
 * and `aria-selected` keyboard behaviour that primitive already gets right
 * (arrow keys move focus, activation is manual) — only the per-trigger
 * underline it draws by default is turned off, because the thumb is this
 * control's only indicator. `tabs.tsx` itself notes that a sliding indicator
 * needs Flip and belongs app-side; this is that app-side piece, and the
 * primary nav rail's indicator (`components/shell/primary-nav.tsx`) is the
 * same technique turned ninety degrees.
 *
 * The thumb never animates on first mount and jumps straight to position
 * with no tween when `usePrefersReducedMotion()` is true.
 */

import { useRef, type ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, cn, touchTarget } from '@relay/design-system';
import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion/constants';
import { Flip, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
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
  const listRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef(new Map<CalendarView, HTMLButtonElement>());
  const hasPositioned = useRef(false);
  const motionOk = useMotionOk();

  useGSAP(
    () => {
      const list = listRef.current;
      const thumb = thumbRef.current;
      const active = itemRefs.current.get(value);
      if (!list || !thumb || !active) return;

      const shouldAnimate = hasPositioned.current && motionOk;
      const state = shouldAnimate ? Flip.getState(thumb) : null;

      // Measured, not authored: real bounding rects already reflect the
      // page's writing direction, so copying them positions the thumb
      // correctly under LTR and RTL alike without a logical/physical branch.
      const listRect = list.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      thumb.style.left = `${activeRect.left - listRect.left}px`;
      thumb.style.width = `${activeRect.width}px`;

      if (state) {
        Flip.from(state, { duration: DURATION_FAST, ease: EASE_STANDARD });
      }
      hasPositioned.current = true;
    },
    { scope: listRef, dependencies: [value, motionOk] },
  );

  return (
    <Tabs value={value} onValueChange={(next) => onValueChange(next as CalendarView)}>
      <TabsList
        ref={listRef}
        aria-label={label}
        className={cn(
          'border-border-bold bg-surface-sunken relative gap-0.5 rounded-md border-2 p-1',
          className,
        )}
      >
        <span
          ref={thumbRef}
          aria-hidden="true"
          className={cn(
            'bg-cta border-border-bold pointer-events-none absolute top-1 bottom-1 z-0',
            'shadow-hard-sm rounded-sm border-2',
          )}
        />
        {views.map((view) => (
          <TabsTrigger
            key={view}
            ref={(element) => {
              if (element) itemRefs.current.set(view, element);
              else itemRefs.current.delete(view);
            }}
            value={view}
            className={cn(
              'relative z-10 flex items-center justify-center rounded-sm border-b-0 px-3 py-1.5',
              'data-[state=active]:text-cta-on data-[state=active]:border-b-0',
              touchTarget,
            )}
          >
            {labelFor(view)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
