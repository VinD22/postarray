'use client';

import { useState, type ReactElement } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Notice } from '@relay/design-system/patterns';
import {
  Button,
  Field,
  RadioGroup,
  RadioGroupItem,
  Label,
  Textarea,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { useValueFormat } from '@/features/analytics/use-value-format';

import type { RuleRunPreview } from '../types';

/**
 * Running the rule against one event without letting it touch anything.
 *
 * The promise made in the first paragraph is the reason this exists: a test
 * evaluates the whole sentence and shows what it would do, and nothing leaves
 * Relay while it happens. That sentence is repeated in the result, because a
 * user who has just watched a list of actions scroll past needs to be told
 * again that none of them happened.
 */

export interface TestRunPanelProps {
  readonly result: RuleRunPreview | undefined;
  readonly running: boolean;
  readonly error: unknown;
  readonly onRun: (payload: string | undefined) => void;
}

export function TestRunPanel({ result, running, error, onRun }: TestRunPanelProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();
  const [mode, setMode] = useState<'last' | 'payload'>('last');
  const [payload, setPayload] = useState('');

  return (
    <section aria-labelledby="test-heading" className="flex flex-col gap-4">
      <div className="flex max-w-[70ch] flex-col gap-1">
        <h2 id="test-heading" className="text-title-sm text-text-primary">
          {t('automation.test.title')}
        </h2>
        <p className="text-body-md text-text-secondary">{t('automation.test.body')}</p>
      </div>

      <RadioGroup
        value={mode}
        onValueChange={(value) => setMode(value === 'payload' ? 'payload' : 'last')}
        className="flex flex-col gap-2"
      >
        <span className="flex items-center gap-2">
          <RadioGroupItem value="last" id="test-mode-last" />
          <Label htmlFor="test-mode-last">{t('automation.test.useLastEvent')}</Label>
        </span>
        <span className="flex items-center gap-2">
          <RadioGroupItem value="payload" id="test-mode-payload" />
          <Label htmlFor="test-mode-payload">{t('automation.test.usePayload')}</Label>
        </span>
      </RadioGroup>

      {mode === 'payload' ? (
        <Field label={t('automation.test.usePayload')}>
          {(control) => (
            <Textarea
              {...control}
              spellCheck={false}
              minRows={6}
              className="text-mono font-mono"
              value={payload}
              onChange={(event) => setPayload(event.target.value)}
            />
          )}
        </Field>
      ) : null}

      <Button
        variant="secondary"
        className="self-start"
        loading={running}
        loadingLabel={t('automation.test.running')}
        onClick={() => onRun(mode === 'payload' ? payload : undefined)}
      >
        {t('automation.test.run')}
      </Button>

      {error ? (
        <Notice
          tone="destructive"
          liveness="alert"
          title={t('automation.test.failed', {
            reason: error instanceof Error ? error.message : t('common.unknown'),
          })}
        />
      ) : null}

      {result ? (
        <div className="border-border-subtle flex flex-col gap-3 border-t pt-4">
          <h3 className="text-body-md text-text-primary font-medium">
            {t('automation.test.resultTitle')}
          </h3>
          <p className="text-body-sm text-text-tertiary">
            <time dateTime={result.triggeredAt} className="tabular-nums">
              {format.dateTime(result.triggeredAt)}
            </time>
            <span className="ps-2">{result.triggerSummary}</span>
          </p>

          <ol className="flex flex-col gap-1.5">
            {result.conditions.map((condition) => (
              <li
                key={condition.label}
                className="text-body-md text-text-secondary flex items-start gap-2"
              >
                {condition.passed ? (
                  <CheckCircle2
                    aria-hidden="true"
                    className="text-success-fg mt-0.5 size-4 shrink-0"
                  />
                ) : (
                  <XCircle aria-hidden="true" className="text-warning-fg mt-0.5 size-4 shrink-0" />
                )}
                <span>
                  {condition.passed
                    ? t('automation.test.conditionPassed', { condition: condition.label })
                    : t('automation.test.conditionFailed', { condition: condition.label })}
                </span>
              </li>
            ))}
            {result.actions.map((action) => (
              <li
                key={action.label}
                className="text-body-md text-text-secondary flex items-start gap-2"
              >
                {action.outcome === 'would_run' ? (
                  <CheckCircle2
                    aria-hidden="true"
                    className="text-success-fg mt-0.5 size-4 shrink-0"
                  />
                ) : (
                  <XCircle
                    aria-hidden="true"
                    className="text-text-tertiary mt-0.5 size-4 shrink-0"
                  />
                )}
                <span>
                  {action.outcome === 'would_run'
                    ? t('automation.test.actionSimulated', { action: action.label })
                    : t('automation.test.actionSkipped', {
                        action: action.label,
                        reason: action.reason ?? '',
                      })}
                </span>
              </li>
            ))}
          </ol>

          <Notice tone="success" title={t('automation.test.noExternalEffect')} />
        </div>
      ) : null}
    </section>
  );
}
