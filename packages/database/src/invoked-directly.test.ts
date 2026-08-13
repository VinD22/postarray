import { pathToFileURL } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { isProcessEntryPoint } from './invoked-directly';

/**
 * The guard that decides whether `seed`, `reset` and `migrate` run themselves.
 *
 * The bundled case is the one that matters. `@relay/database` exports `reset`,
 * `reset` imports `seed`, and every module inside a bundle shares the bundle's
 * `import.meta.url`. The previous guard compared only that URL to `argv[1]`, so
 * the first run of the compiled API bundle started seeding the database before
 * it had finished reading its environment.
 */

const originalArgv = [...process.argv];

afterEach(() => {
  process.argv = [...originalArgv];
});

function runAs(entry: string): void {
  process.argv = [originalArgv[0] ?? 'node', entry];
}

describe('isProcessEntryPoint', () => {
  it('is true when the module is the file node was given', () => {
    runAs('/repo/packages/database/src/seed.ts');
    expect(
      isProcessEntryPoint(pathToFileURL('/repo/packages/database/src/seed.ts').href, 'seed'),
    ).toBe(true);
  });

  it('accepts the compiled and esm file names of the same script', () => {
    for (const extension of ['js', 'mjs']) {
      runAs(`/repo/packages/database/dist/migrate.${extension}`);
      expect(
        isProcessEntryPoint(
          pathToFileURL(`/repo/packages/database/dist/migrate.${extension}`).href,
          'migrate',
        ),
      ).toBe(true);
    }
  });

  it('is false inside an application bundle that merely imports the module', () => {
    // Both sides resolve to the bundle, which is exactly the shape that made the
    // API seed its own database on boot.
    runAs('/app/apps/api/dist/main.mjs');
    expect(isProcessEntryPoint(pathToFileURL('/app/apps/api/dist/main.mjs').href, 'seed')).toBe(
      false,
    );
  });

  it('is false when another script is the entry point', () => {
    runAs('/repo/packages/database/src/migrate.ts');
    expect(
      isProcessEntryPoint(pathToFileURL('/repo/packages/database/src/seed.ts').href, 'seed'),
    ).toBe(false);
  });

  it('is false when node was given no script at all', () => {
    process.argv = [originalArgv[0] ?? 'node'];
    expect(
      isProcessEntryPoint(pathToFileURL('/repo/packages/database/src/seed.ts').href, 'seed'),
    ).toBe(false);
  });
});
