import type { ReactNode } from 'react';
import { cn } from '@relay/design-system/utils';

import type { AgentToolRisk } from '../../data/agent-tools';

/**
 * The agent tool ledger: what an agent connected to Relay can actually call,
 * grouped by how much damage a call can do.
 *
 * This is deliberately not three feature cards. Blast radius is a ladder —
 * reads change nothing, reversible calls change something inside Relay, and
 * consequential calls reach a platform — and three equal boxes would flatten
 * the one thing worth understanding here. It is a ledger: three rows, each a
 * label plus a rule plus the real tool names, in ascending order of
 * consequence, so the reader arrives at the confirmation step already knowing
 * why it exists.
 *
 * ## Colour
 *
 * Each tier takes one of the three accent families (ultramarine, marigold,
 * vermilion) as a rule under its label. Colour is never the carrier: the tier
 * is named in text, counted in text, and its rule is stated in a sentence.
 * Turn the page greyscale and nothing is lost.
 *
 * ## No motion
 *
 * Every string here is server HTML. The section it sits in already owns the
 * page's entrance; a ledger that animated its own rows would be a second
 * authored moment on one surface.
 */

const ACCENT_RULE: Readonly<Record<AgentToolRisk, string>> = {
  read: 'bg-accent-cool',
  reversible: 'bg-accent-warm',
  consequential: 'bg-accent-action',
};

export interface AgentToolLedgerTier {
  readonly risk: AgentToolRisk;
  /** The tier's name, translated. "Read", "Reversible", "Consequential". */
  readonly label: string;
  /** What this tier may and may not do, in one sentence. Translated. */
  readonly rule: string;
  /** How many tools sit in the tier, already formatted for the locale. */
  readonly count: string;
  /** Real tool names from `data/agent-tools.ts`. Identifiers, never prose. */
  readonly tools: readonly string[];
}

export interface AgentToolLedgerProps {
  readonly tiers: readonly AgentToolLedgerTier[];
  readonly className?: string;
}

export function AgentToolLedger({ tiers, className }: AgentToolLedgerProps): ReactNode {
  return (
    <dl className={cn('border-border-default border-t', className)}>
      {tiers.map((tier) => (
        <div
          key={tier.risk}
          className="border-border-subtle grid gap-x-10 gap-y-4 border-b py-8 lg:grid-cols-12"
        >
          <dt className="lg:col-span-3">
            <span
              aria-hidden="true"
              className={cn('mb-3 block h-1 w-12 rounded-xs', ACCENT_RULE[tier.risk])}
            />
            <span className="text-title-sm text-text-primary block">{tier.label}</span>
            <span className="text-body-sm text-text-tertiary mt-1 block tabular-nums">
              {tier.count}
            </span>
          </dt>
          <dd className="min-w-0 lg:col-span-9">
            <p className="text-body-lg text-text-secondary max-w-[62ch] leading-[1.6]">
              {tier.rule}
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
              {tier.tools.map((tool) => (
                <li
                  key={tool}
                  className={cn(
                    'border-border-subtle bg-surface-raised rounded-sm border px-2 py-1',
                    'text-mono text-text-primary font-mono',
                  )}
                >
                  {tool}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
