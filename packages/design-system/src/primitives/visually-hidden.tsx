'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils/cn';

/**
 * Content that is available to assistive technology but not painted.
 *
 * Use it for the accessible name of an icon-only control, for a table caption
 * that would be redundant on screen, and for the text half of a status that is
 * also carried by colour and icon. Never use it to hide information that a
 * sighted user needs.
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<'span'>>(
  function VisuallyHidden({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn(
          'absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap',
          '[clip-path:inset(50%)]',
          className,
        )}
        {...props}
      />
    );
  },
);
