'use client';

/**
 * The storage and upload policy in one place.
 *
 * This is deliberately derived from the same account rules used to validate a
 * file. The copy therefore cannot drift from the limit that the upload queue
 * will enforce, and a provider-specific limit remains visible when the
 * composer supplies target rules.
 */

import type { ReactNode } from 'react';
import { Notice } from '@relay/design-system/patterns';
import { formatBytes } from '@relay/i18n';
import { useTranslations } from '@relay/i18n/react';

import { mediaPolicyLimits } from '../state/media-policy';
import type { AccountRule } from '../state/media-rules';

export interface MediaPolicyNoticeProps {
  readonly rules: readonly AccountRule[];
}

export function MediaPolicyNotice({ rules }: MediaPolicyNoticeProps): ReactNode {
  const t = useTranslations();
  const { imageBytes, videoBytes } = mediaPolicyLimits(rules);

  return (
    <Notice tone="info" title={t.full('mediaLib.retention.title')}>
      <p>{t.full('mediaLib.retention.body')}</p>
      <p>
        {t.full('mediaLib.retention.limits', {
          imageSize:
            imageBytes === null ? t.full('common.unavailable') : formatBytes(t.locale, imageBytes),
          videoSize:
            videoBytes === null ? t.full('common.unavailable') : formatBytes(t.locale, videoBytes),
        })}
      </p>
    </Notice>
  );
}
