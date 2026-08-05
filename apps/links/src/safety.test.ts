import { describe, expect, it } from 'vitest';

import { RelayError } from '@relay/contracts';

import {
  assertDestinationSafe,
  checkDestination,
  isPrivateIpv4,
  isPrivateIpv6,
  isPubliclyRoutableHost,
} from './safety.js';

const SELF = { selfHosts: ['rl.example', 'go.acme.example'] };

describe('checkDestination scheme allowlist', () => {
  it('accepts https and http', () => {
    expect(checkDestination('https://example.com/a').safe).toBe(true);
    expect(checkDestination('http://example.com/a').safe).toBe(true);
  });

  it('rejects executable and data schemes', () => {
    for (const url of [
      'javascript:alert(1)',
      'data:text/html;base64,PHNjcmlwdD4=',
      'file:///etc/passwd',
      'blob:https://example.com/abc',
      'ftp://example.com/x',
      'vbscript:msgbox(1)',
    ]) {
      const decision = checkDestination(url);
      expect(decision.safe, url).toBe(false);
    }
  });

  it('honours a narrowed scheme allowlist', () => {
    const decision = checkDestination('http://example.com', { allowedSchemes: ['https:'] });
    expect(decision.safe).toBe(false);
    expect(decision.reasons).toContain('SCHEME_NOT_ALLOWED');
  });
});

describe('checkDestination network targets', () => {
  it('rejects loopback', () => {
    expect(checkDestination('http://localhost/x').reasons).toContain('LOOPBACK_TARGET');
    expect(checkDestination('http://127.0.0.1/x').reasons).toContain('LOOPBACK_TARGET');
    expect(checkDestination('http://[::1]/x').reasons).toContain('LOOPBACK_TARGET');
  });

  it('rejects private and link-local ranges', () => {
    for (const host of [
      '10.0.0.5',
      '172.16.4.4',
      '172.31.255.254',
      '192.168.1.1',
      '169.254.169.254',
      '100.64.0.1',
      '0.0.0.0',
      '198.18.0.1',
      '[fd00::1]',
      '[fe80::1]',
      '[::ffff:10.0.0.1]',
    ]) {
      const decision = checkDestination(`http://${host}/x`);
      expect(decision.safe, host).toBe(false);
      expect(decision.reasons, host).toContain('PRIVATE_NETWORK_TARGET');
    }
  });

  it('rejects cloud metadata and internal suffixes', () => {
    expect(checkDestination('http://metadata.google.internal/computeMetadata').safe).toBe(false);
    expect(checkDestination('http://build.internal/x').safe).toBe(false);
    expect(checkDestination('http://printer.local/x').safe).toBe(false);
    expect(checkDestination('http://abc.onion/x').safe).toBe(false);
  });

  it('rejects single-label hosts because they are network dependent', () => {
    expect(checkDestination('http://intranet/x').safe).toBe(false);
    expect(isPubliclyRoutableHost('intranet')).toBe(false);
  });

  it('accepts a public IP literal', () => {
    expect(checkDestination('https://93.184.216.34/x').safe).toBe(true);
  });
});

describe('checkDestination phishing and open redirect shapes', () => {
  it('rejects credentials embedded in the authority', () => {
    const decision = checkDestination('https://accounts.example.com@attacker.test/login');
    expect(decision.safe).toBe(false);
    expect(decision.reasons).toContain('CREDENTIALS_IN_URL');
  });

  it('rejects a destination pointing back at the redirect service', () => {
    const decision = checkDestination('https://rl.example/abcd', SELF);
    expect(decision.reasons).toContain('LINK_SHORTENER_LOOP');
  });

  it('rejects a nested redirect to a private target', () => {
    const decision = checkDestination('https://example.com/go?url=http://169.254.169.254/latest');
    expect(decision.safe).toBe(false);
    expect(decision.reasons).toContain('NESTED_REDIRECT_UNSAFE');
  });

  it('rejects an unsafe nested redirect hidden in the fragment', () => {
    // A `javascript:` fragment is not an absolute http URL, so it is inert here.
    const decision = checkDestination('https://example.com/go#next=javascript:alert(1)');
    expect(decision.safe).toBe(true);
    const chained = checkDestination('https://example.com/go#https://user:pw@evil.test/');
    expect(chained.safe).toBe(false);
  });

  it('allows a nested redirect that is itself safe', () => {
    const decision = checkDestination('https://example.com/go?url=https://docs.example.org/page');
    expect(decision.safe).toBe(true);
  });

  it('bounds redirect chain depth', () => {
    const inner = 'https://d.example/?url=https%3A%2F%2Fe.example%2F';
    const level3 = `https://c.example/?url=${encodeURIComponent(inner)}`;
    const level2 = `https://b.example/?url=${encodeURIComponent(level3)}`;
    const level1 = `https://a.example/?url=${encodeURIComponent(level2)}`;
    const decision = checkDestination(level1, { maxRedirectDepth: 2, additionalPublicSuffixes: ['.example'] });
    expect(decision.safe).toBe(false);
    expect(decision.reasons).toContain('REDIRECT_DEPTH_EXCEEDED');
  });
});

describe('checkDestination ports and size', () => {
  it('rejects an unexpected port', () => {
    expect(checkDestination('https://example.com:8080/x').reasons).toContain('PORT_NOT_ALLOWED');
  });

  it('accepts an explicitly allowed port', () => {
    expect(checkDestination('https://example.com:8443/x', { allowedPorts: [8443] }).safe).toBe(true);
  });

  it('rejects an oversized URL', () => {
    const url = `https://example.com/${'a'.repeat(4000)}`;
    expect(checkDestination(url).reasons).toContain('URL_TOO_LONG');
  });

  it('rejects garbage', () => {
    expect(checkDestination('not a url').reasons).toContain('MALFORMED_URL');
    expect(checkDestination('').reasons).toContain('MALFORMED_URL');
  });
});

describe('assertDestinationSafe', () => {
  it('returns the normalized URL when safe', () => {
    expect(assertDestinationSafe('https://example.com')).toBe('https://example.com/');
  });

  it('throws SSRF_BLOCKED without echoing the destination', () => {
    try {
      assertDestinationSafe('http://10.0.0.1/admin');
      expect.unreachable('should have thrown');
    } catch (error) {
      expect(RelayError.is(error)).toBe(true);
      const relayError = error as RelayError;
      expect(relayError.code).toBe('SSRF_BLOCKED');
      expect(JSON.stringify(relayError.details)).not.toContain('10.0.0.1');
      expect(relayError.details['reasons']).toEqual(['PRIVATE_NETWORK_TARGET']);
    }
  });
});

describe('ip helpers', () => {
  it('classifies ipv4', () => {
    expect(isPrivateIpv4('10.1.2.3')).toBe(true);
    expect(isPrivateIpv4('8.8.8.8')).toBe(false);
    expect(isPrivateIpv4('999.1.1.1')).toBe(false);
  });

  it('classifies ipv6', () => {
    expect(isPrivateIpv6('::1')).toBe(true);
    expect(isPrivateIpv6('fd12::1')).toBe(true);
    expect(isPrivateIpv6('2606:4700::1111')).toBe(false);
    expect(isPrivateIpv6('example.com')).toBe(false);
  });
});
