import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';

import { Body, Heading, Section, Split } from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { CorrectionNotice, PageIntro } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES, toUseCasePath } from '@/features/marketing/site';
import { USE_CASE_PAGES } from '@/features/platforms/use-cases';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.useCases.title',
    'web.meta.useCases.description',
    ROUTES.useCases,
    locale,
  );
}

/**
 * The use case index.
 *
 * Three rows. Each child page has the same five part shape, and the last part
 * is always what is actually built, so a reader who scrolls to the bottom of
 * any of them gets the honest answer rather than a call to action.
 */
export default async function UseCasesIndexPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <PageIntro title={t.t('web.useCases.index.title')} lede={t.t('web.useCases.index.lede')}>
        <Notice
          tone="neutral"
          className="mt-8"
          title={t.t('web.useCases.notice.title')}
          description={t.t('web.useCases.notice.body')}
        />
      </PageIntro>

      <Section id="use-cases" ariaLabel={t.t('web.useCases.index.listLabel')}>
        <ul className="border-border-bold border-t-2">
          {USE_CASE_PAGES.map((page) => (
            <RowLink
              key={page.slug}
              href={toUseCasePath(page.slug)}
              title={t.format(page.titleKey)}
              description={t.format(page.ledeKey)}
            />
          ))}
        </ul>
      </Section>

      <Section id="related">
        <Split aside={<Heading>{t.t('web.useCases.section.related')}</Heading>}>
          <Body>{t.t('web.schedule.index.cohortNote')}</Body>
          <p className="mt-6">
            <TextLink href={ROUTES.schedule}>{t.t('web.schedule.index.title')}</TextLink>
          </p>
          <p className="mt-2">
            <TextLink href={ROUTES.capabilities}>{t.t('nav.public.capabilities')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="corrections">
        <CorrectionNotice locale={locale} />
      </Section>

      <JsonLd
        node={breadcrumbJsonLd(
          [
            { name: t.t('web.brand.name'), path: ROUTES.home },
            { name: t.t('web.useCases.index.title'), path: ROUTES.useCases },
          ],
          locale,
        )}
      />
    </>
  );
}
