import { z } from 'zod';

/**
 * The two billing intervals.
 *
 * They live in their own module because the tier table, the price presentation
 * and checkout all need them, and a shared leaf keeps those three from forming
 * an import cycle.
 */

export const BILLING_INTERVALS = ['month', 'year'] as const;
export const billingIntervalSchema = z.enum(BILLING_INTERVALS);
export type BillingInterval = z.infer<typeof billingIntervalSchema>;

/** The interval a Polar recurring interval string maps to. */
export function normalizeInterval(value: string): BillingInterval | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'month' || normalized === 'monthly') {
    return 'month';
  }
  if (normalized === 'year' || normalized === 'yearly' || normalized === 'annual') {
    return 'year';
  }
  return null;
}
