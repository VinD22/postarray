'use client';

import type { ReactNode } from 'react';
import { ProviderMark, useProviderName } from '@/features/connections/provider';
import type { ProviderId } from '@/lib/api/types';
import { cn } from '@relay/design-system/utils';

/**
 * The connector list: a calm, wrapped grid of provider marks and names.
 *
 * This replaces the loud `LogoMarquee`, an infinitely scrolling row of
 * oversized ink-bordered name chips. A marquee is a motion element that never
 * settles, which means it never stops asking for attention, and it hides half
 * its own content off-screen at any moment. A wrapped grid states the same
 * fact — these are the platforms, publishing through their official APIs — in
 * one still frame that is fully readable, fully keyboard-irrelevant (nothing
 * here is focusable), and free of client-side animation entirely.
 *
 * Names come from `useProviderName()` (`web.provider.*`, the same catalog the
 * calendar and receipts use), never a marketing-local copy of the platform
 * list, so this cannot drift from what the product calls a platform.
 * `providers` is required rather than defaulted: the caller states which
 * connectors it means, so this component never silently grows the list.
 *
 * The mark is a coloured dot and the name beside it is text, so the identity
 * survives greyscale and a screen reader alike (see `ProviderMark`).
 */
export interface ProviderGridProps {
  readonly providers: readonly ProviderId[];
  /** Accessible name for the list, when no visible heading precedes it. */
  readonly ariaLabel?: string;
  readonly className?: string;
}

export function ProviderGrid({ providers, ariaLabel, className }: ProviderGridProps): ReactNode {
  const providerName = useProviderName();

  return (
    <ul
      aria-label={ariaLabel}
      className={cn(
        'grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3 lg:grid-cols-4',
        'border-border-subtle border-t pt-8',
        className,
      )}
    >
      {providers.map((provider) => (
        <li
          key={provider}
          className={cn(
            'group/cell -mx-2 flex min-w-0 items-center gap-3 rounded-sm px-2 py-1.5',
            // The bloom: the cell's ground fills with the surface hover tint
            // and the mark grows from 8px to 12px. Both are transforms and a
            // background colour on a non-interactive element, at the fast
            // functional duration, and the global 1ms reduced-motion override
            // reaches both because neither is a GSAP tween.
            'transition-colors duration-(--duration-base) ease-(--ease-standard)',
            'hover:bg-surface-sunken',
          )}
        >
          <span className="flex shrink-0 items-center transition-transform duration-(--duration-base) ease-(--ease-out-back) group-hover/cell:scale-150">
            <ProviderMark provider={provider} />
          </span>
          <span className="text-body-lg text-text-secondary min-w-0 truncate">
            {providerName(provider)}
          </span>
        </li>
      ))}
    </ul>
  );
}
