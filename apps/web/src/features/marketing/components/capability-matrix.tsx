import type { ReactNode } from 'react';
import { CapabilityBadge, type CapabilityState } from '@relay/design-system/patterns';
import {
  Table,
  TableBody,
  TableCaption,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  TableCell,
  VisuallyHidden,
} from '@relay/design-system/primitives';
import type { MessageKey } from '@relay/i18n/translate';

import { formatDate, marketingTranslator } from '../i18n';
import {
  CAPABILITY_COLUMNS,
  CONNECTORS,
  capabilityLabelKey,
  type CapabilityColumn,
  type Citation,
} from '../data/connectors';
import { ExternalLink } from './links';
import { Meta } from './layout';

/**
 * The public connector capability matrix.
 *
 * Layout decision: capabilities are the rows and platforms are the columns.
 * Thirteen columns of long state labels would force horizontal scrolling on
 * every screen; eight columns fit a laptop and scroll inside their own
 * container on a phone, and the row header stays the thing you are reading
 * across, which is what a reader of this table is actually doing.
 *
 * A cell never relies on colour: `CapabilityBadge` carries an icon and the
 * state in words. Anything that needs a qualification carries a numbered
 * footnote that links to the note and to the official source it came from,
 * because a tooltip is not a place to keep a fact somebody is deciding on.
 */

interface Footnote {
  readonly index: number;
  readonly noteKey: MessageKey;
  readonly citation?: Citation;
}

function shortStateKey(state: CapabilityState): MessageKey {
  return `web.capabilities.short.${state}` as MessageKey;
}

export function CapabilityMatrix(): ReactNode {
  const t = marketingTranslator();

  /* Footnotes are numbered in reading order, deduplicated by note and source. */
  const footnotes: Footnote[] = [];
  const footnoteIndex = new Map<string, number>();

  const noteFor = (
    noteKey: MessageKey | undefined,
    citation: Citation | undefined,
  ): number | null => {
    if (!noteKey) {
      return null;
    }
    const fingerprint = `${noteKey}|${citation?.url ?? ''}`;
    const existing = footnoteIndex.get(fingerprint);
    if (existing !== undefined) {
      return existing;
    }
    const index = footnotes.length + 1;
    footnoteIndex.set(fingerprint, index);
    footnotes.push(citation ? { index, noteKey, citation } : { index, noteKey });
    return index;
  };

  const rows = CAPABILITY_COLUMNS.map((column: CapabilityColumn) => ({
    column,
    label: t.format(capabilityLabelKey(column)),
    cells: CONNECTORS.map((connector) => {
      const cell = connector.capabilities[column];
      return {
        connectorId: connector.id,
        state: cell.state,
        note: noteFor(cell.noteKey, cell.citation),
      };
    }),
  }));

  return (
    <div className="space-y-8">
      <TableContainer className="relay-scrollbar">
        <Table density="comfortable" className="min-w-[62rem]">
          <TableCaption className="text-start">{t.t('web.capabilities.tableCaption')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[14rem] min-w-[12rem]">
                {t.t('web.label.capability')}
              </TableHead>
              {CONNECTORS.map((connector) => (
                <TableHead key={connector.id} className="min-w-[9.5rem]">
                  {t.format(connector.nameKey)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.column}>
                <TableRowHeader className="text-body-md text-text-primary align-top">
                  {row.label}
                </TableRowHeader>
                {row.cells.map((cell) => (
                  <TableCell key={`${row.column}-${cell.connectorId}`} className="align-top">
                    <span className="flex flex-wrap items-start gap-1">
                      <CapabilityBadge
                        state={cell.state}
                        label={t.format(shortStateKey(cell.state))}
                      />
                      {cell.note ? (
                        <a
                          href={`#capability-note-${cell.note}`}
                          className="text-body-sm text-text-accent focus-visible:outline-border-focus font-mono underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
                        >
                          <VisuallyHidden>
                            {t.t('web.capabilities.noteRef', { number: cell.note })}
                          </VisuallyHidden>
                          <span aria-hidden="true">{cell.note}</span>
                        </a>
                      ) : null}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <section aria-labelledby="capability-notes" className="space-y-4">
        <h3 id="capability-notes" className="text-title-sm text-text-primary">
          {t.t('web.capabilities.notesTitle')}
        </h3>
        <ol className="border-border-default border-t">
          {footnotes.map((footnote) => (
            <li
              key={footnote.index}
              id={`capability-note-${footnote.index}`}
              className="border-border-subtle grid scroll-mt-24 gap-1 border-b py-3 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-4"
            >
              <span
                aria-hidden="true"
                className="text-body-sm text-text-tertiary font-mono tabular-nums"
              >
                {footnote.index}
              </span>
              <div className="min-w-0 space-y-1">
                <p className="text-body-md text-text-secondary max-w-[72ch] leading-[1.6]">
                  {t.format(footnote.noteKey)}
                </p>
                {footnote.citation ? (
                  <p className="text-body-sm">
                    <ExternalLink href={footnote.citation.url}>
                      {t.t('web.label.officialSource')}
                    </ExternalLink>{' '}
                    <Meta>
                      {t.t('web.label.researchDate', {
                        date: formatDate(footnote.citation.readOn),
                      })}
                    </Meta>
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
