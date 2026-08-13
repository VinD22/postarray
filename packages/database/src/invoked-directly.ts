import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * True when this module is the process entry point rather than an import.
 *
 * `path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)` was the
 * test used by `seed.ts`, `reset.ts` and `migrate.ts`, and it is correct only
 * while the code runs from source. Inside a bundle every module shares the
 * bundle's `import.meta.url`, so the comparison degrades into "was this process
 * started from the bundle", which is true for the server too.
 *
 * That is not hypothetical. `@relay/database`'s public API exports `reset`,
 * `reset.ts` imports `seed.ts`, and the first run of the compiled API bundle
 * logged `db.seed.start` before it had finished validating its environment. An
 * API that seeds its own database on boot is the worst class of bug this
 * repository can ship, and it only became reachable once the apps were bundled.
 *
 * Checking the file name as well closes it: a bundle is `main.mjs` and can never
 * be mistaken for `seed.ts`.
 */
export function isProcessEntryPoint(moduleUrl: string, expectedBaseName: string): boolean {
  const entry = process.argv[1];
  if (entry === undefined) {
    return false;
  }

  const modulePath = fileURLToPath(moduleUrl);
  if (path.resolve(entry) !== modulePath) {
    return false;
  }

  const actual = path.basename(modulePath);
  return (
    actual === `${expectedBaseName}.ts` ||
    actual === `${expectedBaseName}.js` ||
    actual === `${expectedBaseName}.mjs`
  );
}
