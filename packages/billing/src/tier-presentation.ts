import { formatMoneyMinor } from './money';
import {
  BASE_TIER_KEY,
  PUBLISHABLE_TIER_KEYS,
  assertTierPublishable,
  tierChannelAllowance,
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
  /** `$25` and `$250`, with zero cents trimmed. */
  readonly priceText: string;
  /** `$25.00` and `$250.00`, used wherever an exact charge is stated. */
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
   *
   * False on every tier under the current ladder, and deliberately so: a year
   * costs ten months, which is a clean thing to charge and a fractional thing
   * to divide. $250 over twelve is $20.83, and a price with cents in it is
   * exactly the presentation this product refuses. Use `freeMonthsEquivalent`
   * to describe the discount instead of inventing a monthly figure.
   */
  readonly effectiveMonthlyIsExact: boolean;
  /**
   * The saving expressed in whole months, when it lands on one.
   *
   * This is the sentence a buyer actually understands. Every tier here prices a
   * year at ten times its month, so this is 2 across the table and the annual
   * offer is one shared sentence rather than three separate sums. Null when the
   * saving is not a whole number of months, in which case the renderer falls
   * back to the money saving, which is always exact.
   */
  readonly freeMonthsEquivalent: number | null;
  /**
   * The shared parameterized sentence. Amounts are supplied by the renderer
   * from the fields above, so it cannot drift from the charge on any tier.
   */
  readonly framingKey: string;
  /**
   * The founder-worded sentence for this specific tier, in the tradition of
   * `MANDATED_COPY`. It is a literal, so `copy-compliance.test.ts` asserts its
   * amounts against the derived ones and a price change cannot strand it.
   */
  readonly mandatedFramingKey: string;
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
  /**
   * Derived from `projectAllowance`, never sold on its own. Rendered so a buyer
   * can see what their project capacity is worth in connections, pooled across
   * the workspace rather than fenced per project.
   */
  readonly channelAllowance: number;
  readonly channelAllowanceKey: string;
  readonly month: TierIntervalPresentation;
  readonly year: TierIntervalPresentation;
  readonly annualFraming: TierAnnualFraming;
  /** Identical on every tier. Varying it is the feature-gating violation. */
  readonly inclusionKeys: readonly string[];
  readonly trialDays: number;
}

/** Rendered beside the project count on every tier card. */
export const TIER_PROJECT_ALLOWANCE_KEY = 'billing.tier.projectAllowance';

/** Rendered beside the derived channel count on every tier card. */
export const TIER_CHANNEL_ALLOWANCE_KEY = 'billing.tier.channelAllowance';

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

/**
 * The catalog key holding this tier's founder-worded annual sentence. Derived
 * from the tier key so adding a tier cannot forget it: the presentation test
 * resolves every key it names against the English catalog.
 */
export function tierAnnualFramingKey(key: PlanTierKey): string {
  return `billing.tier.${key.replace('relay_', '')}.annualFraming`;
}

function annualFraming(tier: PlanTier): TierAnnualFraming {
  const twelveMonths = tier.monthlyPriceMinor * 12;
  const effectiveMonthlyMinor = Math.round(tier.annualPriceMinor / 12);
  const savingMinor = twelveMonths - tier.annualPriceMinor;
  const currency = tier.currency;
  // Whole months only. A saving of "1.7 months" is not a sentence anyone wants
  // read to them, and the money figure beside it is already exact.
  const freeMonthsEquivalent =
    tier.monthlyPriceMinor > 0 && savingMinor % tier.monthlyPriceMinor === 0
      ? savingMinor / tier.monthlyPriceMinor
      : null;
  return {
    freeMonthsEquivalent,
    effectiveMonthlyMinor,
    effectiveMonthlyText: formatMoneyMinor(effectiveMonthlyMinor, currency, {
      trimZeroFraction: true,
    }),
    savingMinor,
    savingText: formatMoneyMinor(savingMinor, currency, { trimZeroFraction: true }),
    savingBasisPoints: Math.round((savingMinor * 10_000) / twelveMonths),
    effectiveMonthlyIsExact: effectiveMonthlyMinor * 12 === tier.annualPriceMinor,
    framingKey: TIER_ANNUAL_FRAMING_KEY,
    mandatedFramingKey: tierAnnualFramingKey(tier.key),
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
    channelAllowance: tierChannelAllowance(tier.key),
    channelAllowanceKey: TIER_CHANNEL_ALLOWANCE_KEY,
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
