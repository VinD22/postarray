import { z } from 'zod';

/** Capacity identifiers shared by checkout transports and the billing service. */
export const PLAN_TIER_KEYS = ['relay_standard', 'relay_growth', 'relay_studio'] as const;
export const planTierKeySchema = z.enum(PLAN_TIER_KEYS);
export type PlanTierKey = z.infer<typeof planTierKeySchema>;
