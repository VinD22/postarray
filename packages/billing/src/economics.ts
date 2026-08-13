import { AFFILIATE_TERMS } from './affiliate';
import { MICRO_PER_UNIT, applyBasisPoints, unitsToMicro } from './money';
import { ANNUAL_PRICE_MINOR, MONTHLY_PRICE_MINOR } from './products';
import type { BillingInterval } from './products';
import { BASE_TIER_KEY, PUBLISHABLE_TIER_KEYS, tierPriceMinor } from './tiers';
import type { PlanTierKey } from './tiers';

/**
 * The unit-economics model as code.
 *
 * Every input is an assumption to be replaced with measured data. They live
 * here rather than in a spreadsheet so a pricing decision, a margin gate and a
 * test can all read the same numbers. Amounts are integer micro-dollars per
 * subscriber per month; ratios are basis points.
 *
 * Managed X API usage is excluded from both sides: it is passed through at cost
 * and is neither revenue nor margin.
 *
 * **The blended model is pinned to the base tier on purpose.** Growth and
 * Studio carry the same variable cost per subscriber at a higher price, so a
 * mix that included them could only improve every figure below. Reporting the
 * base tier alone keeps `MARGIN_GATE_SUBSCRIBERS` a floor we can be held to
 * rather than a number that quietly depends on an unmeasured tier mix. Per-tier
 * figures are available from `tierEconomics` and are reported separately, the
 * same way the referred cohort is.
 */

export interface EconomicsAssumptions {
  /** Polar's percentage fee, in basis points. */
  readonly polarFeeBasisPoints: number;
  /** Polar's flat per-transaction fee, in micro-dollars. */
  readonly polarFeeFlatMicro: number;
  /** International card fee modelled as a share of price, in basis points. */
  readonly internationalCardFeeBasisPoints: number;
  /** Fixed platform cost per month, in micro-dollars. */
  readonly fixedPlatformCostMicroPerMonth: number;
  readonly variableInfrastructureMicroPerSubscriber: number;
  readonly storageAndEgressMicroPerSubscriber: number;
  readonly aiTextMicroPerSubscriber: number;
  readonly supportMicroPerSubscriber: number;
  /** Share of subscribers on the monthly interval, in basis points. */
  readonly monthlyMixBasisPoints: number;
  readonly assumptionsVerifiedAt: string;
  readonly reviewBy: string;
}

/**
 * The documented assumptions from
 * `docs/planning/08-billing-entitlements-and-economics.md` section 10.1.
 * Every third-party rate here is marked re-verify before launch.
 */
export const DOCUMENTED_ASSUMPTIONS: EconomicsAssumptions = Object.freeze({
  polarFeeBasisPoints: 500,
  polarFeeFlatMicro: unitsToMicro(0.5),
  internationalCardFeeBasisPoints: 60,
  fixedPlatformCostMicroPerMonth: unitsToMicro(1_150),
  variableInfrastructureMicroPerSubscriber: unitsToMicro(0.35),
  storageAndEgressMicroPerSubscriber: unitsToMicro(0.45),
  aiTextMicroPerSubscriber: unitsToMicro(0.7),
  supportMicroPerSubscriber: unitsToMicro(1.8),
  monthlyMixBasisPoints: 6_500,
  assumptionsVerifiedAt: '2026-08-04',
  reviewBy: '2026-12-20',
});

/** The gross margin gate. Measured on the non-referred base. */
export const MARGIN_GATE_BASIS_POINTS = 7_500;

/** Blended margin reaches the gate at approximately this many subscribers. */
export const MARGIN_GATE_SUBSCRIBERS = 670;

/** Referred-cohort margin must stay above this. */
export const REFERRED_COHORT_MARGIN_FLOOR_BASIS_POINTS =
  AFFILIATE_TERMS.cohortMarginFloorBasisPoints;

export interface PlanEconomics {
  readonly interval: BillingInterval;
  /** Recognised revenue per subscriber per month, in micro-dollars. */
  readonly revenueMicroPerMonth: number;
  readonly polarFeeMicroPerMonth: number;
  readonly cardFeeMicroPerMonth: number;
  readonly infrastructureMicroPerMonth: number;
  readonly storageAndEgressMicroPerMonth: number;
  readonly aiMicroPerMonth: number;
  readonly supportMicroPerMonth: number;
  readonly variableCostMicroPerMonth: number;
  readonly fixedCostMicroPerMonth: number;
  readonly grossProfitMicroPerMonth: number;
  readonly marginBasisPoints: number;
}

