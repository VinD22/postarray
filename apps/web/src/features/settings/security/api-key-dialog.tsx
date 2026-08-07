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
import type { Scope } from '@relay/contracts';

import { ScopePicker } from '@/features/developer/components/scope-picker';

export interface ApiKeyDialogProps {
  readonly open: boolean;
  readonly saving: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (input: { name: string; scopes: readonly Scope[]; password: string }) => void;
}

const DEFAULT_SCOPES: readonly Scope[] = ['accounts:read', 'drafts:read', 'analytics:read'];

/** Creates a personal, 90-day key with an explicit least-privilege scope set. */
export function ApiKeyDialog({
  open,
  saving,
  onOpenChange,
  onSubmit,
}: ApiKeyDialogProps): ReactNode {
  const t = useTranslations();
  const formId = useId();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [scopes, setScopes] = useState<readonly Scope[]>(DEFAULT_SCOPES);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setPassword('');
      setScopes(DEFAULT_SCOPES);
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
    if (scopes.length === 0) {
      setError(t('settings.ui.security.apiKeyScopeRequired'));
      return;
    }
    if (password.length === 0) {
      setError(t('settings.ui.security.apiKeyPasswordRequired'));
      return;
    }
    setError(null);
    onSubmit({ name: trimmed, scopes, password });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('a11y.label.closeDialog')} size="lg">
        <DialogHeader>
          <DialogTitle>{t('settings.ui.security.apiKeyCreate')}</DialogTitle>
          <DialogDescription>{t('settings.ui.security.apiKeyCreateBody')}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <form id={formId} className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <Field
              label={t('settings.ui.security.apiKeyName')}
              description={t('settings.ui.security.apiKeyExpiry')}
              required
              error={error ?? undefined}
            >
              {(control) => (
                <Input
                  {...control}
                  value={name}
                  autoComplete="off"
                  onChange={(event) => setName(event.target.value)}
                />
              )}
            </Field>
            <Field
              label={t('settings.ui.security.apiKeyPassword')}
              description={t('settings.ui.security.apiKeyPasswordHelp')}
              required
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
            <ScopePicker selected={scopes} onChange={setScopes} disabled={saving} />
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" disabled={saving} onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={saving}>
            {t('settings.ui.security.apiKeyCreate')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
