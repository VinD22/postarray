'use client';

import { usePathname } from 'next/navigation';
import { useRef, type ReactNode } from 'react';

import { useDirectionAttributes } from '@/lib/i18n';
import { EASE_OUT_BACK, EASE_OUT_EXPO, EXPRESSIVE_SM } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

// Marketing choreography reads at up to 300ms; in-app navigation stays fast
// enough not to feel like it's in the way — a 120ms fade with an 8px rise.
// Onboarding sits between the two: a signed-in flow, but a short, linear one
// a person moves through deliberately step by step, so its 400ms springy
// slide (WP-4) reads as "the next step arrived" rather than "the page
// reloaded".
const DURATION_MARKETING = 0.3;
const DURATION_APP = 0.12;
const APP_RISE_PX = 8;
const ONBOARDING_SLIDE_PX = 24;

export interface PageTransitionProviderProps {
  readonly tier?: 'marketing' | 'app' | 'onboarding';
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * Fades new route content in whenever `usePathname()` changes: opacity only
 * for `tier="marketing"`, opacity + an 8px rise for `tier="app"`, and a
 * springy 24px inline-end slide + fade for `tier="onboarding"` (the step
 * rail's own forward motion, echoed in the content pane). The onboarding
 * slide direction is logical — resolved against `dir`, not raw left/right —
 * so it still reads as "forward" under `dir="rtl"`.
 *
 * This wraps whatever the route already rendered — it never withholds
 * content behind a hidden initial state. The very first render (mount) is
 * never animated, only pathname changes after that, so there is no flash on
 * first load. Reduced motion swaps content instantly — see the header
 * comment in `lib/motion/gsap.ts`.
 */
export function PageTransitionProvider({
  tier = 'app',
  className,
  children,
}: PageTransitionProviderProps) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const motionOk = useMotionOk();
  const previousPathname = useRef(pathname);
  const { dir } = useDirectionAttributes();

  useGSAP(
    () => {
      if (!motionOk || !scope.current) return;
      if (previousPathname.current === pathname) return;
      previousPathname.current = pathname;

      if (tier === 'marketing') {
        gsap.from(scope.current, {
          opacity: 0,
          duration: DURATION_MARKETING,
          ease: EASE_OUT_EXPO,
        });
      } else if (tier === 'onboarding') {
        const isRtl = dir === 'rtl';
        gsap.from(scope.current, {
          opacity: 0,
          x: isRtl ? -ONBOARDING_SLIDE_PX : ONBOARDING_SLIDE_PX,
          duration: EXPRESSIVE_SM,
          ease: EASE_OUT_BACK,
        });
      } else {
        gsap.from(scope.current, {
          opacity: 0,
          y: APP_RISE_PX,
          duration: DURATION_APP,
          ease: EASE_OUT_EXPO,
        });
      }
    },
    { scope, dependencies: [motionOk, pathname, tier, dir] },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
