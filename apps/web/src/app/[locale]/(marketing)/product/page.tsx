import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { StaggerList } from '@/components/motion';
import {
  BentoCell,
  BentoGrid,
  ClosingCta,
  EditorialBigNumber,
  EditorialSection,
  EditorialVariantScene,
  HeroHeadline,
} from '@/features/marketing/components/editorial';
import { Body, Heading, List, Split, Subheading } from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { ProductShot } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { ColorBand, GradientWash } from '@/features/marketing/components/scene';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';
import type { ProviderId } from '@/lib/api/types';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.product.title',
    'web.meta.product.description',
    ROUTES.product,
    locale,
  );
}

const STEPS = [
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
  { id: 'learn', titleKey: 'web.product.step.learn.title', bodyKey: 'web.product.step.learn.body' },
] as const;

const STATES = [
  'web.product.states.partial',
  'web.product.states.revoked',
  'web.product.states.rateLimited',
  'web.product.states.duplicate',
  'web.product.states.offline',
  'web.product.states.permission',
] as const;

/**
 * Three of the five home page rows (`web.home.example.*`), reused rather
 * than duplicated, to show what the "compose" step in `STEPS` above actually
 * produces without inventing a second set of example copy.
 */
const DEMO_ROWS = [
  {
    id: 'x' as ProviderId,
    accountKey: 'web.home.example.x.account',
    variantKey: 'web.home.example.x.variant',
    checkKey: 'web.home.example.x.check',
  },
  {
    id: 'linkedin' as ProviderId,
    accountKey: 'web.home.example.linkedin.account',
    variantKey: 'web.home.example.linkedin.variant',
    checkKey: 'web.home.example.linkedin.check',
  },
  {
    id: 'instagram' as ProviderId,
    accountKey: 'web.home.example.instagram.account',
    variantKey: 'web.home.example.instagram.variant',
    checkKey: 'web.home.example.instagram.check',
  },
] as const;

export default async function ProductPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  const demoRows = DEMO_ROWS.map((row) => ({
    id: row.id,
    provider: row.id,
    account: t.format(row.accountKey),
    variant: t.format(row.variantKey),
    check: t.format(row.checkKey),
  }));

  return (
    <>
      {/*
        1. The hero. `HeroHeadline` replaces the single-line `EditorialDisplay`
        this page opened with: a full display step larger, two lines, the
        second set in the action accent, matching the home page's hero and
        `web.product.lede` moved underneath it as the standfirst rather than
        the h1 itself. `web.product.title` ("The publishing desk") is no
        longer the visible headline; the two new sentences below say the same
        thing at hero scale instead of at section-heading scale.
      */}
      <EditorialSection
        reveal={false}
        className="isolate overflow-hidden"
        containerClassName="py-20 md:py-28 lg:py-32"
      >
        <GradientWash accent="warm" placement="top" />
        <div className="relative max-w-[52rem]">
          <HeroHeadline
            lead={t.t('web.product.v2.hero.headline')}
            accent={t.t('web.product.v2.hero.headlineAccent')}
          />
          <p className="text-body-lg text-text-secondary mt-8 max-w-[58ch] leading-[1.62] md:text-[1.125rem]">
            {t.t('web.product.lede')}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
            <Cta href={ROUTES.capabilities} variant="secondary">
              {t.t('web.cta.seeCapabilities')}
            </Cta>
          </div>
        </div>
      </EditorialSection>

      {/*
        2. What it does: the seven-step sequence, then the compose step made
        concrete, then the screenshot disclosure. One `ColorBand` (of the two
        this page is budgeted in `scene-budget.test.ts`, argued there as "two
        distinct halves: what it does / what it costs you to switch") rather
        than three separate full-bleed sections.

        `web.product.v2.demo.title` ("One brief, three platform-native
        drafts") now sits directly over `EditorialVariantScene`, which is the
        section that actually has three rows. It used to sit over the
        seven-step list instead — a heading naming a count of three above
        content with a different count. The new `web.product.v2.sequence.title`
        states the sequence's own count, seven, in its place.
      */}
      <ColorBand accent="warm" id="sequence" texture>
        <Heading className="max-w-[28ch]">{t.t('web.product.v2.sequence.title')}</Heading>
        <StaggerList stagger={0.07} className="border-border-default mt-12 border-t">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              data-stagger-item
              className="border-border-subtle grid gap-2 border-b py-7 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8"
            >
              {/* The step number was set in display type at 45% opacity, which
                  is a decorative watermark rather than a signpost. It is now a
                  quiet monospaced ordinal, the same treatment the rest of the
                  site gives a sequence. */}
              <span
                aria-hidden="true"
                className="text-body-sm text-text-tertiary font-mono tabular-nums"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 space-y-2">
                <h3 className="text-title-sm text-text-primary">{t.format(step.titleKey)}</h3>
                <p className="text-body-lg text-text-secondary max-w-[68ch] leading-[1.65]">
                  {t.format(step.bodyKey)}
                </p>
              </div>
            </div>
          ))}
        </StaggerList>

        <BentoGrid className="mt-14">
          {/* Bare: the variant scene is nine cards of its own, and wrapping
              them in a tenth panel is the cards-inside-a-card failure a
              bento invites. */}
          <BentoCell span="lead" surface="bare">
            <Subheading as="h3">{t.t('web.product.v2.demo.title')}</Subheading>
            <Body className="mt-3 max-w-[62ch]">{t.t('web.product.v2.demo.body')}</Body>
            <EditorialVariantScene
              rows={demoRows}
              masterLabel={t.t('web.home.v2.variantScene.masterLabel')}
              className="mt-8"
            />
          </BentoCell>

          <BentoCell span="side" as="section">
            <EditorialBigNumber
              value={STEPS.length}
              locale={locale}
              label={t.t('web.product.v2.sequence.stepsStat')}
            />
            <Subheading as="h3" className="mt-8 text-title-sm">
              {t.t('web.product.shot.pending')}
            </Subheading>
            <Body className="mt-3">{t.t('web.product.shot.caption')}</Body>
            <div className="mt-6">
              <ProductShot
                locale={locale}
                alt={t.t('web.product.step.compose.body')}
                caption={t.t('web.home.example.caption')}
              />
            </div>
          </BentoCell>
        </BentoGrid>
      </ColorBand>

      {/*
        3. What it costs you to switch: the states nobody likes to design.
        The second budgeted `ColorBand`, ultramarine rather than marigold, the
        same accent split home draws between its own proof band and its agent
        band.
      */}
      <ColorBand accent="cool" id="states" texture>
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.product.states.title')}</Heading>
              <Body>{t.t('web.product.states.body')}</Body>
              <p>
                <TextLink href={ROUTES.status}>{t.t('nav.public.status')}</TextLink>
              </p>
            </div>
          }
        >
          <List items={STATES.map((key) => t.format(key))} />
        </Split>
      </ColorBand>

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
