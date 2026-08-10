import { Check, CircleSlash, Minus, X } from 'lucide-react';
import type { ReactNode } from 'react';

import { ExternalLink, TextLink } from '@/features/marketing/components/links';
import { Meta } from '@/features/marketing/components/layout';

import { isInternalSource } from '../types';
import type { ComparisonCell, ComparisonVerdict } from '../types';

/**
 * One cell of a comparison table.
 *
 * Three rules are enforced here rather than left to each page:
 *
 *  1. The verdict is always a word, never only an icon and never only a
 *    colour. The icon is decorative and marked as such.
 *  2. The detail sentence is always rendered. A bare yes on a comparison page
 *     is an assertion; a yes with the sentence behind it is a claim somebody
 *     can check.
 *  3. The source is rendered as a link with the date it was read, so the age of
 *     the claim travels with the claim. A cell with no source can only be
 *     `notVerified`, which the type and the test both enforce, and its own
 *     wording says why it is empty.
 */

const VERDICT_ICON: Readonly<Record<ComparisonVerdict, typeof Check>> = {
  yes: Check,
  no: X,
  partial: Minus,
  notVerified: CircleSlash,
};

/**
 * `text-accent` and `destructive-fg` are the two text tones verified for
 * contrast on paper. Partial and unverified deliberately stay on the ordinary
 * secondary and tertiary text tones rather than inventing a third status hue.
 */
const VERDICT_TONE: Readonly<Record<ComparisonVerdict, string>> = {
  yes: 'text-text-accent',
  no: 'text-destructive-fg',
  partial: 'text-text-secondary',
  notVerified: 'text-text-tertiary',
};

export interface ComparisonCellViewProps {
  readonly cell: ComparisonCell;
  /** Already translated word for the verdict. Required: never icon only. */
  readonly verdictLabel: string;
  /** Already formatted "Read <date>" line. Absent when there is no source. */
  readonly readLabel?: string;
}

export function ComparisonCellView({
  cell,
  verdictLabel,
  readLabel,
}: ComparisonCellViewProps): ReactNode {
  const Icon = VERDICT_ICON[cell.verdict];

  return (
    <div className="max-w-[42ch] space-y-2">
      <span className={`inline-flex items-center gap-1.5 ${VERDICT_TONE[cell.verdict]}`}>
        <Icon aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.5} />
        <span className="text-body-md">{verdictLabel}</span>
      </span>
      <p className="text-body-sm text-text-secondary leading-[1.6]">{cell.detail}</p>
      {cell.source === undefined ? null : (
        <p className="text-body-sm leading-[1.6]">
          {isInternalSource(cell.source) ? (
            <TextLink href={cell.source.url}>{cell.source.title}</TextLink>
          ) : (
            <ExternalLink href={cell.source.url}>{cell.source.title}</ExternalLink>
          )}{' '}
          {readLabel === undefined ? null : <Meta>{readLabel}</Meta>}
        </p>
      )}
    </div>
  );
}
