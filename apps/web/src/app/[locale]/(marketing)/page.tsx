import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppWindow, Bot, Braces, ChevronDown, TerminalSquare, Webhook, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { CORE_PROVIDER_IDS, type CoreProviderId } from '@relay/contracts';
import { cn } from '@relay/design-system/utils';

import {
  BentoCell,
  BentoGrid,
  ClosingCta,
  EditorialPricePair,
  EditorialSection,
  EditorialVariantScene,
  HeroHeadline,
  ProviderGrid,
  ProviderLogoRow,
} from '@/features/marketing/components/editorial';
import {
  HomeHeroStage,
  type HomeHeroStageRow,
} from '@/features/marketing/components/home-hero-stage';
import { HomeJourney, type HomeJourneyStep } from '@/features/marketing/components/home-journey';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { Body, Heading, Lede, Subheading } from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { ColorBand, GradientWash } from '@/features/marketing/components/scene';
import { marketingTranslator } from '@/features/marketing/i18n';
import { offerJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('web.meta.home.title', 'web.meta.home.description', ROUTES.home, locale);
}

const CONNECTOR_PROVIDERS: readonly CoreProviderId[] = CORE_PROVIDER_IDS;

const EXAMPLE_ROWS = [
  {
    id: 'x',
    provider: 'x',
    accountKey: 'web.home.example.x.account',
    variantKey: 'web.home.example.x.variant',
    checkKey: 'web.home.example.x.check',
  },
  {
    id: 'linkedin',
    provider: 'linkedin',
    accountKey: 'web.home.example.linkedin.account',
    variantKey: 'web.home.example.linkedin.variant',
    checkKey: 'web.home.example.linkedin.check',
  },
  {
    id: 'instagram',
    provider: 'instagram',
    accountKey: 'web.home.example.instagram.account',
    variantKey: 'web.home.example.instagram.variant',
    checkKey: 'web.home.example.instagram.check',
  },
  {
    id: 'youtube',
    provider: 'youtube',
    accountKey: 'web.home.example.youtube.account',
    variantKey: 'web.home.example.youtube.variant',
    checkKey: 'web.home.example.youtube.check',
  },
  {
    id: 'bluesky',
    provider: 'bluesky',
    accountKey: 'web.home.example.bluesky.account',
    variantKey: 'web.home.example.bluesky.variant',
    checkKey: 'web.home.example.bluesky.check',
  },
] as const satisfies readonly {
  readonly id: string;
  readonly provider: CoreProviderId;
  readonly accountKey: string;
  readonly variantKey: string;
  readonly checkKey: string;
}[];

const JOURNEY_STEPS = [
  {
    id: 'source',
    titleKey: 'web.product.step.source.title',
    bodyKey: 'web.product.step.source.body',
  },
  {
    id: 'compose',
    titleKey: 'web.product.step.compose.title',
    bodyKey: 'web.product.step.compose.body',
  },
  {
    id: 'validate',
    titleKey: 'web.product.step.validate.title',
    bodyKey: 'web.product.step.validate.body',
  },
  {
    id: 'approve',
    titleKey: 'web.product.step.approve.title',
    bodyKey: 'web.product.step.approve.body',
  },
  {
    id: 'schedule',
    titleKey: 'web.product.step.schedule.title',
    bodyKey: 'web.product.step.schedule.body',
  },
  {
    id: 'publish',
    titleKey: 'web.product.step.publish.title',
    bodyKey: 'web.product.step.publish.body',
  },
  {
    id: 'learn',
    titleKey: 'web.product.step.learn.title',
    bodyKey: 'web.product.step.learn.body',
  },
] as const satisfies readonly {
  readonly id: HomeJourneyStep['id'];
  readonly titleKey: string;
  readonly bodyKey: string;
}[];

