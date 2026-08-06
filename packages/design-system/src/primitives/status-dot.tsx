'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../utils/cn';
import type { ProviderKey } from '../tokens/tokens';

export type StatusDotTone = 'neutral' | 'accent' | 'success' | 'warning' | 'destructive' | 'info';

const toneClass: Record<StatusDotTone, string> = {
  neutral: 'bg-text-tertiary',
  accent: 'bg-accent',
  success: 'bg-success-border',
  warning: 'bg-warning-border',
  destructive: 'bg-destructive-border',
  info: 'bg-info-border',
};

const providerClass: Record<ProviderKey, string> = {
  x: 'bg-brand-x',
  linkedin: 'bg-brand-linkedin',
  instagram: 'bg-brand-instagram',
  facebook: 'bg-brand-facebook',
  youtube: 'bg-brand-youtube',
  tiktok: 'bg-brand-tiktok',
  threads: 'bg-brand-threads',
  bluesky: 'bg-brand-bluesky',
  mastodon: 'bg-brand-mastodon',
  telegram: 'bg-brand-telegram',
  reddit: 'bg-brand-reddit',
  wordpress: 'bg-brand-wordpress',
  medium: 'bg-brand-medium',
  devto: 'bg-brand-devto',
  pinterest: 'bg-brand-pinterest',
  discord: 'bg-brand-discord',
  slack: 'bg-brand-slack',
  fake: 'bg-brand-fake',
};

export interface StatusDotProps extends ComponentPropsWithoutRef<'span'> {
  tone?: StatusDotTone;
  /**
   * Renders the provider's own identity colour instead of a semantic tone.
   * This is the only place a brand colour is allowed, and only at this size.
   */
  provider?: ProviderKey;
  /**
   * An accessible name. Supply it only when the dot is the sole carrier of the
   * meaning, which should be rare: a dot beside a visible label is decorative
   * and must stay hidden from assistive technology.
   */
  label?: string | undefined;
}

/**
 * A 8px identity or state dot.
 *
 * A dot never communicates on its own. It sits beside a word: the account
 * handle, the connection state, the platform name. Colour without text fails
 * for anyone who cannot distinguish the hues, and this product has nine
 * provider colours that would be indistinguishable in greyscale.
 */
export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot(
  { className, tone = 'neutral', provider, label, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(
        'inline-block size-2 shrink-0 rounded-full',
        provider ? providerClass[provider] : toneClass[tone],
        className,
      )}
      {...props}
    />
  );
});
