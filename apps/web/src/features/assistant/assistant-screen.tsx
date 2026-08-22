'use client';

import { useCallback, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AgentConfirmationView } from '@relay/application';
import type { AssistantActionOutput, AssistantToolName } from '@relay/contracts';
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@relay/design-system/primitives';
import { ErrorState, Notice, PageHeader } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';

import { api } from '@/lib/api';
import { useOnlineStatus } from '@/lib/utils/use-online-status';
import { AsyncBoundary } from '@/features/settings/lib/async-boundary';
import { describeApiError } from '@/features/settings/lib/api-error';
import { projectsGateway } from '@/features/settings/lib/gateway';
import { settingsKey, useWorkspaceId } from '@/features/settings/lib/keys';
import { AssistantActionConfirmation } from './action-confirmation';
import { AssistantEmptyState } from './empty-state';
import { AssistantMessageList, type AssistantMessage } from './message-list';
import { AssistantOverBudget } from './over-budget-notice';
import { AssistantResultView } from './result-view';
import { isOverBudget } from './lib/over-budget';
import { applyAction, runTool, type AssistantResult, type ToolContext } from './lib/run-tool';

/** Radix will not take an empty string as a value, so "no post" needs a name. */
const NO_POST = 'none';

interface PendingAction {
  readonly tool: AssistantToolName;
  readonly action: AssistantActionOutput;
}

