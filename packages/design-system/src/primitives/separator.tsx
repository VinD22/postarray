'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import { cn } from '../utils/cn.js';

export type SeparatorProps = ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;

/**
 * A hairline rule. Decorative by default, so it is hidden from assistive
 * technology; pass `decorative={false}` only when the rule genuinely separates
 * two groups that a screen reader should hear as distinct.
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { className, orientation = 'horizontal', decorative = true, ...props },
  ref,
) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'bg-border-subtle shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
});
