'use client';

/**
 * The composer route container.
 *
 * It owns the things a screen should not: the media list, the picker, the
 * gateway calls and the commit intents. The screen itself stays a function of
 * the draft.
 */

import { useCallback, useMemo, useState, type ReactNode } from 'react';
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
  type MediaLookup,
  type ScheduleIntent,
} from '@/features/composer';
import { MediaPickerDialog, type AccountRule, type MediaAsset } from '@/features/media';
import { useLocalizedRouter } from '@/lib/i18n';
import { api, newIdempotencyKey } from '@/lib/api';
import {
  saveComposer,
  searchDestinations,
  searchMentions,
} from '@/features/composer/data/composer-gateway';

export type ComposeStatus = 'ready' | 'loading' | 'error' | 'forbidden' | 'no_connections';

export interface ComposeClientProps {
  readonly status: ComposeStatus;
  readonly bootstrap: ComposerBootstrap | null;
  readonly assets: readonly MediaAsset[];
  readonly contentLocales: readonly string[];
  readonly approvalRequired: boolean;
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
    />
  );
}

function ComposeReady({
  bootstrap,
  assets,
  contentLocales,
  approvalRequired,
}: {
  readonly bootstrap: ComposerBootstrap;
  readonly assets: readonly MediaAsset[];
  readonly contentLocales: readonly string[];
  readonly approvalRequired: boolean;
}): ReactNode {
  const media = useMemo<MediaLookup>(
    () => ({
      get: (mediaId) => {
        const asset = assets.find((entry) => entry.id === mediaId);
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
    [assets],
  );

  return (
    <ComposerProvider
      bootstrap={bootstrap}
      media={media}
      approvalRequired={approvalRequired}
      onSave={saveComposer}
    >
      <ComposeSurface assets={assets} contentLocales={contentLocales} />
    </ComposerProvider>
  );
}

function ComposeSurface({
  assets,
  contentLocales,
}: {
  readonly assets: readonly MediaAsset[];
  readonly contentLocales: readonly string[];
}): ReactNode {
  const router = useLocalizedRouter();
  const { bootstrap, state, dispatch, summaries, totals, saveNow } = useComposer();
  const [pickerScope, setPickerScope] = useState<string | null | 'closed'>('closed');

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
    async (intent: ScheduleIntent) => {
      await saveNow();
      if (intent === 'draft') {
        return;
      }
      const version = await api.content.freezeVersion(
        state.master.id,
        newIdempotencyKey('content_version'),
      );
      if (intent === 'approval') {
        await api.approvals.request(
          { contentItemId: state.master.id },
          newIdempotencyKey('approval_request'),
        );
      } else if (intent === 'schedule') {
        const schedule = state.master.schedule;
        if (schedule === null) {
          throw new Error('SCHEDULE_REQUIRED');
        }
        await api.scheduling.schedule(
          {
            contentItemId: state.master.id,
            scheduledAt: schedule.instant,
            timeZone: schedule.ianaTimeZone,
          },
          newIdempotencyKey('schedule'),
        );
      } else {
        await api.publishing.publishNow(
          {
            contentItemId: state.master.id,
            confirmation: {
              acknowledgedTargetCount: totals.targetCount,
              acknowledgedVersionChecksum: version.checksum,
              acknowledgedEscalations: [],
            },
          },
          newIdempotencyKey('publish'),
        );
      }
      router.push(`/calendar?contentItemId=${encodeURIComponent(state.master.id)}`);
    },
    [router, saveNow, state.master.id, state.master.schedule, totals.targetCount],
  );

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
        onEditMedia={(mediaId) => router.push(`/library?asset=${encodeURIComponent(mediaId)}`)}
        onCommit={commit}
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
      />
    </>
  );
}
