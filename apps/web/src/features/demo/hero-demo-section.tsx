import type { ReactNode } from 'react';

import { marketingTranslator } from '@/features/marketing/i18n';

import { demoContent } from './content';
import { HeroDemo } from './hero-demo';
import { MasterDraftPanel, VariantListPanel } from './panels/compose';
import { SchedulePanel, WeekStripPanel } from './panels/schedule';

/**
 * The hero demonstration, assembled on the server.
 *
 * `HeroDemo` is a client component because it owns a timeline and a pause
 * control, but every panel it shows is finished server HTML handed over as a
 * prop. That split is deliberate: the demonstration is readable with no
 * JavaScript at all, and the motion only ever adds to it.
 *
 * Three stages, because three is what the value proposition actually is: one
 * draft becomes platform-native versions, those versions get a time, and the
 * time lands on a week. Anything more is a tour, and the tour lives at /demo.
 */
export async function HeroDemoSection({ locale }: { readonly locale: string }): Promise<ReactNode> {
  const t = await marketingTranslator(locale);
  const demo = demoContent(t, locale);

  return (
    <HeroDemo
      badge={t.format('web.demo.frame.badge')}
      caption={t.format('web.demo.hero.caption')}
      pauseLabel={t.format('web.demo.control.pause')}
      playLabel={t.format('web.demo.control.play')}
      replayLabel={t.format('web.demo.control.replay')}
      stages={[
        {
          id: 'master',
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
          content: (
            <VariantListPanel
              label={t.format('web.demo.variants.label')}
              variants={demo.variants}
            />
          ),
        },
        {
          id: 'schedule',
          content: (
            <>
              <SchedulePanel
                label={t.format('web.demo.schedule.label')}
                value={t.format('web.demo.schedule.value', { when: demo.scheduledAt, zone: demo.zoneLabel })}
                approval={t.format('web.demo.schedule.approval')}
                queue={t.format('web.demo.schedule.queue')}
              />
              <WeekStripPanel
                label={t.format('web.demo.week.label')}
                week={demo.week}
                caption={t.format('web.demo.week.caption')}
                emptyLabel={t.format('web.demo.week.empty')}
              />
            </>
          ),
        },
      ]}
    />
  );
}
