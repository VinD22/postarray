import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

import { Link } from '@/components/link';
import { MagneticButton, Reveal, StaggerList } from '@/components/motion';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  Body,
  Container,
  FullBleed,
  Heading,
  Lede,
  Section,
  Subheading,
} from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { Band, type BandTone } from '@/features/marketing/components/loud/band';
import { BigNumber } from '@/features/marketing/components/loud/big-number';
import { CtaSlab } from '@/features/marketing/components/loud/cta-slab';
import { LoudDisplay } from '@/features/marketing/components/loud/display';
import { HeroPlatformCycler } from '@/features/marketing/components/loud/hero-platform-cycler';
import { LogoMarquee } from '@/features/marketing/components/loud/logo-marquee';
import { PosterCard } from '@/features/marketing/components/loud/poster-card';
import { Sticker } from '@/features/marketing/components/loud/sticker';
import { VariantScene } from '@/features/marketing/components/loud/variant-scene';
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

/** Every real, shipped connector (`features/marketing/data/connectors.ts`), for the "official APIs only" marquee. */
const MARQUEE_PROVIDERS: readonly ProviderId[] = [
  'x',
  'linkedin',
  'instagram',
  'facebook',
  'youtube',
  'tiktok',
  'threads',
  'bluesky',
];

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

