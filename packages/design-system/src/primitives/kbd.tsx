'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils/cn.js';
import { formatHotkey } from '../hooks/use-hotkeys.js';

export interface KbdProps extends Omit<ComponentPropsWithoutRef<'kbd'>, 'children'> {
  /**
   * A binding in the hotkey syntax, for example `mod+enter`. It is rendered
   * with the platform's own symbols, so one binding covers macOS and Windows.
   */
  keys: string;
}

/**
 * A keyboard shortcut rendered as real `<kbd>` elements.
 *
 * Shortcut symbols are not translated: Command is ⌘ in every locale. The
 * component is decorative next to a labelled action, so the surrounding
 * control still carries the accessible name.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, keys, ...props },
  ref,
) {
  const parts = formatHotkey(keys);
  return (
    <kbd
      ref={ref}
      className={cn('inline-flex items-center gap-0.5 font-sans', className)}
      {...props}
    >
      {parts.map((part, index) => (
        <kbd
          key={`${part}-${index}`}
          className={cn(
            'inline-flex h-4 min-w-4 items-center justify-center rounded-xs px-1',
            'border border-border-default bg-surface-sunken',
            'text-[0.6875rem] leading-none text-text-tertiary',
          )}
        >
          {part}
        </kbd>
      ))}
    </kbd>
  );
});