function monthsPerCharge(interval: BillingInterval): number {
  return interval === 'year' ? 12 : 1;
}

function priceMinor(interval: BillingInterval): number {
  return interval === 'year' ? ANNUAL_PRICE_MINOR : MONTHLY_PRICE_MINOR;
}

function marginBasisPoints(revenue: number, profit: number): number {
  if (revenue <= 0) {
    return 0;
  }
  return Math.round((profit * 10_000) / revenue);
}

/**
 * One interval at a given scale. The annual plan is structurally a little
 * thinner on infrastructure-normalised terms and materially better on fees,
 * because Polar's flat fee is charged once a year rather than twelve times.
 */
export function planEconomics(
  interval: BillingInterval,
  subscribers: number,
  assumptions: EconomicsAssumptions = DOCUMENTED_ASSUMPTIONS,
): PlanEconomics {
  const months = monthsPerCharge(interval);
  const chargeMicro = priceMinor(interval) * (MICRO_PER_UNIT / 100);
  const revenueMicroPerMonth = Math.round(chargeMicro / months);

  const polarFeePerCharge =
    applyBasisPoints(chargeMicro, assumptions.polarFeeBasisPoints) + assumptions.polarFeeFlatMicro;
  const cardFeePerCharge = applyBasisPoints(
    chargeMicro,
    assumptions.internationalCardFeeBasisPoints,
  );

  const polarFeeMicroPerMonth = Math.round(polarFeePerCharge / months);
  const cardFeeMicroPerMonth = Math.round(cardFeePerCharge / months);

  const variableCostMicroPerMonth =
    polarFeeMicroPerMonth +
    cardFeeMicroPerMonth +
    assumptions.variableInfrastructureMicroPerSubscriber +
    assumptions.storageAndEgressMicroPerSubscriber +
    assumptions.aiTextMicroPerSubscriber +
    assumptions.supportMicroPerSubscriber;

  const fixedCostMicroPerMonth =
    subscribers <= 0
      ? assumptions.fixedPlatformCostMicroPerMonth
      : Math.round(assumptions.fixedPlatformCostMicroPerMonth / subscribers);

  const grossProfitMicroPerMonth =
    revenueMicroPerMonth - variableCostMicroPerMonth - fixedCostMicroPerMonth;

  return {
    interval,
    revenueMicroPerMonth,
    polarFeeMicroPerMonth,
    cardFeeMicroPerMonth,
    infrastructureMicroPerMonth: assumptions.variableInfrastructureMicroPerSubscriber,
    storageAndEgressMicroPerMonth: assumptions.storageAndEgressMicroPerSubscriber,
    aiMicroPerMonth: assumptions.aiTextMicroPerSubscriber,
    supportMicroPerMonth: assumptions.supportMicroPerSubscriber,
    variableCostMicroPerMonth,
    fixedCostMicroPerMonth,
    grossProfitMicroPerMonth,
    marginBasisPoints: marginBasisPoints(revenueMicroPerMonth, grossProfitMicroPerMonth),
  };
}

export interface TierEconomics extends PlanEconomics {
  readonly tierKey: PlanTierKey;
}

/**
 * One tier on one interval at a given scale.
 *
 * The cost side is identical to the base tier's by construction: a larger tier
 * buys project capacity, and capacity costs us storage and a little more
 * support, not a different cost model. Treating the costs as equal therefore
 * understates the larger tiers' margin slightly, which is the direction an
 * assumption should err in.
 */
