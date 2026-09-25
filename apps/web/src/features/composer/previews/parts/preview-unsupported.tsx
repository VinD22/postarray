'use client';

/**
 * What the preview shows when the platform will not take this post at all.
 *
 * No mock post. Rendering a plausible looking card for a combination that
 * cannot publish is the single most misleading thing a preview can do, so
 * there is nothing here but the state and the sentence explaining it.
 *
 * `unsupported` and `not_implemented` get different sentences. One says the
 * platform has no such API and no work on our side will change it. The other
 * says the platform offers it and we have not built it. Merging them would
 * tell a customer a platform cannot do something when the truth is that we
 * have not shipped it.
 */

import type { ReactNode } from 'react';
import { CapabilityBadge, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { CapabilitySupport, ContentKind } from '@relay/contracts';

export interface PreviewUnsupportedProps {
  readonly support: Exclude<CapabilitySupport, 'supported'>;
  readonly contentKind: ContentKind;
  readonly providerName: string;
}

const KIND_KEY = {
  text: 'composerWeb.preview.kind.text',
  image: 'composerWeb.preview.kind.image',
  carousel: 'composerWeb.preview.kind.carousel',
  video: 'composerWeb.preview.kind.video',
  short_video: 'composerWeb.preview.kind.short_video',
  long_video: 'composerWeb.preview.kind.long_video',
  document: 'composerWeb.preview.kind.document',
  thread: 'composerWeb.preview.kind.thread',
} as const;

const TITLE_KEY = {
  unsupported: 'composerWeb.preview.kindTitle.unsupported',
  not_implemented: 'composerWeb.preview.kindTitle.not_implemented',
  requires_review: 'composerWeb.preview.kindTitle.requires_review',
} as const;

const BODY_KEY = {
  unsupported: 'composerWeb.preview.kindBody.unsupported',
  not_implemented: 'composerWeb.preview.kindBody.not_implemented',
  requires_review: 'composerWeb.preview.kindBody.requires_review',
} as const;

const LEVEL_KEY = {
  unsupported: 'capability.level.unsupported',
  not_implemented: 'capability.level.not_implemented',
  requires_review: 'capability.level.requires_review',
} as const;

const TONE = {
  unsupported: 'neutral',
  not_implemented: 'info',
  requires_review: 'warning',
} as const;

export function PreviewUnsupported({
  support,
  contentKind,
  providerName,
}: PreviewUnsupportedProps): ReactNode {
  const t = useTranslations();
  const kind = t.full(KIND_KEY[contentKind]);

  return (
    <div className="flex flex-col items-start gap-3">
      <CapabilityBadge state={support} label={t.full(LEVEL_KEY[support])} />
      <Notice
        tone={TONE[support]}
        title={t.full(TITLE_KEY[support], { provider: providerName, kind })}
        description={t.full(BODY_KEY[support], { provider: providerName, kind })}
      />
    </div>
  );
}
