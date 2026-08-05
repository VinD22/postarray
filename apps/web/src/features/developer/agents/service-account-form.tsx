'use client';

import { useId, useState, type FormEvent, type ReactNode } from 'react';
import {
  Button,
  Checkbox,
  Field,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@relay/design-system/primitives';
import { DefinitionList, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import type { Scope } from '@relay/contracts';

import { SettingsPanel } from '../../settings/components/section.js';
import { fromLines } from '../../settings/lib/lines.js';
import type {
  ApprovalLevel,
  BrandRef,
  ConnectionSummaryView,
} from '../../settings/lib/view-models.js';
import { ScopePicker } from '../components/scope-picker.js';

const APPROVAL_LEVELS: readonly ApprovalLevel[] = [0, 1, 2, 3];

export interface ServiceAccountFormValue {
  readonly name: string;
  readonly purpose: string;
  readonly scopes: readonly Scope[];
  readonly brandIds: readonly string[];
  readonly connectionIds: readonly string[];
  readonly contentLocales: readonly string[];
  readonly allowedDomains: readonly string[];
  readonly maxPostsPerDay: number;
  readonly lookAheadDays: number;
  readonly quietHoursStart: string;
  readonly quietHoursEnd: string;
  readonly approvalLevel: ApprovalLevel;
  readonly expiresInDays: number | null;
}

export interface ServiceAccountFormProps {
  brands: readonly BrandRef[];
  connections: readonly ConnectionSummaryView[];
  contentLocales: readonly string[];
  timeZone: string;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (value: ServiceAccountFormValue) => void;
}

/**
 * Creating a service account.
 *
 * Four decisions in a fixed order: who it is, what it can reach, what it may
 * do at most, and whether a person is in the loop. The summary at the end
 * states the worst case in one sentence, because "at most 6 external
 * publications per day" is the fact a reviewer actually needs.
 */
export function ServiceAccountForm({
  brands,
  connections,
  contentLocales,
  timeZone,
  saving,
  onCancel,
  onSubmit,
}: ServiceAccountFormProps): ReactNode {
  const t = useTranslations();
  const formId = useId();

  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [scopes, setScopes] = useState<readonly Scope[]>(['accounts:read', 'drafts:read']);
  const [brandIds, setBrandIds] = useState<readonly string[]>([]);
  const [connectionIds, setConnectionIds] = useState<readonly string[]>([]);
  const [locales, setLocales] = useState<readonly string[]>([]);
  const [domains, setDomains] = useState('');
  const [maxPostsPerDay, setMaxPostsPerDay] = useState(6);
  const [lookAheadDays, setLookAheadDays] = useState(14);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('07:00');
  const [approvalLevel, setApprovalLevel] = useState<ApprovalLevel>(2);
  const [expiresInDays, setExpiresInDays] = useState<number | null>(90);
  const [nameError, setNameError] = useState<string | null>(null);

  function toggle<T>(list: readonly T[], value: T, checked: boolean): readonly T[] {
    return checked ? [...list, value] : list.filter((entry) => entry !== value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (name.trim().length === 0) {
      setNameError(t('validation.field.required'));
      return;
    }
    setNameError(null);
    onSubmit({
      name: name.trim(),
      purpose: purpose.trim(),
      scopes,
      brandIds,
      connectionIds,
      contentLocales: locales,
      allowedDomains: fromLines(domains),
      maxPostsPerDay,
      lookAheadDays,
      quietHoursStart: quietStart,
      quietHoursEnd: quietEnd,
      approvalLevel,
      expiresInDays,
    });
  }

  const selectedConnections = connections.filter((connection) =>
    connectionIds.includes(connection.id),
  );

  return (
    <form id={formId} className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <SettingsPanel
        title={t('developer.ui.agents.step.identity')}
        description={t('developer.ui.agents.description')}
      >
        <div className="flex flex-col gap-4">
          <Field label={t('developer.serviceAccount.name')} required error={nameError ?? undefined}>
            {(control) => (
              <Input {...control} value={name} onChange={(event) => setName(event.target.value)} />
            )}
          </Field>
          <Field
            label={t('developer.ui.agents.purpose')}
            description={t('developer.ui.agents.purposeHelp')}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={2}
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
              />
            )}
          </Field>
        </div>
      </SettingsPanel>

      <SettingsPanel
        title={t('developer.ui.agents.step.scope')}
        description={t('developer.ui.agents.scopeHelp')}
      >
        <div className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-1 border-0 p-0">
            <legend className="text-body-md text-text-primary pb-1 font-medium">
              {t('developer.serviceAccount.scopeBrands')}
            </legend>
            <ul className="flex flex-col sm:grid sm:grid-cols-2">
              {brands.map((brand) => (
                <li key={brand.id}>
                  <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                    <Checkbox
                      checked={brandIds.includes(brand.id)}
                      onCheckedChange={(checked) =>
                        setBrandIds(toggle(brandIds, brand.id, checked === true))
                      }
                    />
                    {brand.name}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="flex flex-col gap-1 border-0 p-0">
            <legend className="text-body-md text-text-primary pb-1 font-medium">
              {t('developer.serviceAccount.scopePlatforms')}
            </legend>
            <ul className="flex flex-col sm:grid sm:grid-cols-2">
              {connections.map((connection) => (
                <li key={connection.id}>
                  <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                    <Checkbox
                      checked={connectionIds.includes(connection.id)}
                      onCheckedChange={(checked) =>
                        setConnectionIds(toggle(connectionIds, connection.id, checked === true))
                      }
                    />
                    {connection.accountLabel}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="flex flex-col gap-1 border-0 p-0">
            <legend className="text-body-md text-text-primary pb-1 font-medium">
              {t('developer.serviceAccount.scopeLocales')}
            </legend>
            <ul className="flex flex-wrap gap-x-4">
              {contentLocales.map((locale) => (
                <li key={locale}>
                  <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                    <Checkbox
                      checked={locales.includes(locale)}
                      onCheckedChange={(checked) =>
                        setLocales(toggle(locales, locale, checked === true))
                      }
                    />
                    {locale}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <ScopePicker selected={scopes} onChange={setScopes} />
        </div>
      </SettingsPanel>

      <SettingsPanel
        title={t('developer.ui.agents.step.limits')}
        description={t('developer.ui.agents.limitsHelp')}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t('developer.serviceAccount.scopeCadence')}
            description={t('developer.ui.agents.cadenceHelp')}
          >
            {(control) => (
              <Input
                {...control}
                type="number"
                min={0}
                max={200}
                inputMode="numeric"
                value={maxPostsPerDay}
                onChange={(event) => setMaxPostsPerDay(Number(event.target.value))}
              />
            )}
          </Field>

          <Field
            label={t('developer.serviceAccount.scopeLookAhead')}
            description={t('developer.ui.agents.lookAheadHelp')}
          >
            {(control) => (
              <Input
                {...control}
                type="number"
                min={0}
                max={365}
                inputMode="numeric"
                value={lookAheadDays}
                onChange={(event) => setLookAheadDays(Number(event.target.value))}
              />
            )}
          </Field>

          <Field
            label={t('developer.ui.agents.quietHours')}
            description={t('developer.ui.agents.quietHoursHelp')}
          >
            {(control) => (
              <div className="flex items-center gap-2">
                <Input
                  id={control.id}
                  aria-describedby={control['aria-describedby']}
                  type="time"
                  value={quietStart}
                  onChange={(event) => setQuietStart(event.target.value)}
                />
                <Input
                  type="time"
                  aria-label={t('developer.serviceAccount.scopeHours')}
                  value={quietEnd}
                  onChange={(event) => setQuietEnd(event.target.value)}
                />
              </div>
            )}
          </Field>

          <Field
            label={t('developer.ui.agents.expiry')}
            description={t('developer.ui.agents.expiryHelp')}
          >
            {(control) => (
              <Select
                value={expiresInDays === null ? 'never' : String(expiresInDays)}
                onValueChange={(value) =>
                  setExpiresInDays(value === 'never' ? null : Number(value))
                }
              >
                <SelectTrigger id={control.id}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="90">90</SelectItem>
                  <SelectItem value="365">365</SelectItem>
                  <SelectItem value="never">{t('common.none')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </Field>

          <Field label={t('developer.serviceAccount.scopeDomains')} className="sm:col-span-2">
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={2}
                value={domains}
                onChange={(event) => setDomains(event.target.value)}
              />
            )}
          </Field>
        </div>
      </SettingsPanel>

      <SettingsPanel
        title={t('developer.serviceAccount.approvalLevel')}
        description={t('developer.bulkThreshold', { publications: 5, accounts: 3 })}
      >
        <RadioGroup
          value={String(approvalLevel)}
          onValueChange={(value) => setApprovalLevel(Number(value) as ApprovalLevel)}
          className="flex flex-col"
        >
          {APPROVAL_LEVELS.map((level) => (
            <label
              key={level}
              className="text-body-md text-text-primary flex min-h-11 items-start gap-2 py-2"
            >
              <RadioGroupItem className="mt-1" value={String(level)} />
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">{t(`developer.approvalLevel.${level}`)}</span>
                <span className="text-body-sm text-text-secondary max-w-[62ch]">
                  {t(`developer.approvalLevel.description.${level}`)}
                </span>
              </span>
            </label>
          ))}
        </RadioGroup>
      </SettingsPanel>

      <SettingsPanel title={t('developer.ui.agents.summaryTitle')}>
        <DefinitionList
          items={[
            {
              id: 'accounts',
              term: t('developer.ui.agents.summaryAccounts'),
              definition:
                selectedConnections.length === 0
                  ? t('common.none')
                  : selectedConnections.map((connection) => connection.accountLabel).join(', '),
            },
            {
              id: 'max',
              term: t('developer.serviceAccount.scopeCadence'),
              definition: t('developer.ui.agents.summaryMaxActions', {
                count: approvalLevel >= 2 ? maxPostsPerDay : 0,
              }),
            },
            {
              id: 'hours',
              term: t('developer.ui.agents.quietHours'),
              definition: `${quietStart} to ${quietEnd}`,
              hint: timeZone,
            },
            {
              id: 'approval',
              term: t('developer.ui.agents.summaryApproval'),
              definition: t(`developer.approvalLevel.description.${approvalLevel}`),
            },
          ]}
        />

        {approvalLevel === 3 || approvalLevel <= 1 ? (
          <Notice tone="neutral" title={t('developer.approvalLevel.description.3')} />
        ) : null}
      </SettingsPanel>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" variant="primary" loading={saving}>
          {t('developer.ui.agents.summaryCreate')}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t('action.cancel')}
        </Button>
      </div>
    </form>
  );
}
