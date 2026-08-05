'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Button,
  Checkbox,
  Code,
  Field,
  Input,
  RadioGroup,
  RadioGroupItem,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { WEBHOOK_EVENT_NAMES, type WebhookEventName } from '@relay/contracts';

import { SettingsPanel } from '../../settings/components/section.js';
import type { ConnectionSummaryView } from '../../settings/lib/view-models.js';
import { webhookEventGroups } from '../lib/webhook-events.js';

export interface WebhookFormValue {
  readonly url: string;
  readonly events: readonly WebhookEventName[];
  readonly connectionIds: readonly string[];
}

export interface WebhookFormProps {
  connections: readonly ConnectionSummaryView[];
  saving: boolean;
  onCancel: () => void;
  onSubmit: (value: WebhookFormValue) => void;
}

export function WebhookForm({
  connections,
  saving,
  onCancel,
  onSubmit,
}: WebhookFormProps): ReactNode {
  const t = useTranslations();
  const groups = webhookEventGroups();

  const [url, setUrl] = useState('');
  const [eventMode, setEventMode] = useState<'all' | 'selected'>('selected');
  const [events, setEvents] = useState<readonly WebhookEventName[]>([
    'post.published',
    'post.partially_published',
    'post.failed',
  ]);
  const [scopeMode, setScopeMode] = useState<'all' | 'selected'>('all');
  const [connectionIds, setConnectionIds] = useState<readonly string[]>([]);
  const [urlError, setUrlError] = useState<string | null>(null);

  function toggleEvent(event: WebhookEventName, checked: boolean): void {
    setEvents((current) =>
      checked ? [...current, event] : current.filter((entry) => entry !== event),
    );
  }

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>): void {
    formEvent.preventDefault();
    const trimmed = url.trim();
    if (!trimmed.startsWith('https://')) {
      setUrlError(t('validation.field.invalidUrl'));
      return;
    }
    setUrlError(null);
    onSubmit({
      url: trimmed,
      events: eventMode === 'all' ? [...WEBHOOK_EVENT_NAMES] : events,
      connectionIds: scopeMode === 'all' ? [] : connectionIds,
    });
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <SettingsPanel
        title={t('developer.ui.webhooks.create')}
        description={t('developer.ui.webhooks.description')}
      >
        <Field
          label={t('developer.ui.webhooks.url')}
          description={t('developer.ui.webhooks.urlHelp')}
          required
          error={urlError ?? undefined}
        >
          {(control) => (
            <Input
              {...control}
              type="url"
              inputMode="url"
              className="font-mono"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          )}
        </Field>
      </SettingsPanel>

      <SettingsPanel
        title={t('developer.ui.webhooks.eventsTitle')}
        description={t('developer.ui.webhooks.eventsHelp')}
      >
        <RadioGroup
          value={eventMode}
          onValueChange={(value) => setEventMode(value === 'all' ? 'all' : 'selected')}
          className="flex flex-col"
        >
          <label className="flex min-h-11 items-center gap-2 text-body-md text-text-primary">
            <RadioGroupItem value="all" />
            {t('developer.ui.webhooks.eventsAll')}
          </label>
          <label className="flex min-h-11 items-center gap-2 text-body-md text-text-primary">
            <RadioGroupItem value="selected" />
            {t('developer.ui.webhooks.eventsSelected')}
          </label>
        </RadioGroup>

        {eventMode === 'selected' ? (
          <div className="flex flex-col gap-4 pt-2">
            {groups.map((group) => (
              <fieldset key={group.id} className="flex flex-col gap-1 border-0 p-0">
                <legend className="pb-1 text-body-md font-medium text-text-primary">
                  {t(group.titleKey)}
                </legend>
                <ul className="flex flex-col sm:grid sm:grid-cols-2">
                  {group.events.map((event) => (
                    <li key={event}>
                      <label className="flex min-h-11 items-center gap-2 text-body-md">
                        <Checkbox
                          checked={events.includes(event)}
                          onCheckedChange={(checked) => toggleEvent(event, checked === true)}
                        />
                        <Code>{event}</Code>
                      </label>
                    </li>
                  ))}
                </ul>
              </fieldset>
            ))}
            <p className="text-body-sm text-text-tertiary">
              {t('developer.ui.webhooks.eventsCount', { count: events.length })}
            </p>
          </div>
        ) : null}
      </SettingsPanel>

      <SettingsPanel title={t('developer.ui.webhooks.scopeTitle')}>
        <RadioGroup
          value={scopeMode}
          onValueChange={(value) => setScopeMode(value === 'all' ? 'all' : 'selected')}
          className="flex flex-col"
        >
          <label className="flex min-h-11 items-center gap-2 text-body-md text-text-primary">
            <RadioGroupItem value="all" />
            {t('developer.ui.webhooks.scopeAll')}
          </label>
          <label className="flex min-h-11 items-center gap-2 text-body-md text-text-primary">
            <RadioGroupItem value="selected" />
            {t('developer.ui.webhooks.scopeSelected')}
          </label>
        </RadioGroup>

        {scopeMode === 'selected' ? (
          <ul className="flex flex-col ps-6 sm:grid sm:grid-cols-2">
            {connections.map((connection) => (
              <li key={connection.id}>
                <label className="flex min-h-11 items-center gap-2 text-body-md text-text-primary">
                  <Checkbox
                    checked={connectionIds.includes(connection.id)}
                    onCheckedChange={(checked) =>
                      setConnectionIds((current) =>
                        checked === true
                          ? [...current, connection.id]
                          : current.filter((id) => id !== connection.id),
                      )
                    }
                  />
                  {connection.accountLabel}
                </label>
              </li>
            ))}
          </ul>
        ) : null}
      </SettingsPanel>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="submit"
          variant="primary"
          loading={saving}
          disabled={eventMode === 'selected' && events.length === 0}
        >
          {t('developer.ui.webhooks.create')}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t('action.cancel')}
        </Button>
      </div>
    </form>
  );
}
