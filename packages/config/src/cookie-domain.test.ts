import { describe, expect, it } from 'vitest';

import { resolveSessionCookieDomain } from './cookie-domain';

describe('resolveSessionCookieDomain', () => {
  it('scopes to the web host when the API is its subdomain', () => {
    expect(
      resolveSessionCookieDomain({
        explicit: undefined,
        appUrl: 'https://postarray.com',
        apiUrl: 'https://api.postarray.com',
      }),
    ).toBe('postarray.com');
  });

  it('stays host-only when web and API share a host', () => {
    expect(
      resolveSessionCookieDomain({
        explicit: undefined,
        appUrl: 'http://localhost:3000',
        apiUrl: 'http://localhost:3001',
      }),
    ).toBeUndefined();
  });

  it('stays host-only for unrelated hosts, which no cookie can span', () => {
    expect(
      resolveSessionCookieDomain({
        explicit: undefined,
        appUrl: 'https://postarray.com',
        apiUrl: 'https://api.example.net',
      }),
    ).toBeUndefined();
  });

  it('does not treat a lookalike suffix as a subdomain', () => {
    expect(
      resolveSessionCookieDomain({
        explicit: undefined,
        appUrl: 'https://postarray.com',
        apiUrl: 'https://evilpostarray.com',
      }),
    ).toBeUndefined();
  });

  it('never derives a domain from an IP address', () => {
    expect(
      resolveSessionCookieDomain({
        explicit: undefined,
        appUrl: 'http://10.0.0.1',
        apiUrl: 'http://api.10.0.0.1',
      }),
    ).toBeUndefined();
  });

  it('prefers the explicit setting', () => {
    expect(
      resolveSessionCookieDomain({
        explicit: 'example.com',
        appUrl: 'https://app.example.com',
        apiUrl: 'https://api.example.com',
      }),
    ).toBe('example.com');
  });

  it('is host-only when either URL is missing', () => {
    expect(
      resolveSessionCookieDomain({
        explicit: undefined,
        appUrl: undefined,
        apiUrl: 'https://api.postarray.com',
      }),
    ).toBeUndefined();
  });
});
