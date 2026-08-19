'use client';

/**
 * Creating and editing a Posting Set.
 *
 * The form states the one thing about a Set that people get wrong: it is read
 * once, when it is applied. That sentence sits above the fields rather than in
 * a tooltip, because the moment somebody edits a Set they are entitled to know
 * whether the campaign they scheduled last week is about to change. It is not.
 *
 * The schedule preference does not implement scheduling. When it offers a queue
 * slot it reads the project's own queue rules through the queue service, which
 * is the same code the composer and the calendar use, so the Set cannot promise
 * an hour the queue would refuse.
 */

import { useEffect, useState, type ReactNode } from 'react';
import {
  Button,
  Checkbox,
  Field,
  Input,
  Label,
  Notice,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import {
  POSTING_SET_APPROVAL_POLICIES,
  POSTING_SET_SLOT_BEHAVIORS,
  type PostingSetApprovalPolicy,
  type PostingSetSlotBehavior,
  type PostingSetView,
} from '@relay/contracts';

import { AccountIdentity } from '@/features/connections/provider';
import type { ConnectionView } from '@/lib/api/types';
import { useNextQueueSlot } from './use-posting-sets';

export interface SetFormValue {
  readonly name: string;
  readonly description: string;
  readonly connectionIds: readonly string[];
  readonly signatureId: string | null;
  readonly approvalPolicy: PostingSetApprovalPolicy;
  readonly slotBehavior: PostingSetSlotBehavior;
}

export interface SignatureOption {
  readonly id: string;
  readonly name: string;
}

export interface SetFormProps {
  projectId: string;
  /** Absent when creating. */
  set?: PostingSetView | undefined;
  connections: readonly ConnectionView[];
  signatures: readonly SignatureOption[];
  submitting: boolean;
  errorKey?: string | null;
  onSubmit: (value: SetFormValue) => void;
  onCancel: () => void;
}

function initialValue(set: PostingSetView | undefined): SetFormValue {
  return {
    name: set?.name ?? '',
    description: set?.description ?? '',
    connectionIds: set?.connectionIds ?? [],
    signatureId: set?.signatureId ?? null,
    approvalPolicy: set?.approvalPolicy ?? 'none',
    slotBehavior: set?.slotBehavior ?? 'next_free_slot',
  };
}

export function SetForm({
  projectId,
  set,
  connections,
  signatures,
  submitting,
  errorKey,
  onSubmit,
  onCancel,
}: SetFormProps): ReactNode {
  const t = useTranslations();
  const [value, setValue] = useState<SetFormValue>(() => initialValue(set));
  const nextSlot = useNextQueueSlot(value.slotBehavior === 'next_free_slot' ? projectId : null);

  useEffect(() => {
    setValue(initialValue(set));
  }, [set]);

  const toggleConnection = (connectionId: string): void => {
    setValue((current) => ({
      ...current,
      connectionIds: current.connectionIds.includes(connectionId)
        ? current.connectionIds.filter((id) => id !== connectionId)
        : [...current.connectionIds, connectionId],
    }));
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value);
      }}
    >
      <Notice tone="info" title={t('set.title')} description={t('set.appliedOnce')} />

      {errorKey ? <Notice tone="destructive" title={t('set.edit')} description={t(errorKey)} /> : null}

      <Field label={t('set.field.name')} description={t('set.field.nameHint')} required>
        {(control) => (
          <Input
            {...control}
            value={value.name}
            maxLength={120}
            onChange={(event) => setValue((current) => ({ ...current, name: event.target.value }))}
          />
        )}
      </Field>

      <Field label={t('set.field.description')} description={t('set.field.descriptionHint')}>
        {(control) => (
          <Textarea
            {...control}
            rows={2}
            value={value.description}
            maxLength={500}
            onChange={(event) =>
              setValue((current) => ({ ...current, description: event.target.value }))
            }
          />
        )}
      </Field>

      <fieldset className="flex flex-col gap-3 border-0 p-0">
        <legend className="text-label text-text-secondary">{t('set.field.targets')}</legend>
        <p className="text-body-sm text-text-tertiary">{t('set.field.targetsHint')}</p>
        <ul className="flex flex-col gap-2">
          {connections.map((connection) => (
            <li key={connection.id} className="flex items-center gap-3">
              <Checkbox
                id={`set-target-${connection.id}`}
                checked={value.connectionIds.includes(connection.id)}
                onCheckedChange={() => toggleConnection(connection.id)}
              />
              <Label htmlFor={`set-target-${connection.id}`} className="cursor-pointer">
                <AccountIdentity
                  provider={connection.provider}
                  accountLabel={connection.displayName}
                  size="sm"
                />
              </Label>
            </li>
          ))}
        </ul>
        <p className="text-body-sm text-text-tertiary">
          {t('set.field.targetCount', { count: value.connectionIds.length })}
        </p>
      </fieldset>

      <Field label={t('set.field.signature')}>
        {(control) => (
          <Select
            value={value.signatureId ?? 'none'}
            onValueChange={(next) =>
              setValue((current) => ({
                ...current,
                signatureId: next === 'none' ? null : next,
              }))
            }
          >
            <SelectTrigger {...control}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t('set.field.signatureNone')}</SelectItem>
              {signatures.map((signature) => (
                <SelectItem key={signature.id} value={signature.id}>
                  {signature.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      <Field label={t('set.field.approval')} description={t('set.field.approvalHint')}>
        {(control) => (
          <Select
            value={value.approvalPolicy}
            onValueChange={(next) =>
              setValue((current) => ({
                ...current,
                approvalPolicy: next as PostingSetApprovalPolicy,
              }))
            }
          >
            <SelectTrigger {...control}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSTING_SET_APPROVAL_POLICIES.map((policy) => (
                <SelectItem key={policy} value={policy}>
                  {t(`set.approval.${policy}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      <Field
        label={t('set.field.schedule')}
        description={t(`set.slot.${value.slotBehavior}Hint`)}
      >
        {(control) => (
          <Select
            value={value.slotBehavior}
            onValueChange={(next) =>
              setValue((current) => ({
                ...current,
                slotBehavior: next as PostingSetSlotBehavior,
              }))
            }
          >
            <SelectTrigger {...control}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSTING_SET_SLOT_BEHAVIORS.map((behavior) => (
                <SelectItem key={behavior} value={behavior}>
                  {t(`set.slot.${behavior}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      {/* What the queue would actually offer, read from the queue rules service
          rather than guessed at here. A project with no rules gets the labelled
          fallback and is told so. */}
      {value.slotBehavior === 'next_free_slot' && nextSlot.data === null ? (
        <Notice
          tone="info"
          title={t('set.slot.next_free_slot')}
          description={t('set.slot.noRules')}
        />
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          variant="primary"
          loading={submitting}
          loadingLabel={t('loading.default')}
          disabled={value.name.trim() === ''}
        >
          {t('action.save')}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('action.cancel')}
        </Button>
      </div>
    </form>
  );
}
