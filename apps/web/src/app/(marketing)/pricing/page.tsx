import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  Body,
  Container,
  Heading,
  List,
  Meta,
  Section,
  Split,
  Subheading,
} from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { faqJsonLd, offerJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.pricing.title',
  'web.meta.pricing.description',
  ROUTES.pricing,
);

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

export default function PricingPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro title={t.t('web.pricing.title')} lede={t.t('web.pricing.lede')} />

      {/*
        The price and everything a buyer is agreeing to sit in one band, side
        by side. The allowance, the fair use boundary, the metered platform
        usage, the trial conversion and the cancellation path are next to the
        button, not behind a link and not below the fold.
      */}
      <Section id="price">
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-label text-text-tertiary">{t.t('web.pricing.intervalHeading')}</h2>

            <dl className="mt-4 border-t border-border-default">
              <div className="border-b border-border-subtle py-6">
                <dt className="text-body-md text-text-tertiary">{t.t('web.pricing.monthlyLabel')}</dt>
                <dd className="mt-1">
                  <p className="font-serif text-[2.25rem] leading-[1.1] tracking-[-0.02em] tabular-nums text-text-primary">
                    {t.t('billing.plan.monthlyPrice')}
                  </p>
                  <p className="mt-1 text-body-md text-text-secondary">
                    {t.t('web.pricing.monthlyDetail')}
                  </p>
                </dd>
              </div>
              <div className="border-b border-border-subtle py-6">
                <dt className="text-body-md text-text-tertiary">{t.t('web.pricing.annualLabel')}</dt>
                <dd className="mt-1">
                  <p className="font-serif text-[2.25rem] leading-[1.1] tracking-[-0.02em] tabular-nums text-text-primary">
                    {t.t('billing.plan.annualPrice')}
                  </p>
                  <p className="mt-1 text-body-lg text-text-primary">
                    {t.t('billing.plan.annualFraming')}
                  </p>
                  <p className="mt-1 text-body-md text-text-secondary">
                    {t.t('web.pricing.annualDetail')}
                  </p>
                </dd>
              </div>
            </dl>

            <div className="mt-8 space-y-4">
              <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
              <p className="max-w-[46ch] text-body-md leading-[1.6] text-text-primary">
                {t.t('billing.trial.dueToday')}. {t.t('billing.trial.paymentMethodRequired')}
              </p>
              <p className="max-w-[46ch] text-body-md leading-[1.6] text-text-tertiary">
                {t.t('billing.checkout.hostedBy')} {t.t('billing.checkout.taxNote')}
              </p>
              <Meta>{t.t('web.pricing.perMonthNote')}</Meta>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <Heading as="h2">{t.t('web.pricing.beside.title')}</Heading>
            <div className="mt-6">
              <List items={BESIDE_PURCHASE.map((key) => t.format(key))} />
            </div>
          </div>
        </div>
      </Section>

      <Section id="included">
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.pricing.included.title')}</Heading>
              <Body>{t.t('billing.plan.single')}</Body>
            </div>
          }
        >
          <List items={INCLUDED.map((key) => t.format(key))} />
          <p className="mt-6 max-w-[68ch] text-body-md leading-[1.6] text-text-secondary">
            {t.t('billing.plan.fairUse')}
          </p>
        </Split>
      </Section>

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
          <p className="mt-4 max-w-[68ch] text-body-md leading-[1.6] text-text-tertiary">
            {t.t('billing.usage.noMediaCredits')}
          </p>
          <p className="mt-4">
            <TextLink href={ROUTES.toolRadar}>{t.t('web.meta.toolRadar.title')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="no-testimonials">
        <Split aside={<Heading>{t.t('web.pricing.testimonials.title')}</Heading>}>
          <Body>{t.t('web.pricing.testimonials.body')}</Body>
        </Split>
      </Section>

      <Section id="questions">
        <Heading className="max-w-[28ch]">{t.t('web.pricing.faq.title')}</Heading>
        <dl className="mt-10 border-t border-border-default">
          {FAQ.map((item) => (
            <div
              key={item.id}
              className="grid gap-x-12 gap-y-2 border-b border-border-subtle py-7 lg:grid-cols-12"
            >
              <dt className="lg:col-span-4">
                <Subheading as="h3" className="text-pretty text-title-sm">
                  {t.format(item.q)}
                </Subheading>
              </dt>
              <dd className="min-w-0 lg:col-span-7 lg:col-start-6">
                <p className="max-w-[68ch] text-body-lg leading-[1.65] text-text-secondary">
                  {t.format(item.a)}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Container>
        <div className="border-t border-border-default py-8 md:py-10">
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

      <JsonLd node={offerJsonLd()} />
      <JsonLd
        node={faqJsonLd(
          FAQ.map((item) => ({ question: t.format(item.q), answer: t.format(item.a) })),
        )}
      />
    </>
  );
}
