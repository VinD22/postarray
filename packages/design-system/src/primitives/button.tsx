'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { elevationRamp, focusRing, pressable, transitionBase } from '../utils/style-constants';
import { Spinner } from './spinner';

/**
 * The commit fill. Ink in light, paper in dark, with the inverted text token
 * on top: 18:1 in both themes. Hover softens the fill by one ink step rather
 * than tinting it, because there is no second accent to move toward.
 */
const inkFilled = [
  'border-transparent bg-surface-inverted text-text-inverted',
  'hover:bg-text-secondary active:bg-surface-inverted',
].join(' ');

/** Every filled variant falls back to the same quiet, flat disabled state. */
const filledDisabled =
  'disabled:bg-surface-sunken disabled:text-text-disabled disabled:border-border-subtle';

/**
 * The button.
 *
 * Five intents, three sizes. Primary is the single commit path on a screen;
 * if two primaries appear side by side, one of them is a secondary. Ghost is
 * for toolbar and row-level actions. Destructive is a solid semantic fill and
 * is never used for a merely irreversible-feeling action, only for one that
 * removes or disconnects something.
 *
 * Primary is ink filled, not chromatic. The terracotta accent carries links,
 * focus, selection and state; if it also carried the commit button it would
 * stop reading as navigation and start reading as decoration. Ink on paper is
 * the loudest thing this system says.
 *
 * `cta` is retained as an alias of primary so existing call sites keep
 * compiling. It renders exactly the primary treatment: there is no separate
 * poster-slab commit button any more.
 *
 * Shape is a 6px radius, a hairline border and a tonal fill for the quiet
 * variants. Primary and CTA add a soft elevation ramp on hover plus the quiet
 * 1px settle of `relay-pressable` on `:active`. The press is vertical only,
 * so nothing needs mirroring under `dir="rtl"`.
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
        primary: [inkFilled, elevationRamp, pressable, filledDisabled].join(' '),
        // Visually deprecated: kept as an alias of `primary` so the call sites
        // that still say variant="cta" compile until they are migrated.
        cta: [inkFilled, elevationRamp, pressable, filledDisabled].join(' '),
        secondary: [
          'border-border-strong bg-surface-raised text-text-primary',
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
  extends Omit<ComponentPropsWithoutRef<'button'>, 'color'>, VariantProps<typeof buttonVariants> {
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
      {/*
        With `asChild`, Slot needs to know which child is the element to merge
        onto, because the icons and the spinner are siblings. Slottable marks it
        and Radix moves the decorations inside the rendered child.
      */}
      {asChild ? (
        <Slot.Slottable>{children}</Slot.Slottable>
      ) : (
        <span className={cn('truncate', loading && 'invisible')}>{children}</span>
      )}
      {iconEnd ? (
        <span aria-hidden="true" className={cn('shrink-0', loading && 'invisible')}>
          {iconEnd}
        </span>
      ) : null}
    </Component>
  );
});
