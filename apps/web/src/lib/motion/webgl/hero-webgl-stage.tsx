'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { PublishFanoutFallback } from './publish-fanout-fallback';
import { readSceneColors } from './scene-colors';
import { useWebglAllowed } from './webgl-guard';
import { WebglErrorBoundary } from './webgl-error-boundary';
import type { PublishSceneColors } from './hero-publish-scene';

/**
 * The hero's one WebGL element, orchestrated.
 *
 * Server HTML and every first paint render `PublishFanoutFallback` — plain
 * SVG, no JavaScript required. The canvas
 * (`hero-publish-scene.tsx`, `three`/`@react-three/fiber`) only replaces it
 * once all of the following are true, checked in this order:
 *
 * 1. `useWebglAllowed()` clears the browser: motion is not reduced, the
 *    connection is not save-data, device memory and core count (where the
 *    browser reports them) are not too low, and a throwaway WebGL context
 *    probe succeeded.
 * 2. This element has actually scrolled into view (`IntersectionObserver`).
 * 3. The main thread is idle (`requestIdleCallback`, with a `setTimeout`
 *    fallback for Safari) — so this never competes with the rest of the
 *    hero, including `HeroDemoSection`, for the frames that produce first
 *    paint or LCP. The hero `<h1>` is the LCP element (see
 *    `components/motion/README.md`'s performance budget); nothing here loads
 *    early enough to contend with it.
 *
 * `next/dynamic(..., { ssr: false })` is what keeps `three` and
 * `@react-three/fiber` out of both the server bundle and every other route's
 * client bundle: this module is the only place in the app that imports
 * `hero-publish-scene.tsx`, and the dynamic import additionally gives it its
 * own chunk, fetched only once step 3 above actually happens.
 *
 * Once mounted, the canvas stays mounted rather than tearing down and
 * rebuilding its WebGL context on every scroll — `active` (intersecting AND
 * not `document.hidden`) is threaded through as the Canvas `frameloop` prop
 * instead, which stops `requestAnimationFrame` outright rather than merely
 * skipping work inside it. `WebglErrorBoundary` is the last line of defence:
 * if the real canvas still fails to acquire a context after the guard
 * cleared it, this swaps back to the same static fallback rather than
 * blanking the hero.
 */

const HeroPublishCanvas = dynamic(() => import('./hero-publish-scene'), {
  ssr: false,
  loading: () => <PublishFanoutFallback className="h-full w-full" />,
});

/** Longest we will wait for a genuinely idle moment before loading anyway. */
const IDLE_TIMEOUT_MS = 1500;
/** `setTimeout` stand-in for browsers with no `requestIdleCallback` (Safari). */
const IDLE_FALLBACK_DELAY_MS = 200;
const MAX_DPR = 2;

type IdleDeadline = { readonly didTimeout: boolean; readonly timeRemaining: () => number };
type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (
    callback: (deadline: IdleDeadline) => void,
    opts?: { timeout: number },
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/** Schedules `callback` for an idle moment; returns a canceller. */
function scheduleIdle(callback: () => void): () => void {
  const win = window as WindowWithIdleCallback;
  if (typeof win.requestIdleCallback === 'function') {
    const handle = win.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT_MS });
    return () => win.cancelIdleCallback?.(handle);
  }
  const handle = window.setTimeout(callback, IDLE_FALLBACK_DELAY_MS);
  return () => window.clearTimeout(handle);
}

export interface HeroWebglStageProps {
  readonly className?: string;
}

/** Purely decorative next to the reach figure it sits beside — never announced. */
export function HeroWebglStage({ className }: HeroWebglStageProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const allowed = useWebglAllowed();

  const [intersecting, setIntersecting] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [colors, setColors] = useState<PublishSceneColors | null>(null);

  // Kept alive for the whole mounted lifetime, not disconnected after the
  // first hit: `intersecting` also drives pause/resume once the canvas is up.
  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => setIntersecting(entries[0]?.isIntersecting ?? false),
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setDocumentHidden(document.hidden);
    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  useEffect(() => {
    if (!allowed || !intersecting || ready) return;
    const cancel = scheduleIdle(() => {
      setColors(readSceneColors(containerRef.current ?? document.documentElement));
      setReady(true);
    });
    return cancel;
  }, [allowed, intersecting, ready]);

  // Computed once on the client (this component never renders the canvas
  // during SSR, so `window` is always defined by the time this actually
  // matters); a fixed value rather than something re-derived every frame.
  const dpr = useMemo(
    () => (typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio, MAX_DPR)),
    [],
  );

  const active = intersecting && !documentHidden;

  return (
    <div ref={containerRef} aria-hidden="true" className={className}>
      {ready && colors ? (
        <WebglErrorBoundary fallback={<PublishFanoutFallback className="h-full w-full" />}>
          <HeroPublishCanvas colors={colors} active={active} dpr={dpr} />
        </WebglErrorBoundary>
      ) : (
        <PublishFanoutFallback className="h-full w-full" />
      )}
    </div>
  );
}
