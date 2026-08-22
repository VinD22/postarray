import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { StaggerList } from '@/components/motion';
import { publishableTiers, purchasableTiers } from '@/features/billing/tiers';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  BentoCell,
  BentoGrid,
  ClosingCta,
  EditorialSection,
  Eyebrow,
  HeroHeadline,
  TierGrid,
} from '@/features/marketing/components/editorial';
import {
  annualIntervalBadge,
  tierColumns,
} from '@/features/marketing/components/editorial/tier-columns';
import { Body, Container, Heading, Lede, Subheading } from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { marketingTranslator } from '@/features/marketing/i18n';
import { GradientWash } from '@/features/marketing/components/scene';
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

const FAQ = [
  { id: 'channels', q: 'web.pricing.faq.channels.q', a: 'web.pricing.faq.channels.a' },
  { id: 'xCost', q: 'web.pricing.faq.xCost.q', a: 'web.pricing.faq.xCost.a' },
  { id: 'refund', q: 'web.pricing.faq.refund.q', a: 'web.pricing.faq.refund.a' },
  { id: 'trialAbuse', q: 'web.pricing.faq.trialAbuse.q', a: 'web.pricing.faq.trialAbuse.a' },
  { id: 'selfHost', q: 'web.pricing.faq.selfHost.q', a: 'web.pricing.faq.selfHost.a' },
] as const;

