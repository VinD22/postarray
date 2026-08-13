'use client';

import { useRef, type ReactNode } from 'react';

import { gsap, useGSAP, type ScrollTrigger } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

/**
 * Depth is clamped rather than validated: a caller who passes 3 wanted "a lot
 * of parallax", not a layer that travels three viewport heights past its own
 * section. 0.3 is the point where a layer still reads as belonging to the
 * content it sits behind.
 */
const DEPTH_LIMIT = 0.3;

export interface ParallaxLayerProps {
  /**
   * -0.3 to 0.3. Positive drifts the layer against the scroll (it reads as
   * further away), negative drifts it with the scroll (nearer). 0 is inert.
   */
  readonly depth?: number;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * A scroll-scrubbed depth layer.
 *
 * The wrapper's `yPercent` is scrubbed across the whole time the layer is on
 * screen — transform only, so the layer never triggers layout and never
 * changes where anything else sits. Only `ScrollScene` should mount these
 * (`scene-budget.test.ts` enforces it): parallax outside a scene has nothing
 * to be parallax *against*, and unbudgeted drifting layers are exactly the
 * "spamming" the scene budget exists to prevent.
 *
 * With motion off, `children` are returned unwrapped — not a wrapper with the
 * transform skipped, but no wrapper at all, so there is no stray element in
 * the box model and nothing carrying an inline transform. Server HTML is
 * therefore identical to what a reduced-motion visitor sees.
 */
export function ParallaxLayer({ depth = 0.12, className, children }: ParallaxLayerProps) {
  const scope = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const clamped = Math.min(DEPTH_LIMIT, Math.max(-DEPTH_LIMIT, depth));

  useGSAP(
    () => {
      if (!motionOk || !scope.current || clamped === 0) return;

      // `fromTo` rather than `to`: the start value has to exist before the
      // first scrub tick, and it must be set here (client, in an effect) and
      // never in server markup — see the header comment in lib/motion/gsap.ts.
      gsap.fromTo(
        scope.current,
        { yPercent: clamped * 100 },
        {
          yPercent: clamped * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          } satisfies ScrollTrigger.Vars,
        },
      );
    },
    { scope, dependencies: [motionOk, clamped] },
  );

  if (!motionOk) {
    return <>{children}</>;
  }

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
