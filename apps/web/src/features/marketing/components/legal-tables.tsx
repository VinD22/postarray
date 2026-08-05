import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@relay/design-system/primitives';

import { marketingTranslator } from '../i18n';
import { RETENTION_SCHEDULE, SUBPROCESSORS } from '../data/catalogs';

/**
 * Two real tables inside the legal suite.
 *
 * A retention schedule and a subprocessor list are the two things a buyer
 * security reviewer opens first, so they are tables with row headers rather
 * than paragraphs, and the region column says the region is being confirmed
 * instead of inventing one.
 */

export function RetentionTable(): ReactNode {
  const t = marketingTranslator();
  return (
    <TableContainer className="relay-scrollbar">
      <Table density="comfortable" className="min-w-[38rem]">
        <TableCaption className="text-start">
          {t.t('web.legal.privacy.retention.title')}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[16rem]">
              {t.t('web.legal.retention.column.data')}
            </TableHead>
            <TableHead className="min-w-[22rem]">
              {t.t('web.legal.retention.column.period')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {RETENTION_SCHEDULE.map((row) => (
            <TableRow key={row.id}>
              <TableRowHeader className="text-body-md text-text-primary align-top">
                {t.format(row.dataKey)}
              </TableRowHeader>
              <TableCell className="text-text-secondary align-top whitespace-normal">
                {t.format(row.periodKey)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function SubprocessorTable(): ReactNode {
  const t = marketingTranslator();
  return (
    <TableContainer className="relay-scrollbar">
      <Table density="comfortable" className="min-w-[52rem]">
        <TableCaption className="text-start">{t.t('web.legal.subprocessors.summary')}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[14rem]">
              {t.t('web.legal.subprocessors.column.name')}
            </TableHead>
            <TableHead className="min-w-[18rem]">
              {t.t('web.legal.subprocessors.column.purpose')}
            </TableHead>
            <TableHead className="min-w-[18rem]">
              {t.t('web.legal.subprocessors.column.data')}
            </TableHead>
            <TableHead className="min-w-[12rem]">
              {t.t('web.legal.subprocessors.column.region')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SUBPROCESSORS.map((entry) => (
            <TableRow key={entry.id}>
              <TableRowHeader className="text-body-md text-text-primary align-top">
                {t.format(entry.nameKey)}
                {entry.vendorPending ? (
                  <span className="text-body-sm text-text-tertiary mt-1 block font-normal">
                    {t.t('web.legal.subprocessors.vendorPending')}
                  </span>
                ) : null}
              </TableRowHeader>
              <TableCell className="text-text-secondary align-top whitespace-normal">
                {t.format(entry.purposeKey)}
              </TableCell>
              <TableCell className="text-text-secondary align-top whitespace-normal">
                {t.format(entry.dataKey)}
              </TableCell>
              <TableCell className="text-text-secondary align-top whitespace-normal">
                {entry.region ?? t.t('web.legal.subprocessors.region.pending')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
