'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn.js';
import { focusRing, transitionBase } from '../utils/style-constants.js';

/**
 * A single line text field.
 *
 * The invalid state is a border and a text colour, never a colour alone: the
 * message itself lives in `Field`, wired through `aria-describedby`. Slots are
 * inline-start and inline-end rather than left and right, so a prefix stays a
 * prefix in Arabic and Hebrew.
 */
export const inputVariants = cva(
  [
    'w-full min-w-0 rounded-md border bg-surface-raised text-text-primary',
    'placeholder:text-text-tertiary',
    'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-disabled',
    'read-only:bg-surface-sunken',
    focusRing,
    transitionBase,
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-7 px-2 text-body-sm',
        md: 'h-8 px-2.5 text-body-md',
        lg: 'h-10 px-3 text-body-md',
      },
      invalid: {
        true: 'border-destructive-border text-destructive-fg focus-visible:outline-[color:var(--status-destructive-border)]',
        false: 'border-border-strong',
      },
    },
    defaultVariants: { size: 'md', invalid: false },
  },
);

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'invalid'> {
  invalid?: boolean;
  /** Rendered at the inline start, inside the border. Decorative only. */
  addonStart?: ReactNode;
  /** Rendered at the inline end, inside the border. */
  addonEnd?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, invalid = false, addonStart, addonEnd, type = 'text', ...props },
  ref,
) {
  const control = (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        inputVariants({ size, invalid }),
        addonStart ? 'ps-8' : undefined,
        addonEnd ? 'pe-8' : undefined,
        className,
      )}
      {...props}
    />
  );

  if (!addonStart && !addonEnd) return control;

  return (
    <span className="relative flex w-full items-center">
      {addonStart ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute start-2.5 flex items-center text-text-tertiary [&_svg]:size-4"
        >
          {addonStart}
        </span>
      ) : null}
      {control}
      {addonEnd ? (
        <span className="absolute end-2 flex items-center text-text-tertiary [&_svg]:size-4">
          {addonEnd}
        </span>
      ) : null}
    </span>
  );
});
