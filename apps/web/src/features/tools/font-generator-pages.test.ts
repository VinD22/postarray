import { describe, expect, it } from 'vitest';

import { marketingTranslator } from '@/features/marketing/i18n';
import { absoluteUrl } from '@/features/marketing/seo';
import { MARKETING_ROUTES, TOOL_LINKS } from '@/features/marketing/site';

import {
  FONT_GENERATOR_PAGES,
  fontGeneratorMetadata,
  renderFontGeneratorPage,
} from './font-generator-pages';
import { UNICODE_STYLES } from './unicode-styles';

const LOCALE = 'en';

/**
 * Words this cluster may not use about itself.
 *
 * Every one of them would tell a reader they are getting a typeface file, or
 * that we know a style survives somewhere we have never tested. Both are
 * claims this tool cannot support, so they are checked rather than trusted.
 */
const FORBIDDEN_PHRASES: readonly string[] = [
  'download the font',
  'font file to download',
  'install this font',
  '.ttf',
  '.otf',
  'works on instagram',
  'works on facebook',
  'works on discord',
  'guaranteed',
];

describe('every text style page', () => {
  it('builds and canonicalizes to itself', async () => {
    for (const page of FONT_GENERATOR_PAGES) {
      await expect(renderFontGeneratorPage(page, LOCALE), page.id).resolves.toBeDefined();

      const metadata = await fontGeneratorMetadata(page, LOCALE);
      expect(metadata.alternates?.canonical, page.id).toBe(absoluteUrl(page.path, LOCALE));
    }
  });

  it('is registered as an indexable route and listed in the tool directory', () => {
    for (const page of FONT_GENERATOR_PAGES) {
      expect(MARKETING_ROUTES, page.id).toContain(page.path);
      expect(
        TOOL_LINKS.map((link) => link.href),
        page.id,
      ).toContain(page.path);
    }
    expect(new Set(MARKETING_ROUTES).size).toBe(MARKETING_ROUTES.length);
  });

  it('offers at least one style, all of them real', () => {
    const known = new Set(UNICODE_STYLES.map((style) => style.id));
    for (const page of FONT_GENERATOR_PAGES) {
      expect(page.styles.length, page.id).toBeGreaterThan(0);
      for (const id of page.styles) {
        expect(known.has(id), `${page.id}:${id}`).toBe(true);
      }
    }
  });

  it('resolves every one of its copy keys to a real sentence', async () => {
    const t = await marketingTranslator(LOCALE);
    for (const page of FONT_GENERATOR_PAGES) {
      const keys = [
        page.metaTitleKey,
        page.metaDescriptionKey,
        page.titleKey,
        page.ledeKey,
        page.explainerTitleKey,
        page.explainerBodyKey,
        page.explainerExtraKey,
        page.platformNoteKey,
        page.ownFaq.q,
        page.ownFaq.a,
      ];
      for (const key of keys) {
        const text = t.format(key);
        expect(text, `${page.id}:${key}`).not.toBe(key);
        expect(text.length, `${page.id}:${key}`).toBeGreaterThan(2);
      }
    }
  });

  it('never claims a font file or a platform guarantee', async () => {
    const t = await marketingTranslator(LOCALE);
    const sentences = FONT_GENERATOR_PAGES.flatMap((page) =>
      [
        page.metaTitleKey,
        page.metaDescriptionKey,
        page.titleKey,
        page.ledeKey,
        page.explainerBodyKey,
        page.explainerExtraKey,
        page.platformNoteKey,
        page.ownFaq.a,
      ].map((key) => `${page.id}:${key}:${t.format(key).toLowerCase()}`),
    );

    for (const sentence of sentences) {
      for (const phrase of FORBIDDEN_PHRASES) {
        expect(sentence.includes(phrase), `${sentence} contains "${phrase}"`).toBe(false);
      }
    }
  });

  /**
   * The intent rule, guarded where it actually matters.
   *
   * These are download-intent queries: a person searching them wants a
   * typeface file, a foundry or a font identifier, and ranking a Unicode
   * styler for any of them wastes their time. The check is deliberately
   * narrower than `FORBIDDEN_PHRASES` above and covers only the fields that
   * compete for a query, because the copy is allowed, and expected, to name
   * these things in order to turn a reader away. The hub's own FAQ does
   * exactly that.
   */
  it('does not aim its title or metadata at download-intent queries', async () => {
    const t = await marketingTranslator(LOCALE);
    const downloadIntent = [
      'tattoo',
      'old english',
      'graffiti',
      'helvetica',
      'adobe font',
      'google font',
      'free font',
      'what font is this',
      'font finder',
    ];

    for (const page of FONT_GENERATOR_PAGES) {
      for (const key of [page.metaTitleKey, page.metaDescriptionKey, page.titleKey]) {
        const text = t.format(key).toLowerCase();
        for (const phrase of downloadIntent) {
          expect(text.includes(phrase), `${page.id}:${key} targets "${phrase}"`).toBe(false);
        }
      }
    }
  });

  it('states the accessibility caveat in the shared copy every page renders', async () => {
    const t = await marketingTranslator(LOCALE);
    const body = t.format('web.toolDirectory.fontGenerator.accessibility.body').toLowerCase();
    const advice = t.format('web.toolDirectory.fontGenerator.accessibility.advice').toLowerCase();

    expect(body).toContain('screen reader');
    expect(body).toContain('search');
    expect(advice).toContain('sparingly');
  });

  it('names and describes every style it can render', async () => {
    const t = await marketingTranslator(LOCALE);
    for (const style of UNICODE_STYLES) {
      expect(t.format(style.nameKey), style.id).not.toBe(style.nameKey);
      expect(t.format(style.noteKey), style.id).not.toBe(style.noteKey);
    }
  });
});
