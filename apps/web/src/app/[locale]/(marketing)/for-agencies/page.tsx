import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import { Reveal, StaggerList } from '@/components/motion';
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
import { BigNumber } from '@/features/marketing/components/loud/big-number';
import { CtaSlab } from '@/features/marketing/components/loud/cta-slab';
import { LoudDisplay } from '@/features/marketing/components/loud/display';
import { PosterCard } from '@/features/marketing/components/loud/poster-card';
import { Sticker } from '@/features/marketing/components/loud/sticker';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

/**
 * Active connections a workspace may hold. Mirrors `ACTIVE_CHANNEL_ALLOWANCE`
 * in `packages/billing/src/products.ts`; `apps/web` does not depend on
 * `@relay/billing`, the same duplication precedent as `pricing/page.tsx`'s
 * `MONTHLY_PRICE_DOLLARS`.
 */
const ACTIVE_CHANNEL_ALLOWANCE = 30;

/** The approval flow, in order: what an agency's draft actually goes through. */
const FLOW_STEPS = [
  'web.product.step.compose.title',
  'web.product.step.approve.title',
  'web.product.step.schedule.title',
  'web.product.step.publish.title',
] as const;

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.agencies.title',
    'web.meta.agencies.description',
    ROUTES.agencies,
    locale,
  );
}

const JOBS = [
  {
    id: 'separation',
    titleKey: 'web.agencies.job.separation.title',
    bodyKey: 'web.agencies.job.separation.body',
  },
  {
    id: 'approval',
    titleKey: 'web.agencies.job.approval.title',
    bodyKey: 'web.agencies.job.approval.body',
  },
  {
    id: 'receipts',
    titleKey: 'web.agencies.job.receipts.title',
    bodyKey: 'web.agencies.job.receipts.body',
  },
  { id: 'roles', titleKey: 'web.agencies.job.roles.title', bodyKey: 'web.agencies.job.roles.body' },
] as const;

export default async function ForAgenciesPage({
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
            {t.t('web.agencies.title')}
          </LoudDisplay>
          <Lede className="mt-6">{t.t('web.agencies.lede')}</Lede>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
            <Cta href={ROUTES.pricing} variant="secondary">
              {t.t('web.cta.seePricing')}
            </Cta>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center gap-8">
          <BigNumber
            value={ACTIVE_CHANNEL_ALLOWANCE}
            locale={locale}
            label={t.t('web.agencies.v2.channelsLabel')}
          />
          <Sticker tone="pop" rotate={4}>
            {t.t('web.agencies.v2.membersSticker')}
          </Sticker>
        </div>
      </Band>

      {/* The approval flow, drawn plainly: four real steps, connected. */}
      <Section id="flow" ariaLabel={t.t('web.agencies.job.approval.title')}>
        <div className="flex flex-wrap items-stretch gap-3">
          {FLOW_STEPS.map((key, index) => (
            <div key={key} className="flex items-center gap-3">
              <PosterCard tone={index === 1 ? 'brand' : 'paper'} className="px-5 py-4">
                <span className="text-body-md">{t.format(key)}</span>
              </PosterCard>
              {index < FLOW_STEPS.length - 1 ? (
                <ArrowRight
                  aria-hidden="true"
                  className="text-text-tertiary size-5 shrink-0 rtl:rotate-180"
                />
              ) : null}
            </div>
          ))}
        </div>
      </Section>

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

      <Section id="boundary">
        <Split aside={<Heading>{t.t('web.agencies.limits.title')}</Heading>}>
          <Body>{t.t('web.agencies.limits.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.pricing}>{t.t('nav.public.pricing')}</TextLink>
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
