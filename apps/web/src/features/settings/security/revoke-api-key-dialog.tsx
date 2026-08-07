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
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import type { ApiKeyView } from '../lib/view-models';

export interface RevokeApiKeyDialogProps {
  readonly apiKey: ApiKeyView | null;
  readonly saving: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (input: { apiKeyId: string; password: string }) => void;
}

/** Password-confirmed revocation, because the edge requires a recent step-up. */
export function RevokeApiKeyDialog({
  apiKey,
  saving,
  onOpenChange,
  onSubmit,
}: RevokeApiKeyDialogProps): ReactNode {
  const t = useTranslations();
  const formId = useId();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (apiKey !== null) {
      setPassword('');
      setError(null);
    }
  }, [apiKey]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (apiKey === null) return;
    if (password.length === 0) {
      setError(t('settings.ui.security.apiKeyPasswordRequired'));
      return;
    }
    setError(null);
    onSubmit({ apiKeyId: apiKey.id, password });
  }

  return (
    <Dialog open={apiKey !== null} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('a11y.label.closeDialog')} size="sm">
        <DialogHeader>
          <DialogTitle>
            {t('settings.ui.security.apiKeyRevokeTitle', { name: apiKey?.name ?? '' })}
          </DialogTitle>
          <DialogDescription>{t('settings.ui.security.apiKeyRevokeBody')}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form id={formId} className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <Notice tone="warning" title={t('settings.ui.security.apiKeyRevokeConsequence')} />
            <Field
              label={t('settings.ui.security.apiKeyPassword')}
              required
              error={error ?? undefined}
            >
              {(control) => (
                <Input
                  {...control}
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              )}
            </Field>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" disabled={saving} onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button type="submit" form={formId} variant="destructive" loading={saving}>
            {t('action.revoke')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
