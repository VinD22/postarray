'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { cn } from '../utils/cn';
import { focusRing, transitionBase } from '../utils/style-constants';

export type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

/**
 * A radio group. Arrow keys move between options and also select, which is the
 * platform behaviour; the group is a single tab stop.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { className, ...props },
  ref,
) {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
});

export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  function RadioGroupItem({ className, ...props }, ref) {
    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          'inline-flex size-4 shrink-0 items-center justify-center rounded-full border',
          'border-border-strong bg-surface-raised',
          'data-[state=checked]:border-accent',
          'disabled:border-border-subtle disabled:bg-surface-sunken disabled:cursor-not-allowed',
          focusRing,
          transitionBase,
          className,
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="bg-accent block size-2 rounded-full" />
      </RadioGroupPrimitive.Item>
    );
  },
);
