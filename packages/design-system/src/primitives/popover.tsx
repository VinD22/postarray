'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { cn } from '../utils/cn.js';

/**
 * A non-modal panel anchored to a trigger: a filter set, a date picker, a
 * metric definition. Focus moves into it, Escape returns focus to the trigger,
 * and the page behind stays interactive. If the content must be answered
 * before anything else can happen, that is a Dialog, not a Popover.
 */

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(function PopoverContent(
  { className, align = 'start', sideOffset = 6, collisionPadding = 12, ...props },
  ref,
) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'z-(--z-index-popover) w-[min(20rem,calc(100vw-1.5rem))]',
          'max-h-(--radix-popover-content-available-height) overflow-auto',
          'rounded-lg border border-border-default bg-surface-overlay p-3 shadow-overlay',
          'text-body-md text-text-primary',
          'relay-scrollbar relay-anim-fade-in',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
