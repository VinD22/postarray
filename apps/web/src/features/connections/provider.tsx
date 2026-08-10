'use client';

/**
 * Provider identity.
 *
 * One place decides how a platform is named and marked, because three
 * surfaces need to agree: the calendar chip, the receipt header and the
 * connection row. A platform is always a monochrome dot plus its name in
 * text. The dot is the only place a brand colour is permitted, and it is
 * never the sole identifier, so a greyscale screenshot and a screen reader
 * carry the same information.
 *
 * This module lives under `connections` because provider metadata is
 * connection domain knowledge. The calendar and receipt surfaces import it.
 */

import type { ReactNode } from 'react';
import { StatusDot, cn, type ProviderKey } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import type { AccountType, ProviderId } from '@/lib/api/types';

/**
 * Providers the token set has an identity colour for. `fake` is the in-repo
 * simulator and deliberately has none, so it renders with a neutral dot and
 * can never be mistaken for a real platform in a screenshot.
 */
const BRANDED_PROVIDERS: Readonly<Record<ProviderId, ProviderKey | null>> = {
  x: 'x',
  linkedin: 'linkedin',
  instagram: 'instagram',
  facebook: 'facebook',
  youtube: 'youtube',
  tiktok: 'tiktok',
  threads: 'threads',
  bluesky: 'bluesky',
  mastodon: 'mastodon',
  telegram: 'telegram',
  reddit: 'reddit',
  wordpress: 'wordpress',
  medium: 'medium',
  devto: 'devto',
  pinterest: 'pinterest',
  discord: 'discord',
  slack: 'slack',
  google_business_profile: 'google_business_profile',
  fake: null,
};

/** The translated platform name. Never a literal in a component. */
export function useProviderName(): (provider: ProviderId) => string {
  const t = useTranslations('web.provider');
  return (provider) => t(provider);
}

/** The translated account type, covering the whole contract enum. */
export function useAccountTypeName(): (accountType: AccountType) => string {
  const t = useTranslations('web.accountType');
  return (accountType) => t(accountType);
}

export interface ProviderMarkProps {
  provider: ProviderId;
  /** Hidden from assistive technology when a name is already beside it. */
  labelledBySibling?: boolean;
  /** The platform name, used as the dot's accessible name when it stands alone. */
  name?: string;
  className?: string;
}

/** The 8px identity dot. */
export function ProviderMark({
  provider,
  labelledBySibling = true,
  name,
  className,
}: ProviderMarkProps): ReactNode {
  const key = BRANDED_PROVIDERS[provider];
  const standalone = !labelledBySibling && name !== undefined;
  return (
    <StatusDot
      {...(key ? { provider: key } : { tone: 'neutral' as const })}
      {...(standalone ? { label: name } : {})}
      className={className}
    />
  );
}

export interface AccountIdentityProps {
  provider: ProviderId;
  /** The exact account, page or channel. Always visible, never truncated away. */
  accountLabel: string;
  /** Handle or secondary line. */
  secondary?: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  /**
   * Omits the leading dot. For a caller that already shows the platform
   * another way beside this identity — an `Avatar`'s corner badge, for
   * instance — so the platform is not named twice in the same row.
   */
  hideMark?: boolean;
}

/**
 * Platform dot, platform name, account name.
 *
 * The order matters: a person scanning a queue looks for the platform first
 * and the account second, and putting the account first makes eight rows of
 * "Acme" indistinguishable.
 */
export function AccountIdentity({
  provider,
  accountLabel,
  secondary,
  size = 'md',
  className,
  hideMark = false,
}: AccountIdentityProps): ReactNode {
  const providerName = useProviderName();
  return (
    <span className={cn('flex min-w-0 items-center gap-2', className)}>
      {hideMark ? null : <ProviderMark provider={provider} />}
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            'flex min-w-0 flex-wrap items-baseline gap-x-1.5',
            size === 'sm' ? 'text-body-sm' : 'text-body-md',
          )}
        >
          <span className="text-text-secondary">{providerName(provider)}</span>
          <span className="text-text-primary min-w-0 truncate font-medium">{accountLabel}</span>
        </span>
        {secondary ? (
          <span className="text-body-sm text-text-tertiary truncate">{secondary}</span>
        ) : null}
      </span>
    </span>
  );
}
