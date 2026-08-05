'use client';

import { useId, useState, type ReactElement } from 'react';
import type { NormalizedMetricName } from '@relay/contracts';
import { Notice } from '@relay/design-system/patterns';
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { providerLabelKey } from '../labels';
import { RANKABLE_METRICS, metricLabelKey } from '../metrics';
import type { AccountRef } from '../types';

/**
 * Planning an experiment, before anything is published.
 *
 * The order of the fields is the argument: what you are testing, what you
 * expect, the one metric that answers it, the accounts, the window and the
 * minimum sample. Every one of those has to be fixed in advance, because an
 * experiment whose success metric or measurement window is chosen after the
 * numbers are in is not an experiment, it is a search for a flattering
 * comparison.
 */

export interface ExperimentDraft {
  readonly name: string;
  readonly hypothesis: string;
  readonly successMetric: NormalizedMetricName;
  readonly connectionIds: readonly string[];
  readonly variants: readonly { readonly label: string; readonly description: string }[];
  readonly measurementWindowDays: number;
  readonly minimumPostsPerVariant: number;
}

export interface ExperimentFormDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly accounts: readonly AccountRef[];
  readonly submitting: boolean;
  readonly onSubmit: (draft: ExperimentDraft) => void;
}

const EMPTY: ExperimentDraft = {
  name: '',
  hypothesis: '',
  successMetric: 'comments',
  connectionIds: [],
  variants: [
    { label: '', description: '' },
    { label: '', description: '' },
  ],
  measurementWindowDays: 3,
  minimumPostsPerVariant: 5,
};

export function ExperimentFormDialog({
  open,
  onOpenChange,
  accounts,
  submitting,
  onSubmit,
}: ExperimentFormDialogProps): ReactElement {
  const t = useTranslations();
  const [draft, setDraft] = useState<ExperimentDraft>(EMPTY);
  const formId = useId();

  const setVariant = (index: number, patch: Partial<ExperimentDraft['variants'][number]>): void =>
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, ...patch } : variant,
      ),
    }));

  const canSubmit =
    draft.name.trim().length > 0 &&
    draft.connectionIds.length > 0 &&
    draft.variants.every((variant) => variant.label.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" closeLabel={t('a11y.label.closeDialog')}>
        <DialogHeader>
          <DialogTitle>{t('analytics.experiment.new')}</DialogTitle>
          <DialogDescription>{t('analytics.experiment.tagBeforePublishing')}</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form
            id={formId}
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (canSubmit) {
                onSubmit(draft);
              }
            }}
          >
            <Field label={t('analytics.experiment.name')} required>
              {(control) => (
                <Input
                  {...control}
                  value={draft.name}
                  placeholder={t('analytics.experiment.namePlaceholder')}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
              )}
            </Field>

            <Field label={t('analytics.experiment.hypothesis')}>
              {(control) => (
                <Textarea
                  {...control}
                  autoGrow
                  minRows={2}
                  value={draft.hypothesis}
                  placeholder={t('analytics.experiment.hypothesisPlaceholder')}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, hypothesis: event.target.value }))
                  }
                />
              )}
            </Field>

            <Field
              label={t('analytics.experiment.successMetric')}
              description={t('analytics.rankMetric.help')}
              required
            >
              {(control) => (
                <Select
                  value={draft.successMetric}
                  onValueChange={(value) =>
                    setDraft((current) => ({
                      ...current,
                      successMetric: value as NormalizedMetricName,
                    }))
                  }
                >
                  <SelectTrigger id={control.id} aria-describedby={control['aria-describedby']}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RANKABLE_METRICS.map((metric) => (
                      <SelectItem key={metric} value={metric}>
                        {t(metricLabelKey(metric))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-label text-text-tertiary pb-1">
                {t('analytics.experiment.accounts')}
              </legend>
              {accounts.map((account) => {
                const id = `experiment-account-${account.connectionId}`;
                return (
                  <div key={account.connectionId} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={draft.connectionIds.includes(account.connectionId)}
                      onCheckedChange={() =>
                        setDraft((current) => ({
                          ...current,
                          connectionIds: current.connectionIds.includes(account.connectionId)
                            ? current.connectionIds.filter(
                                (value) => value !== account.connectionId,
                              )
                            : [...current.connectionIds, account.connectionId],
                        }))
                      }
                    />
                    <Label htmlFor={id}>
                      {account.displayName}
                      <span className="text-text-tertiary ps-1.5">
                        {t(providerLabelKey(account.provider))}
                      </span>
                    </Label>
                  </div>
                );
              })}
            </fieldset>

            <div className="flex flex-col gap-3">
              {draft.variants.map((variant, index) => (
                <div
                  key={`${variant.label}-${String(index)}`}
                  className="border-border-default flex flex-col gap-2 border-s-2 ps-3"
                >
                  <Field
                    label={t('analytics.experiment.variantLabel', { index: index + 1 })}
                    required
                  >
                    {(control) => (
                      <Input
                        {...control}
                        value={variant.label}
                        onChange={(event) => setVariant(index, { label: event.target.value })}
                      />
                    )}
                  </Field>
                  <Field label={t('analytics.experiment.variantDescription')}>
                    {(control) => (
                      <Input
                        {...control}
                        value={variant.description}
                        onChange={(event) => setVariant(index, { description: event.target.value })}
                      />
                    )}
                  </Field>
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="self-start"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    variants: [...current.variants, { label: '', description: '' }],
                  }))
                }
              >
                {t('analytics.experiment.addVariant')}
              </Button>
            </div>

            <Notice tone="neutral" title={t('analytics.experiment.windowHelp')} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={t('analytics.experiment.window')}
                description={t('analytics.experiment.windowDays', {
                  count: draft.measurementWindowDays,
                })}
                required
              >
                {(control) => (
                  <Input
                    {...control}
                    type="number"
                    min={1}
                    max={90}
                    inputMode="numeric"
                    value={draft.measurementWindowDays}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        measurementWindowDays: Number(event.target.value),
                      }))
                    }
                  />
                )}
              </Field>

              <Field
                label={t('analytics.experiment.minSample')}
                description={t('analytics.experiment.minSampleHelp')}
                required
              >
                {(control) => (
                  <Input
                    {...control}
                    type="number"
                    min={1}
                    max={200}
                    inputMode="numeric"
                    value={draft.minimumPostsPerVariant}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        minimumPostsPerVariant: Number(event.target.value),
                      }))
                    }
                  />
                )}
              </Field>
            </div>
          </form>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="primary"
            loading={submitting}
            disabled={!canSubmit}
          >
            {t('action.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
