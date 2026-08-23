import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { PUBLIC_LOCALE_CODES } from '../locales';
import { isBetaEnglishFallbackKey } from './beta-fallbacks';
import { en } from './en/index';
import {
  BETA_FALLBACK_CATALOG_MODULES,
  BETA_FALLBACK_CATALOG_MODULE_PREFIXES,
  checkCatalogModuleParity,
  findUnallowedMissingCatalogModules,
  isCatalogModuleParityClean,
} from './module-parity';

const messagesDirectory = dirname(fileURLToPath(import.meta.url));

function sourceModules(locale: string): readonly string[] {
  return readdirSync(join(messagesDirectory, locale))
    .filter((file) => file.endsWith('.ts'))
    .filter((file) => file !== 'index.ts' && !file.endsWith('.test.ts'))
    // Helper modules are allowed to support catalog assembly but are not
    // message namespaces and therefore do not belong in the parity manifest.
    .filter((file) => file !== 'catalog-helpers.ts')
    .map((file) => file.slice(0, -3));
}

function importedModules(locale: string): readonly string[] {
  const source = readFileSync(join(messagesDirectory, locale, 'index.ts'), 'utf8');
  return [...source.matchAll(/from ['"]\.\/([^'"]+)['"]/g)]
    .map((match) => match[1])
    .filter((module): module is string => module !== undefined);
}

const englishModules = sourceModules('en');

describe('catalog module parity', () => {
  it('imports every English source module into the English catalog', () => {
    const parity = checkCatalogModuleParity(englishModules, importedModules('en'));
    expect(isCatalogModuleParityClean(parity), JSON.stringify(parity)).toBe(true);
  });

  it.each(PUBLIC_LOCALE_CODES)(
    'has no orphan source modules or imports for %s',
    (locale) => {
      expect(statSync(join(messagesDirectory, locale)).isDirectory()).toBe(true);
      const parity = checkCatalogModuleParity(sourceModules(locale), importedModules(locale));
      expect(parity.unexpected, `${locale} imports a missing module`).toEqual([]);
      expect(parity.missing, `${locale} contains an unassembled source module`).toEqual([]);
    },
  );

  it.each(PUBLIC_LOCALE_CODES)(
    'keeps missing modules explicit for %s',
    (locale) => {
      const parity = checkCatalogModuleParity(englishModules, importedModules(locale));
      expect(
        findUnallowedMissingCatalogModules(parity.missing),
        `${locale} is missing a module without a beta fallback allowance`,
      ).toEqual([]);
      for (const module of parity.missing) {
        const prefixes =
          BETA_FALLBACK_CATALOG_MODULE_PREFIXES[
            module as keyof typeof BETA_FALLBACK_CATALOG_MODULE_PREFIXES
          ];
        expect(prefixes, `${locale}:${module} needs fallback namespace metadata`).toBeDefined();
        if (prefixes === undefined) {
          continue;
        }
        const hasFallbackKey = Object.keys(en).some(
          (key) =>
            prefixes.some((prefix) => key.startsWith(prefix)) &&
            isBetaEnglishFallbackKey(key, locale),
        );
        expect(hasFallbackKey, `${locale}:${module} has no declared fallback key`).toBe(true);
      }
      // Keep this assertion close to the locale loop so removing the last
      // beta fallback module forces the temporary allowlist to be revisited.
      expect(BETA_FALLBACK_CATALOG_MODULES).toContain('digest');
    },
  );
});
