import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import {
  type DnsResolver,
  assertSafeUrl,
  classifyIpAddress,
  isPublicIpAddress,
  safeFetch,
} from './ssrf';

const publicResolver: DnsResolver = async () => [{ address: '93.184.216.34', family: 4 }];
const privateResolver: DnsResolver = async () => [{ address: '10.0.0.5', family: 4 }];
const mixedResolver: DnsResolver = async () => [
  { address: '93.184.216.34', family: 4 },
  { address: '127.0.0.1', family: 4 },
];

async function reasonOf(promise: Promise<unknown>): Promise<string> {
  try {
    await promise;
    return 'no_error';
  } catch (error) {
    if (error instanceof RelayError) {
      return String(error.details['reason']);
    }
    return 'unexpected_error';
  }
}

describe('classifyIpAddress', () => {
  it('recognises every private and reserved range we refuse', () => {
    expect(classifyIpAddress('127.0.0.1')).toBe('loopback');
    expect(classifyIpAddress('10.1.2.3')).toBe('private');
    expect(classifyIpAddress('172.16.0.1')).toBe('private');
    expect(classifyIpAddress('172.32.0.1')).toBe('public');
    expect(classifyIpAddress('192.168.1.1')).toBe('private');
    expect(classifyIpAddress('169.254.1.1')).toBe('link_local');
    expect(classifyIpAddress('169.254.169.254')).toBe('metadata');
    expect(classifyIpAddress('100.64.0.1')).toBe('cgnat');
    expect(classifyIpAddress('224.0.0.1')).toBe('multicast');
    expect(classifyIpAddress('240.0.0.1')).toBe('reserved');
    expect(classifyIpAddress('0.0.0.0')).toBe('unspecified');
    expect(classifyIpAddress('93.184.216.34')).toBe('public');
  });

  it('recognises IPv6 equivalents', () => {
    expect(classifyIpAddress('::1')).toBe('loopback');
    expect(classifyIpAddress('fe80::1')).toBe('link_local');
    expect(classifyIpAddress('fc00::1')).toBe('private');
    expect(classifyIpAddress('fd12:3456::1')).toBe('private');
    expect(classifyIpAddress('ff02::1')).toBe('multicast');
    expect(classifyIpAddress('::')).toBe('unspecified');
    expect(classifyIpAddress('::ffff:127.0.0.1')).toBe('loopback');
    expect(classifyIpAddress('2606:2800:220:1:248:1893:25c8:1946')).toBe('public');
  });

  it('answers the simple question the callers ask', () => {
    expect(isPublicIpAddress('8.8.8.8')).toBe(true);
    expect(isPublicIpAddress('10.0.0.1')).toBe(false);
  });
});

describe('assertSafeUrl', () => {
  it('accepts a public https URL', async () => {
    const checked = await assertSafeUrl('https://example.invalid/feed.xml', {
      resolver: publicResolver,
    });
    expect(checked.hostname).toBe('example.invalid');
    expect(checked.port).toBe(443);
    expect(checked.addresses).toHaveLength(1);
  });

  it('refuses a non http scheme', async () => {
    expect(await reasonOf(assertSafeUrl('file:///etc/passwd'))).toBe('scheme_not_allowed');
    expect(await reasonOf(assertSafeUrl('gopher://example.invalid'))).toBe('scheme_not_allowed');
    expect(await reasonOf(assertSafeUrl('javascript:alert(1)'))).toBe('scheme_not_allowed');
  });

  it('refuses credentials in the URL', async () => {
    expect(
      await reasonOf(
        assertSafeUrl('https://user:pass@example.invalid/', { resolver: publicResolver }),
      ),
    ).toBe('credentials_in_url');
  });

  it('refuses a port outside the allowlist', async () => {
    expect(
      await reasonOf(assertSafeUrl('https://example.invalid:22/', { resolver: publicResolver })),
    ).toBe('port_not_allowed');
  });

  it('refuses a hostname that resolves privately', async () => {
    expect(
      await reasonOf(assertSafeUrl('https://internal.invalid/', { resolver: privateResolver })),
    ).toBe('address_not_public');
  });

  it('refuses when any resolved address is private, not merely the first', async () => {
    expect(
      await reasonOf(assertSafeUrl('https://rebind.invalid/', { resolver: mixedResolver })),
    ).toBe('address_not_public');
  });

  it('refuses a literal metadata address without a DNS lookup', async () => {
    expect(await reasonOf(assertSafeUrl('http://169.254.169.254/latest/meta-data/'))).toBe(
      'address_not_public',
    );
  });

  it('refuses when DNS returns nothing', async () => {
    expect(
      await reasonOf(assertSafeUrl('https://void.invalid/', { resolver: async () => [] })),
    ).toBe('dns_resolution_failed');
  });
});

