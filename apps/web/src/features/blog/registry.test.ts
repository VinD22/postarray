import { ACTIVE_LOCALE_CODES, en } from '@relay/i18n';
import { formatLintResult, lintCatalog } from '@relay/i18n/lint';
import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/features/marketing/site';

import { BLOG_ARTICLES, BLOG_SLUGS, blogArticlePath, findBlogArticle } from './registry';
import {
  BLOG_CLUSTERS,
  BLOG_TOOLS,
  articleHeadings,
  articleLocales,
  articleStrings,
  clusterLabelKey,
  contentStrings,
} from './types';

/**
 * The invariants that make the blog safe to add to.
 *
 * Article prose does not go through the ICU catalog, so it would otherwise
 * skip the em dash rule and the forbidden-word rule that every other
 * user-visible string in this product is held to. This file runs the same
 * linter over the rendered strings instead, which is the trade that made
 * typed content modules acceptable in place of MDX.
 *
 * An article can carry several languages, so every assertion below runs once
 * per language the article actually has, not once per article.
 */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Naming a platform is what makes a sentence expire. Any article that does it
 * has to carry a dated official source, whether the claim is a limit, a
 * required account type or a review process.
 */
const PLATFORM_NAMES = [
  'Instagram',
  'TikTok',
  'LinkedIn',
  'YouTube',
  'Facebook',
  'Threads',
  'Pinterest',
  'Reddit',
  'Bluesky',
  'Mastodon',
  'Telegram',
  'Discord',
  'Google Business Profile',
];

const KNOWN_ROUTES = new Set<string>(Object.values(ROUTES));

/** Every (article, locale, content) triple, for the per-locale assertions. */
function everyContent(): readonly {
  readonly article: (typeof BLOG_ARTICLES)[number];
  readonly locale: string;
  readonly content: (typeof BLOG_ARTICLES)[number]['content']['en'];
}[] {
  return BLOG_ARTICLES.flatMap((article) =>
    Object.entries(article.content).map(([locale, content]) => ({ article, locale, content })),
  );
}

