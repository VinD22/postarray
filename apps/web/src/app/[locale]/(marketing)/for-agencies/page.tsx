import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import { StaggerList } from '@/components/motion';
import {
  ClosingCta,
  EditorialBigNumber,
  EditorialCard,
  EditorialDisplay,
  EditorialSection,
} from '@/features/marketing/components/editorial';
import { Body, Heading, Lede, Split, Subheading } from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

/**
 * Active connections a workspace may hold. Mirrors `ACTIVE_CHANNEL_ALLOWANCE`
 * in `packages/billing/src/products.ts`; `apps/web` does not depend on
 * `@relay/billing`, the same duplication precedent as `pricing/page.tsx`'s
 * `MONTHLY_PRICE_DOLLARS`.
 */
const ACTIVE_CHANNEL_ALLOWANCE = 10;

/** The approval flow, in order: what an agency's draft actually goes through. */
const FLOW_STEPS = [
  'web.product.step.compose.title',
  'web.product.step.approve.title',
  'web.product.step.schedule.title',
  'web.product.step.publish.title',
] as const;

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.agencies.title',
    'web.meta.agencies.description',
    ROUTES.agencies,
    locale,
  );
}

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

export default async function ForAgenciesPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <EditorialSection reveal={false} containerClassName="py-24 md:py-32">
        <div className="max-w-[52rem]">
          <EditorialDisplay as="h1" size="md" reveal>
            {t.t('web.agencies.title')}
          </EditorialDisplay>
          <Lede className="mt-8">{t.t('web.agencies.lede')}</Lede>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
            <Cta href={ROUTES.pricing} variant="secondary">
              {t.t('web.cta.seePricing')}
            </Cta>
          </div>
        </div>

        {/* Two allowances, stated as two facts. The members line was a
            rotated sticker; both are the same kind of statement, so both are
            now the same kind of element. */}
        <div className="mt-16 flex flex-wrap items-start gap-x-16 gap-y-8">
          <EditorialBigNumber
            value={ACTIVE_CHANNEL_ALLOWANCE}
            locale={locale}
            label={t.t('web.agencies.v2.channelsLabel')}
          />
          <p className="text-body-lg text-text-secondary max-w-[32ch] leading-[1.6]">
            {t.t('web.agencies.v2.membersSticker')}
          </p>
        </div>
      </EditorialSection>

      {/* The approval flow, drawn plainly: four real steps, connected. */}
      <EditorialSection rule id="flow" ariaLabel={t.t('web.agencies.job.approval.title')}>
        <div className="flex flex-wrap items-stretch gap-3">
          {FLOW_STEPS.map((key, index) => (
            <div key={key} className="flex items-center gap-3">
              <EditorialCard
                interactive={false}
                tone={index === 1 ? 'sunken' : 'raised'}
                className="px-5 py-4"
              >
                <span className="text-body-md text-text-primary">{t.format(key)}</span>
              </EditorialCard>
              {index < FLOW_STEPS.length - 1 ? (
                <ArrowRight
                  aria-hidden="true"
                  className="text-text-tertiary size-5 shrink-0 rtl:rotate-180"
                />
              ) : null}
            </div>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection rule id="jobs" reveal={false}>
        <StaggerList stagger={0.07} className="grid gap-5 sm:grid-cols-2">
          {JOBS.map((job) => (
            <div key={job.id} data-stagger-item>
              <EditorialCard className="h-full">
                <Subheading as="h2" className="text-title-sm text-pretty">
                  {t.format(job.titleKey)}
                </Subheading>
                <p className="text-body-md text-text-secondary mt-3">{t.format(job.bodyKey)}</p>
              </EditorialCard>
            </div>
          ))}
        </StaggerList>
      </EditorialSection>

      <EditorialSection rule id="boundary">
        <Split aside={<Heading>{t.t('web.agencies.limits.title')}</Heading>}>
          <Body>{t.t('web.agencies.limits.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.pricing}>{t.t('nav.public.pricing')}</TextLink>
          </p>
        </Split>
      </EditorialSection>

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
