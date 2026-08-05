import { describe, expect, it } from 'vitest';

import { checkRedirectUri } from './redirect-uris';

describe('checkRedirectUri', () => {
  it('accepts an exact https callback', () => {
    expect(checkRedirectUri('https://acme.example/oauth/callback')).toBeNull();
  });

  it('rejects a wildcard, which is the whole point of an exact allowlist', () => {
    expect(checkRedirectUri('https://*.acme.example/callback')).toBe('has-wildcard');
  });

  it('rejects plain http on a public host', () => {
    expect(checkRedirectUri('http://acme.example/callback')).toBe('not-https');
  });

  it('allows http on loopback so a local development client can be registered', () => {
    expect(checkRedirectUri('http://localhost:3000/callback')).toBeNull();
    expect(checkRedirectUri('http://127.0.0.1:3000/callback')).toBeNull();
  });

  it('rejects loopback http when the caller does not allow it', () => {
    expect(checkRedirectUri('http://localhost:3000/callback', false)).toBe('not-https');
  });

  it('rejects a query string, which cannot be matched exactly', () => {
    expect(checkRedirectUri('https://acme.example/cb?tenant=1')).toBe('has-query');
  });

  it('rejects a fragment and embedded credentials', () => {
    expect(checkRedirectUri('https://acme.example/cb#token')).toBe('has-fragment');
    expect(checkRedirectUri('https://user:pass@acme.example/cb')).toBe('has-credentials');
  });

  it('rejects anything that is not a URL at all', () => {
    expect(checkRedirectUri('acme.example/callback')).toBe('not-a-url');
  });
});
