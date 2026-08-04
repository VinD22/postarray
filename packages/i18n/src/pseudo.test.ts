import { describe, expect, it } from 'vitest';

import { lintCatalog } from './lint.js';
import { en } from './messages/en/index.js';
import {
  PSEUDO_LOCALES,
  PSEUDO_LOCALE_CODES,
  createPseudoCatalog,
  getPseudoLocale,
  isPseudoLocale,
  pseudoLocalize,
  pseudoLocalizeCatalog,
} from './pseudo.js';
import { createTranslator } from './translate.js';

describe('pseudo locales', () => {
  it('declares an accented and a right to left variant', () => {
    expect(PSEUDO_LOCALE_CODES.accented).toBe('en-XA');
    expect(PSEUDO_LOCALE_CODES.bidi).toBe('en-XB');
    expect(PSEUDO_LOCALES).toHaveLength(2);
    expect(getPseudoLocale('en-XB')?.direction).toBe('rtl');
    expect(getPseudoLocale('en-XA')?.direction).toBe('ltr');
    expect(isPseudoLocale('en-xa')).toBe(true);
    expect(isPseudoLocale('en')).toBe(false);
  });
});

describe('pseudoLocalize', () => {
  it('brackets and accents the text', () => {
    const output = pseudoLocalize('Save draft');
    expect(output.startsWith('[')).toBe(true);
    expect(output.endsWith(']')).toBe(true);
    expect(output).toContain('Śãṽé ðŕãƒţ');
  });

  it('expands by about forty percent', () => {
    const source = 'Publish now';
    const output = pseudoLocalize(source, { brackets: false });
    expect(output.length).toBeGreaterThanOrEqual(Math.round(source.length * 1.3));
    expect(output.length).toBeLessThan(Math.round(source.length * 1.8));
  });

  it('leaves argument names untouched', () => {
    const output = pseudoLocalize('{account} on {provider}');
    expect(output).toContain('{account}');
    expect(output).toContain('{provider}');
  });

  it('leaves plural syntax intact and translates only the option text', () => {
    const output = pseudoLocalize('{count, plural, one {# account} other {# accounts}}');
    expect(output).toContain('{count, plural,');
    expect(output).toContain('one {');
    expect(output).toContain('other {');
    expect(output).toContain('ãççóúñţ');
  });

  it('still formats after transformation', () => {
    const catalog = createPseudoCatalog();
    const t = createTranslator('en-XA', catalog);
    const output = t.t('composer.targets.count', { count: 6 });
    expect(output).toContain('6');
    expect(output).toContain('ãççóúñţś');
  });

  it('wraps literal runs in bidirectional isolates for the rtl variant', () => {
    const output = pseudoLocalize('Save draft', { variant: 'bidi' });
    expect(output).toContain('⁧');
    expect(output).toContain('⁩');
  });

  it('keeps every key when transforming a catalog', () => {
    const source = { 'a.b': 'One', 'c.d': 'Two' };
    const output = pseudoLocalizeCatalog(source);
    expect(Object.keys(output)).toEqual(['a.b', 'c.d']);
  });
});

describe('the pseudo catalog is still a valid catalog', () => {
  it('parses as ICU for both variants', () => {
    for (const variant of ['accented', 'bidi'] as const) {
      const catalog = pseudoLocalizeCatalog(en, { variant }) as Record<string, string>;
      const result = lintCatalog(catalog, {
        locale: 'en',
        requireCoverage: false,
      });
      const parseFailures = result.findings.filter(
        (finding) => finding.rule === 'message-parses' || finding.rule === 'plural-categories',
      );
      expect(parseFailures, variant).toEqual([]);
    }
  });

  it('keeps argument parity with English', () => {
    const catalog = pseudoLocalizeCatalog(en, { variant: 'accented' }) as Record<string, string>;
    const result = lintCatalog(catalog, {
      locale: 'en',
      requireCoverage: false,
      reference: en as Record<string, string>,
    });
    const parity = result.findings.filter((finding) => finding.rule === 'argument-parity');
    expect(parity).toEqual([]);
  });
});
