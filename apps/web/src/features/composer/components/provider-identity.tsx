'use client';

/**
 * Platform names are proper nouns and stay untranslated, the same way "Acme"
 * does. They are not product copy, so they live here rather than in the
 * catalog. Everything a person reads *about* a platform is translated.
 *
 * The identity is always a small dot plus the account name in text. Colour
 * never carries the identification on its own.
 */

import type { ReactNode } from 'react';
import type { ProviderId } from '@relay/contracts';
import { StatusDot } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';

export const PROVIDER_LABEL: Readonly<Record<ProviderId, string>> = {
  x: 'X',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  threads: 'Threads',
  bluesky: 'Bluesky',
  fake: 'Relay sandbox',
};

/** The design system carries a colour for every provider it knows about. */
const BRANDED: ReadonlySet<ProviderId> = new Set<ProviderId>([
  'x',
  'linkedin',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'threads',
  'bluesky',
]);

type BrandedProvider = 'x' | 'linkedin' | 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'threads' | 'bluesky';

export interface ProviderIdentityProps {
  readonly provider: ProviderId;
  readonly accountName: string;
  readonly handle?: string | null;
  readonly className?: string;
  /** Hide the platform name when the surrounding row already states it. */
  readonly hideProviderName?: boolean;
}

export function ProviderIdentity({
  provider,
  accountName,
  handle,
  className,
  hideProviderName = false,
}: ProviderIdentityProps): ReactNode {
  const name = PROVIDER_LABEL[provider];
  const dot = BRANDED.has(provider) ? (
    <StatusDot
      provider={provider as BrandedProvider}
      {...(hideProviderName ? { label: name } : {})}
      className="shrink-0"
    />
  ) : (
    <StatusDot tone="neutral" {...(hideProviderName ? { label: name } : {})} className="shrink-0" />
  );

  return (
    <span className={cn('flex min-w-0 items-center gap-2', className)}>
      {dot}
      <span className="min-w-0 truncate text-body-md text-text-primary">{accountName}</span>
      {handle ? (
        <span className="min-w-0 truncate text-body-sm text-text-tertiary">{handle}</span>
      ) : null}
      {hideProviderName ? null : (
        <span className="shrink-0 text-label text-text-tertiary">{name}</span>
      )}
    </span>
  );
}
