import { formatDuration, formatList } from '@relay/i18n';

import { actionSpec, conditionSpec, triggerSpec } from './catalog';
import type { RuleDraft, RuleEnd } from './types';

/**
 * A rule as one readable sentence.
 *
 * Used by the rules list, by the preflight summary and by the confirmation
 * dialog, so all three describe the rule in exactly the same words the editor
 * showed. A summary that paraphrases the sentence differently is how a user
 * turns on something other than what they built.
 *
 * Nothing here concatenates translated fragments into a translated sentence.
 * The clauses are ICU arguments of one message, and the list of conditions and
 * actions is built with `Intl.ListFormat` rather than by joining with a comma,
 * because "A, B and C" is not the same in every language.
 */

export type Translate = (key: string, values?: Readonly<Record<string, string | number>>) => string;

export interface SentenceLabels {
  /** Resolves a parameter value to something a person recognises. */
  readonly resolve: (parameterName: string, value: unknown) => string;
  readonly locale: string;
}

function parameterValues(
  parameters: Readonly<Record<string, unknown>>,
  labels: SentenceLabels,
  t: Translate,
): Readonly<Record<string, string>> {
  const values: Record<string, string> = {};
  for (const [name, value] of Object.entries(parameters)) {
    values[name] =
      value === null || value === undefined || value === ''
        ? t('automation.param.notSet')
        : labels.resolve(name, value);
  }
  return values;
}

export function triggerClause(draft: RuleDraft, t: Translate, labels: SentenceLabels): string {
  if (draft.trigger === null) {
    return t('automation.editor.chooseTrigger');
  }
  const spec = triggerSpec(draft.trigger.kind);
  return t(spec.sentenceKey, parameterValues(draft.trigger.parameters, labels, t));
}

export function conditionClauses(
  draft: RuleDraft,
  t: Translate,
  labels: SentenceLabels,
): readonly string[] {
  return draft.conditions.map((condition) =>
    t(conditionSpec(condition.kind).sentenceKey, parameterValues(condition.parameters, labels, t)),
  );
}

export function actionClauses(
  draft: RuleDraft,
  t: Translate,
  labels: SentenceLabels,
): readonly string[] {
  return draft.actions.map((action) =>
    t(actionSpec(action.kind).sentenceKey, parameterValues(action.parameters, labels, t)),
  );
}

export function delayClause(draft: RuleDraft, t: Translate, locale: string): string {
  if (draft.delaySeconds <= 0) {
    return t('automation.editor.delayNone');
  }
  return formatDuration(locale, draft.delaySeconds * 1000, { maxUnits: 2 });
}

export function endClause(
  end: RuleEnd,
  t: Translate,
  resolveDate: (iso: string) => string,
): string {
  switch (end.kind) {
    case 'date':
      return resolveDate(end.at);
    case 'count':
      return t('automation.editor.end.count', { count: end.runs });
    case 'manual':
    default:
      return t('automation.editor.end.manual');
  }
}

export interface RuleSentenceInput {
  readonly draft: RuleDraft;
  readonly t: Translate;
  readonly labels: SentenceLabels;
  readonly resolveDate: (iso: string) => string;
}

/** The whole rule in one sentence. */
export function ruleSentence({ draft, t, labels, resolveDate }: RuleSentenceInput): string {
  const conditions = conditionClauses(draft, t, labels);
  const actions = actionClauses(draft, t, labels);
  const shared = {
    trigger: triggerClause(draft, t, labels),
    actions:
      actions.length === 0
        ? t('automation.editor.noActions')
        : formatList(labels.locale, [...actions]),
    delay: delayClause(draft, t, labels.locale),
    endCondition: endClause(draft.end, t, resolveDate),
  };

  if (conditions.length === 0) {
    return t('automation.rules.sentenceNoConditions', shared);
  }
  return t('automation.rules.sentence', {
    ...shared,
    conditions: formatList(labels.locale, [...conditions]),
  });
}
