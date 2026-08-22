'use client';

/**
 * The media library route container.
 *
 * It owns the upload queue and the write calls; the screen stays a function of
 * the assets it is given. Every write goes to the server before the list
 * changes, because an optimistic alt text or rights declaration would be a
 * claim the workspace has not actually recorded.
 */

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from '@relay/i18n/react';

import {
  LibraryScreen,
  useUploadQueue,
  type AccountRule,
  type LibraryStatus,
  type MediaAsset,
  type RightsDeclaration,
  type UploadTransport,
} from '@/features/media';

/** A library upload has no destinations yet. Provider limits apply in compose. */
const WORKSPACE_UPLOAD_RULES: readonly AccountRule[] = [];

export interface LibraryClientProps {
  readonly status: LibraryStatus;
  readonly assets: readonly MediaAsset[];
  readonly rules: readonly AccountRule[];
  readonly timeZone: string;
  readonly errorReference?: string;
  readonly rateLimitResetAt?: string;
  readonly transport: UploadTransport;
  readonly importEnabled: boolean;
  readonly onImportUrl: (url: string) => Promise<void>;
  readonly onSaveAltText: (
    assetId: string,
    input: { altText: string | null; waived: boolean; waivedReason: string | null },
  ) => Promise<void>;
  readonly onSaveRights: (
    assetId: string,
    declaration: Omit<RightsDeclaration, 'declaredByName' | 'declaredAt'>,
  ) => Promise<void>;
  readonly onRefresh: () => void;
}

export function LibraryClient(props: LibraryClientProps): ReactNode {
  const t = useTranslations();
  const [online, setOnline] = useState(true);

  // Two links elsewhere in the product point here with an intent attached: the
  // composer's "edit this picture" (`?asset=`) and the command palette's
  // "upload media" (`?upload=1`). Both were silently dropped before this.
  const searchParams = useSearchParams();
  const requestedAssetId = searchParams.get('asset');
  const uploadRequested = searchParams.get('upload') === '1';

  useEffect(() => {
    if (!uploadRequested || typeof document === 'undefined') {
      return;
    }
    const heading = document.getElementById('upload-heading');
    heading?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [uploadRequested]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const update = (): void => setOnline(window.navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const messages = useMemo(
    () => ({
      progress: (name: string, percent: string) =>
        t.full('a11y.announce.uploadProgress', { name, percent }),
      complete: (name: string) => t.full('a11y.announce.uploadComplete', { name }),
      failed: (name: string) => t.full('a11y.announce.uploadFailed', { name }),
    }),
    [t],
  );

  const onUploaded = useCallback(() => props.onRefresh(), [props]);

  const queue = useUploadQueue({
    rules: WORKSPACE_UPLOAD_RULES,
    transport: props.transport,
    messages,
    onUploaded,
  });

  return (
    <LibraryScreen
      status={props.status}
      assets={props.assets}
      rules={props.rules}
      uploads={queue.items}
      online={online}
      importEnabled={props.importEnabled}
      timeZone={props.timeZone}
      {...(requestedAssetId === null ? {} : { initialOpenAssetId: requestedAssetId })}
      {...(props.rateLimitResetAt ? { rateLimitResetAt: props.rateLimitResetAt } : {})}
      onRetry={props.onRefresh}
      onFiles={queue.enqueue}
      onImportUrl={props.onImportUrl}
      onPauseUpload={queue.pause}
      onResumeUpload={queue.resume}
      onCancelUpload={queue.cancel}
      onRetryUpload={queue.retry}
      onSaveAltText={props.onSaveAltText}
      onSaveRights={props.onSaveRights}
      {...(props.errorReference ? { errorReference: props.errorReference } : {})}
    />
  );
}
