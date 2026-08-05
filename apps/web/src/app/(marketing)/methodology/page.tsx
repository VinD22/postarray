import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import {
  Body,
  Container,
  Heading,
  List,
  Section,
  Split,
} from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { CorrectionNotice, PageIntro } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.methodology.title',
  'web.meta.methodology.description',
  ROUTES.methodology,
);

const RECHECK = [
  'web.methodology.recheck.beforeConnector',
  'web.methodology.recheck.monthly',
  'web.methodology.recheck.quarterly',
  'web.methodology.recheck.immediate',
] as const;

const COMPARISON = [
  'web.methodology.comparison.bestFor',
  'web.methodology.comparison.dated',
  'web.methodology.comparison.distinction',
  'web.methodology.comparison.noLogos',
] as const;

export default function MethodologyPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro title={t.t('web.methodology.title')} lede={t.t('web.methodology.lede')} />

      <Section id="claims">
        <Split aside={<Heading>{t.t('web.methodology.claims.title')}</Heading>}>
          <Body>{t.t('web.methodology.claims.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.capabilities}>{t.t('nav.public.capabilities')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="recheck">
        <Split aside={<Heading>{t.t('web.methodology.recheck.title')}</Heading>}>
          <List items={RECHECK.map((key) => t.format(key))} />
        </Split>
      </Section>

      <Section id="comparisons">
        <Split aside={<Heading>{t.t('web.methodology.comparison.title')}</Heading>}>
          <List items={COMPARISON.map((key) => t.format(key))} />
          <p className="mt-6">
            <TextLink href={ROUTES.compare}>{t.t('nav.public.comparisons')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="benchmarks">
        <Split aside={<Heading>{t.t('web.methodology.benchmarks.title')}</Heading>}>
          <Body>{t.t('web.methodology.benchmarks.body')}</Body>
        </Split>
      </Section>

      <Section id="ai">
        <Split aside={<Heading>{t.t('web.methodology.ai.title')}</Heading>}>
          <Body>{t.t('web.methodology.ai.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.aiUse}>{t.t('web.legal.ai.title')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="corrections">
        <Split aside={<Heading>{t.t('web.methodology.corrections.title')}</Heading>}>
          <Body>{t.t('web.methodology.corrections.body')}</Body>
        </Split>
      </Section>

      <Container>
        <div className="pb-16 md:pb-20">
          <CorrectionNotice />
        </div>
      </Container>
    </>
  );
}
