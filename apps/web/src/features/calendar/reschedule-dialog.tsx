'use client';

/**
 * The move confirmation.
 *
 * A drop or a keyboard move never writes silently. This dialog states the
 * exact before and after time in the workspace zone and in UTC, lists every
 * warning the pure checker produced, and, when the post already exists on the
 * platform, makes the person choose between moving the local record and
 * scheduling a second, separate external post. Those are genuinely different
 * things and merging them would either lie about the calendar or duplicate a
 * post without being asked.
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
  Label,
  Notice,
  RadioGroup,
  RadioGroupItem,
  cn,
  useAnnouncer,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { AccountIdentity, useProviderName } from '@/features/connections/provider';
import { useCalendarFormat } from './format';
import { hasExternalPost, isBlocked } from './reschedule';
import type { PublishedMoveMode, RescheduleProposal, RescheduleWarning } from './types';

export interface RescheduleDialogProps {
  proposal: RescheduleProposal | null;
  warnings: readonly RescheduleWarning[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submitting: boolean;
  onConfirm: (proposal: RescheduleProposal, mode: PublishedMoveMode | null) => void;
}

export function RescheduleDialog({
  proposal,
  warnings,
  open,
  onOpenChange,
  submitting,
  onConfirm,
}: RescheduleDialogProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();
  const { announce } = useAnnouncer();
  const [mode, setMode] = useState<PublishedMoveMode>('local_record_only');

  useEffect(() => {
    if (open) setMode('local_record_only');
  }, [open, proposal?.toInstant]);

  if (!proposal) return null;

  const entry = proposal.entry;
  const published = hasExternalPost(entry.state);
  const blocked = isBlocked(warnings);

  const handleConfirm = (): void => {
    announce(
      t('a11y.announce.rescheduled', {
        time: format.dateTime(proposal.toInstant),
        timeZone: format.timeZone,
      }),
    );
    onConfirm(proposal, published ? mode : null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={t('a11y.label.closeDialog')}
        size={published ? 'lg' : 'md'}
        role="alertdialog"
      >
        <DialogHeader>
          <DialogTitle>{t('web.calendar.reschedule.title')}</DialogTitle>
          <DialogDescription>
            {t('calendar.drag.confirmBody', {
              from: format.dateTime(proposal.fromInstant),
              to: format.dateTime(proposal.toInstant),
              timeZone: format.timeZone,
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

            {/* The two times, side by side, with UTC beside each. A reviewer
                comparing them must never have to hold one in their head. */}
            <dl className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[7rem_1fr]">
              <dt className="text-label text-text-tertiary">
                {t('receipt.times.scheduled')}
              </dt>
              <dd className="text-body-md tabular-nums text-text-secondary">
                <time dateTime={proposal.fromInstant}>
                  {t('web.calendar.reschedule.from', {
                    local: format.dateTime(proposal.fromInstant),
                    utc: format.utc(proposal.fromInstant),
                  })}
                </time>
              </dd>
              <dt className="text-label text-text-tertiary">{t('common.now')}</dt>
              <dd className="text-body-md tabular-nums font-medium text-text-primary">
                <time dateTime={proposal.toInstant}>
                  {t('web.calendar.reschedule.to', {
                    local: format.dateTime(proposal.toInstant),
                    utc: format.utc(proposal.toInstant),
                  })}
                </time>
              </dd>
            </dl>

            <ul className="flex flex-col gap-2">
              {warnings.map((warning) => (
                <li key={warning.id}>
                  <WarningNotice warning={warning} />
                </li>
              ))}
            </ul>

            {published ? (
              <PublishedChoice
                provider={providerName(entry.provider)}
                permalink={entry.permalink ?? null}
                value={mode}
                onChange={setMode}
              />
            ) : null}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" autoFocus onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button
            variant="primary"
            disabled={blocked}
            loading={submitting}
            loadingLabel={t('loading.default')}
            onClick={handleConfirm}
          >
            {published && mode === 'schedule_new_post'
              ? t('action.schedule')
              : t('web.calendar.reschedule.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WarningNotice({ warning }: { warning: RescheduleWarning }): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();

  switch (warning.kind) {
    case 'in_the_past':
      return (
        <Notice
          tone="destructive"
          title={t('web.calendar.reschedule.pastTitle')}
          description={t('web.calendar.reschedule.pastBody')}
        />
      );
    case 'dst':
      return (
        <Notice
          tone="warning"
          title={t('web.calendar.reschedule.dstTitle')}
          description={t('web.calendar.reschedule.dstBody', {
            timeZone: format.timeZone,
            fromOffset: formatOffset(Number(warning.values.fromOffsetMinutes ?? 0)),
            toOffset: formatOffset(Number(warning.values.toOffsetMinutes ?? 0)),
          })}
        />
      );
    case 'account_conflict':
      return (
        <Notice
          tone="warning"
          title={t('web.calendar.reschedule.conflictTitle')}
          description={t('web.calendar.reschedule.conflictBody', {
            account: String(warning.values.account ?? ''),
            count: Number(warning.values.count ?? 0),
            window: format.duration(Number(warning.values.windowMinutes ?? 0) * 60_000),
          })}
        />
      );
    case 'campaign_window':
      return (
        <Notice
          tone="warning"
          title={t('web.calendar.reschedule.campaignTitle')}
          description={t('web.calendar.reschedule.campaignBody', {
            campaign: String(warning.values.campaign ?? ''),
            start: format.date(String(warning.values.startsAt ?? '')),
            end: format.date(String(warning.values.endsAt ?? '')),
          })}
        />
      );
    case 'short_lead_time':
      return (
        <Notice
          tone="warning"
          title={t('web.calendar.reschedule.leadTimeTitle')}
          description={t('web.calendar.reschedule.leadTimeBody', {
            duration: format.duration(Number(warning.values.availableSeconds ?? 0) * 1000),
            required: format.duration(Number(warning.values.requiredSeconds ?? 0) * 1000),
            provider: providerName(
              warning.values.provider as Parameters<typeof providerName>[0],
            ),
          })}
        />
      );
    default:
      return null;
  }
}

function PublishedChoice({
  provider,
  permalink,
  value,
  onChange,
}: {
  provider: string;
  permalink: string | null;
  value: PublishedMoveMode;
  onChange: (value: PublishedMoveMode) => void;
}): ReactNode {
  const t = useTranslations();

  return (
    <fieldset className="flex flex-col gap-2 rounded-lg border border-warning-border bg-warning-bg p-3">
      <legend className="px-1 text-body-md font-medium text-warning-fg">
        {t('web.calendar.published.title')}
      </legend>
      <p className="text-body-sm text-text-secondary">
        {t('web.calendar.published.body', {
          provider,
          permalinkLabel: permalink ?? t('receipt.permalinkUnavailable', { provider }),
        })}
      </p>

      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as PublishedMoveMode)}
        aria-label={t('web.calendar.published.optionLabel')}
        className="flex flex-col gap-2"
      >
        <ChoiceRow
          id="reschedule-mode-local"
          value="local_record_only"
          title={t('web.calendar.published.optionLocal')}
          hint={t('web.calendar.published.optionLocalHint')}
        />
        <ChoiceRow
          id="reschedule-mode-new"
          value="schedule_new_post"
          title={t('web.calendar.published.optionNew')}
          hint={t('web.calendar.published.optionNewHint', { provider })}
        />
      </RadioGroup>
    </fieldset>
  );
}

function ChoiceRow({
  id,
  value,
  title,
  hint,
}: {
  id: string;
  value: PublishedMoveMode;
  title: string;
  hint: string;
}): ReactNode {
  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-md border border-border-default',
        'bg-surface-raised p-2.5',
      )}
    >
      <RadioGroupItem id={id} value={value} className="mt-0.5" />
      <span className="flex min-w-0 flex-col gap-0.5">
        <Label htmlFor={id} className="text-body-md text-text-primary">
          {title}
        </Label>
        <span className="text-body-sm text-text-secondary">{hint}</span>
      </span>
    </div>
  );
}

/** "+02:00" style offset from a signed minute count. Not locale sensitive. */
function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? '-' : '+';
  const absolute = Math.abs(minutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, '0');
  const rest = String(absolute % 60).padStart(2, '0');
  return `${sign}${hours}:${rest}`;
}
