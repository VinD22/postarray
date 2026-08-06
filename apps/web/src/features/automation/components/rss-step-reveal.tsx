'use client';

import { useRef, type ReactNode } from 'react';

import { useDirectionAttributes } from '@/lib/i18n';
import { EASE_OUT_BACK, EXPRESSIVE_SM } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

const SLIDE_PX = 24;

/**
 * The RSS wizard's step-becomes-available transition (WP-11).
 *
 * The plan asks this screen to "share onboarding transitions" — onboarding's
 * own recipe is `<PageTransitionProvider tier="onboarding">`
 * (`components/motion/page-transition-provider.tsx`, WP-4): a springy 24px
 * logical inline-end slide + fade on `usePathname()` change. That component
 * cannot be reused as-is here: the six wizard steps are sections of one route
 * rather than six routes, gated by feed validation instead of navigation, so
 * `usePathname()` never changes between them. This leaf plays the identical
 * motion — same `EXPRESSIVE_SM` duration, same `EASE_OUT_BACK` curve, same
 * logical direction handling — the instant a step's `active` flag flips from
 * `false` to `true` (the step becoming available), which is this screen's
 * equivalent of "the next step arrived".
 *
 * This is a second, narrow, named exception to "product screens outside
 * onboarding use `tier=\"app\"`" (see `components/motion/README.md`) — it
 * imports `@/lib/motion/gsap` directly rather than reaching for
 * `<KineticHeadline>`/`<Marquee>`/`<PinnedScene>`, exactly as the README's
 * existing exceptions for the app shell and onboarding's own receipt do.
 *
 * Reduced motion renders the finished state with no animation
 * (`useMotionOk()`); this never withholds content behind a hidden initial
 * state — the server-rendered step is already visible, this only adds a
 * one-time `gsap.from` on top of it once the client confirms motion is on.
 */
export function RssStepReveal({
  active,
  children,
}: {
  readonly active: boolean;
  readonly children: ReactNode;
}): ReactNode {
  const scope = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const played = useRef(false);
  const { dir } = useDirectionAttributes();

  useGSAP(
    () => {
      if (!motionOk || !scope.current || !active || played.current) return;
      played.current = true;
      const isRtl = dir === 'rtl';
      gsap.from(scope.current, {
        opacity: 0,
        x: isRtl ? -SLIDE_PX : SLIDE_PX,
        duration: EXPRESSIVE_SM,
        ease: EASE_OUT_BACK,
      });
    },
    { scope, dependencies: [motionOk, active, dir] },
  );

  return <div ref={scope}>{children}</div>;
}
