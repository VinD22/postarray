/**
 * `/library`
 *
 * The media library. Upload admission uses Relay's workspace storage limits.
 * Connected-account capability rules remain available for alt text, editing
 * guidance and the later compose-time provider validation.
 */

import type { Metadata } from 'next';
import type { CapabilitySnapshot } from '@relay/contracts';

import { isDemoMode } from '@/lib/api/config';
import { ApiError } from '@/lib/api/error';
import { api } from '@/lib/api';
import { getRequestIntl } from '@/lib/i18n/server';
import { SEED_ACCOUNTS } from '@/features/composer';
import {
  SEED_ASSETS,
  mediaAssetFromApi,
  type AccountRule,
  type LibraryStatus,
  type MediaAsset,
} from '@/features/media';

import { LibraryGateway } from './library-gateway';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('library.title') };
}

export const dynamic = 'force-dynamic';

export default async function LibraryPage(): Promise<React.ReactElement> {
  let status: LibraryStatus = 'ready';
  let assets: readonly MediaAsset[] = [];
  let rules: readonly AccountRule[] = [];
  let errorReference: string | undefined;
  let rateLimitResetAt: string | undefined;

  if (isDemoMode) {
    assets = SEED_ASSETS;
    rules = SEED_ACCOUNTS.map((account) => ({
      connectionId: account.connectionId,
      accountLabel: account.displayName,
      capabilities: account.capabilities,
    }));
  } else {
    try {
      const [page, connections] = await Promise.all([api.media.list({}), api.connections.list({})]);
      assets = page.data.map(mediaAssetFromApi);
      rules = await Promise.all(
        connections.data.map(async (connection) => ({
          connectionId: connection.id,
          accountLabel: connection.displayName,
          capabilities: (await api.connections.getCapabilities(
            connection.id,
          )) as CapabilitySnapshot,
        })),
      );
    } catch (error) {
      const apiError = ApiError.fromUnknown(error, null);
      status = apiError.isAuthorization
        ? 'forbidden'
        : apiError.isOffline
          ? 'offline'
          : apiError.isRateLimited
            ? 'rate_limited'
            : 'error';
      errorReference = apiError.correlationId ?? undefined;
      if (apiError.retryAfterSeconds !== null) {
        rateLimitResetAt = new Date(
          Date.now() + apiError.retryAfterSeconds * 1_000,
        ).toISOString();
      }
    }
  }

  return (
    <LibraryGateway
      status={status}
      assets={assets}
      rules={rules}
      timeZone="UTC"
      readOnly={isDemoMode}
      {...(errorReference ? { errorReference } : {})}
      {...(rateLimitResetAt ? { rateLimitResetAt } : {})}
    />
  );
}
