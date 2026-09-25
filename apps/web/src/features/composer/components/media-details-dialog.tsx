'use client';

/**
 * Alt text and rights for one attachment, edited where the post is written.
 *
 * The strip's edit button used to send people to the library, which left the
 * composer and its unsaved work behind to fix one sentence of alt text. The
 * forms are the library's own, so the rules (length limits per platform, the
 * consent check for people in a picture) are the same in both places.
 */

import { type ReactNode } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { AltTextForm } from '../../media/components/alt-text-form';
import { RightsForm } from '../../media/components/rights-form';
import type { AccountRule } from '../../media/state/media-rules';
import type { MediaAsset, RightsDeclaration } from '../../media/types';

export interface MediaDetailsDialogProps {
  readonly asset: MediaAsset | null;
  readonly rules: readonly AccountRule[];
  readonly onOpenChange: (open: boolean) => void;
  readonly onSaveAltText: (
    assetId: string,
    input: { altText: string | null; waived: boolean; waivedReason: string | null },
  ) => Promise<void>;
  readonly onSaveRights: (
    assetId: string,
    declaration: Omit<RightsDeclaration, 'declaredByName' | 'declaredAt'>,
  ) => Promise<void>;
}

export function MediaDetailsDialog({
  asset,
  rules,
  onOpenChange,
  onSaveAltText,
  onSaveRights,
}: MediaDetailsDialogProps): ReactNode {
  const t = useTranslations();
  const name = asset?.name ?? t.full('common.unavailable');

  return (
    <Dialog open={asset !== null} onOpenChange={onOpenChange}>
      <DialogContent size="lg" closeLabel={t.full('action.close')}>
        <DialogHeader>
          <DialogTitle>{t.full('composerWeb.media.detailsTitle', { name })}</DialogTitle>
          <DialogDescription>{t.full('composerWeb.media.detailsBody')}</DialogDescription>
        </DialogHeader>
        {asset === null ? null : (
          <DialogBody className="flex flex-col gap-6">
            {/* Keyed by asset so each file's form starts from its own values. */}
            <AltTextForm
              key={`alt-${asset.id}`}
              asset={asset}
              rules={rules}
              onSave={(input) => onSaveAltText(asset.id, input)}
            />
            <RightsForm
              key={`rights-${asset.id}`}
              asset={asset}
              onSave={(declaration) => onSaveRights(asset.id, declaration)}
            />
          </DialogBody>
        )}
      </DialogContent>
    </Dialog>
  );
}
