'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { cn } from '../utils/cn.js';
import { focusRing, transitionBase } from '../utils/style-constants.js';

export type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

/**
 * A switch takes effect immediately. If a change needs a save action, use a
 * checkbox instead, otherwise the control lies about when the change lands.
 *
 * The thumb moves along the inline axis, so the on position is the inline end
 * in both writing directions.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { className, ...props },
  ref,
) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5',
        'border-border-strong bg-surface-sunken',
        'data-[state=checked]:border-accent data-[state=checked]:bg-accent',
        'disabled:border-border-subtle disabled:bg-surface-sunken disabled:cursor-not-allowed',
        focusRing,
        transitionBase,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'bg-surface-raised block size-4 rounded-full',
          'border-border-default border',
          'data-[state=checked]:bg-accent-on data-[state=checked]:border-transparent',
          'transition-transform duration-[--duration-fast] ease-[--ease-standard]',
          'motion-reduce:transition-none',
          'data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4',
        )}
      />
    </SwitchPrimitive.Root>
  );
});
