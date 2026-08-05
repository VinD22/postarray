import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Body, Heading, Section, Split, Subheading } from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.agencies.title',
  'web.meta.agencies.description',
  ROUTES.agencies,
);

const JOBS = [
  {
    id: 'separation',
    titleKey: 'web.agencies.job.separation.title',
    bodyKey: 'web.agencies.job.separation.body',
  },
  {
    id: 'approval',
    titleKey: 'web.agencies.job.approval.title',
    bodyKey: 'web.agencies.job.approval.body',
  },
  {
    id: 'receipts',
    titleKey: 'web.agencies.job.receipts.title',
    bodyKey: 'web.agencies.job.receipts.body',
  },
  { id: 'roles', titleKey: 'web.agencies.job.roles.title', bodyKey: 'web.agencies.job.roles.body' },
] as const;

export default function ForAgenciesPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro
        title={t.t('web.agencies.title')}
        lede={t.t('web.agencies.lede')}
        actions={
          <>
            <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
            <Cta href={ROUTES.pricing} variant="secondary">
              {t.t('web.cta.seePricing')}
            </Cta>
          </>
        }
      />

      <Section id="jobs">
        <dl className="border-t border-border-default">
          {JOBS.map((job) => (
            <div
              key={job.id}
              className="grid gap-x-12 gap-y-3 border-b border-border-subtle py-8 lg:grid-cols-12"
            >
              <dt className="lg:col-span-4">
                <Subheading as="h2" className="text-pretty">
                  {t.format(job.titleKey)}
                </Subheading>
              </dt>
              <dd className="min-w-0 lg:col-span-7 lg:col-start-6">
                <p className="max-w-[68ch] text-body-lg leading-[1.65] text-text-secondary">
                  {t.format(job.bodyKey)}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="boundary">
        <Split aside={<Heading>{t.t('web.agencies.limits.title')}</Heading>}>
          <Body>{t.t('web.agencies.limits.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.pricing}>{t.t('nav.public.pricing')}</TextLink>
          </p>
        </Split>
      </Section>
    </>
  );
}
