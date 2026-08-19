import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system/primitives';

import { Body, Heading, Section, Split, Subheading } from '@/features/marketing/components/layout';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { TextLink } from '@/features/marketing/components/links';
import {
  CorrectionNotice,
  PageIntro,
  SourceNote,
} from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';
import { formatLimitValue } from '@/features/platforms/format-limit';
import { MEDIA_SPEC_PLATFORMS } from '@/features/tools/media-specs';

/**
 * The consolidated media limits table.
 *
 * One table per platform, and one row per field the generated dataset actually
 * carries. The filtering happens in `features/tools/media-specs`, so there is
 * no branch on this page that could print an empty cell, a zero standing in for
 * a missing ceiling, or a platform whose adapter this build does not ship.
 *
 * It is a reference page rather than a calculator, so it is entirely server
 * rendered and ships no JavaScript of its own. The preflight checker, linked at
 * the end, is where a real file gets measured against these numbers.
 */

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.toolDirectory.media.title',
    'web.meta.toolDirectory.media.description',
    ROUTES.toolImageSizes,
    locale,
  );
}

export default async function SocialMediaImageSizesPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <PageIntro
        title={t.t('web.toolDirectory.media.title')}
        lede={t.t('web.toolDirectory.media.lede')}
      >
        <Notice
          tone="neutral"
          className="mt-8"
          title={t.t('web.specs.notice.title')}
          description={t.t('web.specs.notice.body')}
        />
      </PageIntro>

      <Section id="platforms" ariaLabel={t.t('web.toolDirectory.media.listLabel')}>
        <div className="flex flex-col gap-14">
          {MEDIA_SPEC_PLATFORMS.map((platform) => {
            const name = t.format(platform.nameKey);
            return (
              <section key={platform.slug} aria-labelledby={`media-${platform.slug}`}>
                <Subheading as="h2" id={`media-${platform.slug}`}>
                  {name}
                </Subheading>
                <TableContainer className="mt-4">
                  <Table density="comfortable">
                    <TableCaption className="sr-only">
                      {t.t('web.toolDirectory.media.tableCaption', { platform: name })}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.t('web.toolDirectory.media.column.limit')}</TableHead>
                        <TableHead>{t.t('web.toolDirectory.media.column.value')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {platform.rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableRowHeader>{t.format(row.labelKey)}</TableRowHeader>
                          <TableCell>{formatLimitValue(row.value, t, locale)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {platform.source === null ? null : (
                  <SourceNote
                    className="mt-3"
                    citation={platform.source}
                    label={t.t('web.specs.detail.sourceLabel')}
                    locale={locale}
                  />
                )}
              </section>
            );
          })}
        </div>
      </Section>

      <Section id="pixels">
        <Split aside={<Heading>{t.t('web.toolDirectory.media.pixelsTitle')}</Heading>}>
          <Body>{t.t('web.toolDirectory.media.pixelsBody')}</Body>
        </Split>
      </Section>

      <Section id="missing">
        <Split aside={<Heading>{t.t('web.toolDirectory.media.missingTitle')}</Heading>}>
          <Body>{t.t('web.toolDirectory.media.missingBody')}</Body>
          <p className="mt-6">
            <TextLink href={ROUTES.capabilities}>{t.t('nav.public.capabilities')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="check">
        <Split aside={<Heading>{t.t('web.toolDirectory.media.checkTitle')}</Heading>}>
          <Body>{t.t('web.toolDirectory.media.checkBody')}</Body>
          <p className="mt-6">
            <TextLink href={ROUTES.toolPostPreflight}>{t.t('web.tools.preflight.name')}</TextLink>
          </p>
          <p className="mt-2">
            <TextLink href={ROUTES.specs}>{t.t('web.specs.index.title')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="privacy">
        <Split aside={<Heading>{t.t('web.tools.index.dataTitle')}</Heading>}>
          <Body>{t.t('web.tools.index.dataBody')}</Body>
          <Body className="mt-4">{t.t('web.tools.index.honesty')}</Body>
        </Split>
      </Section>

      <Section id="corrections">
        <CorrectionNotice locale={locale} />
      </Section>

      <JsonLd
        node={breadcrumbJsonLd(
          [
            { name: t.t('web.brand.name'), path: ROUTES.home },
            { name: t.t('web.tools.index.title'), path: ROUTES.tools },
            { name: t.t('web.toolDirectory.media.title'), path: ROUTES.toolImageSizes },
          ],
          locale,
        )}
      />
    </>
  );
}
