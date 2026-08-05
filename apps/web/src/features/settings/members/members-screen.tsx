'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Code,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  StatusDot,
} from '@relay/design-system/primitives';
import {
  ConfirmDialog,
  DefinitionList,
  EmptyState,
  Notice,
  PageHeader,
} from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';
import { MoreHorizontal } from 'lucide-react';

import { AsyncBoundary } from '../lib/async-boundary.js';
import { brandsGateway, membersGateway } from '../lib/gateway.js';
import { useFormatters } from '../lib/formatters.js';
import { settingsKey, useWorkspaceId } from '../lib/keys.js';
import { useSettingsMutation } from '../lib/use-settings-mutation.js';
import type { BrandRef, MemberView } from '../lib/view-models.js';
import { SettingsPanel, SettingsStack } from '../components/section.js';
import { MemberDialog, type MemberFormValue } from './member-dialog.js';
import { RoleReference } from './role-reference.js';


export function MembersScreen(): ReactNode {
  const t = useTranslations();
  const section = t('settings.ui.section.members');
  const formatters = useFormatters();
  const workspaceId = useWorkspaceId();
  const MEMBERS_KEY = settingsKey(workspaceId, 'members');
  const BRANDS_KEY = settingsKey(workspaceId, 'brands');

  const members = useQuery({ queryKey: MEMBERS_KEY, queryFn: () => membersGateway.list() });
  const brands = useQuery({ queryKey: BRANDS_KEY, queryFn: () => brandsGateway.list() });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MemberView | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<MemberView | null>(null);

  const brandRefs = useMemo<readonly BrandRef[]>(
    () => (brands.data ?? []).map((brand) => ({ id: brand.id, name: brand.name })),
    [brands.data],
  );

  const invite = useSettingsMutation({
    section,
    mutationFn: membersGateway.invite,
    invalidate: [MEMBERS_KEY],
    onSuccess: () => setDialogOpen(false),
  });

  const changeRole = useSettingsMutation({
    section,
    mutationFn: membersGateway.updateRole,
    invalidate: [MEMBERS_KEY],
    onSuccess: () => setDialogOpen(false),
  });

  const remove = useSettingsMutation({
    section,
    mutationFn: membersGateway.remove,
    invalidate: [MEMBERS_KEY],
    onSuccess: () => setPendingRemoval(null),
  });

  const rows = members.data ?? [];
  const owners = rows.filter((member) => member.role === 'owner');

  function submitDialog(value: MemberFormValue): void {
    if (editing === null) {
      void invite.run(value);
      return;
    }
    void changeRole.run({
      memberId: editing.id,
      role: value.role,
      brandIds: value.brandIds,
      canApprove: value.canApprove,
    });
  }

  function openInvite(): void {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(member: MemberView): void {
    setEditing(member);
    setDialogOpen(true);
  }

  function scopeLabel(member: MemberView): string {
    if (member.brandScope.length === 0) {
      return t('settings.ui.members.scopeAll');
    }
    return t('settings.ui.members.scopeLimited', {
      count: member.brandScope.length,
      names: formatters.list(member.brandScope.map((brand) => brand.name)),
    });
  }

  function approvalLabel(member: MemberView): string {
    if (!member.canApprove) {
      return t('settings.ui.members.approvals.cannotApprove');
    }
    return member.brandScope.length === 0
      ? t('settings.ui.members.approvals.canApprove')
      : t('settings.ui.members.approvals.canApproveOwnBrands');
  }

  function lastActiveLabel(member: MemberView): string {
    if (member.status === 'invited') {
      return member.invitedAt === null
        ? t('settings.members.pending')
        : t('settings.ui.members.invitePending', {
            relativeTime: formatters.relative(member.invitedAt),
            name: member.invitedByName ?? t('common.unknown'),
          });
    }
    return member.lastActiveAt === null
      ? t('settings.ui.members.lastActiveNever')
      : formatters.relative(member.lastActiveAt);
  }

  /** The last owner cannot lose the role, so the option is explained, not hidden. */
  function isProtectedOwner(member: MemberView): boolean {
    return member.role === 'owner' && owners.length <= 1;
  }

  function rowActions(member: MemberView): ReactNode {
    const protectedOwner = isProtectedOwner(member);
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-label={t('a11y.label.openMenu')}
            iconStart={<MoreHorizontal aria-hidden="true" className="size-4" />}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={protectedOwner} onSelect={() => openEdit(member)}>
            {t('settings.ui.members.changeRole', { name: member.name })}
          </DropdownMenuItem>
          {member.status === 'invited' ? (
            <DropdownMenuItem
              onSelect={() =>
                void invite.run({
                  email: member.email,
                  role: member.role,
                  brandIds: member.brandScope.map((brand) => brand.id),
                  canApprove: member.canApprove,
                })
              }
            >
              {t('settings.ui.members.inviteResend')}
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            destructive
            disabled={protectedOwner || member.isCurrentUser}
            onSelect={() => setPendingRemoval(member)}
          >
            {member.status === 'invited'
              ? t('settings.ui.members.inviteRevoke')
              : t('settings.ui.members.remove', { name: member.name })}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <PageHeader
        title={section}
        description={t('settings.ui.members.description')}
        actions={
          <Button variant="primary" onClick={openInvite}>
            {t('settings.members.invite')}
          </Button>
        }
      />

      <SettingsStack>
        <AsyncBoundary
          section={section}
          isPending={members.isPending}
          error={members.error}
          onRetry={() => void members.refetch()}
          skeletonColumns={5}
        >
          {rows.length <= 1 ? (
            <EmptyState
              title={t('settings.ui.members.emptyTitle')}
              description={t('settings.ui.members.emptyBody')}
              example={t('settings.ui.members.emptyExample')}
              action={
                <Button variant="primary" onClick={openInvite}>
                  {t('settings.members.invite')}
                </Button>
              }
            />
          ) : (
            <>
              {owners.length <= 1 ? (
                <Notice
                  tone="neutral"
                  title={t('settings.ui.members.lastOwnerTitle')}
                  description={t('settings.ui.members.lastOwnerBody')}
                />
              ) : null}

              {/* 768px and up: the full table. */}
              <div className="hidden md:block">
                <TableContainer>
                  <Table>
                    <TableCaption className="sr-only">
                      {t('settings.ui.members.tableCaption')}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead scope="col">
                          {t('settings.ui.members.column.person')}
                        </TableHead>
                        <TableHead scope="col">{t('settings.ui.members.column.role')}</TableHead>
                        <TableHead scope="col">{t('settings.ui.members.column.scope')}</TableHead>
                        <TableHead scope="col">
                          {t('settings.ui.members.column.approvals')}
                        </TableHead>
                        <TableHead scope="col">
                          {t('settings.ui.members.column.lastActive')}
                        </TableHead>
                        <TableHead scope="col">
                          <span className="sr-only">
                            {t('settings.ui.members.column.actions')}
                          </span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((member) => (
                        <TableRow key={member.id}>
                          <TableRowHeader>
                            <span className="flex flex-col">
                              <span className="font-medium text-text-primary">{member.name}</span>
                              <span className="text-body-sm text-text-tertiary">
                                {member.email}
                              </span>
                            </span>
                          </TableRowHeader>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              <StatusDot
                                tone={member.status === 'invited' ? 'warning' : 'neutral'}
                              />
                              {t(`settings.role.${member.role}.label`)}
                            </span>
                          </TableCell>
                          <TableCell>{scopeLabel(member)}</TableCell>
                          <TableCell>{approvalLabel(member)}</TableCell>
                          <TableCell>{lastActiveLabel(member)}</TableCell>
                          <TableCell className="text-end">{rowActions(member)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Below 768px: one meaningful row per person, with the same facts. */}
              <ul className="flex flex-col md:hidden">
                {rows.map((member) => (
                  <li
                    key={member.id}
                    className="flex flex-col gap-2 border-b border-border-subtle py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-col">
                        <span className="text-body-md font-medium text-text-primary">
                          {member.name}
                        </span>
                        <span className="text-body-sm text-text-tertiary">{member.email}</span>
                      </div>
                      {rowActions(member)}
                    </div>
                    <DefinitionList
                      layout="columns"
                      items={[
                        {
                          id: 'role',
                          term: t('settings.ui.members.column.role'),
                          definition: t(`settings.role.${member.role}.label`),
                        },
                        {
                          id: 'scope',
                          term: t('settings.ui.members.column.scope'),
                          definition: scopeLabel(member),
                        },
                        {
                          id: 'approvals',
                          term: t('settings.ui.members.column.approvals'),
                          definition: approvalLabel(member),
                        },
                        {
                          id: 'active',
                          term: t('settings.ui.members.column.lastActive'),
                          definition: lastActiveLabel(member),
                        },
                      ]}
                    />
                  </li>
                ))}
              </ul>

              <p className="text-body-sm text-text-tertiary">
                {t('settings.members.count', { count: rows.length })}
              </p>
            </>
          )}
        </AsyncBoundary>

        <SettingsPanel
          title={t('settings.ui.members.roleReferenceTitle')}
          description={t('settings.role.mfaRequired')}
        >
          <RoleReference />
        </SettingsPanel>
      </SettingsStack>

      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editing}
        brands={brandRefs}
        saving={invite.isSaving || changeRole.isSaving}
        onSubmit={submitDialog}
      />

      <ConfirmDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRemoval(null);
          }
        }}
        tone="destructive"
        title={t('settings.ui.members.removeTitle', { name: pendingRemoval?.name ?? '' })}
        description={t('settings.members.removeConfirm', { name: pendingRemoval?.name ?? '' })}
        consequences={[
          { id: 'access', text: t('settings.ui.members.removeConsequence.access') },
          { id: 'drafts', text: t('settings.ui.members.removeConsequence.drafts') },
          { id: 'approvals', text: t('settings.ui.members.removeConsequence.approvals') },
          { id: 'audit', text: t('settings.ui.members.removeConsequence.audit') },
        ]}
        confirmLabel={t('action.remove')}
        cancelLabel={t('action.cancel')}
        closeLabel={t('a11y.label.closeDialog')}
        onConfirm={() => {
          if (pendingRemoval !== null) {
            void remove.run(pendingRemoval.id);
          }
        }}
      >
        <Code>{pendingRemoval?.email ?? ''}</Code>
      </ConfirmDialog>
    </>
  );
}
