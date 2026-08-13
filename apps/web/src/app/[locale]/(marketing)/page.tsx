import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { CORE_PROVIDER_IDS } from '@relay/contracts';
import { cn } from '@relay/design-system/utils';
import type { Translator } from '@relay/i18n/translate';

import { Marquee, StaggerList } from '@/components/motion';
import { HeroDemoSection } from '@/features/demo/hero-demo-section';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  ClosingCta,
  EditorialBigNumber,
  EditorialCard,
  EditorialDisplay,
  EditorialPlatformCycler,
  EditorialPricePair,
  EditorialSection,
  EditorialVariantScene,
  Eyebrow,
  ProviderGrid,
  TierGrid,
} from '@/features/marketing/components/editorial';
import { tierColumns } from '@/features/marketing/components/editorial/tier-columns';
import { Sticker } from '@/features/marketing/components/scene';
import { Body, Heading, Lede, Subheading } from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { marketingTranslator } from '@/features/marketing/i18n';
import { offerJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';
import type { ProviderId } from '@/lib/api/types';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('web.meta.home.title', 'web.meta.home.description', ROUTES.home, locale);
}

const EXAMPLE_ROWS = [
  {
    id: 'x',
    accountKey: 'web.home.example.x.account',
    variantKey: 'web.home.example.x.variant',
    checkKey: 'web.home.example.x.check',
  },
  {
    id: 'linkedin',
    accountKey: 'web.home.example.linkedin.account',
    variantKey: 'web.home.example.linkedin.variant',
    checkKey: 'web.home.example.linkedin.check',
  },
  {
    id: 'instagram',
    accountKey: 'web.home.example.instagram.account',
    variantKey: 'web.home.example.instagram.variant',
    checkKey: 'web.home.example.instagram.check',
  },
  {
    id: 'youtube',
    accountKey: 'web.home.example.youtube.account',
    variantKey: 'web.home.example.youtube.variant',
    checkKey: 'web.home.example.youtube.check',
  },
  {
    id: 'bluesky',
    accountKey: 'web.home.example.bluesky.account',
    variantKey: 'web.home.example.bluesky.variant',
    checkKey: 'web.home.example.bluesky.check',
  },
] as const;

/** The hero cycler's platforms, in the order named in the WP-1 spec: X, LinkedIn, Instagram, YouTube, Bluesky. */
const PLATFORM_CYCLE_IDS = EXAMPLE_ROWS.map((row) => row.id);

/**
 * The launch cohort, for the marquee, the "official APIs only" grid and the
 * connector-count sticker.
 *
 * Derived from `CORE_PROVIDER_IDS` rather than typed out. This list used to be
 * eight hand-written ids under a comment claiming it was "every real, shipped
 * connector", which it was not: the cohort in `@relay/contracts` already held
 * ten, so the home page quietly promised a smaller product than the
 * integrations page and the connect dialog did. Deriving it means the page
 * cannot disagree with the cohort again, in either direction — a provider
 * added to or removed from the cohort moves this grid with it, on the same
 * commit, with no second edit to remember.
 *
 * `features/marketing/data/connectors.ts` (the capability matrix) derives from
 * the same constant, so the two public connector surfaces are two views of one
 * list.
 */
const CONNECTOR_PROVIDERS: readonly ProviderId[] = CORE_PROVIDER_IDS;

const PILLARS = [
  {
    id: 'confidence',
    titleKey: 'web.home.pillars.confidence.title',
    bodyKey: 'web.home.pillars.confidence.body',
    proofKey: 'web.home.pillars.confidence.proof',
  },
  {
    id: 'adapt',
    titleKey: 'web.home.pillars.adapt.title',
    bodyKey: 'web.home.pillars.adapt.body',
    proofKey: 'web.home.pillars.adapt.proof',
  },
  {
    id: 'loop',
    titleKey: 'web.home.pillars.loop.title',
    bodyKey: 'web.home.pillars.loop.body',
    proofKey: 'web.home.pillars.loop.proof',
  },
  {
    id: 'anywhere',
    titleKey: 'web.home.pillars.anywhere.title',
    bodyKey: 'web.home.pillars.anywhere.body',
    proofKey: 'web.home.pillars.anywhere.proof',
  },
  {
    id: 'economics',
    titleKey: 'web.home.pillars.economics.title',
    bodyKey: 'web.home.pillars.economics.body',
    proofKey: 'web.home.pillars.economics.proof',
  },
] as const;

