'use client';

/**
 * One post in the grid.
 *
 * It is a row, not a card: a hairline top border, a tonal fill, four facts on
 * two lines. Everything the specification requires on an entry is here, so a
 * person reading the week never has to open anything to answer "what is this
 * and is it in trouble": the platform mark and account, the publish state as
 * an icon plus a word, the content language, and the media type.
 *
 * The whole chip is a link. Rescheduling is a separate button inside it, so
 * tabbing never picks a post up by accident and the primary action of a chip
 * stays "open the post".
 *
 * That button is also the drag handle: clicking it picks the post up for the
 * arrow keys, pressing and moving on it drags. One control, two input methods,
 * so there is nothing a mouse can reach here that a keyboard cannot.
 */

import {
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  Check,
  FileText,
  Film,
  Image as ImageIcon,
  Images,
  Type as TypeIcon,
  Move,
} from 'lucide-react';
import { Badge, StatusPill, cn, focusRingInset, touchTarget } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { LiveBadge } from '@/components/motion';
import { DURATION_FAST, EASE_OUT_BACK, EASE_STANDARD } from '@/lib/motion/constants';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import type { ProviderId } from '@/lib/api/types';
import { ProviderMark, useProviderName } from '@/features/connections/provider';
import { useCalendarFormat } from './format';
import { entryKey, needsAttention } from './filters';
import { canReschedule } from './reschedule';
import type { DragSettleKind } from './use-drag-reschedule';
import type { CalendarEntry } from './types';

const mediaIcon: Record<CalendarEntry['mediaKind'], ReactNode> = {
  text: <TypeIcon aria-hidden="true" className="size-3" />,
  image: <ImageIcon aria-hidden="true" className="size-3" />,
  carousel: <Images aria-hidden="true" className="size-3" />,
  video: <Film aria-hidden="true" className="size-3" />,
  document: <FileText aria-hidden="true" className="size-3" />,
};

/**
 * The provider's identity colour, reused here as a decorative inline-start
 * spine. It is never the only carrier of the platform: `ProviderMark` beside
 * the time already names the platform for assistive technology, so this bar
 * is `aria-hidden` and purely reinforces what the mark and the account label
 * already say.
 *
 * It runs the full height of the chip and is flush with its start edge rather
 * than floating inside it. In a month cell three or four chips are stacked
 * four pixels apart and an 8px dot is the only other platform signal; a
 * continuous spine is what makes "two of these are LinkedIn" readable without
 * reading anything.
 */
const providerBarClass: Record<ProviderId, string> = {
  x: 'bg-brand-x',
  linkedin: 'bg-brand-linkedin',
  instagram: 'bg-brand-instagram',
  facebook: 'bg-brand-facebook',
  youtube: 'bg-brand-youtube',
  tiktok: 'bg-brand-tiktok',
  threads: 'bg-brand-threads',
  bluesky: 'bg-brand-bluesky',
  fake: 'bg-brand-fake',
  mastodon: 'bg-brand-mastodon',
  telegram: 'bg-brand-telegram',
  reddit: 'bg-brand-reddit',
  wordpress: 'bg-brand-wordpress',
  medium: 'bg-brand-medium',
  devto: 'bg-brand-devto',
  pinterest: 'bg-brand-pinterest',
  discord: 'bg-brand-discord',
  slack: 'bg-brand-slack',
  google_business_profile: 'bg-brand-google-business-profile',
};

export interface EntryChipProps {
  entry: CalendarEntry;
  href: string;
  /** Rendered as a compact single line inside a dense month cell. */
  density?: 'grid' | 'compact';
  /** True while this entry is picked up for a keyboard move. */
  grabbed?: boolean;
  /** True while the pointer is dragging this entry over the grid. */
  dragging?: boolean;
  /**
   * Plays one settle when the pointer lets go: a back-out on a drop, a flat
   * snap back on a cancel. `settleId` changes per release so a second drop
   * onto the same slot plays again rather than being deduplicated away.
   */
  settleKind?: DragSettleKind | null;
  settleId?: number | null;
  onPickUp?: (entry: CalendarEntry) => void;
  /** Pointer drag, from the same handle the keyboard move uses. */
  onDragStart?: (entry: CalendarEntry, event: ReactPointerEvent<Element>) => void;
  className?: string;
  style?: CSSProperties;
}

