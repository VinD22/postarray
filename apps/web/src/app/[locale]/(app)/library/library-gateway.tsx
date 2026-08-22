'use client';

/**
 * The library's own gateway.
 *
 * A client boundary because uploads are a browser concern: chunking, aborting
 * and resuming all need the `File` object, which never crosses to the server.
 * Everything it calls is the same API surface the CLI and MCP use.
 */

import { useCallback, useMemo, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { api, newIdempotencyKey } from '@/lib/api';
import type { AccountRule, LibraryStatus, MediaAsset, UploadTransport } from '@/features/media';
import { createUploadTransport } from '@/features/media/state/upload-transport';

import { LibraryClient } from './library-client';

export interface LibraryGatewayProps {
  readonly status: LibraryStatus;
  readonly assets: readonly MediaAsset[];
  readonly rules: readonly AccountRule[];
  readonly timeZone: string;
  readonly errorReference?: string;
  readonly rateLimitResetAt?: string;
  /** True when no API is configured and the screen is showing seeded content. */
  readonly readOnly: boolean;
  readonly projectId: string | null;
}

export function LibraryGateway(props: LibraryGatewayProps): ReactNode {
  const router = useRouter();
  const refresh = useCallback(() => router.refresh(), [router]);

  const transport = useMemo<UploadTransport>(
    () => createUploadTransport(props.projectId),
    [props.projectId],
  );

  return (
    <LibraryClient
      status={props.status}
      assets={props.assets}
      rules={props.rules}
      timeZone={props.timeZone}
      {...(props.rateLimitResetAt ? { rateLimitResetAt: props.rateLimitResetAt } : {})}
      transport={transport}
      importEnabled={!props.readOnly}
      onImportUrl={async (url) => {
        if (props.readOnly) {
          return;
        }
        const operation = await api.media.importFromUrl(
          { url, projectId: props.projectId },
          newIdempotencyKey('media_import'),
        );
        if (operation.status === 'failed') {
          throw new Error('MEDIA_IMPORT_FAILED');
        }
        refresh();
      }}
      onRefresh={refresh}
      {...(props.errorReference ? { errorReference: props.errorReference } : {})}
      onSaveAltText={async (assetId, input) => {
        if (props.readOnly) {
          return;
        }
        const waivedReason =
          input.waived && input.waivedReason !== null && input.waivedReason.length > 0
            ? input.waivedReason
            : undefined;
        await api.media.setAltText(assetId, {
          altText: input.altText,
          waived: input.waived,
          ...(waivedReason === undefined ? {} : { waivedReason }),
        });
        refresh();
      }}
      onSaveRights={async (assetId, declaration) => {
        if (props.readOnly) {
          return;
        }
        await api.media.declareRights(assetId, declaration);
        refresh();
      }}
    />
  );
}
