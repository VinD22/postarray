import { describe, expect, it } from 'vitest';

import { containsSecret, sanitizeHeaders, sanitizeProviderPayload, sanitizeText } from './sanitize';

describe('sanitizeText', () => {
  it('removes a bearer token echoed back by a provider', () => {
    const output = sanitizeText('Invalid credentials: Bearer AAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    expect(output).not.toContain('AAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    expect(output).toContain('[redacted]');
  });

  it('removes a JSON web token', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.dBjftJeZ4CVPmB92K27uhbUJU1p1r_wW1g';
    expect(sanitizeText(`token=${jwt}`)).not.toContain(jwt);
  });

  it('removes a caller supplied secret whatever its shape', () => {
    const secret = 'hunter2-hunter2';
    expect(sanitizeText(`the password is ${secret}`, { knownSecrets: [secret] })).not.toContain(
      secret,
    );
  });

  it('keeps the query parameter name so the shape stays readable', () => {
    const output = sanitizeText('https://example.invalid/cb?access_token=shortish&state=abc');
    expect(output).toContain('access_token=');
    expect(output).not.toContain('shortish');
  });

  it('truncates a very long string', () => {
    const output = sanitizeText('a'.repeat(2000), { maxStringLength: 64 });
    expect(output.length).toBeLessThanOrEqual(67);
  });
});

describe('sanitizeProviderPayload', () => {
  it('redacts secret looking keys at every depth', () => {
    const output = sanitizeProviderPayload({
      error: { message: 'nope', access_token: 'abc123', nested: { refresh_token: 'def456' } },
    });
    const serialized = JSON.stringify(output);
    expect(serialized).not.toContain('abc123');
    expect(serialized).not.toContain('def456');
    expect(serialized).toContain('nope');
  });

  it('wraps a plain string body', () => {
    expect(sanitizeProviderPayload('service unavailable')).toEqual({ raw: 'service unavailable' });
  });

  it('returns an empty object for an absent body', () => {
    expect(sanitizeProviderPayload(undefined)).toEqual({});
    expect(sanitizeProviderPayload(null)).toEqual({});
  });

  it('bounds array width', () => {
    const output = sanitizeProviderPayload({ items: new Array(100).fill('x') });
    expect((output['items'] as unknown[]).length).toBe(25);
  });
});

describe('sanitizeHeaders', () => {
  it('drops authorization and cookie headers entirely', () => {
    const output = sanitizeHeaders({
      authorization: 'Bearer secret-value-here',
      cookie: 'session=abc',
      'content-type': 'application/json',
      'x-rate-limit-remaining': '4',
    });
    expect(output['authorization']).toBeUndefined();
    expect(output['cookie']).toBeUndefined();
    expect(output['content-type']).toBe('application/json');
    expect(output['x-rate-limit-remaining']).toBe('4');
  });

  it('drops anything not on the allowlist', () => {
    const output = sanitizeHeaders({ 'x-internal-debug': 'value' });
    expect(Object.keys(output)).toHaveLength(0);
  });
});

describe('containsSecret', () => {
  it('is the assertion tests use to prove a redaction worked', () => {
    expect(containsSecret('a b c', 'b')).toBe(true);
    expect(containsSecret('a b c', 'z')).toBe(false);
  });
});
