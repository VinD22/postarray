import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';

import { Body, Heading, Lede, List, Section, Split } from '@/features/marketing/components/layout';
import {
  ClosingCta,
  EditorialDisplay,
  EditorialSection,
} from '@/features/marketing/components/editorial';
import { TextLink } from '@/features/marketing/components/links';
import {
  RADAR_CATEGORIES,
  RADAR_RECORDS,
  RADAR_REQUIREMENTS,
} from '@/features/marketing/data/catalogs';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.toolRadar.title',
    'web.meta.toolRadar.description',
    ROUTES.toolRadar,
    locale,
  );
}

export default async function ToolRadarPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <EditorialSection className="relative overflow-hidden">
        <div className="max-w-[46rem]">
          <EditorialDisplay as="h1" size="md">
            {t.t('web.toolRadar.title')}
          </EditorialDisplay>
          <Lede className="mt-6">{t.t('web.toolRadar.lede')}</Lede>
        </div>

        {/* A purely decorative, slow-rotating radar ring. `aria-hidden`:
            the page's actual content is the categories and record list
            below, never a claim carried by this shape. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="relay-slow-spin text-border-bold pointer-events-none absolute end-6 bottom-6 hidden size-40 opacity-30 md:block lg:size-56"
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 10"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 10"
          />
          <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="1.5" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </EditorialSection>

      <Section id="standard">
        <Split aside={<Heading>{t.t('web.toolRadar.record.title')}</Heading>}>
          <List items={RADAR_REQUIREMENTS.map((key) => t.format(key))} />
          <p className="text-body-md text-text-tertiary mt-6 max-w-[68ch] leading-[1.6]">
            {t.t('web.toolRadar.noAffiliateYet')}
          </p>
          <p className="mt-4">
            <TextLink href={ROUTES.affiliateTerms}>{t.t('web.legal.affiliate.title')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="categories">
        <Split aside={<Heading>{t.t('web.toolRadar.category.title')}</Heading>}>
          {RADAR_RECORDS.length === 0 ? (
            <div className="space-y-6">
              <ul className="border-border-default border-t">
                {RADAR_CATEGORIES.map((category) => (
                  <li
                    key={category.id}
                    className="border-border-subtle text-body-lg text-text-primary border-b py-4"
                  >
                    {t.format(category.nameKey)}
                  </li>
                ))}
              </ul>
              <EmptyState
                title={t.t('web.toolRadar.empty')}
                description={t.t('web.toolRadar.emptyBody')}
                example={t.t('web.legal.ai.noMedia.caveat')}
              />
            </div>
          ) : (
            <ul className="border-border-default border-t">
              {RADAR_RECORDS.map((record) => (
                <li key={record.id} className="border-border-subtle space-y-2 border-b py-6">
                  <h3 className="text-title-sm text-text-primary">{record.name}</h3>
                  <Body>{record.useCase}</Body>
                  <p className="text-body-sm text-text-tertiary font-mono">
                    {t.t('web.label.lastReviewed', {
                      date: formatDate(record.lastVerified, locale),
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Split>
      </Section>

      <Section id="why">
        <Split aside={<Heading>{t.t('web.legal.ai.noMedia.title')}</Heading>}>
          <Body>{t.t('web.legal.ai.noMedia.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.aiUse}>{t.t('web.legal.ai.title')}</TextLink>
          </p>
        </Split>
      </Section>

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
