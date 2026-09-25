'use client';

import { useState, type ReactElement } from 'react';
import type { QueueRuleView } from '@relay/contracts';
import { ConfirmDialog, Notice, PageHeader } from '@relay/design-system/patterns';
import { Button, Field, Input, Switch } from '@relay/design-system/primitives';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';

import { describeApiError } from '@/features/settings/lib/api-error';
import { useSession } from '@/lib/auth/session-context';

import { BlackoutList } from './components/blackout-list';
import { QueueRuleList } from './components/rule-list';
import { WindowGrid } from './components/window-grid';
import { WindowList } from './components/window-list';
import { useArchiveQueueRule, useQueueRules, useSaveQueueRule } from './queries';
import {
  addBlackout,
  addWindow,
  draftIssues,
  emptyDraft,
  removeBlackoutAt,
  removeWindowAt,
  toDraft,
  toggleHour,
  type RuleDraft,
} from './rule-draft';

/**
 * The queue rule editor.
 *
 * One screen, in the order a person makes the decision: name it, say which zone
 * it is read in, mark the hours, set the spacing and the daily ceiling, list
 * the days it must not post on, then save. The grid and the typed window list
 * edit the same thing, so no part of this screen needs a pointer.
 *
 * Two things this screen owes the person using it. The rule list distinguishes
 * "still loading" from "there are none", because an empty state shown while a
 * read is in flight tells somebody their rules are gone. And a save that fails
 * says so next to the button they pressed, with everything they typed still in
 * front of them, rather than nowhere at all.
 */
