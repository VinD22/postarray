/**
 * `/compose`
 *
 * A Server Component that loads the draft, the connectable accounts and their
 * capability snapshots, then hands them to the client surface. Every failure
 * mode is mapped to a designed state rather than a thrown error, because the
 * composer is where people keep unsaved work.
 */

import type { Metadata } from 'next';

import { isDemoMode } from '@/lib/api/config';
import { ApiError } from '@/lib/api/error';
import { SEED_BOOTSTRAP, type ComposerBootstrap } from '@/features/composer';
import { SEED_ASSETS, type MediaAsset } from '@/features/media';
import { loadComposer } from '@/features/composer/data/composer-gateway';
import { requireSession } from '@/lib/auth/require-session';

import { ComposeClient, type ComposeStatus } from './compose-client';

export const metadata: Metadata = {
  // The document title is chrome, not product copy, and Next needs it here.
  title: 'Compose',
};

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
      const selectedBrand =
        session.brands.find((brand) => brand.id === brandId) ?? session.brands[0] ?? null;
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
      bootstrap = await loadComposer({
        contentItemId,
        brandId: selectedBrand.id,
        workspaceTimeZone: session.workspace.timeZone,
      });
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
