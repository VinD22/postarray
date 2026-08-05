'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export interface SpinnerProps extends ComponentPropsWithoutRef<'span'> {
  /**
   * An accessible name. Supply it from the message catalog whenever the
   * spinner is the only indication that work is in progress. Omit it when a
   * neighbouring live region already says what is happening, so the same fact
   * is not announced twice.
   */
  label?: string | undefined;
  size?: 'sm' | 'md';
}

const sizeClass = {
  sm: 'size-3.5',
  md: 'size-4',
} as const;

/**
 * The single loading indicator. It rotates at a constant rate, has no pulsing
 * halo, and disappears entirely under reduced motion, where the surrounding
 * component states its progress in words instead.
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, label, size = 'md', ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      <Loader2
        aria-hidden="true"
        className={cn(sizeClass[size], 'relay-anim-spin motion-reduce:animate-none')}
      />
    </span>
  );
});
