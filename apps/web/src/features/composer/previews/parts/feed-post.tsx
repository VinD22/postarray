'use client';

/**
 * The shape most feeds share: an author row, a body, attachments, a link card,
 * a row of action glyphs, then the counter.
 *
 * Six of the ten platforms genuinely lay a post out this way, so they compose
 * this rather than each restating it. What a provider file then contains is
 * only what makes that provider different: whether the picture comes before
 * the words, which glyphs sit under the post, whether a title is shown. That
 * is the difference worth reading in a diff.
 */

import type { ComponentType, ReactNode } from 'react';
import { useTranslations } from '@relay/i18n/react';

import { PreviewFrame } from '../frame';
import type { PreviewProps } from '../types';
import { PreviewActions } from './preview-actions';
import { PreviewCounter } from './preview-counter';
import { PreviewLinkCard } from './preview-link-card';
import { PreviewMedia } from './preview-media';
import { PreviewText } from './preview-text';
import { PreviewThread } from './preview-thread';

export interface FeedPostProps extends PreviewProps {
  readonly providerName: string;
  readonly actionIcons: readonly ComponentType<{ className?: string }>[];
  /** Instagram and Pinterest lead with the picture. Most feeds lead with words. */
  readonly mediaFirst?: boolean;
  /** One attachment per row, whatever the grid shape would otherwise do. */
  readonly singleMedia?: boolean;
}

export function FeedPost({
  model,
  device,
  providerName,
  actionIcons,
  mediaFirst = false,
  singleMedia = false,
}: FeedPostProps): ReactNode {
  const t = useTranslations();
  const firstLink = model.links[0];

  const text = (
    <PreviewText
      text={model.text}
      presentation={model.presentation}
      resolvesMentions={model.resolvesMentions}
    />
  );
  const media = (
    <PreviewMedia
      media={model.media}
      presentation={model.presentation}
      showsAltText={model.showsAltText}
      providerName={providerName}
      single={singleMedia}
    />
  );

  return (
    <PreviewFrame model={model} device={device} providerName={providerName}>
      {model.presentation.showsTitle && model.title !== null ? (
        <h4 className="text-title-sm text-text-primary">{model.title}</h4>
      ) : null}

      {mediaFirst ? media : text}
      {mediaFirst ? text : media}

      {firstLink ? <PreviewLinkCard link={firstLink} presentation={model.presentation} /> : null}

      {model.destinationLabel === null ? null : (
        <p className="text-label text-text-tertiary">
          {t.full('composerWeb.preview.destination', { destination: model.destinationLabel })}
        </p>
      )}

      <PreviewActions icons={actionIcons} />

      <PreviewThread
        items={model.threadItems}
        maxItems={model.maxThreadItems}
        providerName={providerName}
      />

      <PreviewCounter counter={model.counter} providerName={providerName} />
    </PreviewFrame>
  );
}
