import { describe, expect, it } from 'vitest';

import { agentsGateway, billingGateway } from './gateway';

describe('settings capability truth', () => {
  it.each([
    ['service accounts', () => agentsGateway.list()],
    ['referrals', () => billingGateway.referral()],
  ])('%s fails as not implemented without probing an imagined route', async (_name, call) => {
    await expect(call()).rejects.toMatchObject({
      code: 'CAPABILITY_NOT_IMPLEMENTED',
      status: 501,
      retryable: false,
    });
  });
});
