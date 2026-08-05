'use client';

/**
 * The account and platform rail. Two levels: saved Sets, then the target
 * accounts themselves.
 *
 * Every target shows its state as a dot plus a word, its live character count
 * against its own limit, and its media count. Selecting several targets never
 * hides that they differ: the divergence line under the list says how many have
 * their own version, and each row says so on its own.
 */

import { useMemo, useState, type ReactNode } from 'react';
import { Check, Plus, X as RemoveIcon } from 'lucide-react';
import {
  Button,
  IconButton,
  Input,
  StatusDot,
  VisuallyHidden,
} from '@relay/design-system/primitives';
import { CapabilityBadge } from '@relay/design-system/patterns';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

import { useComposer } from '../composer-context';
import { PROVIDER_LABEL } from './provider-identity';
import type { TargetRailState, TargetSummary } from '../types';

const STATE_TONE: Readonly<
  Record<TargetRailState, 'neutral' | 'accent' | 'warning' | 'destructive'>
> = {
  inherits: 'neutral',
  override: 'accent',
  issue: 'warning',
  blocked: 'destructive',
  needs_approval: 'accent',
  not_built: 'neutral',
  unsupported: 'neutral',
};

function stateLabel(t: ReturnType<typeof useTranslations>, state: TargetRailState): string {
  switch (state) {
    case 'inherits':
      return t.full('composer.targets.state.inherited');
    case 'override':
      return t.full('composer.targets.state.overridden');
    case 'issue':
      return t.full('composer.targets.state.warning');
    case 'blocked':
      return t.full('composer.targets.state.error');
    case 'needs_approval':
      return t.full('composer.targets.state.approvalNeeded');
    case 'not_built':
      return t.full('composerWeb.rail.state.notBuilt');
    case 'unsupported':
      return t.full('composerWeb.rail.state.unsupported');
  }
}

