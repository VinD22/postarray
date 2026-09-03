'use client';

/**
 * TikTok.
 *
 * One portrait video with the caption over it, which is where TikTok puts it.
 * Nothing in the publishing documentation produces a link preview, so no card
 * is rendered even when the caption contains a URL.
 *
 * The privacy setting TikTok requires a person to choose explicitly is not
 * shown here. It is a publishing decision, it lives in the native settings
 * panel, and repeating it inside a picture of the post would make it look like
 * something the viewer will see.
 */

import type { ReactNode } from 'react';
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useTranslations } from '@relay/i18n/react';

import { PreviewActions } from '../parts/preview-actions';
import { PreviewCounter } from '../parts/preview-counter';
import { PreviewMedia } from '../parts/preview-media';
import { PreviewText } from '../parts/preview-text';
import { PreviewThumbnail } from '../parts/preview-thumbnail';
import { PreviewFrame } from '../frame';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

const NAME = PROVIDER_LABEL.tiktok;

export function TikTokPreview({ model, device }: PreviewProps): ReactNode {
  const t = useTranslations();
  const first = model.media.find((file) => file.sent);
  const extras = model.media.filter((file) => !file.sent);

  return (
    <PreviewFrame model={model} device={device} providerName={NAME}>
      <div className="relative flex flex-col gap-2">
        {first ? (
          <PreviewThumbnail media={first} className="aspect-[9/16] w-full" />
        ) : (
          <p className="text-body-sm text-text-tertiary">
            {t.full('composerWeb.preview.media.none')}
          </p>
        )}
        <PreviewActions icons={[Heart, MessageCircle, Bookmark, Share2]} />
      </div>

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
