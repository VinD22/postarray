import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

import { ProviderMark } from '@/features/connections/provider';

import type { DemoVariantView } from '../content';
import { DemoPanel } from '../demo-frame';

/**
 * The compose half of the demonstration: one master draft, then the version
 * each account actually receives.
 *
 * The variants are a list, not three cards in a row. They are three instances
 * of the same shape and a row per instance survives a long translation, a
 * narrow phone and a right to left direction, none of which a fixed three
 * column card grid does.
 *
 * The platform is carried twice, by the identity dot and by the account line
 * beside it, so the dot is never the only thing naming the platform. No logo,
 * no lockup, no brand wordmark: the platform's own name in text is the honest
 * amount of somebody else's brand to put on our marketing site.
 */

export interface MasterDraftPanelProps {
  readonly label: string;
  /** Sample draft body. */
  readonly body: string;
  /** "In project Northbound Tools (sample)". */
  readonly projectLine: string;
}

export function MasterDraftPanel({ label, body, projectLine }: MasterDraftPanelProps): ReactNode {
  return (
    <DemoPanel label={label}>
      {/*
        The draft is the only thing on this panel, and on a wide stage it is
        the one piece of sample content a reader is meant to actually read, so
        it is set at the size a draft is written at rather than at body size in
        a column three times its measure.
      */}
      <p className="text-body-md lg:text-title-sm text-text-primary max-w-[48ch] leading-[1.55] text-pretty">
        {body}
      </p>
      <p className="text-body-sm text-text-tertiary mt-3">{projectLine}</p>
    </DemoPanel>
  );
}

export interface VariantListPanelProps {
  readonly label: string;
  readonly variants: readonly DemoVariantView[];
}

export function VariantListPanel({ label, variants }: VariantListPanelProps): ReactNode {
  return (
    <DemoPanel label={label}>
      <ul className="space-y-2">
        {variants.map((variant) => (
          <li
            key={variant.id}
            className="border-border-subtle bg-surface-canvas rounded-md border p-3"
          >
            <p className="flex items-center gap-2">
              <ProviderMark provider={variant.provider} />
              <span className="text-body-sm text-text-secondary">{variant.account}</span>
            </p>
            <p className="text-body-md text-text-primary mt-2 leading-[1.55] text-pretty">
              {variant.body}
            </p>
            <p className="text-body-sm text-text-tertiary mt-2 flex items-start gap-2 leading-[1.5]">
              <Check aria-hidden="true" className="text-success-fg mt-0.5 size-4 shrink-0" />
              <span className="min-w-0">{variant.check}</span>
            </p>
          </li>
        ))}
      </ul>
    </DemoPanel>
  );
}
