import type { ReactNode } from 'react';
import { DefinitionList, Timeline } from '@relay/design-system/patterns';

import { LiveBadge } from '@/components/motion';

import { DemoPanel } from '../demo-frame';

/**
 * The receipt, as far as it can honestly go.
 *
 * The first three lines are things the product really records: who wrote the
 * draft, who approved it and under which policy, and the instant it was
 * scheduled for. The rest of a receipt is written by the publish run, and
 * there is no publish run: no connector has passed provider verification. So
 * those lines are `pending` rather than `completed`, and the two fields a
 * finished receipt would carry read "Unavailable" rather than being quietly
 * left off or, worse, filled with a plausible looking post ID.
 *
 * "Unavailable" and not "0", and not an empty cell. That is the same rule the
 * product follows everywhere else, and a demonstration that broke it here
 * would be teaching the reader to distrust every other number on the site.
 */

export interface ReceiptStep {
  readonly id: string;
  readonly title: string;
  /** Already formatted in the project time zone. */
  readonly timestamp?: string;
  readonly isoTimestamp?: string;
  /** False for a step the publish run would write, which does not run today. */
  readonly done: boolean;
}

export interface ReceiptField {
  readonly id: string;
  readonly term: string;
  readonly value: string;
}

export interface ReceiptPanelProps {
  readonly label: string;
  readonly steps: readonly ReceiptStep[];
  readonly pending: string;
  readonly fields: readonly ReceiptField[];
}

export function ReceiptPanel({ label, steps, pending, fields }: ReceiptPanelProps): ReactNode {
  return (
    <DemoPanel label={label}>
      <Timeline
        label={label}
        events={steps.map((step) => ({
          id: step.id,
          title: step.title,
          outcome: step.done ? ('completed' as const) : ('pending' as const),
          ...(step.timestamp === undefined ? {} : { timestamp: step.timestamp }),
          ...(step.isoTimestamp === undefined ? {} : { isoTimestamp: step.isoTimestamp }),
        }))}
      />
      <DefinitionList
        className="mt-4"
        layout="rows"
        items={fields.map((field) => ({
          id: field.id,
          term: field.term,
          definition: field.value,
        }))}
      />
      <p className="text-body-sm text-text-tertiary mt-3 leading-[1.55]">{pending}</p>
    </DemoPanel>
  );
}

export interface LiveReceiptPanelProps extends ReceiptPanelProps {
  /**
   * Whether a real publish run wrote the other half of this receipt.
   *
   * False today, and it must stay false until a connector passes provider
   * verification. It is a prop rather than a constant so that reaching the
   * live state is a data change rather than a redesign: the day publishing
   * works, the same panel already knows how to show it.
   */
  readonly published: boolean;
  readonly liveLabel: string;
  readonly pendingLabel: string;
}

/**
 * The receipt panel, plus the badge that says whether the post is actually
 * live.
 *
 * This is the scene the whole tour builds towards, so it is also the scene
 * most tempting to overstate. It refuses: with `published` false the badge
 * reads "not published", the publish steps stay `pending` and the fields a
 * finished receipt would carry read "Unavailable". A visitor sees the shape of
 * the record without being shown a post that never went out.
 */
export function LiveReceiptPanel({
  published,
  liveLabel,
  pendingLabel,
  ...receipt
}: LiveReceiptPanelProps): ReactNode {
  return (
    <div className="grid gap-3">
      <LiveBadge live={published} label={published ? liveLabel : pendingLabel} />
      <ReceiptPanel {...receipt} />
    </div>
  );
}
