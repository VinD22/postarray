'use client';

/**
 * A compact upload surface for places that are not the library page.
 *
 * Same queue, same validation and the same transport the library uses. It is
 * compact rather than different: dropping is never the only way in, the button
 * opens the native file picker, progress is real and a failure states the
 * reason the API gave along with the reference support needs.
 */

import { useMemo, useRef, useState, type ReactNode } from 'react';
import { Upload } from 'lucide-react';
import { Button, Progress } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes } from '@relay/i18n';
import { cn } from '@relay/design-system/utils';

import { useUploadQueue, type UploadTransport } from '../hooks/use-upload-queue';
import { acceptedMimeTypes, type AccountRule } from '../state/media-rules';

export interface UploadDropZoneProps {
  readonly rules: readonly AccountRule[];
  readonly transport: UploadTransport;
  /** Called with the stored media id once the upload is committed. */
  readonly onUploaded: (mediaId: string) => void;
}

export function UploadDropZone({ rules, transport, onUploaded }: UploadDropZoneProps): ReactNode {
  const t = useTranslations();
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const messages = useMemo(
    () => ({
      progress: (name: string, percent: string) =>
        t.full('mediaLib.upload.progress', { name, percent, size: '' }),
      complete: (name: string) => t.full('mediaLib.upload.done', { name }),
      failed: (name: string) => t.full('mediaLib.upload.failed', { name, reason: '' }),
    }),
    [t],
  );

  const queue = useUploadQueue({ rules, transport, messages, onUploaded });
  const accept = acceptedMimeTypes(rules);

  return (
    <section aria-labelledby="composer-upload-heading" className="flex flex-col gap-2">
      <h3 id="composer-upload-heading" className="text-label text-text-tertiary">
        {t.full('mediaLib.upload.heading')}
      </h3>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          queue.enqueue([...event.dataTransfer.files]);
        }}
        className={cn(
          'flex flex-col items-start gap-2 rounded-lg border-2 border-dashed px-4 py-3',
          'transition-[color,background-color,border-color] duration-[var(--duration-fast)]',
          'ease-[var(--ease-standard)] motion-reduce:transition-none',
          dragging ? 'border-accent bg-accent-subtle' : 'border-border-bold bg-surface-sunken',
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
            queue.enqueue([...(event.target.files ?? [])]);
            event.target.value = '';
          }}
        />
        <p className="text-label text-text-tertiary">
          {t.full('composerWeb.limits.mimeTypes', { types: accept.join(', ') })}
        </p>
      </div>

      {queue.items.length === 0 ? null : (
        <ul className="flex flex-col">
          {queue.items.map((item) => {
            const percent = Math.round((item.sentBytes / Math.max(item.bytes, 1)) * 100);
            const progressLabel = t.full('mediaLib.upload.progress', {
              name: item.name,
              percent: `${percent}%`,
              size: formatBytes(t.locale, item.bytes),
            });
            return (
              <li
                key={item.id}
                className="border-border-subtle flex flex-col gap-1 border-b py-2 last:border-b-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-body-sm text-text-primary min-w-0 truncate">
                    {item.name}
                  </span>
                  <span className="text-label text-text-tertiary shrink-0 tabular-nums">
                    {progressLabel}
                  </span>
                </div>

                {item.status === 'uploading' || item.status === 'paused' ? (
                  <Progress
                    value={percent}
                    label={progressLabel}
                    tone={item.status === 'paused' ? 'warning' : 'accent'}
                  />
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

                {item.errorReference === undefined ? null : (
                  <p className="text-label text-text-tertiary">
                    {t.full('error.reference', { correlationId: item.errorReference })}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {item.status === 'uploading' ? (
                    <Button variant="ghost" size="sm" onClick={() => queue.pause(item.id)}>
                      {t.full('mediaLib.upload.pause')}
                    </Button>
                  ) : null}
                  {item.status === 'paused' ? (
                    <Button variant="secondary" size="sm" onClick={() => queue.resume(item.id)}>
                      {t.full('mediaLib.upload.resume')}
                    </Button>
                  ) : null}
                  {item.status === 'failed' ? (
                    <Button variant="secondary" size="sm" onClick={() => queue.retry(item.id)}>
                      {t.full('mediaLib.upload.retry')}
                    </Button>
                  ) : null}
                  {item.status === 'done' ? null : (
                    <Button variant="ghost" size="sm" onClick={() => queue.cancel(item.id)}>
                      {t.full('mediaLib.upload.cancel')}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
