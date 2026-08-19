'use client';

import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import {
  WORKSPACE_ROLES,
  type ProjectRef,
  type MemberView,
  type WorkspaceRole,
} from '../lib/view-models';

/** Roles that include a review step and can therefore hold approval rights. */
const APPROVAL_CAPABLE_ROLES: readonly WorkspaceRole[] = ['owner', 'admin', 'manager', 'approver'];

export interface MemberFormValue {
  readonly email: string;
  readonly role: WorkspaceRole;
  readonly projectIds: readonly string[];
  readonly canApprove: boolean;
}

export interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Null invites someone new. A member edits that person's role and scope. */
  member: MemberView | null;
  projects: readonly ProjectRef[];
  saving: boolean;
  onSubmit: (value: MemberFormValue) => void;
}

/**
 * Invite someone, or change what an existing member can reach.
 *
 * Role, project scope and approval rights are three separate decisions and are
 * asked for separately. Bundling them is how a workspace ends up with editors
 * who can approve their own work.
 */
export function MemberDialog({
  open,
  onOpenChange,
  member,
  projects,
  saving,
  onSubmit,
}: MemberDialogProps): ReactNode {
  const t = useTranslations();
  const formId = useId();
  const editing = member !== null;

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceRole>('editor');
  const [scopeMode, setScopeMode] = useState<'all' | 'selected'>('all');
  const [projectIds, setProjectIds] = useState<readonly string[]>([]);
  const [canApprove, setCanApprove] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setEmailError(null);
    setEmail(member?.email ?? '');
    setRole(member?.role ?? 'editor');
    setScopeMode(member === null || member.projectScope.length === 0 ? 'all' : 'selected');
    setProjectIds(member?.projectScope.map((project) => project.id) ?? []);
    setCanApprove(member?.canApprove ?? false);
  }, [open, member]);

  const approvalAvailable = APPROVAL_CAPABLE_ROLES.includes(role);

  function toggleProject(projectId: string, checked: boolean): void {
    setProjectIds((current) =>
      checked ? [...current, projectId] : current.filter((id) => id !== projectId),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmed = email.trim();
    if (!editing && (trimmed.length === 0 || !trimmed.includes('@'))) {
      setEmailError(t('validation.field.invalidEmail'));
      return;
    }
    setEmailError(null);
    onSubmit({
      email: trimmed,
      role,
      projectIds: scopeMode === 'all' ? [] : projectIds,
      canApprove: approvalAvailable && canApprove,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('a11y.label.closeDialog')} size="md">
        <DialogHeader>
          <DialogTitle>
            {editing
              ? t('settings.ui.members.changeRole', { name: member.name })
              : t('settings.ui.members.inviteTitle')}
          </DialogTitle>
          <DialogDescription>
            {editing ? t('settings.ui.members.description') : t('settings.ui.members.inviteBody')}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form id={formId} className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            {editing ? null : (
              <Field
                label={t('settings.members.inviteEmail')}
                required
                error={emailError ?? undefined}
              >
                {(control) => (
                  <Input
                    {...control}
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                )}
              </Field>
            )}

            <Field
              label={t('settings.ui.members.inviteRole')}
              description={t(`settings.role.${role}.description`)}
              required
            >
              {(control) => (
                <Select value={role} onValueChange={(value) => setRole(value as WorkspaceRole)}>
                  <SelectTrigger id={control.id} aria-describedby={control['aria-describedby']}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKSPACE_ROLES.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        description={t(`settings.role.${option}.description`)}
                      >
                        {t(`settings.role.${option}.label`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>

            <fieldset className="flex flex-col gap-2 border-0 p-0">
              <legend className="text-body-md text-text-primary pb-1 font-medium">
                {t('settings.ui.members.inviteScope')}
              </legend>
              <RadioGroup
                value={scopeMode}
                onValueChange={(value) => setScopeMode(value === 'selected' ? 'selected' : 'all')}
                className="flex flex-col gap-1"
              >
                <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                  <RadioGroupItem value="all" />
                  {t('settings.ui.members.inviteScopeAll')}
                </label>
                <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                  <RadioGroupItem value="selected" />
                  {t('settings.ui.members.inviteScopeSelected')}
                </label>
              </RadioGroup>

              {scopeMode === 'selected' ? (
                <ul className="flex flex-col ps-6">
                  {projects.map((project) => (
                    <li key={project.id}>
                      <label className="text-body-md text-text-primary flex min-h-11 items-center gap-2">
                        <Checkbox
                          checked={projectIds.includes(project.id)}
                          onCheckedChange={(checked) => toggleProject(project.id, checked === true)}
                        />
                        {project.name}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : null}
            </fieldset>

            <label className="text-body-md text-text-primary flex min-h-11 items-start gap-2 py-1">
              <Checkbox
                className="mt-0.5"
                checked={canApprove}
                disabled={!approvalAvailable}
                onCheckedChange={(checked) => setCanApprove(checked === true)}
              />
              <span className="flex flex-col gap-0.5">
                {t('settings.ui.members.inviteApprovals')}
                <span className="text-body-sm text-text-secondary">
                  {t('settings.ui.members.inviteApprovalsHelp')}
                </span>
              </span>
            </label>
          </form>
        </DialogBody>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={saving}>
            {editing ? t('action.saveChanges') : t('settings.ui.members.inviteSubmit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
