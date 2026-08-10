import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import {
  Body,
  Container,
  Heading,
  Lede,
  List,
  Section,
  Split,
} from '@/features/marketing/components/layout';
import {
  ClosingCta,
  EditorialDisplay,
  EditorialSection,
} from '@/features/marketing/components/editorial';
import { TextLink } from '@/features/marketing/components/links';
import { CorrectionNotice } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.methodology.title',
    'web.meta.methodology.description',
    ROUTES.methodology,
    locale,
  );
}

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

export default async function MethodologyPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <EditorialSection>
        <div className="max-w-[46rem]">
          <EditorialDisplay as="h1" size="md">
            {t.t('web.methodology.title')}
          </EditorialDisplay>
          <Lede className="mt-6">{t.t('web.methodology.lede')}</Lede>
        </div>
      </EditorialSection>

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
          <CorrectionNotice locale={locale} />
        </div>
      </Container>

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
