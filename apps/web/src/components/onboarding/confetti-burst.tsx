'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { usePrefersReducedMotion } from '@relay/design-system/hooks';
import { cn } from '@relay/design-system/utils';

const PARTICLE_COUNT = 20;

// Brand blue, sunshine CTA yellow, bubblegum pop pink — the loud system's
// three accent tones, cycled deterministically rather than at random so
// server and client (if this ever needed to agree, e.g. a future test
// snapshot) never disagree.
const TONE_CLASS = ['bg-accent', 'bg-cta', 'bg-blush'] as const;

/**
 * A one-time, 1.2s burst of twenty small rectangles in the brand/cta/pop
 * trio, radiating out from a fixed point.
 *
 * Fires exactly once: `firedRef` guards against React StrictMode's double
 * mount in development re-triggering the effect, and there is nothing here
 * that resets it, so a re-render for an unrelated reason (the parent
 * `done-step.tsx` re-rendering on a prop change) never replays it either.
 *
 * Renders nothing at all — not a frozen, invisible burst — under
 * `prefers-reduced-motion`. That is a deliberate difference from most motion
 * primitives in this codebase, which render their finished static state
 * under reduced motion; a finished confetti burst has no meaningful static
 * state (twenty rectangles scattered at their landing points would just be
 * clutter), so "skipped" here means "never mounted", not "frozen".
 */
export function ConfettiBurst() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const firedRef = useRef(false);
  const [fire, setFire] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || firedRef.current) {
      return;
    }
    firedRef.current = true;
    setFire(true);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion || !fire) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="inset-inline-start-1/2 pointer-events-none fixed top-16 overflow-visible"
    >
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => {
        const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
        const distance = 70 + (index % 5) * 18;
        const x = Math.round(Math.cos(angle) * distance);
        const y = Math.round(Math.sin(angle) * distance - 40);
        const style = {
          '--confetti-x': `${x}px`,
          '--confetti-y': `${y}px`,
          '--confetti-delay': `${(index % 4) * 40}ms`,
          rotate: `${(index * 37) % 360}deg`,
        } as CSSProperties;

        return (
          <span
            key={index}
            style={style}
            className={cn('relay-confetti-piece', TONE_CLASS[index % TONE_CLASS.length])}
          />
        );
      })}
    </div>
  );
}