export function tierEconomics(
  tierKey: PlanTierKey,
  interval: BillingInterval,
  subscribers: number,
  assumptions: EconomicsAssumptions = DOCUMENTED_ASSUMPTIONS,
): TierEconomics {
  const base = planEconomics(interval, subscribers, assumptions);
  const months = monthsPerCharge(interval);
  const chargeMicro = tierPriceMinor(tierKey, interval) * (MICRO_PER_UNIT / 100);
  const revenueMicroPerMonth = Math.round(chargeMicro / months);

  const polarFeePerCharge =
    applyBasisPoints(chargeMicro, assumptions.polarFeeBasisPoints) + assumptions.polarFeeFlatMicro;
  const cardFeePerCharge = applyBasisPoints(
    chargeMicro,
    assumptions.internationalCardFeeBasisPoints,
  );
  const polarFeeMicroPerMonth = Math.round(polarFeePerCharge / months);
  const cardFeeMicroPerMonth = Math.round(cardFeePerCharge / months);

  const variableCostMicroPerMonth =
    base.variableCostMicroPerMonth -
    base.polarFeeMicroPerMonth -
    base.cardFeeMicroPerMonth +
    polarFeeMicroPerMonth +
    cardFeeMicroPerMonth;

  const grossProfitMicroPerMonth =
    revenueMicroPerMonth - variableCostMicroPerMonth - base.fixedCostMicroPerMonth;

  return {
    ...base,
    tierKey,
    revenueMicroPerMonth,
    polarFeeMicroPerMonth,
    cardFeeMicroPerMonth,
    variableCostMicroPerMonth,
    grossProfitMicroPerMonth,
    marginBasisPoints: marginBasisPoints(revenueMicroPerMonth, grossProfitMicroPerMonth),
  };
}

/** Every published tier on one interval, cheapest first. */
export function tierMarginTable(
  interval: BillingInterval,
  subscribers: number,
  assumptions: EconomicsAssumptions = DOCUMENTED_ASSUMPTIONS,
): readonly TierEconomics[] {
  return PUBLISHABLE_TIER_KEYS.map((key) => tierEconomics(key, interval, subscribers, assumptions));
}

/** The tier the blended model is measured on. Everything above it is upside. */
export const BLENDED_MODEL_TIER: PlanTierKey = BASE_TIER_KEY;

export interface BlendedEconomics {
  readonly subscribers: number;
  readonly monthly: PlanEconomics;
  readonly annual: PlanEconomics;
  readonly blendedRevenueMicroPerMonth: number;
  readonly blendedGrossProfitMicroPerMonth: number;
  readonly blendedMarginBasisPoints: number;
  readonly meetsMarginGate: boolean;
  readonly fixedCostPerSubscriberMicro: number;
}

/** Revenue-weighted blend at the documented monthly/annual mix. */
export function blendedEconomics(
  subscribers: number,
  assumptions: EconomicsAssumptions = DOCUMENTED_ASSUMPTIONS,
): BlendedEconomics {
  const monthly = planEconomics('month', subscribers, assumptions);
  const annual = planEconomics('year', subscribers, assumptions);
  const monthlyShare = assumptions.monthlyMixBasisPoints;
  const annualShare = 10_000 - monthlyShare;

  const blendedRevenue =
    applyBasisPoints(monthly.revenueMicroPerMonth, monthlyShare) +
    applyBasisPoints(annual.revenueMicroPerMonth, annualShare);
  const blendedProfit =
    applyBasisPoints(monthly.grossProfitMicroPerMonth, monthlyShare) +
    applyBasisPoints(annual.grossProfitMicroPerMonth, annualShare);

  const blendedMarginBasisPoints = marginBasisPoints(blendedRevenue, blendedProfit);
  return {
    subscribers,
    monthly,
    annual,
    blendedRevenueMicroPerMonth: blendedRevenue,
    blendedGrossProfitMicroPerMonth: blendedProfit,
    blendedMarginBasisPoints,
    meetsMarginGate: blendedMarginBasisPoints >= MARGIN_GATE_BASIS_POINTS,
    fixedCostPerSubscriberMicro: monthly.fixedCostMicroPerMonth,
  };
}

export interface ReferredCohortEconomics {
  readonly subscribers: number;
  readonly revenueMicroPerMonth: number;
  readonly feesMicroPerMonth: number;
  readonly operatingCostMicroPerMonth: number;
  readonly commissionMicroPerMonth: number;
  readonly grossProfitMicroPerMonth: number;
  readonly marginBasisPoints: number;
  readonly meetsFloor: boolean;
}

