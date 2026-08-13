'use client';

/**
 * The validation panel.
 *
 * One list, grouped by account, blocking issues first. Every row is a sentence
 * that names the account and the actual number, and clicking it opens that
 * target so the fix is one keystroke away. The panel also carries the "next
 * issue" cursor used by the keyboard shortcut.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AlertTriangle, CircleAlert, CircleCheck, Info } from 'lucide-react';
import { useTranslations } from '@relay/i18n/react';
import { cn } from '@relay/design-system/utils';
import type { ValidationIssue } from '@relay/contracts';

import { StaggerList } from '@/components/motion';
import { useMotionOk } from '@/lib/motion/use-motion-ok';
import { useComposer } from '../composer-context';
import { PROVIDER_LABEL } from './provider-identity';

/** A key stable across renders as long as the same issue is still open. */
function issueKey(connectionId: string, issue: ValidationIssue): string {
  return `${connectionId}-${issue.code}-${issue.field ?? ''}`;
}

interface ResolvingIssue {
  readonly key: string;
  readonly severity: ValidationIssue['severity'];
  readonly text: string;
}

/** How long a resolved row stays on screen, strike-through then collapsed. */
const RESOLVE_COLLAPSE_MS = 200;

export interface ValidationPanelProps {
  /** Index into the flattened issue list, driven by the keyboard shortcut. */
  readonly focusedIssueIndex: number | null;
}

export function ValidationPanel({ focusedIssueIndex }: ValidationPanelProps): ReactNode {
  const t = useTranslations();
  const { summaries, totals, dispatch } = useComposer();
  const motionOk = useMotionOk();
  let cursor = -1;

  const activeIssues = useMemo(
    () =>
      summaries.flatMap((summary) =>
        summary.issues.map((issue) => ({
          key: issueKey(summary.connectionId, issue),
          connectionId: summary.connectionId,
          issue,
          account: summary.account,
        })),
      ),
    [summaries],
  );

  // Every issue that just left `activeIssues` gets one more render as a
  // struck-through, collapsing ghost row instead of vanishing outright. The
  // diff runs off a joined-keys signature — not `activeIssues` itself, and
  // not on every render — because issues recompute on every keystroke
  // (a character count crossing a limit changes them) and this effect must
  // only do work when the actual set of open issues changes, never on the
  // keystroke path itself.
  const [resolving, setResolving] = useState<readonly ResolvingIssue[]>([]);
  const previousActiveRef = useRef<Map<string, ResolvingIssue>>(new Map());
  const activeSignature = activeIssues.map((entry) => entry.key).join('|');

  useEffect(() => {
    const currentMap = new Map<string, ResolvingIssue>();
    for (const entry of activeIssues) {
      currentMap.set(entry.key, {
        key: entry.key,
        severity: entry.issue.severity,
        text: t(entry.issue.messageKey, {
          ...entry.issue.params,
          provider: PROVIDER_LABEL[entry.account.provider],
          account: entry.account.handle ?? entry.account.displayName,
        }),
      });
    }

    const justResolved = [...previousActiveRef.current.values()].filter(
      (entry) => !currentMap.has(entry.key),
    );
    previousActiveRef.current = currentMap;

    if (justResolved.length === 0 || !motionOk) {
      return;
    }

    setResolving((current) => [...current, ...justResolved]);
    const timer = window.setTimeout(() => {
      setResolving((current) =>
        current.filter((entry) => !justResolved.some((resolved) => resolved.key === entry.key)),
      );
    }, RESOLVE_COLLAPSE_MS);
    return () => window.clearTimeout(timer);
    // Deliberately scoped to the signature of *which* issues are open, not
    // every value read inside — see the comment above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSignature]);

  const isClean = totals.issueCount === 0 && resolving.length === 0;

  return (
    <section aria-labelledby="composer-validation-heading" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 id="composer-validation-heading" className="text-title-sm text-text-primary">
          {t.full('composer.validation.title')}
        </h3>
        <span className="text-label text-text-tertiary tabular-nums">
          {t.full('composer.validation.issueCount', {
            count: totals.issueCount,
            targets: totals.targetCount,
          })}
        </span>
      </div>

      {isClean ? (
        <p className="text-body-sm text-text-secondary flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              'text-success-fg inline-flex',
              motionOk && 'relay-icon-draw motion-reduce:animate-none',
            )}
          >
            <CircleCheck className="size-4" strokeWidth={2} />
          </span>
          {t.full('composerWeb.validation.clear.v2')}
        </p>
      ) : (
        <StaggerList selector="[data-stagger-item]" stagger={0.03} y={8}>
          <ul className="flex flex-col">
            {activeIssues.map(({ key, issue, account, connectionId }) => {
              cursor += 1;
              const focused = cursor === focusedIssueIndex;
              return (
                <li key={key} data-stagger-item>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'target/open', connectionId })}
                    className={cn(
                      'flex min-h-11 w-full items-start gap-2 rounded-md px-2 py-2 text-start',
                      'border-border-subtle border-b',
                      'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]',
                      'hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2',
                      'focus-visible:outline-border-focus',
                      focused && 'bg-accent-subtle',
                    )}
                  >
                    <SeverityIcon severity={issue.severity} draw={motionOk} />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-label text-text-tertiary">{account.displayName}</span>
                      <span className="text-body-sm text-text-primary">
                        {t(issue.messageKey, {
                          ...issue.params,
                          provider: PROVIDER_LABEL[account.provider],
                          account: account.handle ?? account.displayName,
                        })}
                      </span>
                      <span
                        className={cn(
                          'text-label',
                          issue.severity === 'error' ? 'text-destructive-fg' : 'text-warning-fg',
                        )}
                      >
                        {issue.severity === 'error'
                          ? t.full('composer.validation.blocking')
                          : t.full('composer.validation.warning')}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}

            {resolving.map((entry) => (
              <ResolvingIssueRow key={entry.key} entry={entry} />
            ))}
          </ul>
        </StaggerList>
      )}
    </section>
  );
}

