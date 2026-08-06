'use client';

import { useRef, type ReactNode } from 'react';

import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { cn } from '@relay/design-system/utils';

export interface PinnedSceneProps {
  readonly scenes: readonly ReactNode[];
  readonly scrub?: boolean;
  readonly className?: string;
}

/**
 * A pinned, scroll-scrubbed sequence of full-viewport scenes that crossfade
 * as the visitor scrolls. Use at most 1-2 of these per page (see F4).
 *
 * The container is `scenes.length * 100vh` tall so there is scroll distance
 * to scrub through; a `ScrollTrigger` pins the viewport-height frame inside
 * it for that whole distance while a scrubbed timeline crossfades each scene
 * in turn.
 *
 * Reduced motion renders the scenes as ordinary stacked static sections —
 * no pin, no scrub — see the header comment in `lib/motion/gsap.ts`.
 */
export function PinnedScene({ scenes, scrub = true, className }: PinnedSceneProps) {
  const scope = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();

  useGSAP(
    () => {
      if (!motionOk || !scope.current || !pinRef.current || scenes.length < 2) return;

      const sceneEls = gsap.utils.toArray<HTMLElement>('[data-pinned-scene]', scope.current);
      if (sceneEls.length < 2) return;

      gsap.set(sceneEls.slice(1), { autoAlpha: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: () => `+=${(sceneEls.length - 1) * window.innerHeight}`,
          pin: pinRef.current,
          scrub,
        },
      });

      for (let index = 1; index < sceneEls.length; index += 1) {
        const previous = sceneEls[index - 1];
        const current = sceneEls[index];
        if (!previous || !current) continue;
        timeline.to(previous, { autoAlpha: 0, duration: 1 }, index - 1);
        timeline.to(current, { autoAlpha: 1, duration: 1 }, index - 1);
      }
    },
    { scope, dependencies: [motionOk, scenes.length, scrub] },
  );

  if (!motionOk) {
    return (
      <div className={cn('flex flex-col', className)}>
        {scenes.map((scene, index) => (
          // eslint-disable-next-line react/no-array-index-key -- scenes is a fixed positional sequence, not a reorderable list
          <div key={index} data-pinned-scene className="min-h-dvh">
            {scene}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={scope}
      className={cn('relative', className)}
      style={{ minBlockSize: `${scenes.length * 100}dvh` }}
    >
      <div ref={pinRef} className="relative h-dvh overflow-hidden">
        {scenes.map((scene, index) => (
          // eslint-disable-next-line react/no-array-index-key -- scenes is a fixed positional sequence, not a reorderable list
          <div key={index} data-pinned-scene className="absolute inset-0">
            {scene}
          </div>
        ))}
      </div>
    </div>
  );
}
