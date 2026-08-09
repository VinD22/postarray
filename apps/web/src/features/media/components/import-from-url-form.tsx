'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { Link2 } from 'lucide-react';
import { Button, Field, Input } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

export type ImportUrlIssue = 'invalid' | 'scheme' | 'credentials';

export function inspectImportUrl(value: string): ImportUrlIssue | null {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return 'invalid';
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return 'scheme';
  }
  if (parsed.username.length > 0 || parsed.password.length > 0) {
    return 'credentials';
  }
  return null;
}

export interface ImportFromUrlFormProps {
  readonly enabled: boolean;
  readonly online: boolean;
  readonly onImport: (url: string) => Promise<void>;
}

export function ImportFromUrlForm({
  enabled,
  online,
  onImport,
}: ImportFromUrlFormProps): ReactNode {
  const t = useTranslations();
  const [url, setUrl] = useState('');
  const [issue, setIssue] = useState<ImportUrlIssue | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'succeeded' | 'failed'>('idle');

  const disabled = !enabled || !online;

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const trimmed = url.trim();
    const nextIssue = inspectImportUrl(trimmed);
    setIssue(nextIssue);
    if (nextIssue !== null) {
      setStatus('idle');
      return;
    }

    setStatus('submitting');
    try {
      await onImport(trimmed);
      setUrl('');
      setStatus('succeeded');
    } catch {
      setStatus('failed');
    }
  };

  const issueMessage =
    issue === null ? undefined : t.full(`mediaLib.import.issue.${issue}` as const);

  return (
    <form
      onSubmit={submit}
      className="border-border-strong bg-surface-raised flex h-full flex-col gap-3 rounded-lg border p-4"
    >
      <div className="flex items-start gap-3">
        <span className="border-border-subtle bg-surface-sunken text-text-secondary flex size-8 shrink-0 items-center justify-center rounded-md border">
          <Link2 aria-hidden className="size-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-title-sm text-text-primary">{t.full('library.importFromUrl')}</h3>
          <p className="text-body-sm text-text-secondary">{t.full('library.importFromUrlHelp')}</p>
        </div>
      </div>

      <Field label={t.full('mediaLib.import.urlLabel')} error={issueMessage} disabled={disabled}>
        {(control) => (
          <Input
            {...control}
            type="url"
            inputMode="url"
            autoComplete="url"
            value={url}
            placeholder={t.full('mediaLib.import.urlPlaceholder')}
            onChange={(event) => {
              setUrl(event.target.value);
              setIssue(null);
              if (status !== 'submitting') setStatus('idle');
            }}
          />
        )}
      </Field>

      {!enabled ? (
        <p className="text-body-sm text-text-tertiary">{t.full('mediaLib.import.readOnly')}</p>
      ) : !online ? (
        <p className="text-body-sm text-text-tertiary">{t.full('mediaLib.import.offline')}</p>
      ) : null}

      {status === 'succeeded' ? (
        <Notice
          tone="success"
          liveness="status"
          title={t.full('mediaLib.import.succeeded')}
          description={t.full('mediaLib.import.scanPending')}
        />
      ) : null}
      {status === 'failed' ? (
        <Notice
          tone="destructive"
          liveness="alert"
          title={t.full('mediaLib.import.failed')}
          description={t.full('mediaLib.import.failedHelp')}
        />
      ) : null}

      <div className="mt-auto flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={disabled || url.trim().length === 0}
          loading={status === 'submitting'}
          loadingLabel={t.full('mediaLib.import.importing')}
        >
          {t.full('action.import')}
        </Button>
      </div>
    </form>
  );
}