let messageCounter = 0;
function nextMessageId(prefix: string): string {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

/**
 * The assistant.
 *
 * Somebody who posts, talking in their own words to something that answers in
 * theirs. Three rules shape every part of it. Everything the assistant says is
 * labelled a suggestion, because that is all the contract allows it to be.
 * Nothing it proposes is written until a person reads the whole action and
 * approves it on the one vermilion button on the screen. And when it cannot do
 * something, it says which piece it is missing instead of guessing.
 *
 * A turn is one request and one response: the API does not stream, so the wait
 * is an honest in-progress line that also says nothing has changed while it
 * runs, rather than a fake typing effect.
 */
export function AssistantScreen(): ReactNode {
  const t = useTranslations();
  const section = t('assistantWeb.title');
  const online = useOnlineStatus();
  const { announce } = useAnnouncer();
  const workspaceId = useWorkspaceId();

  const projects = useQuery({
    queryKey: settingsKey(workspaceId, 'projects'),
    queryFn: () => projectsGateway.list(),
  });
  const drafts = useQuery({
    queryKey: settingsKey(workspaceId, 'assistant', 'drafts'),
    queryFn: () => api.content.list({ state: 'draft', limit: 20 }),
  });

  const [draftText, setDraftText] = useState('');
  const [contentItemId, setContentItemId] = useState<string>('');
  const [messages, setMessages] = useState<readonly AssistantMessage[]>([]);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [busy, setBusy] = useState(false);
  const [turnError, setTurnError] = useState<unknown>(null);

  const items = drafts.data?.data ?? [];
  const selected = items.find((item) => item.id === contentItemId) ?? null;
  const projectId = selected?.projectId ?? projects.data?.[0]?.id ?? '';

  const confirmationId = pending?.action.confirmationId ?? null;
  const confirmation = useQuery({
    queryKey: settingsKey(workspaceId, 'assistant', 'confirmation', confirmationId ?? 'none'),
    queryFn: () => api.agentConfirmations.get(confirmationId ?? ''),
    enabled: confirmationId !== null,
    retry: false,
  });

  const context = useMemo<ToolContext>(
    () => ({
      projectId,
      contentItemId: selected?.id ?? null,
      connectionId: selected?.targets[0]?.connectionId ?? null,
      message: draftText,
      now: new Date(),
    }),
    [projectId, selected, draftText],
  );

  const say = useCallback((message: AssistantMessage) => {
    setMessages((current) => [...current, message]);
  }, []);

  const showResult = useCallback(
    (text: string, result: AssistantResult, provenance: AssistantMessage['provenance']) => {
      if (result.kind === 'action') {
        setPending({ tool: result.data.tool, action: result.data });
      }
      say({
        id: nextMessageId('assistant'),
        author: 'assistant',
        text,
        provenance: provenance ?? null,
        body: result.kind === 'action' ? undefined : <AssistantResultView result={result} />,
      });
    },
    [say],
  );

  async function send(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const message = draftText.trim();
    if (message.length === 0 || projectId === '') {
      return;
    }

    say({ id: nextMessageId('person'), author: 'person', text: message });
    setDraftText('');
    setPending(null);
    setTurnError(null);
    setBusy(true);
    try {
      const routed = await api.assistant.turn({ projectId, message });
      const result = await runTool(routed.tool, { ...context, message });
      showResult(t(routed.messageKey), result, routed.provenance);
      announce(t('assistantWeb.turn.suggestionNote'));
    } catch (error) {
      setTurnError(error);
    } finally {
      setBusy(false);
    }
  }

  async function approve(): Promise<void> {
    const current = pending;
    const id = current?.action.confirmationId ?? null;
    if (current === null || id === null) {
      return;
    }
    setBusy(true);
    setTurnError(null);
    try {
      await api.agentConfirmations.approve(id, `assistant-approve-${id}`);
      const applied = await applyAction(current.tool, context, id);
      if (applied.kind === 'action') {
        setPending({ tool: applied.data.tool, action: applied.data });
        announce(t('assistantWeb.confirm.applied'));
      }
    } catch (error) {
      setTurnError(error);
    } finally {
      setBusy(false);
    }
  }

  function cancel(): void {
    setPending(null);
    say({
      id: nextMessageId('assistant'),
      author: 'assistant',
      text: t('assistantWeb.confirm.cancelled'),
      provenance: null,
    });
  }

  const described = turnError === null ? null : describeApiError(turnError);
  const confirmationView: AgentConfirmationView | null = confirmation.data ?? null;

  return (
    <>
      <PageHeader title={section} description={t('assistantWeb.subtitle')} />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:px-6">
        <AsyncBoundary
          section={section}
          isPending={projects.isPending || drafts.isPending}
          error={projects.error ?? drafts.error}
          onRetry={() => {
            void projects.refetch();
            void drafts.refetch();
          }}
          skeletonRows={4}
          skeletonColumns={1}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="assistant-subject">{t('assistantWeb.subject.label')}</Label>
            <Select
              value={contentItemId}
              onValueChange={(value) => setContentItemId(value === NO_POST ? '' : value)}
            >
              <SelectTrigger id="assistant-subject">
                <SelectValue placeholder={t('assistantWeb.subject.none')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_POST}>{t('assistantWeb.subject.none')}</SelectItem>
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.title.length > 0 ? item.title : t('assistantWeb.subject.untitled')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {messages.length === 0 && pending === null ? (
            <AssistantEmptyState onPrompt={(prompt) => setDraftText(prompt)} />
          ) : (
            <AssistantMessageList messages={messages} />
          )}

          {busy ? (
            <Notice
              tone="neutral"
              liveness="status"
              title={t('assistantWeb.turn.working')}
              description={t('assistantWeb.turn.workingNote')}
            />
          ) : null}

          {pending === null ? null : (
            <AssistantActionConfirmation
              action={pending.action}
              confirmation={confirmationView}
              busy={busy}
              disabled={!online || busy}
              onApprove={() => void approve()}
              onCancel={cancel}
              confirmHref={pending.action.confirmUrl}
            />
          )}

          {described !== null && isOverBudget(described) ? (
            <AssistantOverBudget resetAt={described.resetAt} />
          ) : null}

          {described !== null && !isOverBudget(described) ? (
            <ErrorState
              title={t('assistantWeb.error.title')}
              description={
                described.messageKey === null
                  ? t('assistantWeb.error.body')
                  : t(described.messageKey, described.values)
              }
              onRetry={() => setTurnError(null)}
              retryLabel={t('assistantWeb.error.retry')}
              reference={
                described.correlationId === null
                  ? undefined
                  : {
                      label: t('settings.ui.state.referenceLabel'),
                      value: described.correlationId,
                    }
              }
            />
          ) : null}

          <form className="flex flex-col gap-2" onSubmit={(event) => void send(event)}>
            <Label htmlFor="assistant-input">{t('assistantWeb.input.label')}</Label>
            <Textarea
              id="assistant-input"
              rows={3}
              value={draftText}
              placeholder={t('assistantWeb.input.placeholder')}
              onChange={(event) => setDraftText(event.currentTarget.value)}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-body-sm text-text-tertiary">{t('assistantWeb.input.hint')}</p>
              <Button
                type="submit"
                variant="secondary"
                loading={busy}
                disabled={!online || draftText.trim().length === 0}
              >
                {t('assistantWeb.input.send')}
              </Button>
            </div>
          </form>
        </AsyncBoundary>
      </div>
    </>
  );
}
