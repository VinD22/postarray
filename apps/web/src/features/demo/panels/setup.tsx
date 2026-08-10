import type { ReactNode } from 'react';
import { Clock3, FolderOpen } from 'lucide-react';

import { ProviderMark } from '@/features/connections/provider';

import type { DemoVariantView } from '../content';
import { DemoPanel } from '../demo-frame';

/**
 * The first two steps: the project everything is scoped to, and the accounts
 * inside it.
 *
 * The account rows are where a demonstration is most tempted to lie. A green
 * "Connected" chip beside three platform names would be a claim that this
 * product can post to them today, and it cannot: no connector has passed
 * provider verification, so every one of them is off. The rows therefore carry
 * the true state in words, next to an icon, on every row, and the step's own
 * copy repeats it in prose.
 */

export interface ProjectPanelProps {
  readonly label: string;
  readonly project: string;
  /** "Time zone: Central European Summer Time (GMT+2)". */
  readonly zoneLine: string;
  readonly scope: string;
}

export function ProjectPanel({ label, project, zoneLine, scope }: ProjectPanelProps): ReactNode {
  return (
    <DemoPanel label={label}>
      <p className="text-title-sm text-text-primary flex items-center gap-2">
        <FolderOpen aria-hidden="true" className="text-text-tertiary size-4 shrink-0" />
        <span className="min-w-0">{project}</span>
      </p>
      <p className="text-body-sm text-text-secondary mt-3">{zoneLine}</p>
      <p className="text-body-sm text-text-tertiary mt-2 leading-[1.55]">{scope}</p>
    </DemoPanel>
  );
}

export interface AccountPanelProps {
  readonly label: string;
  readonly accounts: readonly DemoVariantView[];
  /** The true state of every connector today, in words. */
  readonly state: string;
  readonly note: string;
}

export function AccountPanel({ label, accounts, state, note }: AccountPanelProps): ReactNode {
  return (
    <DemoPanel label={label}>
      <ul className="space-y-2">
        {accounts.map((account) => (
          <li
            key={account.id}
            className="border-border-subtle bg-surface-canvas flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-md border p-3"
          >
            <span className="text-body-md text-text-primary flex min-w-0 items-center gap-2">
              <ProviderMark provider={account.provider} />
              <span className="min-w-0">{account.account}</span>
            </span>
            <span className="text-body-sm text-text-secondary flex items-center gap-1.5">
              <Clock3 aria-hidden="true" className="size-4 shrink-0" />
              {state}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-body-sm text-text-tertiary mt-3 leading-[1.55]">{note}</p>
    </DemoPanel>
  );
}
