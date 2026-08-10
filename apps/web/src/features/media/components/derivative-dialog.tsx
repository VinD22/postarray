'use client';

/**
 * The picture editor as a dialog, reachable from the library and from the
 * composer's media strip.
 *
 * One component owns the whole interaction, so both entry points get the same
 * rules: the same validation, the same refusal sentences, the same statement
 * that the original is kept, and the same version list underneath. A person who
 * learns this in the library does not have to learn it again while composing.
 *
 * The dialog is a form. Nothing is edited in the browser and nothing is
 * previewed by decoding bytes here: the request goes to the API, which
 * validates it against the real picture and hands the transform to the worker.
 */

import { useEffect, type ReactNode } from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useTranslations } from '@relay/i18n/react';

import { useDerivatives } from '../hooks/use-derivatives';
import { DerivativeEditor, type DerivativeEditorSource } from './derivative-editor';
import { DerivativeList } from './derivative-list';

export interface DerivativeDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly source: DerivativeEditorSource & { readonly byteSize: number };
  /** Null means the original is in use. Omit when nothing is choosing yet. */
  readonly selectedDerivativeId?: string | null;
  readonly onSelectDerivative?: (derivativeId: string | null) => void;
}

export function DerivativeDialog({
  open,
  onOpenChange,
  source,
  selectedDerivativeId,
  onSelectDerivative,
}: DerivativeDialogProps): ReactNode {
  const t = useTranslations();
  const state = useDerivatives(open ? source.id : null);

  useEffect(() => {
    if (!open) {
      state.reset();
    }
    // `reset` is stable, and re-running on every state change would clear the
    // refusal the person is currently reading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" closeLabel={t.full('action.close')}>
        <DialogHeader>
          <DialogTitle>{t.full('mediaLib.derivative.heading')}</DialogTitle>
          <DialogDescription>{t.full('mediaLib.derivative.description')}</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-6">
          <DerivativeEditor
            source={source}
            busy={state.busy}
            failure={state.failure}
            onApply={state.apply}
            onCancel={() => onOpenChange(false)}
          />

          {state.alreadyExisted ? (
            <Notice tone="info" title={t.full('mediaLib.derivative.alreadyExists')} />
          ) : null}

          <DerivativeList
            derivatives={state.derivatives}
            original={{
              mimeType: source.mimeType,
              byteSize: source.byteSize,
              width: source.width,
              height: source.height,
            }}
            processing={state.processing}
            {...(selectedDerivativeId === undefined
              ? {}
              : { selectedDerivativeId })}
            {...(onSelectDerivative === undefined ? {} : { onSelect: onSelectDerivative })}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
