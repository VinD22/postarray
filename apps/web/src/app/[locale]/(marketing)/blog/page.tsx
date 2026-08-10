import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState, Notice } from '@relay/design-system/patterns';

import { BLOG_FEED_PATH } from '@/features/blog/feed';
import { BLOG_ARTICLES, blogArticlePath } from '@/features/blog/registry';
import { clusterLabelKey } from '@/features/blog/types';
import { Lede, Meta, Section } from '@/features/marketing/components/layout';
import {
  ClosingCta,
  EditorialDisplay,
  EditorialSection,
} from '@/features/marketing/components/editorial';
import { RowLink } from '@/features/marketing/components/links';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, pageMetadata, websiteJsonLd } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('web.blog.meta.title', 'web.blog.meta.description', ROUTES.blog, locale);
}

/**
 * The blog index.
 *
 * A dated list, not a grid of cards. Every row carries the one fact a reader
 * uses to decide whether to open it (what it is about) and the one fact that
 * tells them whether it is still current (when it was last edited).
 *
 * The banner at the top is not a disclaimer bolted on. These articles teach
 * the problem domain while the product has no verified connector, and saying
 * so plainly is the difference between publishing research and pretending to
 * have a working tool.
 */
export default async function BlogIndexPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <EditorialSection>
        <div className="max-w-[48rem] space-y-6">
          <EditorialDisplay as="h1" size="md">
            {t.t('web.blog.title')}
          </EditorialDisplay>
          <Lede>{t.t('web.blog.lede')}</Lede>
          <Notice
            tone="neutral"
            title={t.t('web.blog.notice.prelaunch.title')}
            description={t.t('web.blog.notice.prelaunch.body')}
          />
          <p className="text-body-md">
            <a
              href={BLOG_FEED_PATH}
              className="text-text-primary decoration-border-strong hover:text-text-accent hover:decoration-accent focus-visible:outline-border-focus underline decoration-1 underline-offset-[0.22em] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t.t('web.blog.feed.label')}
            </a>
          </p>
        </div>
      </EditorialSection>

      <Section id="articles" ariaLabel={t.t('web.blog.label.articleList')}>
        {BLOG_ARTICLES.length === 0 ? (
          <EmptyState
            title={t.t('web.blog.empty.title')}
            description={t.t('web.blog.empty.body')}
          />
        ) : (
          <ul className="border-border-bold border-t-2">
            {BLOG_ARTICLES.map((article) => (
              <RowLink
                key={article.slug}
                href={blogArticlePath(article.slug)}
                title={article.title}
                description={article.description}
                meta={
                  <span className="flex flex-wrap gap-x-5 gap-y-1">
                    <Meta>{t.format(clusterLabelKey(article.cluster))}</Meta>
                    <Meta>
                      {t.t('web.blog.label.updated', {
                        date: formatDate(article.updated, locale),
                      })}
                    </Meta>
                  </span>
                }
              />
            ))}
          </ul>
        )}
      </Section>

      <ClosingCta
        id="start"
        title={t.t('web.marketing.v2.closing.title')}
        body={t.t('web.marketing.v2.closing.body')}
        cta={{ href: ROUTES.signUp, label: t.t('web.cta.startTrial') }}
        footnote={t.t('web.cta.trialFootnote')}
      />

      <JsonLd node={await websiteJsonLd(locale)} />
      <JsonLd
        node={breadcrumbJsonLd(
          [
            { name: t.t('web.brand.name'), path: ROUTES.home },
            { name: t.t('web.blog.title'), path: ROUTES.blog },
          ],
          locale,
        )}
      />
    </>
  );
}
