'use client';

/**
 * The media strip.
 *
 * Media either inherits from the master or is overridden for one target, and
 * the strip says which. Alt text, rights and the platform crop are edited here
 * rather than only in the library, because that is where the person composing
 * actually is.
 */

import { type ReactNode } from 'react';
import { ImagePlus, Pencil, X } from 'lucide-react';
import { Button, IconButton } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes } from '@relay/i18n';
import { cn } from '@relay/design-system/utils';

import type { MediaAsset } from '../../media/types.js';

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
}: MediaStripProps): ReactNode {
  const t = useTranslations();
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
            return (
              <li
                key={asset.id}
                className="border-border-subtle flex items-center gap-3 border-b py-2 last:border-b-0"
              >
                <span
                  aria-hidden
                  className="border-border-subtle bg-surface-sunken size-10 shrink-0 rounded-md border"
                />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-body-md text-text-primary truncate">{asset.name}</span>
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
                  <IconButton
                    variant="ghost"
                    size="sm"
                    label={t.full('a11y.label.editAltText', { name: asset.name })}
                    icon={<Pencil aria-hidden />}
                    onClick={() => onEdit(asset.id)}
                  />
                  <IconButton
                    variant="ghost"
                    size="sm"
                    label={t.full('a11y.label.removeMedia', { name: asset.name })}
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
    </section>
  );
}
