'use client';

import { forwardRef, useEffect, useState, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils/cn';
import { formatHotkey } from '../hooks/use-hotkeys';

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
 * Shortcut symbols are not translated. The server and first client render use
 * the portable Ctrl label, then the client upgrades it to the platform symbol
 * after hydration so the shortcut hint never causes a hydration mismatch.
 * The component is decorative next to a labelled action, so the surrounding
 * control still carries the accessible name.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, keys, ...props },
  ref,
) {
  const [apple, setApple] = useState(false);

  useEffect(() => {
    const platform =
      (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData
        ?.platform ?? navigator.platform;
    setApple(/mac|iphone|ipad|ipod/i.test(platform ?? ''));
  }, []);

  const parts = formatHotkey(keys, apple);
  return (
    <kbd
      ref={ref}
      className={cn('inline-flex items-center gap-0.5 font-sans', className)}
      {...props}
    >
      {parts.map((part, index) => (
        <kbd
          // A chord is a fixed, ordered list and a repeated key is meaningful, so the
          // position is part of the identity.
          // eslint-disable-next-line react/no-array-index-key
          key={`${part}-${index}`}
          className={cn(
            'inline-flex h-4 min-w-4 items-center justify-center rounded-xs px-1',
            'border-border-default bg-surface-sunken border',
            'text-text-tertiary text-[0.6875rem] leading-none',
          )}
        >
          {part}
        </kbd>
      ))}
    </kbd>
  );
});
