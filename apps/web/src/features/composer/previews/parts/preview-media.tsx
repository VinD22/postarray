'use client';

/**
 * The attachments, laid out the way the platform tiles them.
 *
 * Two rules make this honest. Only attachments the platform will accept appear
 * in the grid, and the ones past its maximum appear below it under the words
 * "Not sent", so nothing is dropped quietly. And the alt text indicator only
 * appears where the snapshot says the platform supports alt text at all, so we
 * never nag somebody about a field the platform will discard.
 */

import type { ReactNode } from 'react';
import { EyeOff } from 'lucide-react';
import { Badge } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';

import type { PreviewMedia as PreviewMediaItem, PresentationRule } from '../types';
import { PreviewThumbnail } from './preview-thumbnail';

export interface PreviewMediaProps {
  readonly media: readonly PreviewMediaItem[];
  readonly presentation: PresentationRule;
  readonly showsAltText: boolean;
  readonly providerName: string;
  /** Forces every tile into one column, whatever the grid shape says. */
  readonly single?: boolean;
}

/** `m:ss`, with the locale's digits. */
function formatDuration(locale: string, durationMs: number): string {
  const total = Math.round(durationMs / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  const pad = new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false });
  return `${new Intl.NumberFormat(locale).format(minutes)}:${pad.format(seconds)}`;
}

function gridClass(count: number, single: boolean): string {
  if (single || count === 1) {
    return 'grid-cols-1';
  }
  return count === 3 ? 'grid-cols-2' : 'grid-cols-2';
}

function tileClass(rule: PresentationRule, count: number, index: number, single: boolean): string {
  if (rule.mediaGrid === 'square') {
    return 'aspect-square';
  }
  if (single || count === 1) {
    return rule.mediaGrid === 'stacked' ? 'aspect-video' : 'aspect-[4/3]';
  }
  // Three attachments read as one tall tile beside two stacked ones, which is
  // how every feed that supports three lays them out.
  if (count === 3 && index === 0) {
    return 'row-span-2 aspect-[1/2]';
  }
  return 'aspect-square';
}

export function PreviewMedia({
  media,
  presentation,
  showsAltText,
  providerName,
  single = false,
}: PreviewMediaProps): ReactNode {
  const t = useTranslations();
  const sent = media.filter((file) => file.sent);
  const notSent = media.filter((file) => !file.sent);

  if (media.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {sent.length > 0 ? (
        <ul className={cn('grid gap-1', gridClass(sent.length, single))}>
          {sent.map((file, index) => (
            <li key={file.id} className={cn('relative', tileClass(presentation, sent.length, index, single))}>
              <PreviewThumbnail media={file} className="size-full" />
              {file.durationMs === null ? null : (
                <Badge tone="neutral" className="absolute bottom-1 end-1">
                  {t.full('composerWeb.preview.media.videoDuration', {
                    duration: formatDuration(t.locale, file.durationMs),
                  })}
                </Badge>
              )}
              {showsAltText && file.kind !== 'video' ? (
                <Badge
                  tone={file.altText === null && !file.altTextWaived ? 'warning' : 'neutral'}
                  className="absolute top-1 start-1"
                >
                  {file.altText !== null
                    ? t.full('composerWeb.preview.altText.present')
                    : file.altTextWaived
                      ? t.full('composerWeb.preview.altText.waived')
                      : t.full('composerWeb.preview.altText.missing')}
                </Badge>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {notSent.length > 0 ? (
        <section
          aria-label={t.full('composerWeb.preview.notSent.title')}
          className="border-warning-border bg-warning-bg text-warning-fg flex flex-col gap-2 rounded-md border p-2"
        >
          <p className="text-label flex items-center gap-1.5">
            <EyeOff aria-hidden className="size-3.5" />
            {t.full('composerWeb.preview.notSent.body', {
              count: notSent.length,
              provider: providerName,
            })}
          </p>
          <ul className="flex flex-wrap gap-1">
            {notSent.map((file) => (
              <li key={file.id} className="relative">
                <PreviewThumbnail media={file} className="size-12 opacity-60" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
