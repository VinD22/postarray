'use client';

/**
 * The composer route container.
 *
 * It owns the things a screen should not: the media list, the picker, the
 * gateway calls and the commit intents. The screen itself stays a function of
 * the draft.
 */

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PermissionDenied,
  SkeletonList,
} from '@relay/design-system/patterns';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import {
  ComposerProvider,
  ComposerScreen,
  useComposer,
  type ComposerBootstrap,
  type CommitAcknowledgement,
  type MediaLookup,
  type ScheduleIntent,
} from '@/features/composer';
import {
  MediaPickerDialog,
  createUploadTransport,
  mediaAssetFromApi,
  type AccountRule,
  type MediaAsset,
} from '@/features/media';

import { useLocalizedRouter } from '@/lib/i18n';
import { ApiError, api, keys } from '@/lib/api';
import { ERROR_CODES } from '@relay/contracts';
import {
  createComposerGateway,
  searchDestinations,
  searchMentions,
} from '@/features/composer/data/composer-gateway';
import { createCommitKeyRegistry } from '@/features/composer/data/commit-key-registry';
import { UNSAVED_DRAFT_ID } from '@/features/composer/types';
import { MediaDetailsDialog } from '@/features/composer/components/media-details-dialog';

/** How often to re-read the library while an attached file is still being checked. */
const SCAN_POLL_MS = 5_000;

/**
 * The library as the composer sees it, kept live on the client.
 *
 * The server render seeds it, so the first paint is unchanged. After an upload
 * or an alt text edit the query is invalidated instead of re-running the whole
 * route with `router.refresh()`, which re-read every connection and capability
 * to learn about one file. While any file is still pending its safety check,
 * the list is re-read on a short interval so the strip moves on by itself.
 */
function useComposerMedia(input: {
  readonly workspaceId: string;
  readonly projectId: string | null;
  readonly initial: readonly MediaAsset[];
  readonly enabled: boolean;
}): { readonly assets: readonly MediaAsset[]; readonly queryKey: readonly unknown[] } {
  const queryKey = useMemo(
    () => [...keys.media(input.workspaceId), 'composer', input.projectId ?? 'all'] as const,
    [input.projectId, input.workspaceId],
  );
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const page = await api.media.list(
        input.projectId === null ? {} : { projectId: input.projectId },
      );
      return page.data.map(mediaAssetFromApi);
    },
    initialData: input.initial,
    // The seed is fresh from the server render; do not re-read it on mount.
    staleTime: 30_000,
    enabled: input.enabled,
    refetchInterval: (current) =>
      (current.state.data ?? []).some((asset) => asset.scanState === 'pending')
        ? SCAN_POLL_MS
        : false,
  });
  return { assets: query.data, queryKey };
}

/**
 * Put the new draft's id in the address bar without a navigation.
 *
 * A lazily created draft used to leave the URL at `/compose`, so a reload
 * opened a blank composer and the work was only reachable from the device
 * mirror. `replaceState` keeps this render, its gateway and its unsaved state.
 */
function rememberDraftInUrl(contentItemId: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  const url = new URL(window.location.href);
  if (url.searchParams.get('contentItemId') === contentItemId) {
    return;
  }
  url.searchParams.set('contentItemId', contentItemId);
  window.history.replaceState(window.history.state, '', url);
}

export type ComposeStatus = 'ready' | 'loading' | 'error' | 'forbidden' | 'no_connections';

export interface ComposeClientProps {
  readonly status: ComposeStatus;
  readonly bootstrap: ComposerBootstrap | null;
  readonly assets: readonly MediaAsset[];
  readonly contentLocales: readonly string[];
  readonly approvalRequired: boolean;
  /** Needed to reserve uploads against the right project from the composer. */
  readonly projectId?: string | null;
  /** False in demo mode, where uploading would write nothing. */
  readonly uploadEnabled?: boolean;
  readonly errorMessage?: string;
  readonly errorReference?: string;
}

