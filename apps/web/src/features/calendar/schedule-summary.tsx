'use client';

import type { ReactNode } from 'react';
import { Badge, Button } from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { bucketForState } from './filters';
import type { CalendarEntry, QueueBucket } from './types';

const BUCKETS: readonly QueueBucket[] = ['scheduled', 'draft', 'published', 'failed'];

export interface ScheduleSummaryProps {
  readonly entries: readonly CalendarEntry[];
  readonly selected: QueueBucket | null;
  readonly onSelect: (bucket: QueueBucket | null) => void;
}

/**
 * A compact operational readout for the visible schedule window.
 *
 * Every figure is also a filter. This keeps the row useful at high project
 * counts: a manager can see what happened, then narrow the same calendar with
 * one action instead of reconciling a separate dashboard.
 */
export function ScheduleSummary({ entries, selected, onSelect }: ScheduleSummaryProps): ReactNode {
  const t = useTranslations();
  const counts = new Map<QueueBucket, number>(BUCKETS.map((bucket) => [bucket, 0]));

  for (const entry of entries) {
    const bucket = bucketForState(entry.state);
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }

  return (
    <div
      role="group"
      aria-label={t('calendar.filter.status')}
      className="border-border-subtle flex gap-3 overflow-x-auto border-y py-3"
    >
      {BUCKETS.map((bucket) => {
        const active = selected === bucket;
        return (
          <Button
            key={bucket}
            type="button"
            size="sm"
            variant={active ? 'secondary' : 'ghost'}
            className="shrink-0 gap-2"
            aria-pressed={active}
            onClick={() => onSelect(active ? null : bucket)}
          >
            {t(`web.calendar.bucket.${bucket}`)}
            <Badge
              tone={bucket === 'failed' && (counts.get(bucket) ?? 0) > 0 ? 'warning' : 'neutral'}
            >
              {counts.get(bucket) ?? 0}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}
