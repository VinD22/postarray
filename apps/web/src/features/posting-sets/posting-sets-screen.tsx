'use client';

/**
 * Posting Set management.
 *
 * A list and an editor, not a dashboard. Each row says the three things a
 * person actually decides between Sets: how many accounts, whether it needs
 * approval, and what it does about a time. Everything else is one click away.
 *
 * The screen states the read-once rule where it matters most: on the list, so
 * somebody arriving to change a Set learns before they edit that the campaign
 * they already scheduled will not move.
 */

import { useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  Notice,
  PageHeader,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import type { PostingSetView } from '@relay/contracts';

import { AccountIdentity } from '@/features/connections/provider';
import type { ConnectionView } from '@/lib/api/types';
import { SetForm, type SetFormValue, type SignatureOption } from './set-form';
import {
  useArchivePostingSet,
  useCreatePostingSet,
  usePostingSets,
  useUpdatePostingSet,
} from './use-posting-sets';

export interface PostingSetsScreenProps {
  brandId: string;
  connections: readonly ConnectionView[];
  signatures?: readonly SignatureOption[];
}

type Editing = { readonly mode: 'create' } | { readonly mode: 'edit'; readonly set: PostingSetView };

export function PostingSetsScreen({
  brandId,
  connections,
  signatures = [],
}: PostingSetsScreenProps): ReactNode {
  const t = useTranslations();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [editing, setEditing] = useState<Editing | null>(null);
  const query = usePostingSets({ brandId, includeArchived });
  const create = useCreatePostingSet();
  const update = useUpdatePostingSet();
  const archive = useArchivePostingSet();

  const submitting = create.isPending || update.isPending;
  const errorKey =
    create.error?.details?.['name'] !== undefined || update.error !== null
      ? 'set.error.nameTaken'
      : null;

  const submit = (value: SetFormValue): void => {
    const patch = {
      name: value.name.trim(),
      description: value.description.trim() === '' ? null : value.description.trim(),
      connectionIds: [...value.connectionIds],
      signatureId: value.signatureId,
      approvalPolicy: value.approvalPolicy,
      slotBehavior: value.slotBehavior,
    };
    if (editing?.mode === 'edit') {
      update.mutate(
        { setId: editing.set.id, patch },
        { onSuccess: () => setEditing(null) },
      );
      return;
    }
    create.mutate(
      { brandId, targetDefaults: [], ...patch },
      { onSuccess: () => setEditing(null) },
    );
  };

  if (editing !== null) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title={editing.mode === 'edit' ? t('set.edit') : t('set.create')}
          description={t('set.lede')}
        />
        <SetForm
          brandId={brandId}
          {...(editing.mode === 'edit' ? { set: editing.set } : {})}
          connections={connections}
          signatures={signatures}
          submitting={submitting}
          errorKey={errorKey}
          onSubmit={submit}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={t('set.title')}
        description={t('set.lede')}
        actions={
          <Button variant="primary" onClick={() => setEditing({ mode: 'create' })}>
            {t('set.create')}
          </Button>
        }
      />

      {/* The rule, said before anybody edits anything. */}
      <Notice tone="info" title={t('set.title')} description={t('set.appliedOnce')} />

      {query.isPending ? <LoadingState label={t('loading.default')}>{t('loading.default')}</LoadingState> : null}
      {query.isError ? (
        <ErrorState
          title={t('error.unknown.message')}
          description={t('error.unknown.action')}
        />
      ) : null}

      {query.data !== undefined && query.data.data.length === 0 ? (
        <EmptyState title={t('set.empty.title')} description={t('set.empty.body')} />
      ) : null}

      <ul className="flex flex-col gap-3">
        {(query.data?.data ?? []).map((set) => (
          <li
            key={set.id}
            className="border-border-subtle flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-heading-sm text-text-primary">{set.name}</h3>
                {set.archivedAt !== null ? (
                  <Badge tone="neutral">{t('set.archived')}</Badge>
                ) : null}
              </div>
              {set.description === null ? null : (
                <p className="text-body-sm text-text-secondary">{set.description}</p>
              )}
              <ul className="flex flex-wrap gap-3">
                {set.connectionIds.map((connectionId) => {
                  const connection = connections.find((entry) => entry.id === connectionId);
                  return connection === undefined ? null : (
                    <li key={connectionId}>
                      <AccountIdentity
                        provider={connection.provider}
                        accountLabel={connection.displayName}
                        size="sm"
                      />
                    </li>
                  );
                })}
              </ul>
              <dl className="text-body-sm text-text-tertiary flex flex-wrap gap-x-6 gap-y-1">
                <div className="flex gap-1.5">
                  <dt>{t('set.field.targets')}</dt>
                  <dd>{t('set.field.targetCount', { count: set.connectionIds.length })}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt>{t('set.field.approval')}</dt>
                  <dd>{t(`set.approval.${set.approvalPolicy}`)}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt>{t('set.field.schedule')}</dt>
                  <dd>{t(`set.slot.${set.slotBehavior}`)}</dd>
                </div>
              </dl>
            </div>

            <div className="flex shrink-0 gap-2">
              {set.archivedAt === null ? (
                <>
                  <Button variant="secondary" onClick={() => setEditing({ mode: 'edit', set })}>
                    {t('set.edit')}
                  </Button>
                  <Button
                    variant="ghost"
                    loading={archive.isPending && archive.variables === set.id}
                    loadingLabel={t('loading.default')}
                    onClick={() => archive.mutate(set.id)}
                  >
                    {t('set.archive')}
                  </Button>
                </>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <div>
        <Button variant="ghost" onClick={() => setIncludeArchived((current) => !current)}>
          {t('set.showArchived')}
        </Button>
        {includeArchived ? (
          <p className="text-body-sm text-text-tertiary mt-2">{t('set.archivedNote')}</p>
        ) : null}
      </div>
    </div>
  );
}
