import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';

import { Body, Heading, Meta, Section, Split } from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { CorrectionNotice, PageIntro } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES, dimensionsPlatformPath } from '@/features/marketing/site';
import { DIMENSION_PLATFORMS } from '@/features/specs/dimensions';

/**
 * The index of the image dimensions cluster.
 *
 * It is a sibling of the generated specs index rather than a replacement for
 * it, because the two answer different questions from different kinds of
 * source. The limits pages come from connector code; these come from a hand
 * maintained dataset that carries a source URL and a read date on every single
 * row. The copy says so, in those words, so a reader can weigh them
 * accordingly.
 */

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.dimensions.title',
    'web.meta.dimensions.description',
    ROUTES.specsDimensions,
    locale,
  );
}

export default async function DimensionsIndexPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <PageIntro
        title={t.t('web.specs.dimensions.index.title')}
        lede={t.t('web.specs.dimensions.index.lede')}
      />

      <Section id="platforms" ariaLabel={t.t('web.specs.dimensions.index.listLabel')}>
        <Notice
          tone="neutral"
          title={t.t('web.specs.notice.title')}
          description={t.t('web.specs.notice.body')}
          className="mb-10"
        />
        <ul className="border-border-bold border-t-2">
          {DIMENSION_PLATFORMS.map((entry) => (
            <RowLink
              key={entry.slug}
              href={dimensionsPlatformPath(entry.slug)}
              title={t.format(entry.nameKey)}
              meta={
                <Meta>{t.t('web.specs.dimensions.index.count', { count: entry.rows.length })}</Meta>
              }
            />
          ))}
        </ul>
      </Section>

      <Section id="method">
        <Split aside={<Heading>{t.t('web.specs.dimensions.index.methodTitle')}</Heading>}>
          <Body>{t.t('web.specs.dimensions.index.methodBody')}</Body>
          <p className="mt-6">
            <TextLink href={ROUTES.specs}>{t.t('web.specs.index.title')}</TextLink>
          </p>
          <p className="mt-2">
            <TextLink href={ROUTES.toolPostPreflight}>{t.t('web.tools.preflight.name')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="missing">
        <Split aside={<Heading>{t.t('web.specs.dimensions.index.missingTitle')}</Heading>}>
          <Body>{t.t('web.specs.dimensions.index.missingBody')}</Body>
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
            {
              name: t.t('web.specs.dimensions.index.title'),
              path: ROUTES.specsDimensions,
            },
          ],
          locale,
        )}
      />
    </>
  );
}
