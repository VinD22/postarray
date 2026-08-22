/**
 * Engagement rate arithmetic.
 *
 * Three well known denominators, nothing else. This module does not fetch a
 * follower count, a reach figure or an impression count from anywhere: the
 * reader types the three numbers a platform's own dashboard already shows
 * them, and this file only divides. No benchmark, no "good" threshold and no
 * platform average ships here, because we do not have one and a guessed
 * benchmark would be exactly the kind of invented data this product refuses
 * to show.
 */

export type EngagementRateBasis = 'reach' | 'followers' | 'impressions';

export const ENGAGEMENT_RATE_BASES: readonly EngagementRateBasis[] = [
  'reach',
  'followers',
  'impressions',
];

export interface EngagementRateInput {
  readonly interactions: number;
  readonly reach: number;
  readonly followers: number;
  readonly impressions: number;
}

export interface EngagementRateResult {
  readonly basis: EngagementRateBasis;
  /** The denominator this basis actually divided by, for display. */
  readonly denominator: number;
  /** `interactions / denominator`, or null when the denominator is not positive. */
  readonly rate: number | null;
}

function denominatorFor(basis: EngagementRateBasis, input: EngagementRateInput): number {
  switch (basis) {
    case 'reach':
      return input.reach;
    case 'followers':
      return input.followers;
    case 'impressions':
      return input.impressions;
  }
}

/** One basis's rate. Null, never zero or Infinity, when the denominator is not positive. */
export function engagementRate(
  basis: EngagementRateBasis,
  input: EngagementRateInput,
): EngagementRateResult {
  const denominator = denominatorFor(basis, input);
  const valid =
    Number.isFinite(input.interactions) &&
    input.interactions >= 0 &&
    Number.isFinite(denominator) &&
    denominator > 0;
  return {
    basis,
    denominator,
    rate: valid ? input.interactions / denominator : null,
  };
}

/** Every basis at once, in `ENGAGEMENT_RATE_BASES` order. */
export function engagementRates(input: EngagementRateInput): readonly EngagementRateResult[] {
  return ENGAGEMENT_RATE_BASES.map((basis) => engagementRate(basis, input));
}
