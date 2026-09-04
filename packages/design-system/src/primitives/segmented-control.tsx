'use client';

import {
  forwardRef,
  useCallback,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';
import { cn } from '../utils/cn';
import { focusRing, touchTarget, transitionBase } from '../utils/style-constants';
import { useIsomorphicLayoutEffect } from '../hooks/use-isomorphic-layout-effect';

/**
 * A segmented control: two to six peer choices that all change the same view.
 *
 * It is a radio group, not tabs. Tabs own panels and say so through
 * `aria-controls`; a segmented control changes how one surface is drawn and
 * owns nothing. Where a screen genuinely has panels, use `Tabs` and give its
 * list `segmentedTrack` for the same look.
 *
 * Radix `ToggleGroup type="single"` already renders `role="radiogroup"` with
 * `role="radio"` children and roving focus. Two things are added on top:
 * selection follows focus, which is what a radio group is supposed to do and
 * what makes arrow keys change the view in one step; and a choice can never be
 * cleared, because a segmented control with nothing selected shows a view that
 * no segment claims.
 *
 * The thumb is measured, not authored. See `useSegmentedThumb`.
 */

export interface SegmentedControlItem {
  readonly value: string;
  /** The visible label. Supplied by the caller from the message catalog. */
  readonly label: ReactNode;
  /** Optional leading glyph. Decorative: the label is never optional. */
  readonly icon?: ReactNode;
  readonly disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<
    ComponentPropsWithoutRef<'div'>,
    'children' | 'onChange' | 'defaultValue' | 'dir' | 'value'
  > {
  readonly items: readonly SegmentedControlItem[];
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  /** Accessible name for the group. Required: a bare set of radios is unusable. */
  readonly 'aria-label': string;
  readonly size?: SegmentedControlSize;
  /**
   * `square` is the product default and matches every other control. `pill`
   * exists for marketing surfaces, where the poster radius is the house style.
   */
  readonly shape?: SegmentedControlShape;
  /**
   * Lets the track scroll on a narrow viewport rather than shrinking labels.
   * On by default: five labels at 360px otherwise force page-level overflow.
   */
  readonly scrollable?: boolean;
  /**
   * Segments share the track's width equally instead of sizing to their
   * labels. For a two-choice toggle that sits under a heading, where unequal
   * halves read as one option being the recommended one.
   */
  readonly fill?: boolean;
}

export type SegmentedControlSize = 'sm' | 'md';
export type SegmentedControlShape = 'square' | 'pill';

const segmentPadding: Record<SegmentedControlSize, string> = {
  sm: 'px-2 py-1 text-body-sm',
  md: 'px-3 py-1.5 text-body-md',
};

const trackRadius: Record<SegmentedControlShape, string> = {
  square: 'rounded-md',
  pill: 'rounded-full',
};

const segmentRadius: Record<SegmentedControlShape, string> = {
  square: 'rounded-sm',
  pill: 'rounded-full',
};

/** The track. Exported so `TabsList` can wear the same surface. */
export const segmentedTrack =
  'border-border-default bg-surface-sunken relative flex items-stretch gap-0.5 ' +
  'rounded-md border p-1';

/** One segment. Exported for the same reason as the track. */
export const segmentedItem = (
  size: SegmentedControlSize = 'md',
  shape: SegmentedControlShape = 'square',
): string =>
  cn(
    'text-text-secondary relative z-10 flex shrink-0 items-center justify-center gap-1.5',
    'font-medium whitespace-nowrap',
    segmentRadius[shape],
    'hover:text-text-primary',
    'data-[state=on]:text-text-primary data-[state=active]:text-text-primary',
    'data-[disabled]:text-text-disabled data-[disabled]:pointer-events-none',
    segmentPadding[size],
    focusRing,
    transitionBase,
    touchTarget,
  );

/** The sliding chip. Exported for the same reason as the track. */
export const segmentedThumb =
  'relay-segmented-thumb bg-surface-raised border-border-default shadow-raised ' +
  'pointer-events-none absolute z-0 rounded-sm border';

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    {
      items,
      value,
      onValueChange,
      size = 'md',
      shape = 'square',
      scrollable = true,
      fill = false,
      className,
      ...props
    },
    forwardedRef,
  ) {
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLSpanElement>(null);

    useSegmentedThumb({ trackRef, thumbRef, value, itemCount: items.length });

    const select = useCallback(
      (next: string): void => {
        // Radix hands back '' when the active item is toggled off. A segmented
        // control has no unselected state, so that is dropped rather than
        // forwarded as a value no segment represents.
        if (next === '' || next === value) return;
        onValueChange(next);
      },
      [onValueChange, value],
    );

    return (
      <ToggleGroupPrimitive.Root
        {...props}
        ref={mergeRefs(forwardedRef, trackRef)}
        type="single"
        value={value}
        onValueChange={select}
        className={cn(
          segmentedTrack,
          trackRadius[shape],
          scrollable && 'relay-scrollbar overflow-x-auto',
          className,
        )}
      >
        <span
          ref={thumbRef}
          aria-hidden="true"
          className={cn(segmentedThumb, segmentRadius[shape])}
        />
        {items.map((item) => (
          <ToggleGroupPrimitive.Item
            key={item.value}
            value={item.value}
            disabled={item.disabled ?? false}
            data-segment-value={item.value}
            // Selection follows focus, which is the radio group pattern: an
            // arrow key changes the view in one step instead of leaving a
            // focused-but-unselected segment the eye cannot explain.
            onFocus={() => {
              if (item.disabled !== true) select(item.value);
            }}
            className={cn(segmentedItem(size, shape), fill && 'flex-1 basis-0 shrink')}
          >
            {item.icon === undefined ? null : (
              <span aria-hidden="true" className="flex shrink-0 items-center">
                {item.icon}
              </span>
            )}
            {item.label}
          </ToggleGroupPrimitive.Item>
        ))}
      </ToggleGroupPrimitive.Root>
    );
  },
);

