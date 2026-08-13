'use client';

/**
 * Three numbers at the top of Home.
 *
 * Home used to refuse counters outright, on the grounds that a count without
 * a denominator is a vanity tile. That objection stands and these three
 * answer it: each is a count of things this workspace owns, read from the
 * same endpoint the list underneath it is read from, with the window it
 * covers written next to it. Nothing here is an engagement number and nothing
 * here is estimated.
 *
 * **A read that failed says `unavailable`, never `0`.** Zero scheduled posts
 * is a fact about the week; a failed calendar read is a fact about the
 * network, and collapsing the two would be the exact dishonesty this
 * codebase's first house rule exists to prevent.
 *
 * The numerals count up at the **fast** in-app tier (200ms), not the
 * expressive 900ms `<CountUp>` uses on the marketing site. A dashboard that
 * spends a second animating its own header is a slow dashboard, and none of
 * the three sanctioned expressive moments is here.
 */

import { useMemo, useRef, useState, type ReactNode } from 'react';

import { cn, panelSurface } from '@relay/design-system/utils';

import { useCalendar, useConnections } from '@/lib/api/hooks';
import { useSession } from '@/lib/auth/session-context';
import { useFormatters, useTranslations } from '@/lib/i18n';
import { DURATION_SLOW, EASE_OUT_EXPO } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';

const WEEK_MS = 7 * 86_400_000;

/** Health values that do not need a person to do anything. */
const HEALTHY = 'healthy';

/** What a tile has to show: a real number, or the plain fact that we cannot read one. */
export type TileReading =
  { readonly kind: 'unavailable' } | { readonly kind: 'count'; readonly count: number };

/**
 * The one rule these tiles exist to obey.
 *
 * A failed read is `unavailable`. An empty week is `0`. They are different
 * facts and they never collapse into each other, which is why this is a
 * function with a test rather than a ternary inside JSX.
 */
export function readingFor(input: {
  readonly isError: boolean;
  readonly count: number;
}): TileReading {
  return input.isError ? { kind: 'unavailable' } : { kind: 'count', count: input.count };
}

/**
 * The soonest scheduled entry, or null.
 *
 * The calendar read makes no ordering promise, so this takes a minimum rather
 * than trusting index zero. An entry whose instant does not parse is skipped
 * rather than treated as the epoch, which would make it win every comparison.
 */
export function soonestEntry<T extends { readonly scheduledAt: string }>(
  entries: readonly T[],
): T | null {
  return entries.reduce<T | null>((soonest, entry) => {
    const at = Date.parse(entry.scheduledAt);
    if (Number.isNaN(at)) return soonest;
    if (soonest === null) return entry;
    return at < Date.parse(soonest.scheduledAt) ? entry : soonest;
  }, null);
}

export function StatTiles(): ReactNode {
  const t = useTranslations();
  const format = useFormatters();
  const { workspace, project } = useSession();

  const range = useMemo(() => {
    const now = new Date();
    return { from: now.toISOString(), to: new Date(now.getTime() + WEEK_MS).toISOString() };
  }, []);

  const calendarQuery = useCalendar({
    ...range,
    ...(project === null ? {} : { brandId: project.id }),
  });
  const connectionsQuery = useConnections();

  const entries = calendarQuery.data?.data ?? [];
  const connections = connectionsQuery.data?.data ?? [];
  const attention = connections.filter((entry) => entry.health !== HEALTHY).length;

  const next = soonestEntry(entries);
  const scheduledReading = readingFor({ isError: calendarQuery.isError, count: entries.length });
  const accountsReading = readingFor({
    isError: connectionsQuery.isError,
    count: connections.length,
  });

  return (
    <section
      aria-label={t('home.v2.tiles.label')}
      data-stagger-item
      className="grid gap-3 sm:grid-cols-3"
    >
      <Tile
        label={t('home.v2.tiles.scheduled')}
        hint={t('home.v2.tiles.scheduledHint')}
        unavailable={scheduledReading.kind === 'unavailable'}
        value={<Numeral value={entries.length} format={(n) => format.number(n)} />}
      />
      <Tile
        label={t('home.v2.tiles.accounts')}
        hint={t('home.v2.tiles.accountsHint', { attention })}
        unavailable={accountsReading.kind === 'unavailable'}
        value={<Numeral value={connections.length} format={(n) => format.number(n)} />}
      />
      <Tile
        label={t('home.v2.tiles.nextSlot')}
        hint={
          next === null
            ? t('home.v2.tiles.nextSlotNoneHint')
            : t('home.v2.tiles.nextSlotHint', {
                account: next.accountLabel,
                timeZone: workspace.timeZone,
              })
        }
        unavailable={scheduledReading.kind === 'unavailable'}
        value={
          next === null ? (
            <span className="text-title-sm text-text-secondary">
              {t('home.v2.tiles.nextSlotNone')}
            </span>
          ) : (
            <time dateTime={next.scheduledAt} className="tabular-nums">
              {format.time(next.scheduledAt)}
            </time>
          )
        }
      />
    </section>
  );
}

function Tile({
  label,
  hint,
  value,
  unavailable,
}: {
  readonly label: string;
  readonly hint: string;
  readonly value: ReactNode;
  readonly unavailable: boolean;
}): ReactNode {
  const t = useTranslations();
  return (
    <div className={cn(panelSurface, 'flex flex-col gap-1 p-3.5')}>
      <p className="text-label text-text-tertiary tracking-wide uppercase">{label}</p>
      <p className="font-display text-title-md text-text-primary font-bold">
        {unavailable ? (
          <span className="text-title-sm text-text-tertiary">{t('common.unavailable')}</span>
        ) : (
          value
        )}
      </p>
      <p className="text-body-sm text-text-tertiary">{unavailable ? t('home.error.body') : hint}</p>
    </div>
  );
}

/**
 * A count that counts.
 *
 * The same technique `<CountUp>` uses (tween a numeric proxy, snap to whole
 * numbers, let the caller format) at a quarter of the duration and with no
 * `ScrollTrigger`: these tiles are above the fold by definition, so waiting
 * for a scroll would mean they simply never animate. Reduced motion renders
 * `format(value)` immediately, which is byte-identical to the resting state.
 */
function Numeral({
  value,
  format,
}: {
  readonly value: number;
  readonly format: (value: number) => string;
}): ReactNode {
  const scope = useRef<HTMLSpanElement>(null);
  const motionOk = useMotionOk();
  const [display, setDisplay] = useState(value);

  useGSAP(
    () => {
      if (!motionOk) {
        setDisplay(value);
        return;
      }
      const proxy = { value: 0 };
      const tween = gsap.to(proxy, {
        value,
        duration: DURATION_SLOW,
        ease: EASE_OUT_EXPO,
        snap: { value: 1 },
        onUpdate: () => setDisplay(proxy.value),
      });
      return () => {
        tween.kill();
      };
    },
    { scope, dependencies: [motionOk, value] },
  );

  return (
    <span ref={scope} data-numeric>
      {format(display)}
    </span>
  );
}
