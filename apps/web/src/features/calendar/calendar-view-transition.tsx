'use client';

/**
 * The wrapper around whichever layout is currently visible: the grid, the
 * month, the agenda or the table.
 *
 * Day, week, month and list are different components with unrelated DOM
 * shapes, so a GSAP Flip that tracks individual chips across the switch is
 * not attempted here — matching chips by identity across a grid, a month
 * cell, an agenda list and a table row would need to survive four different
 * layouts with no shared structure, and a wrong match would move the wrong
 * post on screen. This plays the documented fallback instead: a 120ms
 * crossfade on every view switch.
 *
 * Stepping to the next or previous period without changing the view is a
 * different case — the same layout, a new window of time — and gets a 16px
 * slide in the logical direction of travel instead of a plain crossfade, so
 * "next week" reads as a step forward rather than a page reload.
 *
 * Never animates on first mount (server HTML is the finished page) and does
 * nothing at all when `usePrefersReducedMotion()` is true.
 */

import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion/constants';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

const STEP_SLIDE_PX = 16;

export interface CalendarViewTransitionProps {
  /** Changes on every view switch and every period step. */
  transitionKey: string;
  /**
   * `1` for a step to the next period, `-1` for the previous period, `0` for
   * a view switch (or the first render, where nothing plays anyway).
   */
  direction: -1 | 0 | 1;
  /** True under `dir="rtl"`, so the slide's physical side mirrors. */
  isRtl: boolean;
  children: ReactNode;
}

export function CalendarViewTransition({
  transitionKey,
  direction,
  isRtl,
  children,
}: CalendarViewTransitionProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const hasMounted = useRef(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (!hasMounted.current) {
        hasMounted.current = true;
        return;
      }
      if (!motionOk) return;

      const physicalSign = isRtl ? -1 : 1;
      const fromX = direction === 0 ? 0 : direction * physicalSign * STEP_SLIDE_PX;

      gsap.fromTo(
        el,
        { autoAlpha: 0, x: fromX },
        { autoAlpha: 1, x: 0, duration: DURATION_FAST, ease: EASE_STANDARD },
      );
    },
    { scope: ref, dependencies: [transitionKey] },
  );

  return <div ref={ref}>{children}</div>;
}
