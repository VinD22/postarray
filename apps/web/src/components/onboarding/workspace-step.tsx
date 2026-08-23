'use client';

import { useMemo, useState, type FormEvent } from 'react';

import { Notice } from '@relay/design-system/patterns';
import {
  Button,
  Field,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';

import { ApiError, api } from '@/lib/api';
import { useSession } from '@/lib/auth/session-context';
import { useFormatters, useLocalizedRouter, useTranslations } from '@/lib/i18n';

/**
 * A short, honest list of zones plus whatever the device reports.
 *
 * Not every IANA zone: a picker with six hundred entries is a worse experience
 * than eight familiar ones and a detected default, and the full list is
 * available later in Settings.
 */
const COMMON_TIME_ZONES = [
  'Europe/London',
  'Europe/Berlin',
  'Europe/Madrid',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
] as const;

/**
 * Step 3: name the workspace and choose the scheduling zone.
 *
 * The zone is stored with every schedule, which is why it is asked once, here,
 * and never inferred silently from the browser at publish time.
 *
 * Signup already creates a personal workspace, so this step renames that one
 * rather than creating a second. It used to call `workspaces.create`
 * unconditionally, which left every new account holding two workspaces before
 * it had a single connection, and put the person's projects in whichever of
 * them the session happened to select.
 *
 * There is no interface language control here. Language is a Settings choice
 * after the workspace exists, so onboarding does not duplicate that setting or
 * make a new account choose between two sources of truth.
 */
export function WorkspaceStep() {
  const t = useTranslations();
  const format = useFormatters();
  const router = useLocalizedRouter();
  const { workspace } = useSession();

  const detected = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  }, []);

  const zones = useMemo(() => {
    const set = new Set<string>([detected, ...COMMON_TIME_ZONES]);
    return [...set];
  }, [detected]);

  const [name, setName] = useState(workspace.name);
  const [timeZone, setTimeZone] = useState(detected);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      // The session always carries a workspace: signup creates one. Renaming it
      // is what this step is for. Creating a second one here is how an account
      // ends up with "Personal" and "Acme" side by side on day one.
      await api.workspaces.update(workspace.id, { name, ianaTimeZone: timeZone });
      try {
        await api.onboarding.complete({ step: 'workspace' });
      } catch {
        // Progress is derived from real rows too, so the next read still knows.
      }
      router.push('/onboarding/use-case');
    } catch (caught) {
      setPending(false);
      setError(
        ApiError.is(caught)
          ? t(caught.messageKey, caught.messageValues)
          : t('error.internal.message'),
      );
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-title-lg text-text-primary">{t('onboarding.workspace.title')}</h1>
        <p className="prose-measure text-body-md text-text-secondary">
          {t('onboarding.workspace.help')}
        </p>
      </div>

      {error === null ? null : <Notice tone="destructive" liveness="alert" title={error} />}

      <Field label={t('common.name')} required>
        {(control) => (
          <Input
            {...control}
            type="text"
            name="workspace-name"
            autoComplete="organization"
            placeholder={t('onboarding.workspace.namePlaceholder')}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        )}
      </Field>

      <Field
        label={t('onboarding.workspace.timeZone')}
        description={t('onboarding.workspace.timeZoneHelp')}
        required
      >
        {(control) => (
          <Select value={timeZone} onValueChange={setTimeZone} name="time-zone">
            <SelectTrigger id={control.id} aria-describedby={control['aria-describedby']}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {zones.map((zone) => (
                <SelectItem key={zone} value={zone}>
                  {format.timeZoneLabel(zone)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      <p className="text-body-sm text-text-tertiary">
        {t('onboarding.workspace.timeZoneDetected', { timeZone: detected })}
      </p>

      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={pending}
          loadingLabel={t('auth.submit.working')}
          disabled={name.trim().length === 0}
        >
          {t('action.continue')}
        </Button>
      </div>
    </form>
  );
}
