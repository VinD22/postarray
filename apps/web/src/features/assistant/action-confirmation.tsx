'use client';

import type { ReactNode } from 'react';
import type { AgentConfirmationView } from '@relay/application';
import type { AssistantActionOutput } from '@relay/contracts';
import { Badge, Button } from '@relay/design-system/primitives';
import { DefinitionList, Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useFormatters } from '@/features/settings/lib/formatters';
import { readProposal } from './lib/proposal';

/**
 * The confirmation moment.
 *
 * This is the part of the screen everything else exists to reach. Before a
 * single thing is written, a person sees the four facts that decide whether
 * they want it: which accounts it reaches, the exact text, the exact time in
 * their workspace's own time zone, and when the approval stops being valid.
 * None of it is summarised, abbreviated or inferred, and a fact the API did not
 * give us is shown as unavailable rather than guessed at.
 *
 * Approving is one deliberate act on the one vermilion commit button on the
 * screen. The second choice is to walk away, and it says so in words: nothing
 * has been written, and declining writes nothing either.
 *
 * The vocabulary is the one the full approval screen at `/confirm/:id` already
 * uses, down to the same account rows, the same expiry and the same link out to
 * it, so a person who sees both never has to learn a second one.
 */
export function AssistantActionConfirmation({
  action,
  confirmation,
  busy,
  disabled,
  onApprove,
  onCancel,
  confirmHref,
}: {
  readonly action: AssistantActionOutput;
  /** The durable confirmation this action is waiting on, once it has loaded. */
  readonly confirmation: AgentConfirmationView | null;
  readonly busy: boolean;
  readonly disabled: boolean;
  readonly onApprove: () => void;
  readonly onCancel: () => void;
  readonly confirmHref: string | null;
}): ReactNode {
  const t = useTranslations();
  const formatters = useFormatters();
  const proposal = readProposal(action.proposal);
  const accounts = confirmation?.summary.accounts ?? null;

  const accountsValue =
    accounts === null ? (
      <span className="text-text-secondary">{t('assistantWeb.confirm.accountsUnavailable')}</span>
    ) : (
      <span className="flex flex-col gap-1">
        <span className="text-label text-text-tertiary">
          {t('assistantWeb.confirm.accountCount', { count: accounts.length })}
        </span>
        <ul className="flex flex-col gap-1">
          {accounts.map((account) => (
            <li key={account.connectionId} className="text-text-primary font-medium">
              {account.label}
            </li>
          ))}
        </ul>
      </span>
    );

  const textValue =
    proposal.body === null ? (
      <span className="text-text-secondary">{t('assistantWeb.confirm.textUnavailable')}</span>
    ) : (
      <span className="flex flex-col gap-1">
        {proposal.title === null ? null : (
          <span className="text-text-primary font-medium">{proposal.title}</span>
        )}
        <span className="text-text-primary whitespace-pre-wrap">{proposal.body}</span>
      </span>
    );

  const timeValue =
    proposal.instant === null || proposal.ianaTimeZone === null ? (
      <span className="text-text-secondary">{t('assistantWeb.confirm.timeUnavailable')}</span>
    ) : (
      <span className="flex flex-col gap-1">
        <span className="text-text-primary font-medium tabular-nums">
          {t('assistantWeb.confirm.timeValue', {
            dateTime: formatters.dateTime(proposal.instant),
            timeZone: proposal.ianaTimeZone,
          })}
        </span>
        <span className="text-label text-text-tertiary">{t('assistantWeb.confirm.zoneNote')}</span>
      </span>
    );

  const items = [
    {
      id: 'what',
      term: t('assistantWeb.confirm.title'),
      definition: t(`assistant.tool.${action.tool}`),
    },
    { id: 'accounts', term: t('assistantWeb.confirm.accountsLabel'), definition: accountsValue },
    { id: 'text', term: t('assistantWeb.confirm.textLabel'), definition: textValue },
    { id: 'time', term: t('assistantWeb.confirm.timeLabel'), definition: timeValue },
  ];

  if (proposal.note !== null) {
    items.push({
      id: 'note',
      term: t('assistantWeb.confirm.noteLabel'),
      definition: proposal.note,
    });
  }

  if (action.state === 'applied') {
    return (
      <Notice
        tone="success"
        liveness="status"
        title={t('assistantWeb.confirm.applied')}
        description={t(`assistant.state.applied`)}
      />
    );
  }

  if (action.state === 'proposal_only') {
    return (
      <section className="border-border-bold bg-surface-raised shadow-hard flex flex-col gap-4 rounded-lg border-2 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-title-sm text-text-primary font-display font-bold">
            {t('assistantWeb.confirm.proposalTitle')}
          </h3>
          <Badge tone="neutral">{t('assistantWeb.turn.suggestionBadge')}</Badge>
        </div>
        <DefinitionList items={items} layout="responsive" />
        {action.blockedReasonKey === null ? null : (
          <Notice tone="neutral" title={t(action.blockedReasonKey)} />
        )}
      </section>
    );
  }

  return (
    <section
      aria-labelledby="assistant-confirm-title"
      className="border-border-bold bg-surface-raised shadow-hard flex flex-col gap-4 rounded-lg border-2 p-5"
    >
      <div className="flex flex-col gap-1">
        <h3
          id="assistant-confirm-title"
          className="text-title-sm text-text-primary font-display font-bold"
        >
          {t('assistantWeb.confirm.title')}
        </h3>
        <p className="text-body-md text-text-secondary">{t('assistantWeb.confirm.body')}</p>
      </div>

      <DefinitionList items={items} layout="responsive" />

      {confirmation === null ? null : (
        <p className="text-body-sm text-text-tertiary">
          {t('assistantWeb.confirm.expires', {
            dateTime: formatters.dateTime(confirmation.expiresAt),
          })}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" loading={busy} disabled={disabled} onClick={onApprove}>
          {t('assistantWeb.confirm.approve')}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={busy}>
          {t('assistantWeb.confirm.cancel')}
        </Button>
        {confirmHref === null ? null : (
          <a
            className="text-body-sm text-text-accent underline underline-offset-4"
            href={confirmHref}
          >
            {t('assistantWeb.confirm.openConfirmation')}
          </a>
        )}
      </div>
    </section>
  );
}
