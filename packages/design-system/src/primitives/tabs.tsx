'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '../utils/cn.js';
import { focusRing, transitionBase } from '../utils/style-constants.js';

/**
 * Tabs for peer views of the same subject: the composer's per-target variants,
 * the Growth Advisor's five sections, an analytics breakdown.
 *
 * The selected tab is marked by a solid inline rule under the label and by a
 * weight change, not by colour alone. Activation is manual: arrow keys move
 * focus and Enter or Space selects, so a keyboard user can pass over an
 * expensive tab without loading it.
 */

export const Tabs = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof TabsPrimitive.Root>>(
  function Tabs({ activationMode = 'manual', ...props }, ref) {
    return <TabsPrimitive.Root ref={ref} activationMode={activationMode} {...props} />;
  },
);

export const TabsList = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(function TabsList({ className, ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'relay-scrollbar flex items-stretch gap-1 overflow-x-auto',
        'border-border-default border-b',
        className,
      )}
      {...props}
    />
  );
});

export const TabsTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'relative -mb-px inline-flex shrink-0 items-center gap-2 whitespace-nowrap',
        'border-b-2 border-transparent px-3 py-2',
        'text-body-md text-text-secondary font-medium',
        'hover:text-text-primary',
        'data-[state=active]:border-accent data-[state=active]:text-text-primary',
        'data-[disabled]:text-text-disabled data-[disabled]:cursor-not-allowed',
        focusRing,
        transitionBase,
        className,
      )}
      {...props}
    />
  );
});

export const TabsContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content ref={ref} className={cn('pt-4', focusRing, className)} {...props} />
  );
});
