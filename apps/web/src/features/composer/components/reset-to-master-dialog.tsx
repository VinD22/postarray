'use client';

/**
 * Reset to master, per field and per target, behind a confirmation that names
 * exactly what is discarded. There is no bulk silent reset anywhere.
 */

import { type ReactNode } from 'react';
import { ConfirmDialog } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';
import type { OverridableVariantField } from '@relay/contracts';

import { useComposer } from '../composer-context.js';

const FIELD_LABEL_KEY: Readonly<Record<OverridableVariantField, string>> = {
  body: 'composerWeb.override.field.body',
  contentKind: 'composerWeb.override.field.contentKind',
  locale: 'composerWeb.override.field.locale',
  mediaIds: 'composerWeb.override.field.mediaIds',
  links: 'composerWeb.override.field.links',
  signature: 'composerWeb.override.field.signature',
  threadItems: 'composerWeb.override.field.threadItems',
  schedule: 'composerWeb.override.field.schedule',
};

export function fieldLabel(
  t: ReturnType<typeof useTranslations>,
  field: OverridableVariantField,
): string {
  return t(FIELD_LABEL_KEY[field]);
}

export interface ResetToMasterDialogProps {
  readonly connectionId: string | null;
  /** `null` resets every overridden field on the target, still confirmed. */
  readonly field: OverridableVariantField | null;
  readonly onClose: () => void;
}

export function ResetToMasterDialog({
  connectionId,
  field,
  onClose,
}: ResetToMasterDialogProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const { bootstrap, dispatch, summaries } = useComposer();

  if (connectionId === null) {
    return null;
  }

  const account = bootstrap.accounts.find((entry) => entry.connectionId === connectionId);
  const summary = summaries.find((entry) => entry.connectionId === connectionId);
  if (!account) {
    return null;
  }

  const label = field === null ? null : fieldLabel(t, field);

  return (
    <ConfirmDialog
      open
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
      title={
        label === null
          ? t.full('composer.targets.resetConfirm.title')
          : t.full('composerWeb.override.resetFieldTitle', {
              field: label,
              account: account.displayName,
            })
      }
      description={
        label === null
          ? t.full('composer.targets.resetConfirm.body', { account: account.displayName })
          : t.full('composerWeb.override.resetFieldBody', {
              field: label,
              account: account.displayName,
            })
      }
      consequences={(summary?.overriddenFields ?? []).map((overridden) => ({
        id: overridden,
        text: fieldLabel(t, overridden),
      }))}
      confirmLabel={t.full('action.resetToMaster')}
      cancelLabel={t.full('action.cancel')}
      closeLabel={t.full('action.close')}
      onConfirm={() => {
        if (field === null) {
          dispatch({ type: 'variant/resetAll', connectionId });
        } else {
          dispatch({ type: 'variant/resetField', connectionId, field });
        }
        announce(t.full('a11y.announce.targetReset', { account: account.displayName }), 'polite');
        onClose();
      }}
    />
  );
}
