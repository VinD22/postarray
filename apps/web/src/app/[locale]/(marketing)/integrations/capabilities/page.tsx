import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CapabilityBadge, Notice } from '@relay/design-system/patterns';

import { CapabilityMatrix } from '@/features/marketing/components/capability-matrix';
import {
  Container,
  Fact,
  FactList,
  Heading,
  Lede,
  Meta,
  Section,
} from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import {
  ClosingCta,
  EditorialDisplay,
  EditorialSection,
} from '@/features/marketing/components/editorial';
import { CorrectionNotice, ReviewStamp } from '@/features/marketing/components/page-parts';
import { CAPABILITY_SNAPSHOT, capabilityStateCounts } from '@/features/marketing/data/connectors';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import { breadcrumbJsonLd, pageMetadata } from '@/features/marketing/seo';
import { JsonLd } from '@/features/marketing/components/json-ld';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.capabilities.title',
    'web.meta.capabilities.description',
    ROUTES.capabilities,
    locale,
  );
}

const LEGEND = ['supported', 'requires_review', 'not_implemented', 'unsupported'] as const;

export default async function CapabilitiesPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);
  const counts = capabilityStateCounts();

  return (
    <>
      <EditorialSection>
        <div className="max-w-[52rem]">
          <EditorialDisplay as="h1" size="md">
            {t.t('web.capabilities.title')}
          </EditorialDisplay>
          <Lede className="mt-6">{t.t('web.capabilities.lede')}</Lede>
          <div className="mt-6 space-y-2">
            <Meta>
              {t.t('web.capabilities.snapshot', {
                version: CAPABILITY_SNAPSHOT.version,
                date: formatDate(CAPABILITY_SNAPSHOT.reviewedOn, locale),
              })}
            </Meta>
            <ReviewStamp
              locale={locale}
              reviewedOn={CAPABILITY_SNAPSHOT.reviewedOn}
              nextReviewOn={CAPABILITY_SNAPSHOT.nextReviewOn}
            />
          </div>
          <div className="mt-8">
            <Notice
              tone="info"
              title={t.t('web.capabilities.buildState.title')}
              description={t.t('web.capabilities.buildState.body')}
            />
          </div>
        </div>
      </EditorialSection>

      <Section id="legend">
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Heading>{t.t('web.capabilities.legend.title')}</Heading>
            <p className="text-body-lg text-text-secondary mt-4 max-w-[62ch] leading-[1.65]">
              {t.t('web.capabilities.legend.body')}
            </p>
          </div>
          <div className="min-w-0 lg:col-span-7 lg:col-start-6">
            <FactList className="border-t-0">
              {LEGEND.map((state) => (
                <Fact
                  key={state}
                  term={
                    <CapabilityBadge state={state} label={t.format(`capability.level.${state}`)} />
                  }
                >
                  {t.format(`capability.explain.${state}`, {
                    provider: t.t('web.label.provider'),
                  })}
                </Fact>
              ))}
            </FactList>
            <p className="text-body-md text-text-tertiary mt-5 max-w-[68ch] leading-[1.6]">
              {t.t('web.capabilities.summary', {
                supported: counts.supported,
                requiresReview: counts.requires_review,
                notImplemented: counts.not_implemented,
                unsupported: counts.unsupported,
              })}
            </p>
          </div>
        </div>
      </Section>

      <Section id="matrix">
        <CapabilityMatrix locale={locale} />
        <p className="text-body-md text-text-secondary mt-8 max-w-[70ch] leading-[1.6]">
          {t.t('web.capabilities.sourceNote')}{' '}
          <TextLink href={ROUTES.methodology} className="text-body-md">
            {t.t('nav.public.methodology')}
          </TextLink>
        </p>
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

      <JsonLd
        node={breadcrumbJsonLd(
          [
            { name: t.t('nav.public.integrations'), path: ROUTES.integrations },
            { name: t.t('web.capabilities.title'), path: ROUTES.capabilities },
          ],
          locale,
        )}
      />
    </>
  );
}
