import { describe, expect, it } from 'vitest';

import { agentsGateway, billingGateway, dataGateway, webhooksGateway } from './gateway';

describe('settings capability truth', () => {
  it.each([
    ['service accounts', () => agentsGateway.list()],
    ['referrals', () => billingGateway.referral()],
    ['workspace exports', () => dataGateway.exportJob()],
    ['webhook secret rotation', () => webhooksGateway.rotateSecret('wh_ep_test')],
  ])('%s fails as not implemented without probing an imagined route', async (_name, call) => {
    await expect(call()).rejects.toMatchObject({
      code: 'CAPABILITY_NOT_IMPLEMENTED',
      status: 501,
      retryable: false,
    });
  });
});