describe('blog registry', () => {
  it('has at least four articles and a unique, well formed slug for each', () => {
    expect(BLOG_ARTICLES.length).toBeGreaterThanOrEqual(4);
    expect(new Set(BLOG_SLUGS).size).toBe(BLOG_SLUGS.length);

    for (const article of BLOG_ARTICLES) {
      expect(article.slug, article.slug).toMatch(SLUG);
      expect(findBlogArticle(article.slug)).toBe(article);
      expect(blogArticlePath(article.slug)).toBe(`/blog/${article.slug}`);
    }
  });

  it('orders the index newest first by last edit', () => {
    const updated = BLOG_ARTICLES.map((article) => article.updated);
    expect([...updated].sort().reverse()).toEqual(updated);
  });

  it('always has English content, and every other language key is an active locale', () => {
    for (const article of BLOG_ARTICLES) {
      expect(article.content.en, article.slug).toBeDefined();
      for (const locale of articleLocales(article)) {
        expect(ACTIVE_LOCALE_CODES, `${article.slug}: ${locale}`).toContain(locale);
      }
    }
  });

  it('names an author and a cluster whose catalog keys exist', () => {
    for (const article of BLOG_ARTICLES) {
      expect(BLOG_CLUSTERS).toContain(article.cluster);
      expect(en[clusterLabelKey(article.cluster)], article.slug).toBeTypeOf('string');
      expect(en[article.author.nameKey], article.slug).toBeTypeOf('string');
      expect(en[article.author.roleKey], article.slug).toBeTypeOf('string');
      if (article.reviewer) {
        expect(en[article.reviewer.nameKey], article.slug).toBeTypeOf('string');
        expect(en[article.reviewer.roleKey], article.slug).toBeTypeOf('string');
      }
    }
  });

  it('carries both dates, with the last edit never before publication', () => {
    for (const article of BLOG_ARTICLES) {
      expect(article.published, article.slug).toMatch(ISO_DATE);
      expect(article.updated, article.slug).toMatch(ISO_DATE);
      expect(Number.isNaN(Date.parse(article.published))).toBe(false);
      expect(Number.isNaN(Date.parse(article.updated))).toBe(false);
      expect(article.updated >= article.published, article.slug).toBe(true);
    }
  });

  it('cites a dated official source for every article that names a platform, in any language', () => {
    for (const article of BLOG_ARTICLES) {
      const text = articleStrings(article).join('\n');
      const platforms = PLATFORM_NAMES.filter((platform) => text.includes(platform));

      if (platforms.length > 0) {
        expect(
          article.sources.length,
          `${article.slug} names ${platforms.join(', ')}`,
        ).toBeGreaterThan(0);
      }

      for (const source of article.sources) {
        expect(source.url, article.slug).toMatch(/^https:\/\//);
        expect(source.readOn, article.slug).toMatch(ISO_DATE);
        expect(source.title.trim().length, article.slug).toBeGreaterThan(0);
        expect(
          article.reviewer,
          `${article.slug} cites a source, so it needs a reviewer`,
        ).toBeDefined();
      }
    }
  });

  it('gives every heading a unique anchor and every description a bounded length, per language', () => {
    for (const { article, locale, content } of everyContent()) {
      const label = `${article.slug} (${locale})`;
      const ids = articleHeadings(content).map((heading) => heading.id);
      expect(new Set(ids).size, label).toBe(ids.length);
      for (const id of ids) {
        expect(id, label).toMatch(SLUG);
      }
      expect(content.description.length, label).toBeLessThanOrEqual(200);
    }
  });

  it('links only to routes the site actually owns', () => {
    for (const { article, locale, content } of everyContent()) {
      for (const block of content.blocks) {
        if (block.kind === 'cta') {
          expect(KNOWN_ROUTES.has(block.href), `${article.slug} (${locale}): ${block.href}`).toBe(
            true,
          );
        }
      }
    }
  });

  it('selects only a tool from the closed registry, and sources every stat', () => {
    for (const { article, locale, content } of everyContent()) {
      const label = `${article.slug} (${locale})`;
      for (const block of content.blocks) {
        if (block.kind === 'tool') {
          expect(BLOG_TOOLS, label).toContain(block.tool);
        }
        if (block.kind === 'stat') {
          expect(block.source, label).toMatch(/^https:\/\//);
          expect(
            article.sources.some((source) => source.url === block.source),
            `${label}: stat source ${block.source} is not in the article's sources`,
          ).toBe(true);
        }
      }
    }
  });

  it('never uses an em dash in a rendered string, in any language', () => {
    for (const { article, locale, content } of everyContent()) {
      for (const value of contentStrings(content)) {
        expect(value.includes('—'), `${article.slug} (${locale}): ${value}`).toBe(false);
        expect(value.includes('―'), `${article.slug} (${locale}): ${value}`).toBe(false);
      }
    }
  });

  it('passes the same catalog lint every other user visible string passes, in every language', () => {
    const catalog: Record<string, string> = {};
    everyContent().forEach(({ content }, index) => {
      contentStrings(content).forEach((value, valueIndex) => {
        catalog[`blog.a${index}.s${valueIndex}`] = value;
      });
    });

    const result = lintCatalog(catalog, { locale: 'en', requireCoverage: false });
    if (!result.ok) {
      throw new Error(formatLintResult(result));
    }
    expect(result.errorCount).toBe(0);
  });

  it('teaches the problem domain without ever naming the product', () => {
    const brand = en['web.brand.name'];
    for (const article of BLOG_ARTICLES) {
      for (const value of articleStrings(article)) {
        expect(value.includes(brand), `${article.slug}: ${value}`).toBe(false);
      }
    }
  });
});
