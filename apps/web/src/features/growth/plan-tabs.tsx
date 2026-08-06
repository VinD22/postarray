'use client';

/**
 * The Growth Advisor plan's tab switcher: strategy, four week, UGC,
 * opportunities, tools.
 *
 * Five peer sections of the same generated plan read as a segmented control,
 * not five destinations, so this carries one sliding ink-bordered thumb
 * instead of five independent underlines — the same technique as the
 * Connections screen's own tab switcher (`features/connections/connections-tabs.tsx`,
 * WP-9) and the calendar's view switcher (`features/calendar/view-switch.tsx`).
 * Built on the design system's `Tabs` for the roving-tabindex and manual
 * activation it already gets right, with only the per-trigger underline
 * turned off because the thumb is this control's only indicator.
 *
 * The thumb never animates on first mount and jumps straight to position
 * with no tween when `usePrefersReducedMotion()` is true. The list itself
 * keeps `TabsList`'s own horizontal scroll for narrow viewports, so five
 * labels never force page-level overflow.
 */

import { useRef, type ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, cn, touchTarget } from '@relay/design-system';
import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion/constants';
import { Flip, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

export interface GrowthPlanTab {
  readonly value: string;
  readonly label: ReactNode;
}

export interface GrowthPlanTabsProps {
  tabs: readonly GrowthPlanTab[];
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name for the whole control. */
  label: string;
  className?: string;
  children: ReactNode;
}

export function GrowthPlanTabs({
  tabs,
  value,
  onValueChange,
  label,
  className,
  children,
}: GrowthPlanTabsProps): ReactNode {
  const listRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
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
      thumb.style.top = `${activeRect.top - listRect.top}px`;
      thumb.style.height = `${activeRect.height}px`;

      if (state) {
        Flip.from(state, { duration: DURATION_FAST, ease: EASE_STANDARD });
      }
      hasPositioned.current = true;
    },
    { scope: listRef, dependencies: [value, motionOk] },
  );

  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList
        ref={listRef}
        aria-label={label}
        className="border-border-bold bg-surface-sunken relative inline-flex gap-0.5 rounded-md border-2 p-1"
      >
        <span
          ref={thumbRef}
          aria-hidden="true"
          className="bg-cta border-border-bold shadow-hard-sm pointer-events-none absolute z-0 rounded-sm border-2"
        />
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            ref={(element) => {
              if (element) itemRefs.current.set(tab.value, element);
              else itemRefs.current.delete(tab.value);
            }}
            value={tab.value}
            className={cn(
              'relative z-10 flex items-center justify-center rounded-sm border-b-0 px-3 py-1.5',
              'data-[state=active]:text-cta-on data-[state=active]:border-b-0',
              touchTarget,
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