const SURFACES = [
  { id: 'web', nameKey: 'web.home.surfaces.web', icon: AppWindow },
  { id: 'mcp', nameKey: 'web.home.surfaces.mcp', icon: Bot },
  { id: 'api', nameKey: 'web.home.surfaces.api', icon: Braces },
  { id: 'cli', nameKey: 'web.home.surfaces.cli', icon: TerminalSquare },
  { id: 'webhooks', nameKey: 'web.home.surfaces.webhooks', icon: Webhook },
] as const satisfies readonly {
  readonly id: string;
  readonly nameKey: string;
  readonly icon: LucideIcon;
}[];

const BOUNDARIES = [
  'web.home.honest.noMedia',
  'web.home.honest.noAutomationOfEngagement',
  'web.home.honest.noUnofficial',
  'web.home.honest.noPromises',
  'web.home.honest.noUnattendedPublishing',
] as const;

export default async function HomePage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  const providerName = (provider: CoreProviderId): string => t.format(`web.provider.${provider}`);
  const variantRows = EXAMPLE_ROWS.map((row) => ({
    id: row.id,
    provider: row.provider,
    account: t.format(row.accountKey),
    variant: t.format(row.variantKey),
    check: t.format(row.checkKey),
  }));
  const heroRows: readonly HomeHeroStageRow[] = EXAMPLE_ROWS.map((row) => ({
    id: row.id,
    provider: row.provider,
    account: t.format(row.accountKey),
  }));
  const journeySteps: readonly HomeJourneyStep[] = JOURNEY_STEPS.map((step) => ({
    id: step.id,
    title: t.format(step.titleKey),
    body: t.format(step.bodyKey),
  }));

  return (
    <>
      <EditorialSection
        reveal={false}
        className="isolate overflow-hidden"
        containerClassName="py-12 md:py-20 lg:py-24"
      >
        <GradientWash accent="warm" placement="top" className="h-72 opacity-80" />

        <div className="relative grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <HeroHeadline
              lead={t.t('web.home.v2.hero.headline')}
              accent={t.t('web.home.v2.hero.headlineAccent')}
            />

            <Lede className="mt-8 max-w-[56ch]">{t.t('web.home.promise')}</Lede>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
              <TextLink href={ROUTES.demo}>{t.t('web.demo.hero.viewCta')}</TextLink>
            </div>

            <p className="text-body-sm text-text-tertiary mt-4">
              {t.t('web.home.v2.sticker.trial')}
            </p>

            <div className="border-border-subtle mt-10 border-t pt-6">
              <p className="text-body-sm text-text-tertiary mb-4 flex items-baseline gap-2">
                <span className="font-display text-title-lg text-text-primary" data-numeric>
                  {CONNECTOR_PROVIDERS.length}
                </span>
                {t.t('web.home.v2.hero.reachLabel')}
              </p>
              <ProviderLogoRow
                providers={CONNECTOR_PROVIDERS}
                ariaLabel={t.t('web.home.v2.hero.providersLabel')}
                name={providerName}
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <HomeHeroStage
              rows={heroRows}
              masterLabel={t.t('web.home.v2.variantScene.masterLabel')}
              caption={t.t('web.home.example.caption')}
            />
          </div>
        </div>
      </EditorialSection>

      <ColorBand accent="warm" id="workflow" texture containerClassName="py-20 md:py-28 lg:py-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div className="max-w-[46rem]">
            <Heading>{t.t('web.product.v2.sequence.title')}</Heading>
            <Body className="mt-4">{t.t('web.home.lede')}</Body>
          </div>
          <TextLink href={ROUTES.product}>{t.t('nav.public.product')}</TextLink>
        </div>

        <HomeJourney steps={journeySteps} label={t.t('web.product.v2.sequence.title')} />
      </ColorBand>

      <EditorialSection rule id="proof" reveal={false}>
        <BentoGrid>
          <BentoCell span="lead" surface="bare" as="section">
            <Heading>{t.t('web.home.example.title')}</Heading>
            <Body className="mt-4">{t.t('web.home.example.body')}</Body>
            <EditorialVariantScene
              rows={variantRows}
              masterLabel={t.t('web.home.v2.variantScene.masterLabel')}
              className="mt-8"
            />
          </BentoCell>

          <BentoCell span="side" as="section" className="lg:sticky lg:top-28">
            <Subheading as="h3">{t.t('web.home.v2.bento.networks.title')}</Subheading>
            <ProviderGrid
              providers={CONNECTOR_PROVIDERS}
              className="mt-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2"
            />
            <p className="text-body-sm text-text-tertiary mt-6 leading-[1.6]">
              {t.t('web.home.v2.hero.reachNote')}
            </p>
            <p className="mt-5">
              <TextLink href={ROUTES.integrations}>{t.t('nav.public.integrations')}</TextLink>
            </p>
          </BentoCell>

          <BentoCell span="full" as="section" className="mt-2">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Subheading as="h3">{t.t('web.home.surfaces.title')}</Subheading>
                <p className="text-body-md text-text-secondary mt-3 max-w-[42ch] leading-[1.65]">
                  {t.t('web.home.surfaces.body')}
                </p>
              </div>

              <ul className="grid gap-px sm:grid-cols-2 lg:col-span-8 lg:grid-cols-5">
                {SURFACES.map((surface) => {
                  const Icon = surface.icon;
                  return (
                    <li
                      key={surface.id}
                      className="border-border-subtle flex min-h-28 flex-col justify-between border-s ps-4"
                    >
                      <Icon aria-hidden="true" className="text-accent size-6" strokeWidth={1.5} />
                      <span className="text-body-md text-text-primary mt-6 font-semibold">
                        {t.format(surface.nameKey)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </BentoCell>
        </BentoGrid>
      </EditorialSection>

      <ColorBand accent="cool" id="pricing" texture containerClassName="py-20 md:py-28 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <Heading>{t.t('web.home.v2.pricingTeaser.title')}</Heading>
            <Body className="mt-4">{t.t('web.home.summaryLine')}</Body>

            <EditorialPricePair
              locale={locale}
              monthlyPriceDollars={25}
              annualPriceDollars={250}
              monthlyLabel={t.t('web.pricing.monthlyLabel')}
              annualLabel={t.t('web.pricing.annualLabel')}
              monthlyDetail={t.t('web.pricing.monthlyDetail')}
              annualDetail={t.t('web.pricing.annualDetail')}
              annualFraming={t.t('web.pricing.annualFraming')}
              className="mt-10"
            />

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
              <TextLink href={ROUTES.pricing}>{t.t('web.cta.seePricing')}</TextLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <details className="group border-border-strong bg-surface-raised rounded-poster shadow-hard border">
              <summary
                className={cn(
                  'flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4',
                  'text-title-sm text-text-primary marker:content-none [&::-webkit-details-marker]:hidden',
                  'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                )}
              >
                {t.t('web.home.honest.title')}
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 transition-transform duration-(--duration-base) group-open:rotate-180"
                />
              </summary>
              <div className="border-border-subtle border-t px-6 py-6">
                <p className="text-body-sm text-text-secondary leading-[1.6]">
                  {t.t('web.home.honest.lede')}
                </p>
                <ul className="mt-6 space-y-4">
                  {BOUNDARIES.map((key) => (
                    <li key={key} className="flex items-start gap-3">
                      <X aria-hidden="true" className="text-text-tertiary mt-0.5 size-4 shrink-0" />
                      <p className="text-body-sm text-text-secondary leading-[1.55] text-pretty">
                        {t.format(key)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </div>
      </ColorBand>

      <ClosingCta
        id="start"
        title={t.t('web.home.closing.title')}
        body={t.t('web.home.closing.body')}
        cta={{ href: ROUTES.signUp, label: t.t('web.cta.startTrial') }}
        footnote={t.t('web.home.v2.sticker.trial')}
        wash="warm"
        celebrate
      />

      <JsonLd node={await offerJsonLd(locale)} />
    </>
  );
}
