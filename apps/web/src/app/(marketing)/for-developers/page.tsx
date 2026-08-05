import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import {
  Body,
  Fact,
  FactList,
  Heading,
  List,
  Section,
  Split,
} from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import { DOC_PRINCIPLES } from '@/features/marketing/data/catalogs';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.developers.title',
  'web.meta.developers.description',
  ROUTES.developers,
);

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

export default function ForDevelopersPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro
        title={t.t('web.developers.title')}
        lede={t.t('web.developers.lede')}
        actions={
          <>
            <Cta href={ROUTES.docs}>{t.t('web.cta.readDocs')}</Cta>
            <Cta href={ROUTES.apiTerms} variant="secondary">
              {t.t('web.legal.apiTerms.title')}
            </Cta>
          </>
        }
      />

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
    </>
  );
}
