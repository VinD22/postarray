'use client';

import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Textarea,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

export interface WorkspaceDeletionDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly workspaceName: string;
  readonly saving: boolean;
  readonly onSubmit: (input: { confirmation: string; reason?: string }) => void;
}

/** Explicit owner confirmation. The workspace name is never prefilled. */
export function WorkspaceDeletionDialog({
  open,
  onOpenChange,
  workspaceName,
  saving,
  onSubmit,
}: WorkspaceDeletionDialogProps): ReactNode {
  const t = useTranslations();
  const formId = useId();
  const [confirmation, setConfirmation] = useState('');
  const [reason, setReason] = useState('');
  const [confirmationError, setConfirmationError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setConfirmation('');
      setReason('');
      setConfirmationError(null);
    }
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (confirmation !== workspaceName) {
      setConfirmationError(t('settings.ui.data.deleteRequestConfirmError'));
      return;
    }
    setConfirmationError(null);
    const trimmedReason = reason.trim();
    onSubmit({
      confirmation,
      ...(trimmedReason.length === 0 ? {} : { reason: trimmedReason }),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('a11y.label.closeDialog')} size="md">
        <DialogHeader>
          <DialogTitle>{t('settings.ui.data.deleteRequestDialogTitle')}</DialogTitle>
          <DialogDescription>{t('settings.ui.data.deleteRequestDialogBody')}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form id={formId} className="flex flex-col gap-5" onSubmit={submit} noValidate>
            <Notice
              tone="warning"
              title={t('settings.ui.data.deleteTitle')}
              description={t('settings.ui.data.deleteConsequence.media')}
            />
            <ul className="text-body-sm text-text-secondary m-0 flex list-disc flex-col gap-2 ps-5">
              <li>{t('settings.ui.data.deleteConsequence.jobs')}</li>
              <li>{t('settings.ui.data.deleteConsequence.connections')}</li>
              <li>{t('settings.ui.data.deleteConsequence.receipts')}</li>
              <li>{t('settings.ui.data.deleteConsequence.published')}</li>
            </ul>
            <Field
              label={t('settings.ui.data.deleteConfirmPhraseLabel')}
              description={workspaceName}
              required
              error={confirmationError ?? undefined}
            >
              {(control) => (
                <Input
                  {...control}
                  autoComplete="off"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                />
              )}
            </Field>
            <Field
              label={t('settings.ui.data.deleteRequestReasonLabel')}
              description={t('settings.ui.data.deleteRequestReasonHelp')}
            >
              {(control) => (
                <Textarea
                  {...control}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={3}
                />
              )}
            </Field>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" disabled={saving} onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={saving}>
            {t('settings.ui.data.deleteRequestSubmit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
