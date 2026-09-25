'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';

import { cn } from '../utils/cn';

/**
 * The container every chart in the kit is drawn inside.
 *
 * It is a `<figure>` with a real `<figcaption>`, not a div with a heading. A
 * figure is what a chart is: a thing set apart from the prose that carries its
 * own caption, and a screen reader announces it as one. The caption is a
 * required prop rather than an optional decoration, because a chart whose
 * caption is optional ships without one.
 *
 * Accessibility, in three layers rather than one:
 *
 * 1. The `<svg>` is `role="img"` with an `aria-label` the caller writes: one
 *    sentence saying what the picture shows. `role="img"` makes everything
 *    inside it presentational, which is deliberate. A screen reader should
 *    hear the summary, not sixty unlabelled `<path>` elements.
 * 2. The `overlay` layer sits above the SVG in real DOM, outside that
 *    `role="img"` subtree, so the per-point buttons in `chart-tooltip.tsx`
 *    stay both focusable and announced. This is exactly why the hit targets
 *    are HTML and not SVG `<rect>`s.
 * 3. `footer` carries the "View as table" fallback, which is the route to the
 *    actual numbers and is never hidden behind a hover.
 *
 * Sizing: height is fixed by the caller and width comes from a `ResizeObserver`
 * on the figure, so the `viewBox` is always `0 0 width height` at a 1:1 scale.
 * That is what lets the overlay position itself in plain percentages and land
 * exactly on the geometry. Before the observer has measured anything — server
 * render, and the first client paint — `DEFAULT_WIDTH` is used, so the finished
 * chart is in the HTML rather than an empty box that fills in later.
 *
 * There is no entrance animation here and none is permitted. Nothing in this
 * package may delay a number a reader is waiting for.
 */

export interface ChartMargin {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

/** The measured geometry handed to the render props. */
export interface ChartLayout {
  readonly width: number;
  readonly height: number;
  readonly margin: ChartMargin;
  /** Plot area, margins removed. Never negative. */
  readonly innerWidth: number;
  readonly innerHeight: number;
}

export interface ChartFrameProps {
  /** The sentence under the chart. Required: a chart without one is a picture. */
  readonly caption: ReactNode;
  /** What the picture shows, for a reader who cannot see it. */
  readonly ariaLabel: string;
  readonly height?: number;
  readonly margin?: Partial<ChartMargin>;
  /** SVG content, positioned by the caller inside the plot area. */
  readonly children: (layout: ChartLayout) => ReactNode;
  /** HTML above the SVG. Where focusable per-point targets belong. */
  readonly overlay?: (layout: ChartLayout) => ReactNode;
  /** Legend, gap sentence and the table fallback, below the caption. */
  readonly footer?: ReactNode;
  readonly className?: string;
}

/**
 * `useLayoutEffect` warns when React renders on the server. The frame wants a
 * pre-paint measurement in the browser, so the chart never flashes at the
 * default width, and wants to stay silent on the server, where there is
 * nothing to measure.
 */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const DEFAULT_HEIGHT = 240;
const DEFAULT_WIDTH = 640;

export const DEFAULT_CHART_MARGIN: ChartMargin = { top: 12, right: 12, bottom: 28, left: 48 };

/**
 * Width only.
 *
 * Observing height as well would let a chart whose height depends on its
 * measured height re-enter the observer, and the height is a prop here anyway.
 */
function useMeasuredWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (element === null) return;

    const apply = (next: number): void => {
      // Round: a fractional viewBox width produces sub-pixel tick positions
      // that shimmer as the container resizes, and nothing here needs the
      // precision.
      const rounded = Math.max(1, Math.round(next));
      setWidth((current) => (current === rounded ? current : rounded));
    };

    apply(element.getBoundingClientRect().width);

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry === undefined) return;
      apply(entry.contentRect.width);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return width;
}

export function ChartFrame({
  caption,
  ariaLabel,
  height = DEFAULT_HEIGHT,
  margin,
  children,
  overlay,
  footer,
  className,
}: ChartFrameProps): ReactNode {
  const figureRef = useRef<HTMLDivElement>(null);
  const width = useMeasuredWidth(figureRef);

  const resolvedMargin: ChartMargin = { ...DEFAULT_CHART_MARGIN, ...margin };
  const layout: ChartLayout = {
    width,
    height,
    margin: resolvedMargin,
    innerWidth: Math.max(0, width - resolvedMargin.left - resolvedMargin.right),
    innerHeight: Math.max(0, height - resolvedMargin.top - resolvedMargin.bottom),
  };

  return (
    <figure className={cn('m-0 flex flex-col gap-2', className)}>
      <div ref={figureRef} className="relative w-full" style={{ height }}>
        <svg
          role="img"
          aria-label={ariaLabel}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          preserveAspectRatio="none"
          className="block h-full w-full overflow-visible"
        >
          {children(layout)}
        </svg>
        {overlay === undefined ? null : (
          // Above the SVG and outside its `role="img"` subtree, so what lives
          // here keeps its own semantics.
          <div className="absolute inset-0">{overlay(layout)}</div>
        )}
      </div>
      <figcaption className="text-body-sm text-text-secondary flex flex-col gap-1">
        {caption}
      </figcaption>
      {footer}
    </figure>
  );
}

