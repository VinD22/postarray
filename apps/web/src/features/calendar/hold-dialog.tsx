'use client';

/**
 * Pausing and resuming a scheduled post.
 *
 * One dialog, two intents, because they are the same decision seen from either
 * side of a hold and splitting them would let the two copies drift.
 *
 * The copy is the feature. A person pausing a post needs to be told exactly
 * what stops and exactly what does not: this post will not go out at its time,
 * and anything already published stays published. Saying "cancel" or "undo"
 * here would promise something the product cannot do, and no provider API
 * offers to unsend a post because we changed our mind.
 *
 * The resume side has one rule of its own. If the instant passed while the post
 * sat paused, resuming it would publish immediately, so the dialog asks for a
 * new time instead. The server refuses without one, and this is the interface
 * that makes that refusal impossible to hit by accident.
 */

import { useEffect, useState, type ReactNode } from 'react';
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
  Input,
  Notice,
  Textarea,
  useAnnouncer,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';

import { AccountIdentity } from '@/features/connections/provider';
import { useCalendarFormat } from './format';
import { resumeNeedsNewTime } from './hold';
import type { CalendarEntry } from './types';

export type HoldIntent = 'pause' | 'resume';

export interface HoldDialogProps {
  entry: CalendarEntry | null;
  intent: HoldIntent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting: boolean;
  /** The zone the picker reads and writes in. Never the browser's. */
  timeZone: string;
  /** Injected so the missed-instant branch is testable and not clock-flaky. */
  now?: Date;
  onPause: (input: { entry: CalendarEntry; note: string | null }) => void;
  onResume: (input: {
    entry: CalendarEntry;
    toInstant?: string;
    timeZone?: string;
  }) => void;
}

/**
 * A `datetime-local` value for the picker.
 *
 * Deliberately empty rather than prefilled with "now plus an hour". A guessed
 * time is a time somebody publishes without reading, and this dialog exists
 * precisely because the last time was wrong.
 */
function toLocalInputValue(instant: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(instant));
  const read = (type: string): string => parts.find((part) => part.type === type)?.value ?? '';
  const hour = read('hour') === '24' ? '00' : read('hour');
  return `${read('year')}-${read('month')}-${read('day')}T${hour}:${read('minute')}`;
}

export function HoldDialog({
  entry,
  intent,
  open,
  onOpenChange,
  submitting,
  timeZone,
  now,
  onPause,
  onResume,
}: HoldDialogProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const { announce } = useAnnouncer();
  const [note, setNote] = useState('');
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    if (!open) return;
    setNote('');
    setLocalTime('');
  }, [open, entry?.publishJobId, intent]);

  if (!entry) return null;

  const at = now ?? new Date();
  const needsNewTime = intent === 'resume' && resumeNeedsNewTime(entry.scheduledAt, at);
  const chosenInstant = localTime === '' ? null : instantFromLocal(localTime, timeZone);
  const readyToResume = !needsNewTime || (chosenInstant !== null && chosenInstant.getTime() > at.getTime());

  const handleConfirm = (): void => {
    if (intent === 'pause') {
      announce(t('calendar.hold.paused'));
      onPause({ entry, note: note.trim() === '' ? null : note.trim() });
      return;
    }
    if (!needsNewTime) {
      announce(t('calendar.hold.resumed', { time: format.dateTime(entry.scheduledAt) }));
      onResume({ entry });
      return;
    }
    if (chosenInstant === null) return;
    const iso = chosenInstant.toISOString();
    announce(t('calendar.hold.resumed', { time: format.dateTime(iso) }));
    onResume({ entry, toInstant: iso, timeZone });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t('a11y.label.closeDialog')} size="md" role="alertdialog">
        <DialogHeader>
          <DialogTitle>
            {intent === 'pause'
              ? t('calendar.hold.confirmTitle')
              : needsNewTime
                ? t('calendar.hold.resumeMissedTitle')
                : t('calendar.hold.resumeTitle')}
          </DialogTitle>
          <DialogDescription>
            {intent === 'pause'
              ? t('calendar.hold.confirmBody', { time: format.dateTime(entry.scheduledAt) })
              : needsNewTime
                ? t('calendar.hold.resumeMissedBody', {
                    time: format.dateTime(entry.scheduledAt),
                  })
                : t('calendar.hold.resumeBody', {
                    time: format.dateTime(entry.scheduledAt),
                    timeZone: format.zoneLabel(),
                  })}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-4">
            <AccountIdentity
              provider={entry.provider}
              accountLabel={entry.accountLabel}
              secondary={entry.title.trim() || t('web.calendar.entry.untitled')}
            />

            {intent === 'pause' ? (
              <>
                {/* The boundary of the action, stated rather than implied. */}
                <Notice
                  tone="info"
                  title={t('calendar.hold.term')}
                  description={t('calendar.hold.confirmScope')}
                />
                <Field
                  label={t('calendar.hold.confirmNoteLabel')}
                  description={t('calendar.hold.confirmNoteHint')}
                >
                  {(control) => (
                    <Textarea
                      {...control}
                      rows={3}
                      value={note}
                      maxLength={280}
                      onChange={(event) => setNote(event.target.value)}
                    />
                  )}
                </Field>
              </>
            ) : null}

            {needsNewTime ? (
              <Field
                label={t('calendar.hold.resumeTimeLabel')}
                description={t('calendar.timeZoneNote', { timeZone: format.zoneLabel() })}
                required
              >
                {(control) => (
                  <Input
                    {...control}
                    type="datetime-local"
                    value={localTime}
                    onChange={(event) => setLocalTime(event.target.value)}
                    min={toLocalInputValue(at.toISOString(), timeZone)}
                  />
                )}
              </Field>
            ) : null}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" autoFocus onClick={() => onOpenChange(false)}>
            {intent === 'pause' ? t('calendar.hold.cancel') : t('action.cancel')}
          </Button>
          <Button
            variant="primary"
            disabled={intent === 'resume' && !readyToResume}
            loading={submitting}
            loadingLabel={t('loading.default')}
            onClick={handleConfirm}
          >
            {intent === 'pause' ? t('calendar.hold.confirm') : t('calendar.hold.resumeConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * A wall clock reading in a named zone, back to an absolute instant.
 *
 * The offset is measured at the candidate instant itself rather than assumed,
 * which is what keeps a time chosen either side of a daylight saving change
 * landing on the hour the person actually typed.
 */
export function instantFromLocal(localValue: string, timeZone: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(localValue);
  if (match === null) return null;
  const asUtc = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
  );
  const offset = offsetMinutesAt(new Date(asUtc), timeZone);
  const candidate = new Date(asUtc - offset * 60_000);
  // One correction pass, so a reading on the far side of a transition resolves
  // against its own offset rather than the one before it.
  const corrected = offsetMinutesAt(candidate, timeZone);
  return corrected === offset ? candidate : new Date(asUtc - corrected * 60_000);
}

function offsetMinutesAt(instant: Date, timeZone: string): number {
  const name =
    new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
      .formatToParts(instant)
      .find((part) => part.type === 'timeZoneName')?.value ?? 'GMT+00:00';
  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(name);
  if (match === null) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}
