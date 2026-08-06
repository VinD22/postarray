import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState } from '@relay/design-system/patterns';

import { Reveal } from '@/components/motion';
import { Body, Heading, Lede, List, Section, Split } from '@/features/marketing/components/layout';
import { Band } from '@/features/marketing/components/loud/band';
import { CtaSlab } from '@/features/marketing/components/loud/cta-slab';
import { LoudDisplay } from '@/features/marketing/components/loud/display';
import { TextLink } from '@/features/marketing/components/links';
import {
  OPPORTUNITY_CATEGORIES,
  OPPORTUNITY_RECORDS,
  OPPORTUNITY_RULES,
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
    'web.meta.opportunities.title',
    'web.meta.opportunities.description',
    ROUTES.opportunities,
    locale,
  );
}

export default async function OpportunitiesPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <Band tone="paper">
        <Reveal className="max-w-[46rem]">
          <LoudDisplay as="h1" size="xl">
            {t.t('web.opportunities.title')}
          </LoudDisplay>
          <Lede className="mt-6">{t.t('web.opportunities.lede')}</Lede>
        </Reveal>
      </Band>

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
              <ul className="border-border-default border-t">
                {OPPORTUNITY_CATEGORIES.map((category) => (
                  <li
                    key={category.id}
                    className="border-border-subtle text-body-lg text-text-primary border-b py-4"
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
            <ul className="border-border-default border-t">
              {OPPORTUNITY_RECORDS.map((record) => (
                <li key={record.id} className="border-border-subtle space-y-2 border-b py-6">
                  <h3 className="text-title-sm text-text-primary">{record.name}</h3>
                  <Body>{record.submissionRules}</Body>
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

      <CtaSlab
        id="start"
        title={t.t('web.marketing.v2.closing.title')}
        body={t.t('web.marketing.v2.closing.body')}
        cta={{ href: ROUTES.signUp, label: t.t('web.cta.startTrial') }}
        footnote={t.t('web.cta.trialFootnote')}
      />
    </>
  );
}
