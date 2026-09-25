'use client';

/**
 * The rules this project already has.
 *
 * Four states, all of them distinct on purpose. "Still reading" is not the
 * same sentence as "there are none", and this list used to show the second one
 * while the first was true, which told somebody their rules had disappeared. A
 * failed read says so and offers a retry, and it says the editor below is
 * unaffected, because a list that cannot be read does not stop a rule being
 * written.
 */

import type { ReactElement } from 'react';
import type { QueueRuleView } from '@relay/contracts';
import { EmptyState, LoadingState, Notice, SkeletonList } from '@relay/design-system/patterns';
import { Badge, Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

export interface QueueRuleListProps {
  readonly rules: readonly QueueRuleView[] | undefined;
  readonly loading: boolean;
  readonly failed: boolean;
  readonly onRetry: () => void;
  readonly onEdit: (rule: QueueRuleView) => void;
  readonly onArchive: (rule: QueueRuleView) => void;
}

export function QueueRuleList({
  rules,
  loading,
  failed,
  onRetry,
  onEdit,
  onArchive,
}: QueueRuleListProps): ReactElement {
  const t = useTranslations();

  if (loading) {
    return (
      <LoadingState label={t.full('web.queue.rules.loading')}>
        <SkeletonList rows={3} avatar={false} />
      </LoadingState>
    );
  }

  if (failed || rules === undefined) {
    return (
      <Notice
        liveness="alert"
        tone="warning"
        title={t.full('web.queue.rules.loadFailed.title')}
        description={t.full('web.queue.rules.loadFailed.body')}
        actions={
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {t.full('action.retry')}
          </Button>
        }
      />
    );
  }

  if (rules.length === 0) {
    return (
      <EmptyState
        title={t.full('queue.rules.heading')}
        description={t.full('queue.rules.empty')}
      />
    );
  }

  return (
    <ul className="flex flex-col">
      {rules.map((rule) => (
        <li
          key={rule.id}
          className="border-border-subtle flex flex-wrap items-center gap-3 border-b py-3 last:border-b-0"
        >
          <span className="text-body-md text-text-primary grow">{rule.name}</span>
          <Badge tone={rule.enabled ? 'success' : 'neutral'}>
            {rule.enabled ? t.full('queue.rules.enabled') : t.full('queue.rules.disabled')}
          </Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onEdit(rule);
            }}
          >
            {t.full('queue.rules.edit')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onArchive(rule);
            }}
          >
            {t.full('queue.rules.archive')}
          </Button>
        </li>
      ))}
    </ul>
  );
}
