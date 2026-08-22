import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { StaggerList } from '@/components/motion';
import {
  ClosingCta,
  EditorialCard,
  EditorialDisplay,
  EditorialPlatformCycler,
  EditorialSection,
  Eyebrow,
} from '@/features/marketing/components/editorial';
import { Body, Heading, Lede, Split, Subheading } from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
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
      <EditorialSection reveal={false} containerClassName="py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-7">
            <EditorialDisplay as="h1" size="md" reveal>
              {t.t('web.creators.title')}
            </EditorialDisplay>
            <Lede className="mt-8">{t.t('web.creators.lede')}</Lede>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
              <Cta href={ROUTES.pricing} variant="secondary">
                {t.t('web.cta.seePricing')}
              </Cta>
            </div>
          </div>

          {/*
            This used to be a drawn phone bezel: a 9:19 outlined slab with a
            hard offset shadow, standing in for a screenshot. A drawn interface
            is a fabricated screenshot in this project (see `ProductShot`), and
            a bezel with no screen in it was decoration doing the work of
            evidence. What was actually true inside it — the platform name
            cycling, honestly captioned — is all that remains, set as a plain
            typographic panel that does not pretend to be a device.
          */}
          <div className="lg:col-span-5">
            <div className="border-border-default bg-surface-raised shadow-raised space-y-4 rounded-lg border p-8">
              <Eyebrow>{t.t('web.creators.title')}</Eyebrow>
              <EditorialPlatformCycler
                platforms={platformNames}
                className="font-display text-display-lg"
              />
              <p className="text-body-sm text-text-tertiary max-w-[36ch] leading-[1.6]">
                {t.t('web.creators.v2.phone.caption')}
              </p>
            </div>
          </div>
        </div>
      </EditorialSection>

      <EditorialSection rule id="jobs" reveal={false}>
        <StaggerList stagger={0.07} className="grid gap-5 sm:grid-cols-2">
          {JOBS.map((job) => (
            <div key={job.id} data-stagger-item>
              <EditorialCard className="h-full">
                <Subheading as="h2" className="text-title-sm text-pretty">
                  {t.format(job.titleKey)}
                </Subheading>
                <p className="text-body-md text-text-secondary mt-3">{t.format(job.bodyKey)}</p>
              </EditorialCard>
            </div>
          ))}
        </StaggerList>
      </EditorialSection>

      <EditorialSection rule id="not-for">
        <Split aside={<Heading>{t.t('web.creators.notFor.title')}</Heading>}>
          <Body>{t.t('web.creators.notFor.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.toolRadar}>{t.t('web.meta.toolRadar.title')}</TextLink>
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
