'use client';

import { useRef, type ReactNode } from 'react';

import { EASE_OUT_EXPO, EXPRESSIVE_SM } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

export interface StaggerListProps {
  /** Selector (scoped to this container) picking out the items to stagger. */
  readonly selector?: string;
  /** Seconds between each item's start. */
  readonly stagger?: number;
  /** Starting vertical offset in px for each item. */
  readonly y?: number;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Staggers its `[data-stagger-item]` children in with one timeline as the
 * list scrolls into view.
 *
 * Reduced motion renders the finished, static list — see the header comment
 * in `lib/motion/gsap.ts`. Mark each item that should participate with
 * `data-stagger-item` (or pass a custom `selector`); items are never hidden
 * in server-rendered markup, only inside `useGSAP`.
 */
export function StaggerList({
  selector = '[data-stagger-item]',
  stagger = 0.04,
  y = 14,
  className,
  children,
}: StaggerListProps) {
  const scope = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();

  useGSAP(
    () => {
      if (!motionOk || !scope.current) return;

      const items = gsap.utils.toArray<HTMLElement>(selector, scope.current);
      if (items.length === 0) return;

      gsap.from(items, {
        opacity: 0,
        y,
        stagger,
        duration: EXPRESSIVE_SM,
        ease: EASE_OUT_EXPO,
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 85%',
          once: true,
        },
      });
    },
    { scope, dependencies: [motionOk, selector, stagger, y] },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
