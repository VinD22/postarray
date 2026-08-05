'use client';

/**
 * The upload surface.
 *
 * Files can be dropped, but dropping is never the only way in: the same button
 * opens the file picker and the same list is fully keyboard operable. Progress
 * is announced politely, a failure assertively, and a rejected file states the
 * account and the limit rather than "unsupported file".
 */

import { useRef, useState, type ReactNode } from 'react';
import { Upload } from 'lucide-react';
import { Button, Progress } from '@relay/design-system/primitives';
import { OfflineBanner } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes } from '@relay/i18n';
import { cn } from '@relay/design-system/utils';

import { acceptedMimeTypes, lowestByteLimit, type AccountRule } from '../state/media-rules';
import type { UploadItem } from '../types';

export interface UploadPanelProps {
  readonly rules: readonly AccountRule[];
  readonly items: readonly UploadItem[];
  readonly online: boolean;
  readonly onFiles: (files: readonly File[]) => void;
  readonly onPause: (id: string) => void;
  readonly onResume: (id: string) => void;
  readonly onCancel: (id: string) => void;
  readonly onRetry: (id: string) => void;
}

export function UploadPanel({
  rules,
  items,
  online,
  onFiles,
  onPause,
  onResume,
  onCancel,
  onRetry,
}: UploadPanelProps): ReactNode {
  const t = useTranslations();
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const accept = acceptedMimeTypes(rules);
  const imageLimit = lowestByteLimit(rules, 'image');

  return (
    <section aria-labelledby="upload-heading" className="flex flex-col gap-3">
      <h2 id="upload-heading" className="text-title-sm text-text-primary">
        {t.full('mediaLib.upload.heading')}
      </h2>

      {online ? null : (
        <OfflineBanner
          title={t.full('composer.autosave.offline')}
          description={t.full('mediaLib.upload.offline')}
        />
      )}

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          onFiles([...event.dataTransfer.files]);
        }}
        className={cn(
          'flex flex-col items-start gap-2 rounded-lg border border-dashed px-4 py-5',
          'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
          dragging ? 'border-accent bg-accent-subtle' : 'border-border-default bg-surface-sunken',
        )}
      >
        <p className="text-body-sm text-text-secondary">{t.full('mediaLib.upload.dropHint')}</p>
        <Button
          variant="secondary"
          size="sm"
          iconStart={<Upload aria-hidden />}
          onClick={() => input.current?.click()}
        >
          {t.full('mediaLib.upload.browse')}
        </Button>
        <input
          ref={input}
          type="file"
          multiple
          accept={accept.join(',')}
          className="sr-only"
          aria-label={t.full('mediaLib.upload.browse')}
          onChange={(event) => {
            onFiles([...(event.target.files ?? [])]);
            event.target.value = '';
          }}
        />
        <p className="text-body-sm text-text-tertiary">
          {rules.length === 0
            ? t.full('mediaLib.upload.noTargets')
            : t.full('mediaLib.upload.checkedAgainst')}
        </p>
        {imageLimit === null ? null : (
          <p className="text-label text-text-tertiary tabular-nums">
            {t.full('composerWeb.limits.fileSize', {
              size: formatBytes(t.locale, imageLimit),
            })}
          </p>
        )}
        <p className="text-label text-text-tertiary">
          {t.full('composerWeb.limits.mimeTypes', { types: accept.join(', ') })}
        </p>
      </div>

      {items.length === 0 ? null : (
        <>
          <h3 className="text-label text-text-tertiary">
            {t.full('mediaLib.upload.queueHeading')}
          </h3>
          <ul className="flex flex-col">
            {items.map((item) => (
              <li
                key={item.id}
                className="border-border-subtle flex flex-col gap-1.5 border-b py-2.5 last:border-b-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-body-md text-text-primary min-w-0 truncate">
                    {item.name}
                  </span>
                  <span className="text-label text-text-tertiary shrink-0 tabular-nums">
                    {t.full('mediaLib.upload.progress', {
                      name: item.name,
                      percent: `${Math.round((item.sentBytes / Math.max(item.bytes, 1)) * 100)}%`,
                      size: formatBytes(t.locale, item.bytes),
                    })}
                  </span>
                </div>

                {item.status === 'uploading' || item.status === 'paused' ? (
                  <Progress
                    value={Math.round((item.sentBytes / Math.max(item.bytes, 1)) * 100)}
                    label={t.full('mediaLib.upload.progress', {
                      name: item.name,
                      percent: `${Math.round((item.sentBytes / Math.max(item.bytes, 1)) * 100)}%`,
                      size: formatBytes(t.locale, item.bytes),
                    })}
                    tone={item.status === 'paused' ? 'warning' : 'accent'}
                  />
                ) : null}

                {item.status === 'paused' ? (
                  <p className="text-body-sm text-text-secondary">
                    {t.full('mediaLib.upload.paused', {
                      sent: formatBytes(t.locale, item.sentBytes),
                      size: formatBytes(t.locale, item.bytes),
                    })}
                  </p>
                ) : null}

                {item.status === 'finalizing' ? (
                  <p className="text-body-sm text-text-secondary">
                    {t.full('mediaLib.upload.finalizing', { name: item.name })}
                  </p>
                ) : null}

                {item.status === 'done' ? (
                  <p className="text-body-sm text-success-fg">
                    {t.full('mediaLib.upload.done', { name: item.name })}
                  </p>
                ) : null}

                {item.reason ? (
                  <p className="text-body-sm text-destructive-fg">
                    {t(item.reason.key, {
                      ...item.reason.values,
                      ...(typeof item.reason.values.size === 'number'
                        ? { size: formatBytes(t.locale, item.reason.values.size) }
                        : {}),
                      ...(typeof item.reason.values.limit === 'number'
                        ? { limit: formatBytes(t.locale, item.reason.values.limit) }
                        : {}),
                    })}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {item.status === 'uploading' ? (
                    <Button variant="ghost" size="sm" onClick={() => onPause(item.id)}>
                      {t.full('mediaLib.upload.pause')}
                    </Button>
                  ) : null}
                  {item.status === 'paused' ? (
                    <Button variant="secondary" size="sm" onClick={() => onResume(item.id)}>
                      {t.full('mediaLib.upload.resume')}
                    </Button>
                  ) : null}
                  {item.status === 'failed' ? (
                    <Button variant="secondary" size="sm" onClick={() => onRetry(item.id)}>
                      {t.full('mediaLib.upload.retry')}
                    </Button>
                  ) : null}
                  {item.status === 'done' ? null : (
                    <Button variant="ghost" size="sm" onClick={() => onCancel(item.id)}>
                      {t.full('mediaLib.upload.cancel')}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
