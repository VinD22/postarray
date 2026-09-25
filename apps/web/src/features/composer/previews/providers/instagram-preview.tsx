'use client';

/**
 * Instagram, in three shapes chosen by the content kind.
 *
 * A carousel gets position dots, a reel gets a single portrait frame, and a
 * feed post gets the picture above the caption. The shape comes from
 * `model.contentKind`, which is the same value the snapshot was asked about,
 * so a kind the account cannot publish never reaches this component at all.
 *
 * Captions are plain text on Instagram: a URL in a caption is not linkified
 * and produces no preview card, so no card is rendered here.
 */

import type { ReactNode } from 'react';
import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';

import { PreviewActions } from '../parts/preview-actions';
import { PreviewCounter } from '../parts/preview-counter';
import { PreviewMedia } from '../parts/preview-media';
import { PreviewText } from '../parts/preview-text';
import { PreviewThread } from '../parts/preview-thread';
import { PreviewThumbnail } from '../parts/preview-thumbnail';
import { PreviewFrame } from '../frame';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

const NAME = PROVIDER_LABEL.instagram;
const ACTIONS = [Heart, MessageCircle, Send, Bookmark];

function CarouselDots({ ids, className }: { ids: readonly string[]; className?: string }): ReactNode {
  const t = useTranslations();
  const count = ids.length;
  if (count < 2) {
    return null;
  }
  return (
    <p className={cn('flex items-center justify-center gap-1.5', className)}>
      <span className="text-label text-text-tertiary">
        {t.full('composerWeb.preview.carousel.position', { position: 1, count })}
      </span>
      <span aria-hidden className="flex items-center gap-1">
        {ids.map((id, position) => (
          <span
            key={id}
            className={cn(
              'size-1.5 rounded-full',
              position === 0 ? 'bg-text-secondary' : 'bg-border-default',
            )}
          />
        ))}
      </span>
    </p>
  );
}

export function InstagramPreview({ model, device }: PreviewProps): ReactNode {
  const t = useTranslations();
  const sent = model.media.filter((file) => file.sent);
  const reel = model.contentKind === 'short_video';
  const carousel = model.contentKind === 'carousel';

  const caption = (
    <PreviewText
      text={model.text}
      presentation={model.presentation}
      resolvesMentions={model.resolvesMentions}
    />
  );

  return (
    <PreviewFrame model={model} device={device} providerName={NAME}>
      {reel ? (
        <div className="flex flex-col gap-2">
          {sent[0] ? (
            <PreviewThumbnail media={sent[0]} className="aspect-[9/16] w-full" />
          ) : (
            <p className="text-body-sm text-text-tertiary">
              {t.full('composerWeb.preview.media.none')}
            </p>
          )}
          <PreviewMedia
            media={model.media.filter((file) => !file.sent)}
            presentation={model.presentation}
            showsAltText={model.showsAltText}
            providerName={NAME}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <PreviewMedia
            media={model.media}
            presentation={model.presentation}
            showsAltText={model.showsAltText}
            providerName={NAME}
            single={carousel}
          />
          {carousel ? <CarouselDots ids={sent.map((file) => file.id)} /> : null}
        </div>
      )}

      <PreviewActions icons={ACTIONS} />
      {caption}

      {model.destinationLabel === null ? null : (
        <p className="text-label text-text-tertiary">
          {t.full('composerWeb.preview.destination', { destination: model.destinationLabel })}
        </p>
      )}

      <PreviewThread
        items={model.threadItems}
        maxItems={model.maxThreadItems}
        providerName={NAME}
      />
      <PreviewCounter counter={model.counter} providerName={NAME} />
    </PreviewFrame>
  );
}
