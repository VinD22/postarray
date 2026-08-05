'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { cn } from '../utils/cn.js';

/**
 * A tooltip repeats or shortens something that is already available.
 *
 * It is never the only source of critical information. A tooltip does not
 * appear on a touch device, it disappears the moment the pointer moves, and a
 * screen magnifier user may never see it. If a fact matters, put it in the
 * page: a description under the field, a caption under the metric, a visible
 * label next to the icon.
 *
 * Acceptable uses: the full name behind a truncated label, the metric
 * definition that is also on the definitions page, the keyboard shortcut for a
 * button that already has an accessible name.
 */

export const TooltipProvider = TooltipPrimitive.Provider;
export const TooltipRoot = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({ className, sideOffset = 6, ...props }, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn(
          'z-(--z-index-tooltip) max-w-64 rounded-md px-2 py-1',
          'bg-surface-inverted text-body-sm text-text-inverted',
          'relay-anim-fade-in',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});

export interface TooltipProps {
  /** The short supporting text. Never the only place this fact appears. */
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing. 500ms keeps a toolbar from flickering on a sweep. */
  delayDuration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** The composed form. Wrap the app once in `TooltipProvider`. */
export function Tooltip({
  content,
  children,
  side = 'top',
  delayDuration = 500,
  open,
  onOpenChange,
}: TooltipProps): ReactNode {
  return (
    <TooltipRoot delayDuration={delayDuration} open={open} onOpenChange={onOpenChange}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </TooltipRoot>
  );
}
