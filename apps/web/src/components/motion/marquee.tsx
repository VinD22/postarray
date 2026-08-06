'use client';

import { useRef, type ReactNode } from 'react';

import { useDirectionAttributes } from '@/lib/i18n';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { cn } from '@relay/design-system/utils';

export interface MarqueeProps {
  /** px/s the track travels at. */
  readonly speed?: number;
  /** Direction is logical: 'forward' follows reading order (inline-end in LTR, inline-start in RTL). */
  readonly direction?: 'forward' | 'reverse';
  readonly pauseOnHover?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

/**
 * An infinitely looping horizontal track.
 *
 * The track is duplicated once — a visible copy and an `aria-hidden` copy —
 * and translated by `xPercent -100` in a seamless loop; screen readers only
 * ever see the one real copy. Reduced motion renders a single static,
 * horizontally-scrollable row instead (see the header comment in
 * `lib/motion/gsap.ts`).
 */
export function Marquee({
  speed = 40,
  direction = 'forward',
  pauseOnHover = true,
  className,
  children,
}: MarqueeProps) {
  const scope = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();
  const { dir } = useDirectionAttributes();

  useGSAP(
    () => {
      if (!motionOk || !scope.current || !trackRef.current) return;

      const el = scope.current;
      const track = trackRef.current;
      const isRtl = dir === 'rtl';
      // 'forward' follows reading order: toward inline-end in LTR, toward
      // inline-start in RTL. 'reverse' is the opposite of that.
      const movesTowardInlineStart = direction === 'forward' ? isRtl : !isRtl;
      const trackWidth = track.scrollWidth / 2;
      const distanceDuration = trackWidth > 0 ? trackWidth / speed : 0;

      const tween = gsap.fromTo(
        track,
        { xPercent: movesTowardInlineStart ? 0 : -100 },
        {
          xPercent: movesTowardInlineStart ? -100 : 0,
          duration: distanceDuration,
          ease: 'none',
          repeat: -1,
        },
      );

      if (!pauseOnHover) return;

      const pause = () => tween.pause();
      const resume = () => tween.play();
      el.addEventListener('mouseenter', pause);
      el.addEventListener('mouseleave', resume);
      el.addEventListener('focusin', pause);
      el.addEventListener('focusout', resume);

      return () => {
        el.removeEventListener('mouseenter', pause);
        el.removeEventListener('mouseleave', resume);
        el.removeEventListener('focusin', pause);
        el.removeEventListener('focusout', resume);
      };
    },
    { scope, dependencies: [motionOk, speed, direction, pauseOnHover, dir] },
  );

  if (!motionOk) {
    return (
      <div className={cn('overflow-x-auto', className)}>
        <div className="flex w-max">{children}</div>
      </div>
    );
  }

  return (
    <div ref={scope} className={cn('overflow-hidden', className)}>
      <div ref={trackRef} className="flex w-max">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
