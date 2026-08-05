import { describe, expect, it } from 'vitest';

import {
  MICRO_PER_MINOR,
  applyBasisPoints,
  formatMicro,
  formatMoneyMinor,
  microRemainder,
  microToMinor,
  minorToMicro,
  money,
  sumMoney,
  unitsToMicro,
} from './money.js';

describe('money', () => {
  it('refuses a non integer minor amount', () => {
    expect(() => money(12.5)).toThrow(RangeError);
    expect(money(2_900)).toEqual({ currency: 'USD', amountMinor: 2_900 });
  });

  it('refuses to add across currencies', () => {
    expect(() => sumMoney([money(100, 'USD'), money(100, 'EUR')])).toThrow(RangeError);
  });

  it('applies basis points with integer arithmetic', () => {
    expect(applyBasisPoints(2_900, 2_000)).toBe(580);
    expect(applyBasisPoints(2_687, 2_000)).toBe(537);
    expect(applyBasisPoints(-2_900, 2_000)).toBe(-580);
  });
});

describe('micro-dollars', () => {
  it('represents an X post create price that cents cannot', () => {
    expect(unitsToMicro(0.015)).toBe(15_000);
    expect(unitsToMicro(0.2)).toBe(200_000);
    expect(MICRO_PER_MINOR).toBe(10_000);
  });

  it('rounds down to cents so a thousand operations never gain us a cent', () => {
    // 1,000 plain post creates at $0.015 is exactly $15.00.
    const exact = 1_000 * 15_000;
    expect(microToMinor(exact)).toBe(1_500);
    expect(microRemainder(exact)).toBe(0);

    // 999 creates is $14.985, which is 1,498 cents plus a carried remainder.
    const inexact = 999 * 15_000;
    expect(microToMinor(inexact)).toBe(1_498);
    expect(microRemainder(inexact)).toBe(5_000);
    // Charging the customer 1,499 cents would be a rounding gain to us.
    expect(microToMinor(inexact) * MICRO_PER_MINOR).toBeLessThanOrEqual(inexact);
  });

  it('never converts a partial cent upwards, at any accumulation size', () => {
    for (let operations = 1; operations <= 1_000; operations += 7) {
      const micro = operations * 15_000;
      expect(microToMinor(micro) * MICRO_PER_MINOR).toBeLessThanOrEqual(micro);
    }
  });

  it('round trips minor units through micro', () => {
    expect(minorToMicro(2_900)).toBe(29_000_000);
    expect(microToMinor(minorToMicro(2_900))).toBe(2_900);
  });
});

describe('formatting', () => {
  it('trims zero cents only when asked', () => {
    expect(formatMoneyMinor(2_900)).toBe('$29.00');
    expect(formatMoneyMinor(2_900, 'USD', { trimZeroFraction: true })).toBe('$29');
    expect(formatMoneyMinor(2_950, 'USD', { trimZeroFraction: true })).toBe('$29.50');
  });

  it('formats per-operation prices at the precision X publishes them', () => {
    expect(formatMicro(15_000)).toBe('$0.015');
    expect(formatMicro(200_000)).toBe('$0.200');
    expect(formatMicro(230_000)).toBe('$0.230');
  });
});
