'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '../utils/cn.js';
import { focusRing } from '../utils/style-constants.js';
import { DialogOverlay } from './dialog.js';

/**
 * A sheet, also used as the mobile drawer.
 *
 * It is a dialog anchored to an edge. `side="inline-end"` and
 * `side="inline-start"` follow the writing direction, so a details panel opens
 * on the trailing edge in both English and Arabic without a second component.
 *
 * The block-end variant is the mobile pattern for filters and the composer
 * summary: it keeps the page visible behind it, which matters when the sheet
 * is confirming something about the content underneath.
 */

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export type SheetSide = 'inline-start' | 'inline-end' | 'block-end';

export interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: SheetSide;
  closeLabel: string;
}

const sideClasses: Record<SheetSide, string> = {
  'inline-start':
    'top-0 bottom-0 start-0 h-dvh w-[min(24rem,calc(100vw-3rem))] border-e rounded-e-xl',
  'inline-end':
    'top-0 bottom-0 end-0 h-dvh w-[min(24rem,calc(100vw-3rem))] border-s rounded-s-xl',
  'block-end':
    'start-0 end-0 bottom-0 max-h-[85dvh] w-full border-t rounded-t-xl',
};

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  function SheetContent(
    { className, children, side = 'inline-end', closeLabel, ...props },
    ref,
  ) {
    return (
      <DialogPrimitive.Portal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          data-side={side}
          className={cn(
            'fixed z-(--z-index-modal) flex flex-col',
            'border-border-default bg-surface-overlay shadow-overlay',
            'relay-anim-fade-in',
            sideClasses[side],
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className={cn(
              'absolute end-3 top-3 inline-flex size-7 items-center justify-center',
              'rounded-md text-text-tertiary hover:bg-surface-hover hover:text-text-primary',
              focusRing,
            )}
          >
            <X aria-hidden="true" className="size-4" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);

export const SheetTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-title-sm text-text-primary', className)}
      {...props}
    />
  );
});

export const SheetDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-body-md text-text-secondary', className)}
      {...props}
    />
  );
});

export function SheetHeader({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>): ReactNode {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 border-b border-border-subtle px-4 py-3 pe-12',
        className,
      )}
      {...props}
    />
  );
}

export function SheetBody({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>): ReactNode {
  return (
    <div
      className={cn('relay-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-3', className)}
      {...props}
    />
  );
}

export function SheetFooter({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>): ReactNode {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 border-t border-border-subtle px-4 py-3 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}
