'use client';

import { useRouter } from 'next/navigation';
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

import { ACTIVE_LOCALES } from '@relay/i18n';

import { ApiError, api, newIdempotencyKey } from '@/lib/api';
import { useFormatters, useTranslations } from '@/lib/i18n';

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
 * Step 3: name the workspace, choose the scheduling zone and the interface
 * language.
 *
 * The zone is stored with every schedule, which is why it is asked once, here,
 * and never inferred silently from the browser at publish time.
 */
export function WorkspaceStep() {
  const t = useTranslations();
  const format = useFormatters();
  const router = useRouter();

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

  const [name, setName] = useState('');
  const [timeZone, setTimeZone] = useState(detected);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api.workspaces.create({ name, timeZone, locale: 'en' }, newIdempotencyKey('workspace'));
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

      <Field
        label={t('onboarding.workspace.locale')}
        description={t('onboarding.workspace.localeNote')}
      >
        {(control) => (
          <Select value="en" disabled name="locale">
            <SelectTrigger id={control.id} aria-describedby={control['aria-describedby']}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {/* Endonyms, so a language always names itself in its own script. */}
              {ACTIVE_LOCALES.map((locale) => (
                <SelectItem key={locale.bcp47} value={locale.bcp47}>
                  {locale.endonym}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

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
