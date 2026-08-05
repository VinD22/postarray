import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';

import {
  Container,
  Fact,
  FactList,
  Section,
  Subheading,
} from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import {
  CorrectionNotice,
  PageIntro,
  SourceNote,
} from '@/features/marketing/components/page-parts';
import { CONNECTORS } from '@/features/marketing/data/connectors';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.integrations.title',
  'web.meta.integrations.description',
  ROUTES.integrations,
);

export default function IntegrationsPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro
        title={t.t('web.integrations.title')}
        lede={t.t('web.integrations.lede')}
        actions={
          <Cta href={ROUTES.capabilities} variant="secondary">
            {t.t('web.cta.seeCapabilities')}
          </Cta>
        }
      >
        <div className="mt-10">
          <Notice
            tone="warning"
            title={t.t('web.integrations.reviewNotice.title')}
            description={t.t('web.integrations.reviewNotice.body')}
          />
        </div>
      </PageIntro>

      <Section id="platforms">
        <ul className="border-t border-border-default">
          {CONNECTORS.map((connector) => (
            <li key={connector.id} id={connector.id} className="scroll-mt-24 border-b border-border-subtle py-10">
              <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <Subheading as="h2" className="font-serif text-[1.5rem] leading-[1.2] tracking-[-0.016em]">
                    {t.format(connector.nameKey)}
                  </Subheading>
                  <p className="mt-4">
                    <TextLink href={ROUTES.capabilities} className="text-body-md">
                      {t.t('web.integrations.viewMatrix')}
                    </TextLink>
                  </p>
                </div>
                <div className="min-w-0 lg:col-span-7 lg:col-start-6">
                  <FactList className="border-t-0">
                    <Fact term={t.t('web.integrations.accountTypes')}>
                      {t.format(connector.accountTypesKey)}
                    </Fact>
                    <Fact term={t.t('web.integrations.restriction')}>
                      {t.format(connector.restrictionKey)}
                    </Fact>
                    <Fact term={t.t('web.integrations.cost')}>{t.format(connector.costKey)}</Fact>
                  </FactList>
                  <div className="mt-4 space-y-1">
                    <SourceNote
                      citation={connector.primarySource}
                      label={t.t('web.label.officialSource')}
                    />
                    <SourceNote
                      citation={connector.policySource}
                      label={t.t('web.label.officialSource')}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Container>
        <div className="pb-16 md:pb-20">
          <CorrectionNotice />
        </div>
      </Container>
    </>
  );
}
