'use client';

import { useRef, type ElementType, type ReactNode, type Ref } from 'react';

import { EASE_OUT_EXPO, EXPRESSIVE_SM } from '@/lib/motion/constants';
import { gsap, useGSAP, type ScrollTrigger } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

export interface RevealProps {
  /** The rendered tag/component. Defaults to `'div'`. */
  readonly as?: ElementType;
  /** Starting vertical offset in px; the element rises from here to 0. */
  readonly y?: number;
  /** Seconds to wait before the reveal starts. */
  readonly delay?: number;
  /** Whether the reveal plays once (default) or replays every time it re-enters the viewport. */
  readonly once?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Fades and rises its children in once they scroll into view.
 *
 * Server HTML renders `children` in their finished state — see the header
 * comment in `lib/motion/gsap.ts`. The hidden/offset starting point is only
 * ever set inside `useGSAP`, scoped to this component's container, so
 * no-JS and reduced-motion visitors never see anything but the final layout.
 */
export function Reveal({ as, y = 24, delay, once = true, className, children }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const scope = useRef<HTMLElement>(null);
  const motionOk = useMotionOk();

  useGSAP(
    () => {
      if (!motionOk || !scope.current) return;

      gsap.from(scope.current, {
        opacity: 0,
        y,
        delay,
        duration: EXPRESSIVE_SM,
        ease: EASE_OUT_EXPO,
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 85%',
          once,
        } satisfies ScrollTrigger.Vars,
      });
    },
    { scope, dependencies: [motionOk, y, delay, once] },
  );

  return (
    <Tag ref={scope as Ref<HTMLElement>} className={className}>
      {children}
    </Tag>
  );
}
