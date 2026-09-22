'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

/** Functional tier: 120ms with an 8px rise, the in-app route change. */
const DURATION_MS = 120;
const RISE_PX = 8;
const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

/**
 * The signed-in route transition, without GSAP.
 *
 * The app shell used the GSAP page transition, which put the GSAP core and its
 * plugins in the bundle of every signed-in screen for a 120ms fade. This uses
 * the Web Animations API instead: no dependency, and the element keeps its
 * finished state in markup, so nothing is hidden before JavaScript runs.
 *
 * The first render is never animated, only pathname changes after it, and
 * reduced motion skips the animation entirely.
 */
export function RouteFade({
  className,
  children,
}: {
  readonly className?: string;
  readonly children: ReactNode;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    const element = scope.current;
    if (element === null || typeof element.animate !== 'function') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = element.animate(
      [
        { opacity: 0, transform: `translateY(${RISE_PX}px)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration: DURATION_MS, easing: EASE_OUT_EXPO },
    );
    return () => {
      animation.cancel();
    };
  }, [pathname]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
