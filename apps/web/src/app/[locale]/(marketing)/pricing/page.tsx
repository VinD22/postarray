import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { StaggerList } from '@/components/motion';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  Body,
  Container,
  Heading,
  Lede,
  Section,
  Split,
  Subheading,
} from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { Band } from '@/features/marketing/components/loud/band';
import { CtaSlab } from '@/features/marketing/components/loud/cta-slab';
import { LoudDisplay } from '@/features/marketing/components/loud/display';
import { PosterCard } from '@/features/marketing/components/loud/poster-card';
import { PricePlanBlock } from '@/features/marketing/components/loud/price-toggle';
import { Sticker } from '@/features/marketing/components/loud/sticker';
import { marketingTranslator } from '@/features/marketing/i18n';
import { faqJsonLd, offerJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';
import { cn } from '@relay/design-system/utils';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.pricing.title',
    'web.meta.pricing.description',
    ROUTES.pricing,
    locale,
  );
}

/** Stated next to the purchase action. Order is deliberate, not alphabetical. */
const BESIDE_PURCHASE = [
  'web.pricing.beside.channels',
  'web.pricing.beside.members',
  'web.pricing.beside.fairUse',
  'web.pricing.beside.metered',
  'web.pricing.beside.noMedia',
  'web.pricing.beside.trial',
  'web.pricing.beside.conversion',
  'web.pricing.beside.cancel',
  'web.pricing.beside.data',
] as const;

const INCLUDED = [
  'billing.plan.includes.channels',
  'billing.plan.includes.members',
  'billing.plan.includes.posts',
  'billing.plan.includes.connectors',
  'billing.plan.includes.analytics',
  'billing.plan.includes.api',
  'billing.plan.includes.automation',
  'billing.plan.includes.ai',
  'billing.plan.includes.support',
] as const;

const FAQ = [
  { id: 'channels', q: 'web.pricing.faq.channels.q', a: 'web.pricing.faq.channels.a' },
  { id: 'xCost', q: 'web.pricing.faq.xCost.q', a: 'web.pricing.faq.xCost.a' },
  { id: 'refund', q: 'web.pricing.faq.refund.q', a: 'web.pricing.faq.refund.a' },
  { id: 'trialAbuse', q: 'web.pricing.faq.trialAbuse.q', a: 'web.pricing.faq.trialAbuse.a' },
  { id: 'selfHost', q: 'web.pricing.faq.selfHost.q', a: 'web.pricing.faq.selfHost.a' },
] as const;

/**
 * The plan's two prices, in whole dollars, for `<PricePlanBlock>`'s
 * `<CountUp>` numerals. Mirrors `billing.plan.monthlyPrice` /
 * `billing.plan.annualPrice` ($29/month, $300/year — `MANDATED_COPY` in
 * `packages/billing/src/products.ts`, the single source of truth for both
 * figures); the same duplication precedent as `MONTHLY_PRICE_DOLLARS` on the
 * landing page, since `apps/web` does not depend on `@relay/billing`.
 */
const MONTHLY_PRICE_DOLLARS = 29;
const ANNUAL_PRICE_DOLLARS = 300;

