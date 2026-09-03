'use client';

/**
 * The provider preview.
 *
 * This file is now only the name the composer screen imports. The preview
 * itself lives in `../previews`, one component per platform behind a registry,
 * because a single provider-agnostic box could show the resolved body and a
 * character count but could never show what the post will look like.
 *
 * Keeping the export here means `composer-screen.tsx` did not have to change
 * to get a platform-native preview.
 */

import type { ReactNode } from 'react';

import { PreviewHost } from '../previews/preview-host';
import type { TargetSummary } from '../types';

export interface ProviderPreviewProps {
  readonly summary: TargetSummary;
}

export function ProviderPreview({ summary }: ProviderPreviewProps): ReactNode {
  return <PreviewHost summary={summary} />;
}
