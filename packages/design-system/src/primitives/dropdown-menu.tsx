'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { DropdownMenu as MenuPrimitive } from 'radix-ui';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '../utils/cn.js';

/**
 * An actions menu. Typing a letter jumps to the matching item, arrow keys
 * move, Escape closes and returns focus to the trigger.
 *
 * A destructive item is coloured and, in every screen that uses one, opens a
 * ConfirmDialog rather than acting on click. Colour alone never marks it: the
 * label says what will happen.
 */

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;
export const DropdownMenuSub = MenuPrimitive.Sub;
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup;

const contentClasses = cn(
  'z-(--z-index-dropdown) min-w-48 overflow-hidden rounded-lg p-1',
  'max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto',
  'border border-border-default bg-surface-overlay shadow-overlay',
  'relay-scrollbar relay-anim-fade-in',
);

const itemClasses = cn(
  'relative flex cursor-default select-none items-center gap-2 rounded-sm',
  'px-2 py-1.5 text-body-md text-text-primary outline-none',
  'data-[highlighted]:bg-surface-hover',
  'data-[disabled]:cursor-not-allowed data-[disabled]:text-text-disabled',
  '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-text-tertiary',
);

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Content>
>(function DropdownMenuContent({ className, sideOffset = 6, ...props }, ref) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={8}
        className={cn(contentClasses, className)}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
});

export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<typeof MenuPrimitive.Item> {
  destructive?: boolean;
  /** Shown at the inline end. Use the Kbd primitive. */
  shortcut?: ReactNode;
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ className, destructive, shortcut, children, ...props }, ref) {
    return (
      <MenuPrimitive.Item
        ref={ref}
        data-destructive={destructive || undefined}
        className={cn(
          itemClasses,
          destructive &&
            'text-destructive-fg data-[highlighted]:bg-destructive-bg [&_svg]:text-destructive-fg',
          className,
        )}
        {...props}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">{children}</span>
        {shortcut ? <span className="ms-auto ps-4">{shortcut}</span> : null}
      </MenuPrimitive.Item>
    );
  },
);

export const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, ...props }, ref) {
  return (
    <MenuPrimitive.CheckboxItem ref={ref} className={cn(itemClasses, 'ps-7', className)} {...props}>
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <MenuPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="text-accent size-3.5" />
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
});

export const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(function DropdownMenuRadioItem({ className, children, ...props }, ref) {
  return (
    <MenuPrimitive.RadioItem ref={ref} className={cn(itemClasses, 'ps-7', className)} {...props}>
      <span className="absolute start-2 flex size-4 items-center justify-center">
        <MenuPrimitive.ItemIndicator>
          <Circle aria-hidden="true" className="text-accent size-2 fill-current" />
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
});

export const DropdownMenuLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Label>
>(function DropdownMenuLabel({ className, ...props }, ref) {
  return (
    <MenuPrimitive.Label
      ref={ref}
      className={cn('text-label text-text-tertiary px-2 py-1.5', className)}
      {...props}
    />
  );
});

export const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(function DropdownMenuSeparator({ className, ...props }, ref) {
  return (
    <MenuPrimitive.Separator
      ref={ref}
      className={cn('bg-border-subtle my-1 h-px', className)}
      {...props}
    />
  );
});

export const DropdownMenuSubTrigger = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger>
>(function DropdownMenuSubTrigger({ className, children, ...props }, ref) {
  return (
    <MenuPrimitive.SubTrigger
      ref={ref}
      className={cn(itemClasses, 'data-[state=open]:bg-surface-hover', className)}
      {...props}
    >
      {children}
      <ChevronRight aria-hidden="true" className="ms-auto size-4 rtl:rotate-180" />
    </MenuPrimitive.SubTrigger>
  );
});

export const DropdownMenuSubContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent>
>(function DropdownMenuSubContent({ className, ...props }, ref) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent ref={ref} className={cn(contentClasses, className)} {...props} />
    </MenuPrimitive.Portal>
  );
});
