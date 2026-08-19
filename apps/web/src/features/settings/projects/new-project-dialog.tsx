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
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

export interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving: boolean;
  disabled?: boolean;
  onSubmit: (input: { name: string }) => void;
}

/** A project starts with a name. Everything else is edited in place afterwards. */
export function NewProjectDialog({
  open,
  onOpenChange,
  saving,
  disabled = false,
  onSubmit,
}: NewProjectDialogProps): ReactNode {
  const t = useTranslations();
  const formId = useId();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setError(null);
    }
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      setError(t('validation.field.required'));
      return;
    }
    onSubmit({ name: trimmed });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('a11y.label.closeDialog')} size="sm">
        <DialogHeader>
          <DialogTitle>{t('settings.projects.add')}</DialogTitle>
          <DialogDescription>{t('settings.ui.projects.description')}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form id={formId} onSubmit={handleSubmit} noValidate>
            <Field label={t('common.name')} required error={error ?? undefined}>
              {(control) => (
                <Input
                  {...control}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              )}
            </Field>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="primary"
            loading={saving}
            disabled={disabled}
          >
            {t('action.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
