import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import { assertProjectSlotAvailable } from './brands';

describe('project capacity', () => {
  it('allows creation below the workspace entitlement', () => {
    expect(() => assertProjectSlotAvailable(2, 3)).not.toThrow();
    expect(() => assertProjectSlotAvailable(19, 20)).not.toThrow();
  });

  it('returns a stable quota error at the limit', () => {
    try {
      assertProjectSlotAvailable(3, 3);
      throw new Error('expected the project capacity check to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(RelayError);
      expect((error as RelayError).code).toBe('QUOTA_EXCEEDED');
      expect((error as RelayError).messageKey).toBe('errors.project_limit_reached');
      expect((error as RelayError).details).toEqual({ used: 3, limit: 3 });
    }
  });
});
