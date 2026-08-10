import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';

import { StaggerList } from '@/components/motion';
import {
  Container,
  Fact,
  FactList,
  Lede,
  Section,
  Subheading,
} from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import {
  ClosingCta,
  EditorialCard,
  EditorialDisplay,
  EditorialSection,
  Eyebrow,
} from '@/features/marketing/components/editorial';
import { CorrectionNotice, SourceNote } from '@/features/marketing/components/page-parts';
import { CONNECTORS } from '@/features/marketing/data/connectors';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.integrations.title',
    'web.meta.integrations.description',
    ROUTES.integrations,
    locale,
  );
}

export default async function IntegrationsPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <EditorialSection>
        <div className="max-w-[52rem]">
          <EditorialDisplay as="h1" size="md">
            {t.t('web.integrations.title')}
          </EditorialDisplay>
          <Lede className="mt-6">{t.t('web.integrations.lede')}</Lede>
          <div className="mt-8">
            <Cta href={ROUTES.capabilities} variant="secondary">
              {t.t('web.cta.seeCapabilities')}
            </Cta>
          </div>
          <div className="mt-10">
            <Notice
              tone="warning"
              title={t.t('web.integrations.reviewNotice.title')}
              description={t.t('web.integrations.reviewNotice.body')}
            />
          </div>
        </div>
      </EditorialSection>

      {/* One index of connectors, each card linking to its detailed row below.
          This used to be two: a full-bleed marquee of ink-bordered name chips
          and then this same set again as poster cards. The marquee's only
          content was the list it now sits above, so the caption that carried
          the honest claim moves here and the second restatement leaves. */}
      <Section id="wall" ariaLabel={t.t('web.integrations.title')}>
        <Eyebrow>{t.t('web.integrations.v2.marqueeCaption')}</Eyebrow>
        <StaggerList className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONNECTORS.map((connector) => (
            <a key={connector.id} href={`#${connector.id}`} data-stagger-item className="block">
              <EditorialCard className="hover:border-accent h-full">
                <Subheading as="h2" className="text-title-sm">
                  {t.format(connector.nameKey)}
                </Subheading>
                <p className="text-body-sm text-text-tertiary mt-2">
                  {t.t('web.integrations.viewMatrix')}
                </p>
              </EditorialCard>
            </a>
          ))}
        </StaggerList>
      </Section>

      <Section id="platforms">
        <ul className="border-border-default border-t">
          {CONNECTORS.map((connector) => (
            <li
              key={connector.id}
              id={connector.id}
              className="border-border-subtle scroll-mt-24 border-b py-10"
            >
              <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <Subheading
                    as="h2"
                    className="font-serif text-[1.5rem] leading-[1.2] tracking-[-0.016em]"
                  >
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
                      locale={locale}
                      citation={connector.primarySource}
                      label={t.t('web.label.officialSource')}
                    />
                    <SourceNote
                      locale={locale}
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
          <CorrectionNotice locale={locale} />
        </div>
      </Container>

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