export function QueueRuleEditorScreen(): ReactElement {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const { project, workspace } = useSession();
  const rules = useQueueRules();
  const save = useSaveQueueRule();
  const archive = useArchiveQueueRule();

  const zone = workspace.timeZone;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<RuleDraft>(() => emptyDraft(zone));
  const [archiving, setArchiving] = useState<QueueRuleView | null>(null);

  const issues = draftIssues(draft);
  const saveFailure = save.error === null ? null : describeApiError(save.error);
  const archiveFailure = archive.error === null ? null : describeApiError(archive.error);
  const patch = (change: Partial<RuleDraft>): void => {
    setDraft((current) => ({ ...current, ...change }));
  };

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={t.full('queue.title')} description={t.full('queue.subtitle')} />

      <div className="flex flex-col gap-6 px-4 py-6 md:px-6">
        <section aria-labelledby="queue-rules-heading" className="flex flex-col gap-3">
          <h2 id="queue-rules-heading" className="text-title-md text-text-primary">
            {t.full('queue.rules.heading')}
          </h2>
          <QueueRuleList
            rules={rules.data}
            loading={rules.isPending}
            failed={rules.isError}
            onRetry={() => {
              void rules.refetch();
            }}
            onEdit={(rule) => {
              setEditingId(rule.id);
              setDraft(toDraft(rule));
            }}
            onArchive={setArchiving}
          />
          {archiveFailure === null ? null : (
            <Notice
              liveness="alert"
              tone="destructive"
              title={t.full('web.queue.archive.failedTitle')}
              description={
                archiveFailure.messageKey === null
                  ? t.full('web.queue.archive.failedBody')
                  : t(archiveFailure.messageKey, archiveFailure.values)
              }
            />
          )}
          <p className="text-body-sm text-text-tertiary">{t.full('queue.rules.archiveHelp')}</p>
        </section>

        <section aria-labelledby="queue-editor-heading" className="flex flex-col gap-5">
          <h2 id="queue-editor-heading" className="text-title-md text-text-primary">
            {editingId === null ? t.full('queue.rules.create') : t.full('queue.rules.edit')}
          </h2>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label={t.full('queue.field.name')} description={t.full('queue.field.nameHelp')}>
              {(control) => (
                <Input
                  id={control.id}
                  value={draft.name}
                  onChange={(event) => patch({ name: event.target.value })}
                />
              )}
            </Field>
            {/*
              A free text zone name. It stays free text for now: the typed
              zone picker belongs to the shared date and time control another
              lane is building, and a second one here would be thrown away.
              TODO(owner): depends on design-system DateTimeField
            */}
            <Field
              label={t.full('queue.field.timeZone')}
              description={t.full('queue.field.timeZoneHelp')}
            >
              {(control) => (
                <Input
                  id={control.id}
                  value={draft.ianaTimeZone}
                  onChange={(event) => patch({ ianaTimeZone: event.target.value })}
                />
              )}
            </Field>
          </div>

          <WindowGrid
            windows={draft.windows}
            onToggle={(weekday, hour) =>
              patch({ windows: toggleHour(draft.windows, weekday, hour) })
            }
          />

          <WindowList
            windows={draft.windows}
            onAdd={(window) => patch({ windows: addWindow(draft.windows, window) })}
            onRemove={(index) => patch({ windows: removeWindowAt(draft.windows, index) })}
          />

          <div className="grid gap-2.5 sm:grid-cols-3">
            <Field
              label={t.full('queue.field.minimumGap')}
              description={t.full('queue.field.minimumGapHelp')}
            >
              {(control) => (
                <Input
                  id={control.id}
                  type="number"
                  min={0}
                  value={String(draft.minimumGapMinutes)}
                  onChange={(event) =>
                    patch({ minimumGapMinutes: Number.parseInt(event.target.value, 10) || 0 })
                  }
                />
              )}
            </Field>
            <Field
              label={t.full('queue.field.maximumPerDay')}
              description={t.full('queue.field.maximumPerDayHelp')}
            >
              {(control) => (
                <Input
                  id={control.id}
                  type="number"
                  min={0}
                  placeholder={t.full('queue.field.maximumPerDayUnlimited')}
                  value={draft.maximumPerDay === null ? '' : String(draft.maximumPerDay)}
                  onChange={(event) => {
                    // An empty field is "no ceiling". A typed 0 is zero. These are
                    // different answers and the editor keeps them different.
                    const raw = event.target.value;
                    patch({ maximumPerDay: raw === '' ? null : Number.parseInt(raw, 10) || 0 });
                  }}
                />
              )}
            </Field>
            <Field
              label={t.full('queue.field.priority')}
              description={t.full('queue.field.priorityHelp')}
            >
              {(control) => (
                <Input
                  id={control.id}
                  type="number"
                  min={0}
                  value={String(draft.priority)}
                  onChange={(event) =>
                    patch({ priority: Number.parseInt(event.target.value, 10) || 0 })
                  }
                />
              )}
            </Field>
          </div>

          <BlackoutList
            blackouts={draft.blackouts}
            onAdd={(span) => patch({ blackouts: addBlackout(draft.blackouts, span) })}
            onRemove={(index) => patch({ blackouts: removeBlackoutAt(draft.blackouts, index) })}
          />

          <Field label={t.full('queue.field.enabled')}>
            {(control) => (
              <Switch
                id={control.id}
                checked={draft.enabled}
                onCheckedChange={(checked) => patch({ enabled: checked })}
              />
            )}
          </Field>

          {issues.includes('windows_required') ? (
            <Notice tone="warning" title={t.full('queue.windows.empty')} />
          ) : null}

          {saveFailure === null ? null : (
            <Notice
              liveness="alert"
              tone="destructive"
              title={t.full('web.queue.save.failedTitle')}
              description={
                saveFailure.messageKey === null
                  ? t.full('web.queue.save.failedBody')
                  : t(saveFailure.messageKey, saveFailure.values)
              }
            />
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="cta"
              disabled={issues.length > 0 || project === null}
              loading={save.isPending}
              loadingLabel={t.full('action.save')}
              onClick={() => {
                save.mutate(
                  { draft, ...(editingId === null ? {} : { ruleId: editingId }) },
                  {
                    onSuccess: (rule) => {
                      setEditingId(rule.id);
                      announce(t.full('web.queue.save.announcement'), 'polite');
                    },
                  },
                );
              }}
            >
              {t.full('action.save')}
            </Button>
            {editingId === null ? null : (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingId(null);
                  setDraft(emptyDraft(zone));
                }}
              >
                {t.full('queue.rules.create')}
              </Button>
            )}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={archiving !== null}
        onOpenChange={(next) => {
          if (!next) setArchiving(null);
        }}
        title={t.full('web.queue.archive.title', { name: archiving?.name ?? '' })}
        description={t.full('web.queue.archive.body')}
        consequences={[
          {
            id: 'proposals',
            text: t.full('web.queue.archive.consequence.proposals'),
          },
          {
            id: 'reserved',
            text: t.full('web.queue.archive.consequence.reserved'),
          },
          {
            id: 'scheduled',
            text: t.full('web.queue.archive.consequence.scheduled'),
          },
        ]}
        tone="destructive"
        confirmLabel={t.full('web.queue.archive.confirm')}
        cancelLabel={t.full('web.queue.archive.cancel')}
        closeLabel={t.full('a11y.label.closeDialog')}
        onConfirm={async () => {
          const rule = archiving;
          if (rule === null) return;
          await archive.mutateAsync(rule.id).catch(() => undefined);
          setArchiving(null);
        }}
      />
    </div>
  );
}
