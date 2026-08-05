import { describe, expect, it } from 'vitest';

import { assertFetchable, isPrivateAddress } from './url-safety.js';

describe('isPrivateAddress', () => {
  it('refuses loopback, private, link local and carrier grade ranges', () => {
    for (const address of [
      '127.0.0.1',
      '10.1.2.3',
      '172.16.0.1',
      '172.31.255.255',
      '192.168.1.1',
      '169.254.169.254',
      '100.64.0.1',
      '0.0.0.0',
      '224.0.0.1',
      '::1',
      '::',
      'fe80::1',
      'fd00::1',
      '::ffff:127.0.0.1',
    ]) {
      expect(isPrivateAddress(address)).toBe(true);
    }
  });

  it('allows a public address', () => {
    expect(isPrivateAddress('93.184.216.34')).toBe(false);
    expect(isPrivateAddress('172.32.0.1')).toBe(false);
    expect(isPrivateAddress('2606:2800:220:1::1')).toBe(false);
  });

  it('treats anything that is not an address as unsafe', () => {
    expect(isPrivateAddress('not-an-address')).toBe(true);
  });
});

describe('assertFetchable', () => {
  it('refuses a non http scheme', async () => {
    await expect(assertFetchable('file:///etc/passwd')).rejects.toMatchObject({
      code: 'SSRF_BLOCKED',
    });
    await expect(assertFetchable('gopher://example.com')).rejects.toMatchObject({
      code: 'SSRF_BLOCKED',
    });
  });

  it('refuses credentials embedded in the URL', async () => {
    await expect(assertFetchable('https://user:pass@example.com/a')).rejects.toMatchObject({
      code: 'SSRF_BLOCKED',
    });
  });

  it('refuses a non standard port', async () => {
    await expect(assertFetchable('http://example.com:22/')).rejects.toMatchObject({
      code: 'SSRF_BLOCKED',
    });
  });

  it('refuses a literal private address without touching DNS', async () => {
    await expect(assertFetchable('http://127.0.0.1/admin')).rejects.toMatchObject({
      code: 'SSRF_BLOCKED',
    });
    await expect(assertFetchable('http://169.254.169.254/latest/meta-data')).rejects.toMatchObject(
      { code: 'SSRF_BLOCKED' },
    );
    await expect(assertFetchable('http://[::1]/')).rejects.toMatchObject({
      code: 'SSRF_BLOCKED',
    });
  });

  it('accepts a literal public address', async () => {
    const result = await assertFetchable('https://93.184.216.34/feed.xml');
    expect(result.addresses).toEqual(['93.184.216.34']);
  });

  it('refuses a malformed URL', async () => {
    await expect(assertFetchable('not a url')).rejects.toMatchObject({
      code: 'SSRF_BLOCKED',
    });
  });
});
