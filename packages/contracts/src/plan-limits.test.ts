import { describe, expect, it } from 'vitest';

import { BASE_PROJECT_LIMIT, MAX_PROJECT_LIMIT, normalizeProjectLimit } from './plan-limits';

describe('project plan limits', () => {
  it('uses the three-project base allowance when no entitlement exists', () => {
    expect(normalizeProjectLimit(undefined)).toBe(BASE_PROJECT_LIMIT);
    expect(normalizeProjectLimit(null)).toBe(BASE_PROJECT_LIMIT);
  });

  it('accepts a twenty-project entitlement and bounds invalid grants', () => {
    expect(normalizeProjectLimit(20)).toBe(MAX_PROJECT_LIMIT);
    expect(normalizeProjectLimit(200)).toBe(MAX_PROJECT_LIMIT);
    expect(normalizeProjectLimit(0)).toBe(1);
    expect(normalizeProjectLimit(3.9)).toBe(3);
  });
});
