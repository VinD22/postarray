import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { demoContent } from '@/features/demo/content';
import { DemoPanel } from '@/features/demo/demo-frame';
import { MasterDraftPanel, VariantListPanel } from '@/features/demo/panels/compose';
import { ReceiptPanel } from '@/features/demo/panels/receipt';
import { SchedulePanel, WeekStripPanel } from '@/features/demo/panels/schedule';
import { AccountPanel, ProjectPanel } from '@/features/demo/panels/setup';
import { EditorialSection, Eyebrow } from '@/features/marketing/components/editorial';
import { Body, Heading, Lede, Subheading } from '@/features/marketing/components/layout';
import { marketingTranslator } from '@/features/marketing/i18n';
import { pageMetadata } from '@/features/marketing/seo';
import { ROUTES } from '@/features/marketing/site';

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata('web.meta.demo.title', 'web.meta.demo.description', ROUTES.demo, locale);
}

/**
 * The walkthrough: the product in the order somebody actually meets it.
 *
 * Every panel here is the same server-rendered component the hero
 * demonstration uses, so the tour cannot drift away from the thing it claims
 * to show. Nothing on this page animates on its own and nothing pretends to
 * submit: it is a reading surface, and it works with JavaScript switched off.
 *
 * The two honest gaps are stated where a reader meets them rather than in a
 * footnote: accounts cannot publish until a connector passes provider
 * verification, and the publishing half of a receipt is written by the publish
 * run, which is exactly the part that does not exist yet.
 */
export default async function DemoPage({
  params,
}: {
  readonly params: Promise<{ readonly locale: string }>;
}): Promise<ReactNode> {
  const { locale } = await params;
  const t = await marketingTranslator(locale);
  const demo = demoContent(t, locale);

  const steps = [
    {
      id: 'project',
      titleKey: 'web.demo.step.project.title',
      bodyKey: 'web.demo.step.project.body',
      panel: (
        <ProjectPanel
          label={t.format('web.demo.project.label')}
          project={demo.project}
          zoneLine={t.format('web.demo.project.zone', { zone: demo.zoneLabel })}
          scope={t.format('web.demo.project.scope')}
        />
      ),
    },
    {
      id: 'connect',
      titleKey: 'web.demo.step.connect.title',
      bodyKey: 'web.demo.step.connect.body',
      panel: (
        <AccountPanel
          label={t.format('web.demo.accounts.label')}
          accounts={demo.variants}
          state={t.format('web.demo.accounts.state')}
          note={t.format('web.demo.accounts.note')}
        />
      ),
    },
    {
      id: 'compose',
      titleKey: 'web.demo.step.compose.title',
      bodyKey: 'web.demo.step.compose.body',
      panel: (
        <>
          <MasterDraftPanel
            label={t.format('web.demo.master.label')}
            body={demo.master}
            projectLine={t.format('web.demo.master.project', { project: demo.project })}
          />
          <VariantListPanel
            label={t.format('web.demo.variants.label')}
            variants={demo.variants}
          />
        </>
      ),
    },
    {
      id: 'schedule',
      titleKey: 'web.demo.step.schedule.title',
      bodyKey: 'web.demo.step.schedule.body',
      panel: (
        <SchedulePanel
          label={t.format('web.demo.schedule.label')}
          value={t.format('web.demo.schedule.value', {
            when: demo.scheduledAt,
            zone: demo.zoneLabel,
          })}
          approval={t.format('web.demo.schedule.approval')}
          queue={t.format('web.demo.schedule.queue')}
        />
      ),
    },
    {
      id: 'calendar',
      titleKey: 'web.demo.step.calendar.title',
      bodyKey: 'web.demo.step.calendar.body',
      panel: (
        <WeekStripPanel
          label={t.format('web.demo.week.label')}
          week={demo.week}
          caption={t.format('web.demo.week.caption')}
          emptyLabel={t.format('web.demo.week.empty')}
        />
      ),
    },
    {
      id: 'receipt',
      titleKey: 'web.demo.step.receipt.title',
      bodyKey: 'web.demo.step.receipt.body',
      panel: (
        <ReceiptPanel
          label={t.format('web.demo.receipt.label')}
          steps={[
            { id: 'author', title: demo.author, done: true },
            { id: 'approver', title: demo.approver, done: true },
            { id: 'policy', title: demo.policy, done: true },
          ]}
          pending={t.format('web.demo.receipt.pending')}
          fields={[
            {
              id: 'externalId',
              term: t.format('web.demo.receipt.field.externalId'),
              value: t.format('common.unavailable'),
            },
            {
              id: 'permalink',
              term: t.format('web.demo.receipt.field.permalink'),
              value: t.format('common.unavailable'),
            },
          ]}
        />
      ),
    },
  ] as const;

  return (
    <>
      <EditorialSection reveal={false} containerClassName="py-20 md:py-28">
        <Eyebrow className="mb-6">{t.t('web.demo.frame.badge')}</Eyebrow>
        <Heading className="max-w-[26ch]">{t.t('web.demo.title')}</Heading>
        <Lede className="mt-6 max-w-[62ch]">{t.t('web.demo.lede')}</Lede>

        <DemoPanel label={t.format('web.demo.notice.title')} className="mt-10 max-w-[62ch]">
          <p className="text-body-sm text-text-secondary">{t.t('web.demo.notice.body')}</p>
        </DemoPanel>
      </EditorialSection>

      {steps.map((step, index) => (
        <EditorialSection key={step.id} rule id={step.id}>
          {/*
            The number and the heading share one column rather than sitting in
            a wide left rail with dead space beside it. It reads as a numbered
            step at every width, and at 360px nothing has to be scrolled past
            to reach the words.
          */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p className="text-label text-text-tertiary font-mono">
                {t.format('web.demo.stepLabel', {
                  position: String(index + 1),
                  total: String(steps.length),
                })}
              </p>
              <Subheading className="mt-3">{t.t(step.titleKey)}</Subheading>
              <Body className="mt-4">{t.t(step.bodyKey)}</Body>
            </div>
            <div className="flex flex-col gap-4">{step.panel}</div>
          </div>
        </EditorialSection>
      ))}
    </>
  );
}
