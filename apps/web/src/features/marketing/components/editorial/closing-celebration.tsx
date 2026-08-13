'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { CelebrationBurst } from '@/components/motion';

/**
 * One small burst, the first time the closing band is actually on screen.
 *
 * `CelebrationBurst` fires on mount when it has no `trigger`, and the closing
 * band is the last thing on the page, so mounting it directly would fire the
 * celebration while the reader is still in the hero — a celebration nobody
 * sees is just a paint. So the burst is not mounted at all until an
 * `IntersectionObserver` says the band has entered the viewport, and the
 * observer disconnects immediately afterwards: once per page load, never
 * again on the way back up.
 *
 * `IntersectionObserver` rather than a scroll handler on purpose — no layout
 * read on a scroll frame, which is the performance budget in
 * `components/motion/README.md`.
 *
 * Reduced motion needs no branch here: `CelebrationBurst` renders nothing at
 * all under it, because a celebration carries no information and absence is
 * the correct fallback. The sentence this band is celebrating is in the band.
 */
export function ClosingCelebration(): ReactNode {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    // No `IntersectionObserver` (old browser, some test environments) means
    // no burst. That is the same outcome as reduced motion, and correct:
    // nothing on the page depends on it.
    if (!anchor || seen || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setSeen(true);
      },
      { threshold: 0.35 },
    );
    observer.observe(anchor);
    return () => {
      observer.disconnect();
    };
  }, [seen]);

  return (
    <span ref={anchorRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {seen ? <CelebrationBurst tier="sm" /> : null}
    </span>
  );
}
