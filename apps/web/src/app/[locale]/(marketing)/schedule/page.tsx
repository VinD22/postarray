import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';

import { Body, Heading, Meta, Section, Split } from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { CorrectionNotice, PageIntro } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES, schedulePlatformPath } from '@/features/marketing/site';
import { PLATFORM_PAGES } from '@/features/platforms/registry';
import { buildPlatformViewModel } from '@/features/platforms/view-model';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.schedule.title',
    'web.meta.schedule.description',
    ROUTES.schedule,
    locale,
  );
}

/**
 * The index of the per platform scheduler pages.
 *
 * A dated list, not a logo wall. The row meta says whether limits have been
 * recorded for that platform at all, which is the one fact that decides
 * whether the child page has anything to show. A platform with no adapter in
 * this build says so here rather than looking identical to the rest.
 */
export default async function ScheduleIndexPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);
  const platforms = PLATFORM_PAGES.map((page) => ({
    page,
    model: buildPlatformViewModel(page),
  }));

  return (
    <>
      <PageIntro title={t.t('web.schedule.index.title')} lede={t.t('web.schedule.index.lede')} />

      <Section id="platforms" ariaLabel={t.t('web.schedule.index.listLabel')}>
        <Notice
          tone="neutral"
          title={t.t('web.blog.notice.prelaunch.title')}
          description={t.t('web.blog.notice.prelaunch.body')}
          className="mb-10"
        />
        <ul className="border-border-bold border-t-2">
          {platforms.map(({ page, model }) => (
            <RowLink
              key={page.slug}
              href={schedulePlatformPath(page.slug)}
              title={t.format(page.nameKey)}
              meta={
                <Meta>
                  {model.adapterPresent
                    ? t.t('web.schedule.index.limitsKnown')
                    : t.t('web.schedule.index.limitsUnknown')}
                </Meta>
              }
            />
          ))}
        </ul>
      </Section>

      <Section id="cohort">
        <Split aside={<Heading>{t.t('web.schedule.next.title')}</Heading>}>
          <Body>{t.t('web.schedule.index.cohortNote')}</Body>
          <Body className="mt-4">{t.t('web.schedule.next.body')}</Body>
          <p className="mt-6">
            <TextLink href={ROUTES.capabilities}>{t.t('nav.public.capabilities')}</TextLink>
          </p>
          <p className="mt-2">
            <TextLink href={ROUTES.useCases}>{t.t('web.useCases.index.title')}</TextLink>
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
            { name: t.t('web.schedule.index.title'), path: ROUTES.schedule },
          ],
          locale,
        )}
      />
    </>
  );
}
