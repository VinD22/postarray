'use client';

import type { ReactNode } from 'react';
import { Marquee } from '@/components/motion';
import { ProviderMark, useProviderName } from '@/features/connections/provider';
import type { ProviderId } from '@/lib/api/types';
import { cn } from '@relay/design-system/utils';

/**
 * The connector marquee: an infinitely scrolling row of `ProviderMark` dots
 * paired with oversized, ink-bordered name chips.
 *
 * Names come from `useProviderName()` (`web.provider.*`, the same catalog
 * the calendar and receipts use), not a `loud`-local copy of the platform
 * list, so this can never drift from what the product actually calls a
 * platform. `providers` is required rather than defaulted: the caller states
 * which connectors it means to claim support for, so this component never
 * silently grows the list on its own.
 */
export interface LogoMarqueeProps {
  readonly providers: readonly ProviderId[];
  /** px/s the track travels at. Forwarded to `Marquee`. */
  readonly speed?: number;
  readonly className?: string;
}

export function LogoMarquee({ providers, speed = 36, className }: LogoMarqueeProps): ReactNode {
  const providerName = useProviderName();

  return (
    <Marquee speed={speed} pauseOnHover className={cn('border-border-default border-y', className)}>
      <ul className="flex items-stretch">
        {providers.map((provider) => {
          const name = providerName(provider);
          return (
            <li
              key={provider}
              className={cn(
                'border-border-default flex shrink-0 items-center gap-3 border-e px-6 py-6',
                'md:px-10 md:py-8',
              )}
            >
              <ProviderMark provider={provider} />
              <span className="font-display text-title-md md:text-display-lg text-text-primary leading-none whitespace-nowrap uppercase">
                {name}
              </span>
            </li>
          );
        })}
      </ul>
    </Marquee>
  );
}
