import type { ReactNode } from 'react';
import type { CoreProviderId } from '@relay/contracts';
import { cn } from '@relay/design-system/utils';

import { ProviderLogo } from './provider-logo';

/**
 * The launch cohort, as marks and names, above the headline.
 *
 * This is the fastest thing on the home page to understand, which is why it
 * comes first: before a stranger has read a word of the promise they can see
 * which networks this publishes to. A row of 8px monochrome dots cannot do
 * that job, and that is exactly what the hero used to carry.
 *
 * Three properties this component is responsible for:
 *
 *  1. **It is derived, never typed.** The caller passes `CORE_PROVIDER_IDS`
 *     from `@relay/contracts`. A hand-written list here would be a claim that
 *     could disagree with the connect dialog, and a page that disagrees with
 *     the cohort is a false claim in both directions.
 *  2. **Every mark is named.** The name is text in the same cell, so brand
 *     colour is decoration rather than information (the condition the design
 *     system attaches to using brand colour at logo scale at all).
 *  3. **It is server HTML with no motion and no client JavaScript.** It sits
 *     above the LCP headline; anything that measured, animated or hydrated
 *     here would push first paint back for the sake of a decoration.
 *
 * It wraps rather than scrolls. Ten short names wrap to two lines on a phone,
 * which stays readable and keeps the headline near the top of the screen; a
 * horizontally scrolling strip would hide half the cohort behind a gesture
 * nobody knows to make.
 */
export interface ProviderLogoRowProps {
  /** Pass `CORE_PROVIDER_IDS`. Order is the cohort's order, not a ranking. */
  readonly providers: readonly CoreProviderId[];
  /** Names the list for assistive technology; there is no visible heading. */
  readonly ariaLabel: string;
  /** Resolves the translated platform name. Never a literal in this file. */
  readonly name: (provider: CoreProviderId) => string;
  readonly className?: string;
}

export function ProviderLogoRow({
  providers,
  ariaLabel,
  name,
  className,
}: ProviderLogoRowProps): ReactNode {
  return (
    <ul
      aria-label={ariaLabel}
      className={cn('flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-6', className)}
    >
      {providers.map((provider) => (
        <li key={provider} className="flex items-center gap-1.5 sm:gap-2">
          <ProviderLogo provider={provider} className="size-[1.0625rem] sm:size-5" />
          {/*
            13px on a phone rather than the 14px body step: it buys a row back
            in the wrap, which on a 360px screen is the difference between the
            headline starting on the first screen and starting below it.
          */}
          <span className="text-text-secondary text-[0.8125rem] whitespace-nowrap sm:text-[0.875rem]">
            {name(provider)}
          </span>
        </li>
      ))}
    </ul>
  );
}
