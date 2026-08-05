'use client';

import type { ReactElement, ReactNode } from 'react';
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import {
  Badge,
  Field,
  IconButton,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { useI18n, useTranslations } from '@relay/i18n/react';

import type {
  RuleActionKind,
  RuleConditionKind,
  RuleTriggerKind,
} from '@relay/contracts';
import { formatDuration } from '@relay/i18n';

import {
  CONDITIONS,
  TRIGGERS,
  actionSpec,
  conditionSpec,
  triggerSpec,
} from '../catalog';
import type { ActionSpec } from '../catalog';
import { actionClauses, conditionClauses, triggerClause } from '../rule-sentence';
import type { ParameterValue, RuleDraft } from '../types';
import { ItemPicker, type PickerOption } from './item-picker';
import { ParameterFields, type OptionResolver } from './parameter-fields';

/**
 * The rule editor.
 *
 * It is a sentence, laid out as five labelled clauses, because a rule is a
 * sentence and a node graph is a diagram of one. The clause labels sit in the
 * inline start column at every width and the clause content wraps under them on
 * a narrow screen, which keeps "When", "If", "Then", "After" and "Until" as the
 * reading spine rather than as decoration.
 *
 * Order matters in the actions clause, so each action carries move up and move
 * down buttons. There is no drag handle anywhere: reordering has to work from
 * the keyboard, and a keyboard alternative bolted onto a drag interaction is
 * always the second class one.
 */

export interface SentenceBuilderProps {
  readonly draft: RuleDraft;
  readonly onChange: (draft: RuleDraft) => void;
  /** Actions offered for the currently selected accounts. */
  readonly availableActions: readonly ActionSpec[];
  /** The sentence explaining any withheld actions, already translated. */
  readonly unavailableNote?: string | undefined;
  readonly options: OptionResolver;
  /** Resolves a parameter value to a readable label for the summary sentence. */
  readonly resolveLabel: (parameterName: string, value: unknown) => string;
}

const DELAY_PRESETS: readonly number[] = [0, 60, 120, 300, 600, 900, 1_800, 3_600, 7_200];

export function SentenceBuilder({
  draft,
  onChange,
  availableActions,
  unavailableNote,
  options,
  resolveLabel,
}: SentenceBuilderProps): ReactElement {
  const t = useTranslations();
  const { locale } = useI18n();

  const labels = { locale, resolve: resolveLabel };

  const setTriggerParameter = (name: string, value: ParameterValue): void => {
    if (!draft.trigger) return;
    onChange({
      ...draft,
      trigger: {
        ...draft.trigger,
        parameters: { ...draft.trigger.parameters, [name]: value },
      },
    });
  };

  const moveAction = (index: number, delta: number): void => {
    const next = [...draft.actions];
    const target = index + delta;
    const moving = next[index];
    const displaced = next[target];
    if (!moving || !displaced) return;
    next[index] = displaced;
    next[target] = moving;
    onChange({ ...draft, actions: next });
  };

  const triggerOptions: readonly PickerOption[] = TRIGGERS.map((spec) => ({
    id: spec.kind,
    label: t(spec.sentenceKey, blankParameters(spec.parameters.map((p) => p.name), t)),
    group: t(spec.groupKey),
  }));

  const conditionOptions: readonly PickerOption[] = CONDITIONS.map((spec) => ({
    id: spec.kind,
    label: t(spec.sentenceKey, blankParameters(spec.parameters.map((p) => p.name), t)),
    group: t(spec.groupKey),
  }));

  const actionOptions: readonly PickerOption[] = availableActions.map((spec) => ({
    id: spec.kind,
    label: t(spec.sentenceKey, blankParameters(spec.parameters.map((p) => p.name), t)),
    group: t(spec.groupKey),
    consequential: spec.consequential,
  }));

  const conditionText = conditionClauses(draft, t, labels);
  const actionText = actionClauses(draft, t, labels);

  return (
    <div className="flex flex-col gap-5">
      <Field label={t('automation.editor.name')} required>
        {(control) => (
          <Input
            {...control}
            value={draft.name}
            placeholder={t('automation.editor.namePlaceholder')}
            onChange={(event) => onChange({ ...draft, name: event.target.value })}
          />
        )}
      </Field>

      <p className="max-w-[70ch] text-body-md text-text-secondary">
        {t('automation.editor.readBack')}
      </p>

      <Clause label={t('automation.editor.when')}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-body-lg text-text-primary">
              {triggerClause(draft, t, labels)}
            </span>
            <ItemPicker
              title={t('automation.picker.triggerTitle')}
              triggerLabel={
                draft.trigger ? t('action.edit') : t('automation.editor.chooseTrigger')
              }
              triggerVariant="ghost"
              options={triggerOptions}
              onSelect={(kind) =>
                onChange({
                  ...draft,
                  trigger: { kind: kind as RuleTriggerKind, parameters: {} },
                })
              }
            />
          </div>
          {draft.trigger ? (
            <ParameterFields
              idPrefix="trigger"
              specs={triggerSpec(draft.trigger.kind).parameters}
              values={draft.trigger.parameters}
              onChange={setTriggerParameter}
              options={options}
            />
          ) : null}
        </div>
      </Clause>

      <Clause label={t('automation.editor.if')}>
        <div className="flex flex-col gap-3">
          {draft.conditions.length === 0 ? (
            <p className="text-body-md text-text-secondary">
              {t('automation.editor.noConditions')}
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {draft.conditions.map((condition, index) => (
                <li key={condition.id} className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-body-lg text-text-primary">
                      {conditionText[index]}
                    </span>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      label={t('automation.editor.removeCondition', {
                        label: conditionText[index] ?? '',
                      })}
                      icon={<X aria-hidden="true" />}
                      onClick={() =>
                        onChange({
                          ...draft,
                          conditions: draft.conditions.filter(
                            (entry) => entry.id !== condition.id,
                          ),
                        })
                      }
                    />
                  </div>
                  <ParameterFields
                    idPrefix={`condition-${condition.id}`}
                    specs={conditionSpec(condition.kind).parameters}
                    values={condition.parameters}
                    options={options}
                    onChange={(name, value) =>
                      onChange({
                        ...draft,
                        conditions: draft.conditions.map((entry) =>
                          entry.id === condition.id
                            ? {
                                ...entry,
                                parameters: { ...entry.parameters, [name]: value },
                              }
                            : entry,
                        ),
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          )}

          <ItemPicker
            title={t('automation.picker.conditionTitle')}
            triggerLabel={t('automation.editor.addCondition')}
            options={conditionOptions}
            onSelect={(kind) =>
              onChange({
                ...draft,
                conditions: [
                  ...draft.conditions,
                  {
                    id: `condition-${crypto.randomUUID()}`,
                    kind: kind as RuleConditionKind,
                    parameters: {},
                  },
                ],
              })
            }
          />
        </div>
      </Clause>

      <Clause label={t('automation.editor.then')}>
        <div className="flex flex-col gap-3">
          {draft.actions.length === 0 ? (
            <p className="text-body-md text-warning-fg">
              {t('automation.editor.noActions')}
            </p>
          ) : (
            <>
              <p className="text-body-sm text-text-tertiary">
                {t('automation.editor.actionOrder')}
              </p>
              <ol className="flex flex-col gap-3">
                {draft.actions.map((action, index) => {
                  const spec = actionSpec(action.kind);
                  const label = actionText[index] ?? '';
                  return (
                    <li key={action.id} className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-body-lg text-text-primary">{label}</span>
                          {spec.consequential ? (
                            <Badge tone="warning">
                              {t('automation.picker.consequential')}
                            </Badge>
                          ) : (
                            <Badge tone="neutral">
                              {t('automation.picker.internalOnly')}
                            </Badge>
                          )}
                        </span>
                        <span className="flex shrink-0 items-center">
                          <IconButton
                            size="sm"
                            variant="ghost"
                            disabled={index === 0}
                            label={t('automation.editor.moveActionUp', { label })}
                            icon={<ArrowUp aria-hidden="true" />}
                            onClick={() => moveAction(index, -1)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            disabled={index === draft.actions.length - 1}
                            label={t('automation.editor.moveActionDown', { label })}
                            icon={<ArrowDown aria-hidden="true" />}
                            onClick={() => moveAction(index, 1)}
                          />
                          <IconButton
                            size="sm"
                            variant="ghost"
                            label={t('automation.editor.removeAction', { label })}
                            icon={<X aria-hidden="true" />}
                            onClick={() =>
                              onChange({
                                ...draft,
                                actions: draft.actions.filter(
                                  (entry) => entry.id !== action.id,
                                ),
                              })
                            }
                          />
                        </span>
                      </div>
                      <ParameterFields
                        idPrefix={`action-${action.id}`}
                        specs={spec.parameters}
                        values={action.parameters}
                        options={options}
                        onChange={(name, value) =>
                          onChange({
                            ...draft,
                            actions: draft.actions.map((entry) =>
                              entry.id === action.id
                                ? {
                                    ...entry,
                                    parameters: { ...entry.parameters, [name]: value },
                                  }
                                : entry,
                            ),
                          })
                        }
                      />
                    </li>
                  );
                })}
              </ol>
            </>
          )}

          <ItemPicker
            title={t('automation.picker.actionTitle')}
            triggerLabel={t('automation.editor.addAction')}
            options={actionOptions}
            unavailableNote={unavailableNote}
            onSelect={(kind) =>
              onChange({
                ...draft,
                actions: [
                  ...draft.actions,
                  {
                    id: `action-${crypto.randomUUID()}`,
                    kind: kind as RuleActionKind,
                    parameters: {},
                  },
                ],
              })
            }
          />
        </div>
      </Clause>

      <Clause label={t('automation.editor.after')}>
        <Field label={t('automation.editor.delayLabel')}>
          {(control) => (
            <Select
              value={String(draft.delaySeconds)}
              onValueChange={(value) => onChange({ ...draft, delaySeconds: Number(value) })}
            >
              <SelectTrigger
                id={control.id}
                size="sm"
                className="min-w-44"
                aria-describedby={control['aria-describedby']}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DELAY_PRESETS.map((seconds) => (
                  <SelectItem key={seconds} value={String(seconds)}>
                    {seconds === 0
                      ? t('automation.editor.delayNone')
                      : t('automation.action.wait', {
                          duration: formatSeconds(locale, seconds),
                        })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      </Clause>

      <Clause label={t('automation.editor.until')}>
        <div className="flex flex-col gap-3">
          <Field label={t('automation.editor.endLabel')}>
            {(control) => (
              <Select
                value={draft.end.kind}
                onValueChange={(value) =>
                  onChange({
                    ...draft,
                    end:
                      value === 'date'
                        ? { kind: 'date', at: new Date().toISOString().slice(0, 10) }
                        : value === 'count'
                          ? { kind: 'count', runs: 10 }
                          : { kind: 'manual' },
                  })
                }
              >
                <SelectTrigger
                  id={control.id}
                  size="sm"
                  className="min-w-44"
                  aria-describedby={control['aria-describedby']}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">{t('automation.editor.end.manual')}</SelectItem>
                  <SelectItem value="date">{t('automation.editor.end.date')}</SelectItem>
                  <SelectItem value="count">
                    {t('automation.editor.end.count', { count: 10 })}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </Field>

          {draft.end.kind === 'date' ? (
            <Field label={t('automation.editor.end.dateValue')} required>
              {(control) => (
                <Input
                  {...control}
                  type="date"
                  value={draft.end.kind === 'date' ? draft.end.at.slice(0, 10) : ''}
                  onChange={(event) =>
                    onChange({ ...draft, end: { kind: 'date', at: event.target.value } })
                  }
                />
              )}
            </Field>
          ) : null}

          {draft.end.kind === 'count' ? (
            <Field label={t('automation.editor.end.countValue')} required>
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={draft.end.kind === 'count' ? draft.end.runs : ''}
                  onChange={(event) =>
                    onChange({
                      ...draft,
                      end: { kind: 'count', runs: Number(event.target.value) },
                    })
                  }
                />
              )}
            </Field>
          ) : null}
        </div>
      </Clause>
    </div>
  );
}

function Clause({
  label,
  children,
}: {
  readonly label: string;
  readonly children: ReactNode;
}): ReactElement {
  return (
    <section className="grid gap-2 border-t border-border-subtle pt-4 sm:grid-cols-[5rem_1fr] sm:gap-4">
      <h3 className="text-label text-text-tertiary sm:pt-1">{label}</h3>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** A picker label shows the clause with its parameters marked as not set. */
function blankParameters(
  names: readonly string[],
  t: (key: string) => string,
): Readonly<Record<string, string>> {
  const values: Record<string, string> = {};
  for (const name of names) {
    values[name] = t('automation.param.notSet');
  }
  return values;
}

function formatSeconds(locale: string, seconds: number): string {
  return formatDuration(locale, seconds * 1000, { maxUnits: 2 });
}
