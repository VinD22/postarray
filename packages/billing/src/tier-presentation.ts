import { formatMoneyMinor } from './money';
import {
  BASE_TIER_KEY,
  PUBLISHABLE_TIER_KEYS,
  assertTierPublishable,
  tierInclusionKeys,
  tierProjectAllowance,
} from './tiers';
import type { PlanTier, PlanTierKey } from './tiers';
import type { BillingInterval } from './intervals';

/**
 * What a pricing surface renders for one tier.
 *
 * Every amount is derived from the tier's minor units, so a headline, a picker
 * and a checkout disclosure cannot disagree with each other or with the charge.
 * Every sentence is a message key, so no component holds prose. A tier that is
 * still a founder placeholder cannot reach this module at all: building a
 * presentation for one throws.
 */

export interface TierIntervalPresentation {
  readonly interval: BillingInterval;
  readonly priceMinor: number;
  readonly currency: string;
  /** `$29` and `$300`, with zero cents trimmed. */
  readonly priceText: string;
  /** `$29.00` and `$300.00`, used wherever an exact charge is stated. */
  readonly exactPriceText: string;
  readonly labelKey: string;
  readonly trialDays: number;
}

export interface TierAnnualFraming {
  readonly effectiveMonthlyMinor: number;
  readonly effectiveMonthlyText: string;
  /** Twelve monthly charges minus one annual charge. Never a percentage. */
  readonly savingMinor: number;
  readonly savingText: string;
  readonly savingBasisPoints: number;
  /**
   * False when the annual price does not divide into twelve whole cents. The
   * per-month framing is suppressed rather than rounded into a claim we would
   * not charge.
   */
  readonly effectiveMonthlyIsExact: boolean;
  readonly framingKey: string;
}

export interface TierPresentation {
  readonly tierKey: PlanTierKey;
  readonly rank: number;
  readonly isBaseTier: boolean;
  readonly currency: string;
  readonly nameKey: string;
  readonly taglineKey: string;
  /** The one number that varies between tiers. */
  readonly projectAllowance: number;
  readonly projectAllowanceKey: string;
  readonly month: TierIntervalPresentation;
  readonly year: TierIntervalPresentation;
  readonly annualFraming: TierAnnualFraming;
  /** Identical on every tier. Varying it is the feature-gating violation. */
  readonly inclusionKeys: readonly string[];
  readonly trialDays: number;
}

/** Rendered beside the project count on every tier card. */
export const TIER_PROJECT_ALLOWANCE_KEY = 'billing.tier.projectAllowance';

/** The per-tier annual sentence. Parameters are money, never a percentage. */
export const TIER_ANNUAL_FRAMING_KEY = 'billing.tier.annualFraming';

function intervalPresentation(
  tier: PlanTier,
  interval: BillingInterval,
  trialDays: number,
): TierIntervalPresentation {
  const priceMinor = interval === 'year' ? tier.annualPriceMinor : tier.monthlyPriceMinor;
  return {
    interval,
    priceMinor,
    currency: tier.currency,
    priceText: formatMoneyMinor(priceMinor, tier.currency, { trimZeroFraction: true }),
    exactPriceText: formatMoneyMinor(priceMinor, tier.currency),
    labelKey:
      interval === 'year' ? 'billing.plan.interval.annual' : 'billing.plan.interval.monthly',
    trialDays,
  };
}

function annualFraming(tier: PlanTier): TierAnnualFraming {
  const twelveMonths = tier.monthlyPriceMinor * 12;
  const effectiveMonthlyMinor = Math.round(tier.annualPriceMinor / 12);
  const savingMinor = twelveMonths - tier.annualPriceMinor;
  const currency = tier.currency;
  return {
    effectiveMonthlyMinor,
    effectiveMonthlyText: formatMoneyMinor(effectiveMonthlyMinor, currency, {
      trimZeroFraction: true,
    }),
    savingMinor,
    savingText: formatMoneyMinor(savingMinor, currency, { trimZeroFraction: true }),
    savingBasisPoints: Math.round((savingMinor * 10_000) / twelveMonths),
    effectiveMonthlyIsExact: effectiveMonthlyMinor * 12 === tier.annualPriceMinor,
    framingKey: TIER_ANNUAL_FRAMING_KEY,
  };
}

/** Build the presentation for a decided tier. Throws for a placeholder. */
export function buildTierPresentation(key: PlanTierKey, trialDays: number): TierPresentation {
  const tier = assertTierPublishable(key);
  return Object.freeze({
    tierKey: tier.key,
    rank: tier.rank,
    isBaseTier: tier.key === BASE_TIER_KEY,
    currency: tier.currency,
    nameKey: tier.nameKey,
    taglineKey: tier.taglineKey,
    projectAllowance: tierProjectAllowance(tier.key),
    projectAllowanceKey: TIER_PROJECT_ALLOWANCE_KEY,
    month: Object.freeze(intervalPresentation(tier, 'month', trialDays)),
    year: Object.freeze(intervalPresentation(tier, 'year', trialDays)),
    annualFraming: Object.freeze(annualFraming(tier)),
    inclusionKeys: tierInclusionKeys(tier.key),
    trialDays,
  });
}

/** Every tier a customer may be shown, cheapest first. */
export function publishableTierPresentations(trialDays: number): readonly TierPresentation[] {
  return PUBLISHABLE_TIER_KEYS.map((key) => buildTierPresentation(key, trialDays));
}

/** Amounts and labels a compliance scan reads. Message keys are not copy. */
export function tierPresentationStrings(presentation: TierPresentation): readonly string[] {
  return [
    presentation.month.priceText,
    presentation.month.exactPriceText,
    presentation.year.priceText,
    presentation.year.exactPriceText,
    presentation.annualFraming.effectiveMonthlyText,
    presentation.annualFraming.savingText,
  ];
}
