import { beforeAll, describe, expect, it } from 'vitest';

import { ACTIVE_LOCALE_CODES } from '../locales';
import { formatLintResult, lintCatalog } from '../lint';
import { en, loadCatalog } from './index';
import { isBetaEnglishFallbackKey } from './beta-fallbacks';
import { inspectCatalogFamilies, isCatalogFamilyComplete } from './catalog-coverage';

describe('active catalogs', () => {
  // The first case used to pay for loading every catalog module and warming
  // the linter, and timed out under a full parallel run. Pay it once here.
  beforeAll(async () => {
    await Promise.all(ACTIVE_LOCALE_CODES.map((locale) => loadCatalog(locale)));
    lintCatalog(en, { locale: 'en', reference: en });
  }, 120_000);

  it.each(ACTIVE_LOCALE_CODES)(
    'loads and lints %s',
    async (locale) => {
      const catalog = await loadCatalog(locale);
      const result = lintCatalog(catalog, { locale, reference: en });
      if (!result.ok) {
        throw new Error(formatLintResult(result));
      }

      expect(result.findings).toEqual([]);

      const missingNonB5Keys = (Object.keys(en) as (keyof typeof en)[]).filter(
        (key) => !isBetaEnglishFallbackKey(key, locale) && catalog[key] === undefined,
      );
      expect(missingNonB5Keys).toEqual([]);

      const familyCoverage = inspectCatalogFamilies(en, catalog, (key) =>
        isBetaEnglishFallbackKey(key, locale),
      );
      expect(familyCoverage.map((family) => family.prefix)).toEqual([
        'a11y.',
        'email.',
        'digest.',
        'state.',
      ]);
      for (const family of familyCoverage) {
        expect(family.referenceKeys.length, `${locale}:${family.prefix}`).toBeGreaterThan(0);
        expect(
          isCatalogFamilyComplete(family),
          `${locale}:${family.prefix} has an undeclared omission: ${family.missingKeys.join(', ')}`,
        ).toBe(true);
      }
    },
    20_000,
  );
});
