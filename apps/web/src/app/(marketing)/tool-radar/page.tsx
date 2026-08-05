import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';

import { Body, Heading, List, Section, Split } from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import { RADAR_CATEGORIES, RADAR_RECORDS, RADAR_REQUIREMENTS } from '@/features/marketing/data/catalogs';
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
          <p className="mt-6 max-w-[68ch] text-body-md leading-[1.6] text-text-tertiary">
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
              <ul className="border-t border-border-default">
                {RADAR_CATEGORIES.map((category) => (
                  <li
                    key={category.id}
                    className="border-b border-border-subtle py-4 text-body-lg text-text-primary"
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
            <ul className="border-t border-border-default">
              {RADAR_RECORDS.map((record) => (
                <li key={record.id} className="space-y-2 border-b border-border-subtle py-6">
                  <h3 className="text-title-sm text-text-primary">{record.name}</h3>
                  <Body>{record.useCase}</Body>
                  <p className="font-mono text-body-sm text-text-tertiary">
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