function textResponse(body: string, init: ResponseInit = {}): Response {
  return new Response(body, { status: 200, headers: { 'content-type': 'text/plain' }, ...init });
}

describe('safeFetch', () => {
  it('fetches a public URL and reports the resolved addresses', async () => {
    const result = await safeFetch('https://example.invalid/feed.xml', {
      resolver: publicResolver,
      fetchImpl: async () => textResponse('<rss/>'),
    });
    expect(result.status).toBe(200);
    expect(new TextDecoder().decode(result.body)).toBe('<rss/>');
    expect(result.resolvedAddresses).toEqual(['93.184.216.34']);
  });

  it('re-checks the target on every redirect', async () => {
    let hop = 0;
    const result = await reasonOf(
      safeFetch('https://example.invalid/start', {
        resolver: async (hostname) =>
          hostname === 'example.invalid'
            ? [{ address: '93.184.216.34', family: 4 }]
            : [{ address: '10.0.0.9', family: 4 }],
        fetchImpl: async () => {
          hop += 1;
          return new Response(null, {
            status: 302,
            headers: { location: 'https://internal.invalid/secret' },
          });
        },
      }),
    );
    expect(result).toBe('address_not_public');
    expect(hop).toBe(1);
  });

  it('stops after three redirects', async () => {
    const result = await reasonOf(
      safeFetch('https://example.invalid/a', {
        resolver: publicResolver,
        fetchImpl: async () =>
          new Response(null, {
            status: 302,
            headers: { location: 'https://example.invalid/loop' },
          }),
      }),
    );
    expect(result).toBe('too_many_redirects');
  });

  it('refuses a redirect with no location', async () => {
    const result = await reasonOf(
      safeFetch('https://example.invalid/a', {
        resolver: publicResolver,
        fetchImpl: async () => new Response(null, { status: 302 }),
      }),
    );
    expect(result).toBe('redirect_missing_location');
  });

  it('enforces the declared size cap', async () => {
    const result = await reasonOf(
      safeFetch('https://example.invalid/big', {
        resolver: publicResolver,
        maxBytes: 8,
        fetchImpl: async () =>
          textResponse('x'.repeat(64), { headers: { 'content-length': '64' } }),
      }),
    );
    expect(result).toBe('response_too_large');
  });

  it('enforces the streamed size cap when no length is declared', async () => {
    const result = await reasonOf(
      safeFetch('https://example.invalid/big', {
        resolver: publicResolver,
        maxBytes: 4,
        fetchImpl: async () => textResponse('x'.repeat(64)),
      }),
    );
    expect(result).toBe('response_too_large');
  });

  it('never forwards a cookie or an authorization header', async () => {
    let sent: Record<string, string> = {};
    await safeFetch('https://example.invalid/x', {
      resolver: publicResolver,
      headers: { cookie: 'a=b', authorization: 'Bearer nope', 'user-agent': 'relay' },
      fetchImpl: async (_url, init) => {
        sent = (init?.headers ?? {}) as Record<string, string>;
        return textResponse('ok');
      },
    });
    expect(sent['cookie']).toBeUndefined();
    expect(sent['authorization']).toBeUndefined();
    expect(sent['user-agent']).toBe('relay');
  });
});
