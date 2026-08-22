import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { buildSnippet } from '@/features/developer/lib/setup-snippets';
import {
  ClosingCta,
  EditorialCard,
  EditorialDisplay,
  EditorialSection,
  Eyebrow,
} from '@/features/marketing/components/editorial';
import {
  Body,
  Fact,
  FactList,
  Heading,
  Lede,
  List,
  Split,
} from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { DOC_PRINCIPLES } from '@/features/marketing/data/catalogs';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

/**
 * The `cli` snippet from `features/developer/lib/setup-snippets.ts` (the
 * developer portal's own copyable CLI setup), generated rather than retyped,
 * so this terminal cannot show a command the CLI does not have. The two lines
 * kept are the two that do something: the `config`/`login` pair above them is
 * setup, and this block is about what the tool is for.
 *
 * `relay.example` is the RFC 2606 example domain. Nothing here is live.
 */
const TERMINAL_LINES = buildSnippet('cli', {
  mcpEndpoint: 'https://mcp.relay.example/mcp',
  apiBaseUrl: 'https://api.relay.example',
  serviceAccountName: 'relay-agent',
})
  .split('\n')
  .filter((line) => line.startsWith('relay '))
  .slice(-2);

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
      <EditorialSection reveal={false} containerClassName="py-24 md:py-32">
        <div className="max-w-[52rem]">
          <EditorialDisplay as="h1" size="md" reveal>
            {t.t('web.developers.title')}
          </EditorialDisplay>
          <Lede className="mt-8">{t.t('web.developers.lede')}</Lede>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Cta href={ROUTES.docs}>{t.t('web.cta.readDocs')}</Cta>
            <Cta href={ROUTES.apiTerms} variant="secondary">
              {t.t('web.legal.apiTerms.title')}
            </Cta>
          </div>
        </div>

        {/*
          Two real CLI commands. The drawn traffic-light title bar that used
          to sit above them is gone: it was a window chrome illustration
          pretending the page had a screenshot of a terminal, and the commands
          themselves are the evidence. What is left is a code block on a
          sunken surface, which is what this is.
        */}
        <div className="mt-16 max-w-[36rem]">
          <Eyebrow as="h2" className="mb-4">
            {t.t('web.developers.v2.terminal.title')}
          </Eyebrow>
          <EditorialCard tone="sunken" interactive={false} flush>
            <pre className="text-body-md relay-scroll-x px-5 py-5 font-mono leading-[1.9]">
              {TERMINAL_LINES.map((line) => (
                <code key={line} className="block">
                  <span aria-hidden="true" className="text-text-tertiary">
                    {'$ '}
                  </span>
                  <span className="text-text-primary">{line}</span>
                </code>
              ))}
            </pre>
          </EditorialCard>
        </div>
      </EditorialSection>

      <EditorialSection rule id="surfaces">
        <Split aside={<Heading>{t.t('web.home.surfaces.title')}</Heading>}>
          <FactList className="border-t-0">
            {SURFACES.map((surface) => (
              <Fact key={surface.id} term={t.format(surface.titleKey)}>
                {t.format(surface.bodyKey)}
              </Fact>
            ))}
          </FactList>
        </Split>
      </EditorialSection>

      <EditorialSection rule id="safety">
        <Split aside={<Heading>{t.t('web.developers.safety.title')}</Heading>}>
          <div className="space-y-4">
            {SAFETY.map((key) => (
              <Body key={key}>{t.format(key)}</Body>
            ))}
          </div>
        </Split>
      </EditorialSection>

      <EditorialSection rule id="guarantees">
        <Split aside={<Heading>{t.t('web.docs.principles.title')}</Heading>}>
          <List items={DOC_PRINCIPLES.map((key) => t.format(key))} />
        </Split>
      </EditorialSection>

      <EditorialSection rule id="open">
        <Split aside={<Heading>{t.t('web.developers.openSource.title')}</Heading>}>
          <Body>{t.t('web.developers.openSource.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.capabilities}>{t.t('nav.public.capabilities')}</TextLink>
          </p>
        </Split>
      </EditorialSection>

      <ClosingCta
        id="start"
        title={t.t('web.marketing.v2.closing.title')}
        body={t.t('web.marketing.v2.closing.body')}
        cta={{ href: ROUTES.signUp, label: t.t('web.cta.startTrial') }}
        footnote={t.t('web.cta.trialFootnote')}
      />
    </>
  );
}
