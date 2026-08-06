'use client';

import { useRef, useState } from 'react';

import { EASE_OUT_EXPO, EXPRESSIVE_LG } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

export interface CountUpProps {
  readonly value: number;
  /** Caller passes formatting, typically an `Intl.NumberFormat` bound to the active locale. */
  readonly format: (value: number) => string;
  readonly className?: string;
}

/**
 * Counts a number up from 0 as it scrolls into view.
 *
 * A numeric proxy is tweened (never the rendered string itself) and snapped
 * to whole numbers each frame; `format` renders it exactly the same way a
 * static value would, so reduced motion — which renders `format(value)`
 * immediately, no tween — looks identical at rest. `data-numeric` opts into
 * the shared tabular-figure styling in `globals.css`.
 */
export function CountUp({ value, format, className }: CountUpProps) {
  const scope = useRef<HTMLSpanElement>(null);
  const motionOk = useMotionOk();
  const [display, setDisplay] = useState(value);

  useGSAP(
    () => {
      if (!motionOk || !scope.current) {
        setDisplay(value);
        return;
      }

      const proxy = { value: 0 };
      const tween = gsap.to(proxy, {
        value,
        duration: EXPRESSIVE_LG,
        ease: EASE_OUT_EXPO,
        snap: { value: 1 },
        onUpdate: () => setDisplay(proxy.value),
        scrollTrigger: {
          trigger: scope.current,
          start: 'top 85%',
          once: true,
        },
      });

      return () => {
        tween.kill();
      };
    },
    { scope, dependencies: [motionOk, value] },
  );

  return (
    <span ref={scope} data-numeric className={className}>
      {format(display)}
    </span>
  );
}
