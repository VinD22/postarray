'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn.js';
import { focusRing } from '../utils/style-constants.js';

/**
 * Progressive disclosure for secondary detail: attempt history on a receipt,
 * advanced connector settings, an automation rule's raw representation.
 *
 * Never hide something the user must see before acting. The height transition
 * is 160ms and collapses to nothing under reduced motion.
 */

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, ...props }, ref) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn('border-border-subtle border-b', className)}
      {...props}
    />
  );
});

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'group flex flex-1 items-center justify-between gap-3 py-3 text-start',
          'text-body-md text-text-primary hover:text-text-accent font-medium',
          focusRing,
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'text-text-tertiary size-4 shrink-0',
            'transition-transform duration-[--duration-fast] ease-[--ease-standard]',
            'motion-reduce:transition-none',
            'group-data-[state=open]:rotate-180',
          )}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

export const AccordionContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'text-body-md text-text-secondary overflow-hidden',
        'data-[state=closed]:hidden',
        className,
      )}
      {...props}
    >
      <div className="pb-3">{children}</div>
    </AccordionPrimitive.Content>
  );
});
