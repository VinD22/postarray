/**
 * `/library`
 *
 * The media library. Upload admission uses Post Array's workspace storage limits.
 * Connected-account capability rules remain available for alt text, editing
 * guidance and the later compose-time provider validation.
 */

import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import type { CapabilitySnapshot } from '@relay/contracts';

import { isDemoMode } from '@/lib/api/config';
import { ApiError } from '@/lib/api/error';
import { api } from '@/lib/api';
import type { ForwardAuth } from '@/lib/api/transport';
import { requireSession } from '@/lib/auth/require-session';
import { ACTIVE_PROJECT_COOKIE, resolveActiveProject } from '@/lib/auth/project-selection';
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
  let projectId: string | null = null;
  let timeZone = 'UTC';

  if (isDemoMode) {
    assets = SEED_ASSETS;
    rules = SEED_ACCOUNTS.map((account) => ({
      connectionId: account.connectionId,
      accountLabel: account.displayName,
      capabilities: account.capabilities,
    }));
  } else {
    try {
      const session = await requireSession('/library');
      timeZone = session.workspace.timeZone;
      const cookieStore = await cookies();
      // Every read below is its own request from the Next server, so each one
      // needs the session cookie and the client fingerprint forwarded
      // explicitly, exactly as `/compose` does. Without this the API sees
      // Node's own user agent, the fingerprint check fails, and the library
      // renders its error state for a perfectly healthy session.
      const requestHeaders = await headers();
      const forward: ForwardAuth = {
        forwardCookie: cookieStore
          .getAll()
          .map((entry) => `${entry.name}=${entry.value}`)
          .join('; '),
        forwardHeaders: {
          userAgent: requestHeaders.get('user-agent') ?? undefined,
          acceptLanguage: requestHeaders.get('accept-language') ?? undefined,
        },
      };
      const project = resolveActiveProject(
        session.projects,
        cookieStore.get(ACTIVE_PROJECT_COOKIE)?.value,
      );
      projectId = project?.id ?? null;
      const [page, connections] = await Promise.all([
        api.media.list(projectId === null ? {} : { projectId: projectId }, forward),
        api.connections.list(projectId === null ? {} : { projectId: projectId }, forward),
      ]);
      assets = page.data.map(mediaAssetFromApi);
      rules = await Promise.all(
        connections.data.map(async (connection) => ({
          connectionId: connection.id,
          accountLabel: connection.displayName,
          capabilities: (await api.connections.getCapabilities(
            connection.id,
            forward,
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
        rateLimitResetAt = new Date(Date.now() + apiError.retryAfterSeconds * 1_000).toISOString();
      }
    }
  }

  return (
    <LibraryGateway
      status={status}
      assets={assets}
      rules={rules}
      timeZone={timeZone}
      readOnly={isDemoMode}
      projectId={projectId}
      {...(errorReference ? { errorReference } : {})}
      {...(rateLimitResetAt ? { rateLimitResetAt } : {})}
    />
  );
}
