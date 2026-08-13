'use client';

/**
 * The calendar's two mount-only flourishes.
 *
 * Both exist to make arriving on the calendar feel like the week assembling
 * itself, and both are strictly one-shot. That is the whole design
 * constraint: this surface re-renders on every filter change, every arrow
 * key of a keyboard move and every pointer move of a drag, and a flourish
 * that replayed on any of those would turn the calendar from quick into
 * laggy. `useRef` guards, not `useEffect` dependency lists, because a
 * dependency list still fires again when the dependency legitimately changes.
 *
 * Both stay inside the fast in-app tier: 200ms strokes, 40ms apart. Neither
 * runs at all under reduced motion, and neither authors hidden state in
 * markup, so the server render is the finished week.
 */

import { useRef, type RefObject } from 'react';

import { DURATION_FAST, DURATION_SLOW, EASE_OUT_BACK, EASE_STANDARD } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

/** Marks a column that participates in the first-paint week fill. */
export const WEEK_CELL_ATTRIBUTE = 'data-week-cell';

/** Marks the one cell that is today. At most one per view. */
export const TODAY_CELL_ATTRIBUTE = 'data-today-cell';

/** Seconds between one column arriving and the next. */
const CELL_STAGGER = 0.04;

/**
 * Fills the week in once, on first paint, and never again.
 *
 * `enabled` lets a caller hold the animation until it actually has columns to
 * animate; the guard still only ever lets it run once, so a view that
 * arrives late still animates and a view that re-renders does not.
 */
export function useWeekFill(scope: RefObject<HTMLElement | null>, enabled = true): void {
  const motionOk = useMotionOk();
  const played = useRef(false);

  useGSAP(
    () => {
      if (!motionOk || !enabled || played.current || !scope.current) return;
      const cells = gsap.utils.toArray<HTMLElement>(`[${WEEK_CELL_ATTRIBUTE}]`, scope.current);
      if (cells.length === 0) return;
      played.current = true;

      gsap.from(cells, {
        opacity: 0,
        y: 8,
        duration: DURATION_SLOW,
        ease: EASE_STANDARD,
        stagger: CELL_STAGGER,
        clearProps: 'opacity,transform',
      });
    },
    { scope, dependencies: [motionOk, enabled] },
  );
}

/**
 * Pulses today's cell once, on first paint.
 *
 * A single up-and-back on `scale`, transform only. It is decorative: today is
 * already named by its own styling and by the cell's accessible label, so
 * nothing is lost when this never plays.
 */
export function useTodayPulse(scope: RefObject<HTMLElement | null>): void {
  const motionOk = useMotionOk();
  const played = useRef(false);

  useGSAP(
    () => {
      if (!motionOk || played.current || !scope.current) return;
      const cell = scope.current.querySelector<HTMLElement>(`[${TODAY_CELL_ATTRIBUTE}]`);
      if (!cell) return;
      played.current = true;

      gsap.fromTo(
        cell,
        { scale: 1 },
        {
          scale: 1.12,
          duration: DURATION_FAST,
          ease: EASE_OUT_BACK,
          yoyo: true,
          repeat: 1,
          clearProps: 'scale',
        },
      );
    },
    { scope, dependencies: [motionOk] },
  );
}
