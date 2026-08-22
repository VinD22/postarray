import { describe, expect, it } from 'vitest';

import { billingGateway } from './gateway';

/**
 * A gateway never invents a route.
 *
 * A capability the backend has not built refuses with
 * `CAPABILITY_NOT_IMPLEMENTED` rather than calling a URL that does not exist
 * and surfacing a 404 as if the user had done something wrong.
 *
 * Service accounts used to be listed here. They are now backed by
 * `GET /v1/service-accounts`, so their absence from this list is the point: the
 * list shrinks as capabilities land, and a row is removed only when the route
 * behind it is real.
 */
describe('settings capability truth', () => {
  it.each([['referrals', () => billingGateway.referral()]])(
    '%s fails as not implemented without probing an imagined route',
    async (_name, call) => {
      await expect(call()).rejects.toMatchObject({
        code: 'CAPABILITY_NOT_IMPLEMENTED',
        status: 501,
        retryable: false,
      });
    },
  );
});
