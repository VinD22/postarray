import type { Translator } from '@relay/i18n/translate';

import { BASE_TIER_KEY, publishableTiers, type WebPlanTier } from '@/features/billing/tiers';

import type { TierGridColumn } from './tier-grid';

/**
 * The tier columns, built once, used by both surfaces that show them (the
 * pricing page and the home teaser).
 *
 * It exists so those two pages cannot drift: the delta sentences, the anchor,
 * the single action and the not-purchasable note are decided here, from
 * `publishableTiers()`, rather than typed out twice. A tier whose numbers are
 * still a founder decision never reaches this function — `publishableTiers()`
 * excludes it — so there is no path by which an undecided tier gets a price or
 * a button.
 *
 * The delta sentence is derived arithmetic, not prose: the base tier states
 * what every tier includes, and each larger tier states its project-count
 * difference from the one below. Feature lists never differ, so nothing else
 * can appear in a delta.
 */
export interface TierColumnOptions {
  readonly t: Translator;
  /** Where the single primary action goes. Only the anchored tier gets one. */
  readonly ctaHref: string;
  readonly ctaLabel: string;
}

/** The per-tier annual framing keys, which are literals, not generated. */
const ANNUAL_FRAMING_KEYS: Readonly<Record<string, Parameters<Translator['t']>[0]>> = {
  relay_standard: 'billing.tier.standard.annualFraming',
  relay_growth: 'billing.tier.growth.annualFraming',
  relay_studio: 'billing.tier.studio.annualFraming',
};

export function tierColumns({
  t,
  ctaHref,
  ctaLabel,
}: TierColumnOptions): readonly TierGridColumn[] {
  const tiers = publishableTiers();

  return tiers.map((tier: WebPlanTier, index): TierGridColumn => {
    // `?? null` because indexed access is checked: the guard below tests for
    // null, and an `undefined` slipping through would read as "base tier" and
    // silently print the wrong delta sentence.
    const previous = index === 0 ? null : (tiers[index - 1] ?? null);
    const anchored = tier.key === BASE_TIER_KEY;
    const framingKey = ANNUAL_FRAMING_KEYS[tier.key];

    return {
      id: tier.key,
      name: t.t(tier.nameKey),
      tagline: t.t(tier.taglineKey),
      monthlyPriceMinor: tier.monthlyPriceMinor,
      annualPriceMinor: tier.annualPriceMinor,
      currency: tier.currency,
      allowance: t.format('billing.tier.projectAllowance', { count: tier.projectAllowance }),
      delta:
        previous === null
          ? t.format('web.pricing.tierGrid.baseDelta', { count: tier.projectAllowance })
          : t.format('web.pricing.tierGrid.stepDelta', {
              tier: t.t(previous.nameKey),
              added: tier.projectAllowance - previous.projectAllowance,
            }),
      // Falls back to the shared framing rather than inventing one: a tier
      // added without its own reviewed sentence must still not be silent
      // about what annual billing costs.
      annualFraming: framingKey ? t.t(framingKey) : t.t('billing.tier.everyFeature'),
      anchored,
      // Exactly one action on the page. Checkout is closed for the larger
      // tiers, and a button that cannot charge anybody is worse than a
      // sentence saying so.
      ...(anchored
        ? { cta: { href: ctaHref, label: ctaLabel } }
        : { unavailableNote: t.t('web.pricing.tierGrid.notPurchasable') }),
    };
  });
}
