import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '@relay/design-system/utils';

import { demoContent } from '@/features/demo/content';
import { DemoPanel } from '@/features/demo/demo-frame';
import { MasterDraftPanel, VariantListPanel } from '@/features/demo/panels/compose';
import { DigestPanel } from '@/features/demo/panels/digest';
import { LiveReceiptPanel } from '@/features/demo/panels/receipt';
import { SchedulePanel, WeekStripPanel } from '@/features/demo/panels/schedule';
import { AccountPanel, ProjectPanel } from '@/features/demo/panels/setup';
import { ValidationPanel } from '@/features/demo/panels/validate';
import { EditorialDisplay, EditorialSection } from '@/features/marketing/components/editorial';
import { Body, Lede, Subheading } from '@/features/marketing/components/layout';
import { TextLink } from '@/features/marketing/components/links';
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

/** No connector has passed provider verification, so nothing has published. */
const PUBLISHED = false;

/**
 * The walkthrough: the product in the order somebody actually meets it.
 *
 * Every panel here is the same server-rendered component the home page's
 * animated tour shows, in the same order, so the two surfaces cannot drift
 * apart. What this page adds is the sentence beside each panel, which the tour
 * has no room for.
 *
 * ## Why it does not animate
 *
 * The tour on the home page plays itself. This page is the version you can
 * read at your own speed, and that is the whole reason it exists: nothing here
 * is waiting on JavaScript, nothing moves on its own, and a visitor with
 * reduced motion, a crawler and a text browser all get the identical page. The
 * step sections deliberately opt out of the site's scroll reveal too — nine
 * sections doing the same entrance is a tic, not a moment.
 *
 * ## How a reader gets through it
 *
 * The contents list at the top is nine anchor links, so the page opens with a
 * map of itself and a way into any part of it. Every step closes by naming the
 * one after it. Both are plain links: they work with scripting switched off,
 * which is the point.
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
      shortKey: 'web.demo.tour.step.project',
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
      shortKey: 'web.demo.tour.step.connect',
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
      shortKey: 'web.demo.tour.step.compose',
      titleKey: 'web.demo.step.compose.title',
      bodyKey: 'web.demo.step.compose.body',
      panel: (
        <MasterDraftPanel
          label={t.format('web.demo.master.label')}
          body={demo.master}
          projectLine={t.format('web.demo.master.project', { project: demo.project })}
        />
      ),
    },
    {
      id: 'variants',
      shortKey: 'web.demo.tour.step.variants',
      titleKey: 'web.demo.step.variants.title',
      bodyKey: 'web.demo.step.variants.body',
      panel: (
        <VariantListPanel label={t.format('web.demo.variants.label')} variants={demo.variants} />
      ),
    },
    {
      id: 'validate',
      shortKey: 'web.demo.tour.step.validate',
      titleKey: 'web.demo.step.validate.title',
      bodyKey: 'web.demo.step.validate.body',
      panel: (
        <ValidationPanel
          label={t.format('web.demo.validate.label')}
          checks={demo.checks}
          note={t.format('web.demo.validate.note')}
        />
      ),
    },
    {
      id: 'schedule',
      shortKey: 'web.demo.tour.step.schedule',
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
      shortKey: 'web.demo.tour.step.week',
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
      shortKey: 'web.demo.tour.step.publish',
      titleKey: 'web.demo.step.publish.title',
      bodyKey: 'web.demo.step.publish.body',
      panel: (
        <LiveReceiptPanel
          label={t.format('web.demo.live.label')}
          published={PUBLISHED}
          liveLabel={t.format('web.demo.live.badge.live')}
          pendingLabel={t.format('web.demo.live.badge.pending')}
          steps={[
            {
              id: 'approved',
              title: t.format('web.demo.live.step.approved', { approver: demo.approver }),
              done: true,
            },
            { id: 'queued', title: t.format('web.demo.live.step.queued'), done: true },
            { id: 'sent', title: t.format('web.demo.live.step.sent'), done: PUBLISHED },
            { id: 'confirmed', title: t.format('web.demo.live.step.confirmed'), done: PUBLISHED },
          ]}
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
          pending={t.format('web.demo.live.pending')}
        />
      ),
    },
    {
      id: 'digest',
      shortKey: 'web.demo.tour.step.digest',
      titleKey: 'web.demo.step.digest.title',
      bodyKey: 'web.demo.step.digest.body',
      panel: (
        <DigestPanel
          label={t.format('web.demo.digest.label')}
          sampleChip={t.format('web.demo.digest.sample')}
          lines={demo.digest}
          footer={t.format('web.demo.digest.footer')}
        />
      ),
    },
  ] as const;

  const total = String(steps.length);

  return (
    <>
      <EditorialSection reveal={false} containerClassName="py-20 md:py-28">
        {/*
          The page's `h1`, and its LCP element: plain server-rendered text with
          no reveal, so it is finished in the HTML rather than waiting on GSAP.
          It was an `h2` and the page had no `h1` at all, which left the
          walkthrough with a heading outline starting at level two and nothing
          for a search result or a screen reader's page title to latch onto.
        */}
        <EditorialDisplay as="h1" size="sm" className="max-w-[26ch]">
          {t.t('web.demo.title')}
        </EditorialDisplay>
        <Lede className="mt-6 max-w-[62ch]">{t.t('web.demo.lede')}</Lede>

        <DemoPanel label={t.format('web.demo.notice.title')} className="mt-10 max-w-[62ch]">
          <p className="text-body-sm text-text-secondary leading-[1.6]">
            {t.t('web.demo.notice.body')}
          </p>
        </DemoPanel>

        {/*
          The contents. A map of the page and a way into any part of it, in
          plain anchors, so it is as useful with scripting switched off as with
          it on. It is also where the reader learns that the walkthrough has a
          shape: nine steps, in the order the product happens.
        */}
        <nav aria-label={t.format('web.demo.contents.title')} className="mt-16">
          {/* h2: the page now has an h1, so its top level sections are h2. */}
          <Subheading as="h2">{t.t('web.demo.contents.title')}</Subheading>
          <ol className="border-border-default mt-6 grid border-t sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.id} className="border-border-subtle border-b">
                <a
                  href={`#${step.id}`}
                  className={cn(
                    // A 44px target the whole width of its cell, so the link is
                    // the row rather than the four characters of its name.
                    'group flex min-h-11 items-baseline gap-3 py-3 pe-4',
                    'hover:bg-surface-hover',
                    'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
                  )}
                  aria-label={t.format('web.demo.tour.jump', {
                    position: String(index + 1),
                    step: t.format(step.shortKey),
                    total,
                  })}
                >
                  <span className="text-body-sm text-text-tertiary font-mono tabular-nums">
                    {index + 1}
                  </span>
                  <span className="text-body-md text-text-primary min-w-0 underline decoration-transparent decoration-1 underline-offset-[0.22em] group-hover:decoration-current">
                    {t.t(step.shortKey)}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </EditorialSection>

      {steps.map((step, index) => {
        const next = steps[index + 1];
        return (
          <EditorialSection key={step.id} rule reveal={false} id={step.id}>
            {/*
              The number and the heading share one column rather than sitting in
              a wide left rail with dead space beside it. It reads as a numbered
              step at every width, and at 360px nothing has to be scrolled past
              to reach the words.
            */}
            <div className="grid gap-10 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-16">
              <div>
                <p className="text-label text-text-tertiary font-mono">
                  {t.format('web.demo.stepLabel', { position: String(index + 1), total })}
                </p>
                <Subheading as="h2" className="mt-3">
                  {t.t(step.titleKey)}
                </Subheading>
                <Body className="mt-4">{t.t(step.bodyKey)}</Body>

                {/*
                  Where the reader goes next, named rather than implied. This is
                  the whole progression mechanism on a page that refuses to run
                  any script to provide one.
                */}
                {next ? (
                  /*
                    The row is `min-h-11` and the link fills it, because on a
                    page whose only way forward is this link, a 19px high hit
                    area is the difference between a walkthrough and a
                    dead end on a phone. Centred rather than baseline aligned:
                    once the link owns 44px, a baseline shared with the arrow
                    is no longer the thing that lines them up.
                  */
                  <p className="text-body-sm mt-8 flex items-center gap-2">
                    <ArrowDown aria-hidden="true" className="text-text-tertiary size-4 shrink-0" />
                    <TextLink
                      href={`#${next.id}`}
                      className="inline-flex min-h-11 min-w-0 items-center"
                    >
                      {t.format('web.demo.next', { step: t.format(next.shortKey) })}
                    </TextLink>
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-4">{step.panel}</div>
            </div>
          </EditorialSection>
        );
      })}

      <EditorialSection rule>
        <Subheading as="h2" className="max-w-[26ch]">
          {t.t('web.demo.closing.title')}
        </Subheading>
        <Body className="mt-4 max-w-[62ch]">{t.t('web.demo.closing.body')}</Body>
        <p className="mt-8">
          <TextLink href={ROUTES.pricing}>{t.t('web.demo.closing.pricing')}</TextLink>
        </p>
      </EditorialSection>
    </>
  );
}
