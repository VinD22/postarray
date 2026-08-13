'use client';

/**
 * The media library.
 *
 * Grid for recognising a picture, list for comparing facts. On a narrow screen
 * the list stays a list of meaningful rows and the detail opens as a sheet
 * rather than clipping ten columns sideways.
 */

import { useMemo, useState, type ReactNode } from 'react';
import { LayoutGrid, Rows3 } from 'lucide-react';
import {
  Button,
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@relay/design-system/primitives';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OfflineBanner,
  PageHeader,
  PermissionDenied,
  RateLimitNotice,
  SkeletonTable,
} from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes, formatDateTime } from '@relay/i18n';
import { cn } from '@relay/design-system/utils';

import { EmptyScene } from '@/components/empty';

import { MediaDetail } from './media-detail';
import { UploadPanel } from './upload-panel';
import type { AccountRule } from '../state/media-rules';
import type { MediaAsset, RightsDeclaration, UploadItem } from '../types';

/** Library uploads are admitted against storage limits, before targets exist. */
const WORKSPACE_UPLOAD_RULES: readonly AccountRule[] = [];

export type LibraryStatus =
  'loading' | 'ready' | 'error' | 'forbidden' | 'offline' | 'rate_limited';

export interface LibraryScreenProps {
  readonly status: LibraryStatus;
  readonly assets: readonly MediaAsset[];
  readonly rules: readonly AccountRule[];
  readonly uploads: readonly UploadItem[];
  readonly online: boolean;
  readonly importEnabled: boolean;
  readonly timeZone: string;
  readonly errorMessage?: string;
  readonly errorReference?: string;
  readonly rateLimitResetAt?: string;
  readonly onRetry?: () => void;
  readonly onFiles: (files: readonly File[]) => void;
  readonly onImportUrl: (url: string) => Promise<void>;
  readonly onPauseUpload: (id: string) => void;
  readonly onResumeUpload: (id: string) => void;
  readonly onCancelUpload: (id: string) => void;
  readonly onRetryUpload: (id: string) => void;
  readonly onSaveAltText: (
    assetId: string,
    input: { altText: string | null; waived: boolean; waivedReason: string | null },
  ) => Promise<void>;
  readonly onSaveRights: (
    assetId: string,
    declaration: Omit<RightsDeclaration, 'declaredByName' | 'declaredAt'>,
  ) => Promise<void>;
}

