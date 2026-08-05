'use client';

import { useState, type ReactElement } from 'react';
import { EmptyState } from '@relay/design-system/patterns';
import { Badge, Button } from '@relay/design-system/primitives';
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

      <ul className="border-border-subtle flex flex-col border-t">
        {versions.map((version) => (
          <li
            key={version.version}
            className="border-border-subtle flex flex-col gap-2 border-b py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="flex min-w-0 flex-wrap items-center gap-2">
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

            <span className="flex shrink-0 gap-2">
              {version.isCurrent ? null : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-expanded={comparing === version.version}
                    onClick={() =>
                      setComparing((value) => (value === version.version ? null : version.version))
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
      </ul>

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
