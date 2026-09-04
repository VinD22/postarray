'use client';

/**
 * YouTube.
 *
 * A video carries a required title of its own alongside the description, so
 * this is the one feed shape where the composer's title field is shown, above
 * the frame rather than inside the body. Alt text has no place on a YouTube
 * upload and the snapshot says so, which is why no alt indicator appears here.
 */

import type { ReactNode } from 'react';
import { MessageSquare, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useTranslations } from '@relay/i18n/react';

import { PreviewActions } from '../parts/preview-actions';
import { PreviewCounter } from '../parts/preview-counter';
import { PreviewMedia } from '../parts/preview-media';
import { PreviewText } from '../parts/preview-text';
import { PreviewThumbnail } from '../parts/preview-thumbnail';
import { PreviewFrame } from '../frame';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

const NAME = PROVIDER_LABEL.youtube;

export function YouTubePreview({ model, device }: PreviewProps): ReactNode {
  const t = useTranslations();
  const first = model.media.find((file) => file.sent);
  const extras = model.media.filter((file) => !file.sent);
  const short = model.contentKind === 'short_video';

  return (
    <PreviewFrame model={model} device={device} providerName={NAME}>
      {first ? (
        <PreviewThumbnail media={first} className={short ? 'aspect-[9/16] w-full' : 'aspect-video w-full'} />
      ) : (
        <p className="text-body-sm text-text-tertiary">
          {t.full('composerWeb.preview.media.none')}
        </p>
      )}

      {model.title === null ? null : (
        <h4 className="text-title-sm text-text-primary">{model.title}</h4>
      )}

      <PreviewActions icons={[ThumbsUp, ThumbsDown, Share2, MessageSquare]} />

      <PreviewText
        text={model.text}
        presentation={model.presentation}
        resolvesMentions={model.resolvesMentions}
      />

      <PreviewMedia
        media={extras}
        presentation={model.presentation}
        showsAltText={model.showsAltText}
        providerName={NAME}
      />

      <PreviewCounter counter={model.counter} providerName={NAME} />
    </PreviewFrame>
  );
}
