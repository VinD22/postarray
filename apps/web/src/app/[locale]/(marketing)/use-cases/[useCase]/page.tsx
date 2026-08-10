import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';

import { Body, Heading, List, Section, Split } from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { CorrectionNotice, PageIntro } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES, toUseCasePath } from '@/features/marketing/site';
import { USE_CASE_SLUGS, findUseCasePage } from '@/features/platforms/use-cases';

/**
 * One use case.
 *
 * The same five parts every time: a standfirst, the problem, three design
 * points, and what is actually built. The last section is the reason this page
 * exists in the shape it does. A use case page that only described a design
 * would read as though the workflow runs today, and none of it publishes
 * anywhere yet.
 */

export function generateStaticParams(): readonly { readonly useCase: string }[] {
  return USE_CASE_SLUGS.map((useCase) => ({ useCase }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly useCase: string }>;
}): Promise<Metadata> {
  const { locale, useCase } = await params;
  const page = findUseCasePage(useCase);
  if (!page) {
    return {};
  }
  return pageMetadata(page.metaTitleKey, page.metaDescriptionKey, toUseCasePath(page.slug), locale);
}

export default async function UseCasePage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly useCase: string }>;
}): Promise<ReactNode> {
  const { locale, useCase } = await params;
  const page = findUseCasePage(useCase);
  if (!page) {
    notFound();
  }

  const t = await marketingTranslator(locale);

  return (
    <>
      <PageIntro title={t.format(page.titleKey)} lede={t.format(page.ledeKey)}>
        <Notice
          tone="neutral"
          className="mt-8"
          title={t.t('web.useCases.notice.title')}
          description={t.t('web.useCases.notice.body')}
        />
      </PageIntro>

      <Section id="problem">
        <Split aside={<Heading>{t.t('web.useCases.section.problem')}</Heading>}>
          <Body>{t.format(page.problemKey)}</Body>
        </Split>
      </Section>

      <Section id="approach">
        <Split aside={<Heading>{t.t('web.useCases.section.approach')}</Heading>}>
          <List items={page.approachKeys.map((key) => t.format(key))} />
        </Split>
      </Section>

      <Section id="today">
        <Split aside={<Heading>{t.t('web.useCases.section.today')}</Heading>}>
          <Body>{t.format(page.todayKey)}</Body>
        </Split>
      </Section>

      <Section id="related">
        <Split aside={<Heading>{t.t('web.useCases.section.related')}</Heading>}>
          <Body>{t.t('web.schedule.next.body')}</Body>
          <p className="mt-6">
            <TextLink href={ROUTES.useCases}>{t.t('web.useCases.index.title')}</TextLink>
          </p>
          <p className="mt-2">
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
            { name: t.format(page.titleKey), path: toUseCasePath(page.slug) },
          ],
          locale,
        )}
      />
    </>
  );
}
