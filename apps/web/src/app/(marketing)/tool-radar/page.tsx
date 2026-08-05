import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';

import { Body, Heading, List, Section, Split } from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import {
  RADAR_CATEGORIES,
  RADAR_RECORDS,
  RADAR_REQUIREMENTS,
} from '@/features/marketing/data/catalogs';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.toolRadar.title',
  'web.meta.toolRadar.description',
  ROUTES.toolRadar,
);

export default function ToolRadarPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro title={t.t('web.toolRadar.title')} lede={t.t('web.toolRadar.lede')} />

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
                    {t.t('web.label.lastReviewed', { date: formatDate(record.lastVerified) })}
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
    </>
  );
}
