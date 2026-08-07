'use client';

/**
 * The view switcher.
 *
 * Day, week, month and list are peer layouts of the same schedule, not four
 * destinations, so this reads as a segmented control: one ink-bordered
 * track, one sliding yellow thumb that tracks the active choice with GSAP
 * Flip. It is a radio group because selecting a view changes the presentation
 * immediately and there is no tabpanel owned by this control. Arrow keys move
 * and select in one step, Home and End reach the edges, and the active choice
 * remains the one tab stop. The primary nav rail's indicator
 * (`components/shell/primary-nav.tsx`) uses the same measured Flip technique
 * turned ninety degrees.
 *
 * The thumb never animates on first mount and jumps straight to position
 * with no tween when `usePrefersReducedMotion()` is true.
 */

import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn, focusRing, touchTarget, transitionBase } from '@relay/design-system';
import { useDirectionAttributes } from '@/lib/i18n';
import { DURATION_FAST, EASE_STANDARD } from '@/lib/motion/constants';
import { Flip, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import type { CalendarView } from './types';

export interface CalendarViewSwitchProps {
  views: readonly CalendarView[];
  value: CalendarView;
  onValueChange: (view: CalendarView) => void;
  /** Accessible name for the whole control. */
  label: string;
  labelFor: (view: CalendarView) => string;
  className?: string;
}

export function CalendarViewSwitch({
  views,
  value,
  onValueChange,
  label,
  labelFor,
  className,
}: CalendarViewSwitchProps): ReactNode {
  const listRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef(new Map<CalendarView, HTMLButtonElement>());
  const hasPositioned = useRef(false);
  const motionOk = useMotionOk();
  const { dir } = useDirectionAttributes();

  const moveSelection = (event: KeyboardEvent<HTMLButtonElement>, current: CalendarView): void => {
    const currentIndex = views.indexOf(current);
    if (currentIndex < 0) return;

    let nextIndex: number;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = currentIndex + (dir === 'rtl' ? -1 : 1);
        break;
      case 'ArrowLeft':
        nextIndex = currentIndex + (dir === 'rtl' ? 1 : -1);
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + 1;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = views.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const next = views[(nextIndex + views.length) % views.length];
    if (next === undefined) return;
    onValueChange(next);
    itemRefs.current.get(next)?.focus();
  };

  useGSAP(
    () => {
      const list = listRef.current;
      const thumb = thumbRef.current;
      const active = itemRefs.current.get(value);
      if (!list || !thumb || !active) return;

      const shouldAnimate = hasPositioned.current && motionOk;
      const state = shouldAnimate ? Flip.getState(thumb) : null;

      // Measured, not authored: real bounding rects already reflect the
      // page's writing direction, so copying them positions the thumb
      // correctly under LTR and RTL alike without a logical/physical branch.
      const listRect = list.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      thumb.style.left = `${activeRect.left - listRect.left}px`;
      thumb.style.width = `${activeRect.width}px`;

      if (state) {
        Flip.from(state, { duration: DURATION_FAST, ease: EASE_STANDARD });
      }
      hasPositioned.current = true;
    },
    { scope: listRef, dependencies: [value, motionOk] },
  );

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="radiogroup"
        aria-label={label}
        className={cn(
          'border-border-bold bg-surface-sunken relative gap-0.5 rounded-md border-2 p-1',
          'relay-scrollbar flex items-stretch overflow-x-auto',
        )}
      >
        <span
          ref={thumbRef}
          aria-hidden="true"
          className={cn(
            'bg-cta border-border-bold pointer-events-none absolute top-1 bottom-1 z-0',
            'shadow-hard-sm rounded-sm border-2',
          )}
        />
        {views.map((view) => (
          <button
            key={view}
            type="button"
            role="radio"
            aria-checked={view === value}
            tabIndex={view === value ? 0 : -1}
            data-state={view === value ? 'checked' : 'unchecked'}
            ref={(element) => {
              if (element) itemRefs.current.set(view, element);
              else itemRefs.current.delete(view);
            }}
            onClick={() => onValueChange(view)}
            onKeyDown={(event) => moveSelection(event, view)}
            className={cn(
              'text-body-md text-text-secondary relative z-10 flex shrink-0 items-center',
              'justify-center rounded-sm px-3 py-1.5 font-medium whitespace-nowrap',
              'hover:text-text-primary data-[state=checked]:bg-cta data-[state=checked]:text-cta-on',
              focusRing,
              transitionBase,
              touchTarget,
            )}
          >
            {labelFor(view)}
          </button>
        ))}
      </div>
    </div>
  );
}
