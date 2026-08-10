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
import { ExternalLink, TextLink } from '@/features/marketing/components/links';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  CorrectionNotice,
  PageIntro,
  SourceNote,
} from '@/features/marketing/components/page-parts';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd } from '@/features/marketing/seo';
import { ROUTES, schedulePlatformPath } from '@/features/marketing/site';
import { formatLimitValue } from '@/features/platforms/format-limit';
import { templatedPageMetadata } from '@/features/platforms/metadata';
import { PLATFORM_SLUGS, findPlatformPage } from '@/features/platforms/registry';
import { buildPlatformViewModel } from '@/features/platforms/view-model';

/**
 * One platform.
 *
 * Every fact on this page arrives through `buildPlatformViewModel`, which
 * reads the generated publishing-limits dataset and the generated connector
 * capability states. This file contains no platform name, no ceiling, no file
 * size and no capability word of its own, which is what makes the honesty
 * mechanical rather than a matter of care: a page cannot claim support the
 * connectors do not have, because there is nowhere to write the claim.
 *
 * The banner is the pattern the blog established. It is not a disclaimer
 * bolted on: no connector has passed its definition of done, so a page about
 * scheduling has to open by saying that nothing schedules yet.
 */

export function generateStaticParams(): readonly { readonly platform: string }[] {
  return PLATFORM_SLUGS.map((platform) => ({ platform }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly platform: string }>;
}): Promise<Metadata> {
  const { locale, platform } = await params;
  const page = findPlatformPage(platform);
  if (!page) {
    return {};
  }
  const t = await marketingTranslator(locale);
  return templatedPageMetadata({
    titleKey: 'web.meta.schedulePlatform.title',
    descriptionKey: 'web.meta.schedulePlatform.description',
    values: { platform: t.format(page.nameKey) },
    path: schedulePlatformPath(page.slug),
    locale,
  });
}

export default async function PlatformSchedulePage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string; readonly platform: string }>;
}): Promise<ReactNode> {
  const { locale, platform } = await params;
  const page = findPlatformPage(platform);
  if (!page) {
    notFound();
  }

  const t = await marketingTranslator(locale);
  const model = buildPlatformViewModel(page);
  const name = t.format(page.nameKey);

  return (
    <>
      <PageIntro
        title={t.t('web.schedule.platform.title', { platform: name })}
        lede={t.t('web.schedule.platform.lede', { platform: name })}
      >
        <Notice
          tone="neutral"
          className="mt-8"
          title={t.t('web.schedule.notice.title', { platform: name })}
          description={t.t('web.schedule.notice.body')}
        />
      </PageIntro>

      <Section id="requirements">
        <Split
          aside={<Heading>{t.t('web.schedule.requirements.title', { platform: name })}</Heading>}
        >
          {model.requirements === null ? (
            <Notice
              tone="neutral"
              title={t.t('web.schedule.requirements.unavailable.title')}
              description={t.t('web.schedule.requirements.unavailable.body')}
            />
          ) : (
            <>
              <FactList>
                {model.requirements.map((row) => (
                  <Fact key={row.id} term={t.format(row.labelKey)}>
                    {t.format(row.bodyKey)}
                  </Fact>
                ))}
              </FactList>
              <div className="mt-6 space-y-2">
                {model.apiSource === null ? null : (
                  <SourceNote
                    citation={model.apiSource}
                    label={t.t('web.schedule.requirements.apiSource')}
                    locale={locale}
                  />
                )}
                {model.policySource === null ? null : (
                  <SourceNote
                    citation={model.policySource}
                    label={t.t('web.schedule.requirements.policySource')}
                    locale={locale}
                  />
                )}
              </div>
            </>
          )}
        </Split>
      </Section>

      <Section id="limits">
        <Split aside={<Heading>{t.t('web.schedule.limits.title', { platform: name })}</Heading>}>
          {model.limitRows === null ? (
            <Notice
              tone="neutral"
              title={t.t('web.schedule.limits.unavailable.title', { platform: name })}
              description={t.t('web.schedule.limits.unavailable.body')}
            />
          ) : (
            <>
              <Body>{t.t('web.schedule.limits.lede')}</Body>
              <FactList className="mt-8">
                {model.limitRows.map((row) => (
                  <Fact key={row.id} term={t.format(row.labelKey)}>
                    {formatLimitValue(row.value, t, locale)}
                  </Fact>
                ))}
              </FactList>
              {model.limitSource === null ? null : (
                <SourceNote
                  className="mt-6"
                  citation={model.limitSource}
                  label={t.t('web.schedule.limits.sourceLabel')}
                  locale={locale}
                />
              )}
            </>
          )}
        </Split>
      </Section>

      <Section id="capabilities">
        <Split
          aside={<Heading>{t.t('web.schedule.capabilities.title', { platform: name })}</Heading>}
        >
          {model.capabilities === null ? (
            <Notice
              tone="neutral"
              title={t.t('web.schedule.capabilities.unavailable.title', { platform: name })}
              description={t.t('web.schedule.capabilities.unavailable.body')}
            />
          ) : (
            <>
              <Body>{t.t('web.schedule.capabilities.lede')}</Body>
              <FactList className="mt-8">
                {model.capabilities.map((row) => (
                  <Fact key={row.column} term={t.format(row.labelKey)}>
                    <span className="block">{t.format(row.stateLabelKey)}</span>
                    {row.noteKey === undefined ? null : (
                      <span className="text-body-md text-text-secondary mt-1 block leading-[1.6]">
                        {t.format(row.noteKey)}
                      </span>
                    )}
                    {row.citation === undefined ? null : (
                      <span className="mt-1 block">
                        <ExternalLink href={row.citation.url}>
                          {t.t('web.label.officialSource')}
                        </ExternalLink>{' '}
                        <Meta>
                          {t.t('web.label.researchDate', {
                            date: formatDate(row.citation.readOn, locale),
                          })}
                        </Meta>
                      </span>
                    )}
                  </Fact>
                ))}
              </FactList>
              <p className="mt-6">
                <TextLink href={ROUTES.capabilities}>
                  {t.t('web.schedule.capabilities.matrixLink')}
                </TextLink>
              </p>
            </>
          )}
        </Split>
      </Section>

      <Section id="next">
        <Split aside={<Heading>{t.t('web.schedule.next.title')}</Heading>}>
          <Body>{t.t('web.schedule.next.body')}</Body>
          <p className="mt-6">
            <TextLink href={ROUTES.schedule}>{t.t('web.schedule.index.title')}</TextLink>
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
            { name, path: schedulePlatformPath(page.slug) },
          ],
          locale,
        )}
      />
    </>
  );
}
