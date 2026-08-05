import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system/primitives';

import { JsonLd } from '@/features/marketing/components/json-ld';
import {
  Body,
  Container,
  Display,
  Fact,
  FactList,
  Heading,
  Lede,
  List,
  Section,
  Split,
  Subheading,
} from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { marketingTranslator } from '@/features/marketing/i18n';
import { offerJsonLd, pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.home.title',
  'web.meta.home.description',
  ROUTES.home,
);

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

export default function HomePage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      {/* The opening statement. No hero image, no metric tiles, no eyebrow. */}
      <Container>
        <div className="max-w-[52rem] py-16 md:py-24 lg:py-28">
          <Display>{t.t('web.home.promise')}</Display>
          <Lede className="mt-7 max-w-[62ch]">{t.t('web.home.lede')}</Lede>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
            <Cta href={ROUTES.product} variant="secondary">
              {t.t('nav.public.product')}
            </Cta>
          </div>
          <p className="mt-6 max-w-[64ch] text-body-md leading-[1.6] text-text-tertiary">
            {t.t('web.home.summaryLine')}{' '}
            <TextLink href={ROUTES.pricing} className="text-body-md">
              {t.t('nav.public.pricing')}
            </TextLink>
          </p>
        </div>
      </Container>

      {/* One idea, five platform-native versions. */}
      <Section id="example">
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.home.example.title')}</Heading>
              <Body>{t.t('web.home.example.body')}</Body>
            </div>
          }
        >
          <TableContainer className="relay-scrollbar">
            <Table density="comfortable" className="min-w-[46rem]">
              <TableCaption className="text-start">{t.t('web.home.example.caption')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[12rem]">
                    {t.t('web.home.example.column.account')}
                  </TableHead>
                  <TableHead className="min-w-[18rem]">
                    {t.t('web.home.example.column.variant')}
                  </TableHead>
                  <TableHead className="min-w-[16rem]">
                    {t.t('web.home.example.column.check')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EXAMPLE_ROWS.map((row) => (
                  <TableRow key={row.id}>
                    <TableRowHeader className="align-top text-body-md text-text-primary">
                      {t.format(row.accountKey)}
                    </TableRowHeader>
                    <TableCell className="align-top whitespace-normal text-text-secondary">
                      {t.format(row.variantKey)}
                    </TableCell>
                    <TableCell className="align-top whitespace-normal text-text-secondary">
                      {t.format(row.checkKey)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Split>
      </Section>

      {/* The five proof pillars, as rows rather than as a card wall. */}
      <Section id="pillars">
        <Heading className="max-w-[24ch]">{t.t('web.home.pillars.title')}</Heading>
        <dl className="mt-10 border-t border-border-default">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="grid gap-x-12 gap-y-3 border-b border-border-subtle py-8 lg:grid-cols-12"
            >
              <dt className="lg:col-span-4">
                <Subheading as="h3" className="text-pretty">
                  {t.format(pillar.titleKey)}
                </Subheading>
              </dt>
              <dd className="min-w-0 space-y-3 lg:col-span-7 lg:col-start-6">
                <p className="max-w-[68ch] text-body-lg leading-[1.65] text-text-secondary">
                  {t.format(pillar.bodyKey)}
                </p>
                <p className="max-w-[68ch] text-body-md leading-[1.6] text-text-tertiary">
                  {t.format(pillar.proofKey)}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Five surfaces, one backend. */}
      <Section id="surfaces">
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.home.surfaces.title')}</Heading>
              <Body>{t.t('web.home.surfaces.body')}</Body>
              <p>
                <TextLink href={ROUTES.developers}>{t.t('nav.public.forDevelopers')}</TextLink>
              </p>
            </div>
          }
        >
          <FactList>
            {SURFACES.map((surface) => (
              <Fact key={surface.id} term={t.format(surface.nameKey)}>
                {t.format(surface.bodyKey)}
              </Fact>
            ))}
          </FactList>
        </Split>
      </Section>

      {/* The boundaries. */}
      <Section id="boundaries">
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.home.honest.title')}</Heading>
              <Body>{t.t('web.home.honest.lede')}</Body>
              <p>
                <TextLink href={ROUTES.changelog}>{t.t('nav.public.changelog')}</TextLink>
              </p>
            </div>
          }
        >
          <List items={BOUNDARIES.map((key) => t.format(key))} />
        </Split>
      </Section>

      {/* Closing. */}
      <Section id="start">
        <div className="max-w-[46rem] space-y-5">
          <Heading>{t.t('web.home.closing.title')}</Heading>
          <Body>{t.t('web.home.closing.body')}</Body>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
            <Cta href={ROUTES.capabilities} variant="secondary">
              {t.t('web.cta.seeCapabilities')}
            </Cta>
          </div>
          <p className="max-w-[62ch] text-body-md leading-[1.6] text-text-tertiary">
            {t.t('web.cta.trialFootnote')}
          </p>
        </div>
      </Section>

      <JsonLd node={offerJsonLd()} />
    </>
  );
}
