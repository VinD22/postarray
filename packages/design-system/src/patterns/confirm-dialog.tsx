'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn.js';
import { Button } from '../primitives/button.js';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../primitives/dialog.js';
import { Input } from '../primitives/input.js';
import { Label } from '../primitives/label.js';

export interface ConfirmDialogConsequence {
  readonly id: string;
  /** One external effect, stated plainly. */
  readonly text: ReactNode;
}

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  /**
   * What is about to happen. For a destructive action this must describe the
   * effect outside the product: "The three posts already published to
   * LinkedIn stay online" is the sentence people need, not "This cannot be
   * undone".
   */
  description: ReactNode;
  /**
   * The exact external effects, one per line. Enumerating them is what turns a
   * confirmation from a speed bump into a decision.
   */
  consequences?: readonly ConfirmDialogConsequence[];
  confirmLabel: string;
  cancelLabel: string;
  closeLabel: string;
  onConfirm: () => void | Promise<void>;
  tone?: 'default' | 'destructive';
  /**
   * Require the user to type this exact string before confirming. Use for
   * irreversible workspace-level actions only; asking for it on every delete
   * trains people to type without reading.
   */
  confirmationPhrase?: string | undefined;
  /** Label above the confirmation field, from the message catalog. */
  confirmationLabel?: ReactNode;
  /** Extra content: the affected objects, a preview of what will be removed. */
  children?: ReactNode;
}

/**
 * A confirmation for an action with an external effect.
 *
 * The default focus is the cancel button, not the confirm button, so a stray
 * Enter cannot publish or disconnect anything. Confirm is only ever the
 * destructive variant when the action is genuinely destructive.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  consequences,
  confirmLabel,
  cancelLabel,
  closeLabel,
  onConfirm,
  tone = 'default',
  confirmationPhrase,
  confirmationLabel,
  children,
}: ConfirmDialogProps): ReactNode {
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const phraseId = useId();

  const phraseSatisfied =
    !confirmationPhrase || typed.trim() === confirmationPhrase.trim();

  const handleConfirm = async (): Promise<void> => {
    if (!phraseSatisfied || busy) return;
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setTyped('');
        onOpenChange(next);
      }}
    >
      <DialogContent closeLabel={closeLabel} size="sm" role="alertdialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {consequences?.length || children || confirmationPhrase ? (
          <DialogBody>
            <div className="flex flex-col gap-3">
              {consequences && consequences.length > 0 ? (
                <ul className="flex flex-col gap-1.5">
                  {consequences.map((consequence) => (
                    <li
                      key={consequence.id}
                      className={cn(
                        'flex gap-2 text-body-md text-text-secondary',
                        'before:mt-2 before:size-1 before:shrink-0 before:rounded-full',
                        'before:bg-text-tertiary before:content-[""]',
                      )}
                    >
                      <span>{consequence.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {children}

              {confirmationPhrase ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={phraseId}>{confirmationLabel}</Label>
                  <Input
                    id={phraseId}
                    value={typed}
                    autoComplete="off"
                    onChange={(event) => setTyped(event.target.value)}
                  />
                </div>
              ) : null}
            </div>
          </DialogBody>
        ) : null}

        <DialogFooter>
          <Button
            variant="secondary"
            autoFocus
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'destructive' ? 'destructive' : 'primary'}
            loading={busy}
            disabled={!phraseSatisfied}
            onClick={() => {
              void handleConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