export default async function PricingPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  /**
   * A tier is decided but not yet buyable when its Polar products are not
   * configured. That is the only reason this page ever shows fewer plans than
   * the tier module holds, and it is why the capacity note below appears at all.
   */
  const moreCapacityComing = publishableTiers().length > purchasableTiers(process.env).length;

  return (
    <>
      {/* 1. Intro. The trial fact was a rotated sticker; it is now the
          eyebrow, which is the same statement without the poster.

          The headline is `HeroHeadline` rather than `EditorialDisplay`, the
          same swap the home page made: a full display step larger, two
          lines, the second set in the action accent. The accent line is
          `billing.plan.single` reused verbatim, not restated — it is
          already the reviewed "no feature tiers" sentence the in-app billing
          screen and the onboarding plan step both show, and a second
          wording of the same claim on this page would be a second claim to
          keep in sync with the first. */}
      <EditorialSection
        reveal={false}
        className="isolate overflow-hidden"
        containerClassName="py-20 md:py-28 lg:py-32"
      >
        <GradientWash accent="warm" placement="top" />
        <div className="relative max-w-[46rem]">
          <Eyebrow className="mb-6">{t.t('web.home.v2.sticker.trial')}</Eyebrow>
          <HeroHeadline
            lead={t.t('web.pricing.v2.hero.headline')}
            accent={t.t('billing.plan.single')}
          />
          <Lede className="mt-8">{t.t('web.pricing.lede')}</Lede>
          <div className="mt-8">
            <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
          </div>
        </div>
      </EditorialSection>

      {/*
        2. The one price presentation on the page.

        This section used to be a three-column tier grid AND, directly
        underneath it, a second card restating the same two figures in a
        different shape, AND further down a capacity table stating all six
        amounts a third time. Three presentations of one plan is the confusion
        the owner named. There is now exactly one: an interval control, the
        charge for the selected interval, one supporting line, and a checklist.

        `tierColumns` renders only what somebody can buy today, which is
        Standard. Growth and Studio are real, priced and still in the tier
        module; they are absent because their Polar products do not exist yet,
        and they will appear here on their own the day those are configured.
        A confident single plan is simpler and more honest than three cards
        two of which are refusals.

        This is a decision page, so it stays quiet on purpose: reveals and a
        staggered grid, no pinned scene, no tinted band. The reader is here to
        choose, not to be shown something.
      */}
      <EditorialSection rule id="price" reveal={false}>
        <Heading className="max-w-[28ch]">{t.t('web.pricing.plan.heading')}</Heading>
        <Body className="mt-4">{t.t('web.pricing.plan.lede')}</Body>

        <TierGrid
          locale={locale}
          tiers={tierColumns({
            t,
            ctaHref: ROUTES.signUp,
            ctaLabel: t.t('web.cta.startTrial'),
          })}
          intervalGroupLabel={t.t('web.pricing.interval.group')}
          monthlyLabel={t.t('web.pricing.interval.monthly')}
          annualLabel={t.t('web.pricing.interval.yearly')}
          annualBadge={annualIntervalBadge({ t }) ?? undefined}
          startHereLabel={t.t('web.pricing.tierGrid.startHere')}
          featuresLabel={t.t('web.pricing.checklist.title')}
          actionNote={t.t('web.pricing.plan.trialNote')}
          className="mt-12"
        />

        <div className="mt-10 max-w-[62ch] space-y-4">
          <p className="text-body-md text-text-secondary leading-[1.6]">
            {t.t('billing.plan.fairUse')}
          </p>
          <p className="text-body-sm text-text-tertiary leading-[1.6]">
            {t.t('web.pricing.plan.taxNote')}
          </p>
        </div>

        {/* Stated once, in prose, at the bottom, and only while it is true.
            It is not a card, it is not beside a price, and it carries no
            button, because a tier nobody can buy must never look like a tier
            somebody nearly can. */}
        {moreCapacityComing ? (
          <div className="border-border-default mt-12 max-w-[46rem] border-t pt-8">
            <Subheading as="h3" className="text-title-sm">
              {t.t('web.pricing.plan.capacityTitle')}
            </Subheading>
            <p className="text-body-md text-text-secondary mt-2 max-w-[64ch] leading-[1.6]">
              {t.t('web.pricing.plan.capacityNote')}
            </p>
            <p className="mt-4">
              <TextLink href={ROUTES.changelog}>{t.t('nav.public.changelog')}</TextLink>
            </p>
          </div>
        ) : null}
      </EditorialSection>

      {/* 3. Everything a buyer is agreeing to. The checklist above says what
          the plan includes; this says what the terms are, which is a different
          question and belongs in a different place from the price. */}
      <EditorialSection rule id="terms" reveal={false}>
        <Heading>{t.t('web.pricing.beside.title')}</Heading>
        <StaggerList stagger={0.07} className="mt-10">
          <ul className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
            {BESIDE_PURCHASE.map((key) => (
              <li key={key} data-stagger-item className="flex items-start gap-3">
                <Check aria-hidden="true" className="text-text-tertiary mt-1 size-5 shrink-0" />
                <span className="text-body-md text-text-secondary max-w-[60ch] leading-[1.6]">
                  {t.format(key)}
                </span>
              </li>
            ))}
          </ul>
        </StaggerList>
      </EditorialSection>

      {/*
        4. Why the price looks the way it does: no comparison table, no
        customer quotes yet, no media credits. Three honest disclosures that
        used to be three separate full-bleed sections stacked one after
        another, plus a fourth (`web.pricing.compare.*`) that was written for
        exactly this page and never wired up — the page argued its own
        simplicity in prose while sitting on the paragraph that explains why,
        unrendered, in the catalog. This is the answer a reader who came from
        a search for "relay pricing vs X" is actually looking for, so it gets
        the lead cell rather than a caveat at the bottom of the page.

        Bento, not three more stacked sections: the point is that these three
        disclosures are read together, as one argument for why there is one
        number on this page instead of a table of them. No `ColorBand` here —
        the page stays quiet and undecorated through its price and its terms,
        the same restraint section 2's own comment argues for.
      */}
      <EditorialSection rule id="why" reveal={false}>
        <BentoGrid>
          <BentoCell span="lead">
            <Heading className="max-w-[26ch]">{t.t('web.pricing.compare.title')}</Heading>
            <Body className="mt-5">{t.t('web.pricing.compare.body')}</Body>
          </BentoCell>
          <BentoCell span="side" as="section">
            <Subheading as="h3">{t.t('web.pricing.testimonials.title')}</Subheading>
            <p className="text-body-md text-text-secondary mt-4 leading-[1.6]">
              {t.t('web.pricing.testimonials.body')}
            </p>
          </BentoCell>
          <BentoCell span="side" as="section">
            <Subheading as="h3">{t.t('billing.mediaGeneration.title')}</Subheading>
            <p className="text-body-md text-text-secondary mt-4 leading-[1.6]">
              {t.t('billing.mediaGeneration.explanation')}
            </p>
            <p className="text-body-sm text-text-tertiary mt-3 leading-[1.6]">
              {t.t('billing.usage.noMediaCredits')}
            </p>
            <p className="mt-4">
              <TextLink href={ROUTES.toolRadar}>{t.t('web.meta.toolRadar.title')}</TextLink>
            </p>
          </BentoCell>
        </BentoGrid>
      </EditorialSection>

      {/* 5. FAQ as native accordions: works before hydration, no JS needed. */}
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

      {/* 6. Legal links strip. */}
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

      {/* 7. Closing. The page's one inverted band. */}
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
