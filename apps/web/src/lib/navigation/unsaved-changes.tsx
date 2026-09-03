'use client';

/**
 * The one place the app knows somebody has work it has not written down yet.
 *
 * A screen with unsaved edits registers two things: a way to ask whether they
 * are still unsaved, and a way to ask the person whether they meant to leave.
 * `Link` consults the first on every click and awaits the second before it
 * navigates.
 *
 * Three things this deliberately does not do:
 *
 *  - It is a module-level registration, not React context. The links that most
 *    need guarding are in the app frame: the primary nav, the workspace
 *    switcher, the account menu. Those render above any screen in the tree, so
 *    a provider a screen could mount would not reach them. Exactly one screen
 *    holds unsaved work at a time, which is the whole of the state here.
 *  - It does not block the browser's own back button. That cannot be done
 *    honestly: the History API gives no cancellable event, and the trick of
 *    pushing a decoy entry breaks the forward button and the gesture on iOS.
 *    The draft mirror covers back, because the text is still on the device when
 *    the screen comes back.
 *  - It does not guard a reload on its own. The registrant installs
 *    `beforeunload` while it is dirty, because only it knows when that is.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ConfirmDialog } from '@relay/design-system/patterns';

import { useTranslations } from '@/lib/i18n';

export interface UnsavedChangesRegistration {
  /** True while there are edits the server has not accepted. */
  readonly isDirty: () => boolean;
  /** Resolves true when the person chose to leave anyway. */
  readonly confirmLeave: () => Promise<boolean>;
}

let registration: UnsavedChangesRegistration | null = null;

/** Register the current screen's unsaved work. Returns the unregister. */
export function registerUnsavedChanges(next: UnsavedChangesRegistration): () => void {
  registration = next;
  return () => {
    if (registration === next) {
      registration = null;
    }
  };
}

/** True when some screen has edits it has not saved. */
export function hasUnsavedChanges(): boolean {
  return registration?.isDirty() === true;
}

/**
 * Ask before leaving. Resolves true when navigation should go ahead, which is
 * also the answer when nothing is registered.
 */
export function confirmLeavingUnsaved(): Promise<boolean> {
  if (registration === null || !registration.isDirty()) {
    return Promise.resolve(true);
  }
  return registration.confirmLeave();
}

export interface UnsavedChangesPromptProps {
  /** Whether the screen has edits that are not on the server yet. */
  readonly dirty: boolean;
}

/**
 * Mounted by a screen that can hold unsaved work.
 *
 * It owns the confirmation, registers the screen while it is mounted, and adds
 * the browser's own reload warning only while there is something to warn about.
 * A permanently installed `beforeunload` handler would make every reload of a
 * clean composer ask a question with no answer worth having.
 */
export function UnsavedChangesPrompt({ dirty }: UnsavedChangesPromptProps): ReactNode {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const decide = useRef<((leave: boolean) => void) | null>(null);

  useEffect(
    () =>
      registerUnsavedChanges({
        isDirty: () => dirtyRef.current,
        confirmLeave: () =>
          new Promise<boolean>((resolve) => {
            decide.current = resolve;
            setOpen(true);
          }),
      }),
    [],
  );

  useEffect(() => {
    if (!dirty) {
      return;
    }
    const warn = (event: BeforeUnloadEvent): void => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => {
      window.removeEventListener('beforeunload', warn);
    };
  }, [dirty]);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        // Dismissing the dialog is a decision to stay, and the promise has to
        // settle either way or the click that opened it never finishes.
        if (!next) {
          decide.current?.(false);
          decide.current = null;
        }
      }}
      title={t.full('web.unsaved.title')}
      description={t.full('web.unsaved.body')}
      consequences={[
        { id: 'kept', text: t.full('web.unsaved.keptOnDevice') },
        { id: 'server', text: t.full('web.unsaved.notOnServer') },
      ]}
      confirmLabel={t.full('web.unsaved.leave')}
      cancelLabel={t.full('web.unsaved.stay')}
      closeLabel={t.full('action.close')}
      onConfirm={() => {
        decide.current?.(true);
        decide.current = null;
        setOpen(false);
      }}
    />
  );
}
