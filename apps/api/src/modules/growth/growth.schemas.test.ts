import { newIdFor } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import {
  businessProfileInputSchema,
  confirmBusinessProfileSchema,
  growthPlanSummarySchema,
} from './growth.schemas';

describe('Growth Advisor transport schemas', () => {
  it('accepts the complete human-authored intake without requiring optional guesses', () => {
    const result = businessProfileInputSchema.safeParse({
      brandId: newIdFor('brand'),
      productName: 'Example product',
      siteUrl: '',
      description: 'A description written by the user.',
      category: '',
      contentLocales: ['en'],
      objective: 'Increase qualified trials.',
      conversionEvent: 'Trial signup',
      existingChannels: [newIdFor('connection')],
      proofAssets: ['Customer-approved case study'],
      weeklyCapacityHours: 4,
      prohibitedClaims: ['Guaranteed results'],
      prohibitedTopics: ['Private customer data'],
    });

    expect(result.success).toBe(true);
  });

  it('keeps corrections bound to named assumptions', () => {
    expect(
      confirmBusinessProfileSchema.safeParse({
        confirmedAssumptionIds: ['assumption_1'],
        corrections: { assumption_1: 'A sentence confirmed by the user.' },
      }).success,
    ).toBe(true);
  });

  it('represents missing plan-derived counts as unavailable', () => {
    expect(
      growthPlanSummarySchema.safeParse({
        planId: null,
        version: null,
        approvedAt: null,
        currentWeek: null,
        totalWeeks: null,
        undraftedBriefCount: null,
        profileComplete: false,
      }).success,
    ).toBe(true);
  });
});
