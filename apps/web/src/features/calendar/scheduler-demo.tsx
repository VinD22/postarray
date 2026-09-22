'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { Link } from '@/components/link';
import { computeRange, fromWallClock, toWallClock } from './date-range';
import { ScheduleBoard } from './schedule-board';
import type { CalendarEntry } from './types';

const ZONE = 'Europe/Berlin';
const START = new Date('2026-09-21T12:00:00Z');
const SAMPLES = [
  {
    project: 'one',
    day: 0,
    hour: 10,
    title: 'scheduler.sampleOne',
    provider: 'instagram',
    state: 'published',
  },
  {
    project: 'two',
    day: 1,
    hour: 9,
    title: 'scheduler.sampleThree',
    provider: 'linkedin',
    state: 'scheduled',
  },
  {
    project: 'one',
    day: 2,
    hour: 14,
    title: 'scheduler.sampleTwo',
    provider: 'instagram',
    state: 'approval_requested',
  },
  {
    project: 'two',
    day: 4,
    hour: 11,
    title: 'scheduler.sampleFour',
    provider: 'linkedin',
    state: 'scheduled',
  },
] as const;

/** A public, isolated sample. It never imports the API or reads a real session. */
export function SchedulerDemo() {
  const t = useTranslations();
  const [week, setWeek] = useState(0);
  const [project, setProject] = useState<string | null>(null);
  const [moves, setMoves] = useState<Record<string, number>>({});
  const range = useMemo(
    () => computeRange('week', new Date(START.getTime() + week * 7 * 86_400_000), ZONE, 1),
    [week],
  );
  const entries: CalendarEntry[] = SAMPLES.map((sample, index) => {
    const id = `sample-${index}`;
    const wall = toWallClock(
      new Date(START.getTime() + (sample.day + (moves[id] ?? 0)) * 86_400_000),
      ZONE,
    );
    return {
      contentItemId: id,
      publishJobId: id,
      projectId: sample.project,
      projectName: t(sample.project === 'one' ? 'scheduler.projectOne' : 'scheduler.projectTwo'),
      title: t(sample.title),
      provider: sample.provider,
      state: sample.state,
      approvalState: sample.state === 'approval_requested' ? 'requested' : 'approved',
      accountLabel: t(sample.project === 'one' ? 'scheduler.projectOne' : 'scheduler.projectTwo'),
      scheduledAt: fromWallClock({ ...wall, hour: sample.hour, minute: 0 }, ZONE).toISOString(),
      timeZone: ZONE,
      targetCount: 1,
      mediaKind: 'image',
    };
  });
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-12 md:px-8 md:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-text-accent text-label mb-3 font-semibold">
            {t('scheduler.sampleLabel')}
          </p>
          <h1 className="text-text-primary text-display-lg font-semibold tracking-tight">
            {t('scheduler.title')}
          </h1>
          <p className="text-text-secondary text-body-lg mt-4">{t('scheduler.demoNote')}</p>
        </div>
        <Button asChild>
          <Link href="/calendar">{t('scheduler.openApp')}</Link>
        </Button>
      </div>
      <div className="border-border-default mb-8 flex flex-wrap items-center justify-between gap-4 border-y py-4">
        <div
          role="group"
          aria-label={t('calendar.filter.project')}
          className="flex flex-wrap gap-2"
        >
          {[null, 'one', 'two'].map((id) => (
            <Button
              key={id ?? 'all'}
              variant={project === id ? 'secondary' : 'ghost'}
              aria-pressed={project === id}
              onClick={() => setProject(id)}
            >
              {t(
                id === 'one'
                  ? 'scheduler.projectOne'
                  : id === 'two'
                    ? 'scheduler.projectTwo'
                    : 'web.calendar.filter.anyProject',
              )}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setWeek(week - 1)}
            aria-label={t('calendar.previousPeriod')}
          >
            <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => setWeek(week + 1)}
            aria-label={t('calendar.nextPeriod')}
          >
            <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setMoves({});
              setWeek(0);
              setProject(null);
            }}
            iconStart={<RotateCcw aria-hidden="true" className="size-4" />}
          >
            {t('scheduler.reset')}
          </Button>
        </div>
      </div>
      <p className="text-body-sm text-text-secondary mb-4">
        {t('calendar.timeZoneNote', { timeZone: ZONE })}
      </p>
      <ScheduleBoard
        range={range}
        entries={entries.filter((entry) => !project || entry.projectId === project)}
        timeZone={ZONE}
        sample
        onMove={(entry) =>
          setMoves((current) => ({
            ...current,
            [entry.contentItemId]: (current[entry.contentItemId] ?? 0) + 1,
          }))
        }
      />
    </div>
  );
}
