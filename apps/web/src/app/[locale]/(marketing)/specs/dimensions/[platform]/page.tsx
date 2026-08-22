import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';

import {
  Body,
  Fact,
  FactList,
  Heading,
  Meta,
  Section,
  Split,
} from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  CorrectionNotice,
  PageIntro,
  SourceNote,
} from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd } from '@/features/marketing/seo';
import { ROUTES, dimensionsPlatformPath, specsPlatformPath } from '@/features/marketing/site';
import {
  basisLabelKey,
  formatPixels,
  variantLabelKey,
} from '@/features/marketing/data/media-dimensions';
import { templatedPageMetadata } from '@/features/platforms/metadata';
import { DIMENSION_PLATFORM_SLUGS, findDimensionPlatform } from '@/features/specs/dimensions';
import { findSpecPlatform } from '@/features/specs/registry';

/**
 * One platform's recorded image sizes.
 *
 * Every row on this page came out of the hand maintained dataset, and every
 * row prints its own source underneath it rather than borrowing one shared
 * citation from the top of the page. That is deliberate: the surfaces on a
 * single platform are documented in several different places, and a single
 * citation would imply a single document that does not exist.
 */

export function generateStaticParams(): readonly { readonly platform: string }[] {
  return DIMENSION_PLATFORM_SLUGS.map((platform) => ({ platform }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly platform: string }>;
}): Promise<Metadata> {
  const { locale, platform } = await params;
  const entry = findDimensionPlatform(platform);
  if (!entry) {
    return {};
  }
  const t = await marketingTranslator(locale);
  return templatedPageMetadata({
    titleKey: 'web.meta.dimensionsPlatform.title',
    descriptionKey: 'web.meta.dimensionsPlatform.description',
    values: { platform: t.format(entry.nameKey) },
    path: dimensionsPlatformPath(entry.slug),
    locale,
  });
}

export default async function DimensionsPlatformPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly platform: string }>;
}): Promise<ReactNode> {
  const { locale, platform } = await params;
  const entry = findDimensionPlatform(platform);
  if (!entry) {
    notFound();
  }

  const t = await marketingTranslator(locale);
  const name = t.format(entry.nameKey);
  const limitsPage = findSpecPlatform(entry.slug);

  return (
    <>
      <PageIntro
        title={t.t('web.meta.dimensionsPlatform.title', { platform: name })}
        lede={t.t('web.specs.dimensions.platform.body')}
      >
        <Notice
          tone="neutral"
          className="mt-8"
          title={t.t('web.specs.notice.title')}
          description={t.t('web.specs.notice.body')}
        />
      </PageIntro>

      <Section id="sizes" ariaLabel={t.t('web.specs.dimensions.platform.listLabel')}>
        <Split
          aside={
            <Heading>{t.t('web.specs.dimensions.platform.title', { platform: name })}</Heading>
          }
        >
          <FactList>
            {entry.rows.map((row) => (
              <Fact key={row.variant} term={t.format(variantLabelKey(row.variant))}>
                {formatPixels(row)}
                <Meta className="mt-1 block">
                  {row.aspectRatio ?? t.t('web.specs.dimensions.platform.ratioUnstated')}
                  {', '}
                  {t.format(basisLabelKey(row.basis))}
                </Meta>
                <SourceNote
                  className="mt-2"
                  citation={row.source}
                  label={row.source.title}
                  locale={locale}
                />
              </Fact>
            ))}
          </FactList>
        </Split>
      </Section>

      <Section id="freshness">
        <Split aside={<Heading>{t.t('web.specs.dimensions.platform.freshnessTitle')}</Heading>}>
          <Body>{t.t('web.specs.dimensions.platform.freshnessBody')}</Body>
          {limitsPage === undefined ? null : (
            <p className="mt-6">
              <TextLink href={specsPlatformPath(limitsPage.slug)}>
                {t.t('web.specs.dimensions.platform.limitsLink')}
              </TextLink>
            </p>
          )}
          <p className="mt-2">
            <TextLink href={ROUTES.specsDimensions}>
              {t.t('web.specs.dimensions.index.title')}
            </TextLink>
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
            {
              name: t.t('web.specs.dimensions.index.title'),
              path: ROUTES.specsDimensions,
            },
            { name, path: dimensionsPlatformPath(entry.slug) },
          ],
          locale,
        )}
      />
    </>
  );
}