const SURFACES = [
  { id: 'web', nameKey: 'web.home.surfaces.web', bodyKey: 'web.home.surfaces.webBody' },
  { id: 'api', nameKey: 'web.home.surfaces.api', bodyKey: 'web.home.surfaces.apiBody' },
  { id: 'mcp', nameKey: 'web.home.surfaces.mcp', bodyKey: 'web.home.surfaces.mcpBody' },
  { id: 'cli', nameKey: 'web.home.surfaces.cli', bodyKey: 'web.home.surfaces.cliBody' },
  {
    id: 'webhooks',
    nameKey: 'web.home.surfaces.webhooks',
    bodyKey: 'web.home.surfaces.webhooksBody',
  },
] as const;

const BOUNDARIES = [
  'web.home.honest.noMedia',
  'web.home.honest.noAutomationOfEngagement',
  'web.home.honest.noUnofficial',
  'web.home.honest.noPromises',
  'web.home.honest.noUnattendedPublishing',
] as const;

/** The plan's one price, in whole dollars. Mirrors `billing.plan.monthlyPrice` / `MANDATED_COPY.monthlyPrice` ($29/month, `packages/billing/src/products.ts`). */
const MONTHLY_PRICE_DOLLARS = 29;

/** The annual price in whole dollars. Mirrors `annualPriceMinor: 30_000` on the base tier in `packages/billing/src/tiers.ts`. */
const ANNUAL_PRICE_DOLLARS = 300;

type Pillar = (typeof PILLARS)[number];

/**
 * One numbered proof row.
 *
 * Extracted because the rows are no longer one uninterrupted list: two of
 * them sit inside a `ColorBand` and the rest on the paper canvas, and the
 * row's markup must be identical in both grounds or the tint reads as a
 * different component rather than as the same row on a different surface.
 *
 * The numeral is set at display scale with a marigold rule under it. Both are
 * CSS: the rule's `scale-x` grows from the row's own hover/focus state and
 * the global 1ms reduced-motion override reaches it, so there is no GSAP
 * timeline here to branch on `useMotionOk` and nothing hidden in server HTML
 * — the finished numeral and the full-width rule are what a no-JS visitor
 * gets.
 */
function PillarRow({
  pillar,
  index,
  t,
}: {
  readonly pillar: Pillar;
  readonly index: number;
  readonly t: Translator;
}): ReactNode {
  return (
    <div
      data-stagger-item
      className="border-border-subtle group grid gap-4 border-b py-10 lg:grid-cols-12 lg:items-start lg:gap-12"
    >
      <div aria-hidden="true" className="lg:col-span-2">
        <span className="font-display text-display-md text-text-tertiary block leading-none tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={cn(
            'bg-accent-warm mt-2 block h-0.5 w-16 origin-[left_center] rtl:origin-[right_center]',
            'scale-x-50 transition-transform duration-(--duration-expressive) ease-(--ease-out-expo)',
            'group-focus-within:scale-x-100 group-hover:scale-x-100',
          )}
        />
      </div>
      <div className="space-y-4 lg:col-span-9 lg:col-start-4">
        <h3 className="text-title-lg text-text-primary text-pretty">{t.format(pillar.titleKey)}</h3>
        <p className="text-body-lg text-text-secondary max-w-[68ch] leading-[1.65]">
          {t.format(pillar.bodyKey)}
        </p>
        <p className="border-border-default text-body-sm text-text-tertiary border-s ps-4 font-mono leading-[1.6]">
          {t.format(pillar.proofKey)}
        </p>
      </div>
    </div>
  );
}

