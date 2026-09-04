'use client';

/**
 * The media strip.
 *
 * Media either inherits from the master or is overridden for one target, and
 * the strip says which. Alt text, rights and the platform crop are edited here
 * rather than only in the library, because that is where the person composing
 * actually is.
 */

import { useState, type ReactNode } from 'react';
import { Crop, ImagePlus, Pencil, X } from 'lucide-react';
import { Button, IconButton } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes } from '@relay/i18n';
import { cn } from '@relay/design-system/utils';

import type { MediaAsset } from '../../media/types';
import { DerivativeDialog } from '../../media/components/derivative-dialog';
import { displayableMediaUrl } from '../previews/media-source';
import { useMediaReadUrls } from '../previews/use-media-read-urls';

/**
 * The attachment's own picture.
 *
 * This was a grey square for as long as there was no endpoint that returned a
 * URL a browser could read. There is one now, so a person picking between four
 * uploads can tell them apart by looking rather than by reading file names.
 *
 * A file with no picture to show keeps the grey square. That is the honest
 * answer, and it is the common one: a thumbnail derivative exists for very few
 * assets, and a video has no poster at all yet. Neither is an error worth
 * interrupting the strip for.
 */
function StripThumbnail({ asset }: { readonly asset: MediaAsset }): ReactNode {
  const { data } = useMediaReadUrls(asset.id);
  const url = displayableMediaUrl(asset.kind, data);

  if (url === null || !asset.storageAvailable) {
    return (
      <span
        aria-hidden
        className="border-border-subtle bg-surface-sunken size-10 shrink-0 rounded-md border"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- a signed, short lived URL from another origin; the optimiser cannot fetch it.
    <img
      src={url}
      alt={asset.altText ?? ''}
      loading="lazy"
      decoding="async"
      className="border-border-subtle size-10 shrink-0 rounded-md border object-cover"
    />
  );
}

export interface MediaStripProps {
  readonly assets: readonly MediaAsset[];
  readonly mediaIds: readonly string[];
  /** True when this scope is a target still following the master. */
  readonly inherited: boolean;
  readonly onPick: () => void;
  readonly onRemove: (mediaId: string) => void;
  readonly onEdit: (mediaId: string) => void;
  readonly limit: number;
  readonly disabled?: boolean;
  /**
   * Which stored version each attachment uses. A missing entry, or a null one,
   * means the original. The strip works without this: a person can still open
   * the editor and make versions, they simply are not chosen per target yet.
   */
  readonly derivativeIds?: Readonly<Record<string, string | null>>;
  readonly onSelectDerivative?: (mediaId: string, derivativeId: string | null) => void;
}

export function MediaStrip({
  assets,
  mediaIds,
  inherited,
  onPick,
  onRemove,
  onEdit,
  limit,
  disabled = false,
  derivativeIds,
  onSelectDerivative,
}: MediaStripProps): ReactNode {
  const t = useTranslations();
  // Which attachment's editor is open. One at a time: the dialog is modal and
  // two open editors would make "which file is this" a guess.
  const [editing, setEditing] = useState<string | null>(null);
  const files = mediaIds
    .map((id) => assets.find((asset) => asset.id === id))
    .filter((asset): asset is MediaAsset => asset !== undefined);

  return (
    <section aria-labelledby="composer-media-heading" className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="composer-media-heading" className="text-title-sm text-text-primary">
          {t.full('composer.media.title')}
        </h3>
        <span className="text-label text-text-tertiary">
          {inherited
            ? t.full('composer.media.inheritFromMaster')
            : t.full('composer.media.overridden')}
        </span>
      </div>

      {files.length === 0 ? (
        <p className="text-body-sm text-text-tertiary">{t.full('composer.media.dropHint')}</p>
      ) : (
        <ul className="flex flex-col">
          {files.map((asset) => {
            const missingAlt = asset.kind !== 'video' && !asset.altTextWaived && !asset.altText;
            const assetName = asset.name ?? t.full('common.unavailable');
            return (
              <li
                key={asset.id}
                className="border-border-subtle flex items-center gap-3 border-b py-2 last:border-b-0"
              >
                <StripThumbnail asset={asset} />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-body-md text-text-primary truncate">{assetName}</span>
                  <span className="text-label text-text-tertiary flex flex-wrap gap-x-3">
                    <span>
                      {asset.width !== null && asset.height !== null
                        ? t.full('library.asset.dimensions', {
                            width: asset.width,
                            height: asset.height,
                          })
                        : asset.mimeType}
                    </span>
                    <span className="tabular-nums">
                      {t.full('library.asset.size', {
                        size: formatBytes(t.locale, asset.bytes),
                      })}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'text-label',
                      missingAlt ? 'text-warning-fg' : 'text-text-tertiary',
                    )}
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
                </span>
                <span className="ms-auto flex shrink-0 items-center gap-0.5">
                  {asset.kind === 'image' ? (
                    <IconButton
                      variant="ghost"
                      size="sm"
                      label={t.full('mediaLib.derivative.openEditor', { name: assetName })}
                      icon={<Crop aria-hidden />}
                      disabled={disabled}
                      onClick={() => setEditing(asset.id)}
                    />
                  ) : null}
                  <IconButton
                    variant="ghost"
                    size="sm"
                    label={t.full('a11y.label.editAltText', { name: assetName })}
                    icon={<Pencil aria-hidden />}
                    onClick={() => onEdit(asset.id)}
                  />
                  <IconButton
                    variant="ghost"
                    size="sm"
                    label={t.full('a11y.label.removeMedia', { name: assetName })}
                    icon={<X aria-hidden />}
                    disabled={disabled}
                    onClick={() => onRemove(asset.id)}
                  />
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          iconStart={<ImagePlus aria-hidden />}
          disabled={disabled || files.length >= limit}
          onClick={onPick}
        >
          {t.full('library.upload')}
        </Button>
        <span className="text-body-sm text-text-tertiary">
          {t.full('composer.media.count', { count: files.length })}
        </span>
      </div>

      {files.map((asset) => (
        <DerivativeDialog
          key={`editor-${asset.id}`}
          open={editing === asset.id}
          onOpenChange={(next) => setEditing(next ? asset.id : null)}
          source={{
            id: asset.id,
            name: asset.name,
            mimeType: asset.mimeType,
            byteSize: asset.bytes,
            width: asset.width,
            height: asset.height,
          }}
          {...(derivativeIds === undefined
            ? {}
            : { selectedDerivativeId: derivativeIds[asset.id] ?? null })}
          {...(onSelectDerivative === undefined
            ? {}
            : {
                onSelectDerivative: (derivativeId: string | null) =>
                  onSelectDerivative(asset.id, derivativeId),
              })}
        />
      ))}
    </section>
  );
}