export interface UseSegmentedThumbOptions {
  readonly trackRef: RefObject<HTMLDivElement | null>;
  readonly thumbRef: RefObject<HTMLSpanElement | null>;
  /** The selected value, matched against each item's `data-segment-value`. */
  readonly value: string;
  /** Re-measures when the number of segments changes. */
  readonly itemCount: number;
}

/**
 * Positions a segmented control's thumb over the active segment.
 *
 * The offset is computed along the inline axis from measured widths: the sum
 * of the preceding segments' widths, the gaps between them (measured too,
 * never assumed from the class list), and the track's own
 * `padding-inline-start`. Every one of those is a length rather than a
 * coordinate, so the same number is correct under `dir="ltr"` and `dir="rtl"`
 * and there is no direction branch anywhere in this file. Direction is applied
 * once, in CSS, by `.relay-segmented-thumb` flipping the sign of the offset it
 * is handed.
 *
 * The thumb does not animate into its first position. Sliding in from the
 * inline start on mount would read as an entrance, and this is a control, not
 * an entrance.
 */
export function useSegmentedThumb({
  trackRef,
  thumbRef,
  value,
  itemCount,
}: UseSegmentedThumbOptions): void {
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    let frame = 0;

    const measure = (): void => {
      const segments = [...track.querySelectorAll<HTMLElement>('[data-segment-value]')];
      const index = segments.findIndex((el) => el.dataset['segmentValue'] === value);
      const active = index < 0 ? undefined : segments[index];
      if (!active) {
        // Nothing selected yet, or a value with no segment. Hiding beats
        // parking the chip under whichever segment happens to be first.
        thumb.style.opacity = '0';
        return;
      }

      const rects = segments.map((el) => el.getBoundingClientRect());
      const activeRect = rects[index];
      const first = rects[0];
      const second = rects[1];
      if (!activeRect || !first) return;

      // The gap is measured, not read off the class list, so a caller that
      // overrides the track's `gap-*` cannot desynchronise the thumb.
      const gap =
        second === undefined ? 0 : Math.max(0, Math.abs(second.left - first.left) - first.width);

      const trackStyle = getComputedStyle(track);
      const paddingInlineStart = Number.parseFloat(trackStyle.paddingInlineStart) || 0;

      let offset = paddingInlineStart;
      for (let i = 0; i < index; i += 1) {
        offset += (rects[i]?.width ?? 0) + gap;
      }

      const trackRect = track.getBoundingClientRect();
      thumb.style.setProperty('--relay-segment-offset', `${offset}px`);
      thumb.style.inlineSize = `${activeRect.width}px`;
      thumb.style.blockSize = `${activeRect.height}px`;
      thumb.style.insetBlockStart = `${activeRect.top - trackRect.top}px`;
      thumb.style.opacity = '1';

      // Only after the chip is already in place does it earn a transition.
      frame = requestAnimationFrame(() => {
        thumb.dataset['ready'] = 'true';
      });
    };

    measure();

    // A label can change width without the value changing: a font loads, the
    // locale switches, the container reflows. Guarded because the chip is a
    // refinement, not a requirement: an environment without ResizeObserver
    // still gets a correctly placed thumb, it just does not follow a reflow.
    const observer =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    if (observer) {
      observer.observe(track);
      for (const segment of track.querySelectorAll('[data-segment-value]')) {
        observer.observe(segment);
      }
    }

    return () => {
      observer?.disconnect();
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [trackRef, thumbRef, value, itemCount]);
}

/** Local, because a ref merge is three lines and a dependency is not. */
function mergeRefs<T>(
  ...refs: readonly (React.Ref<T> | undefined)[]
): (instance: T | null) => void {
  return (instance) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(instance);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = instance;
    }
  };
}
