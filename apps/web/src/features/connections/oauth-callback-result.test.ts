import { describe, expect, it } from 'vitest';

import { parseOAuthCallbackResult } from './oauth-callback-result';

describe('parseOAuthCallbackResult', () => {
  it('accepts a successful callback and its safe account count', () => {
    expect(
      parseOAuthCallbackResult(new URLSearchParams('status=connected&provider=linkedin&count=2')),
    ).toEqual({ status: 'connected', provider: 'linkedin', count: 2 });
  });

  it('accepts a user cancellation without exposing provider error text', () => {
    expect(
      parseOAuthCallbackResult(new URLSearchParams('status=declined&provider=instagram')),
    ).toEqual({ status: 'declined', provider: 'instagram' });
  });

  it('keeps capability states distinct and defaults unknown reasons safely', () => {
    expect(
      parseOAuthCallbackResult(
        new URLSearchParams('status=failed&provider=x&reason=not_implemented'),
      ),
    ).toEqual({ status: 'failed', provider: 'x', reason: 'not_implemented' });
    expect(
      parseOAuthCallbackResult(
        new URLSearchParams('status=failed&provider=x&reason=provider-payload'),
      ),
    ).toEqual({ status: 'failed', provider: 'x', reason: 'failed' });
  });

  it('rejects unknown status or provider and invalid counts', () => {
    expect(
      parseOAuthCallbackResult(new URLSearchParams('status=connected&provider=unknown')),
    ).toEqual(null);
    expect(parseOAuthCallbackResult(new URLSearchParams('status=maybe&provider=x'))).toEqual(null);
    expect(
      parseOAuthCallbackResult(new URLSearchParams('status=connected&provider=x&count=-1')),
    ).toEqual({ status: 'connected', provider: 'x' });
  });
});
