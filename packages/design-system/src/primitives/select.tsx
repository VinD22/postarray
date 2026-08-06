'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';
import { focusRing, transitionBase } from '../utils/style-constants';

/**
 * A select for a short, known list: time zone offset, privacy level, page
 * size. When the list is long or needs a server lookup, use Combobox instead.
 *
 * The trigger is the same shape and height as Input so a form row stays level.
 */

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps extends ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {
  invalid?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const triggerSize = {
  sm: 'h-7 px-2 text-body-sm',
  md: 'h-8 px-2.5 text-body-md',
  lg: 'h-10 px-3 text-body-md',
} as const;

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ className, children, invalid, size = 'md', ...props }, ref) {
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          'inline-flex w-full items-center justify-between gap-2 rounded-md border-[1.5px]',
          'bg-surface-raised text-text-primary',
          'data-[placeholder]:text-text-tertiary',
          'disabled:bg-surface-sunken disabled:text-text-disabled disabled:cursor-not-allowed',
          invalid ? 'border-destructive-border' : 'border-border-strong',
          triggerSize[size],
          focusRing,
          transitionBase,
          className,
        )}
        {...props}
      >
        <span className="truncate text-start">{children}</span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown aria-hidden="true" className="text-text-tertiary size-4 shrink-0" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    );
  },
);

export type SelectContentProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Content>;

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(
  { className, children, position = 'popper', ...props },
  ref,
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={cn(
          'relative z-(--z-index-dropdown) max-h-[min(24rem,var(--radix-select-content-available-height))]',
          'min-w-(--radix-select-trigger-width) overflow-hidden rounded-lg',
          'border-border-default bg-surface-overlay shadow-overlay border',
          'relay-anim-fade-in',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="text-text-tertiary flex h-6 items-center justify-center">
          <ChevronUp aria-hidden="true" className="size-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="text-text-tertiary flex h-6 items-center justify-center">
          <ChevronDown aria-hidden="true" className="size-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

export interface SelectItemProps extends ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  /** Secondary line, for example the resolved account handle. */
  description?: ReactNode;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { className, children, description, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        'relative flex cursor-default items-start gap-2 rounded-sm select-none',
        'text-body-md text-text-primary py-1.5 ps-7 pe-2 outline-none',
        'data-[highlighted]:bg-surface-hover',
        'data-[disabled]:text-text-disabled data-[disabled]:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <span className="absolute start-2 top-1.5 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="text-accent size-3.5" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <span className="flex min-w-0 flex-col">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        {description ? (
          <span className="text-body-sm text-text-tertiary">{description}</span>
        ) : null}
      </span>
    </SelectPrimitive.Item>
  );
});

export const SelectLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(function SelectLabel({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn('text-label text-text-tertiary px-2 py-1.5', className)}
      {...props}
    />
  );
});

export const SelectSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(function SelectSeparator({ className, ...props }, ref) {
  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn('bg-border-subtle my-1 h-px', className)}
      {...props}
    />
  );
});
