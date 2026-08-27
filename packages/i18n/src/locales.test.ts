import { describe, expect, it } from 'vitest';

import {
  ACTIVE_LOCALES,
  ALL_LOCALES,
  DEFAULT_LOCALE,
  PLANNED_LOCALES,
  PUBLIC_LOCALE_CODES,
  RETIRED_LOCALE_CODES,
  RETIRED_LOCALES,
  canonicalizeLocaleTag,
  getCardinalPluralCategories,
  getDirection,
  getLocale,
  isActiveLocale,
  isRetiredLocale,
  isRtl,
  parseAcceptLanguage,
  requireLocale,
  resolveLocale,
} from './locales';

const VALID_PLURAL_CATEGORIES = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);

describe('locale registry', () => {
  it('covers the thirty planned languages including regional variants', () => {
    const codes = ALL_LOCALES.map((locale) => locale.bcp47);
    for (const expected of [
      'en',
      'es',
      'es-419',
      'pt-BR',
      'pt-PT',
      'fr',
      'de',
      'it',
      'nl',
      'pl',
      'cs',
      'sv',
      'nb',
      'da',
      'fi',
      'tr',
      'ru',
      'uk',
      'ar',
      'he',
      'hi',
      'bn',
      'ur',
      'id',
      'ms',
      'vi',
      'th',
      'fil',
      'zh-Hans',
      'zh-Hant',
      'ja',
      'ko',
    ]) {
      expect(codes).toContain(expected);
    }
  });

  it('has unique tags', () => {
    const codes = ALL_LOCALES.map((locale) => locale.bcp47.toLowerCase());
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('exposes exactly the twenty-five launch locales', () => {
    expect(ACTIVE_LOCALES.map((locale) => locale.bcp47).sort()).toEqual(
      [...PUBLIC_LOCALE_CODES].sort(),
    );
    expect(PUBLIC_LOCALE_CODES).toHaveLength(25);
    expect(new Set(PUBLIC_LOCALE_CODES).size).toBe(25);
    expect([...RETIRED_LOCALE_CODES].sort()).toEqual([]);
    expect(RETIRED_LOCALES.every((locale) => locale.status === 'retired')).toBe(true);
    expect(ACTIVE_LOCALES.map((locale) => locale.bcp47)).toEqual([
      'en',
      'es',
      'es-419',
      'pt-BR',
      'fr',
      'de',
      'it',
      'nl',
      'pl',
      'cs',
      'sv',
      'tr',
      'ru',
      'uk',
      'ar',
      'he',
      'hi',
      'id',
      'vi',
      'th',
      'fil',
      'zh-Hans',
      'zh-Hant',
      'ja',
      'ko',
    ]);
    expect(PLANNED_LOCALES.length).toBe(ALL_LOCALES.length - 25);
    expect(isActiveLocale(DEFAULT_LOCALE)).toBe(true);
    expect(isActiveLocale('de')).toBe(true);
    expect(isActiveLocale('pl')).toBe(true);
    expect(isActiveLocale('ru')).toBe(true);
    expect(isActiveLocale('ar')).toBe(true);
    expect(isActiveLocale('he')).toBe(true);
    expect(isActiveLocale('zh-Hans')).toBe(true);
    expect(isActiveLocale('zh-Hant')).toBe(true);
    expect(isActiveLocale('es-419')).toBe(true);
    expect(isActiveLocale('cs')).toBe(true);
    expect(isActiveLocale('sv')).toBe(true);
    expect(isActiveLocale('fil')).toBe(true);
    expect(isRetiredLocale('zh-Hant')).toBe(false);
    expect(isRetiredLocale('es-419')).toBe(false);
    expect(isRetiredLocale('de')).toBe(false);
  });

  it('marks every locale beta until its human review is complete', () => {
    expect(ALL_LOCALES.every((locale) => locale.reviewStatus === 'beta')).toBe(true);
  });

  it('declares metadata the runtime can actually use', () => {
    for (const locale of ALL_LOCALES) {
      expect(() => new Intl.NumberFormat(locale.bcp47)).not.toThrow();
      expect(locale.pluralCategories.length).toBeGreaterThan(0);
      expect(locale.pluralCategories).toContain('other');
      for (const category of locale.pluralCategories) {
        expect(VALID_PLURAL_CATEGORIES.has(category)).toBe(true);
      }
      expect(locale.weekStartsOn).toBeGreaterThanOrEqual(0);
      expect(locale.weekStartsOn).toBeLessThanOrEqual(6);
      expect(locale.endonym.length).toBeGreaterThan(0);
      expect(locale.name.length).toBeGreaterThan(0);
      expect(locale.script.length).toBe(4);
    }
  });

  it('matches the runtime plural categories for the active locale', () => {
    const english = requireLocale('en');
    expect([...english.pluralCategories].sort()).toEqual(
      [...getCardinalPluralCategories('en')].sort(),
    );
  });

  it('matches runtime CLDR plural categories for every public locale', () => {
    for (const locale of ACTIVE_LOCALES) {
      expect(
        [...locale.pluralCategories].sort(),
        `${locale.bcp47} plural metadata`,
      ).toEqual([...getCardinalPluralCategories(locale.bcp47)].sort());
    }
  });

  it('keeps right-to-left metadata correct for the public roster', () => {
    const rtl = ACTIVE_LOCALES.filter((locale) => locale.direction === 'rtl').map(
      (locale) => locale.bcp47,
    );
    expect(rtl.sort()).toEqual(['ar', 'he']);
    expect(ACTIVE_LOCALES.filter((locale) => locale.direction === 'ltr')).toHaveLength(23);
  });

  it('marks Arabic, Hebrew and Urdu as right to left and nothing else', () => {
    const rtl = ALL_LOCALES.filter((locale) => locale.direction === 'rtl').map((l) => l.bcp47);
    expect(rtl.sort()).toEqual(['ar', 'he', 'ur']);
    expect(isRtl('ar')).toBe(true);
    expect(isRtl('he')).toBe(true);
    expect(isRtl('ur')).toBe(true);
    expect(isRtl('en')).toBe(false);
    expect(getDirection('ja')).toBe('ltr');
  });

  it('detects direction for tags outside the registry', () => {
    expect(isRtl('fa-IR')).toBe(true);
    expect(isRtl('ks-Arab')).toBe(true);
    expect(isRtl('sr-Latn')).toBe(false);
  });
});

describe('getLocale', () => {
  it('is case insensitive and trims', () => {
    expect(getLocale('  ZH-hans ')?.bcp47).toBe('zh-Hans');
    expect(getLocale('PT-br')?.bcp47).toBe('pt-BR');
  });

  it('returns undefined for unknown tags', () => {
    expect(getLocale('xx-YY')).toBeUndefined();
    expect(() => requireLocale('xx-YY')).toThrow(/Unknown locale tag/);
  });
});

describe('parseAcceptLanguage', () => {
  it('orders by quality then by appearance', () => {
    expect(parseAcceptLanguage('de;q=0.7, en-GB, fr;q=0.9')).toEqual(['en-GB', 'fr', 'de']);
  });

  it('drops zero quality entries', () => {
    expect(parseAcceptLanguage('en;q=0, de')).toEqual(['de']);
  });

  it('handles empty input', () => {
    expect(parseAcceptLanguage(null)).toEqual([]);
    expect(parseAcceptLanguage('')).toEqual([]);
    expect(parseAcceptLanguage('   ')).toEqual([]);
  });
});

describe('canonicalizeLocaleTag', () => {
  it('maps Chinese regions to the two written locales', () => {
    expect(canonicalizeLocaleTag('zh')).toBe('zh-Hans');
    expect(canonicalizeLocaleTag('zh-CN')).toBe('zh-Hans');
    expect(canonicalizeLocaleTag('zh-TW')).toBe('zh-Hant');
    expect(canonicalizeLocaleTag('zh-HK')).toBe('zh-Hant');
  });

  it('splits Portuguese by content convention', () => {
    expect(canonicalizeLocaleTag('pt')).toBe('pt-BR');
    expect(canonicalizeLocaleTag('pt-PT')).toBe('pt-PT');
    expect(canonicalizeLocaleTag('pt-AO')).toBe('pt-BR');
  });

  it('routes Latin American Spanish regions to es-419', () => {
    expect(canonicalizeLocaleTag('es-MX')).toBe('es-419');
    expect(canonicalizeLocaleTag('es-AR')).toBe('es-419');
    expect(canonicalizeLocaleTag('es-ES')).toBe('es');
    expect(canonicalizeLocaleTag('es')).toBe('es');
  });

  it('applies legacy aliases', () => {
    expect(canonicalizeLocaleTag('iw')).toBe('he');
    expect(canonicalizeLocaleTag('in')).toBe('id');
    expect(canonicalizeLocaleTag('tl')).toBe('fil');
    expect(canonicalizeLocaleTag('no')).toBe('nb');
  });
});

describe('resolveLocale', () => {
  const supported = ['en', 'de', 'pt-BR', 'zh-Hant', 'es-419'];

  it('matches an active locale before falling back to English', () => {
    expect(resolveLocale('fr-CA,fr;q=0.9')).toBe('fr');
    expect(resolveLocale(null)).toBe('en');
    expect(resolveLocale('', supported)).toBe('en');
  });

  it('prefers an exact match', () => {
    expect(resolveLocale('de', supported)).toBe('de');
    expect(resolveLocale('DE-de,de;q=0.8', supported)).toBe('de');
  });

  it('truncates subtags', () => {
    expect(resolveLocale('de-AT-1996', supported)).toBe('de');
  });

  it('uses the language subtag as a last resort', () => {
    expect(resolveLocale('pt', supported)).toBe('pt-BR');
    expect(resolveLocale('pt-PT', supported)).toBe('pt-BR');
  });

  it('routes regional Chinese and Spanish through the alias table', () => {
    expect(resolveLocale('zh-TW', supported)).toBe('zh-Hant');
    expect(resolveLocale('es-MX', supported)).toBe('es-419');
  });

  it('honours quality ordering over header order', () => {
    expect(resolveLocale('fr;q=1.0, de;q=0.9', supported)).toBe('de');
    expect(resolveLocale('de;q=0.2, zh-Hant;q=0.8', supported)).toBe('zh-Hant');
  });

  it('accepts the wildcard', () => {
    expect(resolveLocale('*', supported)).toBe('en');
  });

  it('honours an explicit fallback', () => {
    expect(resolveLocale('fr', ['de'], 'de')).toBe('de');
    expect(resolveLocale('fr', [], 'en')).toBe('en');
  });

  it('defaults to the active locale list', () => {
    expect(resolveLocale('de,en;q=0.5')).toBe('de');
  });
});
