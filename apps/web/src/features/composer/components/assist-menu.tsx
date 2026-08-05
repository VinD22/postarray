'use client';

/**
 * Assist actions are verbs, in context, on the editor toolbar.
 *
 * There is no "AI" destination in this product and there is no image or video
 * generation action here or anywhere else. Every result is a diff the user
 * accepts or rejects; nothing is ever written over the text silently.
 *
 * When no AI gateway is configured the menu states that plainly and the rest of
 * the composer is untouched.
 */

import { useState, type ReactNode } from 'react';
import { Sparkle } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@relay/design-system/primitives';
import { DiffView, Notice, type DiffSegment } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context.js';
import { PROVIDER_LABEL } from './provider-identity.js';
import type { AssistAction, AssistProposal } from '../types.js';

export interface AssistMenuProps {
  /** `null` targets the master draft. */
  readonly scope: string | null;
  readonly currentText: string;
  /** Runs one assist verb. Rejecting leaves the draft untouched. */
  readonly runAssist: (
    action: AssistAction,
    scope: string | null,
    text: string,
  ) => Promise<AssistProposal>;
}

export function AssistMenu({ scope, currentText, runAssist }: AssistMenuProps): ReactNode {
  const t = useTranslations();
  const { bootstrap, setProposal } = useComposer();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const account = bootstrap.accounts.find((entry) => entry.connectionId === scope) ?? null;

  if (!bootstrap.assistConfigured) {
    return (
      <span className="text-body-sm text-text-tertiary">
        {t.full('composerWeb.assist.unavailableTitle')}
      </span>
    );
  }

  const run = (action: AssistAction): void => {
    setBusy(true);
    setFailed(false);
    runAssist(action, scope, currentText)
      .then((proposal) => setProposal(proposal))
      .catch(() => setFailed(true))
      .finally(() => setBusy(false));
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            loading={busy}
            loadingLabel={t.full('composer.ai.working')}
            iconStart={<Sparkle aria-hidden />}
          >
            {t.full('composer.ai.title')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t.full('composerWeb.assist.menuLabel')}</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => run('make_concise')}>
            {t.full('composer.ai.makeConcise')}
          </DropdownMenuItem>
          {account ? (
            <DropdownMenuItem onSelect={() => run('adapt_for_platform')}>
              {t.full('composer.ai.adaptForPlatform', {
                provider: PROVIDER_LABEL[account.provider],
              })}
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onSelect={() => run('transcreate')}>
            {t.full('composer.ai.transcreate', { language: 'ja' })}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => run('check_claims')}>
            {t.full('composer.ai.checkClaims')}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => run('write_alt_text')}>
            {t.full('composer.ai.writeAltText')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {failed ? (
        <span className="text-body-sm text-destructive-fg">
          {t.full('composerWeb.assist.failed')}
        </span>
      ) : null}
    </div>
  );
}

/** The accept or reject surface. Rendered inline, never as a blocking modal. */
export function AssistProposalPanel(): ReactNode {
  const t = useTranslations();
  const { bootstrap, proposal, setProposal, acceptProposal } = useComposer();

  if (!proposal) {
    return null;
  }

  const account =
    bootstrap.accounts.find((entry) => entry.connectionId === proposal.connectionId) ?? null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-label text-text-tertiary">
        {account
          ? t.full('composerWeb.assist.targetVariant', { account: account.displayName })
          : t.full('composerWeb.assist.targetMaster')}
      </p>

      <DiffView
        segments={diffSegments(proposal.before, proposal.after)}
        onAccept={acceptProposal}
        onReject={() => setProposal(null)}
        messages={{
          regionLabel: t.full('composerWeb.assist.regionLabel'),
          beforeLabel: t.full('composerWeb.assist.beforeLabel'),
          afterLabel: t.full('composerWeb.assist.afterLabel'),
          acceptLabel: t.full('action.acceptSuggestion'),
          rejectLabel: t.full('action.rejectSuggestion'),
          addedAnnotation: t.full('composerWeb.assist.added'),
          removedAnnotation: t.full('composerWeb.assist.removed'),
          provenance: t.full('composer.ai.diffHelp'),
        }}
      />

      {proposal.evidence.length > 0 ? (
        <details className="border-border-subtle rounded-md border px-3 py-2">
          <summary className="text-body-sm text-text-secondary cursor-pointer">
            {t.full('composerWeb.assist.evidence')}
          </summary>
          <ul className="mt-2 flex flex-col gap-2">
            {proposal.evidence.map((item) => (
              <li key={item.id} className="flex flex-col gap-0.5">
                <span className="text-body-sm text-text-primary">
                  {t.full('composerWeb.assist.claimChecked', { claim: item.claim })}
                </span>
                {item.verified && item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    className="text-body-sm text-text-accent break-all underline"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {item.sourceUrl}
                  </a>
                ) : (
                  <span className="text-body-sm text-warning-fg">
                    {t.full('composerWeb.assist.claimUnverified')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <Notice tone="info" title={t.full('composerWeb.assist.noMediaGeneration')} />
    </div>
  );
}

/**
 * A word level diff. Small and deterministic on purpose: the composer must not
 * pull a diff library into the editor's critical path.
 */
export function diffSegments(before: string, after: string): DiffSegment[] {
  const left = before.split(/(\s+)/);
  const right = after.split(/(\s+)/);
  const segments: DiffSegment[] = [];

  let start = 0;
  while (start < left.length && start < right.length && left[start] === right[start]) {
    start += 1;
  }
  let endLeft = left.length;
  let endRight = right.length;
  while (endLeft > start && endRight > start && left[endLeft - 1] === right[endRight - 1]) {
    endLeft -= 1;
    endRight -= 1;
  }

  const prefix = left.slice(0, start).join('');
  const removed = left.slice(start, endLeft).join('');
  const added = right.slice(start, endRight).join('');
  const suffix = left.slice(endLeft).join('');

  if (prefix.length > 0) {
    segments.push({ id: 'prefix', operation: 'unchanged', text: prefix });
  }
  if (removed.length > 0) {
    segments.push({ id: 'removed', operation: 'removed', text: removed });
  }
  if (added.length > 0) {
    segments.push({ id: 'added', operation: 'added', text: added });
  }
  if (suffix.length > 0) {
    segments.push({ id: 'suffix', operation: 'unchanged', text: suffix });
  }
  return segments;
}
