import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ACTIVE_LOCALES } from '@relay/i18n';

import { Reveal } from '@/components/motion';
import { ArticleBody } from '@/features/blog/components/article-body';
import { BLOG_SLUGS, blogArticlePath, findBlogArticle } from '@/features/blog/registry';
import {
  articleContent,
  articleFaq,
  articleHeadings,
  articleLede,
  articleLocales,
  clusterLabelKey,
  hasArticleLocale,
} from '@/features/blog/types';
import { Container, Lede, Meta, Subheading } from '@/features/marketing/components/layout';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { Notice } from '@relay/design-system/patterns';
import { ExternalLink, TextLink } from '@/features/marketing/components/links';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import {
  articleJsonLd,
  articleMetadata,
  breadcrumbJsonLd,
  faqJsonLd,
} from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';
import { localizedHref } from '@/lib/i18n/routing';

/**
 * One article.
 *
 * The reading grammar is the legal suite's, not the landing pages': a single
 * measured column, a sticky index built from the article's own headings, and
 * no marketing furniture between the reader and the argument. Blocks are
 * rendered by `ArticleBody` so no article can invent its own hierarchy.
 *
 * The two dates and the two bylines are above the body rather than buried at
 * the end, because the first thing a reader needs to know about a page that
 * states platform rules is when it was last checked and by whom.
 */

export function generateStaticParams(): readonly { readonly slug: string }[] {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = findBlogArticle(slug);
  if (!article) {
    return {};
  }
  const t = await marketingTranslator(locale);
  const content = articleContent(article, locale);

  return articleMetadata({
    headline: content.title,
    description: content.description,
    path: blogArticlePath(article.slug),
    published: article.published,
    updated: article.updated,
    authorName: t.format(article.author.nameKey),
    ...(article.reviewer === undefined ? {} : { reviewerName: t.format(article.reviewer.nameKey) }),
    sourceUrls: article.sources.map((source) => source.url),
    availableLocales: articleLocales(article),
    locale,
  });
}

