import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import type { MessageKey } from '@relay/i18n/translate';
import { Notice } from '@relay/design-system/patterns';

import {
  Fact,
  FactList,
  Heading,
  Meta,
  Section,
  Split,
} from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  CorrectionNotice,
  PageIntro,
  SourceNote,
} from '@/features/marketing/components/page-parts';
import {
  basisLabelKey,
  formatPixels,
  type MediaDimensionRow,
  variantLabelKey,
} from '@/features/marketing/data/media-dimensions';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, faqJsonLd } from '@/features/marketing/seo';
import { ROUTES, dimensionsPlatformPath, dimensionsSurfacePath } from '@/features/marketing/site';
import { referencePageJsonLd } from '@/features/marketing/structured-data';
import { formattedPageMetadata } from '@/features/platforms/metadata';
import {
  DIMENSION_SURFACE_PAIRS,
  findDimensionSurface,
  surfaceSlug,
} from '@/features/specs/dimensions';

/**
 * One recorded image surface, on its own page: "YouTube thumbnail size".
 *
 * The answer (width, height, what kind of number it is, the day it was read)
 * is in the title, the description and the first sentence. Like the platform
 * page above it, a surface exists only because a sourced row exists.
 */

export function generateStaticParams(): readonly {
  readonly platform: string;
  readonly surface: string;
}[] {
  return DIMENSION_SURFACE_PAIRS.map((pair) => ({ ...pair }));
}

interface Params {
  readonly locale: string;
  readonly platform: string;
  readonly surface: string;
}

function surfaceCopy(
  row: MediaDimensionRow,
  platformName: string,
  t: Awaited<ReturnType<typeof marketingTranslator>>,
  locale: string,
): { readonly title: string; readonly sentence: string } {
  const values = {
    platform: platformName,
    width: row.width.toLocaleString(locale),
    height: row.height.toLocaleString(locale),
    basis: row.basis,
    verified: formatDate(row.source.readOn, locale),
  };
  const base = `web.specs.dimensions.surface.${row.variant}`;
  return {
    title: t.format(`${base}.title` as MessageKey, values),
    sentence: t.format(`${base}.sentence` as MessageKey, values),
  };
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, platform, surface } = await params;
  const found = findDimensionSurface(platform, surface);
  if (!found) {
    return {};
  }
  const t = await marketingTranslator(locale);
  const copy = surfaceCopy(found.row, t.format(found.platform.nameKey), t, locale);
  return formattedPageMetadata({
    title: copy.title,
    description: copy.sentence,
    path: dimensionsSurfacePath(found.platform.slug, surface),
    locale,
    siteName: t.t('web.brand.name'),
  });
}

export default async function DimensionsSurfacePage({
  params,
}: {
  readonly params: Promise<Params>;
}): Promise<ReactNode> {
  const { locale, platform, surface } = await params;
  const found = findDimensionSurface(platform, surface);
  if (!found) {
    notFound();
  }

  const t = await marketingTranslator(locale);
  const { row } = found;
  const entry = found.platform;
  const name = t.format(entry.nameKey);
  const copy = surfaceCopy(row, name, t, locale);
  const path = dimensionsSurfacePath(entry.slug, surface);
  const others = entry.rows.filter((candidate) => candidate.variant !== row.variant);

  return (
    <>
      <PageIntro title={copy.title} lede={copy.sentence}>
        <Notice
          tone="neutral"
          className="mt-8"
          title={t.t('web.specs.notice.title')}
          description={t.t('web.specs.notice.body')}
        />
      </PageIntro>

      <Section id="value">
        <Split aside={<Heading>{t.t('web.specs.detail.valueTitle')}</Heading>}>
          <FactList>
            <Fact term={t.format(variantLabelKey(row.variant))}>
              {formatPixels(row)}
              <Meta className="mt-1 block">
                {row.aspectRatio ?? t.t('web.specs.dimensions.platform.ratioUnstated')}
                {', '}
                {t.format(basisLabelKey(row.basis))}
              </Meta>
            </Fact>
          </FactList>
          <SourceNote
            className="mt-6"
            citation={row.source}
            label={row.source.title}
            locale={locale}
          />
        </Split>
      </Section>

      {others.length === 0 ? null : (
        <Section id="others" ariaLabel={t.t('web.specs.dimensions.platform.listLabel')}>
          <Split
            aside={
              <Heading>
                {t.t('web.specs.dimensions.surface.otherTitle', { platform: name })}
              </Heading>
            }
          >
            <ul className="border-border-bold border-t-2">
              {others.map((other) => (
                <RowLink
                  key={other.variant}
                  href={dimensionsSurfacePath(entry.slug, surfaceSlug(other.variant))}
                  title={t.format(variantLabelKey(other.variant))}
                  meta={<Meta>{formatPixels(other)}</Meta>}
                />
              ))}
            </ul>
            <p className="mt-6">
              <TextLink href={dimensionsPlatformPath(entry.slug)}>
                {t.t('web.meta.dimensionsPlatform.title', { platform: name })}
              </TextLink>
            </p>
          </Split>
        </Section>
      )}

      <Section id="corrections">
        <CorrectionNotice locale={locale} />
      </Section>

      <JsonLd
        node={referencePageJsonLd({
          name: copy.title,
          description: copy.sentence,
          path,
          verifiedOn: row.source.readOn,
          citationUrls: [row.source.url],
          publisherName: t.t('web.brand.name'),
        })}
      />
      <JsonLd node={faqJsonLd([{ question: copy.title, answer: copy.sentence }], 'en')} />
      <JsonLd
        node={breadcrumbJsonLd(
          [
            { name: t.t('web.brand.name'), path: ROUTES.home },
            { name: t.t('web.specs.index.title'), path: ROUTES.specs },
            { name: t.t('web.specs.dimensions.index.title'), path: ROUTES.specsDimensions },
            { name, path: dimensionsPlatformPath(entry.slug) },
            { name: t.format(variantLabelKey(row.variant)), path },
          ],
          locale,
        )}
      />
    </>
  );
}
