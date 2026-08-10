// Incident state has to be current, so this page opts back out of the group's
// static rendering.
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { EmptyState, Notice } from '@relay/design-system/patterns';
import { StatusDot, type StatusDotTone } from '@relay/design-system/primitives';

import {
  Body,
  Container,
  Heading,
  Lede,
  Meta,
  Section,
  Split,
} from '@/features/marketing/components/layout';
import {
  ClosingCta,
  EditorialDisplay,
  EditorialSection,
} from '@/features/marketing/components/editorial';
import { TextLink } from '@/features/marketing/components/links';
import { CorrectionNotice } from '@/features/marketing/components/page-parts';
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

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(
    'web.meta.status.title',
    'web.meta.status.description',
    ROUTES.status,
    locale,
  );
}

const LEVEL_TONE: Readonly<Record<StatusLevel, StatusDotTone>> = {
  operational: 'success',
  degraded: 'warning',
  partial: 'warning',
  outage: 'destructive',
  maintenance: 'info',
  not_live: 'neutral',
};

export default async function StatusPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);

  return (
    <>
      <EditorialSection>
        <div className="max-w-[46rem]">
          <EditorialDisplay as="h1" size="sm">
            {t.t('web.status.title')}
          </EditorialDisplay>
          <Lede className="mt-6">{t.t('web.status.lede')}</Lede>
          <Meta className="mt-4 block">
            {t.t('web.status.updated', { time: formatDateTime(STATUS_CHECKED_AT, locale) })}
          </Meta>
          <div className="mt-8">
            <Notice
              tone="info"
              liveness="status"
              title={t.t('web.status.preLaunch.title')}
              description={t.t('web.status.preLaunch.body')}
            />
          </div>
        </div>
      </EditorialSection>

      <Section id="surfaces">
        <Split
          aside={
            <div className="space-y-4">
              <Heading>{t.t('web.status.surfaces.title')}</Heading>
              <Body>{t.t('web.status.notLiveBody')}</Body>
            </div>
          }
        >
          <dl className="border-border-bold border-t-2">
            {SURFACE_STATUS.map((entry) => (
              <div
                key={entry.id}
                className="border-border-subtle flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b py-4"
              >
                <dt className="text-body-lg text-text-primary">{t.format(entry.nameKey)}</dt>
                <dd className="text-body-md text-text-secondary flex items-center gap-2">
                  {/*
                    A single, non-looping settle-in for a surface that reads
                    as confirmed-good right now, not "still checking" — see
                    `.relay-dot-settle`'s own header comment in globals.css.
                    `motion-reduce:animate-none` is the same explicit second
                    guard that caller already uses elsewhere; the global 1ms
                    override neutralizes it either way.
                  */}
                  <span
                    className={
                      entry.level === 'operational'
                        ? 'relay-dot-settle inline-flex motion-reduce:animate-none'
                        : 'inline-flex'
                    }
                  >
                    <StatusDot aria-hidden="true" tone={LEVEL_TONE[entry.level]} />
                  </span>
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
          <CapabilityMatrixSummary locale={locale} />
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
            <ol className="border-border-bold border-t-2">
              {INCIDENTS.map((incident) => (
                <li key={incident.id} className="border-border-subtle space-y-2 border-b py-6">
                  <h3 className="text-title-sm text-text-primary">{incident.title}</h3>
                  <p className="flex flex-wrap gap-x-6 gap-y-1">
                    <Meta>
                      {t.t('web.status.incident.started', {
                        time: formatDateTime(incident.startedAt, locale),
                      })}
                    </Meta>
                    {incident.resolvedAt ? (
                      <Meta>
                        {t.t('web.status.incident.resolved', {
                          time: formatDateTime(incident.resolvedAt, locale),
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
          <CorrectionNotice locale={locale} />
        </div>
      </Container>

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
