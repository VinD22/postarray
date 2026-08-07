import { ERROR_CODES } from '@relay/contracts';
import { describe, expect, it } from 'vitest';

import { ACTIVITY_NAMES } from './activities/types';
import { loadGateway, missingActivityNames } from './main';

describe('worker gateway bootstrap', () => {
  it('builds exactly one callable for every registered activity', async () => {
    const gateway = await loadGateway('built-in-prelaunch-gateway');

    expect(new Set(ACTIVITY_NAMES).size).toBe(ACTIVITY_NAMES.length);
    expect(missingActivityNames(gateway)).toEqual([]);
  });

  it('fails unavailable activities honestly without retrying', async () => {
    const gateway = await loadGateway('built-in-prelaunch-gateway');
    const publishTarget: unknown = Reflect.get(gateway, 'publishTarget');

    expect(publishTarget).toBeTypeOf('function');
    if (typeof publishTarget !== 'function') {
      return;
    }
    await expect(publishTarget({})).rejects.toMatchObject({
      code: ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED,
      retryable: false,
      messageKey: 'errors.capability_not_implemented',
    });
  });
});
