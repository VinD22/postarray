'use client';

import { useState, type ReactElement } from 'react';
import { Button } from '@relay/design-system/primitives';
import { Notice } from '@relay/design-system/patterns';
import { useAnnouncer } from '@relay/design-system/hooks';
import { useTranslations } from '@relay/i18n/react';
import { formatDateTime } from '@relay/i18n';

import { useNextQueueSlot, useProposeQueueSlot, useReleaseQueueSlot } from '../queries';
import { reasonLines } from '../reasons';

/**
 * The next queue slot, offered inside the composer.
 *
 * The proposal and every reason for it are shown BEFORE anything is accepted.
 * Choosing "use this time" fills the schedule fields; it does not publish, and
 * it does not schedule on its own. Releasing hands the instant back so somebody
 * else in the workspace can have it.
 */

export interface NextSlotPanelProps {
  /** Called with the accepted instant and zone. The sheet does the rest. */
  readonly onAccept: (slot: { instant: string; ianaTimeZone: string }) => void;
  readonly contentItemId?: string;
  readonly disabled?: boolean;
}

export function NextSlotPanel({
  onAccept,
  contentItemId,
  disabled = false,
}: NextSlotPanelProps): ReactElement {
  const t = useTranslations();
  const { announce } = useAnnouncer();
  const [open, setOpen] = useState(false);
  const preview = useNextQueueSlot(open);
  const propose = useProposeQueueSlot();
  const release = useReleaseQueueSlot();
  const [heldId, setHeldId] = useState<string | null>(null);

  const proposal = propose.data ?? preview.data ?? null;
  const reasons =
    proposal === null
      ? []
      : reasonLines(
          'ruleSnapshot' in proposal ? proposal.ruleSnapshot.reasons : proposal.reasons,
          (key, values) => t.full(key as 'queue.reason.noRulesConfigured', values),
          t.full('queue.slot.unavailable'),
        );

  return (
    <section aria-labelledby="queue-slot-heading" className="flex flex-col gap-3">
      <h3 id="queue-slot-heading" className="text-title-sm text-text-primary">
        {t.full('queue.slot.heading')}
      </h3>

      {open ? null : (
        <Button variant="secondary" disabled={disabled} onClick={() => setOpen(true)}>
          {t.full('queue.slot.action')}
        </Button>
      )}

      {open && proposal === null ? (
        <p className="text-body-sm text-text-tertiary" role="status">
          {preview.isError ? t.full('queue.slot.unavailable') : t.full('queue.slot.pending')}
        </p>
      ) : null}

      {proposal === null ? null : (
        <div className="flex flex-col gap-2">
          <p className="text-body-md text-text-primary tabular-nums">
            {t.full('queue.slot.proposed', {
              local: formatDateTime(t.locale, proposal.instant, {
                timeZone: proposal.ianaTimeZone,
                dateStyle: 'full',
                timeStyle: 'short',
              }),
              timeZone: proposal.ianaTimeZone,
            })}
          </p>
          <p className="text-body-sm text-text-secondary tabular-nums">
            {t.full('queue.slot.utc', {
              utc: formatDateTime(t.locale, proposal.instant, {
                timeZone: 'UTC',
                dateStyle: 'medium',
                timeStyle: 'short',
              }),
            })}
          </p>

          <h4 className="text-body-sm text-text-secondary">{t.full('queue.slot.why')}</h4>
          <ul className="text-body-sm text-text-secondary flex list-disc flex-col gap-1 ps-5">
            {reasons.map((reason) => (
              <li key={reason.id}>{reason.text}</li>
            ))}
          </ul>

          <Notice tone="info" title={t.full('queue.slot.notAutomatic')} />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              loading={propose.isPending}
              loadingLabel={t.full('queue.slot.pending')}
              onClick={() => {
                propose.mutate(
                  { ...(contentItemId === undefined ? {} : { contentItemId }) },
                  {
                    onSuccess: (reservation) => {
                      setHeldId(reservation.id);
                      onAccept({
                        instant: reservation.instant,
                        ianaTimeZone: reservation.ianaTimeZone,
                      });
                      announce(
                        t.full('queue.slot.accepted', {
                          local: formatDateTime(t.locale, reservation.instant, {
                            timeZone: reservation.ianaTimeZone,
                            dateStyle: 'full',
                            timeStyle: 'short',
                          }),
                          timeZone: reservation.ianaTimeZone,
                        }),
                        'polite',
                      );
                    },
                  },
                );
              }}
            >
              {t.full('queue.slot.accept')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                if (heldId !== null) {
                  release.mutate(heldId);
                  setHeldId(null);
                }
                setOpen(false);
              }}
            >
              {t.full('queue.slot.release')}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