export default async function PricingPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      {/* 1. Intro. */}
      <Band tone="paper">
        <div className="max-w-[46rem]">
          <LoudDisplay as="h1" size="xl">
            {t.t('web.pricing.title')}
          </LoudDisplay>
          <Lede className="mt-6">{t.t('web.pricing.lede')}</Lede>
          <Sticker tone="cta" rotate={-4} className="mt-6">
            {t.t('web.home.v2.sticker.trial')}
          </Sticker>
        </div>
      </Band>

      {/*
        2 & 3. The price and everything a buyer is agreeing to sit in one
        band, side by side. The allowance, the fair use boundary, the
        metered platform usage, the trial conversion and the cancellation
        path are next to the button, not behind a link and not below the
        fold. `PricePlanBlock` keeps both intervals' prices in the server
        HTML regardless of which one the toggle currently shows — see its
        own doc comment.
      */}
      <Band tone="cta" id="price">
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <PricePlanBlock
              locale={locale}
              groupLabel={t.t('web.pricing.intervalHeading')}
              monthlyLabel={t.t('web.pricing.monthlyLabel')}
              annualLabel={t.t('web.pricing.annualLabel')}
              monthlyDetail={t.t('web.pricing.monthlyDetail')}
              annualDetail={t.t('web.pricing.annualDetail')}
              monthlyPriceDollars={MONTHLY_PRICE_DOLLARS}
              annualPriceDollars={ANNUAL_PRICE_DOLLARS}
              annualFraming={t.t('billing.plan.annualFraming')}
              ctaHref={ROUTES.signUp}
              ctaLabel={t.t('web.cta.startTrial')}
              dueToday={t.t('billing.trial.dueToday')}
              paymentMethodRequired={t.t('billing.trial.paymentMethodRequired')}
              hostedBy={t.t('billing.checkout.hostedBy')}
              taxNote={t.t('billing.checkout.taxNote')}
              perMonthNote={t.t('web.pricing.perMonthNote')}
            />
          </div>

          <div className="min-w-0 lg:col-span-6">
            <h2 className="text-label tracking-wide uppercase opacity-90">
              {t.t('web.pricing.beside.title')}
            </h2>
            <StaggerList className="mt-6">
              <ul className="space-y-4">
                {BESIDE_PURCHASE.map((key) => (
                  <li key={key} data-stagger-item className="flex items-start gap-3">
                    <Check aria-hidden="true" className="mt-1 size-5 shrink-0" />
                    <span className="text-body-lg max-w-[60ch] leading-[1.6]">{t.format(key)}</span>
                  </li>
                ))}
              </ul>
            </StaggerList>
          </div>
        </div>
      </Band>

      {/* 4. Included, restyled as a 3-column poster mini-grid. */}
      <Section id="included">
        <Heading>{t.t('web.pricing.included.title')}</Heading>
        <Body className="mt-4">{t.t('billing.plan.single')}</Body>

        <StaggerList className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INCLUDED.map((key) => (
            <div key={key} data-stagger-item>
              <PosterCard tone="paper" className="h-full">
                <p className="text-body-md text-text-primary">{t.format(key)}</p>
              </PosterCard>
            </div>
          ))}
        </StaggerList>

        <p className="text-body-md text-text-secondary mt-6 max-w-[68ch] leading-[1.6]">
          {t.t('billing.plan.fairUse')}
        </p>
      </Section>

      {/* 5 & 6. Editorial as-is: a comparison table would have one column. */}
      <Section id="no-tiers">
        <Split aside={<Heading>{t.t('web.pricing.compare.title')}</Heading>}>
          <Body>{t.t('web.pricing.compare.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.changelog}>{t.t('nav.public.changelog')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="media">
        <Split aside={<Heading>{t.t('billing.mediaGeneration.title')}</Heading>}>
          <Body>{t.t('billing.mediaGeneration.explanation')}</Body>
          <p className="text-body-md text-text-tertiary mt-4 max-w-[68ch] leading-[1.6]">
            {t.t('billing.usage.noMediaCredits')}
          </p>
          <p className="mt-4">
            <TextLink href={ROUTES.toolRadar}>{t.t('web.meta.toolRadar.title')}</TextLink>
          </p>
        </Split>
      </Section>

      {/* 7. No testimonials — a differentiator, made loud rather than hidden
          on a quiet hairline row. */}
      <Band tone="ink" id="no-testimonials">
        <LoudDisplay as="h2" size="lg" className="max-w-[26ch]">
          {t.t('web.pricing.testimonials.title')}
        </LoudDisplay>
        <p className="text-body-lg mt-4 max-w-[62ch] leading-[1.65]">
          {t.t('web.pricing.testimonials.body')}
        </p>
      </Band>

      {/* 8. FAQ as native accordions: works before hydration, no JS needed. */}
      <Section id="questions">
        <Heading className="max-w-[28ch]">{t.t('web.pricing.faq.title')}</Heading>
        <div className="border-border-bold divide-border-bold mt-10 divide-y-2 border-t-2">
          {FAQ.map((item) => (
            <details key={item.id} className="group">
              <summary
                className={cn(
                  'flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-6',
                  'marker:content-none [&::-webkit-details-marker]:hidden',
                  'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
                )}
              >
                <Subheading as="h3" className="text-title-sm text-pretty">
                  {t.format(item.q)}
                </Subheading>
                <ChevronDown
                  aria-hidden="true"
                  className="text-text-tertiary size-5 shrink-0 transition-transform duration-(--duration-fast) group-open:rotate-180"
                />
              </summary>
              <p className="text-body-lg text-text-secondary max-w-[68ch] pb-6 leading-[1.65]">
                {t.format(item.a)}
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* 9. Legal links strip. */}
      <Container>
        <div className="border-border-default border-t py-8 md:py-10">
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <TextLink href={ROUTES.refunds} className="text-body-md">
                {t.t('web.legal.refunds.title')}
              </TextLink>
            </li>
            <li>
              <TextLink href={ROUTES.terms} className="text-body-md">
                {t.t('web.legal.terms.title')}
              </TextLink>
            </li>
            <li>
              <TextLink href={ROUTES.acceptableUse} className="text-body-md">
                {t.t('web.legal.aup.title')}
              </TextLink>
            </li>
          </ul>
        </div>
      </Container>

      {/* 10. Closing. */}
      <CtaSlab
        id="start"
        title={t.t('web.pricing.v2.closing.title')}
        body={t.t('web.pricing.v2.closing.body')}
        cta={{ href: ROUTES.signUp, label: t.t('web.cta.startTrial') }}
        footnote={t.t('web.cta.trialFootnote')}
      />

      <JsonLd node={await offerJsonLd(locale)} />
      <JsonLd
        node={faqJsonLd(
          FAQ.map((item) => ({ question: t.format(item.q), answer: t.format(item.a) })),
          locale,
        )}
      />
    </>
  );
}
