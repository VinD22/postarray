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
import { SPEC_PAIRS, findSpecEntry } from '@/features/specs/registry';
import { preflightPlatformHref } from '@/features/tools/preflight-link';

/**
 * One recorded value, on its own page.
 *
 * The page has exactly one job: state the value, say where it came from, say
 * when a person last read that source, and hand the reader the tool that
 * measures a real draft against it. It cannot state a value the dataset does
 * not have, because `findSpecEntry` only answers for pairs the registry built
 * from a non-null field, and every other pair is a 404 rather than a page with
 * a hole in it.
 *
 * The value itself is formatted by the same helper the `/schedule` pages use,
 * so a byte count, a duration and a character ceiling read identically here
 * and there, in the reader's locale, with no number typed in this file.
 */

export function generateStaticParams(): readonly {
  readonly platform: string;
  readonly constraint: string;
}[] {
  return SPEC_PAIRS.map((pair) => ({ platform: pair.platform, constraint: pair.constraint }));
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{
    readonly locale: string;
    readonly platform: string;
    readonly constraint: string;
  }>;
}): Promise<Metadata> {
  const { locale, platform, constraint } = await params;
  const found = findSpecEntry(platform, constraint);
  if (!found) {
    return {};
  }
  const t = await marketingTranslator(locale);
  return templatedPageMetadata({
    titleKey: found.entry.constraint.titleKey,
    descriptionKey: found.entry.constraint.descriptionKey,
    values: { platform: t.format(found.platform.nameKey) },
    path: specsConstraintPath(found.platform.slug, found.entry.constraint.slug),
    locale,
  });
}

export default async function SpecsConstraintPage({
  params,
}: {
  readonly params: Promise<{
    readonly locale: string;
    readonly platform: string;
    readonly constraint: string;
  }>;
}): Promise<ReactNode> {
  const { locale, platform, constraint } = await params;
  const found = findSpecEntry(platform, constraint);
  if (!found) {
    notFound();
  }

  const t = await marketingTranslator(locale);
  const page = found.platform;
  const entry = found.entry;
  const name = t.format(page.nameKey);
  const siblings = page.entries.filter(
    (candidate) => candidate.constraint.slug !== entry.constraint.slug,
  );

  return (
    <>
      <PageIntro
        title={t.format(entry.constraint.titleKey, { platform: name })}
        lede={t.format(entry.constraint.ledeKey, { platform: name })}
      >
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
            <Fact term={t.format(entry.constraint.nameKey)}>
              {formatLimitValue(entry.value, t, locale)}
            </Fact>
          </FactList>
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

      <Section id="check">
        <Split aside={<Heading>{t.t('web.specs.detail.checkTitle')}</Heading>}>
          <Body>{t.t('web.specs.detail.checkBody')}</Body>
          <p className="mt-6">
            <TextLink href={preflightPlatformHref(page.slug)}>
              {t.t('web.specs.detail.checkLink')}
            </TextLink>
          </p>
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
        </Split>
      </Section>

      {siblings.length === 0 ? null : (
        <Section id="siblings" ariaLabel={t.t('web.specs.platform.listLabel')}>
          <Split aside={<Heading>{t.t('web.specs.detail.siblingTitle')}</Heading>}>
            <Body>{t.t('web.specs.detail.siblingBody')}</Body>
            <ul className="border-border-bold mt-8 border-t-2">
              {siblings.map((sibling) => (
                <RowLink
                  key={sibling.constraint.slug}
                  href={specsConstraintPath(page.slug, sibling.constraint.slug)}
                  title={t.format(sibling.constraint.nameKey)}
                  meta={<Meta>{formatLimitValue(sibling.value, t, locale)}</Meta>}
                />
              ))}
            </ul>
            <p className="mt-6">
              <TextLink href={specsPlatformPath(page.slug)}>
                {t.t('web.meta.specsPlatform.title', { platform: name })}
              </TextLink>
            </p>
          </Split>
        </Section>
      )}

      <Section id="corrections">
        <CorrectionNotice locale={locale} />
      </Section>

      <JsonLd
        node={breadcrumbJsonLd(
          [
            { name: t.t('web.brand.name'), path: ROUTES.home },
            { name: t.t('web.specs.index.title'), path: ROUTES.specs },
            { name, path: specsPlatformPath(page.slug) },
            {
              name: t.format(entry.constraint.nameKey),
              path: specsConstraintPath(page.slug, entry.constraint.slug),
            },
          ],
          locale,
        )}
      />
    </>
  );
}
