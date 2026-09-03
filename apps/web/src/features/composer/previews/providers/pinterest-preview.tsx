'use client';

/**
 * Pinterest.
 *
 * A Pin is a tall picture with a title and a description under it, and the
 * Pin's own destination is the link. The platform does not render a second
 * preview card inside the Pin, so the address is shown as text under the
 * description rather than as a card.
 */

import type { ReactNode } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { useTranslations } from '@relay/i18n/react';

import { PreviewActions } from '../parts/preview-actions';
import { PreviewCounter } from '../parts/preview-counter';
import { PreviewMedia } from '../parts/preview-media';
import { PreviewText } from '../parts/preview-text';
import { PreviewThumbnail } from '../parts/preview-thumbnail';
import { PreviewFrame } from '../frame';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

const NAME = PROVIDER_LABEL.pinterest;

export function PinterestPreview({ model, device }: PreviewProps): ReactNode {
  const t = useTranslations();
  const first = model.media.find((file) => file.sent);
  const extras = model.media.filter((file) => !file.sent);
  const destination = model.links[0];

  return (
    <PreviewFrame model={model} device={device} providerName={NAME}>
      {first ? (
        <PreviewThumbnail media={first} className="aspect-[2/3] w-full" />
      ) : (
        <p className="text-body-sm text-text-tertiary">
          {t.full('composerWeb.preview.media.none')}
        </p>
      )}

      <PreviewActions icons={[Heart, Share2]} />

      {model.title === null ? null : (
        <h4 className="text-title-sm text-text-primary">{model.title}</h4>
      )}

      <PreviewText
        text={model.text}
        presentation={model.presentation}
        resolvesMentions={model.resolvesMentions}
      />

      {destination === undefined || destination.domain.length === 0 ? null : (
        <p className="text-label text-text-secondary truncate">{destination.domain}</p>
      )}

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
