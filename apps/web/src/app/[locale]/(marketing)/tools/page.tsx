import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Reveal } from '@/components/motion';
import { Body, Heading, Lede, Section, Split } from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { Band } from '@/features/marketing/components/loud/band';
import { LoudDisplay } from '@/features/marketing/components/loud/display';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES, TOOL_LINKS } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('web.meta.tools.title', 'web.meta.tools.description', ROUTES.tools, locale);
}

/**
 * The free tools index.
 *
 * A list, not a grid of identical cards. Each tool gets a line that says what
 * it does; nothing here promises the product publishes anywhere, because it
 * does not yet.
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
      <Band tone="paper">
        <Reveal className="max-w-[46rem]">
          <LoudDisplay as="h1" size="xl">
            {t.t('web.tools.index.title')}
          </LoudDisplay>
          <Lede className="mt-6">{t.t('web.tools.index.lede')}</Lede>
        </Reveal>
      </Band>

      <Section id="tools" ariaLabel={t.t('web.tools.index.title')}>
        <ul className="border-border-bold border-t-2">
          {TOOL_LINKS.map((link) => (
            <li key={link.href} className="border-border-default border-b py-8">
              <h2 className="text-title-md text-text-primary">
                <TextLink href={link.href}>{t.format(link.labelKey)}</TextLink>
              </h2>
              {link.descriptionKey === undefined ? null : (
                <p className="text-body-md text-text-tertiary mt-2 max-w-[68ch] leading-[1.6]">
                  {t.format(link.descriptionKey)}
                </p>
              )}
            </li>
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
