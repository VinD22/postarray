'use client';

import { useRef } from 'react';

import { EASE_OUT_EXPO, EXPRESSIVE_SM } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { cn } from '@relay/design-system/utils';

export interface EditorialPlatformCyclerProps {
  /** Already-translated platform names, in the order they cycle. */
  readonly platforms: readonly string[];
  /** Milliseconds each name holds before the next flip. */
  readonly intervalMs?: number;
  readonly className?: string;
}

/**
 * The hero's cycling platform word: one word that flips up to the next
 * platform name on a timer.
 *
 * Mechanics and accessibility are unchanged from the loud
 * `HeroPlatformCycler`. The visible word is `aria-hidden`; a `sr-only` sibling
 * states the whole list once, plainly, so a screen reader never has to track a
 * value that changes every 2.2s on its own. `document.hidden` gates each tick,
 * so a backgrounded tab does not pay for animation nobody sees. Reduced motion
 * (`useMotionOk`) skips the effect entirely and leaves the first platform name
 * showing statically, which is exactly what server HTML renders before
 * hydration.
 *
 * The surface change is the ease. The loud version used `back.out(1.7)`, which
 * overshoots and settles back — a bounce at display scale. The editorial one
 * uses `expo.out`: the word arrives fast and stops, with no rebound.
 */
export function EditorialPlatformCycler({
  platforms,
  intervalMs = 2200,
  className,
}: EditorialPlatformCyclerProps) {
  const scope = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);
  const motionOk = useMotionOk();
  const firstPlatform = platforms[0] ?? '';

  useGSAP(
    () => {
      if (!motionOk || !scope.current || platforms.length < 2) return;

      const el = scope.current;

      const showNext = () => {
        if (document.hidden) return;
        indexRef.current = (indexRef.current + 1) % platforms.length;
        const next = platforms[indexRef.current] ?? '';

        const timeline = gsap.timeline();
        timeline
          .to(el, {
            yPercent: -60,
            opacity: 0,
            duration: EXPRESSIVE_SM * 0.6,
            ease: EASE_OUT_EXPO,
          })
          .call(() => {
            el.textContent = next;
          })
          .fromTo(
            el,
            { yPercent: 60, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: EXPRESSIVE_SM, ease: EASE_OUT_EXPO },
          );
      };

      const intervalId = window.setInterval(showNext, intervalMs);
      return () => {
        window.clearInterval(intervalId);
      };
    },
    { scope, dependencies: [motionOk, platforms, intervalMs] },
  );

  return (
    <span className="inline-block">
      <span
        ref={scope}
        aria-hidden="true"
        className={cn('text-text-accent inline-block', className)}
      >
        {firstPlatform}
      </span>
      <span className="sr-only">{platforms.join(', ')}</span>
    </span>
  );
}
