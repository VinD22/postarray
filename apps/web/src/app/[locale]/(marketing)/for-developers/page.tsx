import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Reveal } from '@/components/motion';
import {
  Body,
  Fact,
  FactList,
  Heading,
  Lede,
  List,
  Section,
  Split,
} from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { Band } from '@/features/marketing/components/loud/band';
import { CtaSlab } from '@/features/marketing/components/loud/cta-slab';
import { LoudDisplay } from '@/features/marketing/components/loud/display';
import { PosterCard } from '@/features/marketing/components/loud/poster-card';
import { DOC_PRINCIPLES } from '@/features/marketing/data/catalogs';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

/**
 * The exact `cli` snippet lines from `features/developer/lib/setup-snippets.ts`
 * (the developer portal's own copyable CLI setup), reused verbatim rather
 * than invented, so this terminal never shows a command the product does
 * not actually have.
 */
const TERMINAL_LINES = [
  'relay connections list --json',
  'relay draft create --brief ./brief.md --json',
] as const;

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.developers.title',
    'web.meta.developers.description',
    ROUTES.developers,
    locale,
  );
}

const SURFACES = [
  {
    id: 'api',
    titleKey: 'web.developers.surface.api.title',
    bodyKey: 'web.developers.surface.api.body',
  },
  {
    id: 'mcp',
    titleKey: 'web.developers.surface.mcp.title',
    bodyKey: 'web.developers.surface.mcp.body',
  },
  {
    id: 'cli',
    titleKey: 'web.developers.surface.cli.title',
    bodyKey: 'web.developers.surface.cli.body',
  },
  {
    id: 'webhooks',
    titleKey: 'web.developers.surface.webhooks.title',
    bodyKey: 'web.developers.surface.webhooks.body',
  },
] as const;

const SAFETY = [
  'web.developers.safety.body',
  'web.developers.safety.injection',
  'web.developers.safety.killSwitch',
] as const;

export default async function ForDevelopersPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <Band tone="paper">
        <Reveal className="max-w-[52rem]">
          <LoudDisplay as="h1" size="xl">
            {t.t('web.developers.title')}
          </LoudDisplay>
          <Lede className="mt-6">{t.t('web.developers.lede')}</Lede>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Cta href={ROUTES.docs}>{t.t('web.cta.readDocs')}</Cta>
            <Cta href={ROUTES.apiTerms} variant="secondary">
              {t.t('web.legal.apiTerms.title')}
            </Cta>
          </div>
        </Reveal>

        {/* The fake-terminal moment: real CLI lines, reveal-in once, static
            under reduced motion (`Reveal`'s own contract). */}
        <Reveal delay={0.15} className="mt-12 max-w-[36rem]">
          <h2 className="text-label text-text-tertiary mb-3 tracking-wide uppercase">
            {t.t('web.developers.v2.terminal.title')}
          </h2>
          <PosterCard tone="ink" className="p-0">
            <div
              aria-hidden="true"
              className="bg-surface-inverted flex items-center gap-1.5 rounded-t-[calc(var(--radius-lg)-2px)] px-4 py-3"
            >
              <span className="bg-text-inverted/70 size-2 rounded-full" />
              <span className="bg-text-inverted/50 size-2 rounded-full" />
              <span className="bg-text-inverted/30 size-2 rounded-full" />
            </div>
            <pre className="text-body-md overflow-x-auto px-4 py-4 font-mono leading-[1.8]">
              {TERMINAL_LINES.map((line) => (
                <code key={line} className="block">
                  <span aria-hidden="true" className="text-text-inverted/50">
                    {'$ '}
                  </span>
                  {line}
                </code>
              ))}
            </pre>
          </PosterCard>
        </Reveal>
      </Band>

      <Section id="surfaces">
        <Split aside={<Heading>{t.t('web.home.surfaces.title')}</Heading>}>
          <FactList className="border-t-0">
            {SURFACES.map((surface) => (
              <Fact key={surface.id} term={t.format(surface.titleKey)}>
                {t.format(surface.bodyKey)}
              </Fact>
            ))}
          </FactList>
        </Split>
      </Section>

      <Section id="safety">
        <Split aside={<Heading>{t.t('web.developers.safety.title')}</Heading>}>
          <div className="space-y-4">
            {SAFETY.map((key) => (
              <Body key={key}>{t.format(key)}</Body>
            ))}
          </div>
        </Split>
      </Section>

      <Section id="guarantees">
        <Split aside={<Heading>{t.t('web.docs.principles.title')}</Heading>}>
          <List items={DOC_PRINCIPLES.map((key) => t.format(key))} />
        </Split>
      </Section>

      <Section id="open">
        <Split aside={<Heading>{t.t('web.developers.openSource.title')}</Heading>}>
          <Body>{t.t('web.developers.openSource.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.capabilities}>{t.t('nav.public.capabilities')}</TextLink>
          </p>
        </Split>
      </Section>

      <CtaSlab
        id="start"
        title={t.t('web.marketing.v2.closing.title')}
        body={t.t('web.marketing.v2.closing.body')}
        cta={{ href: ROUTES.signUp, label: t.t('web.cta.startTrial') }}
        footnote={t.t('web.cta.trialFootnote')}
      />
    </>
  );
}
