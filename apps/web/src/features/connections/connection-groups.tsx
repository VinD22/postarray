'use client';

/**
 * Customer groups.
 *
 * An agency thinks in clients, not in platforms. A group is a named set of
 * connected accounts that filters the calendar and analytics, and moving an
 * account between groups is a labelling change: every post, receipt and metric
 * it already has stays attached to the account. The dialog says so, because
 * "will I lose the history" is the first question anybody asks.
 */

import { useState, type ReactNode } from 'react';
import { FolderPlus } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  Field,
  Input,
  Label,
  Notice,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useAnnouncer,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { AccountIdentity } from './provider';
import type { ConnectionRow, CustomerGroup } from './types';

const UNGROUPED = '__ungrouped__';

/* ------------------------------------------------------------------------- */

export interface MoveGroupDialogProps {
  row: ConnectionRow | null;
  groups: readonly CustomerGroup[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting: boolean;
  onMove: (row: ConnectionRow, groupId: string | null) => void;
}

export function MoveGroupDialog({
  row,
  groups,
  open,
  onOpenChange,
  submitting,
  onMove,
}: MoveGroupDialogProps): ReactNode {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const [selected, setSelected] = useState<string>(row?.customerGroupId ?? UNGROUPED);

  if (!row) return null;

  const handleMove = (): void => {
    const groupId = selected === UNGROUPED ? null : selected;
    const groupName =
      groups.find((group) => group.id === groupId)?.name ?? t('connection.group.none');
    announce(
      t('web.connection.group.movedAnnouncement', {
        account: row.displayName,
        group: groupName,
      }),
    );
    onMove(row, groupId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('a11y.label.closeDialog')} size="sm">
        <DialogHeader>
          <DialogTitle>
            {t('web.connection.group.moveTitle', { account: row.displayName })}
          </DialogTitle>
          <DialogDescription>{t('connection.group.moveNote')}</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-4">
            <AccountIdentity
              provider={row.provider}
              accountLabel={row.displayName}
              size="sm"
            />

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="move-group-select">
                {t('web.connection.group.moveLabel')}
              </Label>
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger
                  id="move-group-select"
                  aria-label={t('web.connection.group.moveLabel')}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNGROUPED}>{t('connection.group.none')}</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Notice
              tone="neutral"
              title={t('web.connection.group.filterCalendarHint')}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" autoFocus onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button variant="primary" loading={submitting} onClick={handleMove}>
            {t('web.connection.group.moveConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------------- */

export interface GroupListProps {
  groups: readonly CustomerGroup[];
  rows: readonly ConnectionRow[];
  creating: boolean;
  onCreate: (name: string) => void;
}

export function GroupList({
  groups,
  rows,
  creating,
  onCreate,
}: GroupListProps): ReactNode {
  const t = useTranslations();
  const [name, setName] = useState('');

  const ungrouped = rows.filter((row) => !row.customerGroupId);

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-[70ch] text-body-md text-text-secondary">
        {t('connection.group.description')}
      </p>

      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim().length === 0) return;
          onCreate(name.trim());
          setName('');
        }}
      >
        <Field
          label={t('web.connection.group.nameLabel')}
          className="min-w-[14rem] flex-1"
        >
          {(control) => (
            <Input
              {...control}
              value={name}
              placeholder={t('web.connection.group.namePlaceholder')}
              onChange={(event) => setName(event.target.value)}
            />
          )}
        </Field>
        <Button
          type="submit"
          variant="secondary"
          loading={creating}
          disabled={name.trim().length === 0}
          iconStart={<FolderPlus aria-hidden="true" className="size-4" />}
        >
          {t('web.connection.group.create')}
        </Button>
      </form>

      {groups.length === 0 ? (
        <EmptyState
          title={t('web.connection.group.empty.title')}
          description={t('web.connection.group.empty.body')}
          example={t('web.connection.empty.example')}
          compact
        />
      ) : (
        <ul aria-label={t('web.connection.group.listLabel')} className="flex flex-col">
          {groups.map((group) => {
            const members = rows.filter((row) => row.customerGroupId === group.id);
            return (
              <li
                key={group.id}
                className="flex flex-col gap-2 border-b border-border-subtle py-3 last:border-b-0"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-title-sm text-text-primary">{group.name}</h3>
                  <span className="text-body-sm text-text-tertiary">
                    {t('web.connection.group.accountCount', { count: members.length })}
                  </span>
                </div>
                {members.length > 0 ? (
                  <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {members.map((row) => (
                      <li key={row.id}>
                        <AccountIdentity
                          provider={row.provider}
                          accountLabel={row.displayName}
                          size="sm"
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      {ungrouped.length > 0 ? (
        <section className="flex flex-col gap-2">
          <h3 className="text-title-sm text-text-primary">{t('connection.group.none')}</h3>
          <p className="text-body-sm text-text-tertiary">
            {t('web.connection.group.accountCount', { count: ungrouped.length })}
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
            {ungrouped.map((row) => (
              <li key={row.id}>
                <AccountIdentity
                  provider={row.provider}
                  accountLabel={row.displayName}
                  size="sm"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