/**
 * A referred monthly subscriber inside the twelve month commission window.
 * Reported separately from the blended figure on purpose: hiding the referred
 * cohort inside a blended average makes the blended number meaningless.
 */
export function referredCohortEconomics(
  subscribers: number,
  assumptions: EconomicsAssumptions = DOCUMENTED_ASSUMPTIONS,
): ReferredCohortEconomics {
  const base = planEconomics('month', subscribers, assumptions);
  const fees = base.polarFeeMicroPerMonth + base.cardFeeMicroPerMonth;
  const operating =
    base.infrastructureMicroPerMonth +
    base.storageAndEgressMicroPerMonth +
    base.aiMicroPerMonth +
    base.supportMicroPerMonth +
    base.fixedCostMicroPerMonth;
  const netRevenue = base.revenueMicroPerMonth - fees;
  const commission = applyBasisPoints(netRevenue, AFFILIATE_TERMS.commissionBasisPoints);
  const grossProfit = base.revenueMicroPerMonth - fees - operating - commission;
  const margin = marginBasisPoints(base.revenueMicroPerMonth, grossProfit);
  return {
    subscribers,
    revenueMicroPerMonth: base.revenueMicroPerMonth,
    feesMicroPerMonth: fees,
    operatingCostMicroPerMonth: operating,
    commissionMicroPerMonth: commission,
    grossProfitMicroPerMonth: grossProfit,
    marginBasisPoints: margin,
    meetsFloor: margin > REFERRED_COHORT_MARGIN_FLOOR_BASIS_POINTS,
  };
}

/** The scales the plan reports on. Used by the monthly finance report. */
export const REPORTED_SCALES: readonly number[] = Object.freeze([
  250,
  500,
  MARGIN_GATE_SUBSCRIBERS,
  1_000,
  2_000,
  5_000,
]);

export interface MarginTableRow {
  readonly subscribers: number;
  readonly fixedCostPerSubscriberMicro: number;
  readonly monthlyMarginBasisPoints: number;
  readonly annualMarginBasisPoints: number;
  readonly blendedMarginBasisPoints: number;
}

export function marginTable(
  assumptions: EconomicsAssumptions = DOCUMENTED_ASSUMPTIONS,
  scales: readonly number[] = REPORTED_SCALES,
): readonly MarginTableRow[] {
  return scales.map((subscribers) => {
    const blended = blendedEconomics(subscribers, assumptions);
    return {
      subscribers,
      fixedCostPerSubscriberMicro: blended.fixedCostPerSubscriberMicro,
      monthlyMarginBasisPoints: blended.monthly.marginBasisPoints,
      annualMarginBasisPoints: blended.annual.marginBasisPoints,
      blendedMarginBasisPoints: blended.blendedMarginBasisPoints,
    };
  });
}

/**
 * The subscriber count at which the blended margin first reaches the gate. The
 * answer is a finding, not a target: below it we operate under the gate on
 * purpose, and the response is the lever list in section 10.3, never a cheaper
 * feature-gated tier.
 */
export function subscribersToMeetMarginGate(
  assumptions: EconomicsAssumptions = DOCUMENTED_ASSUMPTIONS,
  maximum = 20_000,
): number | null {
  for (let subscribers = 1; subscribers <= maximum; subscribers += 1) {
    if (blendedEconomics(subscribers, assumptions).meetsMarginGate) {
      return subscribers;
    }
  }
  return null;
}

/** The margin levers, in the order we would pull them. Order is the point. */
export const MARGIN_LEVERS: readonly string[] = Object.freeze([
  'move_polar_to_a_paid_tier',
  'reduce_the_fixed_platform_floor',
  'move_storage_and_egress',
  'tighten_the_ai_daily_soft_cap',
  'deflect_support_with_better_errors_and_docs',
  'adjust_the_disclosed_fair_use_boundary',
]);

/** Creating a cheaper feature-gated tier is explicitly not a lever. */
export const FORBIDDEN_MARGIN_LEVERS: readonly string[] = Object.freeze([
  'create_a_cheaper_feature_gated_tier',
  'introduce_per_seat_pricing',
  'introduce_per_channel_pricing',
  'sell_media_generation_credits',
]);
