import { describe, expect, it } from 'vitest';

import { isBetaEnglishFallbackKey } from './beta-fallbacks';
import { en, loadCatalog } from './index';
import { ACTIVE_LOCALE_CODES } from '../locales';

const CAPABILITY_TRUTH_KEYS = [
  'web.home.example.instagram.variant',
  'web.product.step.source.body',
  'web.product.step.compose.body',
  'web.creators.lede',
  'web.creators.job.adapt.body',
  'web.developers.safety.body',
  'web.developers.safety.killSwitch',
] as const;

describe('launch truth', () => {
  it('keeps the founder plan and media boundaries in controlling English copy', () => {
    expect(en['billing.plan.includes.channels']).toContain('10');
    expect(en['billing.plan.includes.members']).toContain('5 teammates');
    expect(en['web.product.step.source.body']).toContain('not built yet');
    expect(en['web.product.step.compose.body']).toContain('not built yet');
    expect(en['web.developers.safety.body']).toContain('not built yet');
    expect(en['web.developers.safety.killSwitch']).toContain('not built yet');
    expect(en['web.legal.ai.features.feedback']).toContain('not available in prelaunch');
    expect(en['mediaLib.retention.body']).toContain('30 days after upload');
    expect(en['mediaLib.retention.limits']).toContain('20 MiB');
    expect(en['mediaLib.retention.limits']).toContain('500 MiB');
  });

  it(
    'forces changed capability claims through the reviewed beta fallback',
    async () => {
      for (const key of CAPABILITY_TRUTH_KEYS) {
        expect(isBetaEnglishFallbackKey(key), key).toBe(true);
      }

      const locales = ACTIVE_LOCALE_CODES.filter((code) => code !== 'en');
      const catalogs = await Promise.all(
        locales.map(async (locale) => ({ locale, catalog: await loadCatalog(locale) })),
      );
      for (const { locale, catalog } of catalogs) {
        for (const key of CAPABILITY_TRUTH_KEYS) {
          expect(catalog[key], `${locale}:${key}`).toBeUndefined();
        }
      }
    },
    20_000,
  );
});