export function EntryChip({
  entry,
  href,
  density = 'grid',
  grabbed = false,
  dragging = false,
  settleKind = null,
  settleId = null,
  onPickUp,
  onDragStart,
  className,
  style,
}: EntryChipProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();
  const motionOk = useMotionOk();
  const scope = useRef<HTMLElement>(null);
  const attention = needsAttention(entry);
  const movable = canReschedule(entry.state) && onPickUp !== undefined;

  /*
   * The release.
   *
   * A drop overshoots slightly and settles; a cancel returns flat, because a
   * correction that bounces reads as if it landed somewhere. Both are
   * transform-only `from` tweens at the fast tier, so nothing is hidden in
   * markup and reduced motion simply never runs them: the chip is already
   * exactly where it ends up.
   */
  useGSAP(
    () => {
      if (!motionOk || settleKind === null || settleId === null || !scope.current) return;
      gsap.from(scope.current, {
        scale: settleKind === 'drop' ? 1.02 : 0.99,
        duration: DURATION_FAST,
        ease: settleKind === 'drop' ? EASE_OUT_BACK : EASE_STANDARD,
        clearProps: 'scale',
      });
    },
    { scope, dependencies: [motionOk, settleKind, settleId] },
  );

  const stateLabel = t(`state.${entry.state}.label`);
  const title = entry.title.trim().length > 0 ? entry.title : t('web.calendar.entry.untitled');
  const accessibleName = t('a11y.label.postSummary', {
    account: entry.accountLabel,
    provider: providerName(entry.provider),
    state: stateLabel,
    time: format.time(entry.scheduledAt),
  });

  return (
    <article
      ref={scope}
      data-entry-key={entryKey(entry)}
      data-grabbed={grabbed || undefined}
      data-dragging={dragging || undefined}
      style={style}
      className={cn(
        'group/chip relative flex min-w-0 rounded-md border',
        density === 'compact' ? 'flex-row items-center' : 'flex-col',
        'bg-surface-raised',
        attention ? 'border-warning-border' : 'border-border-default',
        grabbed && 'border-accent ring-2 ring-[color:var(--border-focus)] ring-offset-1',
        // Picked up, by the M key or by the handle: rotate and lift,
        // transform-only so it never triggers layout. Reduced motion keeps
        // only the ring above, which already says "picked up" without moving
        // anything, and the dashed outline on the target cell says where it
        // would land. Neither depends on the chip having moved.
        grabbed && motionOk && 'shadow-hard scale-[1.02] rotate-[1.5deg]',
        // The source stays put while the pointer is down. It reads as lifted,
        // not relocated, because nothing has been written yet: a 2% lift plus
        // the hard shadow token, and the fade that says "this is the copy you
        // are carrying, not the copy that is scheduled".
        dragging && 'opacity-70',
        dragging && motionOk && 'shadow-hard scale-[1.02]',
        // Hover lift on the whole card, not just the link text underneath.
        'hover:shadow-hard-sm hover:-translate-y-px',
        'transition-[background-color,border-color,color,box-shadow,translate,rotate,scale]',
        // The lift is the one interaction here that has to feel instant, so it
        // runs at the fast tier rather than the base one every other state
        // change on this chip uses.
        dragging ? 'duration-(--duration-fast)' : 'duration-(--duration-base)',
        'ease-(--ease-out-back) motion-reduce:transition-none',
        // The inline-start padding clears the identity spine on both densities.
        density === 'compact' ? 'gap-1 py-1 ps-3 pe-1.5' : 'gap-1.5 py-2 ps-3.5 pe-2',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          // Inside the chip's 1px border and carrying its start radius, rather
          // than clipped by an `overflow` rule: `hiddenStateClassesIn` reads
          // every class on this surface looking for hidden initial state, and
          // `overflow-hidden` is indistinguishable from `hidden` to it.
          'pointer-events-none absolute inset-y-px start-px w-1 rounded-s-md',
          providerBarClass[entry.provider],
        )}
      />

      <a
        href={href}
        aria-label={accessibleName}
        className={cn(
          'flex min-w-0 flex-col gap-1 rounded-sm no-underline',
          density === 'compact' && 'flex-1',
          'after:absolute after:inset-0 after:content-[""]',
          focusRingInset,
        )}
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <ProviderMark provider={entry.provider} />
          <span className="text-label text-text-secondary shrink-0 tabular-nums">
            {format.time(entry.scheduledAt)}
          </span>
          <span className="text-body-sm text-text-primary min-w-0 flex-1 truncate font-medium">
            {title}
          </span>
        </span>

        {density === 'compact' ? null : (
          <span className="text-body-sm text-text-secondary truncate">{entry.accountLabel}</span>
        )}
      </a>

      {density === 'compact' ? (
        movable ? (
          <MoveHandle
            entry={entry}
            label={t('web.calendar.keyboard.pickUp')}
            hint={t('calendar.drag.handleHint')}
            compact
            onPickUp={onPickUp}
            {...(onDragStart ? { onDragStart } : {})}
          />
        ) : null
      ) : (
        <div className="relative z-10 flex flex-wrap items-center gap-1">
          {/*
            A published entry is the one state on this chip that is an event
            rather than a status, so it gets the badge that celebrates the
            transition instead of the pill that reports a step. The word is
            still `state.published.label`: the badge changes the gesture, not
            the vocabulary, and colour is never the only signal either way.
          */}
          {entry.state === 'published' ? (
            <LiveBadge
              live
              label={stateLabel}
              icon={<Check aria-hidden="true" className="size-3" />}
              className="px-2 py-0.5"
            />
          ) : (
            <StatusPill state={entry.state} label={stateLabel} size="sm" />
          )}
          {entry.contentLocale ? (
            <Badge tone="outline">
              {t('web.calendar.entry.language', { locale: entry.contentLocale })}
            </Badge>
          ) : null}
          <Badge tone="outline" icon={mediaIcon[entry.mediaKind]}>
            {t(`calendar.post.mediaType.${entry.mediaKind}`)}
          </Badge>
          {entry.targetCount > 1 ? (
            <Badge tone="neutral">
              {t('calendar.post.targetCount', { count: entry.targetCount })}
            </Badge>
          ) : null}
          {movable ? (
            <MoveHandle
              entry={entry}
              label={t('web.calendar.keyboard.pickUp')}
              hint={t('calendar.drag.handleHint')}
              onPickUp={onPickUp}
              {...(onDragStart ? { onDragStart } : {})}
            />
          ) : null}
        </div>
      )}
    </article>
  );
}

