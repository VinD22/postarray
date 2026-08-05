'use client';

import { useEffect, useRef, useState, type ReactElement } from 'react';
import { Notice } from '@relay/design-system/patterns';
import { Button, Field, Textarea } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import { parseRule, serializeRule } from '../rule-serialization';
import type { RuleDraft } from '../types';

/**
 * The rule as the API sees it.
 *
 * This is not a read only preview. It is the same rule in the representation
 * the REST API, the CLI and the MCP server exchange, and an advanced user can
 * edit it here and switch back to the sentence without losing anything, which
 * `rule-serialization.test.ts` guarantees.
 *
 * Edits are applied on a button press rather than on every keystroke. Applying
 * as you type would rewrite the sentence from half finished JSON and fight the
 * person editing it.
 */

export interface StructuredEditorProps {
  readonly draft: RuleDraft;
  readonly onApply: (draft: RuleDraft) => void;
}

export function StructuredEditor({ draft, onApply }: StructuredEditorProps): ReactElement {
  const t = useTranslations();
  const serialized = serializeRule(draft);
  const [source, setSource] = useState(serialized);
  const [reason, setReason] = useState<string | null>(null);
  const lastSerialized = useRef(serialized);

  /**
   * The sentence editor is the other author of this value. When it changes the
   * rule the JSON follows, but only if the user has no unapplied edits of their
   * own: overwriting somebody's half finished JSON because a clause changed
   * elsewhere would lose their work.
   */
  useEffect(() => {
    if (lastSerialized.current === serialized) {
      return;
    }
    setSource((current) => (current === lastSerialized.current ? serialized : current));
    lastSerialized.current = serialized;
  }, [serialized]);

  const dirty = source !== serialized;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body-md text-text-secondary max-w-[70ch]">
        {t('automation.editor.apiHelp')}
      </p>

      <Field
        label={t('automation.editor.view.api')}
        error={reason === null ? undefined : t('automation.editor.apiInvalid', { reason })}
      >
        {(control) => (
          <Textarea
            {...control}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            minRows={14}
            maxRows={40}
            className="text-mono font-mono"
            value={source}
            onChange={(event) => {
              setSource(event.target.value);
              setReason(null);
            }}
          />
        )}
      </Field>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          disabled={!dirty}
          onClick={() => {
            const result = parseRule(source);
            if (result.ok) {
              setReason(null);
              onApply(result.draft);
              return;
            }
            setReason(result.reason);
          }}
        >
          {t('automation.editor.apiApply')}
        </Button>
        {dirty ? (
          <Button variant="ghost" onClick={() => setSource(serialized)}>
            {t('action.undo')}
          </Button>
        ) : null}
      </div>

      {dirty ? <Notice tone="neutral" title={t('automation.editor.unsaved')} /> : null}
    </div>
  );
}
