'use client';

import { useId, useState, type ReactElement } from 'react';
import { Notice } from '@relay/design-system/patterns';
import {
  Button,
  Code,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Field,
  Input,
} from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';

import type { TrackedLinkView } from '../types';

/**
 * Changing where a published short URL points.
 *
 * This is the most consequential edit on the links screens, so the dialog says
 * all three of its consequences before the field: every published post that
 * carries this URL is affected, reports for earlier periods keep the
 * destination that was live then, and the change is written to the audit log
 * with a name attached.
 *
 * A reason is required. Not because the server needs one, but because an
 * audited change with no stated purpose is an audit entry nobody can act on six
 * months later.
 */

export interface DestinationEditDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly link: TrackedLinkView;
  readonly submitting: boolean;
  readonly onSubmit: (input: { readonly destination: string; readonly reason: string }) => void;
}

export function DestinationEditDialog({
  open,
  onOpenChange,
  link,
  submitting,
  onSubmit,
}: DestinationEditDialogProps): ReactElement {
  const t = useTranslations();
  const formId = useId();
  const [destination, setDestination] = useState(link.destination);
  const [reason, setReason] = useState('');

  const changed = destination.trim() !== link.destination && destination.trim().length > 0;
  const canSubmit = changed && reason.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" closeLabel={t('a11y.label.closeDialog')}>
        <DialogHeader>
          <DialogTitle>{t('analytics.links.editDestination')}</DialogTitle>
          <DialogDescription>{t('analytics.links.editDestinationWarning')}</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <form
            id={formId}
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (canSubmit) {
                onSubmit({ destination: destination.trim(), reason: reason.trim() });
              }
            }}
          >
            <div className="flex flex-col gap-1">
              <span className="text-label text-text-tertiary">{t('analytics.links.shortUrl')}</span>
              <Code>{link.shortUrl}</Code>
            </div>

            <Field label={t('analytics.links.createDestination')} required>
              {(control) => (
                <Input
                  {...control}
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                />
              )}
            </Field>

            <Field label={t('analytics.links.disableReason')} required>
              {(control) => (
                <Input
                  {...control}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              )}
            </Field>

            <Notice
              tone="neutral"
              title={t('analytics.links.editDestinationAudit')}
              description={t('analytics.links.destinationHistoryCurrent', {
                destination: link.destination,
                start: link.destinationHistory[0]?.activeFrom ?? link.createdAt,
              })}
            />
          </form>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="primary"
            loading={submitting}
            disabled={!canSubmit}
          >
            {t('action.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