export default async function HomePage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  // `{platform}` may land anywhere in the translated sentence (translators
  // control word order); a leading or trailing empty half is simply not
  // rendered.
  const heroTemplate = t.t('web.home.v2.heroTemplate', { platform: '{platform}' });
  const [heroBefore = '', heroAfter = ''] = heroTemplate.split('{platform}');
  const platformNames = PLATFORM_CYCLE_IDS.map((id) => t.format(`web.provider.${id}`));

  const variantRows = EXAMPLE_ROWS.map((row) => ({
    id: row.id,
    provider: row.id,
    account: t.format(row.accountKey),
    variant: t.format(row.variantKey),
    check: t.format(row.checkKey),
  }));

  return (
    <>
      {/*
        1. The hero. The promise headline is the LCP element and server HTML
        already carries its finished text, so the per-line mask reveal never
        delays or shifts first paint.

        Two decorative corner stickers used to float here on a 5s CSS loop.
        They said nothing a reader needed and are deleted rather than
        translated into the editorial system: the space they occupied is the
        point. The one sticker that carried a fact ("Public prelaunch")
        survives, level and unrotated, as the eyebrow above the headline.
      */}
      <EditorialSection
        reveal={false}
        className="flex min-h-[86dvh] items-center"
        containerClassName="py-24 md:py-32"
      >
        {/*
          Two columns from `lg` up: the promise on the left, a working
          demonstration on the right. Below `lg` the demonstration follows the
          actions rather than pushing them off the first screen, because the
          point of the hero is still to say what this is and let someone start.
        */}
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div className="max-w-[46rem]">
            <Eyebrow className="mb-6">{t.t('web.home.v2.sticker.trial')}</Eyebrow>

            {/*
            `web.home.promise` is a full sentence, so it is set at the middle
            display step rather than the largest: at `lg` it wrapped to six or
            seven lines and pushed the action below the fold on common
            viewport heights.
          */}
            <EditorialDisplay as="h1" size="md" reveal>
              {t.t('web.home.promise')}
            </EditorialDisplay>

            <p className="font-display text-display-lg text-text-secondary mt-6 flex flex-wrap items-baseline gap-x-3 text-pretty">
              {heroBefore.trim() ? <span>{heroBefore}</span> : null}
              <EditorialPlatformCycler platforms={platformNames} />
              {heroAfter.trim() ? <span>{heroAfter}</span> : null}
            </p>

            <Lede className="mt-8 max-w-[62ch]">{t.t('web.home.lede')}</Lede>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
              <Cta href={ROUTES.product} variant="secondary">
                {t.t('nav.public.product')}
              </Cta>
            </div>

            <p className="text-body-md text-text-tertiary mt-7 max-w-[64ch] leading-[1.6]">
              {t.t('web.home.summaryLine')}{' '}
              <TextLink href={ROUTES.pricing} className="text-body-md">
                {t.t('nav.public.pricing')}
              </TextLink>
            </p>
          </div>

          <div className="lg:justify-self-end">
            <HeroDemoSection locale={locale} />
            <p className="mt-4">
              <TextLink href={ROUTES.demo} className="text-body-sm">
                {t.t('web.demo.hero.more')}
              </TextLink>
            </p>
          </div>
        </div>
      </EditorialSection>

      {/*
        2. The connectors, twice: moving, then still.

        The marquee is the page's one (`scene-budget.test.ts` grants home
        exactly one) and it is energy, not information — it loops the same
        cohort names past the reader at reading speed and can never be read in
        full. The still grid underneath is where the list is actually read,
        and it is the one a crawler, a no-JS client and a reduced-motion
        visitor see, because `Marquee` degrades to a single static row.

        So the pairing is deliberate rather than redundant: motion earns the
        glance, the grid answers it. Nothing in the marquee is announced twice
        to a screen reader — the duplicated track inside it is `aria-hidden`,
        and the grid below carries the real names.
      */}
      <EditorialSection rule id="connectors" ariaLabel={t.t('web.home.v2.marqueeCaption')}>
        <Eyebrow>{t.t('web.home.v2.marqueeCaption')}</Eyebrow>
        <Marquee className="mt-8" speed={32}>
          <ul className="flex items-center gap-10 pe-10">
            {CONNECTOR_PROVIDERS.map((provider) => (
              <li key={provider} className="text-title-sm text-text-tertiary whitespace-nowrap">
                {t.format(`web.provider.${provider}`)}
              </li>
            ))}
          </ul>
        </Marquee>
        <ProviderGrid providers={CONNECTOR_PROVIDERS} className="mt-10" />
        <div className="mt-8">
          <Sticker
            fact={t.format('web.home.b3.sticker.connectorsFact', {
              count: CONNECTOR_PROVIDERS.length,
            })}
            source={t.format('web.home.b3.sticker.connectorsSource')}
            accent="cool"
          />
        </div>
      </EditorialSection>

      {/* 3. One idea, a platform-native version each. The core proof. */}
      <EditorialSection rule id="example" reveal={false}>
        <Heading className="max-w-[32ch]">{t.t('web.home.example.title')}</Heading>
        <Body className="mt-4">{t.t('web.home.example.body')}</Body>
        <EditorialVariantScene
          rows={variantRows}
          masterLabel={t.t('web.home.v2.variantScene.masterLabel')}
          className="mt-12"
        />
      </EditorialSection>

      {/*
        4. The five proof pillars. They used to alternate across five
        full-bleed colour-blocked bands, one tone each, which is five dramatic
        moments in a row and therefore none. They are now one section of
        hairline-separated rows: the numeral carries the sequence, the
        typography carries the hierarchy.
      */}
      <EditorialSection rule id="pillars" reveal={false}>
        <Heading className="max-w-[28ch]">{t.t('web.home.pillars.title')}</Heading>
        <StaggerList stagger={0.07} className="border-border-default mt-12 border-t">
          {PILLARS.map((pillar, index) => (
            <PillarRow key={pillar.id} pillar={pillar} index={index} t={t} />
          ))}
        </StaggerList>
      </EditorialSection>

      {/* 5. Five surfaces, one backend. */}
      <EditorialSection rule id="surfaces" reveal={false}>
        <Heading className="max-w-[24ch]">{t.t('web.home.surfaces.title')}</Heading>
        <Body className="mt-4">{t.t('web.home.surfaces.body')}</Body>

        <EditorialBigNumber
          value={SURFACES.length}
          locale={locale}
          label={t.t('web.home.v2.surfacesStat')}
          className="mt-12 mb-10"
        />

        <StaggerList stagger={0.07} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SURFACES.map((surface) => (
            <div key={surface.id} data-stagger-item>
              {/* The CLI card used to wear a drawn traffic-light title bar.
                  It was decoration standing in for a screenshot we do not
                  have, so it is gone rather than restyled. */}
              <EditorialCard className="h-full">
                <Subheading as="h3" className="text-title-sm">
                  {t.format(surface.nameKey)}
                </Subheading>
                <p className="text-body-md text-text-secondary mt-2">{t.format(surface.bodyKey)}</p>
              </EditorialCard>
            </div>
          ))}
        </StaggerList>

        <p className="mt-10">
          <TextLink href={ROUTES.developers}>{t.t('nav.public.forDevelopers')}</TextLink>
        </p>
      </EditorialSection>

      {/*
        6. The boundaries. The copy is unchanged and stays a quiet disclosure
        rather than a hero moment: this is a sales page for what the product
        does, and four screens of "No ..." set in display type reads as
        apologetic.
      */}
      <EditorialSection rule id="boundaries">
        <Heading as="h2">{t.t('web.home.honest.title')}</Heading>
        <p className="text-body-md text-text-secondary mt-3 max-w-[62ch]">
          {t.t('web.home.honest.lede')}
        </p>
        <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {BOUNDARIES.map((key) => (
            <li key={key} className="flex items-start gap-2.5">
              <X aria-hidden="true" className="text-text-tertiary mt-0.5 size-4 shrink-0" />
              <p className="text-body-sm text-text-secondary leading-[1.5] text-pretty">
                {t.format(key)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <TextLink href={ROUTES.changelog}>{t.t('nav.public.changelog')}</TextLink>
        </p>
      </EditorialSection>

      {/* 7. Pricing teaser. Both figures shown here are already stated,
          verbatim, in `billing.plan.monthlyPrice` / `billing.plan.single`. */}
      <EditorialSection rule id="pricing-teaser">
        <Heading className="max-w-[24ch]">{t.t('web.home.v2.pricingTeaser.title')}</Heading>
        {/* The three sizes, compact: the same integer minor units and the
            same interval control as the pricing page, without the delta
            prose. A visitor who never reaches /pricing should still know the
            ladder exists and that only Standard is on sale. */}
        <TierGrid
          locale={locale}
          variant="compact"
          tiers={tierColumns({
            t,
            ctaHref: ROUTES.signUp,
            ctaLabel: t.t('web.cta.startTrial'),
          })}
          intervalGroupLabel={t.t('web.pricing.tierGrid.intervalGroup')}
          monthlyLabel={t.t('web.pricing.monthlyLabel')}
          annualLabel={t.t('web.pricing.annualLabel')}
          startHereLabel={t.t('web.pricing.tierGrid.startHere')}
          className="mt-12"
        />

        <div className="mt-12 max-w-sm">
          <EditorialCard interactive={false}>
            {/* Both intervals, because a visitor who only ever sees the monthly
                figure never learns the annual one exists. The saving is stated
                in whole dollars, never as a percentage: the real discount on
                29 and 300 is not a round number and the billing copy
                compliance test rejects a percentage. */}
            <EditorialPricePair
              locale={locale}
              monthlyPriceDollars={MONTHLY_PRICE_DOLLARS}
              annualPriceDollars={ANNUAL_PRICE_DOLLARS}
              monthlyLabel={t.t('web.pricing.monthlyLabel')}
              annualLabel={t.t('web.pricing.annualLabel')}
              monthlyDetail={t.t('web.pricing.monthlyDetail')}
              annualDetail={t.t('web.pricing.annualDetail')}
              annualFraming={t.t('web.pricing.annualFraming')}
            />
            <p className="text-body-md text-text-secondary mt-4">
              {t.t('web.home.v2.sticker.trial')}
            </p>
            <p className="mt-6">
              <TextLink href={ROUTES.pricing} className="text-body-md">
                {t.t('web.cta.seePricing')}
              </TextLink>
            </p>
          </EditorialCard>
        </div>
      </EditorialSection>

      {/* 8. Closing. The page's one inverted band. */}
      <ClosingCta
        id="start"
        title={t.t('web.home.closing.title')}
        body={t.t('web.home.closing.body')}
        cta={{ href: ROUTES.signUp, label: t.t('web.cta.startTrial') }}
        footnote={t.t('web.cta.trialFootnote')}
      />

      <JsonLd node={await offerJsonLd(locale)} />
    </>
  );
}
