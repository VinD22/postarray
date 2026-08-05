'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { Check, Minus } from 'lucide-react';
import { cn } from '../utils/cn';
import { focusRing, transitionBase } from '../utils/style-constants';

export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

/**
 * A checkbox with a real indeterminate state, used by table headers that
 * select a page of rows. Indeterminate is drawn as a dash, not as a half-tint,
 * so it survives high contrast mode and greyscale printing.
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { className, ...props },
  ref,
) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer inline-flex size-4 shrink-0 items-center justify-center rounded-xs border',
        'border-border-strong bg-surface-raised text-accent-on',
        'data-[state=checked]:border-accent data-[state=checked]:bg-accent',
        'data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent',
        'disabled:border-border-subtle disabled:bg-surface-sunken disabled:cursor-not-allowed',
        'disabled:data-[state=checked]:bg-surface-sunken disabled:text-text-disabled',
        focusRing,
        transitionBase,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        {props.checked === 'indeterminate' ? (
          <Minus aria-hidden="true" className="size-3" strokeWidth={3} />
        ) : (
          <Check aria-hidden="true" className="size-3" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
