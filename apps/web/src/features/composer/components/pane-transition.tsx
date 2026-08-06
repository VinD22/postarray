'use client';

/**
 * Swaps the composer's one open pane — master draft vs. the version for the
 * open target, or one mobile step vs. the next — without ever hiding the
 * finished pane behind a pre-animated initial state. React already swaps the
 * DOM subtree when `panelKey` changes (the caller decides which pane to
 * render); this only plays the incoming pane's own entrance, exactly like
 * `PageTransitionProvider`'s `app` tier (WP-5), but sliding 16px from the
 * inline end instead of rising, since a pane change here reads as "moved
 * sideways to the next target" rather than "a new page arrived". The slide
 * direction is logical, resolved against `dir`, so `Ctrl+[` and `Ctrl+]`
 * still read as "back" and "forward" under `dir="rtl"`.
 *
 * No outgoing-pane exit is modeled — the previous pane is simply gone by the
 * time this runs, and animating an exit would mean keeping stale DOM around
 * after a keyboard target-hop, which is exactly the kind of overhead the
 * composer's hottest interactions cannot afford. Duration stays at the
 * functional 160ms tier (not the expressive one) so `Ctrl+]` target-hopping
 * stays under WP-8's 180ms acceptance bound. Reduced motion swaps instantly.
 */

import { useRef, type ReactNode } from 'react';

import { useDirectionAttributes } from '@/lib/i18n';
import { DURATION_BASE } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

const SLIDE_PX = 16;
// A short, low-overshoot spring — noticeable at 160ms without the bounce
// reading as sluggish the way the marketing-tier `back.out(1.7)` would here.
const EASE_SPRING = 'back.out(1.2)';

export interface PaneTransitionProps {
  /** Identifies the pane currently rendered as children. Changing it plays the entrance. */
  readonly panelKey: string;
  readonly className?: string;
  readonly children: ReactNode;
}

export function PaneTransition({ panelKey, className, children }: PaneTransitionProps): ReactNode {
  const scope = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const previousKey = useRef(panelKey);
  const { dir } = useDirectionAttributes();

  useGSAP(
    () => {
      if (!motionOk || !scope.current) return;
      if (previousKey.current === panelKey) return;
      previousKey.current = panelKey;

      const isRtl = dir === 'rtl';
      gsap.from(scope.current, {
        opacity: 0,
        x: isRtl ? -SLIDE_PX : SLIDE_PX,
        duration: DURATION_BASE,
        ease: EASE_SPRING,
      });
    },
    { scope, dependencies: [motionOk, panelKey, dir] },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
