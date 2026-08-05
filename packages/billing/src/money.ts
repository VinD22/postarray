import type { Money } from '@relay/contracts';

/**
 * Money in this package is always integer minor units plus an ISO 4217 code.
 * Provider usage accumulates in integer **micro-dollars** because a single X
 * post create costs $0.015, which is not representable in cents. Micro-dollars
 * are converted to cents once, at invoice time, and the conversion always
 * rounds in the customer's favour so "at cost" stays literally true.
 */

export const USD = 'USD';

/** One dollar is 1,000,000 micro-dollars and 100 cents. */
export const MICRO_PER_UNIT = 1_000_000;
export const MINOR_PER_UNIT = 100;
export const MICRO_PER_MINOR = MICRO_PER_UNIT / MINOR_PER_UNIT;

export function money(amountMinor: number, currency: string = USD): Money {
  if (!Number.isSafeInteger(amountMinor)) {
    throw new RangeError('MONEY_MUST_BE_INTEGER_MINOR_UNITS');
  }
  return { currency, amountMinor };
}

export function addMoney(left: Money, right: Money): Money {
  if (left.currency !== right.currency) {
    throw new RangeError('MONEY_CURRENCY_MISMATCH');
  }
  return { currency: left.currency, amountMinor: left.amountMinor + right.amountMinor };
}

export function negateMoney(value: Money): Money {
  return { currency: value.currency, amountMinor: -value.amountMinor };
}

export function sumMoney(values: readonly Money[], currency: string = USD): Money {
  let total = 0;
  for (const value of values) {
    if (value.currency !== currency) {
      throw new RangeError('MONEY_CURRENCY_MISMATCH');
    }
    total += value.amountMinor;
  }
  return { currency, amountMinor: total };
}

/**
 * Apply a rate expressed in basis points (1 bp = 0.01%). Integer arithmetic all
 * the way through, rounded half away from zero, so a 20% commission on 2,687
 * minor units is never 537.4000000001.
 */
export function applyBasisPoints(amountMinor: number, basisPoints: number): number {
  const scaled = amountMinor * basisPoints;
  const sign = scaled < 0 ? -1 : 1;
  return sign * Math.round(Math.abs(scaled) / 10_000);
}

/** Convert whole units to minor units. `29` becomes `2900`. */
export function unitsToMinor(units: number): number {
  return Math.round(units * MINOR_PER_UNIT);
}

/** Convert whole units to micro-units. `0.015` becomes `15000`. */
export function unitsToMicro(units: number): number {
  return Math.round(units * MICRO_PER_UNIT);
}

/**
 * Convert accumulated micro-dollars to whole cents.
 *
 * Rounds **down**. Over a thousand operations that leaves fractions of a cent
 * on the table for us rather than charging the customer for a cent they did not
 * incur, which is what "at cost, no rounding in our favour" means in code.
 */
export function microToMinor(micro: number): number {
  if (!Number.isSafeInteger(micro)) {
    throw new RangeError('MICRO_MUST_BE_INTEGER');
  }
  return Math.floor(micro / MICRO_PER_MINOR);
}

/** The remainder that did not reach a whole cent, carried to the next invoice. */
export function microRemainder(micro: number): number {
  return micro - microToMinor(micro) * MICRO_PER_MINOR;
}

export function minorToMicro(minor: number): number {
  return minor * MICRO_PER_MINOR;
}

export interface FormatMoneyOptions {
  /** Drop `.00` so `$29.00` renders as `$29`. Used by the plan headline. */
  readonly trimZeroFraction?: boolean;
  readonly locale?: string;
}

/**
 * Format minor units for display. This is number formatting, not translated
 * prose: the surrounding sentence always comes from an `@relay/i18n` key and
 * receives the formatted amount as a parameter.
 */
export function formatMoneyMinor(
  amountMinor: number,
  currency: string = USD,
  options: FormatMoneyOptions = {},
): string {
  const locale = options.locale ?? 'en-US';
  const trim = options.trimZeroFraction === true && amountMinor % MINOR_PER_UNIT === 0;
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: trim ? 0 : 2,
    maximumFractionDigits: trim ? 0 : 2,
  });
  return formatter.format(amountMinor / MINOR_PER_UNIT);
}

/**
 * Format micro-dollars at three decimal places, which is the precision X
 * publishes its per-operation prices at.
 */
export function formatMicro(micro: number, currency: string = USD, locale = 'en-US'): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return formatter.format(micro / MICRO_PER_UNIT);
}
