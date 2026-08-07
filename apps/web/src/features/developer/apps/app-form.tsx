'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Button,
  Field,
  IconButton,
  Input,
  RadioGroup,
  RadioGroupItem,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { Scope } from '@relay/contracts';
import { Plus, X } from 'lucide-react';

import { SettingsPanel } from '../../settings/components/section';
import { ScopePicker } from '../components/scope-picker';
import { ConsentPreview } from './consent-preview';
import { checkRedirectUri } from './redirect-uris';

export interface AppFormValue {
  readonly name: string;
  readonly clientType: 'public' | 'confidential';
  readonly homepageUrl: string;
  readonly privacyUrl: string;
  readonly termsUrl: string;
  readonly supportEmail: string;
  readonly redirectUris: readonly string[];
  readonly scopes: readonly Scope[];
}

export interface AppFormProps {
  developerName: string;
  workspaceName: string;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (value: AppFormValue) => void;
}

export function AppForm({
  developerName,
  workspaceName,
  saving,
  onCancel,
  onSubmit,
}: AppFormProps): ReactNode {
  const t = useTranslations();

  const [name, setName] = useState('');
  const [clientType, setClientType] = useState<'public' | 'confidential'>('confidential');
  const [homepageUrl, setHomepageUrl] = useState('');
  const [privacyUrl, setPrivacyUrl] = useState('');
  const [termsUrl, setTermsUrl] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [redirectUris, setRedirectUris] = useState<readonly string[]>(['']);
  const [scopes, setScopes] = useState<readonly Scope[]>(['accounts:read']);
  const [showErrors, setShowErrors] = useState(false);

  const redirectProblems = redirectUris.map((uri) =>
    uri.trim().length === 0 ? 'not-a-url' : checkRedirectUri(uri),
  );
  const nameInvalid = name.trim().length === 0;
  const linksInvalid = [homepageUrl, privacyUrl, termsUrl].some(
    (url) => checkRedirectUri(url, false) === 'not-a-url' || url.trim().length === 0,
  );
  const anyRedirectInvalid = redirectProblems.some((problem) => problem !== null);
  const supportEmailInvalid = !/^\S+@\S+\.\S+$/.test(supportEmail.trim());

  function setUri(index: number, value: string): void {
    setRedirectUris((current) =>
      current.map((uri, position) => (position === index ? value : uri)),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (nameInvalid || linksInvalid || supportEmailInvalid || anyRedirectInvalid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    onSubmit({
      name: name.trim(),
      clientType,
      homepageUrl: homepageUrl.trim(),
      privacyUrl: privacyUrl.trim(),
      termsUrl: termsUrl.trim(),
      supportEmail: supportEmail.trim(),
      redirectUris: redirectUris.map((uri) => uri.trim()).filter((uri) => uri.length > 0),
      scopes,
    });
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <SettingsPanel
        title={t('developer.apps.create')}
        description={t('developer.ui.apps.description')}
      >
        <div className="flex flex-col gap-4">
          <Field
            label={t('developer.apps.name')}
            required
            error={showErrors && nameInvalid ? t('validation.field.required') : undefined}
          >
            {(control) => (
              <Input {...control} value={name} onChange={(event) => setName(event.target.value)} />
            )}
          </Field>

          <fieldset className="flex flex-col gap-1 border-0 p-0">
            <legend className="flex flex-col gap-0.5 pb-1">
              <span className="text-body-md text-text-primary font-medium">
                {t('developer.apps.type.label')}
              </span>
              <span className="text-body-sm text-text-secondary max-w-[62ch]">
                {t('developer.ui.apps.typeHelp')}
              </span>
            </legend>
            <RadioGroup
              value={clientType}
              onValueChange={(value) =>
                setClientType(value === 'public' ? 'public' : 'confidential')
              }
              className="flex flex-col"
            >
              <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                <RadioGroupItem value="confidential" />
                {t('developer.apps.type.confidential')}
              </label>
              <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                <RadioGroupItem value="public" />
                {t('developer.apps.type.public')}
              </label>
            </RadioGroup>
            {clientType === 'public' ? (
              <Notice tone="neutral" title={t('developer.ui.apps.secretPublicClient')} />
            ) : null}
          </fieldset>
        </div>
      </SettingsPanel>

      <SettingsPanel
        title={t('developer.ui.apps.linksTitle')}
        description={t('developer.ui.apps.linksHelp')}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t('developer.apps.homepage')}
            required
            error={
              showErrors && homepageUrl.trim().length === 0
                ? t('validation.field.invalidUrl')
                : undefined
            }
          >
            {(control) => (
              <Input
                {...control}
                type="url"
                inputMode="url"
                value={homepageUrl}
                onChange={(event) => setHomepageUrl(event.target.value)}
              />
            )}
          </Field>
          <Field
            label={t('developer.apps.privacyUrl')}
            required
            error={
              showErrors && privacyUrl.trim().length === 0
                ? t('validation.field.invalidUrl')
                : undefined
            }
          >
            {(control) => (
              <Input
                {...control}
                type="url"
                inputMode="url"
                value={privacyUrl}
                onChange={(event) => setPrivacyUrl(event.target.value)}
              />
            )}
          </Field>
          <Field
            label={t('developer.apps.termsUrl')}
            required
            error={
              showErrors && termsUrl.trim().length === 0
                ? t('validation.field.invalidUrl')
                : undefined
            }
          >
            {(control) => (
              <Input
                {...control}
                type="url"
                inputMode="url"
                value={termsUrl}
                onChange={(event) => setTermsUrl(event.target.value)}
              />
            )}
          </Field>
          <Field
            label={t('auth.email.label')}
            required
            error={
              showErrors && supportEmailInvalid ? t('validation.field.invalidEmail') : undefined
            }
          >
            {(control) => (
              <Input
                {...control}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={supportEmail}
                onChange={(event) => setSupportEmail(event.target.value)}
              />
            )}
          </Field>
        </div>
      </SettingsPanel>

      <SettingsPanel
        title={t('developer.apps.redirectUris')}
        description={t('developer.apps.redirectUrisHelp')}
      >
        <ul className="flex flex-col gap-3">
          {redirectUris.map((uri, index) => {
            const problem = redirectProblems[index];
            return (
              <li
                key={uri === '' ? `blank-${String(index)}` : uri}
                className="flex items-start gap-2"
              >
                <Field
                  className="flex-1"
                  label={t('developer.apps.redirectUris')}
                  error={
                    showErrors && problem !== null && problem !== undefined
                      ? t('developer.ui.apps.redirectInvalid')
                      : undefined
                  }
                >
                  {(control) => (
                    <Input
                      {...control}
                      type="url"
                      inputMode="url"
                      className="font-mono"
                      value={uri}
                      onChange={(event) => setUri(index, event.target.value)}
                    />
                  )}
                </Field>
                <IconButton
                  className="mt-6"
                  variant="ghost"
                  label={t('developer.ui.apps.redirectRemove', { uri })}
                  icon={<X aria-hidden="true" className="size-4" />}
                  disabled={redirectUris.length === 1}
                  onClick={() =>
                    setRedirectUris((current) =>
                      current.filter((_, position) => position !== index),
                    )
                  }
                />
              </li>
            );
          })}
        </ul>
        <div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            iconStart={<Plus aria-hidden="true" className="size-4" />}
            onClick={() => setRedirectUris((current) => [...current, ''])}
          >
            {t('developer.ui.apps.redirectAdd')}
          </Button>
        </div>
      </SettingsPanel>

      <SettingsPanel
        title={t('developer.ui.apps.scopesTitle')}
        description={t('developer.ui.apps.scopesHelp')}
      >
        <ScopePicker selected={scopes} onChange={setScopes} />
      </SettingsPanel>

      <SettingsPanel
        title={t('developer.ui.apps.consentPreviewTitle')}
        description={t('developer.ui.apps.consentPreviewHelp')}
      >
        <ConsentPreview
          appName={name.trim().length === 0 ? t('developer.apps.name') : name.trim()}
          developerName={developerName}
          workspaceName={workspaceName}
          brandNames={[]}
          scopes={scopes}
          homepageUrl={homepageUrl}
          privacyUrl={privacyUrl}
          termsUrl={termsUrl}
        />
      </SettingsPanel>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" variant="primary" loading={saving}>
          {t('developer.apps.create')}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t('action.cancel')}
        </Button>
      </div>
    </form>
  );
}
