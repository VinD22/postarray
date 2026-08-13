import type { MessageKey, Translator } from '@relay/i18n/translate';

import {
  BASE_TIER_KEY,
  WEB_SHARED_INCLUSION_KEYS,
  freeMonthsEquivalent,
  priceUnits,
  publishableTiers,
  purchasableTiers,
  type TierEnvironment,
  type WebPlanTier,
} from '@/features/billing/tiers';

import type { TierFeature, TierGridColumn, TierIntervalFace } from './tier-grid';

/**
 * The plan columns, built once, used by both surfaces that show them (the
 * pricing page and the home teaser).
 *
 * It exists so those two pages cannot drift: what a column says, which one
 * carries the action, and what the yearly view is allowed to state are decided
 * here rather than typed out twice.
 *
 * ## Only what somebody can buy
 *
 * The source is `purchasableTiers`, not `publishableTiers`. All three tiers are
 * real and priced, and they stay in the tier module; a tier reaches this
 * function only once its Polar products are configured, so today the page is
 * one confident plan instead of one plan and two refusals. The gate is a
 * function of configuration, so the day the larger products exist the page
 * grows a column on its own. See `purchasableTiers` for why the base tier is
 * not subject to it.
 *
 * A previous edit put `publishableTiers` back here, on the argument that
 * hiding priced capacity hides it from the person most likely to buy it. That
 * argument was made and settled: a column carrying a price and a "not open yet"
 * line is a refusal wearing a price tag, it was the single loudest complaint
 * about this page, and it is what made a reader ask a question the page then
 * declined to answer. The capacity is still stated, once, in prose at the
 * bottom of the pricing page, where it costs nobody a decision. Change the
 * decision with the owner before changing this line.
 *
 * ## Two numbers, never four
 *
 * A yearly plan is quoted as a yearly amount. The headline is the charge for
 * the selected interval, and exactly one supporting line sits under it: on
 * yearly, that line is what the same plan costs month to month, which is the
 * only figure a reader needs in order to compare. Nothing here divides an
 * annual price by twelve, because $250 over twelve is $20.83 and a headline
 * price with cents in it is the presentation this page exists to avoid. The
 * discount is stated once more, as a badge on the control itself, and that is
 * the whole of it: two numbers and one badge.
 *
 * This module holds no prose. Every string arrives from the catalog through
 * `t`, and every amount is derived from the tier's own integer minor units.
 */
export interface TierColumnOptions {
  readonly t: Translator;
  /** Where the single primary action goes. Only the anchored tier gets one. */
  readonly ctaHref: string;
  readonly ctaLabel: string;
  /**
   * The deployment's environment. Defaulted so a Server Component caller does
   * not have to thread it, and injectable so a test can prove the gate opens
   * and closes rather than asserting today's configuration.
   */
  readonly env?: TierEnvironment;
}

/**
 * Shared lines the checklist renders at full strength.
 *
 * One, and it earns it: `includes.api` is the line that says an agent can drive
 * this over MCP, which is the strongest claim we can make and was, until now,
 * invisible on the price page. The project allowance is emphasized too, but it
 * is not in this list because it is not a shared line: it is the one number
 * that differs between tiers, built per column below.
 */
const EMPHASIZED_INCLUSION_KEYS: readonly MessageKey[] = ['billing.plan.includes.api'];

function money(t: Translator, minor: number, currency: string): string {
  return new Intl.NumberFormat(t.locale, {
    style: 'currency',
    currency,
    // Every price on the ladder is a whole dollar amount. If a fractional one
    // ever ships, this is the single place that has to learn about it, and the
    // headline numeral formats through the same options in `TierGrid`.
    maximumFractionDigits: 0,
  }).format(priceUnits(minor));
}

function featuresFor(t: Translator, tier: WebPlanTier): readonly TierFeature[] {
  const allowance: TierFeature = {
    id: 'allowance',
    text: t.format('billing.tier.projectAllowance', { count: tier.projectAllowance }),
    strong: true,
  };
  // Read from the tier module rather than restated here. A per-tier list would
  // be feature gating, which `features/billing/tiers.test.ts` and the billing
  // package both refuse, so every column gets the same lines.
  const shared = WEB_SHARED_INCLUSION_KEYS.map((key): TierFeature => ({
    id: key,
    text: t.format(key),
    strong: EMPHASIZED_INCLUSION_KEYS.includes(key),
  }));
  return [allowance, ...shared];
}

