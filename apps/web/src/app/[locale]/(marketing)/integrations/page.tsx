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
  BentoCell,
  BentoGrid,
  ClosingCta,
  EditorialBigNumber,
  EditorialCard,
  EditorialSection,
  Eyebrow,
  HeroHeadline,
} from '@/features/marketing/components/editorial';
import { ColorBand, GradientWash } from '@/features/marketing/components/scene';
import { CorrectionNotice, SourceNote } from '@/features/marketing/components/page-parts';
import { CAPABILITY_COLUMNS, CONNECTORS } from '@/features/marketing/data/connectors';
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
      {/*
        1. The hero. `HeroHeadline` replaces the single-line `EditorialDisplay`
        this page opened with, matching the home page's hero treatment: a full
        display step larger, two lines, the second set in the action accent.
        Nothing else in the hero changes — the same secondary action and the
        same review-status `Notice` that keeps "official" from meaning
        anything before a platform has actually approved it.
      */}
      <EditorialSection className="isolate overflow-hidden" containerClassName="py-20 md:py-28 lg:py-32">
        <GradientWash accent="cool" placement="top" />
        <div className="relative max-w-[52rem]">
          <HeroHeadline
            lead={t.t('web.integrations.v2.hero.headline')}
            accent={t.t('web.integrations.v2.hero.headlineAccent')}
          />
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

      {/*
        2. The cohort, stated as two figures, and a prominent way into the
        real matrix. Both numbers are derived, never typed: `CONNECTORS.length`
        is the same launch cohort the home page counts, and
        `CAPABILITY_COLUMNS.length` is the width of the actual generated
        table at `/integrations/capabilities`. Neither number claims a
        capability is supported — the matrix linked beside it is where that
        real, per-cell state lives, and this band only ever counts the shape
        of the data, not its content.
      */}
      <ColorBand accent="cool" id="stats" texture>
        <BentoGrid>
          <BentoCell span="lead" as="section">
            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
              <EditorialBigNumber
                value={CONNECTORS.length}
                locale={locale}
                label={t.t('web.integrations.v2.platformsStat')}
              />
              <div className="border-border-subtle sm:border-s sm:ps-10">
                <EditorialBigNumber
                  value={CAPABILITY_COLUMNS.length}
                  locale={locale}
                  label={t.t('web.integrations.v2.capabilitiesStat')}
                />
              </div>
            </div>
          </BentoCell>
          <BentoCell span="side" as="section">
            <Subheading as="h3">{t.t('web.capabilities.title')}</Subheading>
            <p className="text-body-md text-text-secondary mt-4 leading-[1.6]">
              {t.t('web.capabilities.lede')}
            </p>
            <p className="mt-6">
              <Cta href={ROUTES.capabilities} variant="secondary">
                {t.t('web.integrations.viewMatrix')}
              </Cta>
            </p>
          </BentoCell>
        </BentoGrid>
      </ColorBand>

      {/* One index of connectors, each card linking to its detailed row below.
          This used to be two: a full-bleed marquee of ink-bordered name chips
          and then this same set again as poster cards. The marquee's only
          content was the list it now sits above, so the caption that carried
          the honest claim moves here and the second restatement leaves.

          Left on plain paper, not inside the `ColorBand` above: this is the
          real, generated connector list, and it stays the neutral ground the
          rest of the page's data-driven sections sit on. */}
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
