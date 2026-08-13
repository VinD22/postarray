import { describe, expect, it } from 'vitest';

import { ACTIVE_LOCALE_CODES } from '../locales';
import { formatLintResult, lintCatalog } from '../lint';
import { en, loadCatalog } from './index';
import { isBetaEnglishFallbackKey } from './beta-fallbacks';

describe('active catalogs', () => {
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
    },
    20_000,
  );
});
