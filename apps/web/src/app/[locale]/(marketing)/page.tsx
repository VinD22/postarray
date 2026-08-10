import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

import { StaggerList } from '@/components/motion';
import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  ClosingCta,
  EditorialBigNumber,
  EditorialCard,
  EditorialDisplay,
  EditorialPlatformCycler,
  EditorialSection,
  EditorialVariantScene,
  Eyebrow,
  ProviderGrid,
} from '@/features/marketing/components/editorial';
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

/** Every real, shipped connector (`features/marketing/data/connectors.ts`), for the "official APIs only" grid. */
const CONNECTOR_PROVIDERS: readonly ProviderId[] = [
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
        <div className="max-w-[68rem]">
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
      </EditorialSection>

      {/*
        2. The connectors. Was an infinitely scrolling marquee of ink-bordered
        name chips; now one still, wrapped grid that shows all of them at once.
      */}
      <EditorialSection rule id="connectors" ariaLabel={t.t('web.home.v2.marqueeCaption')}>
        <Eyebrow>{t.t('web.home.v2.marqueeCaption')}</Eyebrow>
        <ProviderGrid providers={CONNECTOR_PROVIDERS} className="mt-8" />
      </EditorialSection>

      {/* 3. One idea, five platform-native versions. The core proof. */}
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
            <div
              key={pillar.id}
              data-stagger-item
              className="border-border-subtle grid gap-4 border-b py-10 lg:grid-cols-12 lg:items-start lg:gap-12"
            >
              <span
                aria-hidden="true"
                className="text-text-tertiary font-mono text-body-sm tabular-nums lg:col-span-2"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="space-y-4 lg:col-span-9 lg:col-start-4">
                <h3 className="text-title-lg text-text-primary text-pretty">
                  {t.format(pillar.titleKey)}
                </h3>
                <p className="text-body-lg text-text-secondary max-w-[68ch] leading-[1.65]">
                  {t.format(pillar.bodyKey)}
                </p>
                <p className="border-border-default text-body-sm text-text-tertiary border-s ps-4 font-mono leading-[1.6]">
                  {t.format(pillar.proofKey)}
                </p>
              </div>
            </div>
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
        <div className="mt-10 max-w-sm">
          <EditorialCard interactive={false}>
            <EditorialBigNumber
              value={MONTHLY_PRICE_DOLLARS}
              locale={locale}
              formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
              label={t.t('billing.plan.single')}
            />
            <p className="text-body-sm text-text-tertiary mt-3">
              {t.t('web.pricing.perMonthNote')}
            </p>
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
