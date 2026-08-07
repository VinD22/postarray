import { describe, expect, it } from 'vitest';

import { DATABASE_ERROR_CODES, DatabaseError } from './errors';
import { assertMigrationState } from './migrate';

const files = [
  { name: '0001_extensions.sql', checksum: 'sha-0001' },
  { name: '0002_roles.sql', checksum: 'sha-0002' },
] as const;

describe('migration state verification', () => {
  it('accepts an exact migration ledger', () => {
    expect(() =>
      assertMigrationState(
        files,
        new Map([
          ['0001_extensions.sql', 'sha-0001'],
          ['0002_roles.sql', 'sha-0002'],
        ]),
      ),
    ).not.toThrow();
  });

  it('rejects a missing migration', () => {
    expectMigrationFailure(new Map([['0001_extensions.sql', 'sha-0001']]), /has not been applied/);
  });

  it('rejects a checksum mismatch', () => {
    expectMigrationFailure(
      new Map([
        ['0001_extensions.sql', 'sha-0001'],
        ['0002_roles.sql', 'changed'],
      ]),
      /reviewed local checksum/,
    );
  });

  it('rejects a database migration absent from the release commit', () => {
    expectMigrationFailure(
      new Map([
        ['0001_extensions.sql', 'sha-0001'],
        ['0002_roles.sql', 'sha-0002'],
        ['0003_unknown.sql', 'sha-0003'],
      ]),
      /unknown migration/,
    );
  });
});

function expectMigrationFailure(ledger: ReadonlyMap<string, string>, message: RegExp): void {
  try {
    assertMigrationState(files, ledger);
    throw new Error('Expected migration verification to fail.');
  } catch (error) {
    expect(error).toBeInstanceOf(DatabaseError);
    expect(error).toMatchObject({ code: DATABASE_ERROR_CODES.migrationFailed });
    expect(error).toHaveProperty('message', expect.stringMatching(message));
  }
}
