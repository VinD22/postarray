import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState, Notice } from '@relay/design-system/patterns';
import { StatusDot, type StatusDotTone } from '@relay/design-system/primitives';

import {
  Body,
  Container,
  Heading,
  Meta,
  Section,
  Split,
} from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
import { CorrectionNotice, PageIntro } from '@/features/marketing/components/page-parts';
import { CapabilityMatrixSummary } from '@/features/marketing/components/connector-status';
import {
  INCIDENTS,
  STATUS_CHECKED_AT,
  STATUS_LEVEL_LABEL_KEY,
  SURFACE_STATUS,
  type StatusLevel,
} from '@/features/marketing/data/status';
import { formatDateTime, marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export const metadata: Metadata = pageMetadata(
  'web.meta.status.title',
  'web.meta.status.description',
  ROUTES.status,
);

const LEVEL_TONE: Readonly<Record<StatusLevel, StatusDotTone>> = {
  operational: 'success',
  degraded: 'warning',
  partial: 'warning',
  outage: 'destructive',
  maintenance: 'info',
  not_live: 'neutral',
};

export default function StatusPage(): ReactNode {
  const t = marketingTranslator();

  return (
    <>
      <PageIntro
        title={t.t('web.status.title')}
        lede={t.t('web.status.lede')}
        meta={<Meta>{t.t('web.status.updated', { time: formatDateTime(STATUS_CHECKED_AT) })}</Meta>}
      >
        <div className="mt-10">
          <Notice
            tone="info"
            liveness="status"
            title={t.t('web.status.preLaunch.title')}
            description={t.t('web.status.preLaunch.body')}
          />
        </div>
      </PageIntro>

      <Section id="surfaces">
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.status.surfaces.title')}</Heading>
              <Body>{t.t('web.status.notLiveBody')}</Body>
            </div>
          }
        >
          <dl className="border-border-default border-t">
            {SURFACE_STATUS.map((entry) => (
              <div
                key={entry.id}
                className="border-border-subtle flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b py-4"
              >
                <dt className="text-body-lg text-text-primary">{t.format(entry.nameKey)}</dt>
                <dd className="text-body-md text-text-secondary flex items-center gap-2">
                  <StatusDot aria-hidden="true" tone={LEVEL_TONE[entry.level]} />
                  {t.format(STATUS_LEVEL_LABEL_KEY[entry.level])}
                </dd>
              </div>
            ))}
          </dl>
        </Split>
      </Section>

      <Section id="connectors">
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.status.connectors.title')}</Heading>
              <Body>{t.t('web.capabilities.buildState.body')}</Body>
              <p>
                <TextLink href={ROUTES.capabilities}>{t.t('nav.public.capabilities')}</TextLink>
              </p>
            </div>
          }
        >
          <CapabilityMatrixSummary />
        </Split>
      </Section>

      <Section id="incidents">
        <Split aside={<Heading>{t.t('web.status.incidents.title')}</Heading>}>
          {INCIDENTS.length === 0 ? (
            <EmptyState
              title={t.t('web.status.incidents.empty')}
              description={t.t('web.status.incidents.emptyBody')}
              example={t.t('web.status.incident.followUp')}
            />
          ) : (
            <ol className="border-border-default border-t">
              {INCIDENTS.map((incident) => (
                <li key={incident.id} className="border-border-subtle space-y-2 border-b py-6">
                  <h3 className="text-title-sm text-text-primary">{incident.title}</h3>
                  <p className="flex flex-wrap gap-x-6 gap-y-1">
                    <Meta>
                      {t.t('web.status.incident.started', {
                        time: formatDateTime(incident.startedAt),
                      })}
                    </Meta>
                    {incident.resolvedAt ? (
                      <Meta>
                        {t.t('web.status.incident.resolved', {
                          time: formatDateTime(incident.resolvedAt),
                        })}
                      </Meta>
                    ) : null}
                  </p>
                  <dl className="text-body-md text-text-secondary space-y-1">
                    <div>
                      <dt className="text-text-tertiary inline">
                        {t.t('web.status.incident.impact')}
                      </dt>{' '}
                      <dd className="inline">{incident.impact}</dd>
                    </div>
                    <div>
                      <dt className="text-text-tertiary inline">
                        {t.t('web.status.incident.cause')}
                      </dt>{' '}
                      <dd className="inline">{incident.cause}</dd>
                    </div>
                    <div>
                      <dt className="text-text-tertiary inline">
                        {t.t('web.status.incident.followUp')}
                      </dt>{' '}
                      <dd className="inline">{incident.followUp}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
          )}
        </Split>
      </Section>

      <Section id="subscribe">
        <Split aside={<Heading>{t.t('web.status.subscribe.title')}</Heading>}>
          <Body>{t.t('web.status.subscribe.body')}</Body>
          <p className="mt-4">
            <TextLink href={ROUTES.docs}>{t.t('web.docs.section.webhooks.title')}</TextLink>
          </p>
        </Split>
      </Section>

      <Container>
        <div className="pb-16 md:pb-20">
          <CorrectionNotice />
        </div>
      </Container>
    </>
  );
}
