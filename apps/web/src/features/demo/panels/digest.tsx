import type { ReactNode } from 'react';

import { DemoPanel } from '../demo-frame';

/**
 * The weekly digest, written as sentences.
 *
 * This is the panel a fabricated dashboard would grow out of, so it is built
 * so that there is nowhere for one to grow. Every line describes something the
 * product did ("three platform-native versions went out from one draft"), and
 * nothing describes how anybody reacted to it. No reach, no impressions, no
 * score. That is not a stylistic preference: the product cannot read those
 * figures until a post has actually published, and a friendly sentence
 * carrying an invented one is still an invented one.
 *
 * The "Sample" chip is in the server HTML and is deliberately excluded from
 * the tour's entrance animation. An honesty label that fades into existence a
 * second after the content is a label somebody can miss, which defeats it.
 */

export interface DigestPanelProps {
  readonly label: string;
  /** Short honesty chip, for example "Sample". Never animated. */
  readonly sampleChip: string;
  readonly lines: readonly string[];
  /** "Live analytics appear here as your posts publish." */
  readonly footer: string;
}

export function DigestPanel({ label, sampleChip, lines, footer }: DigestPanelProps): ReactNode {
  return (
    <DemoPanel label={label}>
      <p className="border-border-default text-label text-text-tertiary mb-3 inline-flex rounded-full border px-2 py-1">
        {sampleChip}
      </p>
      <ul className="space-y-2">
        {lines.map((line) => (
          <li
            key={line}
            data-demo-enter
            className="text-body-md text-text-primary border-border-default border-s ps-3 leading-[1.6] text-pretty"
          >
            {line}
          </li>
        ))}
      </ul>
      <p className="text-body-sm text-text-tertiary mt-3 leading-[1.55]">{footer}</p>
    </DemoPanel>
  );
}