export function TargetRail(): ReactNode {
  const t = useTranslations();
  const { bootstrap, state, dispatch, summaries, totals } = useComposer();
  const [query, setQuery] = useState('');

  const unselected = useMemo(
    () =>
      bootstrap.accounts.filter(
        (account) =>
          !state.selectedConnectionIds.includes(account.connectionId) &&
          (query.length === 0 ||
            `${account.displayName} ${account.handle ?? ''} ${PROVIDER_LABEL[account.provider]}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      ),
    [bootstrap.accounts, query, state.selectedConnectionIds],
  );

  return (
    <nav aria-label={t.full('composerWeb.pane.targets')} className="flex h-full flex-col gap-5">
      <section aria-labelledby="composer-sets-heading" className="flex flex-col gap-2">
        <h2 id="composer-sets-heading" className="text-label text-text-tertiary">
          {t.full('composerWeb.rail.setsHeading')}
        </h2>
        <p className="text-body-sm text-text-tertiary">{t.full('composerWeb.rail.setsHelp')}</p>
        {bootstrap.sets.length === 0 ? (
          <p className="text-body-sm text-text-tertiary">{t.full('composerWeb.set.none')}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {bootstrap.sets.map((set) => {
              const applied = state.appliedSetId === set.id;
              return (
                <li key={set.id}>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'set/apply', set })}
                    className={cn(
                      'flex min-h-11 w-full items-center justify-between gap-2 rounded-md',
                      'border-border-subtle bg-surface-raised border px-2.5 py-2 text-start',
                      'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                      'hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2',
                      'focus-visible:outline-border-focus',
                      applied && 'border-accent bg-accent-subtle',
                    )}
                  >
                    <span className="min-w-0">
                      <span className="text-body-md text-text-primary block truncate">
                        {set.name}
                      </span>
                      <span className="text-body-sm text-text-tertiary block truncate">
                        {t.full('composerWeb.set.accountCount', {
                          count: set.connectionIds.length,
                        })}
                      </span>
                    </span>
                    {applied ? <Check aria-hidden className="text-accent size-4" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="composer-targets-heading" className="flex min-h-0 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="composer-targets-heading" className="text-label text-text-tertiary">
            {t.full('composerWeb.rail.accountsHeading')}
          </h2>
          <span className="text-label text-text-tertiary tabular-nums">
            {t.full('composer.targets.count', { count: totals.targetCount })}
          </span>
        </div>

        <MasterRow />

        {summaries.length === 0 ? (
          <p className="border-border-default text-body-sm text-text-tertiary rounded-md border border-dashed px-3 py-4">
            {t.full('composerWeb.rail.emptyHelp')}
          </p>
        ) : (
          <ul className="flex flex-col">
            {summaries.map((summary) => (
              <TargetRow key={summary.connectionId} summary={summary} />
            ))}
          </ul>
        )}

        {totals.divergentCount > 0 ? (
          <p className="text-body-sm text-text-secondary">
            {t.full('composer.targets.divergence', { count: totals.divergentCount })}{' '}
            {t.full('composerWeb.rail.divergenceHint')}
          </p>
        ) : null}
      </section>

      <section aria-labelledby="composer-add-heading" className="flex flex-col gap-2">
        <h2 id="composer-add-heading" className="text-label text-text-tertiary">
          {t.full('composer.targets.add')}
        </h2>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label={t.full('composerWeb.rail.searchLabel')}
          placeholder={t.full('composerWeb.rail.searchLabel')}
        />
        <ul className="flex flex-col gap-1">
          {unselected.map((account) => (
            <li key={account.connectionId}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                iconStart={<Plus aria-hidden className="size-4" />}
                onClick={() => dispatch({ type: 'target/add', connectionId: account.connectionId })}
              >
                <span className="truncate">
                  {account.displayName} {account.handle ?? ''}
                </span>
                <span className="text-label text-text-tertiary ms-auto">
                  {PROVIDER_LABEL[account.provider]}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </nav>
  );
}

function MasterRow(): ReactNode {
  const t = useTranslations();
  const { state, dispatch } = useComposer();
  const active = state.activeConnectionId === null;

  return (
    <button
      type="button"
      aria-current={active ? 'true' : undefined}
      onClick={() => dispatch({ type: 'target/open', connectionId: null })}
      className={cn(
        'flex min-h-11 w-full flex-col items-start gap-0.5 rounded-md border px-2.5 py-2 text-start',
        'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
        'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
        active
          ? 'border-accent bg-accent-subtle'
          : 'border-border-subtle bg-surface-raised hover:bg-surface-hover',
      )}
    >
      <span className="text-body-md text-text-primary">
        {t.full('composerWeb.rail.masterEntry')}
      </span>
      <span className="text-body-sm text-text-tertiary">
        {t.full('composerWeb.rail.masterHint')}
      </span>
    </button>
  );
}

function TargetRow({ summary }: { readonly summary: TargetSummary }): ReactNode {
  const t = useTranslations();
  const { state, dispatch } = useComposer();
  const active = state.activeConnectionId === summary.connectionId;
  const label = stateLabel(t, summary.state);
  const overLimit = summary.characterCount > summary.characterLimit;

  return (
    <li className="border-border-subtle border-b last:border-b-0">
      <div className="flex items-stretch gap-1">
        <button
          type="button"
          aria-current={active ? 'true' : undefined}
          onClick={() => dispatch({ type: 'target/open', connectionId: summary.connectionId })}
          className={cn(
            'flex min-h-11 flex-1 flex-col gap-1 rounded-md px-2.5 py-2 text-start',
            'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
            'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:outline-offset-2',
            active ? 'bg-accent-subtle' : 'hover:bg-surface-hover',
          )}
        >
          <VisuallyHidden>
            {t.full('composerWeb.rail.openTarget', {
              account: summary.account.displayName,
            })}
          </VisuallyHidden>

          <span className="flex min-w-0 items-center gap-2">
            <StatusDot tone={STATE_TONE[summary.state]} />
            <span className="text-body-md text-text-primary min-w-0 truncate">
              {summary.account.displayName}
            </span>
            <span className="text-label text-text-tertiary shrink-0">
              {PROVIDER_LABEL[summary.account.provider]}
            </span>
          </span>

          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={cn(
                'text-label tabular-nums',
                overLimit
                  ? 'text-destructive-fg'
                  : summary.characterCount >= summary.characterLimit * 0.9
                    ? 'text-warning-fg'
                    : 'text-text-tertiary',
              )}
            >
              {t.full('composerWeb.rail.counter', {
                used: summary.characterCount,
                limit: summary.characterLimit,
              })}
            </span>
            <span className="text-label text-text-tertiary">
              {t.full('composerWeb.rail.mediaCounter', { count: summary.mediaCount })}
            </span>
            <span
              className={cn(
                'text-label',
                summary.state === 'blocked'
                  ? 'text-destructive-fg'
                  : summary.state === 'issue'
                    ? 'text-warning-fg'
                    : 'text-text-secondary',
              )}
            >
              {label}
            </span>
          </span>

          {summary.state === 'not_built' || summary.state === 'unsupported' ? (
            <CapabilityBadge
              state={summary.state === 'not_built' ? 'not_implemented' : 'unsupported'}
              label={label}
            />
          ) : null}

          {summary.account.paused ? (
            <span className="text-body-sm text-warning-fg">
              {t.full('composerWeb.rail.paused')}
            </span>
          ) : null}
        </button>

        <IconButton
          variant="ghost"
          size="sm"
          label={t.full('composerWeb.rail.removeTarget', { account: summary.account.displayName })}
          className="my-auto"
          icon={<RemoveIcon aria-hidden />}
          onClick={() => dispatch({ type: 'target/remove', connectionId: summary.connectionId })}
        />
      </div>
    </li>
  );
}
