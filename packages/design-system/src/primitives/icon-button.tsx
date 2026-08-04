'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn.js';
import { focusRing, transitionBase } from '../utils/style-constants.js';
import { Spinner } from './spinner.js';

/**
 * A square button whose only content is an icon.
 *
 * `label` is required and is not optional in practice: an icon-only control
 * with no accessible name is unusable with a screen reader and unguessable for
 * everyone else. Pair it with a Tooltip for sighted users, but the tooltip is
 * never the only place the name exists.
 *
 * On a coarse pointer the hit area grows to the 44px target minimum without
 * changing the painted size.
 */
export const iconButtonVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center',
    'rounded-md border',
    'disabled:pointer-events-none',
    focusRing,
    transitionBase,
  ].join(' '),
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-accent text-accent-on hover:bg-accent-hover active:bg-accent-active disabled:bg-surface-sunken disabled:text-text-disabled',
        secondary:
          'border-border-default bg-surface-raised text-text-primary hover:bg-surface-hover active:bg-surface-active disabled:bg-surface-sunken disabled:text-text-disabled disabled:border-border-subtle',
        ghost:
          'border-transparent bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary active:bg-surface-active disabled:text-text-disabled',
        destructive:
          'border-transparent bg-destructive-solid text-destructive-on hover:bg-destructive-solid-hover active:bg-destructive-solid-active disabled:bg-surface-sunken disabled:text-text-disabled',
      },
      size: {
        sm: 'size-7 [&_svg]:size-3.5',
        md: 'size-8 [&_svg]:size-4',
        lg: 'size-10 [&_svg]:size-5',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
);

export interface IconButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'color' | 'children'>,
    VariantProps<typeof iconButtonVariants> {
  /** The accessible name, from the message catalog. Required. */
  label: string;
  icon: ReactNode;
  loading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      className,
      variant,
      size,
      label,
      icon,
      loading = false,
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        aria-busy={loading || undefined}
        disabled={disabled === true || loading}
        className={cn(
          iconButtonVariants({ variant, size }),
          // Coarse pointers get a 44px target through a pseudo-element so the
          // painted control keeps its density on a desktop toolbar.
          'after:absolute after:start-1/2 after:top-1/2 after:-translate-x-1/2 rtl:after:translate-x-1/2 after:-translate-y-1/2',
          'after:size-11 after:content-[""] after:hidden pointer-coarse:after:block',
          className,
        )}
        {...props}
      >
        {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : icon}
      </button>
    );
  },
);
