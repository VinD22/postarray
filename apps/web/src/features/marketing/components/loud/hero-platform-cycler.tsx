'use client';

import { useRef } from 'react';

import { EASE_OUT_BACK, EXPRESSIVE_SM } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { cn } from '@relay/design-system/utils';

export interface HeroPlatformCyclerProps {
  /** Already-translated platform names, in the order they cycle. */
  readonly platforms: readonly string[];
  /** Milliseconds each name holds before the next flip. */
  readonly intervalMs?: number;
  readonly className?: string;
}

/**
 * The hero's cycling platform word: one word that flips up to the next
 * platform name on a timer, brand-colored.
 *
 * The visible word is `aria-hidden`; a `sr-only` sibling states the whole
 * list once, plainly, so a screen reader never has to track a value that
 * changes every 2.2s on its own. `document.hidden` gates each tick, so a
 * backgrounded tab does not pay for animation nobody sees. Reduced motion
 * (`useMotionOk`) skips the effect entirely and leaves the first platform
 * name showing, statically, which is also exactly what server HTML renders
 * before hydration.
 */
export function HeroPlatformCycler({
  platforms,
  intervalMs = 2200,
  className,
}: HeroPlatformCyclerProps) {
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
            yPercent: -100,
            opacity: 0,
            duration: EXPRESSIVE_SM * 0.6,
            ease: EASE_OUT_BACK,
          })
          .call(() => {
            el.textContent = next;
          })
          .fromTo(
            el,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: EXPRESSIVE_SM, ease: EASE_OUT_BACK },
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