function intervalFaces(
  t: Translator,
  tier: WebPlanTier,
): { readonly month: TierIntervalFace; readonly year: TierIntervalFace } {
  return {
    month: {
      priceMinor: tier.monthlyPriceMinor,
      label: t.t('web.pricing.interval.perMonth'),
      support: t.t('web.pricing.interval.monthlySupport'),
    },
    year: {
      priceMinor: tier.annualPriceMinor,
      label: t.t('web.pricing.interval.perYear'),
      support: t.t('web.pricing.interval.yearlySupport', {
        amount: money(t, tier.monthlyPriceMinor, tier.currency),
      }),
    },
  };
}

export function tierColumns({
  t,
  ctaHref,
  ctaLabel,
  env = process.env,
}: TierColumnOptions): readonly TierGridColumn[] {
  // Every decided tier, because the ladder is the offer. An agency that would
  // pay for twenty projects never discovers that capacity exists if the page
  // only ever admits to three.
  //
  // This read from `purchasableTiers` for a day, which hid a tier until its
  // Polar products were configured. That looks like honesty and is closer to
  // the opposite: it deletes real, priced capacity from the page for the
  // reader most likely to buy it. Whether a tier can be checked out today is a
  // question about its button, not about whether the column exists.
  const tiers = publishableTiers();
  const buyable = new Set(purchasableTiers(env).map((tier) => tier.key));

  return tiers.map((tier: WebPlanTier, index: number): TierGridColumn => {
    // `?? null` because indexed access is checked: the guard below tests for
    // null, and an `undefined` slipping through would read as "base tier" and
    // silently print the wrong delta sentence.
    const previous = index === 0 ? null : (tiers[index - 1] ?? null);
    const anchored = tier.key === BASE_TIER_KEY;
    const faces = intervalFaces(t, tier);

    return {
      id: tier.key,
      name: t.t(tier.nameKey),
      tagline: t.t(tier.taglineKey),
      currency: tier.currency,
      month: faces.month,
      year: faces.year,
      features: featuresFor(t, tier),
      anchored,
      // A delta only where a delta carries information. The first column has
      // nothing to be a difference from, and its checklist already opens with
      // the allowance, so restating it in prose would be the same fact twice.
      ...(previous === null
        ? {}
        : {
            delta: t.t('web.pricing.tierGrid.stepDelta', {
              tier: t.t(previous.nameKey),
              added: tier.projectAllowance - previous.projectAllowance,
            }),
          }),
      // One primary action per page, on the anchored column. Every other column
      // that reaches this function is purchasable by construction, so there is
      // no "not on sale yet" state left for a column to render.
      // The action goes on the anchored column, and only while that column can
      // actually take money. A tier whose products are not configured keeps its
      // price and its checklist and says so plainly, which is a smaller claim
      // than a button that cannot charge.
      ...(anchored && buyable.has(tier.key) ? { cta: { href: ctaHref, label: ctaLabel } } : {}),
      ...(buyable.has(tier.key)
        ? {}
        : { unavailableNote: t.t('web.pricing.tierGrid.notOpenYet') }),
    };
  });
}

/**
 * The incentive that sits on the yearly option of the interval control.
 *
 * One badge or none. It says a whole number of free months, and only when every
 * column on the page agrees on the same whole number, which the current ladder
 * does because a year costs ten months everywhere. Anything else returns null
 * and the control carries no badge at all: a badge that has to say "up to", or
 * that has to name three different savings, has stopped being the
 * simplification it was added to be, and the plan card still states the
 * comparison in its supporting line either way.
 */
export function annualIntervalBadge({
  t,
  env = process.env,
}: {
  readonly t: Translator;
  readonly env?: TierEnvironment;
}): string | null {
  const months = purchasableTiers(env).map(freeMonthsEquivalent);
  const shared = months[0];
  if (shared === undefined || shared === null) {
    return null;
  }
  if (!months.every((count) => count === shared)) {
    return null;
  }
  return t.t('web.pricing.interval.freeMonths', { count: shared });
}
