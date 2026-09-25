import { describe, expect, it } from 'vitest';

import { isLocalDatabaseUrl } from './database-locality';

describe('isLocalDatabaseUrl', () => {
  it('accepts the loopback hosts and the compose service names', () => {
    expect(isLocalDatabaseUrl('postgresql://postgres@localhost:5432/relay')).toBe(true);
    expect(isLocalDatabaseUrl('postgresql://postgres@127.0.0.1:5432/relay')).toBe(true);
    expect(isLocalDatabaseUrl('postgresql://postgres@postgres:5432/relay')).toBe(true);
  });

  it('rejects every Neon host', () => {
    expect(
      isLocalDatabaseUrl(
        'postgresql://u:p@ep-cool-name-123.us-east-2.aws.neon.tech/relay?sslmode=require',
      ),
    ).toBe(false);
    expect(
      isLocalDatabaseUrl('postgresql://u:p@ep-cool-name-123-pooler.us-east-2.aws.neon.tech/relay'),
    ).toBe(false);
  });

  it('rejects a loopback host that insists on TLS, which is usually a tunnel', () => {
    expect(isLocalDatabaseUrl('postgresql://postgres@localhost:5432/relay?sslmode=require')).toBe(
      false,
    );
  });

  it('treats no database as local, because nothing is configured yet', () => {
    expect(isLocalDatabaseUrl(undefined)).toBe(true);
    expect(isLocalDatabaseUrl('')).toBe(true);
  });

  it('refuses to vouch for an unparseable url', () => {
    expect(isLocalDatabaseUrl('not a url')).toBe(false);
  });
});
