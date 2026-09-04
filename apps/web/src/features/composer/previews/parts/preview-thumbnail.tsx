'use client';

/**
 * One attachment as a picture.
 *
 * Four states and no fifth: loading, a thumbnail, no rendition yet, and the
 * file cannot be read. The last two are different facts and are worded
 * differently, because "we have not generated a thumbnail" and "this file is
 * gone" ask the person for different things.
 *
 * The alt attribute is the asset's own alt text. When there is none the image
 * is decorative to a screen reader, `alt=""`, and the missing alt text is
 * reported visibly instead, so it reads as the publishing problem it is rather
 * than as a description.
 */

import type { ReactNode } from 'react';
import { FileText, ImageOff, Music, Play } from 'lucide-react';
import { Skeleton } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';

import type { PreviewMedia } from '../types';

export interface PreviewThumbnailProps {
  readonly media: PreviewMedia;
  /** Tailwind aspect utility for the tile. The grid decides the shape. */
  readonly className?: string;
}

const KIND_ICON = {
  image: ImageOff,
  gif: ImageOff,
  video: Play,
  document: FileText,
  audio: Music,
} as const;

export function PreviewThumbnail({ media, className }: PreviewThumbnailProps): ReactNode {
  const t = useTranslations();
  const frame = cn(
    'border-border-subtle bg-surface-sunken relative flex items-center justify-center',
    'overflow-hidden rounded-md border',
    className,
  );

  if (media.loading) {
    return (
      <div className={frame}>
        <Skeleton variant="block" className="size-full rounded-none" />
        <span className="sr-only">{t.full('composerWeb.preview.media.loading')}</span>
      </div>
    );
  }

  if (!media.available) {
    return (
      <div className={frame}>
        <p className="text-label text-text-tertiary px-2 text-center">
          {t.full('composerWeb.preview.media.unavailable')}
        </p>
      </div>
    );
  }

  if (media.thumbnailUrl === null) {
    const Icon = KIND_ICON[media.kind];
    return (
      <div className={frame}>
        <span className="text-text-tertiary flex flex-col items-center gap-1 px-2 text-center">
          <Icon aria-hidden className="size-5" />
          <span className="text-label">{t.full('composerWeb.preview.media.noThumbnail')}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={frame}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a signed, short lived URL from another origin; the optimiser cannot fetch it. */}
      <img
        src={media.thumbnailUrl}
        alt={media.altText ?? ''}
        loading="lazy"
        decoding="async"
        className="size-full object-cover"
      />
      {media.kind === 'video' ? (
        <span
          aria-hidden
          className="bg-surface-raised/80 absolute inset-0 m-auto flex size-8 items-center justify-center rounded-full"
        >
          <Play className="size-4" />
        </span>
      ) : null}
    </div>
  );
}
