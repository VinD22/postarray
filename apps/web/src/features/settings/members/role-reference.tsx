'use client';

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
import { useTranslations } from '@relay/i18n/react';

import { WORKSPACE_ROLES } from '../lib/view-models';

/**
 * What each role actually allows.
 *
 * Both columns are load bearing. A role list that only says what someone can
 * do leaves the reader guessing at the boundary, and the boundary is the whole
 * reason roles exist.
 */
export function RoleReference(): ReactNode {
  const t = useTranslations();

  return (
    <TableContainer className="max-h-[32rem]">
      <Table>
        <TableCaption className="sr-only">
          {t('settings.ui.members.roleReferenceCaption')}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">{t('settings.ui.members.roleColumn.role')}</TableHead>
            <TableHead scope="col">{t('settings.ui.members.roleColumn.can')}</TableHead>
            <TableHead scope="col">{t('settings.ui.members.roleColumn.cannot')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {WORKSPACE_ROLES.map((role) => (
            <TableRow key={role}>
              <TableRowHeader scope="row" className="whitespace-nowrap">
                {t(`settings.role.${role}.label`)}
              </TableRowHeader>
              <TableCell>{t(`settings.role.${role}.description`)}</TableCell>
              <TableCell className="text-text-secondary">
                {t(`settings.ui.members.roleCannot.${role}`)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
