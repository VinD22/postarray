'use client';

import { useState, type ReactElement } from 'react';
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

import type { RuleRunOutcome, RuleRunPreview } from '../types';

const OUTCOME_KEY: Readonly<Record<RuleRunOutcome, string>> = {
  pending: 'automation.test.running',
  running: 'automation.test.running',
  completed: 'automation.runs.outcome.completed',
  skipped: 'automation.runs.outcome.skipped',
  failed: 'automation.runs.outcome.failed',
  test: 'automation.runs.outcome.testMode',
};

/**
 * Running the rule against one event without letting it touch anything.
 *
 * The promise made in the first paragraph is the reason this exists: a test
 * evaluates the whole sentence and shows what it would do, and nothing leaves
 * Post Array while it happens. That sentence is repeated in the result, because a
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
            reason:
              error instanceof SyntaxError || error instanceof TypeError
                ? t('automation.editor.apiInvalid', { reason: error.name })
                : t('common.unknown'),
          })}
        />
      ) : null}

      {result ? (
        <div className="border-border-subtle flex flex-col gap-3 border-t pt-4">
          <h3 className="text-body-md text-text-primary font-medium">
            {t('automation.test.resultTitle')}
          </h3>

          {/* A mono terminal card, the same "ink bar + three dots" header used
              for the CLI surface elsewhere in the loud system — this is a
              simulation transcript, and the terminal framing says so at a
              glance before anyone reads a line of it. */}
          <div className="border-border-bold overflow-hidden rounded-lg border-2">
            <div
              aria-hidden="true"
              className="bg-surface-inverted flex items-center gap-1.5 px-3 py-2.5"
            >
              <span className="bg-text-inverted/70 size-2 rounded-full" />
              <span className="bg-text-inverted/50 size-2 rounded-full" />
              <span className="bg-text-inverted/30 size-2 rounded-full" />
            </div>
            <div className="bg-surface-sunken flex flex-col gap-3 p-4">
              <p className="text-body-sm text-text-tertiary font-mono">
                <time dateTime={result.triggeredAt} className="tabular-nums">
                  {format.dateTime(result.triggeredAt)}
                </time>
                <span className="ps-2">{t(OUTCOME_KEY[result.outcome])}</span>
              </p>

              <p className="text-body-md text-text-secondary font-mono">
                {t('automation.runs.actionCount', { count: result.externalActionCount })}
              </p>
              {result.skippedReason ? (
                <p className="text-body-sm text-text-secondary font-mono">
                  {t('automation.runs.outcome.skipped')}
                </p>
              ) : null}
              {result.errorCode ? (
                <p className="text-body-sm text-destructive-fg font-mono">
                  {t('automation.runs.outcome.failed')}
                </p>
              ) : null}
            </div>
          </div>

          <Notice tone="success" title={t('automation.test.noExternalEffect')} />
        </div>
      ) : null}
    </section>
  );
}
