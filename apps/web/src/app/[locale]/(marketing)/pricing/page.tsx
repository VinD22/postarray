import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { StaggerList } from '@/components/motion';
import {
  WEB_SHARED_INCLUSION_KEYS,
  pendingTiers,
  priceUnits,
  publishableTiers,
} from '@/features/billing/tiers';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  ClosingCta,
  EditorialCard,
  EditorialDisplay,
  EditorialPricePlanBlock,
  EditorialSection,
  Eyebrow,
} from '@/features/marketing/components/editorial';
import {
  Body,
  Container,
  Heading,
  Lede,
  Split,
  Subheading,
} from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
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

/**
 * One list, shared by every tier, read from the tier module rather than
 * restated here. If a tier ever had its own list, that would be feature gating,
 * which `apps/web/src/features/billing/tiers.test.ts` and the billing package
 * both refuse.
 */
const INCLUDED = WEB_SHARED_INCLUSION_KEYS;

const FAQ = [
  { id: 'channels', q: 'web.pricing.faq.channels.q', a: 'web.pricing.faq.channels.a' },
  { id: 'xCost', q: 'web.pricing.faq.xCost.q', a: 'web.pricing.faq.xCost.a' },
  { id: 'refund', q: 'web.pricing.faq.refund.q', a: 'web.pricing.faq.refund.a' },
  { id: 'trialAbuse', q: 'web.pricing.faq.trialAbuse.q', a: 'web.pricing.faq.trialAbuse.a' },
  { id: 'selfHost', q: 'web.pricing.faq.selfHost.q', a: 'web.pricing.faq.selfHost.a' },
] as const;

/**
 * The plan's two prices, in whole dollars, for `<EditorialPricePlanBlock>`'s
 * `<CountUp>` numerals. Mirrors `billing.plan.monthlyPrice` /
 * `billing.plan.annualPrice` ($29/month, $300/year — `MANDATED_COPY` in
 * `packages/billing/src/products.ts`, the single source of truth for both
 * figures); the same duplication precedent as `MONTHLY_PRICE_DOLLARS` on the
 * landing page, since `apps/web` does not depend on `@relay/billing`.
 */
const MONTHLY_PRICE_DOLLARS = 29;
const ANNUAL_PRICE_DOLLARS = 300;

/** The capacity table's four column headers, in render order. */
const CAPACITY_COLUMN_KEYS = [
  'billing.tier.columnTier',
  'billing.tier.columnProjects',
  'billing.plan.interval.monthly',
  'billing.plan.interval.annual',
] as const;

const CAPACITY_HEADER_CLASS =
  'text-label text-text-tertiary px-3 py-3 text-start tracking-[0.14em] uppercase';

