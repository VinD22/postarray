import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Reveal, StaggerList } from '@/components/motion';
import { HeroPlatformCycler } from '@/features/marketing/components/loud/hero-platform-cycler';
import {
  Body,
  Heading,
  Lede,
  Section,
  Split,
  Subheading,
} from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { Band } from '@/features/marketing/components/loud/band';
import { CtaSlab } from '@/features/marketing/components/loud/cta-slab';
import { LoudDisplay } from '@/features/marketing/components/loud/display';
import { PosterCard } from '@/features/marketing/components/loud/poster-card';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

/** The same five platforms the home hero cycles, in the same order. */
const PHONE_PLATFORM_IDS = ['x', 'linkedin', 'instagram', 'youtube', 'bluesky'] as const;

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.creators.title',
    'web.meta.creators.description',
    ROUTES.creators,
    locale,
  );
}

const JOBS = [
  { id: 'adapt', titleKey: 'web.creators.job.adapt.title', bodyKey: 'web.creators.job.adapt.body' },
  {
    id: 'languages',
    titleKey: 'web.creators.job.languages.title',
    bodyKey: 'web.creators.job.languages.body',
  },
  {
    id: 'rights',
    titleKey: 'web.creators.job.rights.title',
    bodyKey: 'web.creators.job.rights.body',
  },
  { id: 'cost', titleKey: 'web.creators.job.cost.title', bodyKey: 'web.creators.job.cost.body' },
] as const;

export default async function ForCreatorsPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);
  const platformNames = PHONE_PLATFORM_IDS.map((id) => t.format(`web.provider.${id}`));

  return (
    <>
      <Band tone="paper">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal className="lg:col-span-7">
            <LoudDisplay as="h1" size="xl">
              {t.t('web.creators.title')}
            </LoudDisplay>
            <Lede className="mt-6">{t.t('web.creators.lede')}</Lede>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
              <Cta href={ROUTES.pricing} variant="secondary">
                {t.t('web.cta.seePricing')}
              </Cta>
            </div>
          </Reveal>

          {/*
            A CSS phone bezel, not a screenshot — this project treats a drawn
            interface or an invented app frame as a fabricated screenshot
            (see `ProductShot`'s own doc comment). The cycling word is the
            platform name itself, via the same `HeroPlatformCycler` the home
            hero uses, honestly captioned.
          */}
          <div className="lg:col-span-5">
            <div className="border-border-bold shadow-hard bg-surface-raised mx-auto flex aspect-[9/19] w-full max-w-[16rem] flex-col items-center justify-center gap-4 rounded-[var(--radius-editorial)] border-2 p-6">
              <span className="text-label text-text-tertiary tracking-wide uppercase">
                {t.t('web.creators.title')}
              </span>
              <HeroPlatformCycler
                platforms={platformNames}
                className="font-display text-display-lg text-center"
              />
              <p className="text-body-sm text-text-tertiary text-center">
                {t.t('web.creators.v2.phone.caption')}
              </p>
            </div>
          </div>
        </div>
      </Band>

      <Section id="jobs">
        <StaggerList className="grid gap-6 sm:grid-cols-2">
          {JOBS.map((job) => (
            <div key={job.id} data-stagger-item>
              <PosterCard tone="paper" className="h-full">
                <Subheading as="h2" className="text-title-sm text-pretty">
                  {t.format(job.titleKey)}
                </Subheading>
                <p className="text-body-md text-text-secondary mt-3">{t.format(job.bodyKey)}</p>
              </PosterCard>
            </div>
          ))}
        </StaggerList>
      </Section>

      <Section id="not-for">
        <Split aside={<Heading>{t.t('web.creators.notFor.title')}</Heading>}>
          <Body>{t.t('web.creators.notFor.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.toolRadar}>{t.t('web.meta.toolRadar.title')}</TextLink>
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
