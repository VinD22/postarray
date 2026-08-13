import type { ReactNode } from 'react';

import { marketingTranslator } from '@/features/marketing/i18n';

import { demoContent } from './content';
import { HeroDemo, type HeroDemoScene } from './hero-demo';
import { MasterDraftPanel, VariantListPanel } from './panels/compose';
import { DigestPanel } from './panels/digest';
import { LiveReceiptPanel } from './panels/receipt';
import { SchedulePanel, WeekStripPanel } from './panels/schedule';
import { AccountPanel, ProjectPanel } from './panels/setup';
import { ValidationPanel } from './panels/validate';

/**
 * The hero demonstration, assembled on the server.
 *
 * `HeroDemo` is a client component because it owns a timeline, a pause control
 * and a step indicator, but every panel it shows is finished server HTML
 * handed over as a prop. That split is the reason the tour is readable with no
 * JavaScript at all and the reason the headline beside it is never waiting on
 * it: the motion only ever adds position and timing.
 *
 * Nine scenes, because the product is nine steps and the owner's request was
 * to show the whole of it rather than the three that make the shortest
 * argument. The walkthrough at /demo shows the same nine, in the same order,
 * built from the same components, so the two surfaces cannot drift apart.
 *
 * `published` is false, everywhere, deliberately: no connector has passed
 * provider verification, so the publishing scene shows pending steps and
 * unavailable fields. The panel already takes the flag, so the day that
 * changes this file changes by one word.
 */

/** No connector has passed provider verification, so nothing has published. */
const PUBLISHED = false;

export async function HeroDemoSection({ locale }: { readonly locale: string }): Promise<ReactNode> {
  const t = await marketingTranslator(locale);
  const demo = demoContent(t, locale);

  /**
   * Scene holds, in seconds. Each one is roughly the time it takes to read
   * what is on the panel, so a longer panel gets longer. Total is about 29
   * seconds, then a two second hold on the digest and a wipe back to the
   * start.
   */
  const scenes: readonly HeroDemoScene[] = [
    {
      id: 'project',
      hold: 2.5,
      step: 'web.demo.tour.step.project',
      content: (
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
      hold: 3,
      step: 'web.demo.tour.step.connect',
      content: (
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
      hold: 3.5,
      step: 'web.demo.tour.step.compose',
      content: (
        <MasterDraftPanel
          label={t.format('web.demo.master.label')}
          body={demo.master}
          projectLine={t.format('web.demo.master.project', { project: demo.project })}
        />
      ),
    },
    {
      id: 'variants',
      hold: 4,
      step: 'web.demo.tour.step.variants',
      content: (
        <VariantListPanel label={t.format('web.demo.variants.label')} variants={demo.variants} />
      ),
    },
    {
      id: 'validate',
      hold: 2.5,
      step: 'web.demo.tour.step.validate',
      content: (
        <ValidationPanel
          label={t.format('web.demo.validate.label')}
          checks={demo.checks}
          note={t.format('web.demo.validate.note')}
        />
      ),
    },
    {
      id: 'schedule',
      hold: 3,
      step: 'web.demo.tour.step.schedule',
      content: (
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
      id: 'week',
      hold: 3,
      step: 'web.demo.tour.step.week',
      content: (
        <WeekStripPanel
          label={t.format('web.demo.week.label')}
          week={demo.week}
          caption={t.format('web.demo.week.caption')}
          emptyLabel={t.format('web.demo.week.empty')}
        />
      ),
    },
    {
      id: 'publish',
      hold: 4.5,
      step: 'web.demo.tour.step.publish',
      content: <LiveReceipt locale={locale} t={t} demo={demo} />,
    },
    {
      id: 'digest',
      hold: 3,
      step: 'web.demo.tour.step.digest',
      content: (
        <DigestPanel
          label={t.format('web.demo.digest.label')}
          sampleChip={t.format('web.demo.digest.sample')}
          lines={demo.digest}
          footer={t.format('web.demo.digest.footer')}
        />
      ),
    },
  ].map((scene, index, all) => ({
    id: scene.id,
    hold: scene.hold,
    label: t.format(scene.step),
    jumpLabel: t.format('web.demo.tour.jump', {
      position: String(index + 1),
      step: t.format(scene.step),
      total: String(all.length),
    }),
    content: scene.content,
  }));

  return (
    <HeroDemo
      badge={t.format('web.demo.frame.badge')}
      caption={t.format('web.demo.hero.caption')}
      pauseLabel={t.format('web.demo.control.pause')}
      playLabel={t.format('web.demo.control.play')}
      replayLabel={t.format('web.demo.control.replay')}
      stepsLabel={t.format('web.demo.tour.stepsLabel')}
      scenes={scenes}
    />
  );
}

/**
 * The publish scene's panel, and the one place today's honesty constraint is
 * written down: the two steps a publish run would write are not done, and the
 * two fields it would fill say "Unavailable".
 */
function LiveReceipt({
  t,
  demo,
}: {
  readonly locale: string;
  readonly t: Awaited<ReturnType<typeof marketingTranslator>>;
  readonly demo: ReturnType<typeof demoContent>;
}): ReactNode {
  return (
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
  );
}
