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
 * The whole chip is a link. Rescheduling from the keyboard is a separate
 * button inside it, so tabbing never picks a post up by accident and the
 * primary action of a chip stays "open the post".
 */

import type { CSSProperties, ReactNode } from 'react';
import { FileText, Film, Image as ImageIcon, Images, Type as TypeIcon, Move } from 'lucide-react';
import { Badge, StatusPill, cn, focusRingInset } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import type { ProviderId } from '@/lib/api/types';
import { ProviderMark, useProviderName } from '@/features/connections/provider';
import { useCalendarFormat } from './format';
import { entryKey, needsAttention } from './filters';
import { canReschedule } from './reschedule';
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
 * bar. It is never the only carrier of the platform: `ProviderMark` beside
 * the time already names the platform for assistive technology, so this bar
 * is `aria-hidden` and purely reinforces what the mark and the account label
 * already say.
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
};

export interface EntryChipProps {
  entry: CalendarEntry;
  href: string;
  /** Rendered as a compact single line inside a dense month cell. */
  density?: 'grid' | 'compact';
  /** True while this entry is picked up for a keyboard move. */
  grabbed?: boolean;
  onPickUp?: (entry: CalendarEntry) => void;
  className?: string;
  style?: CSSProperties;
}

export function EntryChip({
  entry,
  href,
  density = 'grid',
  grabbed = false,
  onPickUp,
  className,
  style,
}: EntryChipProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();
  const motionOk = useMotionOk();
  const attention = needsAttention(entry);
  const movable = canReschedule(entry.state) && onPickUp !== undefined;

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
      data-entry-key={entryKey(entry)}
      data-grabbed={grabbed || undefined}
      style={style}
      className={cn(
        'group/chip relative flex min-w-0 flex-col rounded-md border',
        'bg-surface-raised',
        attention ? 'border-warning-border' : 'border-border-default',
        grabbed && 'border-accent ring-2 ring-[color:var(--border-focus)] ring-offset-1',
        // Picked up for a keyboard move: rotate and lift, transform-only so it
        // never triggers layout. Reduced motion keeps only the ring above,
        // which already says "picked up" without moving anything.
        grabbed && motionOk && 'shadow-hard scale-[1.02] rotate-[1.5deg]',
        // Hover lift on the whole card, not just the link text underneath.
        'hover:shadow-hard-sm hover:-translate-y-px',
        'transition-[background-color,border-color,color,box-shadow,translate,rotate,scale]',
        'duration-(--duration-base) ease-(--ease-out-back) motion-reduce:transition-none',
        density === 'compact' ? 'gap-0 py-1 ps-2.5 pe-1.5' : 'gap-1 py-1.5 ps-3 pe-2',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-1 start-0.5 w-[3px] rounded-full',
          providerBarClass[entry.provider],
        )}
      />

      <a
        href={href}
        aria-label={accessibleName}
        className={cn(
          'flex min-w-0 flex-col gap-1 rounded-sm no-underline',
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

      {density === 'compact' ? null : (
        <div className="relative z-10 flex flex-wrap items-center gap-1">
          <StatusPill state={entry.state} label={stateLabel} size="sm" />
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
            <button
              type="button"
              onClick={() => onPickUp?.(entry)}
              className={cn(
                'ms-auto inline-flex items-center gap-1 rounded-sm px-1 py-0.5',
                'text-label text-text-tertiary hover:bg-surface-hover hover:text-text-primary',
                focusRingInset,
              )}
            >
              <Move aria-hidden="true" className="size-3" />
              <span className="sr-only sm:not-sr-only">{t('web.calendar.keyboard.pickUp')}</span>
            </button>
          ) : null}
        </div>
      )}
    </article>
  );
}
