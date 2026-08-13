import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

import type { DemoCheckView } from '../content';
import { DemoPanel } from '../demo-frame';

/**
 * The checks the composer runs before anything can be scheduled.
 *
 * Three rows, and they are the three the product genuinely performs: the
 * character limit the platform gives that account, alt text on every image,
 * and whether a first comment is offered on that platform at all. A fourth
 * row would have to be invented, and an invented check is a claim about a
 * capability, which is the same class of lie as an invented number.
 *
 * The tick is an icon plus the check's name plus a sentence saying what it
 * measures, so a passing row is never a green mark on its own. Under motion
 * the rows tick in one at a time; the finished state is what the server
 * renders, so a reader with motion off sees exactly the same list.
 */

export interface ValidationPanelProps {
  readonly label: string;
  readonly checks: readonly DemoCheckView[];
  readonly note: string;
}

export function ValidationPanel({ label, checks, note }: ValidationPanelProps): ReactNode {
  return (
    <DemoPanel label={label}>
      <ul className="space-y-2">
        {checks.map((check) => (
          <li
            key={check.id}
            data-demo-enter
            className="border-border-subtle bg-surface-canvas flex items-start gap-2 rounded-md border p-3"
          >
            <Check aria-hidden="true" className="text-success-fg mt-0.5 size-4 shrink-0" />
            <span className="min-w-0">
              <span className="text-body-md text-text-primary block leading-[1.5]">
                {check.label}
              </span>
              <span className="text-body-sm text-text-tertiary mt-1 block leading-[1.55]">
                {check.detail}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="text-body-sm text-text-tertiary mt-3 leading-[1.55]">{note}</p>
    </DemoPanel>
  );
}