export default async function BlogArticlePage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly slug: string }>;
}): Promise<ReactNode> {
  const { locale, slug } = await params;
  const article = findBlogArticle(slug);
  if (!article) {
    notFound();
  }

  const t = await marketingTranslator(locale);
  const content = articleContent(article, locale);
  const headings = articleHeadings(content);
  const faq = articleFaq(content);
  const locales = articleLocales(article);
  const authorName = t.format(article.author.nameKey);
  const reviewerName =
    article.reviewer === undefined ? undefined : t.format(article.reviewer.nameKey);

  return (
    <Container>
      <div className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="space-y-6 lg:sticky lg:top-24">
              <p>
                <TextLink href={ROUTES.blog} className="text-body-md">
                  {t.t('web.blog.label.backToIndex')}
                </TextLink>
              </p>
              {headings.length > 0 ? (
                <nav aria-label={t.t('web.label.onThisPage')}>
                  <h2 className="text-label text-text-tertiary">{t.t('web.label.onThisPage')}</h2>
                  <ul className="mt-3 space-y-0.5">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className="text-body-md text-text-secondary hover:text-text-primary focus-visible:outline-border-focus flex min-h-9 items-center transition-colors duration-(--duration-fast) focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}
              <div className="border-border-subtle space-y-1 border-t pt-4">
                <p>
                  <Meta>{t.format(clusterLabelKey(article.cluster))}</Meta>
                </p>
                <p>
                  <Meta>
                    {t.t('web.blog.label.published', {
                      date: formatDate(article.published, locale),
                    })}
                  </Meta>
                </p>
                <p>
                  <Meta>
                    {t.t('web.blog.label.updated', { date: formatDate(article.updated, locale) })}
                  </Meta>
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-8 lg:col-start-5">
            <article className="space-y-10">
              <Reveal as="header" className="space-y-5">
                <h1 className="text-text-primary font-display text-[clamp(1.9rem,1.3rem+2.2vw,2.9rem)] leading-[1.1] tracking-[-0.02em] text-pretty">
                  {content.title}
                </h1>
                <Lede>{articleLede(content)}</Lede>

                {locales.length > 1 ? (
                  <nav
                    aria-label={t.t('web.blog.label.language')}
                    className="flex flex-wrap items-center gap-x-2 gap-y-1"
                  >
                    <span className="text-body-sm text-text-tertiary">
                      {t.t('web.blog.label.language')}
                    </span>
                    {locales.map((available) => {
                      const descriptor = ACTIVE_LOCALES.find((entry) => entry.bcp47 === available);
                      const isCurrent = available === locale;
                      return (
                        <a
                          key={available}
                          href={localizedHref(blogArticlePath(article.slug), available)}
                          lang={available}
                          hrefLang={available}
                          aria-current={isCurrent ? 'true' : undefined}
                          className={
                            isCurrent
                              ? 'text-body-sm text-text-primary underline underline-offset-4'
                              : 'text-body-sm text-text-secondary hover:text-text-primary underline underline-offset-4'
                          }
                        >
                          {descriptor?.endonym ?? available}
                        </a>
                      );
                    })}
                  </nav>
                ) : null}

                {hasArticleLocale(article, locale) ? null : (
                  <Notice tone="neutral" title={t.t('web.blog.label.notTranslated')} />
                )}

                <div className="border-border-subtle flex flex-wrap gap-x-6 gap-y-1 border-t pt-4">
                  <Meta>{t.t('web.blog.label.writtenBy', { name: authorName })}</Meta>
                  {reviewerName === undefined ? null : (
                    <Meta>{t.t('web.blog.label.reviewedBy', { name: reviewerName })}</Meta>
                  )}
                </div>
              </Reveal>

              <ArticleBody blocks={content.blocks} locale={locale} />

              {article.sources.length > 0 ? (
                <section
                  id="sources"
                  aria-labelledby="sources-title"
                  className="border-border-bold scroll-mt-24 space-y-3 border-t-2 pt-8"
                >
                  <Subheading as="h2" id="sources-title">
                    {t.t('web.blog.label.sources')}
                  </Subheading>
                  <ul className="space-y-3">
                    {article.sources.map((source) => (
                      <li key={source.url} className="text-body-md leading-[1.6]">
                        <ExternalLink href={source.url}>{source.title}</ExternalLink>{' '}
                        <Meta>
                          {t.t('web.blog.label.sourceRead', {
                            date: formatDate(source.readOn, locale),
                          })}
                        </Meta>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <nav
                aria-label={t.t('web.blog.label.articleList')}
                className="border-border-bold border-t-2 pt-8"
              >
                <p className="text-body-md text-text-secondary">
                  <TextLink href={ROUTES.blog}>{t.t('web.blog.label.backToIndex')}</TextLink>
                </p>
              </nav>
            </article>
          </div>
        </div>
      </div>

      <JsonLd
        node={await articleJsonLd({
          headline: content.title,
          description: content.description,
          path: blogArticlePath(article.slug),
          published: article.published,
          updated: article.updated,
          authorName,
          ...(reviewerName === undefined ? {} : { reviewerName }),
          sourceUrls: article.sources.map((source) => source.url),
          availableLocales: locales,
          locale,
        })}
      />
      {faq.length === 0 ? null : (
        <JsonLd
          node={faqJsonLd(
            faq.map((entry) => ({ question: entry.q, answer: entry.a })),
            locale,
          )}
        />
      )}
      <JsonLd
        node={breadcrumbJsonLd(
          [
            { name: t.t('web.brand.name'), path: ROUTES.home },
            { name: t.t('web.blog.title'), path: ROUTES.blog },
            { name: content.title, path: blogArticlePath(article.slug) },
          ],
          locale,
        )}
      />
    </Container>
  );
}
