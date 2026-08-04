'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn.js';
import { focusRing, transitionBase } from '../utils/style-constants.js';
import { Spinner } from './spinner.js';

/**
 * The button.
 *
 * Four intents, three sizes. Primary is the single accent path on a screen;
 * if two primaries appear side by side, one of them is a secondary. Ghost is
 * for toolbar and row-level actions. Destructive is a solid semantic fill and
 * is never used for a merely irreversible-feeling action, only for one that
 * removes or disconnects something.
 *
 * Shape is a 6px radius, a hairline border and a tonal fill. There is no
 * shadow: elevation in this product is a border and a surface step.
 */
export const buttonVariants = cva(
  [
    'relative inline-flex select-none items-center justify-center gap-2',
    'rounded-md border font-medium whitespace-nowrap',
    'disabled:pointer-events-none disabled:opacity-100',
    focusRing,
    transitionBase,
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'border-transparent bg-accent text-accent-on',
          'hover:bg-accent-hover active:bg-accent-active',
          'disabled:bg-surface-sunken disabled:text-text-disabled disabled:border-border-subtle',
        ].join(' '),
        secondary: [
          'border-border-default bg-surface-raised text-text-primary',
          'hover:bg-surface-hover active:bg-surface-active',
          'disabled:bg-surface-sunken disabled:text-text-disabled disabled:border-border-subtle',
        ].join(' '),
        ghost: [
          'border-transparent bg-transparent text-text-secondary',
          'hover:bg-surface-hover hover:text-text-primary active:bg-surface-active',
          'disabled:bg-transparent disabled:text-text-disabled',
        ].join(' '),
        destructive: [
          'border-transparent bg-destructive-solid text-destructive-on',
          'hover:bg-destructive-solid-hover active:bg-destructive-solid-active',
          'disabled:bg-surface-sunken disabled:text-text-disabled disabled:border-border-subtle',
        ].join(' '),
      },
      size: {
        sm: 'h-7 px-2.5 text-body-sm',
        md: 'h-8 px-3 text-body-md',
        lg: 'h-10 px-4 text-body-md',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'color'>,
    VariantProps<typeof buttonVariants> {
  /**
   * Work is in progress. The label stays in the layout and is only hidden
   * visually, so the button keeps its exact width and the row does not jump.
   */
  loading?: boolean;
  /**
   * The accessible name announced while loading, from the message catalog.
   * Without it a screen reader hears the original label with `aria-busy`.
   */
  loadingLabel?: string | undefined;
  /** Icon before the label. Decorative: the label carries the meaning. */
  iconStart?: ReactNode;
  /** Icon after the label. */
  iconEnd?: ReactNode;
  /** Render as the single child element instead of a `<button>`. */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    fullWidth,
    loading = false,
    loadingLabel,
    iconStart,
    iconEnd,
    asChild = false,
    disabled,
    children,
    type = 'button',
    ...props
  },
  ref,
) {
  const Component = asChild ? Slot.Root : 'button';
  const isDisabled = disabled === true || loading;

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : type}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={asChild && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner size={size === 'sm' ? 'sm' : 'md'} label={loadingLabel} />
        </span>
      ) : null}
      {iconStart ? (
        <span aria-hidden="true" className={cn('shrink-0', loading && 'invisible')}>
          {iconStart}
        </span>
      ) : null}
      <span className={cn('truncate', loading && 'invisible')}>{children}</span>
      {iconEnd ? (
        <span aria-hidden="true" className={cn('shrink-0', loading && 'invisible')}>
          {iconEnd}
        </span>
      ) : null}
    </Component>
  );
});
