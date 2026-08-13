'use client';

/**
 * The empty scene.
 *
 * A small line drawing and one sentence, for the screens a brand new
 * workspace sees before it has any data. These carry more of the product's
 * personality than any polished full state does, because they are the first
 * thing anybody looks at.
 *
 * Three deliberate constraints:
 *
 * 1. **Drawn in code, not generated.** Every scene is a short list of SVG
 *    path commands in this file. Nothing here is an exported asset, so there
 *    is no binary to keep in sync with the palette, it inherits `currentColor`
 *    in both themes for free, and it costs nothing to load.
 * 2. **Deterministic.** No `Math.random()` anywhere: the same scene name
 *    always produces byte-identical markup, so the server render and the
 *    client hydration agree.
 * 3. **The finished drawing is the server HTML.** The stroke draw-in is set
 *    up entirely from inside `useGSAP` — the markup carries no dash
 *    attributes and no `opacity-0`, so a no-JS client and a reduced-motion
 *    visitor get the complete drawing at first paint. That is the rule in
 *    `components/motion/README.md`, and it matters more here than usual:
 *    this drawing is often the largest thing on an otherwise empty screen.
 *
 * The draw-in runs at the fast in-app tier (200ms per stroke, 40ms apart),
 * not the expressive one. An empty state is a working screen.
 */

import { useRef, type ReactNode } from 'react';

import { cn } from '@relay/design-system/utils';

import { useTranslations } from '@/lib/i18n';
import { DURATION_SLOW, EASE_OUT_EXPO } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

/** Seconds between one stroke starting and the next. Matches the calendar's. */
const STROKE_STAGGER = 0.04;

export type EmptySceneName =
  'analytics' | 'library' | 'actionCenter' | 'calendar' | 'receipts' | 'digest';

/**
 * The scenes, as path data on a 96x64 canvas.
 *
 * Each is a handful of open strokes rather than one long outline, because the
 * draw-in reads as drawing only when the strokes arrive in a sensible order:
 * the frame, then what is inside it.
 */
const SCENE_PATHS: Readonly<Record<EmptySceneName, readonly string[]>> = {
  // A baseline and four bars of honest, uneven heights.
  analytics: ['M12 52 H84', 'M24 52 V38', 'M40 52 V25', 'M56 52 V44', 'M72 52 V31'],
  // A picture frame with a horizon, a peak and a sun.
  library: [
    'M14 14 H82 V54 H14 Z',
    'M22 47 L38 29 L50 40 L58 33 L74 47',
    'M64 24 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
  ],
  // An inbox tray with its lid folded back, and nothing in it.
  actionCenter: ['M14 34 H32 L38 45 H58 L64 34 H82 V54 H14 Z', 'M24 34 L31 16 H65 L72 34'],
  // A month grid with its two hangers and one empty week rule.
  calendar: ['M14 18 H82 V54 H14 Z', 'M14 30 H82', 'M30 12 V22', 'M66 12 V22', 'M26 42 H44'],
  // A slip with a torn foot: the shape of every receipt in this product.
  receipts: ['M28 10 H68 V48 L60 54 L52 48 L44 54 L36 48 L28 54 Z', 'M38 24 H58', 'M38 33 H58'],
  // A page of prose with a mark beside it.
  digest: ['M20 12 H68 V54 H20 Z', 'M30 26 H58', 'M30 35 H58', 'M30 44 H46', 'M78 20 V32'],
};

export interface EmptySceneProps {
  readonly scene: EmptySceneName;
  /**
   * Overrides the catalog sentence for this scene. Pass an already-translated
   * string; leave it off and the scene uses `empty.scene.<name>.line`, which
   * is the case every caller should want.
   */
  readonly line?: string;
  readonly className?: string;
}

export function EmptyScene({ scene, line, className }: EmptySceneProps): ReactNode {
  const t = useTranslations();
  const scope = useRef<HTMLDivElement>(null);
  const motionOk = useMotionOk();

  useGSAP(
    () => {
      if (!motionOk || !scope.current) return;

      const paths = gsap.utils.toArray<SVGPathElement>('path', scope.current);
      // JSDOM has no SVG geometry, so `getTotalLength` is missing there
      // rather than wrong. No length means no dash to animate, which means
      // the drawing simply renders finished — which is the fallback we want
      // anyway, so there is nothing to branch on beyond this filter.
      const measured = paths
        .map((path) => ({
          path,
          length: typeof path.getTotalLength === 'function' ? path.getTotalLength() : 0,
        }))
        .filter((entry) => entry.length > 0);
      if (measured.length === 0) return;

      for (const entry of measured) {
        gsap.set(entry.path, {
          strokeDasharray: entry.length,
          strokeDashoffset: entry.length,
        });
      }

      gsap.to(
        measured.map((entry) => entry.path),
        {
          strokeDashoffset: 0,
          duration: DURATION_SLOW,
          ease: EASE_OUT_EXPO,
          stagger: STROKE_STAGGER,
          // Hands the dash back to the stylesheet once drawn, so nothing in
          // this subtree keeps a stale inline dash pattern around.
          clearProps: 'strokeDasharray,strokeDashoffset',
        },
      );
    },
    { scope, dependencies: [motionOk, scene] },
  );

  return (
    <div ref={scope} className={cn('flex flex-col items-center gap-3 text-center', className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 96 64"
        className="text-border-strong h-16 w-24 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {SCENE_PATHS[scene].map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
      <p className="prose-measure text-body-md text-text-secondary">
        {line ?? t(`empty.scene.${scene}.line`)}
      </p>
    </div>
  );
}
