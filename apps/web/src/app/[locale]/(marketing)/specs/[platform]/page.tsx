import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';

import { Body, Heading, Meta, Section, Split } from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  CorrectionNotice,
  PageIntro,
  SourceNote,
} from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd } from '@/features/marketing/seo';
import {
  ROUTES,
  schedulePlatformPath,
  specsConstraintPath,
  specsPlatformPath,
} from '@/features/marketing/site';
import { formatLimitValue } from '@/features/platforms/format-limit';
import { templatedPageMetadata } from '@/features/platforms/metadata';
import { SPEC_PLATFORM_SLUGS, findSpecPlatform } from '@/features/specs/registry';

/**
 * One platform's recorded values, as an index of the pages beneath it.
 *
 * Every row here corresponds to a page that exists, and a page exists only
 * where the generated dataset carried a value, so this list cannot advertise a
 * limit nobody recorded. There is no "unavailable" row: an absent value is an
 * absent row, which is the difference between this cluster and the `/schedule`
 * pages, where the full grid is shown with the gaps named.
 */

export function generateStaticParams(): readonly { readonly platform: string }[] {
  return SPEC_PLATFORM_SLUGS.map((platform) => ({ platform }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly platform: string }>;
}): Promise<Metadata> {
  const { locale, platform } = await params;
  const page = findSpecPlatform(platform);
  if (!page) {
    return {};
  }
  const t = await marketingTranslator(locale);
  return templatedPageMetadata({
    titleKey: 'web.meta.specsPlatform.title',
    descriptionKey: 'web.meta.specsPlatform.description',
    values: { platform: t.format(page.nameKey) },
    path: specsPlatformPath(page.slug),
    locale,
  });
}

export default async function SpecsPlatformPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly platform: string }>;
}): Promise<ReactNode> {
  const { locale, platform } = await params;
  const page = findSpecPlatform(platform);
  if (!page) {
    notFound();
  }

  const t = await marketingTranslator(locale);
  const name = t.format(page.nameKey);

  return (
    <>
      <PageIntro
        title={t.t('web.meta.specsPlatform.title', { platform: name })}
        lede={t.t('web.specs.platform.limitsBody')}
      >
        <Notice
          tone="neutral"
          className="mt-8"
          title={t.t('web.specs.notice.title')}
          description={t.t('web.specs.notice.body')}
        />
      </PageIntro>

      <Section id="limits" ariaLabel={t.t('web.specs.platform.listLabel')}>
        <Split
          aside={<Heading>{t.t('web.specs.platform.limitsTitle', { platform: name })}</Heading>}
        >
          <ul className="border-border-bold border-t-2">
            {page.entries.map((entry) => (
              <RowLink
                key={entry.constraint.slug}
                href={specsConstraintPath(page.slug, entry.constraint.slug)}
                title={t.format(entry.constraint.nameKey)}
                meta={<Meta>{formatLimitValue(entry.value, t, locale)}</Meta>}
              />
            ))}
          </ul>
          {page.source === null ? null : (
            <SourceNote
              className="mt-6"
              citation={page.source}
              label={t.t('web.specs.detail.sourceLabel')}
              locale={locale}
            />
          )}
        </Split>
      </Section>

      <Section id="freshness">
        <Split aside={<Heading>{t.t('web.specs.detail.freshnessTitle')}</Heading>}>
          <Body>{t.t('web.specs.detail.freshnessBody')}</Body>
          <p className="mt-6">
            <TextLink href={schedulePlatformPath(page.slug)}>
              {t.t('web.specs.detail.scheduleLink')}
            </TextLink>
          </p>
          <p className="mt-2">
            <TextLink href={ROUTES.specs}>{t.t('web.specs.index.title')}</TextLink>
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
            { name, path: specsPlatformPath(page.slug) },
          ],
          locale,
        )}
      />
    </>
  );
}
