import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';

import { Body, Heading, Meta, Section, Split } from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { CorrectionNotice, PageIntro } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES, specsPlatformPath } from '@/features/marketing/site';
import { SPEC_PLATFORMS } from '@/features/specs/registry';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('web.meta.specs.title', 'web.meta.specs.description', ROUTES.specs, locale);
}

/**
 * The index of the generated specs cluster.
 *
 * It lists the platforms that have at least one recorded value and nothing
 * else. A platform whose adapter is absent from this build is not a row with
 * an apology on it: it is not here, and the section below says why in one
 * paragraph rather than repeating itself once per missing platform. The
 * `/schedule` cluster is where the whole cohort is still listed, including the
 * platforms with nothing recorded.
 */
export default async function SpecsIndexPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <PageIntro title={t.t('web.specs.index.title')} lede={t.t('web.specs.index.lede')} />

      <Section id="platforms" ariaLabel={t.t('web.specs.index.listLabel')}>
        <Notice
          tone="neutral"
          title={t.t('web.specs.notice.title')}
          description={t.t('web.specs.notice.body')}
          className="mb-10"
        />
        <ul className="border-border-bold border-t-2">
          {SPEC_PLATFORMS.map((platform) => (
            <RowLink
              key={platform.slug}
              href={specsPlatformPath(platform.slug)}
              title={t.format(platform.nameKey)}
              meta={<Meta>{t.t('web.specs.index.count', { count: platform.entries.length })}</Meta>}
            />
          ))}
        </ul>
      </Section>

      <Section id="method">
        <Split aside={<Heading>{t.t('web.specs.index.methodTitle')}</Heading>}>
          <Body>{t.t('web.specs.index.methodBody')}</Body>
          <p className="mt-6">
            <TextLink href={ROUTES.toolPostPreflight}>{t.t('web.tools.preflight.name')}</TextLink>
          </p>
          <p className="mt-2">
            <TextLink href={ROUTES.schedule}>{t.t('web.schedule.index.title')}</TextLink>
          </p>
          <p className="mt-2">
            <TextLink href={ROUTES.specsDimensions}>
              {t.t('web.specs.dimensions.index.link')}
            </TextLink>
          </p>
        </Split>
      </Section>

      <Section id="missing">
        <Split aside={<Heading>{t.t('web.specs.index.missingTitle')}</Heading>}>
          <Body>{t.t('web.specs.index.missingBody')}</Body>
          <p className="mt-6">
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
            { name: t.t('web.specs.index.title'), path: ROUTES.specs },
          ],
          locale,
        )}
      />
    </>
  );
}
