'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { Button, Checkbox, Field, Input, Textarea } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { SettingsPanel } from '../settings/components/section';
import { fromLines } from '../settings/lib/lines';

export interface IntakeValue {
  readonly productName: string;
  readonly siteUrl: string;
  readonly description: string;
  readonly category: string;
  readonly idealCustomer: string;
  readonly markets: readonly string[];
  readonly contentLocales: readonly string[];
  readonly objective: string;
  readonly conversionEvent: string;
  readonly proofAssets: readonly string[];
  readonly existingChannels: readonly string[];
  readonly weeklyCapacityHours: number;
  readonly competitors: readonly string[];
  readonly prohibitedClaims: readonly string[];
  readonly prohibitedTopics: readonly string[];
}

export interface IntakeFormProps {
  availableLocales: readonly string[];
  availableChannels: readonly { readonly id: string; readonly label: string }[];
  saving: boolean;
  onSubmit: (value: IntakeValue) => void;
}

/**
 * The intake.
 *
 * Nothing here is prefilled from a guess. An empty field becomes a marked gap
 * in the confirmation step rather than an inference, which is the whole
 * mechanism that stops an assumption becoming marketing copy later.
 */
export function IntakeForm({
  availableLocales,
  availableChannels,
  saving,
  onSubmit,
}: IntakeFormProps): ReactNode {
  const t = useTranslations();

  const [productName, setProductName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [idealCustomer, setIdealCustomer] = useState('');
  const [markets, setMarkets] = useState('');
  const [locales, setLocales] = useState<readonly string[]>([]);
  const [objective, setObjective] = useState('');
  const [conversionEvent, setConversionEvent] = useState('');
  const [proof, setProof] = useState('');
  const [noProof, setNoProof] = useState(false);
  const [channels, setChannels] = useState<readonly string[]>([]);
  const [capacity, setCapacity] = useState(4);
  const [competitors, setCompetitors] = useState('');
  const [prohibitedClaims, setProhibitedClaims] = useState('');
  const [prohibitedTopics, setProhibitedTopics] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const missingRequired =
    productName.trim().length === 0 ||
    description.trim().length === 0 ||
    objective.trim().length === 0 ||
    conversionEvent.trim().length === 0 ||
    locales.length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (missingRequired) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    onSubmit({
      productName: productName.trim(),
      siteUrl: siteUrl.trim(),
      description: description.trim(),
      category: category.trim(),
      idealCustomer: idealCustomer.trim(),
      markets: fromLines(markets),
      contentLocales: locales,
      objective: objective.trim(),
      conversionEvent: conversionEvent.trim(),
      proofAssets: noProof ? [] : fromLines(proof),
      existingChannels: channels,
      weeklyCapacityHours: capacity,
      competitors: fromLines(competitors),
      prohibitedClaims: fromLines(prohibitedClaims),
      prohibitedTopics: fromLines(prohibitedTopics),
    });
  }

  const requiredError = (value: string): string | undefined =>
    showErrors && value.trim().length === 0 ? t('validation.field.required') : undefined;

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <Notice tone="neutral" title={t('growth.ui.intake.help')} />

      <SettingsPanel
        title={t('growth.ui.intake.section.product')}
        description={t('growth.profile.intro')}
      >
        <div className="flex flex-col gap-4">
          <Field
            label={t('growth.profile.productUrl')}
            description={t('growth.ui.intake.productNameHelp')}
            required
            error={requiredError(productName)}
          >
            {(control) => (
              <Input
                {...control}
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
              />
            )}
          </Field>

          <Field
            label={t('growth.profile.productUrl')}
            description={t('growth.ui.intake.siteUrlHelp')}
          >
            {(control) => (
              <Input
                {...control}
                type="url"
                inputMode="url"
                value={siteUrl}
                onChange={(event) => setSiteUrl(event.target.value)}
              />
            )}
          </Field>

          <Field
            label={t('growth.profile.description')}
            description={t('growth.ui.intake.descriptionHelp')}
            required
            error={requiredError(description)}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            )}
          </Field>

          <Field label={t('growth.profile.category')}>
            {(control) => (
              <Input
                {...control}
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              />
            )}
          </Field>
        </div>
      </SettingsPanel>

      <SettingsPanel title={t('growth.ui.intake.section.audience')}>
        <div className="flex flex-col gap-4">
          <Field label={t('growth.profile.targetCustomer')}>
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={3}
                value={idealCustomer}
                onChange={(event) => setIdealCustomer(event.target.value)}
              />
            )}
          </Field>

          <Field
            label={t('growth.profile.markets')}
            description={t('growth.ui.intake.marketsHelp')}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={2}
                value={markets}
                onChange={(event) => setMarkets(event.target.value)}
              />
            )}
          </Field>

          <fieldset className="flex flex-col gap-1 border-0 p-0">
            <legend className="flex flex-col gap-0.5 pb-1">
              <span className="text-body-md text-text-primary font-medium">
                {t('common.language')}
              </span>
              <span className="text-body-sm text-text-secondary">
                {t('growth.ui.intake.localesHelp')}
              </span>
            </legend>
            <ul className="flex flex-wrap gap-x-4">
              {availableLocales.map((locale) => (
                <li key={locale}>
                  <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                    <Checkbox
                      checked={locales.includes(locale)}
                      onCheckedChange={(checked) =>
                        setLocales((current) =>
                          checked === true
                            ? [...current, locale]
                            : current.filter((entry) => entry !== locale),
                        )
                      }
                    />
                    {locale}
                  </label>
                </li>
              ))}
            </ul>
            {showErrors && locales.length === 0 ? (
              <p className="text-body-sm text-destructive-fg">{t('validation.field.required')}</p>
            ) : null}
          </fieldset>
        </div>
      </SettingsPanel>

      <SettingsPanel title={t('growth.ui.intake.section.objective')}>
        <div className="flex flex-col gap-4">
          <Field
            label={t('growth.profile.objective')}
            description={t('growth.ui.intake.objectiveHelp')}
            required
            error={requiredError(objective)}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={2}
                value={objective}
                onChange={(event) => setObjective(event.target.value)}
              />
            )}
          </Field>

          <Field
            label={t('growth.profile.conversionEvent')}
            description={t('growth.ui.intake.conversionHelp')}
            required
            error={requiredError(conversionEvent)}
          >
            {(control) => (
              <Input
                {...control}
                value={conversionEvent}
                onChange={(event) => setConversionEvent(event.target.value)}
              />
            )}
          </Field>

          <Field
            label={t('growth.profile.proofAssets')}
            description={t('growth.ui.intake.proofHelp')}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={3}
                disabled={noProof}
                value={proof}
                onChange={(event) => setProof(event.target.value)}
              />
            )}
          </Field>

          <label className="text-body-md text-text-primary flex min-h-11 items-start gap-2">
            <Checkbox
              className="mt-0.5"
              checked={noProof}
              onCheckedChange={(checked) => setNoProof(checked === true)}
            />
            <span className="flex flex-col">
              {t('growth.ui.intake.proofNone')}
              <span className="text-body-sm text-text-secondary">
                {t('growth.ui.intake.proofNoneEffect')}
              </span>
            </span>
          </label>
        </div>
      </SettingsPanel>

      <SettingsPanel title={t('growth.ui.intake.section.capacity')}>
        <div className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-1 border-0 p-0">
            <legend className="flex flex-col gap-0.5 pb-1">
              <span className="text-body-md text-text-primary font-medium">
                {t('growth.profile.existingChannels')}
              </span>
              <span className="text-body-sm text-text-secondary">
                {t('growth.ui.intake.channelsHelp')}
              </span>
            </legend>
            <ul className="flex flex-col sm:grid sm:grid-cols-2">
              {availableChannels.map((channel) => (
                <li key={channel.id}>
                  <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                    <Checkbox
                      checked={channels.includes(channel.id)}
                      onCheckedChange={(checked) =>
                        setChannels((current) =>
                          checked === true
                            ? [...current, channel.id]
                            : current.filter((entry) => entry !== channel.id),
                        )
                      }
                    />
                    {channel.label}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <Field
            label={t('growth.profile.weeklyCapacity')}
            description={t('growth.ui.intake.capacityHelp')}
          >
            {(control) => (
              <Input
                {...control}
                type="number"
                min={0}
                max={80}
                inputMode="numeric"
                className="max-w-32"
                value={capacity}
                onChange={(event) => setCapacity(Number(event.target.value))}
              />
            )}
          </Field>

          <Field
            label={t('growth.profile.competitors')}
            description={t('growth.ui.intake.competitorsHelp')}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={2}
                value={competitors}
                onChange={(event) => setCompetitors(event.target.value)}
              />
            )}
          </Field>
        </div>
      </SettingsPanel>

      <SettingsPanel title={t('growth.ui.intake.section.limits')}>
        <div className="flex flex-col gap-4">
          <Field
            label={t('growth.profile.prohibited')}
            description={t('growth.ui.intake.prohibitedClaimsHelp')}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={3}
                value={prohibitedClaims}
                onChange={(event) => setProhibitedClaims(event.target.value)}
              />
            )}
          </Field>
          <Field
            label={t('growth.profile.prohibited')}
            description={t('growth.ui.intake.prohibitedTopicsHelp')}
          >
            {(control) => (
              <Textarea
                {...control}
                autoGrow
                minRows={3}
                value={prohibitedTopics}
                onChange={(event) => setProhibitedTopics(event.target.value)}
              />
            )}
          </Field>
        </div>
      </SettingsPanel>

      {showErrors && missingRequired ? (
        <Notice tone="warning" liveness="alert" title={t('growth.ui.intake.requiredMissing')} />
      ) : null}

      <div>
        <Button type="submit" variant="primary" loading={saving}>
          {t('growth.ui.intake.submit')}
        </Button>
      </div>
    </form>
  );
}
