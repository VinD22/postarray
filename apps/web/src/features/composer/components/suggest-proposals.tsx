'use client';

/**
 * The proposals a suggestion returned, each with "Use this" and "Discard".
 *
 * Every proposal is labelled as a suggestion and carries the model and prompt
 * version that wrote it. Model-written notes are shown as notes, never as a
 * statement from the product.
 */

import type { ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import type { SuggestionView } from './suggest-data';

type ReadySuggestion = Extract<SuggestionView, { status: 'ready' }>;

export interface SuggestProposalListProps {
  readonly result: ReadySuggestion;
  readonly discarded: readonly number[];
  readonly accepting: boolean;
  readonly acceptError: string | null;
  readonly onUse: (index: number) => void;
  readonly onDiscard: (index: number) => void;
}

export function SuggestProposalList({
  result,
  discarded,
  accepting,
  acceptError,
  onUse,
  onDiscard,
}: SuggestProposalListProps): ReactNode {
  const t = useTranslations();
  const total = result.proposals.length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-body-sm text-text-secondary">
        {t.full('web.suggest.proposal.provenance', {
          model: result.provenance.model,
          promptVersion: result.provenance.promptVersion,
        })}
      </p>
      {result.uncertain && result.uncertaintyReason !== null ? (
        <Notice
          tone="warning"
          title={t.full('web.suggest.proposal.uncertain', { reason: result.uncertaintyReason })}
        />
      ) : null}
      <ol className="flex flex-col gap-3">
        {result.proposals.map((proposal, index) =>
          discarded.includes(index) ? null : (
            <li
              key={`${result.suggestionId}:${proposal.body}`}
              className="border-border-default flex flex-col gap-2 rounded-lg border p-3"
            >
              <p className="text-label text-text-tertiary">
                {t.full('web.suggest.proposal.label', { index: index + 1, total })}
              </p>
              <p className="text-body-md text-text-primary whitespace-pre-wrap">{proposal.body}</p>
              {proposal.note === null ? null : (
                <p className="text-body-sm text-text-secondary">{proposal.note}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  loading={accepting}
                  onClick={() => onUse(index)}
                >
                  {t.full('web.suggest.proposal.accept')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDiscard(index)}>
                  {t.full('web.suggest.proposal.discard')}
                </Button>
              </div>
            </li>
          ),
        )}
      </ol>
      {result.warnings.length > 0 ? (
        <section className="flex flex-col gap-1">
          <h3 className="text-body-sm text-text-primary font-semibold">
            {t.full('web.suggest.proposal.notes')}
          </h3>
          <ul className="text-body-sm text-text-secondary flex list-disc flex-col gap-1 ps-5">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {acceptError === null ? null : <Notice tone="warning" liveness="alert" title={acceptError} />}
    </div>
  );
}
