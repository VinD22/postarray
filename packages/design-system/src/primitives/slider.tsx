'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Slider as SliderPrimitive } from 'radix-ui';
import { cn } from '../utils/cn.js';
import { focusRing } from '../utils/style-constants.js';

export interface SliderProps extends ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /**
   * The accessible name for each thumb, from the message catalog. Supply one
   * entry per value; a range slider whose thumbs are both called "Value" is
   * not usable with a screen reader.
   */
  thumbLabels: readonly string[];
}

/**
 * A slider for crop, compression quality and similar continuous settings.
 *
 * Every slider in this product is paired with a numeric field showing the same
 * value, because a drag-only control fails WCAG 2.2 dragging movements and
 * because people need to type an exact number.
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  { className, thumbLabels, ...props },
  ref,
) {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none items-center select-none',
        'data-[orientation=vertical]:h-40 data-[orientation=vertical]:w-auto',
        'data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          'bg-surface-sunken relative h-1 w-full grow overflow-hidden rounded-full',
          'border-border-default border',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1',
        )}
      >
        <SliderPrimitive.Range className="bg-accent absolute h-full data-[orientation=vertical]:w-full" />
      </SliderPrimitive.Track>
      {thumbLabels.map((label) => (
        <SliderPrimitive.Thumb
          key={label}
          aria-label={label}
          className={cn(
            'border-accent bg-surface-raised block size-4 rounded-full border-2',
            'disabled:border-border-subtle disabled:cursor-not-allowed',
            focusRing,
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
});
