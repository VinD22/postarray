'use client';

import { useEffect, useRef } from 'react';

import { useMediaQuery } from '@relay/design-system/hooks';

import { useMotionOk } from '@/lib/motion/use-motion-ok';

// Half of `.relay-cursor-dot`'s 6px and `.relay-cursor-ring`'s 28px (theme.css)
// — kept in sync by hand, same convention as `lib/motion/constants.ts`.
const DOT_RADIUS = 3;
const RING_RADIUS = 14;

// How much of the distance to the pointer the ring closes per frame.
const RING_LERP = 0.18;
const CURSOR_TARGET_SELECTOR = '[data-cursor], a, button, summary';

/**
 * A dot + ring that replaces the native cursor on fine-pointer, hover-capable,
 * motion-ok devices — mounted once at the end of `(marketing)/layout.tsx`.
 *
 * SSR renders `null` (the enable gate below defaults to the safe "off" state
 * on the server — see `useMotionOk` and `useMediaQuery`'s doc comments), so
 * first paint never assumes a pointer that might not exist. Once enabled, a
 * single rAF loop writes `transform` only: the dot tracks 1:1, the ring lerps
 * toward it. No geometry is read inside that loop.
 *
 * The native cursor is never hidden globally — only on `a`/`button` while
 * this component is mounted and active (`[data-cursor-active] :where(a,
 * button)` in theme.css). Links, buttons, summaries and opted-in media grow
 * the ring. Tab / `:focus-visible` fades this cursor out and restores the
 * native one until the next pointermove.
 */
export function CustomCursor() {
  const motionOk = useMotionOk({ requireFinePointer: true });
  const isHoverCapable = useMediaQuery('(hover: hover)', false);
  const enabled = motionOk && isHoverCapable;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!enabled || !wrapper || !dot || !ring) return;

    document.documentElement.setAttribute('data-cursor-active', 'true');

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let hasSeenPointer = false;
    let rafId = 0;

    const tick = () => {
      ringX += (pointerX - ringX) * RING_LERP;
      ringY += (pointerY - ringY) * RING_LERP;
      dot.style.transform = `translate3d(${pointerX - DOT_RADIUS}px, ${pointerY - DOT_RADIUS}px, 0)`;
      ring.style.transform = `translate3d(${ringX - RING_RADIUS}px, ${ringY - RING_RADIUS}px, 0)`;
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);

    const showCursor = () => {
      document.documentElement.setAttribute('data-cursor-active', 'true');
      wrapper.removeAttribute('data-cursor-hidden');
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!hasSeenPointer) {
        // Snap the ring to the first known position instead of lerping in
        // from the viewport centre guess above.
        hasSeenPointer = true;
        ringX = pointerX;
        ringY = pointerY;
      }
      showCursor();
    };

    // Event delegation keeps ordinary controls expressive without requiring
    // every shared button and link to carry marketing-only props. A custom
    // `data-cursor` target still opts non-control media into the same response.
    const handlePointerOver = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(CURSOR_TARGET_SELECTOR)) {
        ring.setAttribute('data-cursor-hover', 'true');
      }
    };

    const handlePointerOut = (event: PointerEvent) => {
      const leaving =
        event.target instanceof Element ? event.target.closest(CURSOR_TARGET_SELECTOR) : null;
      if (!leaving) return;
      const entering =
        event.relatedTarget instanceof Element
          ? event.relatedTarget.closest(CURSOR_TARGET_SELECTOR)
          : null;
      if (entering !== leaving) {
        ring.setAttribute('data-cursor-hover', 'false');
      }
    };

    // Mouse leaving the browser window/tab: hide rather than leave the
    // cursor stranded at its last known position.
    const handlePointerLeaveDocument = () => {
      wrapper.setAttribute('data-cursor-hidden', 'true');
    };

    // Keyboard modality: Tab fades the custom cursor and restores the
    // native one; the next pointermove brings the custom cursor back.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      wrapper.setAttribute('data-cursor-hidden', 'true');
      document.documentElement.removeAttribute('data-cursor-active');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeaveDocument);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('pointerleave', handlePointerLeaveDocument);
      window.removeEventListener('keydown', handleKeyDown);
      document.documentElement.removeAttribute('data-cursor-active');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrapperRef} className="relay-cursor" aria-hidden="true">
      <div ref={dotRef} className="relay-cursor-dot" />
      <div ref={ringRef} className="relay-cursor-ring" />
    </div>
  );
}
