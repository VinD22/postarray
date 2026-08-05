'use client';

import { useState, type ReactNode } from 'react';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  RadioGroup,
  RadioGroupItem,
  Textarea,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

const DISMISS_REASONS = [
  'notRelevant',
  'noCapacity',
  'wrongAudience',
  'alreadyDone',
  'policy',
  'other',
] as const;

export type DismissReason = (typeof DISMISS_REASONS)[number];

export interface ItemActionsProps {
  /** Stable id of the recommendation these actions belong to. */
  itemId: string;
  /** Present when the item can become a draft. */
  onAccept?: () => void;
  onPropose?: () => void;
  onEdit?: () => void;
  onDismiss: (reason: DismissReason, note: string) => void;
  onUndoDismiss?: () => void;
  dismissed: boolean;
  /** The sentence explaining why this was suggested, and what it rests on. */
  explanation: string;
  evidence: readonly string[];
  busy?: boolean;
}

/**
 * The five actions every recommendation carries.
 *
 * Dismiss always asks for a reason, because a dismissal with no reason teaches
 * the next version nothing and reads as the product ignoring the user. Explain
 * is a real disclosure of what the suggestion rests on, so a user can tell an
 * inference from a confirmed fact before accepting it.
 */
export function ItemActions({
  itemId,
  onAccept,
  onPropose,
  onEdit,
  onDismiss,
  onUndoDismiss,
  dismissed,
  explanation,
  evidence,
  busy = false,
}: ItemActionsProps): ReactNode {
  const t = useTranslations();
  const [explaining, setExplaining] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [reason, setReason] = useState<DismissReason>('notRelevant');
  const [note, setNote] = useState('');

  if (dismissed) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-body-sm text-text-tertiary">{t('growth.ui.item.dismissed')}</span>
        {onUndoDismiss === undefined ? null : (
          <Button variant="ghost" size="sm" onClick={onUndoDismiss}>
            {t('growth.ui.item.undoDismiss')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {onAccept === undefined ? null : (
          <Button variant="secondary" size="sm" loading={busy} onClick={onAccept}>
            {t('action.acceptAsDraft')}
          </Button>
        )}
        {onPropose === undefined ? null : (
          <Button variant="secondary" size="sm" loading={busy} onClick={onPropose}>
            {t('action.proposeSlot')}
          </Button>
        )}
        {onEdit === undefined ? null : (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            {t('action.edit')}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={() => setExplaining(true)}>
          {t('action.explain')}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setDismissing(true)}>
          {t('action.dismiss')}
        </Button>
      </div>

      <Dialog open={explaining} onOpenChange={setExplaining}>
        <DialogContent closeLabel={t('a11y.label.closeDialog')} size="md">
          <DialogHeader>
            <DialogTitle>{t('growth.ui.item.explainTitle')}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-3">
              <p className="text-body-md text-text-primary">{explanation}</p>
              <div className="flex flex-col gap-1">
                <h3 className="text-label text-text-tertiary">
                  {t('growth.ui.item.explainEvidence')}
                </h3>
                {evidence.length === 0 ? (
                  <p className="text-body-md text-text-secondary">
                    {t('growth.ui.item.explainNoEvidence')}
                  </p>
                ) : (
                  <ul className="flex list-disc flex-col gap-1 ps-5 text-body-md text-text-secondary">
                    {evidence.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setExplaining(false)}>
              {t('action.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dismissing} onOpenChange={setDismissing}>
        <DialogContent closeLabel={t('a11y.label.closeDialog')} size="md">
          <DialogHeader>
            <DialogTitle>{t('growth.ui.item.dismissTitle')}</DialogTitle>
            <DialogDescription>{t('growth.ui.item.dismissBody')}</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <fieldset className="flex flex-col gap-1 border-0 p-0">
                <legend className="pb-1 text-body-md font-medium text-text-primary">
                  {t('growth.ui.item.dismissReasonLabel')}
                </legend>
                <RadioGroup
                  value={reason}
                  onValueChange={(value) => setReason(value as DismissReason)}
                  className="flex flex-col"
                >
                  {DISMISS_REASONS.map((entry) => (
                    <label
                      key={entry}
                      className="flex min-h-11 items-center gap-2 text-body-md text-text-primary"
                    >
                      <RadioGroupItem value={entry} />
                      {t(`growth.ui.item.dismissReason.${entry}`)}
                    </label>
                  ))}
                </RadioGroup>
              </fieldset>

              <Field label={t('growth.ui.item.dismissNote')}>
                {(control) => (
                  <Textarea
                    {...control}
                    autoGrow
                    minRows={2}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
                )}
              </Field>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDismissing(false)}>
              {t('action.cancel')}
            </Button>
            <Button
              variant="primary"
              data-item-id={itemId}
              onClick={() => {
                setDismissing(false);
                onDismiss(reason, note.trim());
              }}
            >
              {t('action.dismiss')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
