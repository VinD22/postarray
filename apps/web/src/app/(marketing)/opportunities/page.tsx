import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';

import { Body, Heading, List, Section, Split } from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import {
  OPPORTUNITY_CATEGORIES,
  OPPORTUNITY_RECORDS,
  OPPORTUNITY_RULES,
} from '@/features/marketing/data/catalogs';
import { formatDate, marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.opportunities.title',
  'web.meta.opportunities.description',
  ROUTES.opportunities,
);

export default function OpportunitiesPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro title={t.t('web.opportunities.title')} lede={t.t('web.opportunities.lede')} />

      <Section id="rules">
        <Split aside={<Heading>{t.t('web.opportunities.rules.title')}</Heading>}>
          <List items={OPPORTUNITY_RULES.map((key) => t.format(key))} />
          <p className="mt-6">
            <TextLink href={ROUTES.acceptableUse}>{t.t('web.legal.aup.title')}</TextLink>
          </p>
        </Split>
      </Section>

      <Section id="categories">
        <Split aside={<Heading>{t.t('web.opportunities.category.title')}</Heading>}>
          {OPPORTUNITY_RECORDS.length === 0 ? (
            <div className="space-y-6">
              <ul className="border-t border-border-default">
                {OPPORTUNITY_CATEGORIES.map((category) => (
                  <li
                    key={category.id}
                    className="border-b border-border-subtle py-4 text-body-lg text-text-primary"
                  >
                    {t.format(category.nameKey)}
                  </li>
                ))}
              </ul>
              <EmptyState
                title={t.t('web.opportunities.empty')}
                description={t.t('web.opportunities.emptyBody')}
                example={t.t('web.opportunities.rules.noAutomation')}
              />
            </div>
          ) : (
            <ul className="border-t border-border-default">
              {OPPORTUNITY_RECORDS.map((record) => (
                <li key={record.id} className="space-y-2 border-b border-border-subtle py-6">
                  <h3 className="text-title-sm text-text-primary">{record.name}</h3>
                  <Body>{record.submissionRules}</Body>
                  <p className="font-mono text-body-sm text-text-tertiary">
                    {t.t('web.label.lastReviewed', { date: formatDate(record.lastVerified) })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Split>
      </Section>
    </>
  );
}
