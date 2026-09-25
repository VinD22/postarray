'use client';

/**
 * The fallback for a platform we have not written a preview for.
 *
 * It is deliberately plain. `DEFAULT_PRESENTATION` gives it no link card, no
 * title and no truncation, so everything it shows is something the model
 * actually knows. A generic frame that guessed at chrome would be worse than
 * one that does not, because the guess is what a person would believe.
 */

import type { ReactNode } from 'react';

import { FeedPost } from '../parts/feed-post';
import { PROVIDER_LABEL } from '../../components/provider-identity';
import type { PreviewProps } from '../types';

export function GenericPreview({ model, device }: PreviewProps): ReactNode {
  return (
    <FeedPost
      model={model}
      device={device}
      providerName={PROVIDER_LABEL[model.provider]}
      actionIcons={[]}
    />
  );
}
