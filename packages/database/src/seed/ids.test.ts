import { ID_PREFIXES, isId } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { seedId } from './ids';

describe('seedId', () => {
  it('is deterministic and uses the production entity prefix', () => {
    const first = seedId('content_item:sample');
    expect(seedId('content_item:sample')).toBe(first);
    expect(isId(ID_PREFIXES.contentItem, first)).toBe(true);
  });

  it('keeps different labels distinct', () => {
    expect(seedId('user:owner')).not.toBe(seedId('user:editor'));
  });

  it('refuses an unregistered seed category', () => {
    expect(() => seedId('mystery:sample')).toThrowError('SEED_ID_KIND_UNREGISTERED:mystery');
  });
});
