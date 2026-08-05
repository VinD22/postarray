'use client';

/**
 * The capability matrix.
 *
 * This is the screen that stops the product promising what an adapter cannot
 * do. It is generated from the versioned connector snapshots, it says which
 * version it was generated from and when it was read, and it renders four
 * distinct states rather than a tick and a cross:
 *
 *   supported          we built it and it is past the definition of done
 *   not built yet      the provider offers it and we have not shipped it
 *   provider does not  the official API has no such thing
 *   needs review       built, waiting on a platform app review
 *
 * The legend is on the page, not in a tooltip, because the difference between
 * the middle two is the whole point of the table.
 */

import type { ReactNode } from 'react';
import {
  CapabilityBadge,
  Code,
  EmptyState,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
  VisuallyHidden,
} from '@relay/design-system';
import { useTranslations } from '@relay/i18n/react';
import { useCalendarFormat } from '@/features/calendar/format';
import { ProviderMark, useProviderName } from './provider';
import { badgeState } from './capability-matrix';
import type { CapabilityMatrix } from './types';

const LEGEND_STATES = ['supported', 'not_implemented', 'unsupported', 'requires_review'] as const;

export interface CapabilityMatrixViewProps {
  matrix: CapabilityMatrix;
  /** When the matrix is for one account rather than the whole workspace. */
  accountLabel?: string;
}

export function CapabilityMatrixView({
  matrix,
  accountLabel,
}: CapabilityMatrixViewProps): ReactNode {
  const t = useTranslations();
  const format = useCalendarFormat();
  const providerName = useProviderName();

  if (matrix.providers.length === 0) {
    return (
      <EmptyState
        title={t('empty.connections.title')}
        description={t('empty.connections.body')}
        example={t('web.connection.empty.example')}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="max-w-[70ch] text-body-md text-text-secondary">
          {t('capability.matrix.subtitle')}
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-text-tertiary">
          {matrix.capabilityVersion ? (
            <span className="inline-flex items-center gap-1.5">
              {t('web.connection.capability.versionLabel')}
              <Code>{matrix.capabilityVersion}</Code>
            </span>
          ) : null}
          {matrix.observedAt ? (
            <time dateTime={matrix.observedAt}>
              {t('web.connection.capability.observedAt', {
                relativeTime: format.relative(matrix.observedAt),
              })}
            </time>
          ) : null}
          {accountLabel ? (
            <span>{t('web.connection.capability.forAccount', { account: accountLabel })}</span>
          ) : null}
        </p>
      </div>

      {/* Legend. Four sentences, not four colours. */}
      <section
        aria-label={t('web.connection.capability.legendTitle')}
        className="flex flex-col gap-2 rounded-lg border border-border-default bg-surface-sunken p-3"
      >
        <h3 className="text-label text-text-tertiary">
          {t('web.connection.capability.legendTitle')}
        </h3>
        <ul className="flex flex-col gap-2">
          {LEGEND_STATES.map((state) => (
            <li key={state} className="flex flex-wrap items-baseline gap-2">
              <CapabilityBadge state={state} label={t(`capability.level.${state}`)} />
              <span className="max-w-[60ch] text-body-sm text-text-secondary">
                {t(`web.connection.capability.legend.${state}`)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <TableContainer>
        <Table>
          <TableCaption>
            <VisuallyHidden>{t('web.connection.capability.tableLabel')}</VisuallyHidden>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{t('web.connection.capability.featureColumn')}</TableHead>
              {matrix.providers.map((provider) => (
                <TableHead key={provider}>
                  <span className="inline-flex items-center gap-1.5">
                    <ProviderMark provider={provider} />
                    {providerName(provider)}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrix.rows.map((row) => (
              <TableRow key={row.feature}>
                <TableRowHeader className="whitespace-nowrap">
                  {t(`capability.feature.${row.feature}`)}
                </TableRowHeader>
                {row.cells.map((cell) => (
                  <TableCell key={`${row.feature}-${cell.provider}`}>
                    <CapabilityBadge
                      state={badgeState(cell.support)}
                      label={t(`capability.level.${cell.support}`)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
