'use client';

/**
 * The Growth Advisor's step transition: intake -> confirm -> plan.
 *
 * Same springy 24px inline-end slide + fade as onboarding's own step
 * transition (`components/motion/page-transition-provider.tsx`, `tier="onboarding"`,
 * WP-4) — the Growth Advisor's three steps are a single sequential flow with
 * the same "the next step arrived" feel, just one lived on three routes and
 * this one lives on one route with the step held in local state. That is the
 * only reason this is its own small component instead of reusing
 * `PageTransitionProvider` directly: that provider keys off `usePathname()`,
 * which never changes here.
 */

import { useRef, type ReactNode } from 'react';

import { useDirectionAttributes } from '@/lib/i18n';
import { EASE_OUT_BACK, EXPRESSIVE_SM } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

const SLIDE_PX = 24;

export interface GrowthStepTransitionProps {
  /** The current step. A change plays the transition; the first render never does. */
  readonly activeKey: string;
  readonly className?: string;
  readonly children: ReactNode;
}

export function GrowthStepTransition({
  activeKey,
  className,
  children,
}: GrowthStepTransitionProps): ReactNode {
  const scope = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const previousKey = useRef(activeKey);
  const { dir } = useDirectionAttributes();

  useGSAP(
    () => {
      if (!motionOk || !scope.current) return;
      if (previousKey.current === activeKey) return;
      previousKey.current = activeKey;

      const isRtl = dir === 'rtl';
      gsap.from(scope.current, {
        opacity: 0,
        x: isRtl ? -SLIDE_PX : SLIDE_PX,
        duration: EXPRESSIVE_SM,
        ease: EASE_OUT_BACK,
      });
    },
    { scope, dependencies: [motionOk, activeKey, dir] },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