export function ComposeClient(props: ComposeClientProps): ReactNode {
  const t = useTranslations();
  const router = useLocalizedRouter();

  if (props.status === 'loading' || props.bootstrap === null) {
    if (props.status === 'forbidden') {
      return (
        <PermissionDenied
          title={t.full('composerWeb.page.permissionTitle')}
          description={t.full('composerWeb.page.permissionBody')}
          requirements={['editor']}
          requirementsLabel={t.full('common.required')}
        />
      );
    }
    if (props.status === 'error') {
      return (
        <ErrorState
          title={t.full('composerWeb.page.errorTitle')}
          description={props.errorMessage ?? t.full('composerWeb.page.errorBody')}
          onRetry={() => router.refresh()}
          retryLabel={t.full('action.retry')}
          {...(props.errorReference
            ? { reference: { label: t.full('common.details'), value: props.errorReference } }
            : {})}
        />
      );
    }
    if (props.status === 'no_connections') {
      return (
        <EmptyState
          title={t.full('composerWeb.page.noConnectionsTitle')}
          description={t.full('composerWeb.page.noConnectionsBody')}
          example={t.full('composerWeb.page.noConnectionsExample')}
          action={
            <Button variant="primary" onClick={() => router.push('/connections')}>
              {t.full('action.connect')}
            </Button>
          }
        />
      );
    }
    return (
      <LoadingState label={t.full('composerWeb.page.loading')}>
        <SkeletonList rows={6} avatar />
      </LoadingState>
    );
  }

  return (
    <ComposeReady
      bootstrap={props.bootstrap}
      assets={props.assets}
      contentLocales={props.contentLocales}
      approvalRequired={props.approvalRequired}
      projectId={props.projectId ?? null}
      uploadEnabled={props.uploadEnabled ?? true}
    />
  );
}

function ComposeReady({
  bootstrap,
  assets,
  contentLocales,
  approvalRequired,
  projectId,
  uploadEnabled,
}: {
  readonly bootstrap: ComposerBootstrap;
  readonly assets: readonly MediaAsset[];
  readonly contentLocales: readonly string[];
  readonly approvalRequired: boolean;
  readonly projectId: string | null;
  readonly uploadEnabled: boolean;
}): ReactNode {
  const live = useComposerMedia({
    workspaceId: bootstrap.master.workspaceId,
    projectId: bootstrap.master.projectId ?? projectId,
    initial: assets,
    enabled: uploadEnabled,
  });
  const liveAssets = live.assets;
  const media = useMemo<MediaLookup>(
    () => ({
      get: (mediaId) => {
        const asset = liveAssets.find((entry) => entry.id === mediaId);
        if (!asset) {
          return null;
        }
        return {
          id: asset.id,
          name: asset.name,
          mimeType: asset.mimeType,
          kind: asset.kind,
          bytes: asset.bytes,
          altText: asset.altText,
          altTextWaived: asset.altTextWaived,
          rightsDeclared: asset.rightsDeclared,
        };
      },
    }),
    [liveAssets],
  );

  /*
   * One gateway per open composer, so the lazy draft creation is memoised for
   * as long as the screen is. A new one per render would create a draft per
   * save instead of one per composer.
   */
  const gateway = useMemo(
    () =>
      createComposerGateway({
        contentItemId: bootstrap.master.id === UNSAVED_DRAFT_ID ? null : bootstrap.master.id,
        versionId: bootstrap.versionId ?? null,
        projectId: bootstrap.master.projectId ?? projectId ?? '',
        onDraftCreated: rememberDraftInUrl,
      }),
    [bootstrap.master.id, bootstrap.master.projectId, bootstrap.versionId, projectId],
  );

  return (
    <ComposerProvider
      bootstrap={bootstrap}
      media={media}
      approvalRequired={approvalRequired}
      onSave={gateway.save}
    >
      <ComposeSurface
        assets={liveAssets}
        mediaQueryKey={live.queryKey}
        contentLocales={contentLocales}
        projectId={projectId}
        uploadEnabled={uploadEnabled}
      />
    </ComposerProvider>
  );
}

