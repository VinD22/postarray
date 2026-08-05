import { describe, expect, it } from 'vitest';

import {
  DOCUMENTED_ASSUMPTIONS,
  FORBIDDEN_MARGIN_LEVERS,
  MARGIN_GATE_BASIS_POINTS,
  MARGIN_GATE_SUBSCRIBERS,
  MARGIN_LEVERS,
  REFERRED_COHORT_MARGIN_FLOOR_BASIS_POINTS,
  blendedEconomics,
  marginTable,
  planEconomics,
  referredCohortEconomics,
  subscribersToMeetMarginGate,
} from './economics.js';
import { MICRO_PER_UNIT } from './money.js';

function dollars(micro: number): number {
  return Math.round((micro / MICRO_PER_UNIT) * 100) / 100;
}

describe('variable cost per subscriber', () => {
  it('is $5.42 on the monthly plan', () => {
    const monthly = planEconomics('month', 1_000);
    expect(dollars(monthly.variableCostMicroPerMonth)).toBe(5.42);
    expect(dollars(monthly.polarFeeMicroPerMonth + monthly.cardFeeMicroPerMonth)).toBe(2.12);
  });

  it('is $4.74 on the annual plan, because the Polar flat fee is charged once a year', () => {
    const annual = planEconomics('year', 1_000);
    expect(dollars(annual.variableCostMicroPerMonth)).toBe(4.74);
    expect(dollars(annual.revenueMicroPerMonth)).toBe(25);
  });

  it('spreads the fixed platform floor across subscribers', () => {
    expect(dollars(planEconomics('month', 250).fixedCostMicroPerMonth)).toBe(4.6);
    expect(dollars(planEconomics('month', 500).fixedCostMicroPerMonth)).toBe(2.3);
    expect(dollars(planEconomics('month', 1_000).fixedCostMicroPerMonth)).toBe(1.15);
  });
});

describe('the 75% gross margin gate', () => {
  it('is met at the documented assumptions once the base is at scale', () => {
    const blended = blendedEconomics(1_000);
    expect(blended.blendedMarginBasisPoints).toBeGreaterThan(MARGIN_GATE_BASIS_POINTS);
    expect(blended.meetsMarginGate).toBe(true);
  });

  it('holds above 75% at every scale from the gate upwards', () => {
    for (const subscribers of [700, 1_000, 2_000, 5_000, 10_000]) {
      const blended = blendedEconomics(subscribers);
      expect(blended.blendedMarginBasisPoints, `${subscribers} subscribers`).toBeGreaterThan(
        MARGIN_GATE_BASIS_POINTS,
      );
    }
  });

  it('is reached at approximately the documented subscriber count', () => {
    const found = subscribersToMeetMarginGate();
    expect(found).not.toBeNull();
    if (found !== null) {
      expect(Math.abs(found - MARGIN_GATE_SUBSCRIBERS)).toBeLessThanOrEqual(20);
    }
  });

  it('is deliberately not met below that, which is a pre-scale investment', () => {
    expect(blendedEconomics(250).meetsMarginGate).toBe(false);
    expect(blendedEconomics(500).meetsMarginGate).toBe(false);
  });

  it('reproduces the published margin table within a point', () => {
    const expected: Readonly<Record<number, number>> = {
      250: 6_480,
      500: 7_290,
      670: 7_500,
      1_000: 7_710,
      2_000: 7_920,
      5_000: 8_040,
    };
    for (const row of marginTable()) {
      const target = expected[row.subscribers];
      expect(target, `${row.subscribers}`).toBeTypeOf('number');
      if (target !== undefined) {
        expect(
          Math.abs(row.blendedMarginBasisPoints - target),
          `${row.subscribers} subscribers`,
        ).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('the referred cohort, reported separately', () => {
  it('reproduces the documented referred subscriber economics at 1,000 subscribers', () => {
    const cohort = referredCohortEconomics(1_000);
    expect(dollars(cohort.revenueMicroPerMonth)).toBe(29);
    expect(dollars(cohort.feesMicroPerMonth)).toBe(2.12);
    expect(dollars(cohort.operatingCostMicroPerMonth)).toBe(4.45);
    expect(dollars(cohort.commissionMicroPerMonth)).toBe(5.38);
    expect(dollars(cohort.grossProfitMicroPerMonth)).toBe(17.05);
    expect(cohort.marginBasisPoints).toBe(5_880);
  });

  it('stays above the 55% floor', () => {
    const cohort = referredCohortEconomics(1_000);
    expect(cohort.marginBasisPoints).toBeGreaterThan(REFERRED_COHORT_MARGIN_FLOOR_BASIS_POINTS);
    expect(cohort.meetsFloor).toBe(true);
    expect(REFERRED_COHORT_MARGIN_FLOOR_BASIS_POINTS).toBe(5_500);
  });
});

describe('assumptions and levers', () => {
  it('records when the assumptions were compiled and when they must be reviewed', () => {
    expect(DOCUMENTED_ASSUMPTIONS.assumptionsVerifiedAt).toBe('2026-08-04');
    expect(DOCUMENTED_ASSUMPTIONS.reviewBy).toBe('2026-12-20');
  });

  it('models a 65/35 monthly to annual mix', () => {
    expect(DOCUMENTED_ASSUMPTIONS.monthlyMixBasisPoints).toBe(6_500);
  });

  it('lists the margin levers in the order we would pull them', () => {
    expect(MARGIN_LEVERS[0]).toBe('move_polar_to_a_paid_tier');
    expect(MARGIN_LEVERS.at(-1)).toBe('adjust_the_disclosed_fair_use_boundary');
  });

  it('excludes a cheaper feature-gated tier from the levers', () => {
    expect(FORBIDDEN_MARGIN_LEVERS).toContain('create_a_cheaper_feature_gated_tier');
    expect(FORBIDDEN_MARGIN_LEVERS).toContain('sell_media_generation_credits');
    for (const forbidden of FORBIDDEN_MARGIN_LEVERS) {
      expect(MARGIN_LEVERS).not.toContain(forbidden);
    }
  });

  it('responds to a worse Polar fee without changing the model shape', () => {
    const worse = blendedEconomics(1_000, {
      ...DOCUMENTED_ASSUMPTIONS,
      polarFeeBasisPoints: 800,
    });
    expect(worse.blendedMarginBasisPoints).toBeLessThan(
      blendedEconomics(1_000).blendedMarginBasisPoints,
    );
  });
});
