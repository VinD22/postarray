'use client';

/**
 * Choosing media from inside the composer.
 *
 * The dialog says whether the files are going to the master draft or to one
 * target only, because that is the difference between changing every account
 * and changing one. Files are checked against the accounts in play as they are
 * selected, not after the draft is saved.
 */

import { useState, type ReactNode } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@relay/design-system/primitives';
import { EmptyState } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes } from '@relay/i18n';

import type { UploadTransport } from '../hooks/use-upload-queue';
import { checkFile, type AccountRule } from '../state/media-rules';
import type { MediaAsset } from '../types';
import { MediaPolicyNotice } from './media-policy-notice';
import { UploadDropZone } from './upload-drop-zone';

export interface MediaPickerDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly assets: readonly MediaAsset[];
  readonly rules: readonly AccountRule[];
  /** The account name when picking for one target, null for the master draft. */
  readonly targetLabel: string | null;
  readonly onConfirm: (mediaIds: readonly string[]) => void;
  /**
   * When present the dialog can upload as well as pick, so attaching a photo
   * to a post never means leaving the composer for the library. Absent in read
   * only surfaces such as demo mode.
   */
  readonly transport?: UploadTransport;
  /**
   * Called after a file has been committed, so the caller can reload the asset
   * list. The uploaded id is already selected by the time this runs.
   */
  readonly onUploaded?: (mediaId: string) => void;
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  assets,
  rules,
  targetLabel,
  onConfirm,
  transport,
  onUploaded,
}: MediaPickerDialogProps): ReactNode {
  const t = useTranslations();
  const [selected, setSelected] = useState<readonly string[]>([]);

  const toggle = (id: string): void => {
    setSelected((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" closeLabel={t.full('action.close')}>
        <DialogHeader>
          <DialogTitle>{t.full('mediaLib.picker.title')}</DialogTitle>
          <DialogDescription>
            {targetLabel === null
              ? t.full('mediaLib.picker.forMaster')
              : t.full('mediaLib.picker.forVariant', { account: targetLabel })}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <p className="text-body-sm text-text-tertiary mb-3">
            {t.full('mediaLib.picker.description')}
          </p>

          <div className="mb-3">
            <MediaPolicyNotice rules={rules} />
          </div>

          {transport === undefined ? null : (
            <div className="mb-4">
              <UploadDropZone
                rules={rules}
                transport={transport}
                onUploaded={(mediaId) => {
                  // A file the user just uploaded on purpose is the file they
                  // want, so it arrives already selected.
                  setSelected((current) =>
                    current.includes(mediaId) ? current : [...current, mediaId],
                  );
                  onUploaded?.(mediaId);
                }}
              />
            </div>
          )}

          {assets.length === 0 ? (
            <EmptyState
              compact
              title={t.full('mediaLib.empty.title')}
              description={t.full('mediaLib.empty.body')}
            />
          ) : (
            <ul className="flex flex-col">
              {assets.map((asset) => {
                const assetName = asset.name ?? t.full('common.unavailable');
                const verdict = checkFile(
                  {
                    name: assetName,
                    mimeType: asset.mimeType,
                    bytes: asset.bytes,
                    kind: asset.kind,
                    durationSeconds: asset.durationSeconds,
                  },
                  rules,
                );
                const checkboxId = `pick-${asset.id}`;
                return (
                  <li
                    key={asset.id}
                    className="border-border-subtle flex min-h-11 items-start gap-3 border-b py-2.5 last:border-b-0"
                  >
                    <Checkbox
                      id={checkboxId}
                      className="mt-1"
                      checked={selected.includes(asset.id)}
                      disabled={!verdict.usable}
                      onCheckedChange={() => toggle(asset.id)}
                    />
                    <label
                      htmlFor={checkboxId}
                      className="flex min-w-0 cursor-pointer flex-col gap-0.5"
                    >
                      <span className="text-body-md text-text-primary truncate">{assetName}</span>
                      <span className="text-label text-text-tertiary flex flex-wrap gap-x-3 tabular-nums">
                        <span>{asset.mimeType}</span>
                        <span>{formatBytes(t.locale, asset.bytes)}</span>
                      </span>
                      {verdict.acceptedBy.length > 0 ? (
                        <span className="text-label text-text-secondary">
                          {t.full('mediaLib.upload.acceptedBy', {
                            count: verdict.acceptedBy.length,
                          })}
                        </span>
                      ) : null}
                      {verdict.rejections.length > 0 ? (
                        <span className="text-label text-warning-fg">
                          {t.full('mediaLib.upload.rejectedBy', {
                            accounts: verdict.rejections
                              .map((rejection) => rejection.accountLabel)
                              .join(', '),
                          })}
                        </span>
                      ) : null}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t.full('action.cancel')}
          </Button>
          <Button
            variant="primary"
            disabled={selected.length === 0}
            onClick={() => {
              onConfirm(selected);
              setSelected([]);
              onOpenChange(false);
            }}
          >
            {t.full('mediaLib.picker.confirm', { count: selected.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