interface MoveHandleProps {
  entry: CalendarEntry;
  label: string;
  /** Describes both input methods, so neither is discoverable only by trying. */
  hint: string;
  compact?: boolean;
  onPickUp?: ((entry: CalendarEntry) => void) | undefined;
  onDragStart?: ((entry: CalendarEntry, event: ReactPointerEvent<Element>) => void) | undefined;
}

/**
 * Pick up, by click or by drag.
 *
 * `onPointerDown` only records a candidate drag. The click still fires when the
 * pointer never travelled, which is what keeps the keyboard route reachable
 * with a mouse and reachable at all on a touch screen, where the drag is
 * deliberately not wired up so the page can still be scrolled.
 */
function MoveHandle({
  entry,
  label,
  hint,
  compact = false,
  onPickUp,
  onDragStart,
}: MoveHandleProps): ReactNode {
  return (
    <button
      type="button"
      data-move-handle=""
      title={hint}
      onClick={() => onPickUp?.(entry)}
      onPointerDown={onDragStart ? (event) => onDragStart(entry, event) : undefined}
      className={cn(
        'relative z-10 inline-flex shrink-0 items-center justify-center gap-1 rounded-sm',
        'text-label text-text-tertiary hover:bg-surface-hover hover:text-text-primary',
        onDragStart && 'cursor-grab active:cursor-grabbing',
        focusRingInset,
        // WCAG 2.2 target size (minimum) is 24 by 24 CSS pixels. A month chip
        // has no room for more, so the compact handle is exactly that square.
        // Elsewhere the design system recipe takes it to a comfortable 44 on a
        // phone, and the icon plus padding holds it at 24 on a wide screen.
        compact ? 'size-6' : cn('ms-auto px-1.5 py-1', touchTarget),
      )}
    >
      <Move aria-hidden="true" className="size-4" />
      <span className={compact ? 'sr-only' : 'sr-only sm:not-sr-only'}>{label}</span>
    </button>
  );
}
