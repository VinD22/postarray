'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';
import { focusRing } from '../utils/style-constants';

/**
 * A modal dialog.
 *
 * Reserved for work that genuinely needs protected focus: a destructive
 * confirmation, a one-time secret reveal, a schedule confirmation sheet. A
 * dialog for a task that could be a page or an inline panel costs the user
 * their context, so the default answer is not a dialog.
 *
 * Focus is trapped, Escape closes, the trigger is refocused on close, and the
 * page behind cannot scroll. At 360px the panel is full width with an inline
 * margin and can scroll internally, so a long confirmation still fits.
 */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogPortal = DialogPrimitive.Portal;

export const DialogOverlay = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'bg-surface-scrim fixed inset-0 z-(--z-index-overlay)',
        'relay-anim-fade-in',
        className,
      )}
      {...props}
    />
  );
});

export interface DialogContentProps extends ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  /** Accessible name for the close control, from the message catalog. */
  closeLabel: string;
  /** Hide the corner close control when the dialog must be answered. */
  hideClose?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const dialogSize = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
} as const;

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { className, children, closeLabel, hideClose = false, size = 'md', ...props },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-(--z-index-modal) flex max-h-[calc(100dvh-2rem)] flex-col',
          'start-4 end-4 top-1/2 -translate-y-1/2',
          'sm:start-1/2 sm:end-auto sm:-translate-x-1/2 sm:rtl:translate-x-1/2',
          'sm:w-[calc(100vw-2rem)]',
          dialogSize[size],
          'border-border-default bg-surface-overlay shadow-overlay rounded-xl border',
          'relay-anim-enter-overlay',
          className,
        )}
        {...props}
      >
        {children}
        {hideClose ? null : (
          <DialogPrimitive.Close
            aria-label={closeLabel}
            className={cn(
              'absolute end-3 top-3 inline-flex size-7 items-center justify-center',
              'text-text-tertiary hover:bg-surface-hover hover:text-text-primary rounded-md',
              focusRing,
            )}
          >
            <X aria-hidden="true" className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

export function DialogHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>): ReactNode {
  return (
    <div
      className={cn('border-border-subtle flex flex-col gap-1 border-b px-5 py-4 pe-12', className)}
      {...props}
    />
  );
}

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn('text-title-sm text-text-primary', className)}
      {...props}
    />
  );
});

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-body-md text-text-secondary', className)}
      {...props}
    />
  );
});

export function DialogBody({ className, ...props }: ComponentPropsWithoutRef<'div'>): ReactNode {
  return (
    <div
      className={cn('relay-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4', className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>): ReactNode {
  return (
    <div
      className={cn(
        'border-border-subtle flex flex-col-reverse gap-2 border-t px-5 py-3',
        'sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}
