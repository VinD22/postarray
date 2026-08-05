import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import {
  Body,
  Heading,
  List,
  Section,
  Split,
  Step,
  Steps,
} from '@/features/marketing/components/layout';
import { Cta, TextLink } from '@/features/marketing/components/links';
import { PageIntro, ProductShot } from '@/features/marketing/components/page-parts';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.product.title',
  'web.meta.product.description',
  ROUTES.product,
);

const STEPS = [
  { id: 'source', titleKey: 'web.product.step.source.title', bodyKey: 'web.product.step.source.body' },
  {
    id: 'compose',
    titleKey: 'web.product.step.compose.title',
    bodyKey: 'web.product.step.compose.body',
  },
  {
    id: 'validate',
    titleKey: 'web.product.step.validate.title',
    bodyKey: 'web.product.step.validate.body',
  },
  {
    id: 'approve',
    titleKey: 'web.product.step.approve.title',
    bodyKey: 'web.product.step.approve.body',
  },
  {
    id: 'schedule',
    titleKey: 'web.product.step.schedule.title',
    bodyKey: 'web.product.step.schedule.body',
  },
  {
    id: 'publish',
    titleKey: 'web.product.step.publish.title',
    bodyKey: 'web.product.step.publish.body',
  },
  { id: 'learn', titleKey: 'web.product.step.learn.title', bodyKey: 'web.product.step.learn.body' },
] as const;

const STATES = [
  'web.product.states.partial',
  'web.product.states.revoked',
  'web.product.states.rateLimited',
  'web.product.states.duplicate',
  'web.product.states.offline',
  'web.product.states.permission',
] as const;

export default function ProductPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro
        title={t.t('web.product.title')}
        lede={t.t('web.product.lede')}
        actions={
          <>
            <Cta href={ROUTES.signUp}>{t.t('web.cta.startTrial')}</Cta>
            <Cta href={ROUTES.capabilities} variant="secondary">
              {t.t('web.cta.seeCapabilities')}
            </Cta>
          </>
        }
      />

      <Section id="sequence">
        <Steps>
          {STEPS.map((step, index) => (
            <Step key={step.id} index={index + 1} title={t.format(step.titleKey)}>
              {t.format(step.bodyKey)}
            </Step>
          ))}
        </Steps>
      </Section>

      <Section id="screenshots">
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.product.shot.pending')}</Heading>
              <Body>{t.t('web.product.shot.caption')}</Body>
            </div>
          }
        >
          <ProductShot
            alt={t.t('web.product.step.compose.body')}
            caption={t.t('web.home.example.caption')}
          />
        </Split>
      </Section>

      <Section id="states">
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.product.states.title')}</Heading>
              <Body>{t.t('web.product.states.body')}</Body>
              <p>
                <TextLink href={ROUTES.status}>{t.t('nav.public.status')}</TextLink>
              </p>
            </div>
          }
        >
          <List items={STATES.map((key) => t.format(key))} />
        </Split>
      </Section>
    </>
  );
}
