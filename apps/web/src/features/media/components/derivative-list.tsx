'use client';

/**
 * Every version of one file, original first.
 *
 * The original is a row like any other and it is always present, because that
 * is the product claim: an edit adds a version, it never replaces a file. A
 * post can use any row here, so this list is also the selector a campaign
 * variant uses when it wants the square crop rather than the wide original.
 *
 * A version being made has no row. Nothing here stands in for a file that does
 * not exist yet, and nothing renders as zero.
 */

import type { ReactNode } from 'react';
import { Button } from '@relay/design-system/primitives';
import { useTranslations } from '@relay/i18n/react';
import { formatBytes } from '@relay/i18n';

import type { DerivativeView } from '../state/derivatives-api';

export interface DerivativeListProps {
  readonly derivatives: readonly DerivativeView[];
  readonly original: {
    readonly mimeType: string;
    readonly byteSize: number;
    readonly width: number | null;
    readonly height: number | null;
  };
  /** Null means the original is in use. */
  readonly selectedDerivativeId?: string | null;
  readonly onSelect?: (derivativeId: string | null) => void;
  /** True while a version requested a moment ago is still being made. */
  readonly processing?: boolean;
}

export function DerivativeList({
  derivatives,
  original,
  selectedDerivativeId = null,
  onSelect,
  processing = false,
}: DerivativeListProps): ReactNode {
  const t = useTranslations();

  const describe = (entry: {
    width: number | null;
    height: number | null;
    mimeType: string;
    byteSize: number;
  }): string =>
    entry.width === null || entry.height === null
      ? t.full('common.unavailable')
      : t.full('mediaLib.derivative.item', {
          width: entry.width,
          height: entry.height,
          mimeType: entry.mimeType,
          size: formatBytes(t.locale, entry.byteSize),
        });

  return (
    <section aria-labelledby="derivative-list-heading" className="flex flex-col gap-2">
      <h3 id="derivative-list-heading" className="text-title-sm text-text-primary">
        {t.full('mediaLib.derivative.listHeading')}
      </h3>

      <ul className="flex flex-col">
        <li className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-b py-2">
          <span className="flex min-w-0 flex-col">
            <span className="text-body-md text-text-primary">
              {t.full('mediaLib.derivative.original')}
            </span>
            <span className="text-label text-text-tertiary">{describe(original)}</span>
            <span className="text-label text-text-tertiary">
              {t.full('mediaLib.derivative.originalHint')}
            </span>
          </span>
          {onSelect === undefined ? null : selectedDerivativeId === null ? (
            <span className="text-label text-text-secondary">
              {t.full('mediaLib.derivative.selected')}
            </span>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => onSelect(null)}>
              {t.full('mediaLib.derivative.useOriginal')}
            </Button>
          )}
        </li>

        {derivatives.map((derivative) => (
          <li
            key={derivative.id}
            className="border-border-subtle flex flex-wrap items-center justify-between gap-2 border-b py-2 last:border-b-0"
          >
            <span className="flex min-w-0 flex-col">
              <span className="text-body-md text-text-primary">{describe(derivative)}</span>
              <span className="text-label text-text-tertiary">
                {derivative.operations.map((operation) => operation.op).join(', ')}
              </span>
            </span>
            {onSelect === undefined ? null : selectedDerivativeId === derivative.id ? (
              <span className="text-label text-text-secondary">
                {t.full('mediaLib.derivative.selected')}
              </span>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => onSelect(derivative.id)}>
                {t.full('mediaLib.derivative.select')}
              </Button>
            )}
          </li>
        ))}
      </ul>

      {derivatives.length === 0 && !processing ? (
        <p className="text-body-sm text-text-tertiary">{t.full('mediaLib.derivative.empty')}</p>
      ) : null}
      {processing ? (
        <p className="text-body-sm text-text-secondary" role="status">
          {t.full('mediaLib.derivative.processing')}
        </p>
      ) : null}
    </section>
  );
}
