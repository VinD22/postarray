'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';
import { cn } from '../utils/cn';

export interface ProgressProps extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Accessible name, from the message catalog. Required. */
  label: string;
  /**
   * The value spoken by assistive technology, already formatted by the caller
   * (for example "12 of 40 megabytes"). A bare percentage is rarely the most
   * useful sentence during an upload.
   */
  valueText?: string | undefined;
  tone?: 'accent' | 'success' | 'warning' | 'destructive';
}

const toneClass = {
  accent: 'bg-accent',
  success: 'bg-success-border',
  warning: 'bg-warning-border',
  destructive: 'bg-destructive-border',
} as const;

/**
 * A determinate progress bar for media upload and transcoding.
 *
 * `value === null` means the duration is genuinely unknown and renders a
 * quiet indeterminate track. It never renders a fake creeping bar: a made-up
 * progress figure is the same lie as a fabricated metric.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { className, value, max = 100, label, valueText, tone = 'accent', ...props },
  ref,
) {
  const percentage =
    value === null || value === undefined ? null : Math.min(100, Math.max(0, (value / max) * 100));
  const indeterminate = percentage === null;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={value ?? null}
      max={max}
      aria-label={label}
      aria-valuetext={valueText}
      className={cn(
        'relative h-1.5 w-full overflow-hidden rounded-full',
        'border-border-default bg-surface-sunken border',
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full rounded-full',
          toneClass[tone],
          indeterminate ? 'relay-anim-pulse w-1/3' : undefined,
          'transition-[inline-size] duration-[--duration-slow] ease-[--ease-standard]',
          'motion-reduce:transition-none',
        )}
        style={indeterminate ? undefined : { inlineSize: `${percentage}%` }}
      />
    </ProgressPrimitive.Root>
  );
});