export default async function PricingPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  /**
   * Amounts are formatted from the tier's integer minor units, never written
   * out, so a price on this page cannot disagree with the price that is
   * charged. Zero cents are trimmed because the tier prices are whole dollars.
   */
  function money(minor: number, currency: string): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(priceUnits(minor));
  }

  return (
    <>
      {/* 1. Intro. The trial fact was a rotated sticker; it is now the
          eyebrow, which is the same statement without the poster. */}
      <EditorialSection reveal={false} containerClassName="py-24 md:py-32">
        <div className="max-w-[46rem]">
          <Eyebrow className="mb-6">{t.t('web.home.v2.sticker.trial')}</Eyebrow>
          <EditorialDisplay as="h1" size="md" reveal>
            {t.t('web.pricing.title')}
          </EditorialDisplay>
          <Lede className="mt-8">{t.t('web.pricing.lede')}</Lede>
        </div>
      </EditorialSection>

      {/*
        2 & 3. The price and everything a buyer is agreeing to sit side by
        side. The allowance, the fair use boundary, the metered platform
        usage, the planned trial and the cancellation path are next to the
        button, not behind a link and not below the fold.
        `EditorialPricePlanBlock` keeps both intervals' prices in the server
        HTML regardless of which one the toggle currently shows.

        This band used to be a full-viewport `--color-cta` fill. A price is
        the most consequential thing on the page and does not need a
        highlighter behind it; it needs room.
      */}
      <EditorialSection rule id="price" reveal={false}>
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <EditorialPricePlanBlock
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
              primaryNote={t.t('web.pricing.prelaunch.primaryNote')}
              secondaryNote={t.t('web.pricing.prelaunch.secondaryNote')}
              footerNote={t.t('web.pricing.perMonthNote')}
            />
          </div>

          <div className="min-w-0 lg:col-span-6">
            <Eyebrow as="h2">{t.t('web.pricing.beside.title')}</Eyebrow>
            <StaggerList stagger={0.07} className="mt-8">
              <ul className="space-y-4">
                {BESIDE_PURCHASE.map((key) => (
                  <li key={key} data-stagger-item className="flex items-start gap-3">
                    <Check aria-hidden="true" className="text-text-tertiary mt-1 size-5 shrink-0" />
                    <span className="text-body-lg text-text-secondary max-w-[60ch] leading-[1.6]">
                      {t.format(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </StaggerList>
          </div>
        </div>
      </EditorialSection>

      {/* 4. Included. */}
      <EditorialSection rule id="included" reveal={false}>
        <Heading>{t.t('web.pricing.included.title')}</Heading>
        <Body className="mt-4">{t.t('billing.plan.single')}</Body>

        <StaggerList stagger={0.07} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INCLUDED.map((key) => (
            <div key={key} data-stagger-item>
              <EditorialCard className="h-full">
                <p className="text-body-md text-text-primary">{t.format(key)}</p>
              </EditorialCard>
            </div>
          ))}
        </StaggerList>

        <p className="text-body-md text-text-secondary mt-8 max-w-[68ch] leading-[1.6]">
          {t.t('billing.plan.fairUse')}
        </p>
      </EditorialSection>

      {/*
        5 & 6. The tier table. Tiers buy active project capacity and nothing
        else, so the only column that varies is the project count. There is no
        feature column, because there is no feature any tier lacks.

        `publishableTiers()` is the only source of rows. A tier whose numbers
        are still a founder decision is excluded by that function, never
        rendered with a placeholder price and never given a purchase action;
        `pendingTiers()` below states only that more capacity is undecided.
        Restyling must not put an undecided tier anywhere near a price or a
        button, so this stays a table of decided tiers plus a prose note.
      */}
      <EditorialSection rule id="capacity" reveal={false}>
        <Heading>{t.t('billing.tier.heading')}</Heading>
        <Body className="mt-4">{t.t('billing.tier.subheading')}</Body>

        {/* A named, focusable scroll region: a table that can overflow but
            that only a pointer can scroll is a WCAG 2.2 failure. */}
        <div
          role="region"
          aria-label={t.t('billing.tier.heading')}
          tabIndex={0}
          className={cn(
            'relay-scroll-x mt-10 rounded-sm outline-none',
            'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
          )}
        >
          <table className="w-full min-w-[34rem] border-collapse">
            <caption className="sr-only">{t.t('billing.tier.heading')}</caption>
            <thead>
              <tr className="border-border-strong border-b">
                {CAPACITY_COLUMN_KEYS.map((key) => (
                  <th key={key} scope="col" className={CAPACITY_HEADER_CLASS}>
                    {t.t(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-border-subtle divide-y">
              {publishableTiers().map((tier) => (
                <tr key={tier.key}>
                  <th scope="row" className="text-body-lg px-3 py-5 text-start font-medium">
                    {t.t(tier.nameKey)}
                    <span className="text-body-sm text-text-secondary block font-normal">
                      {t.t(tier.taglineKey)}
                    </span>
                  </th>
                  <td className="text-body-lg text-text-secondary px-3 py-5">
                    {t.format('billing.tier.projectAllowance', {
                      count: tier.projectAllowance,
                    })}
                  </td>
                  <td className="text-body-lg text-text-secondary px-3 py-5 tabular-nums">
                    {money(tier.monthlyPriceMinor, tier.currency)}
                  </td>
                  <td className="text-body-lg text-text-secondary px-3 py-5 tabular-nums">
                    {money(tier.annualPriceMinor, tier.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-body-md text-text-secondary mt-8 max-w-[68ch] leading-[1.6]">
          {t.t('billing.tier.everyFeature')}
        </p>

        {pendingTiers().length > 0 ? (
          <div className="border-border-default mt-10 max-w-[46rem] border-t pt-8">
            <Subheading as="h3" className="text-title-sm">
              {t.t('billing.tier.moreComingTitle')}
            </Subheading>
            <p className="text-body-md text-text-secondary mt-2 max-w-[64ch] leading-[1.6]">
              {t.t('billing.tier.moreComingBody')}
            </p>
          </div>
        ) : null}

        <p className="mt-8">
          <TextLink href={ROUTES.changelog}>{t.t('nav.public.changelog')}</TextLink>
        </p>
      </EditorialSection>

      <EditorialSection rule id="media">
        <Split aside={<Heading>{t.t('billing.mediaGeneration.title')}</Heading>}>
          <Body>{t.t('billing.mediaGeneration.explanation')}</Body>
          <p className="text-body-md text-text-tertiary mt-4 max-w-[68ch] leading-[1.6]">
            {t.t('billing.usage.noMediaCredits')}
          </p>
          <p className="mt-4">
            <TextLink href={ROUTES.toolRadar}>{t.t('web.meta.toolRadar.title')}</TextLink>
          </p>
        </Split>
      </EditorialSection>

      {/*
        7. No testimonials. This was a second full-bleed ink band, which meant
        the page had two inverted moments competing with each other. The
        closing band keeps the ink; this keeps the claim, on paper.
      */}
      <EditorialSection rule id="no-testimonials">
        <EditorialDisplay as="h2" size="sm" className="max-w-[26ch]">
          {t.t('web.pricing.testimonials.title')}
        </EditorialDisplay>
        <p className="text-body-lg text-text-secondary mt-6 max-w-[62ch] leading-[1.65]">
          {t.t('web.pricing.testimonials.body')}
        </p>
      </EditorialSection>

      {/* 8. FAQ as native accordions: works before hydration, no JS needed. */}
      <EditorialSection rule id="questions" reveal={false}>
        <Heading className="max-w-[28ch]">{t.t('web.pricing.faq.title')}</Heading>
        <div className="border-border-default divide-border-subtle mt-12 divide-y border-t">
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
      </EditorialSection>

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

      {/* 10. Closing. The page's one inverted band. */}
      <ClosingCta
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
