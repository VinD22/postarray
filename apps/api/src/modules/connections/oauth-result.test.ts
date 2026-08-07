import { describe, expect, it } from 'vitest';
import { ERROR_CODES, RelayError } from '@relay/contracts';

import { oauthFailureReason } from './oauth-result';

describe('oauthFailureReason', () => {
  it('keeps capability limitations distinct from provider failures', () => {
    expect(oauthFailureReason(new RelayError(ERROR_CODES.CAPABILITY_NOT_IMPLEMENTED))).toBe(
      'not_implemented',
    );
    expect(oauthFailureReason(new RelayError(ERROR_CODES.CAPABILITY_UNSUPPORTED))).toBe(
      'unsupported',
    );
    expect(oauthFailureReason(new RelayError(ERROR_CODES.PROVIDER_UNAVAILABLE))).toBe('provider');
  });

  it('does not expose arbitrary thrown values', () => {
    expect(oauthFailureReason(new Error('provider payload'))).toBe('failed');
    expect(oauthFailureReason({ code: ERROR_CODES.INTERNAL })).toBe('failed');
  });
});
