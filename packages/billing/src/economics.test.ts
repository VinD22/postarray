import { describe, expect, it } from 'vitest';

import {
  BLENDED_MODEL_TIER,
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
  tierEconomics,
  tierMarginTable,
} from './economics';
import { MICRO_PER_UNIT } from './money';

function dollars(micro: number): number {
  return Math.round((micro / MICRO_PER_UNIT) * 100) / 100;
}

describe('variable cost per subscriber', () => {
  it('is $5.20 on the monthly plan', () => {
    const monthly = planEconomics('month', 1_000);
    expect(dollars(monthly.variableCostMicroPerMonth)).toBe(5.2);
    expect(dollars(monthly.polarFeeMicroPerMonth + monthly.cardFeeMicroPerMonth)).toBe(1.9);
  });

  it('is $4.51 on the annual plan, because the Polar flat fee is charged once a year', () => {
    const annual = planEconomics('year', 1_000);
    expect(dollars(annual.variableCostMicroPerMonth)).toBe(4.51);
    expect(dollars(annual.revenueMicroPerMonth)).toBe(20.83);
  });

  it('spreads the fixed platform floor across subscribers', () => {
    expect(dollars(planEconomics('month', 250).fixedCostMicroPerMonth)).toBe(4.6);
    expect(dollars(planEconomics('month', 500).fixedCostMicroPerMonth)).toBe(2.3);
    expect(dollars(planEconomics('month', 1_000).fixedCostMicroPerMonth)).toBe(1.15);
  });
});

describe('the 75% gross margin gate', () => {
  it('is met at the documented assumptions once the base is at scale', () => {
    // 2,000 rather than 1,000: at $25 the gate is reached at about 1,239
    // subscribers, so 1,000 is now below it. The gate itself did not move.
    const blended = blendedEconomics(2_000);
    expect(blended.blendedMarginBasisPoints).toBeGreaterThan(MARGIN_GATE_BASIS_POINTS);
    expect(blended.meetsMarginGate).toBe(true);
  });

  it('holds above 75% at every scale from the gate upwards', () => {
    for (const subscribers of [1_300, 2_000, 5_000, 10_000]) {
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
      250: 5_940,
      500: 6_917,
      670: 7_165,
      1_000: 7_405,
      1_239: 7_500,
      2_000: 7_650,
      5_000: 7_796,
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

/**
 * The larger tiers, reported separately rather than blended in. Blending them
 * would flatter every figure above with a tier mix nobody has measured yet.
 */
describe('the project capacity ladder', () => {
  it('measures the blended model on the base tier, so the gate stays a floor', () => {
    expect(BLENDED_MODEL_TIER).toBe('relay_standard');
    expect(dollars(tierEconomics('relay_standard', 'month', 1_000).revenueMicroPerMonth)).toBe(25);
  });

  it('recognises the monthly revenue each tier actually charges', () => {
    expect(dollars(tierEconomics('relay_growth', 'month', 1_000).revenueMicroPerMonth)).toBe(50);
    expect(dollars(tierEconomics('relay_studio', 'month', 1_000).revenueMicroPerMonth)).toBe(100);
    expect(dollars(tierEconomics('relay_growth', 'year', 1_000).revenueMicroPerMonth)).toBe(41.67);
    expect(dollars(tierEconomics('relay_studio', 'year', 1_000).revenueMicroPerMonth)).toBe(83.33);
  });

  it('improves margin as the ladder climbs, because capacity costs less than it sells for', () => {
    const rows = tierMarginTable('month', 1_000);
    expect(rows.map((row) => row.tierKey)).toEqual([
      'relay_standard',
      'relay_growth',
      'relay_studio',
    ]);
    for (let index = 1; index < rows.length; index += 1) {
      const previous = rows[index - 1];
      const current = rows[index];
      expect(previous).toBeDefined();
      expect(current).toBeDefined();
      if (previous === undefined || current === undefined) {
        continue;
      }
      expect(current.marginBasisPoints, current.tierKey).toBeGreaterThan(
        previous.marginBasisPoints,
      );
    }
  });

  it('clears the margin gate on the higher tiers at a scale the base tier does not', () => {
    // 500 subscribers is deliberately under the blended gate (see above).
    expect(blendedEconomics(500).meetsMarginGate).toBe(false);
    expect(tierEconomics('relay_growth', 'month', 500).marginBasisPoints).toBeGreaterThan(
      MARGIN_GATE_BASIS_POINTS,
    );
    expect(tierEconomics('relay_studio', 'month', 500).marginBasisPoints).toBeGreaterThan(
      MARGIN_GATE_BASIS_POINTS,
    );
  });

  it('charges the same variable cost per subscriber on every tier except the fees', () => {
    const standard = tierEconomics('relay_standard', 'month', 1_000);
    const studio = tierEconomics('relay_studio', 'month', 1_000);
    expect(studio.infrastructureMicroPerMonth).toBe(standard.infrastructureMicroPerMonth);
    expect(studio.supportMicroPerMonth).toBe(standard.supportMicroPerMonth);
    expect(studio.fixedCostMicroPerMonth).toBe(standard.fixedCostMicroPerMonth);
    // Only the percentage fees scale with the price.
    expect(studio.polarFeeMicroPerMonth).toBeGreaterThan(standard.polarFeeMicroPerMonth);
  });
});

describe('the referred cohort, reported separately', () => {
  it('reproduces the documented referred subscriber economics at 1,000 subscribers', () => {
    const cohort = referredCohortEconomics(1_000);
    expect(dollars(cohort.revenueMicroPerMonth)).toBe(25);
    expect(dollars(cohort.feesMicroPerMonth)).toBe(1.9);
    expect(dollars(cohort.operatingCostMicroPerMonth)).toBe(4.45);
    expect(dollars(cohort.commissionMicroPerMonth)).toBe(4.62);
    expect(dollars(cohort.grossProfitMicroPerMonth)).toBe(14.03);
    expect(cohort.marginBasisPoints).toBe(5_612);
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
