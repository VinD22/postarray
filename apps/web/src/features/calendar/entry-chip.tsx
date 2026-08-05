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
        'transition-colors duration-[--duration-fast] motion-reduce:transition-none',
        density === 'compact' ? 'gap-0 px-1.5 py-1' : 'gap-1 px-2 py-1.5',
        className,
      )}
    >
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