export function LibraryScreen(props: LibraryScreenProps): ReactNode {
  const t = useTranslations();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [openAssetId, setOpenAssetId] = useState<string | null>(null);

  const openAsset = useMemo(
    () => props.assets.find((asset) => asset.id === openAssetId) ?? null,
    [openAssetId, props.assets],
  );

  const missingAltCount = props.assets.filter(
    (asset) => asset.kind !== 'video' && !asset.altTextWaived && !asset.altText,
  ).length;

  return (
    <div className="flex flex-col gap-6 pb-16">
      <PageHeader
        title={t.full('library.title')}
        description={t.full('library.subtitle')}
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <Tabs
              value={view}
              onValueChange={(value) => setView(value === 'list' ? 'list' : 'grid')}
            >
              <TabsList aria-label={t.full('mediaLib.view.label')}>
                <TabsTrigger value="grid">
                  <LayoutGrid aria-hidden className="me-1.5 size-4" />
                  {t.full('mediaLib.view.grid')}
                </TabsTrigger>
                <TabsTrigger value="list">
                  <Rows3 aria-hidden className="me-1.5 size-4" />
                  {t.full('mediaLib.view.list')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {missingAltCount > 0 ? (
              <span className="text-body-sm text-warning-fg">
                {t.full('mediaLib.alt.missingCount', { count: missingAltCount })}
              </span>
            ) : null}
          </div>
        }
      />

      {props.status === 'forbidden' ? (
        <PermissionDenied
          title={t.full('mediaLib.permission.title')}
          description={t.full('mediaLib.permission.body')}
          requirements={['viewer']}
          requirementsLabel={t.full('common.required')}
        />
      ) : null}

      {props.status === 'error' ? (
        <ErrorState
          title={t.full('mediaLib.error.title')}
          description={props.errorMessage ?? t.full('mediaLib.error.body')}
          {...(props.onRetry ? { onRetry: props.onRetry, retryLabel: t.full('action.retry') } : {})}
          {...(props.errorReference
            ? { reference: { label: t.full('common.details'), value: props.errorReference } }
            : {})}
        />
      ) : null}

      {props.status === 'offline' ? (
        <OfflineBanner
          title={t.full('mediaLib.offline.title')}
          description={t.full('mediaLib.offline.body')}
          actions={
            props.onRetry ? (
              <Button variant="secondary" size="sm" onClick={props.onRetry}>
                {t.full('action.retry')}
              </Button>
            ) : null
          }
        />
      ) : null}

      {props.status === 'rate_limited' ? (
        <RateLimitNotice
          title={t.full('mediaLib.rateLimited.title')}
          cause={t.full('mediaLib.rateLimited.cause')}
          resetLabel={t.full('mediaLib.rateLimited.resetLabel')}
          resetAt={
            props.rateLimitResetAt === undefined
              ? t.full('common.unknown')
              : formatDateTime(t.locale, props.rateLimitResetAt, {
                  timeZone: props.timeZone,
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
          }
          alternative={t.full('mediaLib.rateLimited.alternative')}
          actions={
            props.onRetry ? (
              <Button variant="secondary" size="sm" onClick={props.onRetry}>
                {t.full('action.retry')}
              </Button>
            ) : null
          }
        />
      ) : null}

      {props.status === 'loading' ? (
        <LoadingState label={t.full('mediaLib.loading')}>
          <SkeletonTable rows={6} columns={5} />
        </LoadingState>
      ) : null}

      {props.status === 'ready' ? (
        <>
          <UploadPanel
            rules={WORKSPACE_UPLOAD_RULES}
            items={props.uploads}
            online={props.online}
            importEnabled={props.importEnabled}
            onFiles={props.onFiles}
            onImportUrl={props.onImportUrl}
            onPause={props.onPauseUpload}
            onResume={props.onResumeUpload}
            onCancel={props.onCancelUpload}
            onRetry={props.onRetryUpload}
          />

          {props.assets.length === 0 ? (
            // A brand new workspace lands here before it owns a single file,
            // so the library gets the drawn scene rather than an icon in a
            // dashed circle, for the same reason the calendar and the action
            // centre do: it is a first screen, not a failure.
            <EmptyState
              illustration={<EmptyScene scene="library" />}
              title={t.full('mediaLib.empty.title')}
              description={t.full('mediaLib.empty.body')}
              example={t.full('mediaLib.empty.example')}
            />
          ) : view === 'grid' ? (
            <MediaGrid assets={props.assets} onOpen={setOpenAssetId} />
          ) : (
            <MediaList assets={props.assets} timeZone={props.timeZone} onOpen={setOpenAssetId} />
          )}
        </>
      ) : null}

      <Sheet
        open={openAsset !== null}
        onOpenChange={(open) => {
          if (!open) {
            setOpenAssetId(null);
          }
        }}
      >
        <SheetContent side="inline-end" closeLabel={t.full('action.close')}>
          {openAsset ? (
            <>
              <SheetHeader>
                <SheetTitle>{openAsset.name ?? t.full('common.unavailable')}</SheetTitle>
              </SheetHeader>
              <SheetBody>
                <MediaDetail
                  asset={openAsset}
                  rules={props.rules}
                  timeZone={props.timeZone}
                  onSaveAltText={(input) => props.onSaveAltText(openAsset.id, input)}
                  onSaveRights={(declaration) => props.onSaveRights(openAsset.id, declaration)}
                />
              </SheetBody>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MediaGrid({
  assets,
  onOpen,
}: {
  readonly assets: readonly MediaAsset[];
  readonly onOpen: (id: string) => void;
}): ReactNode {
  const t = useTranslations();
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
      {assets.map((asset) => {
        const missingAlt = asset.kind !== 'video' && !asset.altTextWaived && !asset.altText;
        return (
          <li key={asset.id}>
            <button
              type="button"
              onClick={() => onOpen(asset.id)}
              className={cn(
                'border-border-default flex w-full flex-col gap-2 rounded-lg border',
                'bg-surface-raised p-2 text-start',
                'transition-[background-color,border-color,box-shadow,translate]',
                'duration-[var(--duration-fast)] ease-[var(--ease-out-back)] motion-reduce:transition-none',
                'hover:border-border-bold hover:shadow-hard-sm hover:-translate-y-0.5',
                'hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2',
                'focus-visible:outline-border-focus',
              )}
            >
              <span
                aria-hidden
                className="border-border-subtle bg-surface-sunken block aspect-[4/3] w-full rounded-md border"
              />
              <span className="text-body-sm text-text-primary truncate">
                {asset.name ?? t.full('common.unavailable')}
              </span>
              <span className="text-label text-text-tertiary flex flex-wrap gap-x-2 tabular-nums">
                <span>
                  {asset.width !== null && asset.height !== null
                    ? t.full('library.asset.dimensions', {
                        width: asset.width,
                        height: asset.height,
                      })
                    : asset.mimeType}
                </span>
              </span>
              <span
                className={cn('text-label', missingAlt ? 'text-warning-fg' : 'text-text-tertiary')}
              >
                {missingAlt
                  ? t.full('composer.media.altText.missing')
                  : asset.altTextWaived
                    ? t.full('mediaLib.alt.waive')
                    : (asset.altText ?? '')}
              </span>
              {asset.rightsDeclared ? null : (
                <span className="text-label text-destructive-fg">
                  {t.full('mediaLib.rights.undeclared')}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function MediaList({
  assets,
  timeZone,
  onOpen,
}: {
  readonly assets: readonly MediaAsset[];
  readonly timeZone: string;
  readonly onOpen: (id: string) => void;
}): ReactNode {
  const t = useTranslations();
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.full('mediaLib.column.file')}</TableHead>
            <TableHead>{t.full('mediaLib.column.type')}</TableHead>
            <TableHead>{t.full('mediaLib.column.size')}</TableHead>
            <TableHead>{t.full('mediaLib.column.altText')}</TableHead>
            <TableHead>{t.full('mediaLib.column.rights')}</TableHead>
            <TableHead>{t.full('mediaLib.column.added')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => {
            const missingAlt = asset.kind !== 'video' && !asset.altTextWaived && !asset.altText;
            return (
              <TableRow key={asset.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="max-w-full justify-start"
                    onClick={() => onOpen(asset.id)}
                  >
                    <span className="truncate">{asset.name ?? t.full('common.unavailable')}</span>
                  </Button>
                </TableCell>
                <TableCell>{asset.mimeType}</TableCell>
                <TableCell className="tabular-nums">{formatBytes(t.locale, asset.bytes)}</TableCell>
                <TableCell className={missingAlt ? 'text-warning-fg' : undefined}>
                  {missingAlt
                    ? t.full('composer.media.altText.missing')
                    : asset.altTextWaived
                      ? t.full('mediaLib.alt.waive')
                      : (asset.altText ?? '')}
                </TableCell>
                <TableCell className={asset.rightsDeclared ? undefined : 'text-destructive-fg'}>
                  {asset.rightsDeclared
                    ? t.full('mediaLib.rights.heading')
                    : t.full('mediaLib.rights.undeclared')}
                </TableCell>
                <TableCell className="tabular-nums">
                  {formatDateTime(t.locale, asset.createdAt, {
                    timeZone,
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