function SeverityIcon({
  severity,
  draw = false,
}: {
  readonly severity: ValidationIssue['severity'];
  /** Plays the icon's stroke draw-in once, on mount. Off for ghost rows. */
  readonly draw?: boolean;
}): ReactNode {
  const drawClass = draw && 'relay-icon-draw motion-reduce:animate-none';
  if (severity === 'error') {
    return (
      <CircleAlert
        aria-hidden
        className={cn('text-destructive-fg mt-0.5 size-4 shrink-0', drawClass)}
      />
    );
  }
  if (severity === 'warning') {
    return (
      <AlertTriangle
        aria-hidden
        className={cn('text-warning-fg mt-0.5 size-4 shrink-0', drawClass)}
      />
    );
  }
  return <Info aria-hidden className={cn('text-info-fg mt-0.5 size-4 shrink-0', drawClass)} />;
}

/**
 * A just-resolved issue: the check ticks in, the sentence strikes through,
 * then the row collapses via the CSS `grid-template-rows` 1fr-to-0fr trick
 * (no JS height measurement). Only ever rendered when `useMotionOk()` was
 * true at the moment the issue resolved — see `ValidationPanel`'s effect — so
 * there is no reduced-motion branch to thread through here.
 *
 * The icon swaps from the severity mark to a check on the way out, drawn in
 * with the shared `relay-icon-draw` stroke animation. That is the whole point
 * of keeping the ghost row at all: watching the warning become a tick is what
 * tells a person their fix landed, and it costs one CSS animation on a row
 * that was about to disappear anyway.
 */
function ResolvingIssueRow({ entry }: { readonly entry: ResolvingIssue }): ReactNode {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCollapsed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <li
      aria-hidden="true"
      data-stagger-item
      className={cn(
        'grid transition-[grid-template-rows,opacity] duration-[var(--duration-slow)] ease-[var(--ease-standard)]',
        collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
      )}
    >
      <span className="overflow-hidden">
        <span className="text-body-sm text-text-tertiary flex min-h-11 items-center gap-2 px-2 py-2 line-through">
          <CircleCheck
            aria-hidden
            className="text-success-fg relay-icon-draw mt-0.5 size-4 shrink-0 motion-reduce:animate-none"
            strokeWidth={2}
          />
          {entry.text}
        </span>
      </span>
    </li>
  );
}
