import { describe, expect, it } from 'vitest';

import { ACTIVE_LOCALE_CODES } from '../locales';
import { en, loadCatalog } from './index';
import { isBetaEnglishFallbackKey } from './beta-fallbacks';
import { auditCatalog, isCatalogAuditLaunchReady } from './catalog-audit';

describe('catalog audit', () => {
  it('separates explicit beta fallback debt from undeclared omissions', () => {
    const audit = auditCatalog(
      'de',
      { 'nav.home': 'Start' },
      { 'nav.home': 'Home', 'billing.plan': 'Standard', 'state.draft': 'Draft' },
      (key) => key.startsWith('billing.'),
    );
    expect(audit.totalKeys).toBe(3);
    expect(audit.presentKeys).toBe(1);
    expect(audit.allowedFallbackKeys).toEqual(['billing.plan']);
    expect(audit.undeclaredMissingKeys).toEqual(['state.draft']);
    expect(isCatalogAuditLaunchReady(audit)).toBe(false);
  });

  it('proves every active catalog omission is explicitly declared fallback debt', async () => {
    for (const locale of ACTIVE_LOCALE_CODES) {
      const catalog = await loadCatalog(locale);
      const audit = auditCatalog(locale, catalog, en, (key) =>
        isBetaEnglishFallbackKey(key, locale),
      );
      expect(audit.undeclaredMissingKeys, `${locale} has undeclared omissions`).toEqual([]);
      if (locale === 'en') {
        expect(isCatalogAuditLaunchReady(audit)).toBe(true);
      } else {
        expect(audit.allowedFallbackKeys.length, `${locale} fallback debt`).toBeGreaterThan(0);
        expect(isCatalogAuditLaunchReady(audit)).toBe(false);
      }
    }
  }, 60_000);
});

