import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Body, Heading, Section, Split, Subheading } from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { PageIntro } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.creators.title',
  'web.meta.creators.description',
  ROUTES.creators,
);

const JOBS = [
  { id: 'adapt', titleKey: 'web.creators.job.adapt.title', bodyKey: 'web.creators.job.adapt.body' },
  {
    id: 'languages',
    titleKey: 'web.creators.job.languages.title',
    bodyKey: 'web.creators.job.languages.body',
  },
  {
    id: 'rights',
    titleKey: 'web.creators.job.rights.title',
    bodyKey: 'web.creators.job.rights.body',
  },
  { id: 'cost', titleKey: 'web.creators.job.cost.title', bodyKey: 'web.creators.job.cost.body' },
] as const;

export default function ForCreatorsPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro
        title={t.t('web.creators.title')}
        lede={t.t('web.creators.lede')}
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
        <dl className="border-border-default border-t">
          {JOBS.map((job) => (
            <div
              key={job.id}
              className="border-border-subtle grid gap-x-12 gap-y-3 border-b py-8 lg:grid-cols-12"
            >
              <dt className="lg:col-span-4">
                <Subheading as="h2" className="text-pretty">
                  {t.format(job.titleKey)}
                </Subheading>
              </dt>
              <dd className="min-w-0 lg:col-span-7 lg:col-start-6">
                <p className="text-body-lg text-text-secondary max-w-[68ch] leading-[1.65]">
                  {t.format(job.bodyKey)}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="not-for">
        <Split aside={<Heading>{t.t('web.creators.notFor.title')}</Heading>}>
          <Body>{t.t('web.creators.notFor.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.toolRadar}>{t.t('web.meta.toolRadar.title')}</TextLink>
          </p>
        </Split>
      </Section>
    </>
  );
}
