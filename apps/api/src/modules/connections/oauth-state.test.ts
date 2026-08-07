import { describe, expect, it } from 'vitest';

import { stateFromAuthorizationUrl } from './oauth-state';

describe('stateFromAuthorizationUrl', () => {
  it('returns the provider URL state without generating a replacement', () => {
    expect(
      stateFromAuthorizationUrl(
        'https://provider.example/authorize?state=state-value-123456&client_id=client',
      ),
    ).toBe('state-value-123456');
  });

  it('fails closed when a provider URL has no usable state', () => {
    expect(() => stateFromAuthorizationUrl('https://provider.example/authorize')).toThrowError(
      expect.objectContaining({ code: 'INTERNAL' }),
    );
    expect(() => stateFromAuthorizationUrl('not-a-url')).toThrowError(
      expect.objectContaining({ code: 'INTERNAL' }),
    );
  });
});
