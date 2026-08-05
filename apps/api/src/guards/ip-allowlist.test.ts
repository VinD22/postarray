import { describe, expect, it } from 'vitest';

import { ipInAllowlist, ipInCidr } from './ip-allowlist.js';

describe('ipInCidr', () => {
  it('matches inside an IPv4 block and rejects outside it', () => {
    expect(ipInCidr('198.51.100.7', '198.51.100.0/24')).toBe(true);
    expect(ipInCidr('198.51.101.7', '198.51.100.0/24')).toBe(false);
    expect(ipInCidr('198.51.100.7', '198.51.100.7/32')).toBe(true);
    expect(ipInCidr('198.51.100.8', '198.51.100.7/32')).toBe(false);
  });

  it('handles a prefix that does not fall on a byte boundary', () => {
    expect(ipInCidr('203.0.113.130', '203.0.113.128/25')).toBe(true);
    expect(ipInCidr('203.0.113.127', '203.0.113.128/25')).toBe(false);
  });

  it('treats an IPv4-mapped IPv6 address as its IPv4 form', () => {
    // A dual-stack proxy commonly presents this shape for a plain IPv4 client.
    expect(ipInCidr('::ffff:198.51.100.7', '198.51.100.0/24')).toBe(true);
  });

  it('matches inside an IPv6 block', () => {
    expect(ipInCidr('2001:db8::1', '2001:db8::/32')).toBe(true);
    expect(ipInCidr('2001:db9::1', '2001:db8::/32')).toBe(false);
  });

  it('rejects malformed input rather than defaulting to a match', () => {
    expect(ipInCidr('not-an-address', '198.51.100.0/24')).toBe(false);
    expect(ipInCidr('198.51.100.7', 'not-a-cidr')).toBe(false);
    expect(ipInCidr('999.1.1.1', '999.1.1.0/24')).toBe(false);
  });
});

describe('ipInAllowlist', () => {
  it('permits everything when the list is empty', () => {
    expect(ipInAllowlist('198.51.100.7', [])).toBe(true);
    expect(ipInAllowlist(undefined, [])).toBe(true);
  });

  it('refuses an unknown source when a list exists', () => {
    // Failing closed is the point: an unresolvable address is not "allowed".
    expect(ipInAllowlist(undefined, ['198.51.100.0/24'])).toBe(false);
    expect(ipInAllowlist('203.0.113.1', ['198.51.100.0/24'])).toBe(false);
  });

  it('accepts a match in any entry', () => {
    expect(ipInAllowlist('203.0.113.1', ['198.51.100.0/24', '203.0.113.0/24'])).toBe(true);
  });
});
