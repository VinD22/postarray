/**
 * `/compose`
 *
 * A Server Component that loads the draft, the connectable accounts and their
 * capability snapshots, then hands them to the client surface. Every failure
 * mode is mapped to a designed state rather than a thrown error, because the
 * composer is where people keep unsaved work.
 */

import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';

import { api } from '@/lib/api';
import { isDemoMode } from '@/lib/api/config';
import { ApiError } from '@/lib/api/error';
import type { ForwardAuth } from '@/lib/api/transport';
import { SEED_BOOTSTRAP, type ComposerBootstrap } from '@/features/composer';
import { SEED_ASSETS, mediaAssetFromApi, type MediaAsset } from '@/features/media';
import { loadComposer } from '@/features/composer/data/composer-gateway';
import { requireSession } from '@/lib/auth/require-session';
import { ACTIVE_PROJECT_COOKIE, resolveActiveProject } from '@/lib/auth/project-selection';
import { getRequestIntl } from '@/lib/i18n/server';

import { ComposeClient, type ComposeStatus } from './compose-client';

export async function generateMetadata(): Promise<Metadata> {
  const intl = await getRequestIntl();
  return { title: intl.t.format('composer.title') };
}

export const dynamic = 'force-dynamic';

interface ComposePageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function first(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

export default async function ComposePage({
  searchParams,
}: ComposePageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const contentItemId = first(params.contentItemId);
  const brandId = first(params.brandId);

  let status: ComposeStatus = 'ready';
  let bootstrap: ComposerBootstrap | null = null;
  let assets: readonly MediaAsset[] = [];
  let errorMessage: string | undefined;
  let errorReference: string | undefined;

  if (isDemoMode) {
    bootstrap = SEED_BOOTSTRAP;
    assets = SEED_ASSETS;
  } else {
    try {
      const session = await requireSession('/compose');
      const cookieStore = await cookies();
      // `requireSession` forwards these to the session check internally, but
      // every other read this page makes is its own request and needs the
      // same forwarding — see `ForwardAuth` and `loadComposer`'s doc comment.
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
      const selectedBrand = resolveActiveProject(
        session.brands,
        brandId ?? cookieStore.get(ACTIVE_PROJECT_COOKIE)?.value,
      );
      if (selectedBrand === null) {
        status = 'no_connections';
        return (
          <ComposeClient
            status={status}
            bootstrap={null}
            assets={assets}
            contentLocales={['en', 'es', 'de', 'fr', 'ja']}
            approvalRequired={false}
          />
        );
      }
      const [loadedComposer, mediaPage] = await Promise.all([
        loadComposer({
          contentItemId,
          brandId: selectedBrand.id,
          workspaceTimeZone: session.workspace.timeZone,
          forward,
        }),
        api.media.list({ brandId: selectedBrand.id }, forward),
      ]);
      bootstrap = loadedComposer;
      assets = mediaPage.data.map(mediaAssetFromApi);
      if (bootstrap.accounts.length === 0) {
        status = 'no_connections';
      }
    } catch (error) {
      const apiError = ApiError.fromUnknown(error, null);
      status = apiError.isAuthorization ? 'forbidden' : 'error';
      errorMessage = undefined;
      errorReference = apiError.correlationId ?? undefined;
    }
  }

  return (
    <ComposeClient
      status={status}
      bootstrap={bootstrap}
      assets={assets}
      contentLocales={['en', 'es', 'de', 'fr', 'ja']}
      approvalRequired={false}
      {...(errorMessage ? { errorMessage } : {})}
      {...(errorReference ? { errorReference } : {})}
    />
  );
}
