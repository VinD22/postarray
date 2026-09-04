'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactElement } from 'react';

import { cn } from '../utils/cn';

/**
 * The per-point hit targets, and the readout they open.
 *
 * The chart this replaces had a tooltip that was `aria-hidden` and driven by
 * `pointermove`. That is a tooltip nobody can reach without a mouse: no
 * keyboard, no screen reader, no touch. The data was on the screen and out of
 * reach, which is worse than no tooltip at all, because the chart looked
 * finished.
 *
 * So: one real `<button>` per point, in HTML, layered above the SVG rather
 * than inside it. Inside the `svg role="img"` they would be presentational and
 * unreachable again; outside it they are ordinary focusable controls carrying
 * their own accessible name, which is the whole reading for that point.
 *
 * Roving tabindex rather than one tab stop per point. Ninety daily readings
 * would otherwise be ninety presses of Tab between the chart and whatever
 * follows it. One stop enters the group; Left and Right move within it; Home
 * and End jump to the ends. This is the composite-widget pattern, applied to
 * a chart.
 *
 * The readout is a plain positioned box, not a floating library: it is
 * `aria-hidden` on purpose, because its text is already the focused button's
 * accessible name and announcing it twice is noise. It reappears on hover for
 * a pointer user, and neither route is the only one.
 */

export interface ChartHitPoint {
  readonly id: string;
  /** 0 to 100, across the frame. */
  readonly xPercent: number;
  /** 0 to 100, down the frame. `null` for a gap: the marker sits on the axis. */
  readonly yPercent: number | null;
  /**
   * The whole reading as one sentence, already formatted and translated: the
   * date, the series and either the value or the word for unavailable. This is
   * the button's accessible name and the readout's text.
   */
  readonly label: string;
}

export interface ChartPointsProps {
  readonly points: readonly ChartHitPoint[];
  /** Names the group of hit targets, e.g. "Impressions by day, 28 points". */
  readonly groupLabel: string;
  readonly className?: string;
}

export function ChartPoints({ points, groupLabel, className }: ChartPointsProps): ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const [shown, setShown] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Set while a key press is moving focus, so the effect below only steals
  // focus in response to that press and never on an unrelated re-render.
  const movingRef = useRef(false);

  useEffect(() => {
    if (!movingRef.current) return;
    movingRef.current = false;
    const container = containerRef.current;
    if (container === null) return;
    const buttons = container.querySelectorAll<HTMLButtonElement>('button[data-chart-point]');
    buttons[activeIndex]?.focus();
  }, [activeIndex]);

  if (points.length === 0) return <div className={className} />;

  const move = (next: number): void => {
    const clamped = Math.max(0, Math.min(points.length - 1, next));
    movingRef.current = true;
    setActiveIndex(clamped);
    setShown(clamped);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        move(activeIndex + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        move(activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        move(0);
        break;
      case 'End':
        event.preventDefault();
        move(points.length - 1);
        break;
      case 'Escape':
        setShown(null);
        break;
      default:
        break;
    }
  };

  const shownPoint = shown === null ? null : points[shown];

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={groupLabel}
      onKeyDown={onKeyDown}
      className={cn('absolute inset-0', className)}
    >
      {points.map((point, index) => (
        <button
          key={point.id}
          type="button"
          data-chart-point=""
          // Roving: exactly one of these is in the tab order at a time.
          tabIndex={index === activeIndex ? 0 : -1}
          aria-label={point.label}
          onFocus={() => {
            setActiveIndex(index);
            setShown(index);
          }}
          onBlur={() => setShown((current) => (current === index ? null : current))}
          onPointerEnter={() => setShown(index)}
          onPointerLeave={() => setShown((current) => (current === index ? null : current))}
          style={{ insetInlineStart: `${point.xPercent}%`, top: 0, height: '100%' }}
          className={cn(
            // A full-height column so the target is comfortably large for a
            // pointer and for touch, centred on the point.
            'absolute w-6 -translate-x-1/2 rtl:translate-x-1/2',
            'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:-outline-offset-2',
          )}
        >
          {point.yPercent === null ? null : (
            <span
              aria-hidden="true"
              style={{ top: `${point.yPercent}%` }}
              className={cn(
                'bg-chart-line absolute left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2',
                'rounded-full opacity-0',
                shown === index ? 'opacity-100' : 'group-hover:opacity-0',
              )}
            />
          )}
        </button>
      ))}

      {shownPoint === undefined || shownPoint === null ? null : (
        <div
          aria-hidden="true"
          style={{
            insetInlineStart: `${shownPoint.xPercent}%`,
            top: `${shownPoint.yPercent ?? 50}%`,
          }}
          className={cn(
            'bg-surface-overlay border-border-default text-body-sm text-text-primary',
            'pointer-events-none absolute z-10 max-w-56 -translate-x-1/2 -translate-y-[calc(100%+0.75rem)]',
            'rounded-md border px-2 py-1 whitespace-nowrap shadow-sm rtl:translate-x-1/2',
          )}
        >
          {shownPoint.label}
        </div>
      )}
    </div>
  );
}