function ComposeSurface({
  assets,
  mediaQueryKey,
  contentLocales,
  projectId,
  uploadEnabled,
}: {
  readonly assets: readonly MediaAsset[];
  readonly mediaQueryKey: readonly unknown[];
  readonly contentLocales: readonly string[];
  readonly projectId: string | null;
  readonly uploadEnabled: boolean;
}): ReactNode {
  const router = useLocalizedRouter();
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { bootstrap, state, dispatch, summaries, totals, saveNow } = useComposer();
  const [pickerScope, setPickerScope] = useState<string | null | 'closed'>('closed');
  const [detailsAssetId, setDetailsAssetId] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<{ readonly resetAt: string } | null>(null);
  const refreshMedia = useCallback(
    () => queryClient.invalidateQueries({ queryKey: mediaQueryKey }),
    [mediaQueryKey, queryClient],
  );
  const commitKeys = useMemo(() => createCommitKeyRegistry(), []);

  const uploadTransport = useMemo(
    () => (uploadEnabled ? createUploadTransport(projectId) : undefined),
    [projectId, uploadEnabled],
  );

  const rules = useMemo<AccountRule[]>(
    () =>
      summaries.map((summary) => ({
        connectionId: summary.connectionId,
        accountLabel: summary.account.displayName,
        capabilities: summary.account.capabilities,
      })),
    [summaries],
  );

  const addMedia = useCallback(
    (mediaIds: readonly string[]) => {
      if (pickerScope === 'closed') {
        return;
      }
      if (pickerScope === null) {
        dispatch({
          type: 'master/patch',
          patch: { mediaIds: [...new Set([...state.master.mediaIds, ...mediaIds])] },
        });
        return;
      }
      const current = state.overrides[pickerScope]?.mediaIds ?? state.master.mediaIds;
      dispatch({
        type: 'variant/override',
        connectionId: pickerScope,
        field: 'mediaIds',
        value: [...new Set([...current, ...mediaIds])],
      });
    },
    [dispatch, pickerScope, state.master.mediaIds, state.overrides],
  );

  const commit = useCallback(
    async (intent: ScheduleIntent, acknowledgement?: CommitAcknowledgement) => {
      // Keep the operation keys stable for as long as the draft revision is
      // stable. If the server accepted a request but its response was lost, a
      // second click replays that request instead of creating a second job.
      const revision = state.revision;
      // The save is what creates the draft on a lazily created composer, so the
      // id every call below needs comes from it rather than from the state,
      // which may still be holding the local placeholder.
      const contentItemId = await saveNow();
      if (intent === 'draft') {
        return;
      }
      const version = await api.content.freezeVersion(
        contentItemId,
        commitKeys.keyFor('content_version', revision),
      );
      if (intent === 'approval') {
        await api.approvals.request(
          { contentItemId },
          commitKeys.keyFor('approval_request', revision),
        );
      } else if (intent === 'schedule') {
        const schedule = state.master.schedule;
        if (schedule === null) {
          throw new Error('SCHEDULE_REQUIRED');
        }
        // The escalations are the ones the person ticked on the confirm step,
        // from the server's own preview. Scheduling used to send none, so a
        // first post from a new account could never be scheduled.
        const job = await api.scheduling.schedule(
          {
            contentItemId,
            scheduledAt: schedule.instant,
            timeZone: schedule.ianaTimeZone,
            ...(acknowledgement === undefined || acknowledgement.escalations.length === 0
              ? {}
              : {
                  confirmation: {
                    acknowledgedTargetCount: acknowledgement.targetCount,
                    acknowledgedVersionChecksum: version.checksum,
                    acknowledgedEscalations: acknowledgement.escalations,
                  },
                }),
          },
          commitKeys.keyFor('schedule', revision),
        );
        router.push(
          `/posts/${encodeURIComponent(contentItemId)}?job=${encodeURIComponent(job.id)}`,
        );
        return;
      } else {
        const job = await api.publishing.publishNow(
          {
            contentItemId,
            confirmation: {
              acknowledgedTargetCount: acknowledgement?.targetCount ?? totals.targetCount,
              acknowledgedVersionChecksum: version.checksum,
              // Publishing now always escalates `immediate_publish`. When the
              // preview could not run, that is the one code known to apply; the
              // server compares the set exactly and names anything missing.
              acknowledgedEscalations: acknowledgement?.escalations ?? ['immediate_publish'],
            },
          },
          commitKeys.keyFor('publish', revision),
        );
        router.push(
          `/posts/${encodeURIComponent(contentItemId)}?job=${encodeURIComponent(job.id)}`,
        );
        return;
      }
      // The receipt page is the confirmation. `/calendar?contentItemId=` was a
      // parameter nothing on the calendar reads, so the user landed on an
      // unfiltered month with no sign anything had happened. `/posts/{id}`
      // renders the real thing: the job, every target and, once it exists, the
      // provider receipt. It is also the href the calendar itself links to.
      router.push(`/posts/${encodeURIComponent(contentItemId)}`);
    },
    [commitKeys, router, saveNow, state.master.schedule, state.revision, totals.targetCount],
  );

  /*
   * A rate-limited commit shows the designed notice with the reset time the
   * server gave. Usage is not shown: the response does not carry it, and a
   * guessed count would be a claim about the workspace we cannot support.
   */
  const commitWithLimits = useCallback(
    async (intent: ScheduleIntent, acknowledgement?: CommitAcknowledgement) => {
      setRateLimit(null);
      try {
        await commit(intent, acknowledgement);
      } catch (error) {
        if (error instanceof ApiError && error.code === ERROR_CODES.RATE_LIMITED) {
          const seconds = error.retryAfterSeconds;
          setRateLimit({
            resetAt:
              seconds === null
                ? t.full('common.unavailable')
                : new Intl.DateTimeFormat(t.locale, { timeStyle: 'short' }).format(
                    new Date(Date.now() + seconds * 1_000),
                  ),
          });
        }
        throw error;
      }
    },
    [commit, t],
  );

  const detailsAsset = assets.find((asset) => asset.id === detailsAssetId) ?? null;

  const targetLabel =
    pickerScope === 'closed' || pickerScope === null
      ? null
      : (bootstrap.accounts.find((account) => account.connectionId === pickerScope)?.displayName ??
        null);

  return (
    <>
      <ComposerScreen
        assets={assets}
        contentLocales={contentLocales}
        onClose={() => router.push('/calendar')}
        onPickMedia={(scope) => setPickerScope(scope)}
        onEditMedia={(mediaId) => setDetailsAssetId(mediaId)}
        onCommit={commitWithLimits}
        {...(rateLimit === null ? {} : { rateLimit })}
        searchDestinations={searchDestinations}
        searchMentions={searchMentions}
      />

      <MediaPickerDialog
        open={pickerScope !== 'closed'}
        onOpenChange={(open) => {
          if (!open) {
            setPickerScope('closed');
          }
        }}
        assets={assets}
        rules={rules}
        targetLabel={targetLabel}
        onConfirm={addMedia}
        {...(uploadTransport === undefined ? {} : { transport: uploadTransport })}
        onUploaded={() => void refreshMedia()}
      />

      <MediaDetailsDialog
        asset={detailsAsset}
        rules={rules}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsAssetId(null);
          }
        }}
        onSaveAltText={async (assetId, input) => {
          await api.media.setAltText(assetId, {
            altText: input.altText,
            waived: input.waived,
            ...(input.waived && input.waivedReason !== null && input.waivedReason.length > 0
              ? { waivedReason: input.waivedReason }
              : {}),
          });
          await refreshMedia();
        }}
        onSaveRights={async (assetId, declaration) => {
          await api.media.declareRights(assetId, declaration);
          await refreshMedia();
        }}
      />
    </>
  );
}