/** paper -> brand -> paper -> pop -> cta, one tone per pillar, in order. */
const PILLAR_TONES: readonly BandTone[] = ['paper', 'brand', 'paper', 'pop', 'cta'];

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
  const progressLabels = variantRows.map((_, index) =>
    t.t('web.home.v2.variantScene.progress', {
      revealed: index + 1,
      total: variantRows.length,
    }),
  );

  return (
    <>
      {/* 1. Kinetic hero. Min height ~90dvh; the promise headline is the LCP
          element and server HTML already shows its finished text, so the
          on-load kinetic reveal never delays or shifts first paint. */}
      <Band
        tone="paper"
        className="relative flex min-h-[90dvh] items-center overflow-hidden"
        containerClassName="py-20 md:py-28"
      >
        <div className="relative max-w-[76rem]">
          {/*
           * `size="2xl"` (clamp up to 9rem) is right for a short punch line
           * (see the closing CtaSlab below), but `web.home.promise` is a full
           * sentence — at 2xl it wrapped to 6-7 lines and pushed the CTA
           * below the fold on common viewport heights. `xl` (clamp up to
           * 6rem) keeps the display-font impact while fitting the actual
           * copy length.
           */}
          <LoudDisplay as="h1" size="xl" kinetic split="words">
            {t.t('web.home.promise')}
          </LoudDisplay>

          <p className="font-display text-display-lg text-text-secondary mt-5 flex flex-wrap items-baseline gap-x-3 text-pretty">
            {heroBefore.trim() ? <span>{heroBefore}</span> : null}
            <HeroPlatformCycler platforms={platformNames} />
            {heroAfter.trim() ? <span>{heroAfter}</span> : null}
          </p>

          <Lede className="mt-7 max-w-[62ch]">{t.t('web.home.lede')}</Lede>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton asChild variant="cta" className="text-body-lg h-11 px-5">
              <Link href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Link>
            </MagneticButton>
            <Cta href={ROUTES.product} variant="secondary">
              {t.t('nav.public.product')}
            </Cta>
          </div>

          <p className="text-body-md text-text-tertiary mt-6 max-w-[64ch] leading-[1.6]">
            {t.t('web.home.summaryLine')}{' '}
            <TextLink href={ROUTES.pricing} className="text-body-md">
              {t.t('nav.public.pricing')}
            </TextLink>
          </p>
        </div>

        <Sticker
          tone="cta"
          rotate={-6}
          ariaHidden
          className="relay-sticker-float pointer-events-none absolute end-6 top-10 hidden md:inline-flex"
        >
          {t.t('web.home.v2.sticker.trial')}
        </Sticker>
        <Sticker
          tone="pop"
          rotate={5}
          ariaHidden
          className="relay-sticker-float pointer-events-none absolute start-6 bottom-10 hidden md:inline-flex"
        >
          {t.t('web.home.v2.sticker.official')}
        </Sticker>
      </Band>

      {/* 2. Connector marquee. Official APIs only, honestly captioned. */}
      <section aria-label={t.t('web.home.v2.marqueeCaption')}>
        <FullBleed>
          <LogoMarquee providers={MARQUEE_PROVIDERS} />
        </FullBleed>
        <Container>
          <p className="text-body-sm text-text-tertiary py-4">
            {t.t('web.home.v2.marqueeCaption')}
          </p>
        </Container>
      </section>

      {/* 3. One idea, five platform-native versions. The core proof, now a
          pinned scrub on desktop with a stacked static fallback everywhere
          else, and a screen-reader-only `<dl>` that is the same content
          either way. */}
      <Section id="example">
        <Heading className="max-w-[32ch]">{t.t('web.home.example.title')}</Heading>
        <Body className="mt-4">{t.t('web.home.example.body')}</Body>
      </Section>
      <FullBleed className="border-border-default border-y">
        <VariantScene
          rows={variantRows}
          masterLabel={t.t('web.home.v2.variantScene.masterLabel')}
          progressLabels={progressLabels}
        />
      </FullBleed>

      {/* 4. The five proof pillars, alternating tone bands. Pillar copy is
          verbatim from the existing catalog; only the presentation is loud.
          Nothing inside a non-paper band uses a shared text component that
          hardcodes a light-surface color — every piece of running text here
          inherits its color from the band, per `Band`'s own doc comment. */}
      {PILLARS.map((pillar, index) => (
        <Band
          key={pillar.id}
          tone={PILLAR_TONES[index] ?? 'paper'}
          id={index === 0 ? 'pillars' : undefined}
        >
          {index === 0 ? (
            <Heading className="mb-10 max-w-[28ch]">{t.t('web.home.pillars.title')}</Heading>
          ) : null}
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-12">
              <span
                aria-hidden="true"
                className="font-display text-display-xl leading-none lg:col-span-3"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="space-y-4 lg:col-span-8 lg:col-start-5">
                <h3 className="text-title-lg text-pretty">{t.format(pillar.titleKey)}</h3>
                <p className="text-body-lg max-w-[68ch] leading-[1.65]">
                  {t.format(pillar.bodyKey)}
                </p>
                <p className="border-border-bold text-body-sm inline-block border-2 border-dashed px-4 py-2 font-mono">
                  {t.format(pillar.proofKey)}
                </p>
              </div>
            </div>
          </Reveal>
        </Band>
      ))}

      {/* 5. Five surfaces, one backend. */}
      <Section id="surfaces">
        <Heading className="max-w-[24ch]">{t.t('web.home.surfaces.title')}</Heading>
        <Body className="mt-4">{t.t('web.home.surfaces.body')}</Body>

        <BigNumber
          value={SURFACES.length}
          locale={locale}
          label={t.t('web.home.v2.surfacesStat')}
          className="mt-10 mb-8"
        />

        <StaggerList className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SURFACES.map((surface) => (
            <div key={surface.id} data-stagger-item>
              <PosterCard tone="paper" className="h-full">
                {surface.id === 'cli' ? (
                  <div
                    aria-hidden="true"
                    className="bg-surface-inverted -mx-6 -mt-6 mb-4 flex items-center gap-1.5 rounded-t-lg px-3 py-2.5"
                  >
                    <span className="bg-text-inverted/70 size-2 rounded-full" />
                    <span className="bg-text-inverted/50 size-2 rounded-full" />
                    <span className="bg-text-inverted/30 size-2 rounded-full" />
                  </div>
                ) : null}
                <Subheading as="h3" className="text-title-sm">
                  {t.format(surface.nameKey)}
                </Subheading>
                <p className="text-body-md text-text-secondary mt-2">{t.format(surface.bodyKey)}</p>
              </PosterCard>
            </div>
          ))}
        </StaggerList>

        <p className="mt-8">
          <TextLink href={ROUTES.developers}>{t.t('nav.public.forDevelopers')}</TextLink>
        </p>
      </Section>

      {/* 6. The boundaries. Kept honest — the copy is unchanged — but
          deliberately staged as a quiet disclosure, not a hero moment. It
          was originally a full-bleed ink band with each two-sentence
          boundary set in display type up to 64px: four screens' worth of
          "No ..." in a row reads as apologetic rather than confident, and
          this is a sales page for what Relay DOES do. A compact two-column
          list in the page's normal editorial register (same Heading/Section
          components as the quieter marketing pages) says the same true
          things without asking a visitor to spend most of a scroll session
          reading about what they can't have. */}
      <Section id="boundaries">
        <Heading as="h2">{t.t('web.home.honest.title')}</Heading>
        <p className="text-body-md text-text-secondary mt-3 max-w-[62ch]">
          {t.t('web.home.honest.lede')}
        </p>
        <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {BOUNDARIES.map((key) => (
            <li key={key} className="flex items-start gap-2.5">
              <X aria-hidden="true" className="text-text-tertiary mt-0.5 size-4 shrink-0" />
              <p className="text-body-sm text-text-secondary leading-[1.5] text-pretty">
                {t.format(key)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <TextLink href={ROUTES.changelog}>{t.t('nav.public.changelog')}</TextLink>
        </p>
      </Section>

      {/* 7. Pricing teaser. Both figures shown here are already stated,
          verbatim, in `billing.plan.monthlyPrice` / `billing.plan.single`. */}
      <Section id="pricing-teaser">
        <Heading className="max-w-[24ch]">{t.t('web.home.v2.pricingTeaser.title')}</Heading>
        <div className="mt-8 max-w-sm">
          <PosterCard tone="paper">
            <BigNumber
              value={MONTHLY_PRICE_DOLLARS}
              locale={locale}
              formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
              label={t.t('billing.plan.single')}
            />
            <p className="text-body-sm text-text-tertiary mt-1">
              {t.t('web.pricing.perMonthNote')}
            </p>
            <Sticker tone="cta" rotate={-4} className="mt-4">
              {t.t('web.home.v2.sticker.trial')}
            </Sticker>
            <p className="mt-6">
              <TextLink href={ROUTES.pricing} className="text-body-md">
                {t.t('web.cta.seePricing')}
              </TextLink>
            </p>
          </PosterCard>
        </div>
      </Section>

      {/* 8. Closing. */}
      <CtaSlab
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
