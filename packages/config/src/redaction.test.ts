import { describe, expect, it } from 'vitest';

import {
  REDACTION_MASK,
  isRedactedKey,
  normalizeKeyName,
  redact,
  redactRecord,
  redactString,
} from './redaction';

const FAKE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0In0.c2lnbmF0dXJlLXBsYWNlaG9sZGVy';

describe('normalizeKeyName', () => {
  it('folds camel case, kebab case and dots into snake case', () => {
    expect(normalizeKeyName('apiKey')).toBe('api_key');
    expect(normalizeKeyName('X-Api-Key')).toBe('x_api_key');
    expect(normalizeKeyName('provider.accessToken')).toBe('provider_access_token');
  });
});

describe('isRedactedKey', () => {
  it('matches the documented secret key patterns', () => {
    for (const key of [
      'token',
      'access_token',
      'accessToken',
      'refreshToken',
      'client_secret',
      'apiKey',
      'API_KEY',
      'password',
      'Authorization',
      'cookie',
      'credentials',
      'bearer',
      'jwt',
      'privateKey',
      'x-api-key',
    ]) {
      expect(isRedactedKey(key), key).toBe(true);
    }
  });

  it('leaves ordinary fields alone', () => {
    for (const key of [
      'workspaceId',
      'monkey',
      'keyboardShortcut',
      'provider',
      'status',
      'correlationId',
      'authorName',
    ]) {
      expect(isRedactedKey(key), key).toBe(false);
    }
  });

  it('allows the safe metadata that merely looks secret', () => {
    expect(isRedactedKey('key_version')).toBe(false);
    expect(isRedactedKey('keyVersion')).toBe(false);
    expect(isRedactedKey('idempotencyKey')).toBe(false);
    expect(isRedactedKey('tokenType')).toBe(false);
    expect(isRedactedKey('kmsKeyId')).toBe(false);
  });
});

describe('redactString', () => {
  it('masks a JWT anywhere in the text', () => {
    const masked = redactString(`provider replied with ${FAKE_JWT} and failed`);
    expect(masked).not.toContain('eyJhbGciOi');
    expect(masked).toContain(REDACTION_MASK);
    expect(masked).toContain('provider replied with');
  });

  it('masks a bearer credential', () => {
    expect(redactString('Authorization: Bearer abc123def456ghi')).toContain(
      `Bearer ${REDACTION_MASK}`,
    );
  });

  it('masks an assignment that names a secret', () => {
    const masked = redactString('client_secret=super-secret-value&scope=read');
    expect(masked).not.toContain('super-secret-value');
    expect(masked).toContain('scope=read');
  });

  it('masks credentials embedded in a url', () => {
    const masked = redactString('postgresql://postgres:hunter2hunter2@localhost:5432/relay');
    expect(masked).not.toContain('hunter2hunter2');
    expect(masked).toContain('postgres:');
  });

  it('masks a token in a query string', () => {
    const masked = redactString('https://api.example.test/cb?access_token=abc123&state=ok');
    expect(masked).not.toContain('abc123');
    expect(masked).toContain('access_token=');
  });

  it('leaves ordinary text untouched', () => {
    expect(redactString('published 3 posts to 2 accounts')).toBe('published 3 posts to 2 accounts');
  });
});

describe('redact', () => {
  it('masks matching keys at any depth', () => {
    const result = redact({
      workspaceId: 'ws_1',
      connection: {
        provider: 'x',
        credentials: { accessToken: 'abc', refreshToken: 'def' },
      },
    }) as Record<string, unknown>;

    expect(result['workspaceId']).toBe('ws_1');
    const connection = result['connection'] as Record<string, unknown>;
    expect(connection['provider']).toBe('x');
    expect(connection['credentials']).toBe(REDACTION_MASK);
  });

  it('does not mutate the input', () => {
    const input = { accessToken: 'abc', nested: { password: 'hunter2' } };
    redact(input);
    expect(input.accessToken).toBe('abc');
    expect(input.nested.password).toBe('hunter2');
  });

  it('walks arrays, sets and maps', () => {
    const result = redact({
      items: [{ token: 'a' }, { provider: 'x' }],
      tags: new Set(['a', 'b']),
      headers: new Map([
        ['authorization', 'Bearer abcdefghijklmno'],
        ['content-type', 'application/json'],
      ]),
    }) as Record<string, unknown>;

    const items = result['items'] as Record<string, unknown>[];
    expect(items[0]?.['token']).toBe(REDACTION_MASK);
    expect(items[1]?.['provider']).toBe('x');
    expect(result['tags']).toEqual(['a', 'b']);
    const headers = result['headers'] as Record<string, unknown>;
    expect(headers['authorization']).toBe(REDACTION_MASK);
    expect(headers['content-type']).toBe('application/json');
  });

  it('survives a cycle', () => {
    const node: Record<string, unknown> = { name: 'root' };
    node['self'] = node;
    const result = redact(node) as Record<string, unknown>;
    expect(result['self']).toBe('[circular]');
  });

  it('stops at the configured depth', () => {
    const deep = { a: { b: { c: { d: 'value' } } } };
    const result = redact(deep, { maxDepth: 2 }) as Record<string, unknown>;
    const a = result['a'] as Record<string, unknown>;
    const b = a['b'] as Record<string, unknown>;
    expect(b['c']).toBe('[depth exceeded]');
  });

  it('serializes errors without leaking a token', () => {
    const error = Object.assign(new Error(`failed with ${FAKE_JWT}`), {
      accessToken: 'abc',
      status: 401,
    });
    const result = redact(error) as Record<string, unknown>;
    expect(result['name']).toBe('Error');
    expect(String(result['message'])).not.toContain('eyJhbGciOi');
    expect(result['accessToken']).toBe(REDACTION_MASK);
    expect(result['status']).toBe(401);
  });

  it('masks binary buffers rather than dumping them', () => {
    const result = redact({ blob: Buffer.from('secret bytes') }) as Record<string, unknown>;
    expect(result['blob']).toBe(REDACTION_MASK);
  });

  it('normalizes dates and drops functions', () => {
    const result = redact({
      at: new Date('2026-08-04T10:00:00.000Z'),
      run: () => undefined,
    }) as Record<string, unknown>;
    expect(result['at']).toBe('2026-08-04T10:00:00.000Z');
    expect(result['run']).toBeUndefined();
  });

  it('honours extra key patterns from the call site', () => {
    const result = redact(
      { prompt: 'private user content' },
      { extraKeys: [/^prompt$/] },
    ) as Record<string, unknown>;
    expect(result['prompt']).toBe(REDACTION_MASK);
  });
});

describe('redactRecord', () => {
  it('always returns a record', () => {
    expect(redactRecord({ token: 'a', provider: 'x' })).toEqual({
      token: REDACTION_MASK,
      provider: 'x',
    });
  });
});
