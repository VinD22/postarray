import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import {
  Body,
  Heading,
  Lede,
  Meta,
  Section,
  Split,
  Subheading,
} from '@/features/marketing/components/layout';
import { RowLink, TextLink } from '@/features/marketing/components/links';
import { EditorialDisplay, EditorialSection } from '@/features/marketing/components/editorial';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES, TOOL_LINKS, characterCounterPath } from '@/features/marketing/site';
import { CHARACTER_COUNTER_PAGES } from '@/features/tools/character-counter';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.tools.title',
    'web.meta.toolDirectory.index.description',
    ROUTES.tools,
    locale,
  );
}

/**
 * The media limits table is a tool in its own right, so it belongs in
 * `TOOL_LINKS` for the footer, the llms.txt index and the other-tools list on
 * every tool page. On this page it heads its own group instead, because "image
 * and video specs" is the thing a person is looking for, not "the sixth
 * calculator".
 */
const MEDIA_SPEC_LINKS = TOOL_LINKS.filter((link) => link.href === ROUTES.toolImageSizes);

/**
 * The text and caption utilities: shaping a caption's text rather than
 * checking it against a platform ceiling. Grouped apart from the calculators
 * above for the same reason the media table gets its own group: "text and
 * captions" is the thing a person is looking for here, not "a calculator that
 * happens not to check a limit".
 */
const TEXT_TOOL_ROUTES: ReadonlySet<string> = new Set([
  ROUTES.toolThreadSplitter,
  ROUTES.toolHashtagCounter,
  ROUTES.toolCaseConverter,
  ROUTES.toolInvisibleCharacter,
  ROUTES.toolVideoScriptTimer,
]);
const TEXT_TOOL_LINKS = TOOL_LINKS.filter((link) => TEXT_TOOL_ROUTES.has(link.href));

const CALCULATOR_LINKS = TOOL_LINKS.filter(
  (link) => link.href !== ROUTES.toolImageSizes && !TEXT_TOOL_ROUTES.has(link.href),
);

/**
 * The free tools index.
 *
 * A list, not a grid of identical cards. Each tool gets a line that says what
 * it does; nothing here promises the product publishes anywhere, because it
 * does not yet.
 *
 * Four groups, because the directory now has four kinds of thing in it: the
 * calculators a person opens once, the per platform counters they bookmark,
 * the caption-shaping text utilities, and the media table they check before
 * exporting artwork. The counters are generated from the publishing-limits
 * dataset, so a platform with no recorded ceiling is absent from this list
 * rather than present with nothing to say.
 */
export default async function ToolsIndexPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <EditorialSection>
        <div className="max-w-[46rem]">
          <EditorialDisplay as="h1" size="md">
            {t.t('web.tools.index.title')}
          </EditorialDisplay>
          <Lede className="mt-6">{t.t('web.toolDirectory.lede')}</Lede>
        </div>
      </EditorialSection>

      <Section id="tools" ariaLabel={t.t('web.toolDirectory.group.calculators.title')}>
        <Subheading as="h2">{t.t('web.toolDirectory.group.calculators.title')}</Subheading>
        <ul className="border-border-bold mt-8 border-t-2">
          {CALCULATOR_LINKS.map((link) => (
            <li key={link.href} className="border-border-default border-b py-8">
              <h3 className="text-title-md text-text-primary">
                <TextLink href={link.href}>{t.format(link.labelKey)}</TextLink>
              </h3>
              {link.descriptionKey === undefined ? null : (
                <p className="text-body-md text-text-tertiary mt-2 max-w-[68ch] leading-[1.6]">
                  {t.format(link.descriptionKey)}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="character-counters" ariaLabel={t.t('web.toolDirectory.group.counters.title')}>
        <Subheading as="h2">{t.t('web.toolDirectory.group.counters.title')}</Subheading>
        <Body className="mt-3">{t.t('web.toolDirectory.group.counters.body')}</Body>
        <ul className="border-border-bold mt-8 border-t-2">
          {CHARACTER_COUNTER_PAGES.map((page) => (
            <RowLink
              key={page.slug}
              href={characterCounterPath(page.slug)}
              title={t.t('web.toolDirectory.counterLink.title', {
                platform: t.format(page.nameKey),
              })}
              meta={<Meta>{t.t('web.schedule.value.characters', { count: page.maxLength })}</Meta>}
            />
          ))}
        </ul>
      </Section>

      <Section id="text-tools" ariaLabel={t.t('web.toolDirectory.group.text.title')}>
        <Subheading as="h2">{t.t('web.toolDirectory.group.text.title')}</Subheading>
        <Body className="mt-3">{t.t('web.toolDirectory.group.text.body')}</Body>
        <ul className="border-border-bold mt-8 border-t-2">
          {TEXT_TOOL_LINKS.map((link) => (
            <li key={link.href} className="border-border-default border-b py-8">
              <h3 className="text-title-md text-text-primary">
                <TextLink href={link.href}>{t.format(link.labelKey)}</TextLink>
              </h3>
              {link.descriptionKey === undefined ? null : (
                <p className="text-body-md text-text-tertiary mt-2 max-w-[68ch] leading-[1.6]">
                  {t.format(link.descriptionKey)}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="media-specs" ariaLabel={t.t('web.toolDirectory.group.media.title')}>
        <Subheading as="h2">{t.t('web.toolDirectory.group.media.title')}</Subheading>
        <Body className="mt-3">{t.t('web.toolDirectory.group.media.body')}</Body>
        <ul className="border-border-bold mt-8 border-t-2">
          {MEDIA_SPEC_LINKS.map((link) => (
            <RowLink
              key={link.href}
              href={link.href}
              title={t.format(link.labelKey)}
              description={
                link.descriptionKey === undefined ? undefined : t.format(link.descriptionKey)
              }
            />
          ))}
        </ul>
      </Section>

      <Section id="data">
        <Split aside={<Heading>{t.t('web.tools.index.dataTitle')}</Heading>}>
          <Body>{t.t('web.tools.index.dataBody')}</Body>
          <Body className="mt-4">{t.t('web.tools.index.honesty')}</Body>
          <p className="mt-6">
            <TextLink href={ROUTES.capabilities}>{t.t('nav.public.capabilities')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="privacy">
        <Split aside={<Heading>{t.t('web.tools.shared.privacyTitle')}</Heading>}>
          <Body>{t.t('web.tools.shared.privacyBody')}</Body>
        </Split>
      </Section>
    </>
  );
}
