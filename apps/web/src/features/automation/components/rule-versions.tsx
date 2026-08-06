'use client';

import { useState, type ReactElement } from 'react';
import { EmptyState } from '@relay/design-system/patterns';
import { Badge, Button } from '@relay/design-system/primitives';
import { cn } from '@relay/design-system/utils';
import { useTranslations } from '@relay/i18n/react';

import { useValueFormat } from '@/features/analytics/use-value-format';

import type { RuleVersionView } from '../types';

/**
 * Every saved version of a rule, and what changed between them.
 *
 * The comparison is a line diff of the API representation rather than a prose
 * summary, because the API representation is the rule and a prose summary of a
 * rule change is a second thing to keep correct. Restoring creates a new version
 * rather than rewriting history, and it does not turn the rule on.
 */

export interface RuleVersionsProps {
  readonly versions: readonly RuleVersionView[] | undefined;
  readonly onRestore?: (version: RuleVersionView) => void;
}

interface DiffLine {
  readonly key: string;
  readonly operation: 'equal' | 'insert' | 'delete';
  readonly value: string;
}

/**
 * A line comparison of two serialized rules.
 *
 * Deliberately not the design system's `DiffView`: that component is the accept
 * or reject surface for an AI suggestion and carries two decision buttons. A
 * version comparison is a read, and offering "accept" next to it would imply
 * this diff can be applied, which it cannot.
 */
function toLines(from: string, to: string): readonly DiffLine[] {
  const fromLines = from.split('\n');
  const toLines = to.split('\n');
  const length = Math.max(fromLines.length, toLines.length);
  const lines: DiffLine[] = [];

  for (let index = 0; index < length; index += 1) {
    const before = fromLines[index];
    const after = toLines[index];
    if (before === after) {
      if (before !== undefined) {
        lines.push({ key: `e${index}`, operation: 'equal', value: before });
      }
      continue;
    }
    if (before !== undefined) {
      lines.push({ key: `d${index}`, operation: 'delete', value: before });
    }
    if (after !== undefined) {
      lines.push({ key: `i${index}`, operation: 'insert', value: after });
    }
  }

  return lines;
}

export function RuleVersions({ versions, onRestore }: RuleVersionsProps): ReactElement {
  const t = useTranslations();
  const format = useValueFormat();
  const [comparing, setComparing] = useState<number | null>(null);

  if (!versions || versions.length === 0) {
    return (
      <EmptyState
        compact
        title={t('automation.rules.versionHistory')}
        description={t('automation.rules.runs.empty')}
      />
    );
  }

  const current = versions.find((version) => version.isCurrent) ?? versions[0];
  const selected = versions.find((version) => version.version === comparing) ?? null;

  return (
    <section aria-labelledby="versions-heading" className="flex flex-col gap-3">
      <h2 id="versions-heading" className="text-title-sm text-text-primary">
        {t('automation.rules.versionHistory')}
      </h2>

      {/*
        A vertical timeline: the ink line is one continuous element behind the
        list rather than per-row borders, and each version gets its own node
        on it — the current version's node is filled, every earlier one is
        hollow. `start-*`/`ps-*` only, so the line and its nodes mirror
        correctly under `dir="rtl"` with no separate rule.
      */}
      <div className="relative ps-5">
        <span aria-hidden="true" className="border-border-bold absolute inset-y-0 start-[3px] border-s-2" />
        <ol className="flex flex-col">
          {versions.map((version) => (
            <li
              key={version.version}
              className="border-border-subtle relative flex flex-col gap-2 border-b py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'border-border-bold absolute start-[-5px] top-[1.15rem] size-2.5 rounded-full border-2',
                  version.isCurrent ? 'bg-accent' : 'bg-surface-canvas',
                )}
              />
              <span className="ps-3 flex min-w-0 flex-wrap items-center gap-2">
                <span className="text-body-md text-text-primary tabular-nums">
                  {`v${version.version}`}
                </span>
                {version.isCurrent ? (
                  <Badge tone="accent">{t('automation.versions.current')}</Badge>
                ) : null}
                <span className="text-body-sm text-text-secondary">
                  {t('automation.versions.savedBy', {
                    actor: version.savedByName,
                    date: format.dateTime(version.savedAt),
                  })}
                </span>
              </span>

              <span className="ps-3 flex shrink-0 gap-2 sm:ps-0">
                {version.isCurrent ? null : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-expanded={comparing === version.version}
                      onClick={() =>
                        setComparing((value) =>
                          value === version.version ? null : version.version,
                        )
                      }
                    >
                      {t('automation.versions.compare')}
                    </Button>
                    {onRestore ? (
                      <Button size="sm" variant="secondary" onClick={() => onRestore(version)}>
                        {t('automation.versions.restore')}
                      </Button>
                    ) : null}
                  </>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {selected && current ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-body-md text-text-primary font-medium">
            {t('automation.versions.diffTitle', {
              from: selected.version,
              to: current.version,
            })}
          </h3>
          <div className="border-border-subtle bg-surface-sunken overflow-x-auto border">
            <ol className="text-mono min-w-max font-mono">
              {toLines(selected.json, current.json).map((line) => (
                <li
                  key={line.key}
                  className={
                    line.operation === 'insert'
                      ? 'bg-success-bg text-success-fg'
                      : line.operation === 'delete'
                        ? 'bg-destructive-bg text-destructive-fg'
                        : 'text-text-secondary'
                  }
                >
                  <span className="sr-only">
                    {line.operation === 'insert'
                      ? t('action.add')
                      : line.operation === 'delete'
                        ? t('action.remove')
                        : ''}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-text-tertiary inline-block w-4 ps-2 select-none"
                  >
                    {line.operation === 'insert' ? '+' : line.operation === 'delete' ? '-' : ' '}
                  </span>
                  <span className="pe-3 whitespace-pre">{line.value}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-body-sm text-text-tertiary max-w-[70ch]">
            {t('automation.versions.restoreConfirm')}
          </p>
        </div>
      ) : null}
    </section>
  );
}
