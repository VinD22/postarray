'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
  /** Matches a text step so the placeholder reserves the real line height. */
  variant?: 'text' | 'block' | 'circle';
  /** Sets the inline size. Use a value, not a random width per row. */
  width?: string;
}

/**
 * A layout-preserving placeholder.
 *
 * The rule that makes skeletons useful rather than decorative: a skeleton must
 * occupy the same box its content will occupy, so nothing moves when the data
 * arrives. A skeleton that is a different height than the row it replaces is
 * worse than an empty space.
 *
 * It sweeps an accent-subtle shimmer across a sunken fill, and it is always
 * hidden from assistive technology: the surrounding region announces the
 * loading state in words once, not per placeholder. The sweep is a plain CSS
 * animation, so the global reduced-motion override (1ms duration) already
 * neutralizes it; `motion-reduce:animate-none` is kept as a second, explicit
 * guard.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, variant = 'text', width, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-skeleton=""
      style={width ? { ...style, inlineSize: width } : style}
      className={cn(
        'relay-shimmer motion-reduce:animate-none',
        variant === 'text' && 'h-[1.3125rem] rounded-sm',
        variant === 'block' && 'rounded-md',
        variant === 'circle' && 'rounded-full',
        className,
      )}
      {...props}
    />
  );
});
